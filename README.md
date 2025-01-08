**Encrypting Passwords:**
  1. Install bycrpt package: npm i bcrypt
  2. Create passwordHash using bcrypt.hash and save the user is excrupted password:
      // Encrypt password const passwordHash = await bcrypt.hash(password, 10); // 10 is the number of rounds hashing is done
  3. Compare password and throw errors if email or password is invalid:
     const isPasswordMatched = await bcrypt.compare(passwordInputByUser, user.password);


.........................................................................................................................................................................................................................
........................................................................................................................................................................................................................

**Authentication, JWT & Cookies**:
JWT (JSON) web token is compact and URL-safe and can be transfered between clients/ parties safely. It is used in web applications for authentication and authorization. JWT consist of  3 parts: header.payload.signature
  **Authentication Flow**:
1.	Login: User login by providing credentials to the server.
2.	Server Verify the credentials: If credentials are valid server creates a JWT token and sends it back to the user.
3.	Token storage: Client stores the JWT (in cookies) for future request.

**Install jsonwebpackage to generate JWT token: **
npm i jsonwebtoken
import the jsonwebtoken 
const jwt = require("jsonwebtoken");
userSchema.methods.getJWT = async function () {
 const user = this
  // we have passed id and secrate key "DevConnect@123" which only server knows.
 const token = await jwt.sign({_id: user._id}, "DevConnect@123", { expiresIn: "1d" }) 
 return token;
}
Once the JWT token is generated it will be send to client, passed in cookie. So for all the other request client don't require to send username and password again and again its just cookie which travel
with all request carry the JWT token and server verify the user with the help of JWT token.

