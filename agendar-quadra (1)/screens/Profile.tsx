import { useNavigation } from "@react-navigation/core";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, firestore } from "../firebase";
import { Usuario } from "../model/Usuario";

const Profile = () => {
  const [user, setUser] = useState<Usuario>();
  const navigation = useNavigation();
  const refUsuario = firestore.collection("Usuario");

  useEffect(() => {
    firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
      .get()
      .then((user) => {
        setUser(user.data() as Usuario);
      })
      .catch((error) => {
        console.error("Erro ao buscar documento:", error);
      });
  }, []);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("SignIn");
      })
      .catch((error) => alert(error.message));
  };

  if (user) {
    return (
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            style={{ height: 80, width: 80, borderRadius: 999 }}
            source={{
              uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
            }}
          />
          <View style={{ gap: 4 }}>
            <View style={styles.profileName}>
              <Text style={{ fontSize: 18 }}>{user.name} </Text>
              <View style={styles.profileBadge}>
                <Text style={{ color: "#fff" }}>
                  {user.isAdmin == true ? "Admin" : "Usuario"}
                </Text>
              </View>
            </View>

            <Text style={styles.profileEmail}>{user.email}</Text>
            <Text style={styles.profilePhone}>{user.phone}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  profileContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  profileName: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  profileBadge: {
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 2,
    backgroundColor: "#225aeb",
    borderRadius: 999,
  },
  profileEmail: {
    fontSize: 14,
    color: "#959595",
  },
  profilePhone: {
    fontSize: 12,
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
