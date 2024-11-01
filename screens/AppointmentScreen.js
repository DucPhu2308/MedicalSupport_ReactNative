import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AppointmentAPI } from "../API/AppointmentAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";

const months = [
  { label: "Tháng 1", value: "1" },
  { label: "Tháng 2", value: "2" },
  { label: "Tháng 3", value: "3" },
  { label: "Tháng 4", value: "4" },
  { label: "Tháng 5", value: "5" },
  { label: "Tháng 6", value: "6" },
  { label: "Tháng 7", value: "7" },
  { label: "Tháng 8", value: "8" },
  { label: "Tháng 9", value: "9" },
  { label: "Tháng 10", value: "10" },
  { label: "Tháng 11", value: "11" },
  { label: "Tháng 12", value: "12" },
];

const years = [
  { label: "Năm 2022", value: "2022" },
  { label: "Năm 2023", value: "2023" },
  { label: "Năm 2024", value: "2024" },
  { label: "Năm 2025", value: "2025" },
];

const AppointmentScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);

  const getUserId = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData !== null) {
        const user = JSON.parse(userData);
        const userId = user._id;
        return userId;
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setUserId(await getUserId());

      const response = await AppointmentAPI.getAppointmentBySenderId();
      const currentDate = new Date();

      const upcomingAppointments = response.data
        .filter(
          (appointment) =>
            new Date(appointment.date) > currentDate &&
            (appointment.sender._id == userId ||
              appointment.recipient._id == userId)
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setAppointments(upcomingAppointments);

      if (upcomingAppointments.length > 0) {
        const firstAppointmentDate = new Date(upcomingAppointments[0].date);
        setSelectedMonth((firstAppointmentDate.getMonth() + 1).toString());
        setSelectedYear(firstAppointmentDate.getFullYear().toString());
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const matchesMonth =
      appointmentDate.getMonth() + 1 === parseInt(selectedMonth);
    const matchesYear =
      appointmentDate.getFullYear() === parseInt(selectedYear);
    return (
      matchesMonth &&
      matchesYear &&
      appointment.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const renderAppointment = ({ item }) => {
    const recipientName =
      userId === item.sender._id
        ? `${item.recipient.firstName} ${item.recipient.lastName}`
        : `${item.sender.firstName} ${item.sender.lastName}`;

    return (
      <View style={styles.appointmentCard}>
        <View style={styles.dateContainer}>
          <Text style={styles.dayLabel}>Ngày</Text>
          <Text style={styles.dateText}>{new Date(item.date).getDate()}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.titleText}>Tiêu đề: {item.title}</Text>
          <Text style={styles.timeText}>
            Thời gian:{" "}
            {new Date(item.date).toLocaleTimeString("vi-VN", {
              timeZone: "UTC",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text style={styles.doctorText}>
            Bạn có cuộc hẹn với {recipientName}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AppointmentDetailScreen", {
                appointment: item,
              })
            }
          >
            <Text style={styles.detailsLink}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm cuộc hẹn"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedMonth}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
        >
          {months.map((month) => (
            <Picker.Item
              key={month.value}
              label={month.label}
              value={month.value}
            />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedYear}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
        >
          {years.map((year) => (
            <Picker.Item
              key={year.value}
              label={year.label}
              value={year.value}
            />
          ))}
        </Picker>
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={filteredAppointments}
          renderItem={renderAppointment}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F8FF",
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 150,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  appointmentCard: {
    flexDirection: "row",
    backgroundColor: "#FFE4E1",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  dateContainer: {
    backgroundColor: "#D3D3D3",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  detailsContainer: {
    flex: 1,
  },
  timeText: {
    fontSize: 14,
    marginBottom: 5,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  doctorText: {
    fontSize: 14,
    marginBottom: 5,
  },
  detailsLink: {
    fontSize: 14,
    color: "blue",
    alignSelf: "flex-end",
  },
});

export default AppointmentScreen;
