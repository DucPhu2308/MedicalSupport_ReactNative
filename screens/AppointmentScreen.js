import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AppointmentAPI } from "../API/AppointmentAPI";

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

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await AppointmentAPI.getAppointmentBySenderId();
        const currentDate = new Date();

        // Filter out past appointments and sort by goingDateTime in ascending order
        const upcomingAppointments = response.data
            .filter(appointment => new Date(appointment.goingDateTime) > currentDate)
            .sort((a, b) => new Date(a.goingDateTime) - new Date(b.goingDateTime));

        setAppointments(upcomingAppointments);

        // Set default month and year based on the first upcoming appointment
        if (upcomingAppointments.length > 0) {
          const firstAppointmentDate = new Date(upcomingAppointments[0].goingDateTime);
          setSelectedMonth((firstAppointmentDate.getMonth() + 1).toString()); // Months are zero-based
          setSelectedYear(firstAppointmentDate.getFullYear().toString());
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.goingDateTime);
    const matchesMonth = appointmentDate.getMonth() + 1 === parseInt(selectedMonth);
    const matchesYear = appointmentDate.getFullYear() === parseInt(selectedYear);
    return (
        matchesMonth &&
        matchesYear &&
        appointment.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });


  const renderAppointment = ({ item }) => (
      <View style={styles.appointmentCard}>
        <View style={styles.dateContainer}>
          <Text style={styles.dayLabel}>Ngày</Text>
          <Text style={styles.dateText}>
            {new Date(item.goingDateTime).getDate()}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.titleText}>Tiêu đề: {item.title}</Text>
          <Text style={styles.timeText}>
            Thời gian:{" "}
            {new Date(item.goingDateTime).toLocaleTimeString("vi-VN", {
              timeZone: "UTC",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text style={styles.doctorText}>
            Bạn có cuộc hẹn với {item.recipient.firstName} {item.recipient.lastName}
          </Text>
          <TouchableOpacity
              onPress={() =>
                  navigation.navigate("AppointmentDetailScreen", { appointment: item })
              }
          >
            <Text style={styles.detailsLink}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      </View>
  );


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
