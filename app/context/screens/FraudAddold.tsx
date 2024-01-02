import { View, Text, TouchableOpacity, SafeAreaView, TextInput, StyleSheet, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { ImagePicker, Album, Asset } from 'expo-image-multiple-picker'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as ExpoPicker from 'expo-image-picker'
import axios from 'axios';
import { API_URL, TOKEN_KEY, useAuth } from '../AuthContext'
import * as SecureStore from 'expo-secure-store';

const FraudAdd = ({navigation}: any) => {
  const [open, setOpen] = useState(false)
  const [album, setAlbum] = useState<Album | undefined>()
  const [assets, setAssets] = useState<Asset[]>([])

  const selectImage = async (useLibrary: boolean) => {
    let result;

    const options: ExpoPicker.ImagePickerOptions = {
        mediaTypes: ExpoPicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit : 4
    }

    if (useLibrary) {
        result = await ExpoPicker.launchImageLibraryAsync(options)
    } else {
        await ExpoPicker.requestCameraPermissionsAsync();
        result = await ExpoPicker.launchCameraAsync(options)
    }

    if(!result.canceled){
        console.log(result.assets)
    }
  }

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

    const formData = new FormData()
    for (let i=0; i <assets.length; i++){
      let filename = assets[i].uri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      formData.append(`file_${i}`, {uri: assets[i].uri,type,name: filename})
    }

    formData.append('name', 'frank')
    const token = await SecureStore.getItemAsync(TOKEN_KEY)
    await fetch(`${API_URL}api/fraud`, {
      method: 'POST',
      headers: {
        Accept: "application/x-www-form-urlencoded",
        Authorization: `${token}`
      },
      body: formData
    }).then(res => res.json()).then(res => {
      console.log('success')
      console.log(res)
    }).catch(err => {
      console.log('failed')
      console.log(err)
    })
   
    return true
  }

  return (
    <SafeAreaView>
      <View style={{width: '100%', height: 80, backgroundColor: '#2a4fa3', paddingTop: 40, borderBottomLeftRadius: 30, paddingHorizontal: 20}}>
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
          <TextInput placeholder='Branch' style={styles.input} />

          <Text style={{fontWeight: 'bold'}}>Contract No</Text>
          <TextInput placeholder='Contract No' style={styles.input} />
        
          <Text style={{fontWeight: 'bold'}}>Installments</Text>
          <TextInput placeholder='Installments' style={styles.input} />
        
          <Text style={{fontWeight: 'bold'}}>Customer Name</Text>
          <TextInput placeholder='Customer Name' style={styles.input} />
        
          <Text style={{fontWeight: 'bold'}}>Marketing Name</Text>
          <TextInput placeholder='Marketing Name' style={styles.input} />
        
          <Text style={{fontWeight: 'bold'}}>Report Type</Text>
          <TextInput placeholder='Report Type' style={styles.input} />
        
          <Text style={{fontWeight: 'bold'}}>Description</Text>
          <TextInput multiline={true} numberOfLines={3} placeholder='Description' style={styles.textarea} />

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