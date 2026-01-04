import { MetadataRoute } from 'next'

async function getCategories() {
    // In production, we should robustly fetch this. 
    // For static generation, we might need to use absolute URL or data fetching method suitable for Server Components.
    // We'll fallback to a basic list if fetch fails during build time.
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/store`, {
            next: { revalidate: 3600 }
        })
        if (!res.ok) return []
        const data = await res.json()
        return data.categories || []
    } catch (e) {
        return []
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const categories = await getCategories()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rasss.com'

    const routes = [
        '',
        '/flash-sales',
        '/global',
        '/healthcare-center',
        '/e-services',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }))

    const categoryRoutes = categories.map((cat: any) => ({
        url: `${baseUrl}/category/${encodeURIComponent(cat.name)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [...routes, ...categoryRoutes]
}
