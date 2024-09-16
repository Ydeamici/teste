import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "./screens/Auth/SignUp";
import SignIn from "./screens/Auth/SingnIn";
import Menu from "./screens/Menu";
import Profile from "./screens/Profile";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="SignIn"
          options={{ headerShown: false }}
          component={SignIn}
        />
        <Stack.Screen
          name="SignUp"
          options={{ headerShown: false }}
          component={SignUp}
        />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen
          name="Menu"
          options={{ headerShown: false }}
          component={Menu}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
