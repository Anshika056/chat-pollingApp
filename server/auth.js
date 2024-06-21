const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

exports.register = async (data) => {
  const { username, password } = data;

  try {
    // Check if the user already exists
    let user = await User.findOne({ username });

    if (user) {
      // If user exists, check if the provided password matches
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return {
          status: false,
          statusCode: 401,
          statusMessage: "Invalid credentials",
          token: "",
        };
      } else {
        // Password matched, issue a JWT token
        const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
        return {
          status: true,
          statusCode: 201,
          statusMessage: "User registered successfully",
          token: token,
        };
      }
    } else {
      // If user does not exist, create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ username, password: hashedPassword });
      await user.save();

      // Issue a JWT token for the new user
      const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
      return {
        status: true,
        statusCode: 201,
        statusMessage: "User registered successfully",
        token: token,
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
