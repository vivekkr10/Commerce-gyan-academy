import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendOTPEmail = async (toEmail, otp) => {
  try {
    const result = await tranEmailApi.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME,
      },
      
      to: [{ email: toEmail }], 
      subject: "Your OTP Code",
      htmlContent: `<h3>Your OTP is: ${otp}</h3>`,
    });

    console.log("EMAIL SENT:", result);
  } catch (err) {
    console.error("BREVO ERROR FULL:", err.response?.body || err.message);
    throw new Error("Email sending failed");
  }
};