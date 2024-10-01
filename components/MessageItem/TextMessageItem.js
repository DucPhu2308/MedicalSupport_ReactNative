import { StyleSheet, Text, View } from "react-native";
import { MessageType } from "../../API/ChatAPI";
import { COLOR } from "../../CommonConst";

const TextMessageItem = ({ message, isSent }) => {
  const messageStyle = isSent ? 'bg-blue-500 rounded-3xl rounded-br-md p-4 max-w-80 self-end my-0.5' : `bg-[#d9d9d9] rounded-3xl p-4 max-w-80 self-start my-0.5`;

  return message.type === MessageType.TEXT && (
    <View className={messageStyle} >
      <Text className={isSent ? 'text-white' : 'text-black'}>{message.content}</Text>
    </View>
  );
}

export default TextMessageItem;