import { Router } from 'express'
import { asyncHandler } from '@/utils/helpers'
import * as authMiddleware from '@/app/middleware/admin/auth.middleware'
import * as deviceController from '@/app/controllers/admin/device.controller'

const deviceRouter = Router()

// Kiểm tra token cho tất cả các routes
deviceRouter.use(asyncHandler(authMiddleware.checkValidToken))

// Lấy danh sách thiết bị
deviceRouter.get(
    '/',
    asyncHandler(deviceController.readAllDevices)
)

// Lấy chi tiết thiết bị theo ID
deviceRouter.get(
    '/:id',
    asyncHandler(deviceController.readDeviceById)
)

// Tạo thiết bị mới
deviceRouter.post(
    '/',
    asyncHandler(deviceController.createDevice)
)

// Cập nhật thiết bị
deviceRouter.put(
    '/:id',
    asyncHandler(deviceController.updateDevice)
)

// Xóa thiết bị
deviceRouter.delete(
    '/:id',
    asyncHandler(deviceController.deleteDevice)
)

export default deviceRouter
