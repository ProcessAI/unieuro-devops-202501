import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectMessage, setReconnectMessage] = useState("Reconectando.");

  useEffect(() => {
    let ws: WebSocket;
    const connect = () => {
      if (socket) socket.close();

      ws = new WebSocket("ws://localhost:3333");

      ws.onopen = () => {
        setIsConnected(true);
        console.log("✅ Conectado ao WebSocket");
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log("❌ Desconectado. Tentando reconectar...");
        setTimeout(connect, 3000);
      };

      ws.onerror = (error) => console.error("⚠️ Erro WebSocket:", error);

      setSocket(ws);
    };

    connect();
    return () => ws && ws.close();
  }, []);

  useEffect(() => {
    if (!isConnected) {
      const interval = setInterval(() => {
        setReconnectMessage((prev) => {
          if (prev === "reconecta.") return "reconecta..";
          if (prev === "reconecta..") return "reconecta...";
          return "reconecta.";
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isConnected]);

  return (
    <div>
      {/* {!isConnected && (
        <div style={{ 
          position: "fixed", top: 0, width: "100%", textAlign: "center",
          backgroundColor: "red", color: "white", padding: "10px", fontSize: "16px"
        }}>
          ⚠️ Você está sem conexão com o servidor! Tentando {reconnectMessage}
        </div>
      )} */}
      <Component {...pageProps} />
    </div>
  );
}
