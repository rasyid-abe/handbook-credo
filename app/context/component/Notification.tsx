import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as SecureStore from 'expo-secure-store';
import { API_URL, USER_DATA, TOKEN_KEY, useAuth } from '../AuthContext'

const ListDocument = ({title, type, onPress}: any) => {
    return (
        <View>
            <TouchableOpacity onPress={onPress}>
                <View style={{flex:1, backgroundColor:'#6cad5f', borderRadius: 5, padding: 10, justifyContent: 'center', marginVertical: 5}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Ionicons name={'notifications'} size={50} style={{color:'#fff'}} />  
                        <View>
                            <Text style={{textTransform: 'uppercase', color:'#fff', fontSize:10}}>{type == 'term' ? 'TERM & CONDITION' : type}</Text>
                            <Text style={{fontSize: 16, fontWeight: 'bold', color:'#fff'}}>{title}</Text>
                            {/* <Text style={{marginTop:-2, color:'#fff'}}>{desc != null ? desc.substring(0, 50) : 'None'}</Text> */}
                        </View>
                    </View>  
                </View>    
            </TouchableOpacity>
        </View>
    )
}

const ListDocuments = ({navigation, route}:any) => {
    const [document, setDocument] = useState([])

    const loadData = async () => {
        const token = await SecureStore.getItemAsync(TOKEN_KEY)
        const uinfo = await SecureStore.getItemAsync(USER_DATA)
        
        const nikp = JSON.parse(uinfo)
        
        let params = {'nik' : nikp.nik}
        
        return fetch(`${API_URL}api/notification?${new URLSearchParams(params)}`, {
          headers: {
            Authorization: `${token}`
          }
        }).then(res => res.json()).then(res => {
            setDocument(res.data)
        }).catch(err => {
            console.log(err);
            
            return err
        })
    }
    
    useEffect(() => {
        loadData()
        
    }, [route])
    return (
    <SafeAreaView>
        <View style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', paddingTop: 10, borderBottomLeftRadius: 30, paddingHorizontal: 20}}>

            <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name='arrow-back' size={25} color='#fff' />
                </TouchableOpacity>
                <Text style={{fontSize: 16, fontWeight: 'bold', color:'#fff'}}>Notification | Total: {document != undefined ? document.length : 0}</Text>
            </View>

        </View>

        <View style={{paddingHorizontal: 20}}>
        <ScrollView style={{marginTop:10}}>
         

            {document != undefined ? document.map((item,i) => (
                <ListDocument
                    key={i}
                    title={item.title}
                    type={item.type}
                    onPress={() => navigation.navigate(item.page, {id: item.id_content, id_notif: item.id, type: item.fid_type})}
                />
            )) : <Text>No Notification</Text>}
                  
            <View style={{ height: 120 }} />
        </ScrollView>
        </View>
        
    </SafeAreaView>
    )
}

export default ListDocuments