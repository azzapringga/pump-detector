const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Pump Detector Running 🚀");
});

app.get("/scanner", async (req, res) => {

  // TEST dulu biar pasti muncul
  res.json([
    {
      symbol: "BTCUSDT",
      change: "1.5",
      volume: 123456789,
      signal: "🚀 TEST PUMP"
    },
    {
      symbol: "ETHUSDT",
      change: "0.8",
      volume: 987654321,
      signal: "🔥 EARLY SIGNAL"
    }
  ]);

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
