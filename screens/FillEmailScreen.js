import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthAPI from "../API/AuthAPI";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from 'react';

const FillEmailScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleFillEmail = () => {
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
        <View style={styles.container}>
            <Text style={styles.text}>Quên mật khẩu</Text>
            <Text style={styles.errorText}>{error}</Text>

            <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input} placeholder="Email" />
            <Button title="Xác nhận" onPress={handleFillEmail} />
        </View>
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