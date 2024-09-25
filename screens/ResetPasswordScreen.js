import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthAPI from "../API/AuthAPI";
import { Button, StyleSheet, Text, TextInput, View,TouchableOpacity } from "react-native";
import React, { act, useState } from 'react';
import DefaultLayoutLogReg from "../layouts/DefaultLayoutLogReg";

const ResetPasswordScreen = ({ navigation }) => {
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = async () => {
        if (!password || !otp) {
            setError("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        const data = {
            email: await AsyncStorage.getItem('email'),
            password,
            activeCode: otp,
        };

        AuthAPI.resetPassword(data)
            .then(response => {
                console.log(response.data);
                navigation.navigate('Login');
            })
            .catch(error => {
                console.error(error);
                setError(error.response.data.message);
            });
    }

    return (
        // <View style={styles.container}>
        //     <Text style={styles.text}>Quên mật khẩu</Text>
        //     <Text style={styles.errorText}>{error}</Text>

        //     {/* Text input for password, confirm password */}
        //     {/* Number input for otp */}
        //     <TextInput
        //         value={password}
        //         onChangeText={setPassword}
        //         style={styles.input} placeholder="Mật khẩu" secureTextEntry={true} />
        //     <TextInput
        //         value={otp}
        //         onChangeText={setOtp}
        //         style={styles.input} placeholder="Mã OTP" keyboardType="number-pad" />
        //     <Button title="Xác nhận" onPress={handleResetPassword} />
        // </View>

        <DefaultLayoutLogReg>
            <View className="flex-1 justify-center p-2 ">
                <View className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                    <View className="justify-center">
                        <View className="  rounded-lg">
                            <Text className="text-2xl font-bold text-center mt-2">Đổi mật khẩu</Text>
                            <View className="mt-5">
                                <Text className="text-lg font-bold text-left">Mật khẩu mới:</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-2 mt-2"
                                    placeholder="Nhập mật khẩu mới"
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>
                            <View className="mt-5">
                                <Text className="text-lg font-bold text-left">Mã xác nhận:</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-2 mt-2"
                                    placeholder="Nhập mã xác nhận"
                                    value={otp}
                                    onChangeText={setOtp}
                                />
                            </View>
                            {error ? <Text className="text-red-500 text-center mt-2">{error}</Text> : null}
                            <TouchableOpacity className="bg-blue-500 p-3 rounded-lg mt-5" onPress={handleResetPassword}>
                                <Text className="text-white text-center font-bold">Đổi mật khẩu</Text>
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
    subText: {
        marginTop: 20,
    },
});

export default ResetPasswordScreen;