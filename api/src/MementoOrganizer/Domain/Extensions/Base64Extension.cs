using System;

namespace MementoOrganizer.Domain.Extensions;
public static class Base64Extension
{
    public static string ToBase64String(this byte[] byteData)
        => Convert.ToBase64String(byteData);


    public static byte[] FromBase64String(this string str)
        => Convert.FromBase64String(str);

}
