import * as borrowRequestService from '../../services/borrow-request.service'
import * as emailService from '../../services/email.service'
import { db } from '../../../configs'

// Lấy tất cả yêu cầu mượn
export async function getAllBorrowRequests(req, res) {
    const borrowRequests = await borrowRequestService.getAllBorrowRequests(req.query)
    res.jsonify(borrowRequests)
}

// Lấy chi tiết yêu cầu mượn
export async function getBorrowRequestById(req, res) {
    const borrowRequest = await borrowRequestService.getBorrowRequestById(req.params.id)
    res.jsonify(borrowRequest)
}

// Cập nhật trạng thái yêu cầu mượn (APPROVED, REJECTED,...)
export async function updateBorrowRequestStatus(req, res) {
    await db.transaction(async (session) => {
        const updatedRequest = await borrowRequestService.updateBorrowRequestStatus(
            session,
            req.params.id,
            req.body.status
        )
        res.status(200).jsonify(updatedRequest)
    })
}

// Duyệt yêu cầu mượn
export async function approveRequest(req, res) {
    await db.transaction(async (session) => {
        const updatedRequest = await borrowRequestService.updateBorrowRequestStatus(
            session,
            req.params.id,
            'APPROVED'
        )

        // Send email notification
        await emailService.sendBorrowRequestApprovedEmail(
            updatedRequest.user,
            updatedRequest
        )

        res.jsonify({
            message: 'Đã duyệt yêu cầu mượn',
            request: updatedRequest
        })
    })
}

// Từ chối yêu cầu mượn
export async function rejectRequest(req, res) {
    await db.transaction(async (session) => {
        const updatedRequest = await borrowRequestService.updateBorrowRequestStatus(
            session,
            req.params.id,
            'REJECTED'
        )
        res.jsonify({
            message: 'Đã từ chối yêu cầu mượn',
            request: updatedRequest
        })
    })
}
