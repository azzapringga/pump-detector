const axios = require("axios");

const URL = "https://api.ajaib.co.id/coin/internal/v1/public/market-data";
const INTERVAL = 20000; // 20 detik
const HISTORY_LENGTH = 30; // simpan 10 menit = 60 : 20 detik

// Struktur data history: {symbol: [{price, volume, timestamp}, ...]}
let history = {};

// Ambil data market terbaru
async function fetchData() {
  try {
    const res = await axios.get(URL);
    return res.data.data;
  } catch (err) {
    console.error("Error ambil data:", err.message);
    return [];
  }
}

// Update history tiap koin
function updateHistory(data) {
  const now = Date.now();

  data.forEach((coin) => {
    const symbol = coin.symbol;
    const price = parseFloat(coin.lastPrice);
    const volume = parseFloat(coin.volume);

    if (!history[symbol]) history[symbol] = [];
    history[symbol].push({ price, volume, timestamp: now });

    // jaga history hanya 10 menit
    if (history[symbol].length > HISTORY_LENGTH) {
      history[symbol].shift();
    }
  });
}

// Hitung pump real
function detectPump() {
  const now = Date.now();
  let results = [];

  for (let symbol in history) {
    const records = history[symbol];
    if (records.length < HISTORY_LENGTH) continue; // belum cukup data

    const old = records[0]; // data 10 menit lalu
    const latest = records[records.length - 1];

    const changePercent = ((latest.price - old.price) / old.price) * 100;
    const volumeSpike = latest.volume / old.volume;

    // Kriteria pump
    if (changePercent > 0.5 && volumeSpike > 2) {
      results.push({
        symbol,
        price: latest.price,
        change: changePercent.toFixed(2),
        volume: latest.volume,
        score: changePercent * volumeSpike,
      });
    }
  }

  // urutkan berdasarkan score
  results.sort((a, b) => b.score - a.score);
  return results;
}

// Main loop
async function main() {
  console.clear();
  console.log("🚀 SCANNING PUMP COIN REAL-TIME...\n");

  const data = await fetchData();
  if (data.length === 0) {
    console.log("❌ Tidak ada data market");
    return;
  }

  updateHistory(data);
  const pumped = detectPump();

  if (pumped.length === 0) {
    console.log("❌ Tidak ada koin pump saat ini");
    return;
  }

  console.log("🔥 KOIN TERDETEKSI PUMP 10 MENIT:\n");
  pumped.slice(0, 10).forEach((coin, index) => {
    console.log(
      `${index + 1}. ${coin.symbol} | Harga: ${coin.price} | Change: ${coin.change}% | Volume: ${coin.volume}`
    );
  });
}

setInterval(main, INTERVAL);
