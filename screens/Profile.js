import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Linking,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Title, Card, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";

export default function Profile(props) {
  // Obtiene los datos pasados por props en la función navigate()
  const {
    _id,
    name,
    position,
    email,
    phone,
    salary,
    picture,
  } = props.route.params.item;

  const { navigation } = props;

  // Funcion para eliminar a los empleados
  const fireEmployee = () => {
    fetch("api-de-mongodb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: _id,
      }),
    })
      .then((response) => response.clone())
      .then((data) => {
        Alert.alert(
          "Acción Exitosa",
          "El empleado ha sido despedido exitosamente."
        );
        navigation.navigate("Home");
      })
      .catch((error) => {
        Alert.alert("Error al despedir empleado..."), error.toString();
      });
  };

  const openDial = () => {
    if (Platform.OS === "android") {
      Linking.openURL(`tel:${phone}`);
    } else {
      Linking.openURL(`telprompt:${phone}`);
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#000000", "#17032e"]}
        style={{ height: "20%", paddingTop: Constants.statusBarHeight }}
      />
      <View style={{ alignItems: "center" }}>
        <Image
          style={{
            width: 150,
            height: 150,
            borderRadius: 150 / 2,
            marginTop: -150 / 2,
          }}
          source={{
            uri: picture,
          }}
        />
      </View>
      <View style={styles.centerText}>
        <Title style={styles.titleSize}>{name}</Title>
        <Text style={styles.textPositionSize}>{position}</Text>
      </View>
      <Card style={styles.infoCard}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(`mailto:${email}`);
          }}
        >
          <View style={styles.cardContent}>
            <MaterialIcons name="email" size={24} color="black" />
            <Text style={styles.cardContentText}>{email}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={openDial}>
          <View style={styles.cardContent}>
            <FontAwesome name="phone-square" size={24} color="black" />
            <Text style={styles.cardContentText}>{phone}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.cardContent}>
            <MaterialIcons name="attach-money" size={24} color="black" />
            <Text style={styles.cardContentText}>${salary} USD</Text>
          </View>
        </TouchableOpacity>
      </Card>

      <View style={styles.centerView}>
        <View style={styles.actionButtons}>
          <Button
            icon="account-edit"
            mode="contained"
            onPress={() =>
              navigation.navigate("CreateEmployee", {
                _id,
                name,
                position,
                email,
                phone,
                salary,
                picture,
              })
            }
          >
            Editar
          </Button>
          <Button icon="delete" mode="contained" onPress={() => fireEmployee()}>
            Despedir
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  centerText: {
    alignItems: "center",
  },

  titleSize: {
    fontSize: 25,
    marginTop: 15,
  },

  textPositionSize: {
    fontSize: 16,
  },

  infoCard: {
    margin: 10,
  },

  cardContent: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },

  cardContentText: {
    marginLeft: 10,
  },

  centerView: {
    marginTop: 20,
    alignItems: "center",
  },

  actionButtons: {
    flexDirection: "row",
    margin: "auto",
    justifyContent: "space-between",
    width: "80%",
  },
});
