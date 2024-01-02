import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as SecureStore from 'expo-secure-store';
import { TextInput } from 'react-native-gesture-handler';


const Fraud = ({navigation}) => {
  const [key,setKey] = useState('')
  const [value,setValue] = useState('')
  const [result,setResult] = useState('')


  const save = async (key, value) => {
    await SecureStore.setItemAsync(key, value)
  }

  const getValueFor = async (key) => {
    let result = await SecureStore.getItemAsync(key)
    if (result){
      setResult(result)
    } else {
      console.log('invalid key')
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
   </View>
  )
}

export default Fraud