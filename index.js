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

  try {

    const response = await fetch("https://api.binance.com/api/v3/ticker/24hr");
    const data = await response.json();

    let result = [];

    data.forEach(c => {

      if (AJAIB_COINS.includes(c.symbol)) {

        let change = parseFloat(c.priceChangePercent);
        let volume = parseFloat(c.quoteVolume);

        if (change > 2 && volume > 2000000) {
          result.push({
            symbol: c.symbol,
            change: change.toFixed(2),
            volume: Math.floor(volume),
            signal: "🚀 STRONG PUMP"
          });
        }

        else if (change > 1 && volume > 1000000) {
          result.push({
            symbol: c.symbol,
            change: change.toFixed(2),
            volume: Math.floor(volume),
            signal: "🔥 EARLY PUMP"
          });
        }

      }

    });

    result.sort((a, b) => b.change - a.change);

    res.json(result);

  } catch (err) {
    console.log(err);
    res.json({ error: "Gagal ambil data" });
  }

});

// ==========================
// SERVER
// ==========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
