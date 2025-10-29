import React from "react";
import BuyCredits from "./BuyCredits";

export default function App() {
  return (
    <div className="App" style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>AI Token Pay</h1>
      <p>Buy AI model credits using ERC-20 tokens</p>
      <BuyCredits />
    </div>
  );
}
