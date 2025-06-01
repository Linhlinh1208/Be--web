import {Router} from 'express'
import authRouter from './auth.router'
import roleRouter from './role.router'
import deviceRouter from './device.router'
import borrowRequestRouter from './borrow-request.router'

const admin = Router()

admin.use('/auth', authRouter)
admin.use('/roles', roleRouter)
admin.use('/devices', deviceRouter)
admin.use('/borrow-requests', borrowRequestRouter)

export default admin
