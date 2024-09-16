import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, firestore } from "../../firebase";
import { Agendamento } from "../../model/Agendamento";
import { Quadra } from "../../model/Quadra";

const GerenciarAgendamento = () => {
  const [formAgendamento, setFormAgendamento] = useState<Partial<Agendamento>>(
    {}
  );
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [estaEditando, setEstaEditando] = useState(false);
  const navigation = useNavigation();
  const [tab, setTab] = useState(0);

  const agendamentoRef = firestore
    .collection("User")
    .doc(auth.currentUser?.uid)
    .collection("Agendamento");

  const quadraRef = firestore
    .collection("User")
    .doc(auth.currentUser?.uid)
    .collection("Quadra");

  const limparFormulario = () => {
    setFormAgendamento({});
  };

  const cancelar = () => {
    limparFormulario();
    setEstaEditando(false);
  };

  const trocarTab = (tab: number, editando: boolean) => {
    limparFormulario();
    setTab(tab);
    setEstaEditando(editando);
  };

  const salvar = async () => {
    const agendamento = new Agendamento({
      ...formAgendamento,
      usuarioId: auth.currentUser?.uid,
      endTime: (Number(formAgendamento.startTime) + 1).toString(),
      status: "pending",
    });

    if (!agendamento.id) {
      const agendamentoRefComId = agendamentoRef.doc();
      agendamento.id = agendamentoRefComId.id;

      await agendamentoRefComId.set(agendamento.toFirestore());
      Alert.alert("Agendamento adicionado!");
    } else {
      const agendamentoRefComId = agendamentoRef.doc(agendamento.id);
      await agendamentoRefComId.update(agendamento.toFirestore());
      Alert.alert("Agendamento atualizado!");
    }

    limparFormulario();
  };

  const editarAgendamento = async (agendamento: Agendamento) => {
    setEstaEditando(true);
    const docSnapshot = await agendamentoRef.doc(agendamento.id).get();
    setFormAgendamento(
      new Agendamento(docSnapshot.data() as Partial<Agendamento>)
    );
  };

  const deleteAgendamento = async (agendamento: Agendamento) => {
    Alert.alert(
      `Apagar agendamento "${agendamento.id}?" `,
      "Essa ação não pode ser desfeita!",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            await agendamentoRef.doc(agendamento.id).delete();
            Alert.alert("Agendamento excluído!");
            setIsRefreshing(true);
          },
        },
      ]
    );
  };

  useEffect(() => {
    const subscriber = agendamentoRef.onSnapshot((querySnapshot) => {
      const agendamentos: Agendamento[] = [];
      querySnapshot.forEach((documentSnapshot) => {
        agendamentos.push({
          ...documentSnapshot.data(),
          id: documentSnapshot.id,
        } as Agendamento);
      });
      setAgendamentos(agendamentos);

      quadraRef.onSnapshot((querySnapshot) => {
        const quadras: Quadra[] = [];
        querySnapshot.forEach((documentSnapshot) => {
          quadras.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          } as Quadra);
        });

        setQuadras(quadras);
      });
    });

    setLoading(false);
    setIsRefreshing(false);

    return () => subscriber();
  }, []);

  const renderAgendamentos = ({ item }: { item: Agendamento }) => (
    <View style={styles.itemContainer} key={item.id}>
      <TouchableOpacity
        onLongPress={() => deleteAgendamento(item)}
        onPress={() => editarAgendamento(item)}
      >
        <View style={styles.rowAlignment}>
          <View style={styles.columnAlignment}>
            <Text style={styles.itemName}>Quadra: {item.quadraId}</Text>
            <Text style={styles.itemName}>Data: {item.date}</Text>
            <Text style={styles.itemName}>
              Horario de inicio: {item.startTime}
            </Text>
            <Text style={styles.itemName}>Horario de fim: {item.endTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View
        style={{
          ...styles.rowAlignment,
          paddingHorizontal: 24,
          marginBottom: 32,
        }}
      >
        <TouchableOpacity
          onPress={() => trocarTab(0, false)}
          style={styles.tabButton}
        >
          <Text>Criar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => trocarTab(1, false)}
          style={styles.tabButton}
        >
          <Text>Editar</Text>
        </TouchableOpacity>
      </View>
      {tab === 0 ? (
        <>
          <View style={styles.inputsContainer}>
            <Picker
              selectedValue={formAgendamento.quadraId}
              onValueChange={(itemValue) =>
                setFormAgendamento({ ...formAgendamento, quadraId: itemValue })
              }
              style={styles.input}
            >
              {quadras.map((quadra) => (
                <Picker.Item
                  key={quadra.id}
                  label={quadra.name}
                  value={quadra.id}
                />
              ))}
            </Picker>
            <TextInput
              placeholder="Data"
              style={styles.input}
              value={formAgendamento.date}
              onChangeText={(date) =>
                setFormAgendamento({ ...formAgendamento, date })
              }
            />
            <TextInput
              placeholder="Hora"
              style={styles.input}
              value={formAgendamento.startTime}
              onChangeText={(startTime) =>
                setFormAgendamento({ ...formAgendamento, startTime })
              }
            />
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={salvar} style={styles.button}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={cancelar} style={styles.buttonOutline}>
              <Text style={styles.buttonOutlineText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <FlatList
            data={agendamentos}
            renderItem={renderAgendamentos}
            keyExtractor={(item) => item.id.toString()}
            refreshing={isRefreshing}
          />
          {estaEditando && (
            <>
              <View style={styles.inputsContainer}>
                <Picker
                  selectedValue={quadras.filter((quadras) =>
                    quadras.id.includes(formAgendamento.quadraId)
                  )}
                  onValueChange={(itemValue) =>
                    setFormAgendamento({
                      ...formAgendamento,
                      quadraId: itemValue[0].id,
                    })
                  }
                  style={styles.input}
                >
                  {quadras.map((quadra) => (
                    <Picker.Item
                      key={quadra.id}
                      label={quadra.name}
                      value={quadra.id}
                    />
                  ))}
                </Picker>
                <TextInput
                  placeholder="Data"
                  style={styles.input}
                  value={formAgendamento.date}
                  onChangeText={(date) =>
                    setFormAgendamento({ ...formAgendamento, date })
                  }
                />
                <TextInput
                  placeholder="Hora"
                  style={styles.input}
                  value={formAgendamento.startTime}
                  onChangeText={(startTime) =>
                    setFormAgendamento({ ...formAgendamento, startTime })
                  }
                />
                <TouchableOpacity onPress={salvar} style={styles.button}>
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={cancelar}
                  style={styles.buttonOutline}
                >
                  <Text style={styles.buttonOutlineText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default GerenciarAgendamento;

const styles = StyleSheet.create({
  tabButton: {
    width: "50%",

    height: 42,

    borderRadius: 10,

    borderWidth: 2,

    borderColor: "#225aeb",

    alignItems: "center",

    justifyContent: "center",

    marginRight: 5,

    marginBottom: 5,

    paddingHorizontal: 12,
  },

  itemContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  itemName: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  itemBadge: {
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 2,
    backgroundColor: "#225aeb",
    borderRadius: 999,
  },
  photoContainer: {
    width: "100%",
    alignItems: "center",
  },
  tableContainer: {
    width: "100%",
    padding: 24,
    gap: 24,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  tableColumn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 12,
  },
  tableCell: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    marginBottom: 24,
    paddingLeft: 12,
  },
  tableHorarios: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  tableButton: {
    width: "auto",
    height: 42,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#225aeb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
    marginBottom: 5,
    paddingHorizontal: 12,
  },
  tableButtonText: {
    color: "#225aeb",
  },
  container: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#fff",
    paddingTop: 24,
  },

  image: {
    width: 100,

    height: 100,

    borderRadius: 10,

    marginBottom: 20,

    backgroundColor: "#225aeb",
  },

  inputsContainer: {
    width: "100%",

    padding: 24,

    gap: 24,
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
    width: "100%",
    backgroundColor: "#225aeb",

    padding: 15,

    borderRadius: 10,

    alignItems: "center",
  },

  buttonOutline: {
    width: "auto",

    padding: 15,

    backgroundColor: "transparent",
  },
  buttonSelected: {
    backgroundColor: "#0d3391",
  },

  buttonText: {
    color: "#fff",

    fontWeight: "700",

    fontSize: 16,
  },

  buttonOutlineText: {
    color: "#225aeb",

    fontWeight: "700",

    fontSize: 16,
  },

  item: {
    width: "100%",
    padding: 10,

    borderBottomWidth: 1,

    borderBottomColor: "#ccc",
  },

  rowAlignment: {
    flexDirection: "row",

    alignItems: "center",
  },

  columnAlignment: {
    flexDirection: "column",

    marginLeft: 10,
  },

  title: {
    fontSize: 16,

    fontWeight: "bold",
  },
});
