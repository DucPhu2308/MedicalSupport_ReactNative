import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthAPI from "../API/AuthAPI";
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import React, { useState } from 'react';
import DefaultLayoutLogReg from "../layouts/DefaultLayoutLogReg";

const FillOtpScreen = ({ navigation }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleFillOtp = async () => {
        if (!otp) {
            setError("Vui lòng điền mã OTP!");
            return;
        }
        const email = await AsyncStorage.getItem('email');
        const data = {
            email,
            activeCode: otp,
        };
        console.log(data);
        AuthAPI.confirmUser(data)
            .then(response => {
                console.log(response.data);
                AsyncStorage.removeItem('email');
                navigation.navigate('Login');
            })
            .catch(error => {
                console.error(error);
                setError(error.response.data.message);
            });
    }

    return (
        // <View style={styles.container}>
        //     <Text style={styles.text}>Nhập mã OTP</Text>
        //     <Text style={styles.errorText}>{error}</Text>

        //     <TextInput
        //         value={otp}
        //         onChangeText={setOtp}
        //         style={styles.input} placeholder="Mã OTP" />
        //     <Button title="Xác nhận" onPress={handleFillOtp} />

        // </View>
        <DefaultLayoutLogReg>
            <View className="flex-1 justify-center p-2 ">
                <View className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                    <Text className='text-2xl font-bold text-center mt-5'>Xác nhận tài khoản</Text>
                    <View className='mt-5'>
                        <Text className='text-lg font-bold text-left'>Mã xác nhận:</Text>
                        <TextInput
                            className='border border-gray-300 rounded-lg p-2 mt-2'
                            placeholder="Nhập mã xác nhận"
                            value={otp}
                            onChangeText={setOtp}
                        />
                    </View>
                    {error ? <Text className='text-red-500 text-center mt-2'>{error}</Text> : null}
                    <TouchableOpacity className='bg-blue-500 p-2 rounded-lg mt-5' onPress={handleFillOtp}>
                        <Text className='text-white text-center font-bold'>Xác nhận</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </DefaultLayoutLogReg>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    errorText: {
        color: 'red',
    },
});

export default FillOtpScreen;