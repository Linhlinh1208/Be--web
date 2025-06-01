import * as borrowRequestService from '@/app/services/borrow-request.service'
import { abort } from '@/utils/helpers'

export async function getUserBorrowRequests(req, res) {
    const borrowRequests = await borrowRequestService.getUserBorrowRequests(req.user.id)
    res.status(200).json(borrowRequests)
}

export async function getBorrowRequestById(req, res) {
    const borrowRequest = await borrowRequestService.getBorrowRequestById(req.params.id)
    if (borrowRequest.userId.toString() !== req.user.id) {
        return abort(403, 'Bạn không có quyền truy cập yêu cầu mượn thiết bị này')
    }
    res.status(200).json(borrowRequest)
}

export async function createBorrowRequest(req, res) {
    const borrowRequest = await borrowRequestService.createBorrowRequest({
        ...req.body,
        userId: req.user.id,
    })
    res.status(201).json(borrowRequest)
}

export async function returnDevice(req, res) {
    const borrowRequest = await borrowRequestService.returnDevice(req.params.id, req.user.id)
    res.status(200).json(borrowRequest)
}
