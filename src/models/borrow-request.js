import createModel, { ObjectId } from './base'

const BORROW_REQUEST_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled'
}

const BorrowRequest = createModel(
    'BorrowRequest',
    'borrow_requests',
    {
        userId: {
            type: ObjectId,
            ref: 'User',
            required: true
        },
        deviceId: {
            type: ObjectId,
            ref: 'Device',
            required: true
        },
        borrowDate: {
            type: Date,
            required: true
        },
        returnDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(BORROW_REQUEST_STATUS),
            default: BORROW_REQUEST_STATUS.PENDING
        },
        note: {
            type: String,
            default: '',
            trim: true
        }
    },
    {
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                return ret
            }
        },
        virtuals: {
            user: {
                options: {
                    ref: 'User',
                    localField: 'userId',
                    foreignField: '_id'
                }
            },
            device: {
                options: {
                    ref: 'Device',
                    localField: 'deviceId',
                    foreignField: '_id'
                }
            }
        }
    }
)

export { BORROW_REQUEST_STATUS }
export default BorrowRequest
