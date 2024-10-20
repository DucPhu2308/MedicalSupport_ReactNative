import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const AppointmentDetailScreen = ({ route, navigation }) => {
  const { appointment } = route.params;

  return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Thông tin chi tiết</Text>
        <Text style={styles.detailText}>Tiêu đề: {appointment.title}</Text>
        <Text style={styles.detailText}>
          Thời gian:{" "}
          {new Date(appointment.goingDateTime).toLocaleTimeString("vi-VN", {
            timeZone: "UTC",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <Text style={styles.detailText}>
          Người nhận: {appointment.recipient.firstName} {appointment.recipient.lastName}
        </Text>
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
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingHorizontal: 10,
  },
});

export default AppointmentDetailScreen;
