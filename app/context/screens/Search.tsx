import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { API_URL, USER_DATA, TOKEN_KEY, useAuth } from '../AuthContext'
import * as SecureStore from 'expo-secure-store';

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

const Search = ({navigation, route}:any) => {
    const [document, setDocument] = useState([])
    const [userData, setUserData] = useState([])

    const loadData =async () => {
        const token = await SecureStore.getItemAsync(TOKEN_KEY)
        const uinfo = await SecureStore.getItemAsync(USER_DATA)
        setUserData(JSON.parse(uinfo))
        
        let params = {}
        params['nik'] = userData.nik
        params['key'] = route.params?.key

        return fetch(`${API_URL}api/search?${new URLSearchParams(params)}`, {
          headers: {
            Authorization: `${token}`
          }
        }).then(res => res.json()).then(res => {
            setDocument(res.data)
            console.log(res.data)
            
        }).catch(err => {
          console.log(err)
          return err
        })
    }
      
    useEffect(() => {
        loadData()
    }, [route])
  return (
    <SafeAreaView>
        <View style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', paddingTop: 15, borderBottomLeftRadius: 30, paddingHorizontal: 20}}>

            <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name='arrow-back' size={25} color='#fff' />
                </TouchableOpacity>
                <Text style={{fontSize: 16, fontWeight: 'bold', color:'#fff'}}>Search: {route.params?.key}</Text>
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

export default Search

const styles = StyleSheet.create({})