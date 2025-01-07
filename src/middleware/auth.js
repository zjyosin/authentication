// const express = require("express")
// const app = express()
// app.use(express.json())
const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;
    if(!token) res.status(400).send("Token is not valid!!")
        else {
            const userToken = await jwt.verify(token, "DevConnect@123"); // verify the token 
               console.log(userToken); // it will return { _id: '6762cd533bb46222107710be', iat: 1734531291 } 
               const userInfo = await User.findById(userToken._id); // so with the help of id we can verify user
                if(!userInfo) res.status(400).send("Token is not valid!!") // if user does not exist inform user does not exist to the client
                else {
                    req.user = userInfo;
                    next();
                }
    }
   
}

module.exports = {
    userAuth
}
