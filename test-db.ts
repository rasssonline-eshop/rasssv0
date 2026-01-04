import { prisma } from '@/src/lib/prisma'

async function testConnection() {
    try {
        console.log('Testing MongoDB connection...')
        await prisma.$connect()
        console.log('✅ MongoDB connected successfully!')

        // Try to count users
        const count = await prisma.user.count()
        console.log(`Found ${count} users in database`)

        await prisma.$disconnect()
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error)
    }
}

testConnection()
