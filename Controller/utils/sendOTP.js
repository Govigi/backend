const axios = require("axios");
require("dotenv").config();

async function sendOtp(mobile, otp) {
  const { TWO_FACTOR_API_KEY, TWO_FACTOR_TEMPLATE_NAME } = process.env;

  try {
    console.log('mobile ',mobile)
    const url = `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/${mobile}/${otp}/${TWO_FACTOR_TEMPLATE_NAME}`;
    const res = await axios.get(url);
    console.log("2Factor SMS API Response:", res.data);
    return res.data;
  } catch (err) {
    console.error("2Factor Error:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = sendOtp;
