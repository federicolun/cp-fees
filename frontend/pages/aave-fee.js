import { useState, useEffect } from "react";

export default function AaveFee() {
  const [aavePrice, setAavePrice] = useState(null);
  const [feeUSD, setFeeUSD] = useState(null);
  const [maticPrice, setMaticPrice] = useState(null);
  const [feeMATIC, setFeeMATIC] = useState(null);
  const [txHash, setTxHash] = useState(null);

  const fetchData = async () => {
    const res = await fetch("http://localhost:3000/send-fee");
    const data = await res.json();
    setAavePrice(data.aavePrice);
    setFeeUSD(data.feeUSD);
    setMaticPrice(data.maticPrice);
    setFeeMATIC(data.feeMATIC);
    if (data.txHash) setTxHash(data.txHash);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendFee = async () => {
    const res = await fetch("http://localhost:3000/send-fee");
    const data = await res.json();
    setTxHash(data.txHash);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
      <h2>Cotización de AAVE y Fee</h2>

      {aavePrice ? (
        <div>
          <p><strong>Precio AAVE (USD):</strong> ${aavePrice}</p>
          <p><strong>Fee 0.5% en USD:</strong> ${feeUSD?.toFixed(2)}</p>
          <p><strong>Precio MATIC (USD):</strong> ${maticPrice}</p>
          <p><strong>Fee equivalente en MATIC:</strong> {feeMATIC?.toFixed(6)} MATIC</p>

          <button
            onClick={handleSendFee}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#8247e5",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Enviar Fee a Wallet
          </button>

          {txHash && (
            <p style={{ marginTop: "20px" }}>
              ✅ Fee enviado. Hash:{" "}
              <a
                href={`https://polygonscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {txHash}
              </a>
            </p>
          )}
        </div>
      ) : (
        <p>Cargando precios...</p>
      )}
    </div>
  );
}
