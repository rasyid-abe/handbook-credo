import { View, Text, SafeAreaView, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { API_URL, USER_DATA, TOKEN_KEY, useAuth } from '../AuthContext'
import * as SecureStore from 'expo-secure-store';
import { ToastAndroid } from "react-native";


const Password = ({navigation}:any) => {
  const {authState, onLogin, onLogout} = useAuth()
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [repeat, setRepeat] = useState('');
  const [userData, setUserData] = useState([])

  const sendData = async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY)
    const uinfo = await SecureStore.getItemAsync(USER_DATA)
    setUserData(JSON.parse(uinfo))
    
    const formData = new FormData()
    formData.append('current', current)
    formData.append('newPass', newPass)
    formData.append('repeat', repeat)
    formData.append('nik', userData.nik)

    setCurrent('')
    setNewPass('')
    setRepeat('')
    
    await fetch(`${API_URL}api/change_password`, {
      method: 'POST',
      headers: {
        Accept: "application/x-www-form-urlencoded",
        Authorization: `${token}`
      },
      body: formData
    }).then(res => res.json()).then(res => {
      if (res.status){
        console.log(res);
        console.log('true');
        
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
        onLogout()
      } else {
        console.log('false');
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
        console.log(res);
      }
    }).catch(err => {
      console.log('failed');
      console.log(err)
    })
    
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', paddingTop: 15, borderBottomLeftRadius: 30, paddingHorizontal: 20}}>

        <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name='menu' size={25} color='#fff' />
            </TouchableOpacity>
            <Text style={{fontSize: 16, fontWeight: 'bold', color:'#fff'}}>Change Password</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Ionicons name='home' size={25} color='#fff' />
            </TouchableOpacity>
        </View>

      </View>

      <View style={{paddingHorizontal: 20, marginTop: 20}}>

        <Text style={{fontWeight: 'bold'}}>Current Password</Text>
        <TextInput placeholder='Current Password' style={styles.input} secureTextEntry={true} onChangeText={(text: string) => setCurrent(text)} value={current} />

        <Text style={{fontWeight: 'bold', marginTop: 20}}>New Password</Text>
        <TextInput placeholder='New Password' style={styles.input} secureTextEntry={true} onChangeText={(text: string) => setNewPass(text)} value={newPass} />

        <Text style={{fontWeight: 'bold'}}>Repeat Password</Text>
        <TextInput placeholder='Repeat Password' style={styles.input} secureTextEntry={true} onChangeText={(text: string) => setRepeat(text)} value={repeat} />

        <TouchableOpacity 
          style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', borderRadius: 10, justifyContent:'center', alignItems:'center', marginTop: 10}}
          onPress={() => sendData()}
        >
          <Text style={{fontSize: 20, fontWeight:'bold', color:'white'}}>Submit</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    marginBottom: 12, 
    borderRadius: 5,
    backgroundColor: '#fff',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10
  }
})

export default Password