const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());  //enabling cors for all routes
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.post("/verify-code", (req, res) => {
  const { verificationCode } = req.body;
  console.log("verificationCode: ", verificationCode, verificationCode.length)

  if (!verificationCode || verificationCode.length !== 6 || verificationCode.charAt(5) === "7") {
    return res.status(400).json({ error: "Verification Error" });
  }

  res.status(200).json({ message: "Success" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
