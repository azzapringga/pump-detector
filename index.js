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

    let result = [];

    for (let symbol of AJAIB_COINS) {

      // 🔥 ambil data 10 menit (1m x 10)
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=10`
      );

      const data = await response.json();

      if (data.length > 0) {

        let firstPrice = parseFloat(data[0][1]); // open candle pertama
        let lastPrice = parseFloat(data[data.length - 1][4]); // close terakhir

        let change = ((lastPrice - firstPrice) / firstPrice) * 100;

        // 🔥 ambil volume terakhir
        let volume = parseFloat(data[data.length - 1][5]);

        // 🔥 LOGIC EARLY PUMP
        if (change > 0.5) {
          result.push({
            symbol: symbol,
            change: change.toFixed(2),
            volume: Math.floor(volume),
            signal: "🚀 10M PUMP"
          });
        }

      }

    }

    result.sort((a, b) => b.change - a.change);

    res.json(result);

  } catch (err) {
    console.log(err);
    res.json({ error: "error ambil data" });
  }

});

// ==========================
// SERVER
// ==========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
