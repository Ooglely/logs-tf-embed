const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig

module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://github.com/Ooglely/logs-tf-embed',
        permanent: true,
      },
    ]
  },
}