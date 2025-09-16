import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3001" }));

// Config Polygon + Wallet
const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const DEST_WALLET = "0xC113308DF26226A9ACC154b5288b85BcA2a89E40";

// Endpoint de prueba
app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando" });
});

// Endpoint /send-fee
app.get("/send-fee", async (req, res) => {
  try {
    // 1. Precio de AAVE en USD
    const aaveResp = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=aave&vs_currencies=usd");
    const aaveData = await aaveResp.json();
    const aavePrice = aaveData.aave.usd;

    // 2. Fee 0.5% en USD
    const feeUSD = aavePrice * 0.005;

    // 3. Precio de MATIC en USD
    const maticResp = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd");
    const maticData = await maticResp.json();
    const maticPrice = maticData["matic-network"].usd;

    // 4. Convertir fee a MATIC
    const feeMATIC = feeUSD / maticPrice;

    // 5. Enviar fee en MATIC
    const tx = await wallet.sendTransaction({
      to: DEST_WALLET,
      value: ethers.utils.parseEther(feeMATIC.toFixed(6)),
    });

    res.json({
      aavePrice,
      feeUSD,
      maticPrice,
      feeMATIC,
      txHash: tx.hash,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
