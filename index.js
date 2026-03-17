const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Pump Detector Running 🚀");
});

app.get("/scanner", (req, res) => {
  res.json([
    {
      symbol: "BTCUSDT",
      change: "1.2",
      volume: 123456789,
      signal: "🚀 TEST PUMP"
    }
  ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
