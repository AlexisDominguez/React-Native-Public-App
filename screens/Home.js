import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  StatusBar,
  Alert,
} from "react-native";
import { Card, FAB } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";

export default function Home(props) {
  const { navigation } = props;
  StatusBar.setBarStyle("light-content");

  const { data, loading } = useSelector((state) => {
    return state;
  });

  const dispatch = useDispatch();

  const fetchData = () => {
    fetch("api-de-mongodb")
      .then((response) => response.json())
      .then((results) => {
        dispatch({ type: "ADD_DATA", payload: results });
        dispatch({ type: "SET_LOADING", payload: false });
      })
      .catch((error) => Alert.alert("Algo salió mal...", error.toString()));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderList = (item) => {
    return (
      <Card
        style={styles.myCard}
        onPress={() => navigation.navigate("Profile", { item })}
      >
        <View style={styles.cardView}>
          <Image
            style={{ width: 60, height: 60, borderRadius: 60 / 2 }}
            source={{
              uri: item.picture,
            }}
          />

          <View style={styles.textView}>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.text}>{item.position}</Text>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.homeContainer}>
      <FlatList
        data={data}
        renderItem={({ item }) => {
          return renderList(item);
        }}
        keyExtractor={(item) => `${item._id}`}
        onRefresh={() => fetchData()}
        refreshing={loading}
      />
      <View style={styles.slideText}>
        <Text style={{ color: "#AAA" }}>
          Desliza hacia abajo para recargar los resultados...
        </Text>
      </View>

      <FAB
        style={styles.fab}
        small={false}
        theme={{ colors: { accent: "#6200ee" } }}
        icon="camera"
        onPress={() => navigation.navigate("CreateEmployee")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
  },

  myCard: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
  },

  cardView: {
    flexDirection: "row",
    padding: 20,
  },

  textView: {
    justifyContent: "center",
  },

  text: {
    marginLeft: 10,
  },

  slideText: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    paddingTop: 15,
  },

  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 20,
  },
});
