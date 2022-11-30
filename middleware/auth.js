import jwt from "jsonwebtoken";

export const isAuthenticated = (request, response, next) => {
  const { email, password, authorization } = request.headers;
  //If Authorization token is not present in request.headers
  if (!authorization || authorization === "Bearer null") {
    //If both email and password not provided by the user
    if (!email && !password) {
      return response.status(401).json({
        message:
          "email, password and token in authorization header are missing. Token cannot be generated without them, please send valid email and password via request headers to generate a JWT token for authorization purposes.",
      });
    }
    //If email not provided by the user
    else if (!email) {
      return response.status(401).json({
        message:
          "email and token in authorization header are missing. Token cannot be generated without them, please send valid email via request headers to generate a JWT token for authorization purposes.",
      });
    }
    //If password not provided by the user
    else if (!password) {
      return response.status(401).json({
        message:
          "password and token in authorization header are missing. Token cannot be generated without them, please send valid password via request headers to generate a JWT token for authorization purposes.",
      });
    }
    //If both email and password provided by the user
    else {
      //Check for username and password
      if (
        email === process.env.AUTH_EMAIL &&
        password === process.env.AUTH_PASSWORD
      ) {
        //Creating a token and mark its expiry as 5 minutes
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
          expiresIn: 5 * 60,
        });
        //Attaching the generated token to the response headers so that it can be saved on client's request headers for upcoming requests
        response.setHeader("Authorization", token);
        return response.status(200).json({
          message:
            "Token generated, user is authorized now. Please send the request again along with the generated token via request headers on the same url to get the desired result.",
        });
      } else {
        return response.status(400).json({
          message:
            "Supplied email and/or password not correct. Token cannot be generated without them, please send valid email and password via request headers to generate a JWT token for authorization purposes.",
        });
      }
    }
  } else {
    //For e.g., provided token format will be "Bearer xxxxxxxxxxxxx". So, splitting it
    //with " " (space) as the separator.
    const bearer = authorization.split(" ");
    //To the right after the space i.e., xxxxxxxxxxxxx is the actual token to be used.
    //So, taking bearer[1] for the same.
    const token = bearer[1];
    try {
      //Verify provided token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Adding decoded data i.e., { email: email } to request.user from payload
      request.user = decoded;

      //Adding provided token to request.user
      request.user["token"] = token;

      //Calling the next middleware
      next();
    } catch (error) {
      //If control comes here that means provided token is either malformed or has expired
      return response.status(400).json({
        message:
          "JWT token is either malformed or has expired. Please login again.",
      });
    }
  }
};
