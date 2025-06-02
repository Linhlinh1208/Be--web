import User from '../models/user'
import { hash } from '@/app/utils/helpers'
import { logger } from '../configs'

export default async function seed(session) {
    try {
        // Xóa dữ liệu cũ
        await User.deleteMany({}).session(session)

        // Tạo dữ liệu mẫu
        const users = [
            {
                name: 'Nguyễn Văn A',
                email: 'nguyenvana@ptit.edu.vn',
                password: await hash('password123'),
                studentId: 'B19DCCN001',
                phoneNumber: '0901234567',
                class: 'D19CQCN01',
                department: 'CNTT'
            },
            {
                name: 'Trần Thị B',
                email: 'tranthib@ptit.edu.vn',
                password: await hash('password123'),
                studentId: 'B19DCCN002',
                phoneNumber: '0901234568',
                class: 'D19CQCN02',
                department: 'CNTT'
            },
            {
                name: 'Lê Văn C',
                email: 'levanc@ptit.edu.vn',
                password: await hash('password123'),
                studentId: 'B19DCCN003',
                phoneNumber: '0901234569',
                class: 'D19CQCN01',
                department: 'CNTT'
            }
        ]

        await User.insertMany(users, { session })
        logger.info('✅ Users seeded successfully')
    } catch (error) {
        logger.error('Error seeding users:', error)
        throw error
    }
}
