import * as borrowRequestService from '../../services/borrow-request.service'
import * as emailService from '../../services/email.service'
import { db } from '../../../configs'
import { BORROW_REQUEST_STATUS } from '../../../models/borrow-request'

// Lấy tất cả yêu cầu mượn
export async function getAllBorrowRequests(req, res) {
    const borrowRequests = await borrowRequestService.getAllBorrowRequests(req.query)
    res.json(borrowRequests)
}

// Lấy chi tiết yêu cầu mượn
export async function getBorrowRequestById(req, res) {
    const borrowRequest = await borrowRequestService.getBorrowRequestById(req.params.id)
    res.json(borrowRequest)
}

// Cập nhật trạng thái yêu cầu mượn (APPROVED, REJECTED,...)
export async function updateBorrowRequestStatus(req, res) {
    await db.transaction(async (session) => {
        const updatedRequest = await borrowRequestService.updateBorrowRequestStatus(
            session,
            req.params.id,
            req.body.status
        )
        res.status(200).json(updatedRequest)
    })
}

// Duyệt yêu cầu mượn
export async function approveRequest(req, res) {
    await db.transaction(async (session) => {
        const updatedRequest = await borrowRequestService.updateBorrowRequestStatus(
            session,
            req.params.id,
            BORROW_REQUEST_STATUS.APPROVED
        )

        // Send email notification
        await emailService.sendBorrowRequestApprovedEmail(
            updatedRequest.user,
            updatedRequest
        )

        res.json({
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
            BORROW_REQUEST_STATUS.REJECTED
        )
        res.json({
            message: 'Đã từ chối yêu cầu mượn',
            request: updatedRequest
        })
    })
}
