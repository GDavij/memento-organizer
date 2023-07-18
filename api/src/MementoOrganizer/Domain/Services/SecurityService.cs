using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using MementoOrganizer.Domain.Entities;
using MementoOrganizer.Domain.Models.Data;
using MementoOrganizer.Domain.Providers;
using MementoOrganizer.Domain.Repositories;
using MementoOrganizer.Domain.Services.Interfaces;
using JWT.Builder;
using JWT.Algorithms;
using System.Collections.Generic;

namespace MementoOrganizer.Domain.Services;


public class SecurityService : ISecurityService
{
    public async Task<User<TId>?> AuthenticateUser<TId>(Token<TId> token, IUsersRepository<TId> usersRepository)
    {
        User<TId>? userDatabase = await usersRepository.FindUserById(token.Id);
        if (userDatabase == null || !userDatabase.Passphrase.Equals(token.Passphrase))
        {
            return null;
        }
        return userDatabase;
    }

    public async Task<byte[]> EncriptData(string data, string key, string iv)
    {
        UTF8Encoding utf8Encoder = new UTF8Encoding();
        byte[] hashKey = SHA512.Create().ComputeHash(utf8Encoder.GetBytes(key))[..32];
        byte[] hashIv = SHA512.Create().ComputeHash(utf8Encoder.GetBytes(iv))[..16];

        byte[] encripted;
        using (Aes aesAlg = Aes.Create())
        {
            aesAlg.Key = hashKey;
            aesAlg.IV = hashIv;

            ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);
            using (MemoryStream msEncript = new MemoryStream())
            {
                using (CryptoStream csEncrypt = new CryptoStream(msEncript, encryptor, CryptoStreamMode.Write))
                {
                    using (StreamWriter swEncript = new StreamWriter(csEncrypt))
                    {
                        await swEncript.WriteAsync(data);
                    }
                    encripted = msEncript.ToArray();
                }
            }
        }

        return encripted;
    }

    public async Task<string> DecriptData(byte[] encryptedData, string key, string iv)
    {
        UTF8Encoding utf8Encoding = new UTF8Encoding();
        byte[] hashKey = SHA512.Create().ComputeHash(utf8Encoding.GetBytes(key))[..32];
        byte[] hashIv = SHA512.Create().ComputeHash(utf8Encoding.GetBytes(iv))[..16];

        string originalData = String.Empty;
        using (Aes aesAlg = Aes.Create())
        {
            aesAlg.Key = hashKey;
            aesAlg.IV = hashIv;

            ICryptoTransform decriptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
            using (MemoryStream msDecrypt = new MemoryStream(encryptedData))
            {
                using (CryptoStream csDecript = new CryptoStream(msDecrypt, decriptor, CryptoStreamMode.Read))
                {
                    using (StreamReader srDecript = new StreamReader(csDecript))
                    {
                        originalData = await srDecript.ReadToEndAsync();
                    }
                }
            }
        }

        return originalData;
    }

    public string DerivePassphrase(string passphrase, string salt)
    {
        UTF8Encoding utf8Encoder = new UTF8Encoding();
        byte[] passphraseBytes = utf8Encoder.GetBytes(passphrase);
        byte[] hashSaltBytes = SHA256.Create().ComputeHash(utf8Encoder.GetBytes(salt));

        byte[] bytesDerivation = new Rfc2898DeriveBytes(passphraseBytes, hashSaltBytes, 210_000, HashAlgorithmName.SHA512)
                                    .GetBytes(512);//? Maybe get 256 Bytes for Use Less Database Storage;

        return Convert.ToBase64String(bytesDerivation);
    }

    public string DerivePassphrase(byte[] passphrase, string salt)
    {
        UTF8Encoding utf8Encoder = new UTF8Encoding();
        byte[] hashSaltBytes = SHA256.Create().ComputeHash(utf8Encoder.GetBytes(salt));

        byte[] bytesDerivation = new Rfc2898DeriveBytes(passphrase, hashSaltBytes, 210_000, HashAlgorithmName.SHA512)
                                    .GetBytes(512);//? Maybe get 256 Bytes for Use Less Database Storage;

        return Convert.ToBase64String(bytesDerivation);
    }

    public string GenerateToken<TId>(TId id, string passphrase)
    {
        string token = JwtBuilder.Create()
                        .WithAlgorithm(new NoneAlgorithm())//TODO: (Future Improvement) Use a Secure Algorithm to Validate Tokens
                        .AddClaim("exp", DateTime.UtcNow.AddHours(6).Ticks.ToString())
                        .AddClaim("id", id!.ToString())
                        .AddClaim("passphrase", passphrase)
                        .Encode();
        return token;
    }

    public Token<TId>? TryParseToken<TId>(string? token, IIdentityProvider<TId> identityProvider)
    {
        try
        {
            IDictionary<string, string> payload = JwtBuilder.Create()
                                .WithAlgorithm(new NoneAlgorithm())//TODO: (Future Improvement) Use a Secure Algorithm to Validate Tokens
                                .Decode<IDictionary<string, string>>(token);

            if (!payload.ContainsKey("exp") || !payload.ContainsKey("id") || !payload.ContainsKey("passphrase"))
            {
                return null;
            }

            long timeLimit = long.Parse(payload["exp"]);
            if (DateTime.UtcNow.Ticks - timeLimit >= 0.0)
            {
                return null;
            }

            TId id = identityProvider.ParseIdFromString(payload["id"]);
            return new Token<TId>(id, payload["passphrase"]);

        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            return null;
        }
    }


}
