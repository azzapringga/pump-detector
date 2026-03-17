const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Pump Detector Running 🚀");
});

app.get("/scanner", (req, res) => {
  res.json([{ test: "OK" }]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
