import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

const YesNoDialog = ({ title, message, onConfirm, onCancel, isOpen, yesText = 'Yes', noText = 'No' }) => {
  if (!isOpen) return null;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isOpen}
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center bg-black/60">
        <View className="bg-[#F7EEDD] w-72 p-5 rounded-lg shadow-md items-center">
          <Text className="text-xl font-bold mb-2">{title}</Text>
          <Text className="text-base text-center mb-5">{message}</Text>
          <View className="flex-row justify-around w-full">
            <TouchableOpacity onPress={onCancel} className="bg-[#f44336] py-2 px-5 rounded-md flex-1 items-center mr-2">
              <Text className="text-white font-bold">{noText}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} className="bg-[#4caf50] py-2 px-5 rounded-md flex-1 items-center">
              <Text className="text-white font-bold">{yesText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default YesNoDialog;
