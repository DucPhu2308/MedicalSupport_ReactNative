import { format } from "date-fns";
import { Text, View } from "react-native";
import { AppointmentStatus, AppointmentStatusText } from "../../API/ChatAPI";
import { TouchableOpacity } from "react-native";

const AppointmentMessageItem = ({ message, isSent }) => {
    const senderName = isSent ? 'Bạn' : message.sender.lastName;
    const textColor = isSent ? 'text-white' : 'text-black';
    let messageStyleBase = 'rounded-3xl p-4 my-0.5';
    const messageStyle = isSent ? `bg-blue-500 self-end ${messageStyleBase} rounded-br-md` : `bg-[#d9d9d9] self-start ${messageStyleBase}`;
    return (
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
                <TouchableOpacity><Text className={`${textColor}`}>Xem chi tiết</Text></TouchableOpacity>
                {
                    !isSent && message.content.apptStatus === AppointmentStatus.PENDING &&
                    <TouchableOpacity><Text className={`${textColor}`}>Chấp nhận</Text></TouchableOpacity>
                }
                {
                    ((!isSent && message.content.apptStatus === AppointmentStatus.ACCEPTED)
                    || (isSent && message.content.apptStatus === AppointmentStatus.PENDING))
                    &&
                    <TouchableOpacity><Text className='text-red-400'>Hủy</Text></TouchableOpacity>
                }
            </View>
        </View>
    );
}

export default AppointmentMessageItem;