import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { WebView } from 'react-native-webview';
import { API_URL, USER_DATA, TOKEN_KEY} from '../AuthContext'
import * as SecureStore from 'expo-secure-store';
import Ionicons from '@expo/vector-icons/Ionicons'
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const TermCondition = ({navigation, route}:any) => {
    const [text, setText] = useState([])

    const loadData = async () => {
        const token = await SecureStore.getItemAsync(TOKEN_KEY)
        const uinfo = await SecureStore.getItemAsync(USER_DATA)
        const nikp = JSON.parse(uinfo)

        let params = {'nik': nikp.nik, 'id_notif':route.params?.id_notif == undefined ? 0 : route.params?.id_notif}
    
        return fetch(`${API_URL}api/termcondition?${new URLSearchParams(params)}`, {
            headers: {
                Authorization: `${token}`
            }
        }).then(res => res.json()).then(res => {
            setText(res.data)
        }).catch(err => {
            console.log(err)
            return err
        })
    }

    useEffect(() => {
        loadData()
        
    }, [])

    const customHTML = `
        <body style="display:flex; flex-direction: column; 
        align-items:center; height: 100%; padding-left: 40; padding-right:40; font-size: 12pt">
            ${text.body}
        </body>`;

    return (
        <SafeAreaView style={{flex: 1}}>
        <View style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', paddingTop: 10, borderBottomLeftRadius: 30, paddingHorizontal: 20}}>

            <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name='arrow-back' size={25} color='#fff' />
                </TouchableOpacity>
                <Text style={{fontSize: 16, fontWeight: 'bold', color:'#fff'}}>Term & Condition</Text>
                {/* <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Ionicons name='home' size={25} color='#fff' />
                </TouchableOpacity> */}
            </View>

        </View>

        {/* <View style={{height:20, width:'100%', backgroundColor:'#fff'}} />  */}
        <WebView
        originWhitelist={['*']}
        source={{ html: customHTML}}
        scrollEnabled
        />

        </SafeAreaView>
    )
}

export default TermCondition

const styles = StyleSheet.create({})