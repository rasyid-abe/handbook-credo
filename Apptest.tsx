import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
export const API_URL = 'http://handbook-credo.id/';
// export const API_URL = 'http://192.168.1.6/hih_admirn/';

const App = () => {
  const [nik, setNik] = useState('');
  const [password, setPassword] = useState('');
  const [key,setKey] = useState('')
  const [value,setValue] = useState('')
  const [result,setResult] = useState('')

  const save = async (key:string, value:string) => {
    await SecureStore.setItemAsync(key, value)
  }

  const getValueFor = async (key:string) => {
    let result = await SecureStore.getItemAsync(key)
    if (result){
      setResult(result)
    } else {
      console.log('invalid key')
    }
  }

  const getData = async () => {
    console.log('balclake');
    
    try {
      const result = await axios.get(`${API_URL}appauth/show`);
      console.log('success');
      console.log(result.data.data);
      alert(result.data.data)
    } catch(e) {
      console.log('failed');
      console.log((e as any).response.data);
      alert('gagal')
      alert((e as any).response.data.data)
    }
  }

  const getDataFetch = () => {
    let params = {}
    params['nik'] = '0909090909'
    
    return fetch(`${API_URL}appauth/fetch_api?${new URLSearchParams(params)}`, {
    }).then(res => res.json()).then(res => {
      alert(res.data)
      console.log(res);
      
      console.log('from fetch');
      
    }).catch(err => {
      console.log('from fetchs');
      alert(err)
      console.log(err)
      return err
    })
  }

  const loginaxios = async () => {
     try {
        const result = await axios.post(`${API_URL}appauth/login_axios`, {nik, password});
        console.log('axios success')
        alert(`Hello ${result.data.data.fullname} from axios`)
        console.log(result.data);
        
      } catch(e) {
        console.log('axios failed')
        alert((e as any).response.data.message)
        return {error: true, msg: (e as any).response.data.message}
    }
  }

  const loginfetch = async () => {
    const formData = new FormData()
    formData.append('nik', nik)
    formData.append('password', password)

    try {
        const result = await fetch(`${API_URL}appauth/login_fetch`, {
            method: 'POST',
            headers: {
                Accept: "application/x-www-form-urlencoded",
            },
            body: formData
        }).then(res => res.json()).then(async res => {
          if (res.status) {
            alert(`Hello ${res.data.fullname} from fetch`)
          } else {
            alert(`${res.message} from fetch`)
          }
          console.log(res);
        })
          
    } catch(e) {
        alert(`${(e as any).response.data.message} from fetch`);
        return {error: true, msg: (e as any).response.data.message}
    }
  }

  return (
   <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
    <Text>Save Key/Value</Text>
    <TextInput
      style={{height: 40, paddingHorizontal:20, borderWidth: 1}}
      placeholder='enter a key'
      onChangeText={text => setKey(text)}
      value={key}
    />
    <TextInput
      style={{height: 40, paddingHorizontal:20, borderWidth: 1}}
      placeholder='enter a value'
      onChangeText={text => setValue(text)}
      value={value}
    />

    <TouchableOpacity 
      style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', borderRadius: 10, justifyContent:'center', alignItems:'center', marginTop: 10}}
      onPress={() => {
        save(key,value)
        setKey('')
        setValue('')
      }}
    >
      <Text style={{fontSize: 20, fontWeight:'bold', color:'white'}}>Submit</Text>
      
    </TouchableOpacity>

    <Text>Enter key</Text>
    <TextInput
      style={{height: 40, paddingHorizontal:20, borderWidth: 1}}
      placeholder='enter key'
      onSubmitEditing={event => {getValueFor(event.nativeEvent.text)}}
    />

    <Text>{result}</Text>

    <View style={{flexDirection:'row'}}>
      <TouchableOpacity style={{width: 50, height: 50, backgroundColor: 'darkgreen', justifyContent:'center', alignItems:'center'}} onPress={() => getData()}>
        <Text style={{color: '#fff'}}>Axios</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{width: 50, height: 50, backgroundColor: 'darkgreen', justifyContent:'center', alignItems:'center'}} onPress={() => getDataFetch()}>
        <Text style={{color: '#fff'}}>Fetch</Text>
      </TouchableOpacity>

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
                onPress={() => loginaxios()}
            >
                <Text style={{fontSize: 20, fontWeight:'bold', color:'white'}}>Login Axios</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', borderRadius: 10, justifyContent:'center', alignItems:'center', marginTop: 10}}
                onPress={() => loginfetch()}
            >
                <Text style={{fontSize: 20, fontWeight:'bold', color:'white'}}>Login Fetch</Text>
            </TouchableOpacity>
   </View>
  )
}

export default App