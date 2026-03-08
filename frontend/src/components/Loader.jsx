import { useEffect } from "react";
import "../styles/loader.css";

export default function Loader({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="space-container">
      <div className="stars"></div>

      <div className="orbit orbit1">
        <div className="planet planet1"></div>
      </div>

      <div className="orbit orbit2">
        <div className="planet planet2"></div>
      </div>

      <div className="center-star"></div>

      <h1 className="logo">DocuMint</h1>
    </div>
  );
}