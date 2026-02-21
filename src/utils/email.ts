import config from "@src/config";
import logger from "@src/config/winston";
import nodemailer from "nodemailer";

const minutes = (config.OTP_TTL / 60).toFixed(0);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD,
  },
});

export async function sendEmailOtp(email: string, otp: string) {
  try {
    const mailOptions = {
      from: config.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP for verification is ${otp}. This OTP will expire in ${minutes} minutes.`,
      html: `
        <div style="
             font-family: Arial, sans-serif; 
             max-width: 420px; 
             margin: auto; 
             padding: 20px; 
             border: 1px solid #e5e5e5; 
             border-radius: 10px; 
             background: #ffffff;
         box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        ">
             <div style="text-align: center; margin-bottom: 20px;">
                  <h2 style="color: #4A3AFF; margin: 0;">netwooke</h2>
             </div>
   
             <p style="font-size: 16px; color: #333;">
                  Hi,
             </p>
   
             <p style="font-size: 16px; color: #333;">
                  Welcome to <strong>netwooke</strong> 👋  
                  Use the verification code below to complete your sign up:
             </p>
   
             <div style="
                  text-align: center; 
                  margin: 30px 0;
             ">
                  <div style="
                       display: inline-block; 
                       padding: 14px 26px; 
                       font-size: 32px; 
                       letter-spacing: 8px; 
                       font-weight: bold; 
                       background: #F4F4FF; 
                       border-radius: 8px; 
                       color: #4A3AFF;
                       border: 1px solid #e0e0ff;
                  ">
                       ${otp}
                  </div>
             </div>
   
             <p style="font-size: 15px; color: #555;">
                  This code will expire in <strong>${minutes} minutes</strong>.
             </p>
   
             <p style="font-size: 15px; color: #555;">
                  If this wasn’t you, please ignore this email.
             </p>
   
             <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />
   
             <p style="font-size: 14px; color: #888; text-align: center;">
                  Happy Learning 🎉<br/>
                  <strong>Team netwooke</strong>
             </p>
        </div>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error("Failed to send otp email:", error);
  }
}

export async function otpVerifySuccesfullEmail(email: string) {
  const msg = {
    to: email,
    from: `${config.EMAIL_USER}`,
    subject: "Your netwooke Account verification status",
    html: `
          <div style="
               font-family: Arial, sans-serif; 
               max-width: 420px; 
               margin: auto; 
               padding: 20px; 
               border: 1px solid #e5e5e5; 
               border-radius: 10px; 
               background: #ffffff;
           box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          ">
               <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #4A3AFF; margin: 0;">netwooke</h2>
               </div>

               <p style="font-size: 16px; color: #333;">
                    Hi,
               </p>

               <p style="font-size: 16px; color: #333;">
                    Welcome to <strong>netwooke</strong> 👋  
                    Your account has been successfully created.
               </p>

               <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />

               <p style="font-size: 14px; color: #888; text-align: center;">
                    Happy Learning 🎉<br/>
                    <strong>Team netwooke</strong>
               </p>
          </div>`,
  };
  try {
    await transporter.sendMail(msg);
  } catch (error) {
    logger.error("Failed to send otp verify email:", error);
  }
}
