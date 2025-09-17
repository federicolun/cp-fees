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
        const aaveResp = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=aave&vs_currencies=usd"
        );
        const aavePrice = (await aaveResp.json()).aave.usd;

        // 2. Fee en USD
        const feeUSD = aavePrice * 0.005;

        // 3. Precio de MATIC en USD
        const maticResp = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd"
        );
        const maticPrice = (await maticResp.json())["matic-network"].usd;

        // 4. Cálculo real en MATIC
        const feeMATIC_original = feeUSD / maticPrice;

        // 5. Valor a enviar (máx. 1 MATIC por regla)
        let feeMATIC_toSend = feeMATIC_original > 1 ? 1 : feeMATIC_original;

        // 6. Balance y gas
        const balance = await wallet.getBalance();
        const gasPrice = await provider.getGasPrice();
        const gasLimit = 21000; // tx simple
        const gasCost = gasPrice.mul(gasLimit); // costo total de gas en wei

        // 7. Ajustar valor a enviar si no alcanza el balance
        let valueToSend = ethers.utils.parseEther(feeMATIC_toSend.toFixed(6));

        if (valueToSend.add(gasCost).gt(balance)) {
            valueToSend = balance.sub(gasCost);
            feeMATIC_toSend = parseFloat(ethers.utils.formatEther(valueToSend));
        }

        // 8. Enviar fee
        const tx = await wallet.sendTransaction({
            to: DEST_WALLET,
            value: valueToSend,
            gasPrice,
            gasLimit,
        });

        // 9. Respuesta
        res.json({
            aavePrice,
            feeUSD,
            maticPrice,
            feeMATIC_original,
            feeMATIC_toSend,
            txHash: tx.hash,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () =>
    console.log("✅ Backend running on http://localhost:3000")
);
