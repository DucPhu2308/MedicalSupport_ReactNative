import { format } from "date-fns";
import { Text, View } from "react-native";
import { AppointmentStatus, AppointmentStatusText } from "../../API/ChatAPI";
import { TouchableOpacity } from "react-native";
import ApptDialog from "../ApptDialog";
import { useState } from "react";
import { useSocket } from "../../contexts/SocketProvider";
import YesNoDialog from "../YesNoDialog";

const AppointmentMessageItem = ({ message, isSent }) => {
    const socket = useSocket();
    const [showDialog, setShowDialog] = useState(false);
    const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
    const senderName = isSent ? 'Bạn' : message.sender.lastName;
    const textColor = isSent ? 'text-white' : 'text-black';
    let messageStyleBase = 'rounded-3xl p-4 my-0.5';
    const messageStyle = isSent ? `bg-blue-500 self-end ${messageStyleBase} rounded-br-md` : `bg-[#d9d9d9] self-start ${messageStyleBase}`;

    const acceptApt = (messageId) => {
        socket.emit('update-appt-message-status', {
            messageId,
            status: AppointmentStatus.ACCEPTED,
        });
    }

    const cancelApt = (messageId) => {
        socket.emit('update-appt-message-status', {
            messageId,
            status: AppointmentStatus.CANCELLED,
        });
    }

    return (
        <>
            <ApptDialog open={showDialog} onClose={() => setShowDialog(false)} appt={message.content} />
            <YesNoDialog
                isOpen={showConfirmCancelModal}
                onCancel={() => setShowConfirmCancelModal(false)}
                onConfirm={() => {
                    cancelApt(message._id);
                    setShowConfirmCancelModal(false);
                }}
                yesText='Đồng ý'
                noText='Hủy'
                title='Xác nhận hủy cuộc hẹn'
                message='Thao tác này không thể hoàn tác, bạn có chắc chắn muốn hủy cuộc hẹn này không?'
            />
            <View className={`${messageStyle} flex-col max-w-xs`}>
                <Text className={`${textColor}`}>
                    {`[${AppointmentStatusText[message.content.apptStatus]}] ${senderName} đã đề xuất cuộc hẹn `}
                    <Text className={`font-bold`}>{message.content.title}</Text>
                    {' vào lúc: '}
                </Text>
                <View className={`flex-col items-center`}>
                    <Text className={`${textColor} text-lg`}> {format(new Date(message.content.date), 'HH:mm')}</Text>
                    <Text className={`${textColor}`}> {format(new Date(message.content.date), "dd 'thg' MM',' yyyy")}</Text>
                </View>
                <View className={`flex-row justify-around`}>
                    <TouchableOpacity
                        onPress={() => setShowDialog(true)}
                    ><Text className={`${textColor}`}>Xem chi tiết</Text></TouchableOpacity>
                    {
                        !isSent && message.content.apptStatus === AppointmentStatus.PENDING &&
                        <TouchableOpacity
                            onPress={() => acceptApt(message._id)}
                        ><Text className={`${textColor}`}>Chấp nhận</Text></TouchableOpacity>
                    }
                    {
                        (message.content.apptStatus === AppointmentStatus.ACCEPTED ||
                             (message.content.apptStatus === AppointmentStatus.PENDING && isSent))
                        &&
                        <TouchableOpacity
                            onPress={() => setShowConfirmCancelModal(true)}
                        ><Text className='text-red-400'>Hủy</Text></TouchableOpacity>
                    }
                </View>
            </View>
        </>
    );
}

export default AppointmentMessageItem;