import BorrowRecord from '@/models/borrow-record'
import { startOfMonth, endOfMonth } from 'date-fns'

export async function getTopBorrowedDevices(limit = 10) {
    const startDate = startOfMonth(new Date())
    const endDate = endOfMonth(new Date())

    const topDevices = await BorrowRecord.aggregate([
        {
            $match: {
                borrowDate: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: '$deviceId',
                borrowCount: { $sum: 1 }
            }
        },
        {
            $sort: { borrowCount: -1 }
        },
        {
            $limit: limit
        },
        {
            $lookup: {
                from: 'devices',
                localField: '_id',
                foreignField: '_id',
                as: 'device'
            }
        },
        {
            $unwind: '$device'
        },
        {
            $project: {
                _id: 0,
                deviceId: '$_id',
                deviceName: '$device.name',
                borrowCount: 1
            }
        }
    ])

    return topDevices
}

export async function getOverdueBorrows() {
    const now = new Date()

    return await BorrowRecord.find({
        returnDate: { $lt: now },
        actualReturnDate: null,
        status: 'borrowed'
    })
        .populate('device')
        .populate('user')
}

export async function getDueSoonBorrows(daysThreshold = 3) {
    const now = new Date()
    const threshold = new Date(now.setDate(now.getDate() + daysThreshold))

    return await BorrowRecord.find({
        returnDate: { $lte: threshold, $gt: now },
        actualReturnDate: null,
        status: 'borrowed'
    })
        .populate('device')
        .populate('user')
}
