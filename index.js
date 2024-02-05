const textflow = require("textflow.js");
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

require("dotenv").config();

const PORT = process.env?.PORT || 5050;
textflow.useKey(process.env.TEXTFLOW_API);

const app = express();

app.use(
	cors({
		origin: "*",
	})
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "ejs");
app.use(express.static("public"));
// app.get("/", async (req, res) => {
// 	res.send(`Server is successfully started at port: ${PORT}`);
// });

const sendSms = async (phoneNumber, sms) => {
	// Sending an SMS in one line
	const data = await textflow.sendSMS(`+91${phoneNumber}`, `${sms}`);
	// console.log(data);
	// OTP Verification
	// User has sent his phone number for verification
	// textflow.sendVerificationSMS("+11234567890", verificationOptions);

	// Show him the code submission form
	// We will handle the verification code ourselves

	// The user has submitted the code
	// let result = await textflow.verifyCode("+11234567890", "USER_ENTERED_CODE");
	return { ok: data?.ok, status: data?.status, message: data?.message };
};

app.get("/", async (req, res) => {
	res.render("form");
});
app.post("/sendsms", async (req, res) => {
	try {
		const { phoneNumber, sms } = req.body;
		// console.log(req.body);
		const response = await sendSms(phoneNumber, sms);
		res.status(200).json({ message: "Success", response });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Fail" });
	}
});

app.listen(PORT, () => {
	console.log(`Server started at port: ${PORT}`);
});
