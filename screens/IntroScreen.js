import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const IntroScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 1000); // Chuyển sang HomeScreen sau 10 giây

    return () => clearTimeout(timer); // Xóa timer khi component unmount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Giới thiệu bản thân
        {'\n'}
        {'\n'}
        Họ tên: Nguyễn Đức Phú
        {'\n'}
        MSSV: 21110845
      </Text>
    </View>
  );
};

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
});

export default IntroScreen;
