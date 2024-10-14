import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const AppointmentDetailScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Thông tin chi tiết</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Quay lại"
          onPress={() => navigation.goBack()}
          color="#A9A9A9"
        />
        <Button title="Hủy cuộc hẹn" onPress={() => {}} color="#FF6347" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FAF3DD",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingHorizontal: 10,
  },
});

export default AppointmentDetailScreen;
