import Joi from 'joi'
import { AsyncValidate } from '@/utils/classes'
import { Device } from '@/models'

// Schema validation cho tạo thiết bị mới
export const createDevice = Joi.object({
    name: Joi.string()
        .trim()
        .max(100)
        .required()
        .label('Tên thiết bị')
        .custom((value, helpers) =>
            new AsyncValidate(value, async function() {
                const device = await Device.findOne({ name: value })
                return !device ? value : helpers.error('any.exists')
            })
        ),
    description: Joi.string()
        .trim()
        .max(500)
        .allow('')
        .default('')
        .label('Mô tả'),
    quantity: Joi.number()
        .integer()
        .min(1)
        .required()
        .label('Số lượng'),
    status: Joi.string()
        .valid('available', 'unavailable', 'maintenance')
        .default('available')
        .label('Trạng thái'),
    category: Joi.string()
        .trim()
        .max(50)
        .required()
        .label('Danh mục'),
    location: Joi.string()
        .trim()
        .max(100)
        .required()
        .label('Vị trí'),
    imageUrl: Joi.string()
        .trim()
        .uri()
        .allow('')
        .default('')
        .label('Hình ảnh')
})

// Schema validation cho cập nhật thiết bị
export const updateDevice = Joi.object({
    name: Joi.string()
        .trim()
        .max(100)
        .label('Tên thiết bị')
        .custom((value, helpers) =>
            new AsyncValidate(value, async function(req) {
                const device = await Device.findOne({
                    name: value,
                    _id: { $ne: req.params.id }
                })
                return !device ? value : helpers.error('any.exists')
            })
        ),
    description: Joi.string()
        .trim()
        .max(500)
        .allow('')
        .label('Mô tả'),
    quantity: Joi.number()
        .integer()
        .min(1)
        .label('Số lượng'),
    status: Joi.string()
        .valid('available', 'unavailable', 'maintenance')
        .label('Trạng thái'),
    category: Joi.string()
        .trim()
        .max(50)
        .label('Danh mục'),
    location: Joi.string()
        .trim()
        .max(100)
        .label('Vị trí'),
    imageUrl: Joi.string()
        .trim()
        .uri()
        .allow('')
        .label('Hình ảnh')
})

// Schema validation cho mượn thiết bị
export const borrowDevice = Joi.object({
    deviceId: Joi.string()
        .required()
        .label('ID thiết bị')
        .custom((value, helpers) =>
            new AsyncValidate(value, async function() {
                const device = await Device.findOne({
                    _id: value,
                    status: 'available'
                })
                return device ? value : helpers.error('any.invalid')
            })
        ),
    borrowDate: Joi.date()
        .min('now')
        .required()
        .label('Ngày mượn'),
    returnDate: Joi.date()
        .min(Joi.ref('borrowDate'))
        .required()
        .label('Ngày trả'),
    note: Joi.string()
        .trim()
        .max(200)
        .allow('')
        .default('')
        .label('Ghi chú')
})