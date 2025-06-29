const User = require('../Models/users');
const jwt = require('jsonwebtoken');
const sendOtp = require('./utils/sendOTP');
const { authenticator } = require('otplib');
require('dotenv').config();


const JWT_SECRET = process.env.SCERET_KEY;
function generateOTP() {
  return authenticator.generate(authenticator.generateSecret()).slice(0,4);
}

const send_otp = async (req, res) => {
  try {
    const { contact } = req.body;
    let user = await User.findOne({ contact });

    if (!user) 
    {
        const newUser = new User({
            contact
        });

        await newUser.save();
        user = newUser;
    }

    const otp = generateOTP();
    const send = await sendOtp(contact, otp);

    if(send)
    {
        user.otp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // valid 5 min
        await user.save();

        res.json({ message: "OTP sent", userId: user._id });
    }
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verify_otp = async (req , res) => {
    const { contact , otp } = req.body;
    const user = await User.findOne({ contact });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
        return res.status(400).json({ message: "OTP expired" });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.SCERET_KEY, { expiresIn: "1d" });
    res.json({ message: "OTP verified", token });
}

module.exports = { send_otp , verify_otp };