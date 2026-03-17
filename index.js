const express = require("express");
const app = express();
const fetch = require("node-fetch");

app.get("/", (req, res) => {
  res.send("Pump Detector Running 🚀");
});

const express = require("express");
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

      // 🔥 FILTER EARLY PUMP (bisa kita tweak nanti)
      if (change > 1 && volume > 1000000) {
        result.push({
          symbol: c.symbol,
          change: change.toFixed(2),
          volume: Math.floor(volume),
          signal: change > 3 ? "🚀 STRONG PUMP" : "🔥 EARLY PUMP"
        });
      }

    });

    res.json(result);

  } catch (err) {
    res.json({ error: "Gagal ambil data" });
  }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
