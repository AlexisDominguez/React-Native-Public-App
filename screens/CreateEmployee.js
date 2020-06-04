import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Text,
  ActivityIndicator,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default function CreateEmployee(props) {
  const { navigation, route } = props;

  const getDetails = (type) => {
    if (route.params) {
      switch (type) {
        case "name":
          return route.params.name;
        case "phone":
          return route.params.phone;
        case "email":
          return route.params.email;
        case "salary":
          return route.params.salary;
        case "picture":
          return route.params.picture;
        case "position":
          return route.params.position;
      }
    } else {
      return "";
    }
  };

  const [name, setName] = useState(getDetails("name"));
  const [phone, setPhone] = useState(getDetails("phone"));
  const [email, setEmail] = useState(getDetails("email"));
  const [salary, setSalary] = useState(getDetails("salary"));
  const [picture, setPicture] = useState(getDetails("picture"));
  const [position, setPosition] = useState(getDetails("position"));
  const [modal, setModal] = useState(false);
  const [enableShift, setEnableShift] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitData = () => {
    console.log("punto 1");

    fetch("api-de-mongodb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        phone,
        email,
        salary,
        picture,
        position,
      }),
    })
      .then((response) => {
        return response.clone();
      })
      .then((data) => {
        Alert.alert(
          "Acción exitosa",
          `El nuevo empleado ha sido guardado exitosamente.`
        );
        navigation.navigate("Home");
      })
      .catch((error) => Alert.alert("Error al guardar los datos...", error));
  };

  const updateData = () => {
    console.log("punto 1");
    fetch("api-de-mongodb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        id: route.params._id,
        name,
        phone,
        email,
        salary,
        picture,
        position,
      }),
    })
      .then((response) => {
        return response.clone();
      })
      .then((data) => {
        Alert.alert("Acción exitosa", `Datos actualizados correctamente.`);
        navigation.navigate("Home");
      })
      .catch((error) => Alert.alert("Error al guardar los datos...", error));
  };

  const pickPictureFromGallery = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status) {
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!status.cancelled) {
        let newFile = {
          uri: data.uri,
          type: `test/${data.uri.split(".")[1]}`,
          name: `test.${data.uri.split(".")[1]}`,
        };
        handleUpload(newFile);
      }
    } else {
      Alert.alert(
        "Error de permisos",
        "Necesitas dar permisos para subit tu imagen."
      );
    }
  };

  const pickPictureFromCamera = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    if (status) {
      let data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
      });

      if (!status.cancelled) {
        let newFile = {
          uri: data.uri,
          type: `test/${data.uri.split(".")[1]}`,
          name: `test.${data.uri.split(".")[1]}`,
        };
        handleUpload(newFile);
      }
    } else {
      Alert.alert(
        "Error de permisos",
        "Necesitas permisos para subir tu imagen."
      );
    }
  };

  const handleUpload = (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "employeeApp");
    data.append("cloud_name", "droxy9fnj");
    setLoading(true);
    fetch("api-de-cloudinary", {
      method: "post",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        setPicture(data.secure_url);
        setLoading(false);
        setModal(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <KeyboardAvoidingView behavior="position" enabled={enableShift}>
      <View style={styles.mainView}>
        <TextInput
          label="Nombre"
          value={name}
          style={styles.inputStyle}
          theme={theme}
          onFocus={() => setEnableShift(false)}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          label="Número de teléfono"
          value={phone}
          style={styles.inputStyle}
          keyboardType="number-pad"
          theme={theme}
          onFocus={() => setEnableShift(false)}
          onChangeText={(text) => setPhone(text)}
        />
        <TextInput
          label="Correo electrónico"
          value={email}
          style={styles.inputStyle}
          theme={theme}
          onFocus={() => setEnableShift(true)}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          label="Salario"
          value={salary}
          style={styles.inputStyle}
          keyboardType="number-pad"
          theme={theme}
          onFocus={() => setEnableShift(true)}
          onChangeText={(text) => setSalary(text)}
        />
        <TextInput
          label="Puesto"
          value={position}
          style={styles.inputStyle}
          theme={theme}
          onFocus={() => setEnableShift(true)}
          onChangeText={(text) => setPosition(text)}
        />

        <Button
          icon={picture === "" ? "upload" : "check"}
          style={styles.buttonStyle}
          mode="contained"
          theme={picture === "" ? buttonTheme : buttonUploadTheme}
          onPress={() => setModal(true)}
        >
          Subir Imagen
        </Button>
        {route.params ? (
          <Button
            icon="content-save"
            style={styles.buttonStyle}
            mode="contained"
            theme={buttonTheme}
            onPress={() => updateData()}
          >
            Guardar
          </Button>
        ) : (
          <Button
            icon="content-save"
            style={styles.buttonStyle}
            mode="contained"
            theme={buttonTheme}
            onPress={() => submitData()}
          >
            Guardar
          </Button>
        )}
        <Modal
          animationType="fade"
          transparent={true}
          visible={loading}
          onRequestClose={() => setModal(false)}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(10,10,10, 0.5)",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#FFF",
                borderRadius: 10,
                padding: 20,
              }}
            >
              <ActivityIndicator color="#17032e" size={60} />
              <Text style={{ marginTop: 20 }}>
                Por favor espere, enviando foto...
              </Text>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
          onRequestClose={() => setModal(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.modalButtonView}>
              <Button
                icon="camera"
                mode="contained"
                theme={buttonCameraTheme}
                onPress={pickPictureFromCamera}
              >
                Cámara
              </Button>
              <Button
                icon="image-area"
                mode="contained"
                theme={buttonGalleryTheme}
                onPress={pickPictureFromGallery}
              >
                Galería
              </Button>
            </View>

            <Button
              theme={buttonTheme}
              style={styles.modalButtonCancel}
              onPress={() => setModal(false)}
            >
              Cancelar
            </Button>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  mainView: {
    marginTop: 10,
  },

  inputStyle: {
    margin: 10,
  },

  buttonStyle: {
    margin: 10,
    marginTop: 30,
    marginBottom: 0,
  },

  modalView: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgb(235,235,235)",
  },

  modalButtonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    marginTop: 40,
    marginBottom: 20,
  },

  modalButtonCancel: {
    marginBottom: 30,
  },
});

const theme = {
  colors: {
    primary: "#4A44F2",
  },
};

const buttonTheme = {
  colors: {},
};

const buttonUploadTheme = {
  colors: {
    primary: "#01402E",
  },
};

const buttonCameraTheme = {
  colors: {
    primary: "#3726A6",
  },
};

const buttonGalleryTheme = {
  colors: {
    primary: "#4A44F2",
  },
};
