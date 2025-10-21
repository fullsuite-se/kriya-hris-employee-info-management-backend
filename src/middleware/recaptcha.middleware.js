const axios = require("axios");

const recaptcha = async (req, res, next) => {
  const { recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({
      message: "reCAPTCHA token is required.",
      isSuccess: false,
      isHuman: false,
    });
  }

  try {
    const response = await axios.post(
      process.env.GOOGLE_RECAPTCHA_API_URL,
      new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: recaptchaToken,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const data = response.data;

    if (!data.success) {
      return res.status(400).json({
        message:
          "reCAPTCHA verification failed. Please refresh and try again.",
        isSuccess: false,
        isHuman: false,
      });
    }

    if (data.score !== undefined && data.score < 0.7) {
      return res.status(403).json({
        message:
          "Suspicious activity detected. If you're human, please try again.",
        isSuccess: false,
        isHuman: false,
      });
    }

    next();
  } catch (error) {
    console.error("reCAPTCHA verification error:", error.message);
    return res.status(500).json({
      message:
        "An error occurred while verifying reCAPTCHA. Please try again later.",
      isSuccess: false,
      isHuman: false,
      error: true,
    });
  }
};

module.exports = { recaptcha };