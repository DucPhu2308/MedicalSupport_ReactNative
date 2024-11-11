import React, { useCallback, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useSocket } from "../contexts/SocketProvider";
import YesNoDialog from "../components/YesNoDialog";
import { AppointmentStatus } from "../API/ChatAPI";

const AppointmentDetailScreen = ({ route, navigation }) => {
  const socket = useSocket();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { appointment } = route.params;

  const handleCancelAppointment = useCallback(() => {
    socket.emit('update-appt-message-status', {
      messageId: appointment.message,
      status: AppointmentStatus.CANCELLED,
    });
    navigation.goBack();
  }, [socket, appointment.message, navigation]);

  return (
    <View style={styles.container}>
      <YesNoDialog
        isOpen={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        onConfirm={handleCancelAppointment}
        yesText='Đồng ý'
        noText='Hủy'
        title='Xác nhận hủy cuộc hẹn'
        message='Thao tác này không thể hoàn tác, bạn có chắc chắn muốn hủy cuộc hẹn này không?'
      />

      <Text style={styles.detailText}>Tiêu đề: {appointment.title}</Text>
      <Text style={styles.detailText}>
        Thời gian:{" "}
        {new Date(appointment.date).toLocaleTimeString("vi-VN", {
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
      <Text style={styles.detailText}>
        Người nhận: {appointment.recipient.firstName}{" "}
        {appointment.recipient.lastName}
      </Text>
      <Text style={styles.detailText}>Nội dung: {appointment.content}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Quay lại"
          onPress={() => navigation.goBack()}
          color="#A9A9A9"
        />
        <Button title="Hủy cuộc hẹn" onPress={() => { setShowConfirmDialog(true) }} color="#FF6347" />
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
