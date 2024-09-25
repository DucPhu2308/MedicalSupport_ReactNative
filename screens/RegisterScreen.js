import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import AuthAPI from "../API/AuthAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DefaultLayoutLogReg from "../layouts/DefaultLayoutLogReg";
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [gender, setGender] = useState('Nam');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = () => {
        if (password !== confirmPassword) {
            setError("Mật khẩu không khớp!");
            return;
        }
        if (!email || !password || !firstName || !lastName) {
            setError("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        const data = {
            email,
            password,
            firstName,
            lastName,
            gender,
            dateOfBirth: dateOfBirth.toISOString().split('T')[0] // Định dạng ngày tháng ISO
        };
        AuthAPI.register(data)
            .then(response => {
                console.log(response.data);
                AsyncStorage.setItem('email', email);
                navigation.navigate('FillOtp');
            })
            .catch(error => {
                console.error(error);
                setError(error.response?.data.message || "Đăng ký thất bại");
            });
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(false);
        setDateOfBirth(currentDate);
    };

    return (
        <DefaultLayoutLogReg>
            <View className=' flex-1 justify-center p-2'>
                <View className="p-2 rounded-lg " style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', height: 600 }}>
                    <View >
                        <Text className="text-xl font-bold text-center" >ĐĂNG KÝ</Text>
                    </View>

                    <ScrollView className='mt-5'>
                        <View className='mt-5'>
                            <Text className='text-lg font-bold text-left'>Họ và tên lót:</Text>
                            <TextInput
                                className='border border-gray-300 rounded-lg p-2 mt-2 bg-white'
                                onChangeText={setFirstName}
                                placeholder="Nhập họ và tên lót"
                            />
                        </View>

                        <View className='mt-5'>
                            <Text className='text-lg font-bold text-left'>Tên:</Text>
                            <TextInput
                                className='border border-gray-300 rounded-lg p-2 mt-2 bg-white'
                                onChangeText={setLastName}
                                placeholder="Nhập tên"
                            />
                        </View>

                        <View className='mt-5'>
                            <Text className='text-lg font-bold text-left'>Email:</Text>
                            <TextInput
                                className='border border-gray-300 rounded-lg p-2 mt-2 bg-white'
                                onChangeText={setEmail}
                                placeholder="Email"
                            />
                        </View>

                        <View className='mt-5'>
                            <Text className='text-lg font-bold text-left'>Ngày sinh:</Text>
                            <TouchableOpacity
                                className='border border-gray-300 rounded-lg p-2 mt-2 bg-white'
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text>{dateOfBirth.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                        </View>
                        {showDatePicker && (
                            <DateTimePicker
                                value={dateOfBirth}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                            />
                        )}

                        <View className='mt-5'>
                            <Text className='text-lg font-bold text-left'>Giới tính:</Text>
                            <RadioButton.Group onValueChange={newValue => setGender(newValue)} value={gender} >
                                <View className='flex-row justify-around mt-2'>
                                    <View className='flex-row items-center'>
                                        <RadioButton value="male" />
                                        <Text>Nam</Text>
                                    </View>
                                    <View className='flex-row items-center'>
                                        <RadioButton value="female" />
                                        <Text>Nữ</Text>
                                    </View>
                                </View>
                            </RadioButton.Group>
                        </View>

                        <View className='mt-5'>
                            <Text className='text-lg font-bold text-left'>Mật khẩu:</Text>
                            <TextInput
                                className='border border-gray-300 rounded-lg p-2 mt-2 bg-white'
                                onChangeText={setPassword}
                                secureTextEntry
                                placeholder="Mật khẩu"
                            />
                        </View>

                        <View className='mt-5'>
                            <Text className='text-lg font-bold text-left'>Xác nhận mật khẩu:</Text>
                            <TextInput
                                className='border border-gray-300 rounded-lg p-2 mt-2 bg-white'
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                placeholder="Nhập lại mật khẩu"
                            />
                        </View>
                    </ScrollView>
                    {error ? <Text className='text-red-500 text-center mt-2'>{error}</Text> : null}
                    <TouchableOpacity className='bg-blue-500 p-3 rounded-lg mt-5' onPress={handleRegister}>
                        <Text className='text-white text-center font-bold'>Đăng ký</Text>
                    </TouchableOpacity>
                    <View className='mt-5 flex-row justify-center'>
                        <Text className='text-center'>Bạn đã có tài khoản?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text className='text-blue-500 ml-2'>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>


                </View>


            </View>
        </DefaultLayoutLogReg>
        // <View style={styles.container}>
        //     <Text style={styles.text}>Đăng ký</Text>
        //     <Text style={styles.errorText}>{error}</Text>

        //     <TextInput
        //         value={firstName}
        //         onChangeText={setFirstName}
        //         style={styles.input} placeholder="Họ và tên đệm" />

        //     <TextInput
        //         value={lastName}
        //         onChangeText={setLastName}
        //         style={styles.input} placeholder="Tên" />

        //     <TextInput
        //         value={email}
        //         onChangeText={setEmail}
        //         style={styles.input} placeholder="Email" />

        //     <TextInput
        //         value={password}
        //         onChangeText={setPassword}
        //         style={styles.input} placeholder="Mật khẩu" secureTextEntry={true} />
        //     <Button title="Đăng ký" onPress={handleRegister} />

        //     <Text style={styles.subText}>
        //         Đã có tài khoản?
        //         <Pressable onPress={() => navigation.navigate('Login')}>
        //             <Text style={{ color: 'blue' }}> Đăng nhập</Text>
        //         </Pressable>
        //     </Text>
        // </View>
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
    subText: {
        fontSize: 16,
        fontWeight: 'normal',
    },
    errorText: {
        color: 'red',
        backgroundColor: 'pink',
    },
    input: {
        width: 300,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    }
});

export default RegisterScreen;