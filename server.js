const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

async function getSymbols() {
  const res = await axios.get("https://api.binance.com/api/v3/exchangeInfo");
  return res.data.symbols
    .filter(s => s.status === "TRADING" && s.quoteAsset === "USDT")
    .map(s => s.symbol);
}

async function getCandles(symbol) {
  const res = await axios.get(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=3`
  );
  return res.data;
}

function detectPump(candles) {
  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];

  const lastClose = parseFloat(last[4]);
  const prevClose = parseFloat(prev[4]);

  const lastVol = parseFloat(last[5]);
  const prevVol = parseFloat(prev[5]);

  const change = ((lastClose - prevClose) / prevClose) * 100;

  if (change >= 1.5 && lastVol > prevVol * 1.5) {
    return {
      change: change.toFixed(2),
      volume: lastVol,
      signal: "🚀 EARLY PUMP"
    };
  }

  return null;
}

app.get("/scanner", async (req, res) => {
  try {
    const symbols = await getSymbols();
    const results = [];

    const sample = symbols.slice(0, 50);

    for (let symbol of sample) {
      const candles = await getCandles(symbol);
      const signal = detectPump(candles);

      if (signal) {
        results.push({
          symbol,
          ...signal
        });
      }
    }

    res.json(results);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Pump Detector Running 🚀");
});

app.listen(PORT, () => {
  console.log("Server running...");
});
