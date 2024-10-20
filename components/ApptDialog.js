import { formatDate } from "date-fns";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLOR } from "../CommonConst";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { Button, Dialog } from "react-native-paper";
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppointmentStatus } from "../API/ChatAPI";

const ApptDialog = ({ open, onClose, appt, createAppt }) => {
    const [datetime, setDatetime] = useState(appt?.date || new Date());

    const [title, setTitle] = useState(appt?.title || "");
    const [content, setContent] = useState(appt?.content || "");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [error, setError] = useState({
        title: "",
        content: "",
        datetime: "",
    });

    const view = appt ? ApptFormModalView.VIEW : ApptFormModalView.CREATE;

    const handleCreateAppt = () => {
        if (!title || !content || datetime < new Date()) {
            setError({
                title: title ? "" : "Tiêu đề không được để trống",
                content: content ? "" : "Nội dung không được để trống",
                datetime: datetime < new Date() ? "Thời gian không hợp lệ" : "",
            });
            return;
        }

        createAppt({ title, content, date: datetime, apptStatus: AppointmentStatus.PENDING });
        onClose();
    }
    return (
        <Modal visible={open} onDismiss={onClose} transparent={true}>
            {showDatePicker && (
                <DateTimePicker
                    value={datetime}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || datetime;
                        setShowDatePicker(false);
                        setDatetime(currentDate);
                        setShowTimePicker(true);
                    }}
                />
            )}
            {showTimePicker && (
                <DateTimePicker
                    value={datetime}
                    mode="time"
                    display="default"
                    onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || datetime;
                        setShowTimePicker(false);
                        setDatetime(currentDate);
                    }}
                />
            )}
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="w-80 bg-white p-6 rounded-xl shadow-lg">
                    <Text className="text-lg font-bold mb-4">{view === ApptFormModalView.CREATE ? 'Tạo cuộc hẹn' : 'Chi tiết cuộc hẹn'}</Text>
                    <View>
                        {view === ApptFormModalView.CREATE && (
                            <>
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-2"
                                    placeholder="Tiêu đề"
                                    value={title}
                                    onChangeText={setTitle} />
                                {error.title && <Text className="text-red-500">{error.title}</Text>}
                                <TextInput
                                    multiline
                                    className="border border-gray-300 rounded-lg p-2 mt-4 max-h-28"
                                    placeholder="Nội dung"
                                    value={content}
                                    onChangeText={setContent} />
                                {error.content && <Text className="text-red-500">{error.content}</Text>}
                                <View className="border border-gray-300 rounded-lg p-2 mt-4 flex-row justify-between">
                                    <TextInput className="text-black" placeholder="Thời gian" value={formatDate(datetime, 'HH:mm dd/MM/yyyy')} readOnly />
                                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                        <FontAwesome name="calendar" size={24} color={COLOR.PRIMARY} />
                                    </TouchableOpacity>
                                </View>
                                {error.datetime && <Text className="text-red-500">{error.datetime}</Text>}
                            </>
                        )}
                        {
                            view === ApptFormModalView.VIEW && (
                                <>
                                    <Text className="font-bold text-lg text-center" >{appt.title}</Text>
                                    <Text>Nội dung: {appt.content}</Text>
                                    <Text>Thời gian: {formatDate(appt.date, 'HH:mm dd/MM/yyyy')}</Text>
                                </>
                            )
                        }

                    </View>
                    <View className="flex-row justify-around">
                        <TouchableOpacity className="bg-blue-500 rounded-lg p-3" onPress={onClose}>
                            <Text className="text-white font-bold">Close</Text>
                        </TouchableOpacity>
                        {view === ApptFormModalView.CREATE && (
                            <TouchableOpacity className="bg-blue-500 rounded-lg p-3"
                                onPress={handleCreateAppt}>
                                <Text className="text-white font-bold">Create</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default ApptDialog;

export const ApptFormModalView = {
    CREATE: 'create',
    EDIT: 'edit',
    VIEW: 'view',
}