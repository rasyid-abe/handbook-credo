import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as SecureStore from 'expo-secure-store';
import { API_URL, USER_DATA, TOKEN_KEY, useAuth } from '../AuthContext'

const CustomDrawer = (props:any) => {
    const {authState, onLogin, onLogout} = useAuth()
    const [userData, setUserData] = useState([])

    const getData = async () => {
        const uinfo = await SecureStore.getItemAsync(USER_DATA)
        setUserData(JSON.parse(uinfo))
    } 
    getData()

    return (
        <View style={{flex:1}}>
            <DrawerContentScrollView 
                {...props}
                contentContainerStyle={{backgroundColor: '#fff'}}
            >
                <View style={{backgroundColor: '#2a4fa3', flex:1, width: '92.5%', height: 100, marginHorizontal: '4%', borderRadius: 5, marginTop:8, flexDirection: 'row', alignItems: 'center', justifyContent:'center'}}>
                    {userData != null ? <Image source={{uri:`${API_URL}assets/profiles/${userData.foto}`}} style={{height: 50, width: 50, borderRadius: 5, marginVertical: 10, marginHorizontal: 15}} /> : ''}
                    <View style={{flexDirection: 'column', flex: 1, marginBottom: 10}}>
                        <Text style={{color: '#fff',  marginTop: 10, fontSize: 16, fontWeight: 'bold'}}>Hi, {userData != null ? userData.fullname: ''}</Text>
                        <Text style={{color: '#fff', fontSize:12}}>Welcome to HIH App</Text>
                    </View>
                </View>
                
                <View style={{flex: 1, backgroundColor: '#fff', marginTop: 10}}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>

            <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
                <TouchableOpacity onPress={onLogout}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name='exit-outline' size={22} />
                        <Text style={{fontSize: 15, marginLeft: 5}}>Sign Out</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CustomDrawer