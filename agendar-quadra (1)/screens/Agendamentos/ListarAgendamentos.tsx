import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, firestore } from "../../firebase";
import { Agendamento } from "../../model/Agendamento";

const ListarAgendamentos = () => {
  const [loading, setLoading] = useState(true);
  const [agendamentos, setAgendadamentos] = useState<Agendamento[]>([]);
  const agendamentoRef = firestore
    .collection("User")
    .doc(auth.currentUser?.uid)
    .collection("Agendamento");

  useEffect(() => {
    const subscriber = agendamentoRef.onSnapshot((querySnapshot) => {
      const agendamentos = [];
      querySnapshot.forEach((documentSnapshot) => {
        agendamentos.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });
      setAgendadamentos(agendamentos);
      setLoading(false);
    });
    return () => subscriber();
  }, [agendamentos]);

  if (loading) {
    return <ActivityIndicator />;
  }

  const Item = ({ item }) => (
    <View style={styles.itemContainer} key={item.id}>
      <View
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <View style={styles.itemName}>
            <Text style={{ fontSize: 18 }}>
              Quadra:
              {item.quadraId}
            </Text>
            <View style={styles.itemBadge}>
              <Text style={{ color: "#fff" }}>{item.status}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.itemName}>Data: {item.date}</Text>
        <Text style={styles.itemName}>Horario de inicio: {item.startTime}</Text>
        <Text style={styles.itemName}>Horario de fim: {item.endTime}</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => <Item item={item} />;

  return (
    <SafeAreaView>
      <FlatList
        data={agendamentos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ padding: 24, gap: 12 }}
      />
    </SafeAreaView>
  );
};

export default ListarAgendamentos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  itemName: {
    flexDirection: "column",
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
