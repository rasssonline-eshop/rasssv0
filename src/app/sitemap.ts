import { MetadataRoute } from 'next'

// Static categories list for sitemap generation
const STATIC_CATEGORIES = [
    'Fragrances',
    'Makeup',
    'Baby Care & Diapers',
    'Vitamins',
    'Skin Care',
    'Baby Accessories',
    'Hair Care',
    'Personal Care',
    'Infant Milk Powder',
    'Cereals',
    'Health Care',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://rasssv0-bvybimt9r-rasss-onlines-projects.vercel.app'

    const routes = [
        '',
        '/flash-sales',
        '/global',
        '/healthcare-center',
        '/e-services',
        '/stores',
        '/search',
        '/cart',
        '/login',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.9,
    }))

    const categoryRoutes = STATIC_CATEGORIES.map((cat) => ({
        url: `${baseUrl}/category/${encodeURIComponent(cat)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [...routes, ...categoryRoutes]
}
