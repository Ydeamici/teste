import { useNavigation } from "@react-navigation/core";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../firebase";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Menu");
      }
    });

    return unsubscribe;
  }, []);

  const Register = () => {
    navigation.navigate("SignUp");
  };

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
      })
      .catch((error) =>
        setError(
          !email || !password ? "Algum campo está incompleto" : error.message
        )
      )
      .finally(() => {
        setTimeout(() => {
          setError("");
        }, 3000);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputsContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            placeholder="exemplo@gmail.com"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Senha</Text>
          <TextInput
            placeholder="*******"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.checkboxContainer}>
          <Checkbox
            disabled={false}
            value={rememberMe}
            color={"#225aeb"}
            onValueChange={(newValue) => setRememberMe(newValue)}
          />
          <Text style={styles.checkboxLabel}>Lembrar de mim?</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>Não tem nenhuma conta? </Text>
          <TouchableOpacity
            onPress={Register}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  inputsContainer: {
    width: "100%",
    padding: 24,
    gap: 24,
  },
  inputContainer: {
    width: "100%",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#959595",
  },
  input: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  errorText: {
    color: "#ff0839",
  },
  checkboxContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#959595",
  },
  buttonsContainer: {
    alignItems: "center",
    width: "100%",
    padding: 24,
    gap: 8,
  },
  button: {
    backgroundColor: "#225aeb",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    width: "auto",
    backgroundColor: "transparent",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#225aeb",
    fontWeight: "700",
    fontSize: 16,
  },
});
