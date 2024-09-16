import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, firestore } from "../../firebase";
import { Usuario } from "../../model/Usuario";

const SignUp = () => {
  const [formUsuario, setFormUsuario] = useState<Partial<Usuario>>({});
  const [error, setError] = useState("");

  const refUsuario = firestore.collection("Usuario");

  const navigation = useNavigation();

  const register = () => {
    auth
      .createUserWithEmailAndPassword(formUsuario.email, formUsuario.password)
      .then((userCredentials) => {
        const user = userCredentials.user;

        const refWithIdUsuario = refUsuario.doc(auth.currentUser.uid);

        refWithIdUsuario.set({
          id: auth.currentUser.uid,
          name: formUsuario.name,
          email: formUsuario.email,
          phone: formUsuario.phone,
          isAdmin: false,
        });
      })
      .catch((error) =>
        setError(
          !formUsuario.name ||
            !formUsuario.email ||
            !formUsuario.password ||
            !formUsuario.phone
            ? "Algum campo está incompleto"
            : error.message
        )
      )
      .finally(() => {
        setTimeout(() => {
          setError("");
        }, 3000);
      });
  };

  const SignIn = () => {
    navigation.navigate("SignIn");
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputsContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nome</Text>
          <TextInput
            placeholder="Felipe"
            value={formUsuario.nome}
            onChangeText={(name) =>
              setFormUsuario({
                ...formUsuario,
                name: name,
              })
            }
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            placeholder="exemplo@gmail.com"
            value={formUsuario.email}
            onChangeText={(email) =>
              setFormUsuario({
                ...formUsuario,
                email: email,
              })
            }
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Senha</Text>
          <TextInput
            placeholder="*******"
            value={formUsuario.password}
            secureTextEntry={true}
            onChangeText={(password) =>
              setFormUsuario({
                ...formUsuario,
                password: password,
              })
            }
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Celular</Text>
          <TextInput
            placeholder="(00) 99999-9999"
            value={formUsuario.phone}
            onChangeText={(phone) => {
              // Remove caracteres não numéricos do texto
              let formattedText = phone.replace(/[^\d]/g, "");

              // Formata o telefone conforme necessário
              if (formattedText.length === 11) {
                formattedText = formattedText.replace(
                  /(\d{2})(\d{5})(\d{4})/,
                  "($1) $2-$3"
                );
              }

              setFormUsuario({
                ...formUsuario,
                phone: formattedText,
              });
            }}
            style={styles.input}
            maxLength={15}
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={register} style={styles.button}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>Já tem uma conta? </Text>
          <TouchableOpacity
            onPress={SignIn}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

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
    paddingHorizontal: 24,
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
