import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
    "Fragrances",
    "Makeup",
    "Baby Care & Diapers",
    "Vitamins",
    "Skin Care",
    "Baby Accessories",
    "Hair Care",
    "Personal Care",
    "Infant Milk Powder",
    "Cereals",
    "Balm",
    "Medicines",
    "Hair removing spray"
]

const comingSoon = [
    "Acne cream",
    "Acne scar cream",
    "Acne serum",
    "Acne face wash",
    "Acne soap",
    "Skin beauty cream",
    "Skin moisturizer lotion",
    "Moisturizer soap",
    "Whitening serum",
    "Whitening cream",
    "Whitening face wash",
    "Whitening soap",
    "Sun block lotion spf 60",
    "Sun block lotion spf 100",
    "Scabies lotion",
    "Scabies soap",
    "Charcoal face wash",
    "Facial products",
    "Hair serum",
    "Hair oil",
    "Hair shampoo",
    "Hair shampoo plus conditioner",
    "Slimming Tea"
]

async function main() {
    console.log("Seeding categories...")

    // Seed Active Categories
    for (const name of categories) {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        await prisma.category.upsert({
            where: { name }, // Name is unique
            update: {},
            create: { name, slug, comingSoon: false }
        })
        console.log(`Upserted: ${name}`)
    }

    // Seed Coming Soon Categories
    for (const name of comingSoon) {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name, slug, comingSoon: true }
        })
        console.log(`Upserted (Coming Soon): ${name}`)
    }

    console.log("Seeding complete.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
