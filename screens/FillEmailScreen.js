import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthAPI from "../API/AuthAPI";
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import React, { useState } from 'react';
import DefaultLayoutLogReg from "../layouts/DefaultLayoutLogReg";

const FillEmailScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleFillEmail = () => {
        if (!email) {
            setError("Vui lòng điền email!");
            return;
        }
        const data = {
            email,
        };

        AuthAPI.forgotPassword(data)
            .then(response => {
                console.log(response.data);
                AsyncStorage.setItem('email', email);
                navigation.navigate('ResetPassword');
            })
            .catch(error => {
                console.error(error);
                setError(error.response.data.message);
            });
    }

    return (

        <DefaultLayoutLogReg>
            <View className="flex-1 justify-center p-2 ">
                <View className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                    <View className=' justify-center'>
                        <Text className='text-2xl font-bold text-center mt-3'>Quên mật khẩu</Text>
                        <View className='mt-5'>
                            <Text className='text-lg font-bold text-left'>Email:</Text>
                            <TextInput
                                className='border border-gray-300 rounded-lg p-2 mt-2 bg-white'
                                placeholder="Nhập email"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                        {error ? <Text className='text-red-500 text-center mt-2'>{error}</Text> : null}
                        <TouchableOpacity className='bg-blue-500 p-3 rounded-lg mt-5' onPress={handleFillEmail}>
                            <Text className='text-white text-center font-bold'>Gửi yêu cầu</Text>
                        </TouchableOpacity>
                        <View className="mt-5">
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text className="text-blue-500 text-right">Đăng nhập {'>>'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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

export default FillEmailScreen;