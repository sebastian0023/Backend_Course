import express from "express";
import app from "./routes/index.js";

// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// app.get("users/:id", (req, res) => {
//   const userId = req.params.id;
//   res.send(`User ID: ${userId}`);
// });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});