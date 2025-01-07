const express = require("express");
const connectDB = require("./database");
const User = require("./model/user");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/auth");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signUp", async (req, res) => {
  const { firstName, lastName, age, emailID, gender, password } = req.body;
  try {
    // Encrypt password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      age,
      emailID,
      gender,
      password: passwordHash,
    });
    await user.save();
    res.send("Signed up successfully!!");
  } catch (err) {
    res.send("Sign up failed!! " + err.message);
  }
});

app.get("/getAllUserInfo", userAuth, async (req, res) => {
  try {
    const userDetails = await User.find({});
    res.status(200).send(userDetails);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete("/deleteUserbyID", userAuth, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    await User.findByIdAndDelete(userId);
    const userDetails = await User.find({});
    res.status(200).send(userDetails);
  } catch (err) {
    res.status(400).send("Fetching user failed!!");
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const { emailId } = req.body;
    const userInfo = req.user; // from the middleware
    console.log("userInfo", userInfo)
    if (userInfo.emailID === emailId) {
      res.status(200).send(userInfo);
    } else {
      res.status(400).send("User does not exist !!");
    }
  } catch (err) {
    res.status(400).send("User does not exist!!");
  }
});

app.patch("/updateUserInfo", userAuth, async (req, res) => {
  const { _id, password, ...data } = req.body;

  try {
    // Check if the user is updating their own info
    if (_id !== req.user._id.toString()) {
      return res.status(403).send("Unauthorized action!");
    }

    // Encrypt password if it's part of the update
    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      data.password = passwordHash;
    }

    // Update user information
    const userDetails = await User.findByIdAndUpdate(_id, data, {
      new: true,
    });

    res.status(200).send("Updated Successfully!!" + userDetails);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const userInfo = await User.findOne({ emailID: emailId });
    if (!userInfo) {
      throw new Error("Invalid credentials !!");
    }

    // Verify password
    const isPasswordMatched = await userInfo.validatePassword(password);
    console.log("isPasswordMatched", isPasswordMatched)
    if (isPasswordMatched) {
      const token = await userInfo.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 36000000),
      });
      res.send("Login successfully!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Invalid Credentials");
  }
});

connectDB()
  .then(() => {
    console.log("Connected to DB");
    app.listen("2333", () => {
      console.log("Server listening...");
    });
  })
  .catch((err) => {
    console.log("DB connection failed", err.message);
  });
