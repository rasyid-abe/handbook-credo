import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as SecureStore from 'expo-secure-store';
import { API_URL, USER_DATA, TOKEN_KEY, useAuth } from '../AuthContext'

const ListDocument = ({title, desc, type, onPress}: any) => {
    return (
        <View>
            <TouchableOpacity onPress={onPress}>
                <View style={{flex:1, backgroundColor:type != 'text' ? '#f7746d' : '#6cad5f' , borderRadius: 5, padding: 10, justifyContent: 'center', marginVertical: 5}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Ionicons name={type != 'pdf' ? 'document-text-outline' : 'reader-outline'} size={50} style={{color:'#fff'}} />  
                        <View>
                            <Text style={{textTransform: 'uppercase', color:'#fff', fontSize:10, marginBottom:-5}}>{type}</Text>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color:'#fff'}}>{title}</Text>
                            <Text style={{marginTop:-2, color:'#fff'}}>{desc != null ? desc.substring(0, 50) : 'None'}</Text>
                        </View>
                    </View>  
                </View>    
            </TouchableOpacity>
        </View>
    )
}

const ListDocuments = ({navigation, route}:any) => {
    const [document, setDocument] = useState([])
    const [userData, setUserData] = useState([])

    const loadData =async () => {
        const token = await SecureStore.getItemAsync(TOKEN_KEY)
        const uinfo = await SecureStore.getItemAsync(USER_DATA)
        
        const nikp = JSON.parse(uinfo)
        setUserData(JSON.parse(uinfo))
        
        let params = {'group_id': route.params?.id, 'nik' : nikp.nik}
        
        return fetch(`${API_URL}api/list_document?${new URLSearchParams(params)}`, {
          headers: {
            Authorization: `${token}`
          }
        }).then(res => res.json()).then(res => {
            setDocument(res.data)
            
            console.log(document);
        }).catch(err => {
            console.log(err);
            
            return err
        })
    }
    
    useEffect(() => {
        console.log('view data list dokumen');
        loadData()
        
    }, [])
    return (
    <SafeAreaView>
        <View style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', paddingTop: 15, borderBottomLeftRadius: 30, paddingHorizontal: 20}}>

            <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                <Text style={{fontSize: 16, fontWeight: 'bold', color:'#fff'}}>{route.params?.title}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Ionicons name='home' size={25} color='#fff' />
                </TouchableOpacity>
            </View>

        </View>

        <View style={{paddingHorizontal: 20}}>
        <ScrollView style={{marginTop:10}}>
         

            {document.map((item,i) => (
                <ListDocument
                    key={i}
                    title={item.title}
                    desc={item.descr}
                    type={item.type}
                    onPress={() => navigation.navigate(item.type != 'pdf' ? 'ReadText' : 'ReadPdf', {id: item.id})}
                />
            ))}
                  
          
        </ScrollView>
        </View>
    </SafeAreaView>
    )
}

export default ListDocuments