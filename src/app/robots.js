export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      'https://actioncardetailing.ca/sitemap.xml',
      'https://actioncardetailing.ca/geo-sitemap.xml',
    ],
  }
}
