require("dotenv").config();
const fs = require("fs");
const app = require("./app");
const https = require("https");

const certificate = fs.readFileSync("./src/certificate/cert.pem", "utf8");

const ca = fs.readFileSync("./src/certificate/crs.pem", "utf8");

const privateKey = fs.readFileSync("./src/certificate/key.pem", "utf8");

const credentials = { key: privateKey, cert: certificate, ca: ca };

const httpsServer = https.createServer(credentials, app);

// https

// httpsServer.listen(process.env.PORT || 3000, () => {
//   console.log(`App listen at ${process.env.PORT}`);
// });

//http

app.listen(process.env.PORT || 3000, () => {
  console.log(`App listen at ${process.env.PORT}`);
});
