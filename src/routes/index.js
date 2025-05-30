import authRouter from './auth.router'
import admin from './admin'
import userAuthRouter from './user/auth.router'
import userProfileRouter from './user/profile.route'
import achievementRoute from './user/achievement.route'

function route(app) {
    app.use('/admin', admin)
    app.use('/auth', authRouter)
    app.use('/user/auth', userAuthRouter)
    app.use('/user/profile', userProfileRouter)
    app.use('/api/achievements', achievementRoute)
}

export default route
