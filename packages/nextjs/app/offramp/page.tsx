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
            <span className="block font-semibold text-2xl mt-12 mb-2">Convert Your Crypto to Fiat</span>
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
                color: "rgb(156 163 175",
                backgroundColor: "#fff",
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onMouseOver={e => (e.currentTarget.style.opacity = "0.7")}
              onMouseOut={e => (e.currentTarget.style.opacity = "1")}
            >
              Get Paid
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OfframpExample;
