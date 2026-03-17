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

      // 🔥 DEBUG: cek apakah masuk list
      if (AJAIB_COINS.includes(c.symbol)) {

        console.log("MASUK:", c.symbol); // 👈 ini penting

        let change = parseFloat(c.priceChangePercent);
        let volume = parseFloat(c.quoteVolume);

        if (change > 1) {
          result.push({
            symbol: c.symbol,
            change: change.toFixed(2),
            volume: Math.floor(volume),
            signal: "🔥 PUMP"
          });
        }

      }

    });

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
