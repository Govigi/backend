import Customer from "../Models/customer.js";
import jwt from "jsonwebtoken";
import sendOtp from "./utils/sendOTP.js";
import Otp from "../Models/OtpSchema.js";
import dotenv from 'dotenv';
import crypto from 'crypto';
import TempCustomer from "../Models/TempCustomer.js";
import Address from "../Models/Address.js";
dotenv.config();

const JWT_SECRET = process.env.SCERET_KEY;

function generateOTP() {
  return crypto.randomInt(1000, 9999).toString();
}

function hashOTP(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

const send_otp = async (req, res) => {
  try {
    const { contact } = req.body;

    if (!contact) {
      return res.status(400).json({ message: "Contact required" });
    }

    let customer = await Customer.findOne({ customerPhone: contact });
    let tempCustomer = null;

    if (!customer) {
      tempCustomer = await TempCustomer.findOne({ mobileNumber: contact });

      if (!tempCustomer) {
        tempCustomer = await TempCustomer.create({ mobileNumber: contact });
      }
    }

    const isTestNumber = contact === '9999999999';
    const otp = isTestNumber ? '1234' : generateOTP();
    const hashed = hashOTP(otp);

    await Otp.deleteMany({ mobileNumber: contact });

    await Otp.create({
      customerId: customer ? customer._id : null,
      mobileNumber: contact,
      otp: hashed
    });

    if (!isTestNumber) {
      await sendOtp(contact, otp);
    }
    console.log("OTP:", otp);

    res.json({
      message: "OTP sent successfully",
      isCustomer: !!customer,
      userId: customer ? customer._id : tempCustomer._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verify_otp = async (req, res) => {
  try {
    const { contact, otp } = req.body;

    if (!contact || !otp) {
      return res.status(400).json({ message: "Contact and OTP required" });
    }

    const hashed = hashOTP(otp);

    const otpRecord = await Otp.findOne({ mobileNumber: contact });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (otpRecord.otp !== hashed) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    await Otp.deleteMany({ mobileNumber: contact });

    const customer = await Customer.findOne({ customerPhone: contact });

    if (customer) {
      const token = jwt.sign(
        {
          customerId: customer._id,
          contact: customer.customerPhone,
          role: "customer",
          customerStatus: customer.customerStatus
        },
        JWT_SECRET,
        { expiresIn: "14d" }
      );

      return res.json({
        message: "OTP verified",
        token,
        isCustomer: true,
        isNew: false
      });

    }

    let tempCustomer = await TempCustomer.findOne({ mobileNumber: contact });

    if (!tempCustomer) {
      tempCustomer = await TempCustomer.create({ mobileNumber: contact });
    }

    const token = jwt.sign(
      {
        tempCustomerId: tempCustomer._id,
        contact: tempCustomer.mobileNumber,
        role: "tempCustomer"
      },
      JWT_SECRET,
      { expiresIn: "14d" }
    );

    return res.json({
      message: "OTP verified",
      token,
      isCustomer: false,
      needRegistration: true
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

const completeProfile = async (req, res) => {
  try {
    const {
      token,
      customerName,
      customerEmail,
      customerPhone,
      customerContactPerson,
      customerContactPersonNumber,
      customerType,
      businessImages,
      address
    } = req.body;

    console.log(req.body);

    if (
      !token ||
      !customerName ||
      !customerPhone ||
      !customerContactPerson ||
      !customerType ||
      !address
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    console.log(decoded);

    const tempCustomer = await TempCustomer.findById(decoded.tempCustomerId);

    console.log(tempCustomer);

    if (!tempCustomer) {
      return res.status(404).json({ message: "Temporary user not found." });
    }

    const newAddress = await Address.create({
      customerId: tempCustomer._id,
      placeId: address.placeId,
      formattedAddress: address.formattedAddress,
      rawAddress: address.rawAddress,
      components: address.components,
      location: address.location,
      label: address.label || "Business",
      isPrimary: true
    });

    const newCustomer = await Customer.create({
      customerName,
      customerEmail: customerEmail || "",
      customerPhone,
      customerContactPerson,
      customerContactPersonNumber: customerContactPersonNumber || customerPhone,
      customerType,
      customerAddress: newAddress._id,
      businessImages: businessImages || []
    });

    newAddress.customerId = newCustomer._id;
    await newAddress.save();

    await TempCustomer.findByIdAndDelete(tempCustomer._id);

    const finalToken = jwt.sign(
      {
        customerId: newCustomer._id,
        contact: newCustomer.customerPhone,
        role: "customer",
        customerStatus: newCustomer.customerStatus
      },
      JWT_SECRET,
      { expiresIn: "14d" }
    );

    return res.status(200).json({
      message: "Business profile completed successfully.",
      customer: newCustomer,
      address: newAddress,
      token: finalToken
    });

  } catch (err) {
    console.error("Error in onboarding:", err);
    return res.status(500).json({
      message: "Failed to complete onboarding",
      error: err.message
    });
  }
};

export {
  send_otp,
  verify_otp,
  completeProfile,
};

// --- Admin Login ---
import Admin from "../Models/admins.js";

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    // If password is hashed, use bcrypt.compare. If not, use plain comparison.
    // For now, assume plain text (change to bcrypt if you hash passwords on admin creation)
    // const isMatch = await bcrypt.compare(password, admin.password);
    const isMatch = password === admin.password;
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    // Optionally, generate a JWT for admin session
    const token = jwt.sign(
      { adminId: admin._id, email: admin.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export { adminLogin };
