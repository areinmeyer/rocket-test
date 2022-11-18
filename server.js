/*
  Server code to start the application. 
  This isolates the running of the application seperate from the server start,
  facilitating easier running of the app in a test harness
*/
const express = require("express");
const app = require("./app.js");

const port = parseInt(process.env.PORT || "3000", 10);
app.set("port", port);

app.listen(app.get("port"), function () {
  console.log(`Express server listening on port ${app.get("port")}`);
});
