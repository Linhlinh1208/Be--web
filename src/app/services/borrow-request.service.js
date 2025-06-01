import BorrowRequest, { BORROW_REQUEST_STATUS } from '@/models/borrow-request'
import BorrowRecord, { BORROW_RECORD_STATUS } from '@/models/borrow-record'
import Device from '@/models/device'
import { abort } from '@/utils/helpers'

// Lấy tất cả yêu cầu mượn
export async function getAllBorrowRequests(query = {}) {
    try {
        const borrowRequests = await BorrowRequest.find(query)
            .populate('user')
            .populate('device')
        return borrowRequests
    } catch (error) {
        abort(500, 'Lỗi khi lấy danh sách yêu cầu mượn.')
    }
}

// Lấy yêu cầu mượn theo ID
export async function getBorrowRequestById(id) {
    try {
        const borrowRequest = await BorrowRequest.findById(id)
            .populate('user')
            .populate('device')
        if (!borrowRequest) abort(404, 'Không tìm thấy yêu cầu mượn.')
        return borrowRequest
    } catch (error) {
        abort(500, 'Lỗi khi lấy yêu cầu mượn.')
    }
}

// Lấy danh sách yêu cầu của người dùng
export async function getUserBorrowRequests(userId) {
    try {
        const borrowRequests = await BorrowRequest.find({ userId }).populate('device')
        return borrowRequests
    } catch (error) {
        abort(500, 'Lỗi khi lấy yêu cầu mượn của người dùng.')
    }
}

// Tạo yêu cầu mượn
export async function createBorrowRequest(data) {
    try {
        const device = await Device.findById(data.deviceId)
        if (!device) abort(404, 'Thiết bị không tồn tại.')

        if (device.status !== 'available') {
            abort(400, 'Thiết bị hiện không sẵn sàng.')
        }

        const activeBorrows = await BorrowRecord.countDocuments({
            deviceId: device._id,
            status: BORROW_RECORD_STATUS.BORROWED,
        })

        if (activeBorrows >= device.quantity) {
            abort(400, 'Thiết bị đã được mượn hết.')
        }

        const borrowRequest = await BorrowRequest.create({
            ...data,
            status: BORROW_REQUEST_STATUS.PENDING,
        })

        return borrowRequest
    } catch (error) {
        abort(500, 'Lỗi khi tạo yêu cầu mượn.')
    }
}

// Cập nhật trạng thái yêu cầu mượn
export async function updateBorrowRequestStatus(session, id, status) {
    try {
        const borrowRequest = await BorrowRequest.findById(id).session(session)
        if (!borrowRequest) abort(404, 'Yêu cầu mượn không tồn tại.')

        if (!borrowRequest.canBeApproved() && status === BORROW_REQUEST_STATUS.APPROVED) {
            abort(400, 'Yêu cầu không thể được duyệt.')
        }

        if (!borrowRequest.canBeRejected() && status === BORROW_REQUEST_STATUS.REJECTED) {
            abort(400, 'Yêu cầu không thể bị từ chối.')
        }

        borrowRequest.status = status
        await borrowRequest.save({ session })

        if (status === BORROW_REQUEST_STATUS.APPROVED) {
            await BorrowRecord.create([{
                borrowRequestId: borrowRequest._id,
                userId: borrowRequest.userId,
                deviceId: borrowRequest.deviceId,
                borrowDate: borrowRequest.borrowDate,
                returnDate: borrowRequest.returnDate,
                status: BORROW_RECORD_STATUS.BORROWED,
            }], { session })
        }

        return borrowRequest
    } catch (error) {
        abort(500, 'Lỗi khi cập nhật trạng thái yêu cầu mượn.')
    }
}

// Trả thiết bị
export async function returnDevice(id, userId) {
    try {
        const borrowRequest = await BorrowRequest.findById(id)
        if (!borrowRequest) abort(404, 'Yêu cầu mượn không tồn tại.')

        if (borrowRequest.userId.toString() !== userId) {
            abort(403, 'Bạn không có quyền trả thiết bị này.')
        }

        if (borrowRequest.status !== BORROW_REQUEST_STATUS.APPROVED) {
            abort(400, 'Yêu cầu mượn chưa được duyệt.')
        }

        const borrowRecord = await BorrowRecord.findOne({
            borrowRequestId: borrowRequest._id,
            status: BORROW_RECORD_STATUS.BORROWED,
        })

        if (!borrowRecord) {
            abort(400, 'Không tìm thấy lịch sử mượn đang hoạt động.')
        }

        borrowRecord.status = BORROW_RECORD_STATUS.RETURNED
        borrowRecord.actualReturnDate = new Date()
        await borrowRecord.save()

        return borrowRequest
    } catch (error) {
        abort(500, 'Lỗi khi trả thiết bị.')
    }
}
