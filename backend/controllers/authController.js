const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// register controller
const registerUser = async (req, res) => {
  try {
    //extract user info from req.body
    const { username, email, password, role } = req.body;
    //Check if the user is already exists in our db
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User is already exist either with same username or same email. pls try with diff username or email.",
      });
    }

    // hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new user and save in your database
    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newlyCreatedUser.save();
    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "User register successfully!",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to register user! pls try again.",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured! ty again!",
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    //find if the current user is exist in db or not
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    //if the password is correct or not
    const isPasswordMatchh = await bcrypt.compare(password, user.password);

    if (!isPasswordMatchh) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //create user token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      },
    );

    res.status(200).json({
      success: true,
      message: "Logged in successful",
      accessToken,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured! ty again!",
    });
  }
};

module.exports = { loginUser, registerUser };
