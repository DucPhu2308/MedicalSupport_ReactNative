import { MessageType } from "../../API/ChatAPI";
import AppointmentMessageItem from "./AppointmentMessageItem";
import ImageMessageItem from "./ImageMessageItem";
import TextMessageItem from "./TextMessageItem";

const MessageItem = ({ message, isSent }) => {
    const type = message.type;

    if (type === MessageType.TEXT) {
        return <TextMessageItem message={message} isSent={isSent} />;
    } else if (type === MessageType.IMAGE) {
        return <ImageMessageItem message={message} isSent={isSent} />;
    } 
    else if (type === MessageType.APPOINTMENT) {
        return <AppointmentMessageItem message={message} isSent={isSent} />;
    } 
    else {
        return null;
    }
};

export default MessageItem;