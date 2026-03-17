const express = require("express");
const fetch = require("node-fetch");

const app = express();

// ==========================
// LIST KOIN AJAIB (EDITABLE)
// ==========================
const AJAIB_COINS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "MATICUSDT",
  "AVAXUSDT",
  "DOTUSDT",
  "SHIBUSDT",
  "TRXUSDT",
  "LINKUSDT",
  "ATOMUSDT",
  "LTCUSDT"
];

// ==========================
// ROOT
// ==========================
app.get("/", (req, res) => {
  res.send("Pump Detector Running 🚀");
});

// ==========================
// SCANNER
// ==========================
app.get("/scanner", async (req, res) => {

  const response = await fetch("https://api.binance.com/api/v3/ticker/24hr");
  const data = await response.json();

  const filtered = data.filter(c => AJAIB_COINS.includes(c.symbol));

  res.json(filtered);

});

// ==========================
// SERVER
// ==========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
