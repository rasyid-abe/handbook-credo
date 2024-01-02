import { View, Text, Image, TextInput, TouchableOpacity, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons'
import { ToastAndroid } from "react-native";

const Login = () => {
    const [nik, setNik] = useState('');
    const [password, setPassword] = useState('');
    const {onLogin, onRegister} = useAuth();

    const login = async () => {
        const result = await onLogin!(nik, password);
        if (result && result.error) {
            ToastAndroid.show(result.msg, ToastAndroid.SHORT);
        }
    };

    const register = async () => {
        const result = await onRegister!(nik, password);
        if (result && result.error) {
            alert(result.msg);
        } else {
            login();
        }
    };

    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems:'center', paddingHorizontal: 20, backgroundColor: 'white'}}>
            <StatusBar backgroundColor={'#2a4fa3'} barStyle="light-content" />
            <View>
                <Image source={require('./../../../assets/logo.png')} resizeMode='contain' style={{borderRadius: 15, justifyContent:'center', alignItems:'center'}}/>
            </View>

            <Text style={{fontSize: 28, fontWeight:'bold', color:'#333', marginBottom:30, marginTop: 30}}>Sign In Here.</Text>
            <View style={{ flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1, paddingBottom: 3, marginBottom: 25,}}>
                <Ionicons name="person-circle-outline" color='gray' size={25} style={{marginRight: 10}} />
                <TextInput placeholder='NIK' keyboardType='numeric' style={{flex: 1, paddingVertical: 0, fontSize: 20}} onChangeText={(text: string) => setNik(text)} value={nik} />
            </View>
            <View style={{ flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1, paddingBottom: 3, marginBottom: 25,}}>
                <Ionicons name="key" color='gray' size={25} style={{marginRight: 10}} />
                <TextInput placeholder='Password' style={{flex: 1, paddingVertical: 0, fontSize: 20}} secureTextEntry={true} onChangeText={(text: string) => setPassword(text)} value={password} />
            </View>

            <TouchableOpacity 
                style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', borderRadius: 10, justifyContent:'center', alignItems:'center', marginTop: 10}}
                onPress={login}
            >
                <Text style={{fontSize: 20, fontWeight:'bold', color:'white'}}>Login</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Login
