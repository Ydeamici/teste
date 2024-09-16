import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, firestore } from "../../firebase";
import { Quadra } from "../../model/Quadra";

const ListarQuadras = () => {
  const [loading, setLoading] = useState(true);
  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const quadraRef = firestore
    .collection("User")
    .doc(auth.currentUser?.uid)
    .collection("Quadra");

  useEffect(() => {
    const subscriber = quadraRef.onSnapshot((querySnapshot) => {
      const quadras = [];
      querySnapshot.forEach((documentSnapshot) => {
        quadras.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });
      setQuadras(quadras);
      setLoading(false);
    });
    return () => subscriber();
  }, [quadras]);

  if (loading) {
    return <ActivityIndicator />;
  }

  const Item = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.rowAlignment}>
        <Image
          style={{ height: 80, width: 80, borderRadius: 10 }}
          source={{ uri: item.photo }}
        />

        <View style={styles.columnAlignment}>
          <Text style={styles.itemName}>Nome: {item.name}</Text>
          <Text style={styles.itemName}>Local: {item.location}</Text>
          <Text style={styles.itemName}>Tipo: {item.type}</Text>
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item }) => <Item item={item} />;

  return (
    <SafeAreaView>
      <FlatList
        data={quadras}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ padding: 24, gap: 12 }}
      />
    </SafeAreaView>
  );
};

export default ListarQuadras;

const styles = StyleSheet.create({
  rowAlignment: {
    flexDirection: "row",

    alignItems: "center",
  },

  columnAlignment: {
    flexDirection: "column",

    marginLeft: 10,
  },
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    width: "100%",
    padding: 10,

    borderBottomWidth: 1,

    borderBottomColor: "#ccc",
  },
  itemName: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 8,
  },
  itemBadge: {
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 2,
    backgroundColor: "#225aeb",
    borderRadius: 999,
  },
});
