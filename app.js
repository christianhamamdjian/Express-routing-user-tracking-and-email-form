const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const app = express();
const userList = [];

const fs = require("fs");
const os = require("os");
const ip = require("ip");

const port = 8080;
const hostname = "127.0.0.1";

const user = os.hostname();

const checkingTime = Date.now();
let transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  port: 25,
  auth: {
    user: "me@gmail.com",
    pass: "mypassword"
  },
  tls: {
    rejectUnauthorized: false
  }
});

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  const pageUrl = req.url;
  res.sendFile(__dirname + "/" + "index.html");
});

app.get("/home", (req, res) => {
  const pageUrl = req.url;
  res.sendFile(__dirname + "/" + "index.html");
});

app.get("/about", (req, res) => {
  const pageUrl = req.url;
  res.sendFile(__dirname + "/" + "about.html");
});

app.get("/contact", (req, res) => {
  const pageUrl = req.url;
  res.sendFile(__dirname + "/" + "contact.html");
});

app.post("/thankyou", (req, res) => {
  const pageUrl = req.url;
  let { firstName, lastName, email, message } = req.body;
  console.log(req.body);
  userList.push({
    firstName,
    lastName,
    email,
    message
  });
  console.log(userList);

  const formcontent = `User name: ${firstName}  ${lastName}\n user ip:${ip.address()}\n checking time: ${checkingTime}\n email: ${email}\n message: ${message}\n\n`;

  fs.appendFile("track.user.txt", formcontent, e => {
    if (e) {
      console.log(e);
    } else {
    }
    console.log("form content saved");
  });

  const content = `User: ${user} user ip: ${ip.address()} checking time: ${checkingTime} checked page: ${pageUrl}\n\n`;

  fs.appendFile("track.user.activity.txt", content, e => {
    if (e) {
      console.log(e);
    } else {
    }
    console.log("content saved");
  });

  const info = `<h3>${firstName} ${lastName}, Thank you for contacting us</h3><p> We will contact you soon.<p>`;
  const emailMessage = `User name: ${firstName} ${lastName}\n email: ${email}\n message: ${message}\n  checked page: ${pageUrl} \n User ip: ${ip.address()}\n Sending time: ${checkingTime}\n\n`;
  res.send(info);

  let mailOptions = {
    from: '"Me" <me@gmail.com',
    to: "me.myself@here.com",
    subject: "NodeJs CRUD app",
    text: `${emailMessage}`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("The message was sent!");
    console.log(info);
    res.send(`<h1>Thank you!</h1>
    <h2>Your message was successfuly sent.</h2>
    <h3>We'll get back to you soon.</h3>`);
  });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080....");
});
