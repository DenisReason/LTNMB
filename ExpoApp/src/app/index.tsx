import { useState, useEffect } from "react";
import mqtt from "mqtt";
import LoginScreen from "../components/LoginScreen";
import HomeScreen from "../components/HomeScreen";

const HOST = "wss://fd69116e.ala.asia-southeast1.emqxsl.com:8084/mqtt";

export default function App() {
  const [client, setClient] = useState(null);
  const [status, setStatus] = useState("Chưa kết nối");

  const dangNhap = (username, password) => {
    if (client) return;
    setStatus("Đang kết nối...");
    const c = mqtt.connect(HOST, {
      clientId: "app_" + Math.random().toString(16).substring(2, 8),
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 0,          // sai pass thì báo lỗi 1 lần, không lặp
      username,                    // ← user nhập
      password,                    // ← user nhập
    });
    setClient(c);
  };

  useEffect(() => {
    if (!client) return;
    const onConnect = () => setStatus("Đã kết nối");
    const onError = () => {
      setStatus("Sai tài khoản hoặc mật khẩu");
      client.end(true);
      setClient(null);             // reset để nhập lại
    };
    client.on("connect", onConnect);
    client.on("error", onError);
    return () => {
      client.removeListener("connect", onConnect);
      client.removeListener("error", onError);
    };
  }, [client]);

  const dangXuat = () => {
    if (client) client.end(true);
    setClient(null);
    setStatus("Chưa kết nối");
  };

  if (status !== "Đã kết nối") {
    return <LoginScreen status={status} onSubmit={dangNhap} />;
  }
  return <HomeScreen client={client} onLogout={dangXuat} />;
}