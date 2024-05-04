"use client";

/* eslint-disable no-useless-concat */
import React, { useState } from "react";
import crypto from "crypto";
import { useAccount } from "wagmi";
import { Balance } from "~~/components/scaffold-eth";

const OfframpExample: React.FC = () => {
  const { address: connectedAddress, isConnected } = useAccount();
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  const handleHostedFlowClick = () => {
    const url = `https://offramp-sandbox.gatefi.com/?merchantId=${
      process.env.NEXT_PUBLIC_UNLIMIT_MERCHANTID || "fc2a8e28-b15e-4ea8-8167-16859e9ba73d"
    }&wallet=${connectedAddress}&cryptoCurrency=ETH&fiatCurrency=BRL&cryptoAmount=${withdrawAmount}&externalId=${crypto
      .randomBytes(32)
      .toString("hex")}`;
    window.open(url, "_blank");
  };

  // FIXME
  // if (!isConnected) {
  //   redirect("/");
  // }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {isConnected && (
        <>
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Convert Your Crypto to Fiat</span>
          </h1>
          {/* Display Wallet Balance here */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <span>Wallet Balance: </span>
            <Balance address={connectedAddress} className="min-h-0 h-auto" />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <input
              type="number"
              placeholder="How much do you want to withdraw?"
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "310px",
              }}
              onChange={e => setWithdrawAmount(Number(e.target.value))}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <button
              onClick={handleHostedFlowClick}
              style={{
                background: "rgb(201, 247, 58)",
                border: "none",
                borderRadius: "5px",
                padding: "10px 20px",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "0.3s",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                fontWeight: "bold",
                color: "black",
              }}
              onMouseOver={e => (e.currentTarget.style.opacity = "0.7")}
              onMouseOut={e => (e.currentTarget.style.opacity = "1")}
            >
              Withdraw Funds
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OfframpExample;
