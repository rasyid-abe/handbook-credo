import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { WebView } from 'react-native-webview';
import { API_URL, USER_DATA, TOKEN_KEY} from '../AuthContext'
import * as SecureStore from 'expo-secure-store';
import Ionicons from '@expo/vector-icons/Ionicons'
import { ScrollView } from 'react-native-gesture-handler';

const ReadText = ({navigation, route}:any) => {
    const [text, setText] = useState([])

    const loadData =async () => {
        const token = await SecureStore.getItemAsync(TOKEN_KEY)
        const uinfo = await SecureStore.getItemAsync(USER_DATA)
        
        const nikp = JSON.parse(uinfo)
        let params = {'text_id': route.params?.id, 'nik':nikp.nik}
        
        return fetch(`${API_URL}api/document_text?${new URLSearchParams(params)}`, {
          headers: {
            Authorization: `${token}`
          }
        }).then(res => res.json()).then(res => {
            setText(res.data)
        }).catch(err => {
          return err
        })
    }

    useEffect(() => {
        loadData()
        
    }, [])

    const customHTML = `
        <body style="display:flex; flex-direction: column; 
        align-items:center; height: 100%; padding-left: 40; padding-right:40; font-size: 12pt: margin-top:40">
            ${text.body}
        </body>`;

    const INJECTEDJAVASCRIPT = "document.body.style.userSelect = 'none'";

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', paddingTop: 10, borderBottomLeftRadius: 30, paddingHorizontal: 20}}>

                <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name='arrow-back' size={25} color='#fff' />
                    </TouchableOpacity>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color:'#fff'}}>{text.document_name}</Text>
                </View>

            </View>

            <View style={{height:10, width:'100%', backgroundColor:'#fff'}} /> 
            <WebView
            originWhitelist={['*']}
            source={{ html: customHTML}}
            injectedJavaScript={INJECTEDJAVASCRIPT}
            scrollEnabled
            />

        </SafeAreaView>
    )
}

export default ReadText