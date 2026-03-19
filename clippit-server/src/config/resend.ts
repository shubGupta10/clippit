import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailSender = process.env.EMAIL_SENDER!

export const sendEmail = async (to: string, subject: string, html: string) => {
    await resend.emails.send({
        from: `Clippit <info@${emailSender}>`,
        to,
        subject,
        html
    })
}