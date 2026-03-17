const express = require("express");
const fetch = require("node-fetch"); // 🔥 WAJIB

const app = express();

app.get("/", (req, res) => {
  res.send("Pump Detector Running 🚀");
});

app.get("/scanner", async (req, res) => {

  try {

    const response = await fetch("https://api.binance.com/api/v3/ticker/24hr");
    const data = await response.json();

    let result = [];

    data.forEach(c => {

      let change = parseFloat(c.priceChangePercent);
      let volume = parseFloat(c.quoteVolume);

      // filter lebih ringan dulu biar pasti keluar
     if (c.symbol.endsWith("USDT")) {

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
      }

    });

    res.json(result);

  } catch (err) {
    console.log(err); // 🔥 biar kelihatan di log
    res.json({ error: "Gagal ambil data" });
  }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
