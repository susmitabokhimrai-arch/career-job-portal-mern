import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify connection on startup
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ Email connection error:", error.message);
    } else {
        console.log("✅ Email server ready to send messages");
    }
});

export const sendStatusUpdateEmail = async (userEmail, userName, jobTitle, companyName, status, applicationDate) => {
    
    const emailTemplates = {
        selected: {
            subject: `🎉 Congratulations! You've been SELECTED for ${jobTitle}!`,
            html: `<h2>Dear ${userName},</h2>
                   <p>Great news! You have been <strong>SELECTED</strong> for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
                   <p>The HR team will contact you soon with the offer details.</p>
                   <a href="http://localhost:5173/profile">View Application Status</a>`
        },
        interview: {
            subject: `📅 Interview Scheduled for ${jobTitle}`,
            html: `<h2>Dear ${userName},</h2>
                   <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been shortlisted for an <strong>INTERVIEW</strong>.</p>
                   <p>Our team will contact you with scheduling details.</p>
                   <a href="http://localhost:5173/profile">View Application Status</a>`
        },
        shortlisted: {
            subject: `✨ You've been Shortlisted for ${jobTitle}!`,
            html: `<h2>Dear ${userName},</h2>
                   <p>Congratulations! You have been <strong>SHORTLISTED</strong> for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
                   <p>We will contact you soon for the next steps.</p>
                   <a href="http://localhost:5173/profile">View Application Status</a>`
        },
        rejected: {
            subject: `Update on your application for ${jobTitle}`,
            html: `<h2>Dear ${userName},</h2>
                   <p>Thank you for your interest in <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
                   <p>After careful review, we have decided to move forward with other candidates.</p>
                   <a href="http://localhost:5173/jobs">Browse More Jobs</a>`
        },
        applied: {
            subject: `✅ Application Received: ${jobTitle}`,
            html: `<h2>Dear ${userName},</h2>
                   <p>Thank you for applying for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
                   <p>We have received your application and will review it soon.</p>
                   <a href="http://localhost:5173/profile">Track Your Application</a>`
        }
    };

    const template = emailTemplates[status] || emailTemplates.applied;

    const mailOptions = {
        from: `"CareerYatra" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: template.subject,
        html: template.html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${userEmail} for status: ${status}`);
        return true;
    } catch (error) {
        console.log(`❌ Failed to send email to ${userEmail}:`, error.message);
        return false;
    }
};