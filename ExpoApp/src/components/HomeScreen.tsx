import { useState ,useEffect} from "react";
import { View, Text, TextInput, Pressable } from "react-native";


export default function HomeScreen({ client, onLogout }) {
  const [devices, setDevices] = useState([
    { title: "Thiết bị 1", on: false },
    { title: "Thiết bị 2", on: false },
    { title: "Thiết bị 3", on: false },
  ]);
  const [fan, setFan] = useState("");

  useEffect(() => {
  if (!client) return;

  client.subscribe("home/device1");
  client.subscribe("home/device2");
  client.subscribe("home/device3");
  client.subscribe("home/fan");

  const onMessage = (topic, payload) => {
    const value = payload.toString();

    if (topic === "home/fan") {
      setFan(value);
      return;
    }
    // topic dạng "home/device2" -> lấy số 2 -> index 1
    const index = Number(topic.replace("home/device", "")) - 1;
    setDevices((truocDo) =>
      truocDo.map((d, idx) => (idx === index ? { ...d, on: value === "ON" } : d))
    );
  };

  client.on("message", onMessage);
  return () => client.removeListener("message", onMessage);   // dọn khi rời màn
}, [client]);

  const doiTen = (i, text) =>
    setDevices(devices.map((d, idx) => (idx === i ? { ...d, title: text } : d)));

  const batTat = (i) => {
    const moi = devices.map((d, idx) => (idx === i ? { ...d, on: !d.on } : d));
    setDevices(moi);
    client.publish("home/device" + (i + 1), moi[i].on ? "ON" : "OFF");
  };

  const chinhQuat = (muc) => {
    setFan(muc);
    client.publish("home/fan", muc);
  };

  return (
    <View style={{ flex: 1, padding: 20, paddingTop: 60 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Nhà của tôi</Text>

      <Pressable onPress={onLogout} style={{ backgroundColor: "#ef4444", padding: 10, marginBottom: 16 }}>
        <Text style={{ color: "#fff", textAlign: "center" }}>Đăng xuất</Text>
      </Pressable>

      {devices.map((d, i) => (
        <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <TextInput
            value={d.title}
            onChangeText={(text) => doiTen(i, text)}
            style={{ flex: 1, borderWidth: 1, padding: 8, marginRight: 8 }}
          />
          <Pressable onPress={() => batTat(i)}
            style={{ padding: 10, backgroundColor: d.on ? "#22c55e" : "#e5e7eb" }}>
            <Text>{d.on ? "BẬT" : "TẮT"}</Text>
          </Pressable>
        </View>
      ))}

      <Text style={{ marginTop: 20, marginBottom: 8 }}>Tốc độ quạt:</Text>
      <View style={{ flexDirection: "row" }}>
        {["Tắt","Yếu", "Vừa", "Mạnh", ].map((muc) => (
          <Pressable key={muc} onPress={() => chinhQuat(muc)}
            style={{ flex: 1, padding: 12, marginRight: 8, backgroundColor: fan === muc ? "#2563eb" : "#e5e7eb" }}>
            <Text style={{ textAlign: "center", color: fan === muc ? "#fff" : "#000" }}>{muc}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}