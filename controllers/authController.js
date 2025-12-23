// const User = require("../models/User");
// // Removed bcrypt as it's no longer needed

// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // Validation
//     if (!name || !email || !password || !role) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Check existing user
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     // Create user without password hashing
//     const user = await User.create({
//       name,
//       email,
//       password, // Store plain password as requested
//       role,
//       isApproved: false, // User approval flow remains
//     });

//     res.status(201).json({
//       message: "Registration successful. Await admin approval.",
//       userId: user._id,
//     });
//   } catch (error) {
//     console.error("Register error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Check password (plain text comparison as requested)
//     if (user.password !== password) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Successful login
//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.logout = async (req, res) => {
//   res.status(200).json({ message: "Logout placeholder" });
// };

// exports.getMe = async (req, res) => {
//   res.status(200).json({ message: "GetMe placeholder" });
// };

// exports.updateTheme = async (req, res) => {
//   res.status(200).json({ message: "UpdateTheme placeholder" });
// };














// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     if (!name || !email || !password || !role) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       role,
//       isApproved: false,
//     });

//     res.status(201).json({
//       message: "Registration successful. Await admin approval.",
//       userId: user._id,
//     });
//   } catch (error) {
//     console.error("Register error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user || user.password !== password) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     if (!user.isApproved) {
//       return res.status(403).json({
//         message: "Account pending admin approval",
//       });
//     }

//     // ✅ CREATE JWT TOKEN (THIS IS WHAT YOU ARE MISSING)
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // ✅ SEND TOKEN + USER
//     res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.logout = async (req, res) => {
//   res.status(200).json({ message: "Logout successful" });
// };

// exports.getMe = async (req, res) => {
//   try {
//     const user = req.user; // Assuming user is attached to req by middleware

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     });
//   } catch (error) {
//     console.error("GetMe error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.updateTheme = async (req, res) => {
//   try {
//     const user = req.user; // Assuming user is attached to req by middleware
//     const { theme } = req.body;

//     if (!theme) {
//       return res.status(400).json({ message: "Theme is required" });
//     }

//     user.theme = theme;
//     await user.save();

//     res.status(200).json({ message: "Theme updated successfully" });
//   } catch (error) {
//     console.error("UpdateTheme error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };







const User = require("../models/User");
const jwt = require("jsonwebtoken");

/* =========================
   HELPER: SIGN JWT
   ========================= */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

/* =========================
   REGISTER USER
   ========================= */
// POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // ❌ prevent duplicate users
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "employee",
      isApproved: false, // 🔒 approval required
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Await admin approval.",
    });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

/* =========================
   LOGIN USER (🔥 FIXED)
   ========================= */
// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    // ❌ invalid email
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ❌ wrong password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ❌ NOT APPROVED
    if (!user.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Your account is pending approval",
      });
    }

    // ✅ APPROVED → LOGIN ALLOWED
    const token = signToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // frontend handles routing
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

/* =========================
   LOGOUT USER
   ========================= */
// POST /api/auth/logout
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

/* =========================
   GET CURRENT USER
   ========================= */
// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

/* =========================
   UPDATE THEME
   ========================= */
// PUT /api/auth/theme
exports.updateTheme = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { theme: req.body.theme },
      { new: true }
    );

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update theme",
    });
  }
};



































