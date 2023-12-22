const jwt = require("jsonwebtoken");

function authenToken(req, res, next) {
  const authorizationHeader = req.headers["authorization"];
  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "Loi Token") {
        return res.status(401).json({ status: "error", message: "Token Het Han" });
      } else {
        return res.sendStatus(403);
      }
    }
    req.user = decoded;
    next();
  });
}

// lưu cookie
function authenCookieToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "Loi Token") {
        return res.status(401).json({ status: "error", message: "Token Het Han" });
      } else {
        return res.sendStatus(403);
      }
    }
    req.user = decoded;
    next();
  });

  // try {
  //   const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  //   req.user = user;
  //   next();
  // } catch (error) {
  //   res.clearCookie("token");
  //   return res.redirect("/");
  // }
}

module.exports = { authenToken };
