import { Router } from 'express'
import authRouter from './auth.router'
import profileRouter from './profile.route'
import deviceRouter from './device.router'

const userRouter = Router()

userRouter.use('/auth', authRouter)
userRouter.use('/profile', profileRouter)
userRouter.use('/devices', deviceRouter)

export default userRouter
