const User = require("../Models/users");
const jwt = require("jsonwebtoken");
const sendOtp = require("./utils/sendOTP");
const { authenticator } = require("otplib");
require("dotenv").config();

const JWT_SECRET = process.env.SCERET_KEY;
function generateOTP() {
  return authenticator.generate(authenticator.generateSecret()).slice(0, 4);
}

const send_otp = async (req, res) => {
  try {
    const { contact } = req.body;
    let user = await User.findOne({ contact });

    if (!user) {
      const newUser = new User({
        contact,
      });

      await newUser.save();
      user = newUser;
    }

    const otp = generateOTP();
    const send = await sendOtp(contact, otp);

    if(send)
    {
      console.log("OTP : ",otp);
        user.otp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // valid 5 min
        await user.save();

      res.json({ message: "OTP sent", userId: user._id });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verify_otp = async (req, res) => {
  const { contact, otp } = req.body;
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

  const token = jwt.sign(
    { userId: user._id, contact: user.contact },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  if (user.firstName === undefined) {
    return res.json({ message: "OTP verified", token, isNew: true });
  }
  res.json({ message: "OTP verified", token });
};

const completeProfile = async (req, res) => {
  try {
    const { token, firstName, lastName, email } = req.body;

    if (!token || !firstName || !lastName || !email) {
      return res.status(400).json({ message: "All fields are required." });
    }
    // console.log("token",token)

    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log("decode",decoded)
    const contact = decoded.contact;
    // console.log("complete contact", contact);

    const user = await User.findOneAndUpdate(
      { contact },
      { firstName, lastName, email },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Profile completed successfully.", user });
  } catch (err) {
    console.error("JWT decode error:", err);
    res
      .status(500)
      .json({ message: "Failed to complete profile", error: err.message });
  }
};

const addAddress = async (req, res) => {
  try {
    const { token, address } = req.body;
    if (!address) return res.json({ message: "address is a required field" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const contact = decoded.contact;
    const user = await User.findOne({ contact });
    if (!user) return res.status(404).json({ message: "User not found." });

    address.name =
      address.name || `${user.firstName || ""} ${user.lastName || ""}`.trim();
    address.email = address.email || user.email;
    address.contact = address.contact || user.contact;

    const isDuplicate = user.addresses.some(
      (addr) =>
        addr.city === address.city &&
        addr.pincode === address.pincode &&
        addr.landmark === address.landmark
    );

    if (isDuplicate) {
      return res.status(400).json({ message: "Address already exists." });
    }

    const updatedUser = await User.findOneAndUpdate(
      { contact },
      {
        $push: {
          addresses: {
            $each: [address],
            $slice: -4,
          },
        },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Address added successfully.", user: updatedUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add address", error: err.message });
  }
};

const getAddress = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const contact = decoded.contact;

    const user = await User.findOne({ contact });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ addresses: user.addresses || [] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch addresses", error: err.message });
  }
};

const editAddress = async (req, res) => {
  try {
    const { token, index, updatedAddress } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    const contact = decoded.contact;

    const user = await User.findOne({ contact });
    if (!user || !user.addresses[index]) {
      return res.status(404).json({ message: "Address not found" });
    }

    user.addresses[index] = {
      ...user.addresses[index]._doc,
      ...updatedAddress,
    };
    await user.save();

    res
      .status(200)
      .json({ message: "Address updated", addresses: user.addresses });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update address", error: err.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { token, index } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);
    const contact = decoded.contact;

    const user = await User.findOne({ contact });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.addresses[index]) {
      return res
        .status(404)
        .json({ message: "Address not found at the given index." });
    }

    user.addresses.splice(index, 1);
    await user.save();

    res
      .status(200)
      .json({
        message: "Address deleted successfully.",
        addresses: user.addresses,
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete address", error: err.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    const contact = decoded.contact;
    const user = await User.findOne({ contact }).populate("wishlist");

    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ wishlist: user.wishlist });
  } 
  catch (err) {
    res.status(500).json({ message: "Failed to fetch wishlist", error: err.message });
  }
};


const toggleWishlist = async (req, res) => {
  try {
    const { token, productId } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    const contact = decoded.contact;

    const user = await User.findOne({ contact });
    if (!user) return res.status(404).json({ message: "User not found." });

    const index = user.wishlist.indexOf(productId);

    let status;
    if (index === -1) {
      user.wishlist.push(productId);
      status = "added";
    } else {
      user.wishlist.pull(productId);
      status = "removed";
    }

    await user.save();

    res.status(200).json({ status });
  } catch (err) {
    res.status(500).json({ message: "Toggle failed", error: err.message });
  }
}

module.exports = { 
  send_otp , 
  verify_otp , 
  completeProfile , 
  addAddress , 
  getAddress , 
  editAddress , 
  deleteAddress ,
  getWishlist,
  toggleWishlist
};

// --- Admin Login ---
const Admin = require("../Models/admins");

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

module.exports.adminLogin = adminLogin;
