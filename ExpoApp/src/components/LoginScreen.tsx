import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

export default function LoginScreen({ status, onSubmit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text>Username:</Text>
      <TextInput value={username} onChangeText={setUsername} autoCapitalize="none"
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }} />
      <Text>Password:</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }} />
      <Pressable onPress={() => onSubmit(username, password)} style={{ backgroundColor: "#2563eb", padding: 12 }}>
        <Text style={{ color: "#fff", textAlign: "center" }}>Submit</Text>
      </Pressable>
      <Text style={{ marginTop: 12 }}>{status}</Text>
    </View>
  );
}