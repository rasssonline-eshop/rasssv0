import { prisma } from './src/lib/prisma'
import bcrypt from 'bcryptjs'

async function createAdmin() {
    try {
        console.log('Creating admin user...')

        const hashedPassword = await bcrypt.hash('admin123', 10)

        const admin = await prisma.user.create({
            data: {
                email: 'admin@rasss.com',
                name: 'Admin User',
                password: hashedPassword,
                role: 'admin',
            }
        })

        console.log('✅ Admin user created successfully!')
        console.log('Email:', admin.email)
        console.log('Password: admin123')
        console.log('\nYou can now login at: /admin/auth-secure-2024')

    } catch (error: any) {
        if (error.code === 'P2002') {
            console.log('⚠️ Admin user already exists!')
        } else {
            console.error('❌ Error:', error)
        }
    } finally {
        await prisma.$disconnect()
    }
}

createAdmin()
