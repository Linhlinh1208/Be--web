import { mailTransporter , logger } from '@/configs'
import ejs from 'ejs'
import path from 'path'

const EMAIL_TEMPLATES = {
    BORROW_REQUEST_APPROVED: 'borrow-request-approved',
    BORROW_DUE_REMINDER: 'borrow-due-reminder',
    BORROW_OVERDUE_ALERT: 'borrow-overdue-alert'
}

export async function sendBorrowRequestApprovedEmail(user, borrowRequest) {
    try {
        await sendEmail(
            user.email,
            'Yêu cầu mượn thiết bị đã được duyệt',
            EMAIL_TEMPLATES.BORROW_REQUEST_APPROVED,
            { user, borrowRequest }
        )
    } catch (error) {
        logger.error('Error sending borrow request approved email', error)
    }
}

export async function sendBorrowDueReminderEmail(user, borrowRequest) {
    try {
        await sendEmail(
            user.email,
            'Nhắc nhở: Sắp đến hạn trả thiết bị',
            EMAIL_TEMPLATES.BORROW_DUE_REMINDER,
            { user, borrowRequest }
        )
    } catch (error) {
        logger.error('Error sending borrow due reminder email', error)
    }
}

export async function sendBorrowOverdueAlert(user, borrowRequest) {
    try {
        await sendEmail(
            user.email,
            'Cảnh báo: Thiết bị đã quá hạn trả',
            EMAIL_TEMPLATES.BORROW_OVERDUE_ALERT,
            { user, borrowRequest }
        )
    } catch (error) {
        logger.error('Error sending borrow overdue alert email', error)
    }
}

async function sendEmail(to, subject, template, data) {
    const html = await ejs.renderFile(
        path.join(__dirname, '../../views/emails', template + '.ejs'),
        data
    )

    await new Promise((resolve, reject) => {
        mailTransporter.sendMail(
            {
                to,
                subject,
                html
            },
            (err) => {
                if (err) return reject(err)
                resolve()
            }
        )
    })
}
