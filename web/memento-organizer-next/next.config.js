/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env["mementoOrganizerApiUrl"],
  },
};

module.exports = nextConfig;
