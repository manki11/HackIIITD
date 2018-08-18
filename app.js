var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var passport = require("passport");
var GitHubStrategy = require("passport-github").Strategy;
var busboy = require("connect-busboy");
var path = require("path");
var fs = require("fs-extra");
var multer = require("multer");

var OrganList = {
  Kidney: [],
  Liver: [],
  Lung: [],
  Heart: [],
  Pancreas: [],
  Intestine: []
};

var DonorList = [];

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "history/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname +path.extname(file.originalname));
  }
});
var upload = multer({ storage: storage });
app.set("view engine", "ejs");
app.get("/", function(req, res) {
  res.render("home.ejs");
});

app.get("/Home", function(req, res) {
  res.render("home");
});

app.get("/Donor", function(req, res) {
  res.render("donor");
});

app.post("/Donor", upload.single("history"), function(req, res) {
  if (req.body) {
    console.log(req.body);
    DonorList.push(req.body);
  }
  res.redirect("/");
});

app.get("/List", function(req, res) {
  res.render("list", { OrganList: OrganList });
});

app.get("/Organ", function(req, res) {
  res.render("organ");
});

app.post("/addFlight", function(req, res) {
  console.log(req.body);
  let user = {};
  console.log(DonorList);
  for (let i = 0; i < DonorList.length; i++) {
    if (DonorList[i].donorId === req.body.donorId) {
      user = DonorList[i];
      console.log("User Matched");
    }
  }
  console.log(user);
  ("use strict");

  // Constant values - change as per your needs
  const namespace = "org.fabriccare.organ";
  const transactionType = "donateOrgan";

  // Connecting to main card
  const bnUtil = require("./bn-connection-util");
  bnUtil.connect(main);

  function main(error) {
    // Checking for error
    if (error) {
      console.log(error);
      process.exit(1);
    }

    // Getting the Business Network Definition
    let bnDef = bnUtil.connection.getBusinessNetwork();
    console.log(
      "2. Received Definition from Runtime: ",
      bnDef.getName(),
      "  ",
      bnDef.getVersion()
    );

    // Getting the factory
    let factory = bnDef.getFactory();

    // Creating an instance of transaction
    let options = {
      generate: false,
      includeOptionalFields: false
    };
    // Trying with demo id
    let organId = "AE105-05-06-2019";
    let transaction = factory.newTransaction(
      namespace,
      transactionType,
      organId,
      options
    );

    // Set up the properties of the transaction object

    transaction.setPropertyValue("organId", req.body.organId);
    transaction.setPropertyValue("type", parseInt(req.body.gridRadios));
    transaction.setPropertyValue("donorName", user.donorName);
    transaction.setPropertyValue("bloodgroup", user.bloodGroup);
    transaction.setPropertyValue("donorId", parseInt(req.body.donorId));
    transaction.setPropertyValue("hName", req.body.hName);
    transaction.setPropertyValue("hState", req.body.hState);
    transaction.setPropertyValue("hAddress", req.body.hAddress);
    transaction.setPropertyValue("date", req.body.date);
    transaction.setPropertyValue("time", req.body.time);
    transaction.setPropertyValue("storingSolution", req.body.storingSolution);
    transaction.setPropertyValue("temperature", req.body.temperature);
    transaction.setPropertyValue("dob", user.dob);
    transaction.setPropertyValue("gender", user.gender);
    transaction.setPropertyValue("donorAadhar", user.donorAadhar);
    transaction.setPropertyValue("donorState", user.donorState);
    transaction.setPropertyValue("donorAddress", user.donorAddress);
    transaction.setPropertyValue("kinName", user.kinName);
    transaction.setPropertyValue("kinAadhar", user.kinAadhar);
    transaction.setPropertyValue("kinPhoneNo", user.kinPhoneNo);

    // Submitting the transaction
    return bnUtil.connection
      .submitTransaction(transaction)
      .then(() => {
        console.log("6. Transaction Submitted/Processed Successfully!!");
        switch (parseInt(req.body.gridRadios)) {
          case 1:
            OrganList.Kidney.push({
              organId: req.body.organId,
              hospital: req.body.hName,
              date: req.body.date,
              time: req.body.time,
              solution: req.body.storingSolution,
              temperature: req.body.temperature
            });
            break;
          case 2:
            OrganList.Liver.push({
              organId: req.body.organId,
              hospital: req.body.hName,
              date: req.body.date,
              time: req.body.time,
              solution: req.body.storingSolution,
              temperature: req.body.temperature
            });
            break;
          case 3:
            OrganList.Lung.push({
              organId: req.body.organId,
              hospital: req.body.hName,
              date: req.body.date,
              time: req.body.time,
              solution: req.body.storingSolution,
              temperature: req.body.temperature
            });
            break;
          case 4:
            OrganList.Heart.push({
              organId: req.body.organId,
              hospital: req.body.hName,
              date: req.body.date,
              time: req.body.time,
              solution: req.body.storingSolution,
              temperature: req.body.temperature
            });
            break;
          case 5:
            OrganList.Pancreas.push({
              organId: req.body.organId,
              hospital: req.body.hName,
              date: req.body.date,
              time: req.body.time,
              solution: req.body.storingSolution,
              temperature: req.body.temperature
            });
            break;
          case 6:
            OrganList.Intestine.push({
              organId: req.body.organId,
              hospital: req.body.hName,
              date: req.body.date,
              time: req.body.time,
              solution: req.body.storingSolution,
              temperature: req.body.temperature
            });
            break;
          default:
            console.log("why not");
        }

        bnUtil.disconnect();
      })
      .catch(error => {
        console.log(error);

        bnUtil.disconnect();
      });
  }
  res.redirect("/");
});

// app localhost port number
app.listen("4200", function() {
  console.log("Fabric Care started on port 4200");
});
