import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import queryString from 'query-string';
import { useNavigation } from '@react-navigation/native';

//const BASE_URL = 'http://192.168.202.135:4000/api';
const BASE_URL = 'http://192.168.56.1:4000/api';
const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    paramsSerializer: params => queryString.stringify(params)
});
export default axiosClient;

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    // withCredentials: true
});

axiosPrivate.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosPrivate.interceptors.response.use((response) => {
    return response;
}, (error) => {
    console.log(error);
    if (error.response?.status === 401) {
        AsyncStorage.removeItem('token');
        const navigation = useNavigation();
        navigation.navigate('Login');
    }
    return Promise.reject(error);
});