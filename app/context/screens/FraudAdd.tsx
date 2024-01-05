import { View, Text, TouchableOpacity, SafeAreaView, TextInput, StyleSheet, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { ImagePicker, Album, Asset } from 'expo-image-multiple-picker'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as ExpoPicker from 'expo-image-picker'
import axios from 'axios';
import { API_URL, TOKEN_KEY, USER_DATA, useAuth } from '../AuthContext'
import * as SecureStore from 'expo-secure-store';
import { ToastAndroid } from "react-native";

const FraudAdd = ({navigation}: any) => {
  const [userData, setUserData] = useState([])
  const [open, setOpen] = useState(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const [branch, setBranch] = useState('')
  const [contract, setContract] = useState('')
  const [installments, setInstallments] = useState('')
  const [customer, setCustomer] = useState('')
  const [marketing, setMarketing] = useState('')
  const [type, setType] = useState('')
  const [desc, setDesc] = useState('')

  const renders = (itemsimg:any) => {
    setOpen(false)
    setAssets(itemsimg)
  }
    
  if (open) {
    return (
      <ImagePicker
      onSave={(assets) => renders(assets)}
      onCancel={() => setOpen(false)}
      multiple
      limit={4}
      />
    )
  }

  const sendData = async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY)
    const uinfo = await SecureStore.getItemAsync(USER_DATA)
    setUserData(JSON.parse(uinfo))
    
    const formData = new FormData()

    for (let i=0; i <assets.length; i++){
      let filename = assets[i].uri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      formData.append(`file_${i}`, {uri: assets[i].uri,type,name: filename})
    }

    formData.append('nik', userData.nik)
    formData.append('count', assets.length)
    formData.append('branch', branch)
    formData.append('contract', contract)
    formData.append('installments', installments)
    formData.append('customer', customer)
    formData.append('marketing', marketing)
    formData.append('type', type)
    formData.append('desc', desc)


    await fetch(`${API_URL}api/fraud`, {
      method: 'POST',
      headers: {
        Accept: "application/x-www-form-urlencoded",
        Authorization: `${token}`
      },
      body: formData
    }).then(res => res.json()).then(res => {
      console.log('success')
      console.log(res.data)
      setBranch('')
      setContract('')
      setInstallments('')
      setCustomer('')
      setMarketing('')
      setType('')
      setDesc('')
      setAssets([])

      ToastAndroid.show(res.message, ToastAndroid.SHORT);
      navigation.navigate("Fraud", {nik:userData.nik});
    }).catch(err => {
      console.log('failed')
      console.log(err)
    })
   
    return true
  }

  return (
    <SafeAreaView>
      <View style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', paddingTop: 10, borderBottomLeftRadius: 30, paddingHorizontal: 20}}>
        <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name='arrow-back' size={25} color='#fff' />
          </TouchableOpacity>
          <Text style={{fontSize: 16, fontWeight: 'bold', color:'#fff'}}>Report Fraud</Text>
        </View>
      </View>

      <View style={{paddingHorizontal: 20, marginTop: 20, height: '85%'}}>
        <ScrollView showsVerticalScrollIndicator={false}>
      
          <Text style={{fontWeight: 'bold'}}>Branch Name</Text>
          <TextInput placeholder='Branch' style={styles.input} onChangeText={(text: string) => setBranch(text)} value={branch} />

          <Text style={{fontWeight: 'bold'}}>Contract No</Text>
          <TextInput placeholder='Contract No' style={styles.input} onChangeText={(text: string) => setContract(text)} value={contract} />
        
          <Text style={{fontWeight: 'bold'}}>Installments</Text>
          <TextInput placeholder='Installments' style={styles.input} onChangeText={(text: string) => setInstallments(text)} value={installments} />
        
          <Text style={{fontWeight: 'bold'}}>Customer Name</Text>
          <TextInput placeholder='Customer Name' style={styles.input} onChangeText={(text: string) => setCustomer(text)} value={customer} />
        
          <Text style={{fontWeight: 'bold'}}>Marketing Name</Text>
          <TextInput placeholder='Marketing Name' style={styles.input} onChangeText={(text: string) => setMarketing(text)} value={marketing} />
        
          <Text style={{fontWeight: 'bold'}}>Report Type</Text>
          <TextInput placeholder='Report Type' style={styles.input} onChangeText={(text: string) => setType(text)} value={type} />
        
          <Text style={{fontWeight: 'bold'}}>Description</Text>
          <TextInput multiline={true} numberOfLines={3} placeholder='Description' style={styles.textarea} onChangeText={(text: string) => setDesc(text)} value={desc} />

          <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
            <Text style={{fontWeight: 'bold'}}>Add Images</Text>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity style={{marginRight: 10}} onPress={() => setOpen(true)}>
                <Ionicons name='camera-outline' size={30} style={{color: 'blue'}} />
              </TouchableOpacity>
              <TouchableOpacity style={{justifyContent:'center', alignItems:'center'}} onPress={() => setAssets([])}>
                <Ionicons name='backspace-outline' size={30} style={{color: 'blue'}} />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{paddingRight: 5}}>
              {assets.map((item, i) => (
                <Image key={i} source={{uri:item.uri}} style={{width:100, height:100, borderRadius:10, marginVertical: 10, marginRight: 5}} />
              ))}
            </ScrollView>
          </View>
      
        </ScrollView>

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
  },
  textarea: {
    borderWidth: 1,
    marginBottom: 12, 
    borderRadius: 5,
    backgroundColor: '#fff',
    height: 80,
    textAlignVertical: 'top',
    paddingHorizontal: 10,
    paddingVertical: 10
  }
})


export default FraudAdd