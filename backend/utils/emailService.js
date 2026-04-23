import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
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

// ========== NEW: SEND PASSWORD RESET EMAIL FUNCTION ==========
export const sendPasswordResetEmail = async (userEmail, userName, resetUrl) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4f46e5;">CareerYatra Password Reset</h2>
            <p>Hello <strong>${userName}</strong>,</p>
            <p>You requested a password reset. Click the button below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
                Reset Password
            </a>
            <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
            <p>This link expires in <strong>10 minutes</strong>.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr />
            <p style="color: #666; font-size: 12px;">CareerYatra - Your Career Journey Starts Here</p>
        </div>
    `;
    const mailOptions = {
        from: `"CareerYatra" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: "CareerYatra - Password Reset Request",
        html: html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Password reset email sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.log(`❌ Failed to send password reset email to ${userEmail}:`, error.message);
        return false;
    }
};

export const sendRecruiterRequestEmail = async (companyName, contactPerson, contactEmail, phone, internshipDetails) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4f46e5;">New Internship Post Request</h2>
            <p>A recruiter has submitted a request to post an internship on CareerYatra.</p>
            <hr />
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; color: #666; width: 40%;"><strong>Company Name</strong></td>
                    <td style="padding: 8px 0;">${companyName}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Contact Person</strong></td>
                    <td style="padding: 8px 0;">${contactPerson || "Not provided"}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Email</strong></td>
                    <td style="padding: 8px 0;"><a href="mailto:${contactEmail}">${contactEmail}</a></td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Phone</strong></td>
                    <td style="padding: 8px 0;">${phone || "Not provided"}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #666; vertical-align: top;"><strong>Internship Details</strong></td>
                    <td style="padding: 8px 0;">${internshipDetails}</td>
                </tr>
            </table>
            <hr />
            <p style="color: #666; font-size: 12px;">CareerYatra - Admin Notification</p>
        </div>
    `;

    const mailOptions = {
        from: `"CareerYatra" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,       // sends to your admin inbox
        replyTo: contactEmail,            // admin can reply directly to recruiter
        subject: `📋 New Internship Request – ${companyName}`,
        html: html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Recruiter request email sent from ${contactEmail}`);
        return true;
    } catch (error) {
        console.log(`❌ Failed to send recruiter request email:`, error.message);
        return false;
    }
};
export const sendOtpEmail = async (userEmail, userName, otp) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4f46e5;">CareerYatra - Verify Your Email</h2>
            <p>Hello <strong>${userName}</strong>,</p>
            <p>Use the OTP below to verify your email address:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #4f46e5;">
                    ${otp}
                </span>
            </div>
            <p>This OTP is valid for <strong>2 minutes</strong>.</p>
            <p>If you didn't create an account, ignore this email.</p>
            <hr />
            <p style="color: #666; font-size: 12px;">CareerYatra - Your Career Journey Starts Here</p>
        </div>
    `;
    const mailOptions = {
        from: `"CareerYatra" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: "CareerYatra - Email Verification OTP",
        html
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.log(`❌ OTP failed:`, error.message);
        return false;
    }
};