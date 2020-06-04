import React from "react";
import { StyleSheet, View } from "react-native";
import Home from "./screens/Home";
import CreateEmployee from "./screens/CreateEmployee";
import Profile from "./screens/Profile";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { Reducer } from "./reducers/Reducer";

const store = createStore(Reducer);
const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <View style={styles.container}>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ ...homeOptions }}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{ ...profileOptions }}
            />
            <Stack.Screen
              name="CreateEmployee"
              component={CreateEmployee}
              options={{ ...createEmployeeOptions }}
            />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </Provider>
  );
}

const homeOptions = {
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "#000",
  },
  title: "Inicio",
};

const profileOptions = {
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "#000",
  },
  title: "Perfil",
};

const createEmployeeOptions = {
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "#000",
  },
  title: "Crear empleado",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
