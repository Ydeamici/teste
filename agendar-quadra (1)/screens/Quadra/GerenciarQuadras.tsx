import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { auth, firestore, storage } from "../../firebase";
import { Quadra } from "../../model/Quadra";

const GerenciarQuadras = (props) => {
  // Estado do formulário de quadra
  const [quadraForm, setQuadraForm] = useState<Partial<Quadra>>({});

  const [tab, setTab] = useState(0);

  // Navegação
  const navigation = useNavigation();

  // Lista de quadras
  const [quadras, setQuadras] = useState<Quadra[]>([]);

  // Carregamento
  const [carregando, setCarregando] = useState(true);

  // Atualização
  const [estaAtualizando, setEstaAtualizando] = useState(true);
  const [estaEditando, setEstaEditando] = useState(false);

  // Caminho da imagem selecionada
  const [caminhoImagemPicker, setCaminhoImagemPicker] = useState("");

  // Tipo de quadra

  const [tipoQuadra, setTipoQuadra] = useState("Indoor");

  const [horarios, setHorarios] = useState({
    segunda: [
      { hour: "08:00", status: false },
      { hour: "09:00", status: false },
      { hour: "10:00", status: false },
      { hour: "11:00", status: false },
      { hour: "12:00", status: false },
      { hour: "13:00", status: false },
      { hour: "14:00", status: false },
      { hour: "15:00", status: false },
      { hour: "16:00", status: false },
      { hour: "17:00", status: false },
      { hour: "18:00", status: false },
      { hour: "19:00", status: false },
    ],

    terca: [
      { hour: "08:00", status: false },
      { hour: "09:00", status: false },
      { hour: "10:00", status: false },
      { hour: "11:00", status: false },
      { hour: "12:00", status: false },
      { hour: "13:00", status: false },
      { hour: "14:00", status: false },
      { hour: "15:00", status: false },
      { hour: "16:00", status: false },
      { hour: "17:00", status: false },
      { hour: "18:00", status: false },
      { hour: "19:00", status: false },
    ],

    quarta: [
      { hour: "08:00", status: false },
      { hour: "09:00", status: false },
      { hour: "10:00", status: false },
      { hour: "11:00", status: false },
      { hour: "12:00", status: false },
      { hour: "13:00", status: false },
      { hour: "14:00", status: false },
      { hour: "15:00", status: false },
      { hour: "16:00", status: false },
      { hour: "17:00", status: false },
      { hour: "18:00", status: false },
      { hour: "19:00", status: false },
    ],

    quinta: [
      { hour: "08:00", status: false },
      { hour: "09:00", status: false },
      { hour: "10:00", status: false },
      { hour: "11:00", status: false },
      { hour: "12:00", status: false },
      { hour: "13:00", status: false },
      { hour: "14:00", status: false },
      { hour: "15:00", status: false },
      { hour: "16:00", status: false },
      { hour: "17:00", status: false },
      { hour: "18:00", status: false },
      { hour: "19:00", status: false },
    ],

    sexta: [
      { hour: "08:00", status: false },
      { hour: "09:00", status: false },
      { hour: "10:00", status: false },
      { hour: "11:00", status: false },
      { hour: "12:00", status: false },
      { hour: "13:00", status: false },
      { hour: "14:00", status: false },
      { hour: "15:00", status: false },
      { hour: "16:00", status: false },
      { hour: "17:00", status: false },
      { hour: "18:00", status: false },
      { hour: "19:00", status: false },
    ],

    sabado: [
      { hour: "08:00", status: false },
      { hour: "09:00", status: false },
      { hour: "10:00", status: false },
      { hour: "11:00", status: false },
      { hour: "12:00", status: false },
      { hour: "13:00", status: false },
      { hour: "14:00", status: false },
      { hour: "15:00", status: false },
      { hour: "16:00", status: false },
      { hour: "17:00", status: false },
      { hour: "18:00", status: false },
      { hour: "19:00", status: false },
    ],
  });
  const handleSelectHorario = (dia, horario) => {
    const newHorarios = { ...horarios };

    const index = newHorarios[dia].findIndex((h) => h.hour === horario);

    if (index !== -1) {
      newHorarios[dia][index].status = !newHorarios[dia][index].status;
    }

    setHorarios(newHorarios);
  };

  const handleTipoQuadra = (tipo: string) => {
    setTipoQuadra(tipo);

    setQuadraForm({ ...quadraForm, type: tipo });
  };

  useEffect(() => {
    setQuadraForm({
      ...quadraForm,
      operatingHours: [
        { day: "segunda", hours: horarios.segunda },
        { day: "terça", hours: horarios.terca },
        { day: "quarta", hours: horarios.quarta },
        { day: "quinta", hours: horarios.quinta },
        { day: "sexta", hours: horarios.sexta },
        { day: "sabado", hours: horarios.sabado },
      ],
    });
  }, [horarios && estaEditando == false]);

  // Referência da coleção de quadras
  const referenciaQuadra = firestore
    .collection("User")
    .doc(auth.currentUser?.uid)
    .collection("Quadra");

  // Limpar formulário
  const limparFormulario = () => {
    setQuadraForm({});
    setHorarios({
      segunda: [
        { hour: "08:00", status: false },
        { hour: "09:00", status: false },
        { hour: "10:00", status: false },
        { hour: "11:00", status: false },
        { hour: "12:00", status: false },
        { hour: "13:00", status: false },
        { hour: "14:00", status: false },
        { hour: "15:00", status: false },
        { hour: "16:00", status: false },
        { hour: "17:00", status: false },
        { hour: "18:00", status: false },
        { hour: "19:00", status: false },
      ],

      terca: [
        { hour: "08:00", status: false },
        { hour: "09:00", status: false },
        { hour: "10:00", status: false },
        { hour: "11:00", status: false },
        { hour: "12:00", status: false },
        { hour: "13:00", status: false },
        { hour: "14:00", status: false },
        { hour: "15:00", status: false },
        { hour: "16:00", status: false },
        { hour: "17:00", status: false },
        { hour: "18:00", status: false },
        { hour: "19:00", status: false },
      ],

      quarta: [
        { hour: "08:00", status: false },
        { hour: "09:00", status: false },
        { hour: "10:00", status: false },
        { hour: "11:00", status: false },
        { hour: "12:00", status: false },
        { hour: "13:00", status: false },
        { hour: "14:00", status: false },
        { hour: "15:00", status: false },
        { hour: "16:00", status: false },
        { hour: "17:00", status: false },
        { hour: "18:00", status: false },
        { hour: "19:00", status: false },
      ],

      quinta: [
        { hour: "08:00", status: false },
        { hour: "09:00", status: false },
        { hour: "10:00", status: false },
        { hour: "11:00", status: false },
        { hour: "12:00", status: false },
        { hour: "13:00", status: false },
        { hour: "14:00", status: false },
        { hour: "15:00", status: false },
        { hour: "16:00", status: false },
        { hour: "17:00", status: false },
        { hour: "18:00", status: false },
        { hour: "19:00", status: false },
      ],

      sexta: [
        { hour: "08:00", status: false },
        { hour: "09:00", status: false },
        { hour: "10:00", status: false },
        { hour: "11:00", status: false },
        { hour: "12:00", status: false },
        { hour: "13:00", status: false },
        { hour: "14:00", status: false },
        { hour: "15:00", status: false },
        { hour: "16:00", status: false },
        { hour: "17:00", status: false },
        { hour: "18:00", status: false },
        { hour: "19:00", status: false },
      ],

      sabado: [
        { hour: "08:00", status: false },
        { hour: "09:00", status: false },
        { hour: "10:00", status: false },
        { hour: "11:00", status: false },
        { hour: "12:00", status: false },
        { hour: "13:00", status: false },
        { hour: "14:00", status: false },
        { hour: "15:00", status: false },
        { hour: "16:00", status: false },
        { hour: "17:00", status: false },
        { hour: "18:00", status: false },
        { hour: "19:00", status: false },
      ],
    });
    setCaminhoImagemPicker("");
  };

  const trocarTab = (tab, editando) => {
    setQuadraForm({});
    setTab(tab);
    setEstaEditando(editando);
    setHorarios({
      segunda: [
        { hour: "08:00", status: false },
        { hour: "09:00", status: false },
        { hour: "10:00", status: false },
        { hour: "11:00", status: false },
        { hour: "12:00", status: false },
        { hour: "13:00", status: false },
        { hour: "14:00", status: false },
        { hour: "15:00", status: false },
        { hour: "16:00", status: false },
        { hour: "17:00", status: false },
        { hour: "18:00", status: false },
        { hour: "19:00", status: false },
      ],

      terca: [
        { hour: "08:00", status: false },
        { hour: "09:00", status: false },
        { hour: "10:00", status: false },
        { hour: "11:00", status: false },
        { hour: "12:00", status: false },
        { hour: "13:00", status: false },
        { hour: "14:00", status: false },
        { hour: "15:00", status: false },
        { hour: "16:00", status: false },
        { hour: "17:00", status: false },
        { hour: "18:00", status: false },
        { hour: "19:00", status: false },
      ],

      quarta: [
        { hour: "08:00", status: false },
        { hour: "09:00", status: false },
        { hour: "10:00", status: false },
        { hour: "11:00", status: false },
        { hour: "12:00", status: false },
        { hour: "13:00", status: false },
        { hour: "14:00", status: false },
        { hour: "15:00", status: false },
        { hour: "16:00", status: false },
        { hour: "17:00", status: false },
        { hour: "18:00", status: false },
        { hour: "19:00", status: false },
      ],

      quinta: [
        { hour: "08:00", status: false },
        { hour: "09:00", status: false },
        { hour: "10:00", status: false },
        { hour: "11:00", status: false },
        { hour: "12:00", status: false },
        { hour: "13:00", status: false },
        { hour: "14:00", status: false },
        { hour: "15:00", status: false },
        { hour: "16:00", status: false },
        { hour: "17:00", status: false },
        { hour: "18:00", status: false },
        { hour: "19:00", status: false },
      ],

      sexta: [
        { hour: "08:00", status: false },
        { hour: "09:00", status: false },
        { hour: "10:00", status: false },
        { hour: "11:00", status: false },
        { hour: "12:00", status: false },
        { hour: "13:00", status: false },
        { hour: "14:00", status: false },
        { hour: "15:00", status: false },
        { hour: "16:00", status: false },
        { hour: "17:00", status: false },
        { hour: "18:00", status: false },
        { hour: "19:00", status: false },
      ],

      sabado: [
        { hour: "08:00", status: false },
        { hour: "09:00", status: false },
        { hour: "10:00", status: false },
        { hour: "11:00", status: false },
        { hour: "12:00", status: false },
        { hour: "13:00", status: false },
        { hour: "14:00", status: false },
        { hour: "15:00", status: false },
        { hour: "16:00", status: false },
        { hour: "17:00", status: false },
        { hour: "18:00", status: false },
        { hour: "19:00", status: false },
      ],
    });
    setCaminhoImagemPicker("");
  };

  // Cancelar
  const cancelar = () => {
    setQuadraForm({});
    setHorarios({
      segunda: [
        { hour: "08:00", status: false },
        { hour: "09:00", status: false },
        { hour: "10:00", status: false },
        { hour: "11:00", status: false },
        { hour: "12:00", status: false },
        { hour: "13:00", status: false },
        { hour: "14:00", status: false },
        { hour: "15:00", status: false },
        { hour: "16:00", status: false },
        { hour: "17:00", status: false },
        { hour: "18:00", status: false },
        { hour: "19:00", status: false },
      ],

      terca: [
        { hour: "08:00", status: false },
        { hour: "09:00", status: false },
        { hour: "10:00", status: false },
        { hour: "11:00", status: false },
        { hour: "12:00", status: false },
        { hour: "13:00", status: false },
        { hour: "14:00", status: false },
        { hour: "15:00", status: false },
        { hour: "16:00", status: false },
        { hour: "17:00", status: false },
        { hour: "18:00", status: false },
        { hour: "19:00", status: false },
      ],

      quarta: [
        { hour: "08:00", status: false },
        { hour: "09:00", status: false },
        { hour: "10:00", status: false },
        { hour: "11:00", status: false },
        { hour: "12:00", status: false },
        { hour: "13:00", status: false },
        { hour: "14:00", status: false },
        { hour: "15:00", status: false },
        { hour: "16:00", status: false },
        { hour: "17:00", status: false },
        { hour: "18:00", status: false },
        { hour: "19:00", status: false },
      ],

      quinta: [
        { hour: "08:00", status: false },
        { hour: "09:00", status: false },
        { hour: "10:00", status: false },
        { hour: "11:00", status: false },
        { hour: "12:00", status: false },
        { hour: "13:00", status: false },
        { hour: "14:00", status: false },
        { hour: "15:00", status: false },
        { hour: "16:00", status: false },
        { hour: "17:00", status: false },
        { hour: "18:00", status: false },
        { hour: "19:00", status: false },
      ],

      sexta: [
        { hour: "08:00", status: false },
        { hour: "09:00", status: false },
        { hour: "10:00", status: false },
        { hour: "11:00", status: false },
        { hour: "12:00", status: false },
        { hour: "13:00", status: false },
        { hour: "14:00", status: false },
        { hour: "15:00", status: false },
        { hour: "16:00", status: false },
        { hour: "17:00", status: false },
        { hour: "18:00", status: false },
        { hour: "19:00", status: false },
      ],

      sabado: [
        { hour: "08:00", status: false },
        { hour: "09:00", status: false },
        { hour: "10:00", status: false },
        { hour: "11:00", status: false },
        { hour: "12:00", status: false },
        { hour: "13:00", status: false },
        { hour: "14:00", status: false },
        { hour: "15:00", status: false },
        { hour: "16:00", status: false },
        { hour: "17:00", status: false },
        { hour: "18:00", status: false },
        { hour: "19:00", status: false },
      ],
    });
    setCaminhoImagemPicker("");
  };

  // Salvar
  const salvar = async () => {
    const quadra = new Quadra({ ...quadraForm, type: tipoQuadra });

    if (quadra.id === undefined) {
      const referenciaQuadraComId = referenciaQuadra.doc();
      quadra.id = referenciaQuadraComId.id;

      referenciaQuadraComId.set(quadra.toFirestore()).then(() => {
        alert("Quadra " + quadra.name + " adicionada!");
        limparFormulario();
      });
    } else {
      const referenciaQuadraComId = referenciaQuadra.doc(quadra.id);
      referenciaQuadraComId.update(quadra.toFirestore()).then(() => {
        alert("Quadra " + quadra.name + " atualizada!");
        limparFormulario();
      });
    }
  };

  // Escolher foto
  const escolherFoto = () => {
    Alert.alert(
      "Escolher foto",
      "Escolha uma foto da sua galeria ou tire uma foto",
      [
        {
          text: "Tirar foto",
          onPress: () => abrirCamera(),
          style: "default",
        },
        {
          text: "Abrir galeria",
          onPress: () => mostrarImagePicker(),
          style: "cancel",
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      }
    );
  };

  // Abrir câmera
  const abrirCamera = async () => {
    const resultadoPermissao =
      await ImagePicker.requestCameraPermissionsAsync();
    if (resultadoPermissao.granted === false) {
      alert("Permissão negada!");
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync();
    uploadImagem(resultado);
  };

  // Mostrar image picker
  const mostrarImagePicker = async () => {
    const resultadoPermissao =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (resultadoPermissao.granted === false) {
      alert("Permissão para acessar galeria negada!");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    uploadImagem(resultado);
  };

  // Upload imagem
  const uploadImagem = async (resultado) => {
    if (!resultado.canceled) {
      setCaminhoImagemPicker(resultado.assets[0].uri);
      const uploadUri = resultado.assets[0].uri;
      let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
      const extension = filename.split(".").pop();
      const name = filename.split(".").slice(0, -1).join(".");

      const ref = storage.ref(`imagens/${name}.${extension}`);

      const img = await fetch(resultado.assets[0].uri);
      const bytes = await img.blob();
      const fbResultado = await uploadBytes(ref, bytes);

      const downloadUrl = await storage
        .ref(fbResultado.metadata.fullPath)
        .getDownloadURL();
      setQuadraForm({ ...quadraForm, photo: downloadUrl });
    }
  };

  // Efeito de carregamento
  useEffect(() => {
    const subscriber = referenciaQuadra.onSnapshot((querySnapshot) => {
      const quadras = [];
      querySnapshot.forEach((documentSnapshot) => {
        quadras.push({ ...documentSnapshot.data(), key: documentSnapshot.id });
      });
      setQuadras(quadras);
      setCarregando(false);
      setEstaAtualizando(false);
    });
    return () => subscriber();
  }, [quadras]);

  // Editar quadra
  const editarQuadra = async (quadra: Quadra) => {
    setEstaEditando(true);
    const resultado = firestore
      .collection("User")
      .doc(auth.currentUser?.uid)
      .collection("Quadra")
      .doc(quadra.id)
      .onSnapshot((documentSnapshot) => {
        const quadra = new Quadra(documentSnapshot.data());
        setCaminhoImagemPicker(quadra.photo);
        setHorarios({
          segunda: quadra.operatingHours[0].hours,
          terca: quadra.operatingHours[1].hours,
          quarta: quadra.operatingHours[2].hours,
          quinta: quadra.operatingHours[3].hours,
          sexta: quadra.operatingHours[4].hours,
          sabado: quadra.operatingHours[5].hours,
        });
        setQuadraForm({ ...quadra });
        console.log(quadraForm);
      });
    return () => resultado();
  };

  // Deletar quadra
  const deletarQuadra = async (quadra: Quadra) => {
    Alert.alert(
      'Deletar quadra "' + quadra.name + '"?',
      "Essa ação não pode ser desfeita!",
      [
        {
          text: "Cancelar",
        },
        {
          text: "Deletar",
          onPress: async () => {
            const res = await referenciaQuadra.doc(quadra.id).delete();
            alert("Quadra " + quadra.name + " deletada!");
            limparFormulario();
            trocarTab(1, false);
          },
        },
      ]
    );
  };

  // Renderizar quadras
  const renderizarQuadras = ({ item }: { item: Quadra }) => {
    return (
      <View style={styles.item} key={item.id}>
        <Pressable
          onLongPress={() => deletarQuadra(item)}
          onPress={() => editarQuadra(item)}
        >
          <View style={styles.rowAlignment}>
            <Image
              style={{ height: 80, width: 80, borderRadius: 10 }}
              source={{ uri: item.photo }}
            />

            <View style={styles.columnAlignment}>
              <Text style={styles.title}>Nome: {item.name}</Text>
              <Text style={styles.title}>Local: {item.location}</Text>
              <Text style={styles.title}>Tipo: {item.type}</Text>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

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
          onPress={() => {
            trocarTab(0, false);
          }}
          style={{
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
          }}
        >
          <Text>Criar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => trocarTab(1, false)}
          style={{
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
          }}
        >
          <Text>Editar</Text>
        </TouchableOpacity>
      </View>
      {tab == 0 ? (
        <ScrollView showsVerticalScrollIndicator>
          <View style={styles.photoContainer}>
            <TouchableOpacity onPress={() => escolherFoto()}>
              {caminhoImagemPicker !== "" ? (
                <Image
                  source={{ uri: caminhoImagemPicker }}
                  style={styles.image}
                />
              ) : (
                <Image
                  // source={require("../assets/camera.jpg")}
                  style={styles.image}
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputsContainer}>
            <TextInput
              placeholder="Nome"
              style={styles.input}
              value={quadraForm.name}
              onChangeText={(name) =>
                setQuadraForm({ ...quadraForm, name: name })
              }
            />

            <TextInput
              placeholder="Local"
              style={styles.input}
              value={quadraForm.location}
              onChangeText={(location) =>
                setQuadraForm({ ...quadraForm, location: location })
              }
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                gap: 12,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.button,
                  tipoQuadra === "Indoor" ? styles.buttonSelected : null,
                  {
                    width: "50%",
                  },
                ]}
                onPress={() => handleTipoQuadra("Indoor")}
              >
                <Text style={styles.buttonText}>Indoor</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,

                  tipoQuadra === "Outdoor" ? styles.buttonSelected : null,
                  {
                    width: "50%",
                  },
                ]}
                onPress={() => handleTipoQuadra("Outdoor")}
              >
                <Text style={styles.buttonText}>Outdoor</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tableContainer}>
            <Text style={styles.tableHeader}>Horários</Text>

            <View style={styles.tableColumn}>
              <Text style={styles.tableCell}>Segunda</Text>

              <View style={styles.tableHorarios}>
                {[
                  "08:00",
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                  "19:00",
                ].map((horario) => (
                  <TouchableOpacity
                    key={horario}
                    style={[
                      styles.tableButton,

                      horarios.segunda.find(
                        (h) => h.hour === horario && h.status
                      )
                        ? styles.tableSelected
                        : {},
                    ]}
                    onPress={() => handleSelectHorario("segunda", horario)}
                  >
                    <Text style={styles.tableButtonText}>{horario}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.tableColumn}>
              <Text style={styles.tableCell}>Terça</Text>

              <View style={styles.tableHorarios}>
                {[
                  "08:00",
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                  "19:00",
                ].map((horario) => (
                  <TouchableOpacity
                    key={horario}
                    style={[
                      styles.tableButton,

                      horarios.terca.find((h) => h.hour === horario && h.status)
                        ? styles.tableSelected
                        : {},
                    ]}
                    onPress={() => handleSelectHorario("terca", horario)}
                  >
                    <Text style={styles.tableButtonText}>{horario}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.tableColumn}>
              <Text style={styles.tableCell}>Quarta</Text>

              <View style={styles.tableHorarios}>
                {[
                  "08:00",
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                  "19:00",
                ].map((horario) => (
                  <TouchableOpacity
                    key={horario}
                    style={[
                      styles.tableButton,

                      horarios.quarta.find(
                        (h) => h.hour === horario && h.status
                      )
                        ? styles.tableSelected
                        : {},
                    ]}
                    onPress={() => handleSelectHorario("quarta", horario)}
                  >
                    <Text style={styles.tableButtonText}>{horario}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.tableColumn}>
              <Text style={styles.tableCell}>Quinta</Text>

              <View style={styles.tableHorarios}>
                {[
                  "08:00",
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                  "19:00",
                ].map((horario) => (
                  <TouchableOpacity
                    key={horario}
                    style={[
                      styles.tableButton,

                      horarios.quinta.find(
                        (h) => h.hour === horario && h.status
                      )
                        ? styles.tableSelected
                        : {},
                    ]}
                    onPress={() => handleSelectHorario("quinta", horario)}
                  >
                    <Text style={styles.tableButtonText}>{horario}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.tableColumn}>
              <Text style={styles.tableCell}>Sexta</Text>

              <View style={styles.tableHorarios}>
                {[
                  "08:00",
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                  "19:00",
                ].map((horario) => (
                  <TouchableOpacity
                    key={horario}
                    style={[
                      styles.tableButton,

                      horarios.sexta.find((h) => h.hour === horario && h.status)
                        ? styles.tableSelected
                        : {},
                    ]}
                    onPress={() => handleSelectHorario("sexta", horario)}
                  >
                    <Text style={styles.tableButtonText}>{horario}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.tableColumn}>
              <Text style={styles.tableCell}>Sábado</Text>

              <View style={styles.tableHorarios}>
                {[
                  "08:00",
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                  "19:00",
                ].map((horario) => (
                  <TouchableOpacity
                    key={horario}
                    style={[
                      styles.tableButton,

                      horarios.sabado.find(
                        (h) => h.hour === horario && h.status
                      )
                        ? styles.tableSelected
                        : {},
                    ]}
                    onPress={() => handleSelectHorario("sabado", horario)}
                  >
                    <Text style={styles.tableButtonText}>{horario}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={salvar} style={styles.button}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={cancelar} style={styles.buttonOutline}>
              <Text style={styles.buttonOutlineText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <>
          <FlatList
            style={{ width: "100%", paddingHorizontal: 10, marginBottom: 32 }}
            data={quadras}
            renderItem={renderizarQuadras}
            keyExtractor={(item) => item.id.toString()}
            refreshing={estaAtualizando}
          />

          <ScrollView showsVerticalScrollIndicator>
            {estaEditando == true && (
              <>
                <View style={styles.photoContainer}>
                  <TouchableOpacity onPress={() => escolherFoto()}>
                    {caminhoImagemPicker !== "" ? (
                      <Image
                        source={{ uri: caminhoImagemPicker }}
                        style={styles.image}
                      />
                    ) : (
                      <Image
                        // source={require("../assets/camera.jpg")}
                        style={styles.image}
                      />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.inputsContainer}>
                  <TextInput
                    placeholder="Nome"
                    style={styles.input}
                    value={quadraForm.name}
                    onChangeText={(name) =>
                      setQuadraForm({ ...quadraForm, name: name })
                    }
                  />

                  <TextInput
                    placeholder="Local"
                    style={styles.input}
                    value={quadraForm.location}
                    onChangeText={(location) =>
                      setQuadraForm({ ...quadraForm, location: location })
                    }
                  />

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignContent: "center",
                      gap: 12,
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.button,
                        tipoQuadra === "Indoor" ? styles.buttonSelected : null,
                        {
                          width: "50%",
                        },
                      ]}
                      onPress={() => handleTipoQuadra("Indoor")}
                    >
                      <Text style={styles.buttonText}>Indoor</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.button,

                        tipoQuadra === "Outdoor" ? styles.buttonSelected : null,
                        {
                          width: "50%",
                        },
                      ]}
                      onPress={() => handleTipoQuadra("Outdoor")}
                    >
                      <Text style={styles.buttonText}>Outdoor</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.tableContainer}>
                  <Text style={styles.tableHeader}>Horários</Text>

                  <View style={styles.tableColumn}>
                    <Text style={styles.tableCell}>Segunda</Text>

                    <View style={styles.tableHorarios}>
                      {[
                        "08:00",
                        "09:00",
                        "10:00",
                        "11:00",
                        "12:00",
                        "13:00",
                        "14:00",
                        "15:00",
                        "16:00",
                        "17:00",
                        "18:00",
                        "19:00",
                      ].map((horario) => (
                        <TouchableOpacity
                          key={horario}
                          style={[
                            styles.tableButton,

                            horarios.segunda.find(
                              (h) => h.hour === horario && h.status
                            )
                              ? styles.tableSelected
                              : {},
                          ]}
                          onPress={() =>
                            handleSelectHorario("segunda", horario)
                          }
                        >
                          <Text style={styles.tableButtonText}>{horario}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.tableColumn}>
                    <Text style={styles.tableCell}>Terça</Text>

                    <View style={styles.tableHorarios}>
                      {[
                        "08:00",
                        "09:00",
                        "10:00",
                        "11:00",
                        "12:00",
                        "13:00",
                        "14:00",
                        "15:00",
                        "16:00",
                        "17:00",
                        "18:00",
                        "19:00",
                      ].map((horario) => (
                        <TouchableOpacity
                          key={horario}
                          style={[
                            styles.tableButton,

                            horarios.terca.find(
                              (h) => h.hour === horario && h.status
                            )
                              ? styles.tableSelected
                              : {},
                          ]}
                          onPress={() => handleSelectHorario("terca", horario)}
                        >
                          <Text style={styles.tableButtonText}>{horario}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.tableColumn}>
                    <Text style={styles.tableCell}>Quarta</Text>

                    <View style={styles.tableHorarios}>
                      {[
                        "08:00",
                        "09:00",
                        "10:00",
                        "11:00",
                        "12:00",
                        "13:00",
                        "14:00",
                        "15:00",
                        "16:00",
                        "17:00",
                        "18:00",
                        "19:00",
                      ].map((horario) => (
                        <TouchableOpacity
                          key={horario}
                          style={[
                            styles.tableButton,

                            horarios.quarta.find(
                              (h) => h.hour === horario && h.status
                            )
                              ? styles.tableSelected
                              : {},
                          ]}
                          onPress={() => handleSelectHorario("quarta", horario)}
                        >
                          <Text style={styles.tableButtonText}>{horario}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.tableColumn}>
                    <Text style={styles.tableCell}>Quinta</Text>

                    <View style={styles.tableHorarios}>
                      {[
                        "08:00",
                        "09:00",
                        "10:00",
                        "11:00",
                        "12:00",
                        "13:00",
                        "14:00",
                        "15:00",
                        "16:00",
                        "17:00",
                        "18:00",
                        "19:00",
                      ].map((horario) => (
                        <TouchableOpacity
                          key={horario}
                          style={[
                            styles.tableButton,

                            horarios.quinta.find(
                              (h) => h.hour === horario && h.status
                            )
                              ? styles.tableSelected
                              : {},
                          ]}
                          onPress={() => handleSelectHorario("quinta", horario)}
                        >
                          <Text style={styles.tableButtonText}>{horario}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.tableColumn}>
                    <Text style={styles.tableCell}>Sexta</Text>

                    <View style={styles.tableHorarios}>
                      {[
                        "08:00",
                        "09:00",
                        "10:00",
                        "11:00",
                        "12:00",
                        "13:00",
                        "14:00",
                        "15:00",
                        "16:00",
                        "17:00",
                        "18:00",
                        "19:00",
                      ].map((horario) => (
                        <TouchableOpacity
                          key={horario}
                          style={[
                            styles.tableButton,

                            horarios.sexta.find(
                              (h) => h.hour === horario && h.status
                            )
                              ? styles.tableSelected
                              : {},
                          ]}
                          onPress={() => handleSelectHorario("sexta", horario)}
                        >
                          <Text style={styles.tableButtonText}>{horario}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.tableColumn}>
                    <Text style={styles.tableCell}>Sábado</Text>

                    <View style={styles.tableHorarios}>
                      {[
                        "08:00",
                        "09:00",
                        "10:00",
                        "11:00",
                        "12:00",
                        "13:00",
                        "14:00",
                        "15:00",
                        "16:00",
                        "17:00",
                        "18:00",
                        "19:00",
                      ].map((horario) => (
                        <TouchableOpacity
                          key={horario}
                          style={[
                            styles.tableButton,

                            horarios.sabado.find(
                              (h) => h.hour === horario && h.status
                            )
                              ? styles.tableSelected
                              : {},
                          ]}
                          onPress={() => handleSelectHorario("sabado", horario)}
                        >
                          <Text style={styles.tableButtonText}>{horario}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.buttonsContainer}>
                  <TouchableOpacity onPress={salvar} style={styles.button}>
                    <Text style={styles.buttonText}>Salvar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => trocarTab(1, false)}
                    style={styles.buttonOutline}
                  >
                    <Text style={styles.buttonOutlineText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default GerenciarQuadras;

const styles = StyleSheet.create({
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
    fontWeight: "bold",
  },

  tableSelected: {
    backgroundColor: "#091e53",

    borderColor: "#091e53",
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
