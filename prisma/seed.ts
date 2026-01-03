import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@rasss.com' },
        update: {},
        create: {
            email: 'admin@rasss.com',
            name: 'Admin User',
            password: adminPassword,
            role: 'admin',
        },
    })

    console.log('✅ Admin user created:', admin.email)

    // Create test customer
    const customerPassword = await bcrypt.hash('customer123', 10)
    const customer = await prisma.user.upsert({
        where: { email: 'customer@rasss.com' },
        update: {},
        create: {
            email: 'customer@rasss.com',
            name: 'Test Customer',
            password: customerPassword,
            role: 'customer',
        },
    })

    console.log('✅ Customer user created:', customer.email)

    console.log('\n🎉 Seeding completed!')
    console.log('\nTest Credentials:')
    console.log('Admin: admin@rasss.com / admin123')
    console.log('Customer: customer@rasss.com / customer123')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
