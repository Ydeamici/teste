import { createDrawerNavigator } from "@react-navigation/drawer";

import GerenciarAgendamentos from "./Agendamentos/GerenciarAgendamentos";
import ListarAgendamentos from "./Agendamentos/ListarAgendamentos";
import Profile from "./Profile";
import GerenciarQuadras from "./Quadra/GerenciarQuadras";
import ListarQuadras from "./Quadra/ListarQuadras";

const Drawer = createDrawerNavigator();

export default function Menu() {
  return (
    <Drawer.Navigator initialRouteName="Quadras">
      <Drawer.Screen name="Quadras" component={ListarQuadras} />
      <Drawer.Screen name="Agendamentos" component={ListarAgendamentos} />
      <Drawer.Screen name="Gerenciar Quadras" component={GerenciarQuadras} />
      <Drawer.Screen
        name="Gerenciar Agendamentos"
        component={GerenciarAgendamentos}
      />
      <Drawer.Screen name="Perfil" component={Profile} />
    </Drawer.Navigator>
  );
}
