import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, TextInput, Image, Button, ScrollView} from 'react-native'
import React, {useMemo, useState, useEffect} from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store';
import Modal from "react-native-modal";
import { API_URL, USER_DATA, TOKEN_KEY, useAuth } from '../AuthContext'
import { ToastAndroid } from "react-native";

const Profile = ({navigation, route}:any) => {
  const radioButtons: RadioButtonProps[] = useMemo(() => ([
    {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Male',
        value: '1'
    },
    {
        id: '2',
        label: 'Female',
        value: '2'
    }
  ]), []);

  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [foto, setFoto] = useState('')
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [profile, setProfile] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [userData, setUserData] = useState([])

  const toggleModal = () => setShowModal(false)
  const selectImage = async (useLibrary: boolean) => {
    toggleModal()
    let result;

    const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75
    }

    if (useLibrary) {
        result = await ImagePicker.launchImageLibraryAsync(options)
    } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync(options)
    }

    if(!result.canceled){
      setFoto(result.assets[0].uri)
      setProfile(true)
    }
  }

  const sendData =async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY)
    const formData = new FormData()
    
    if(profile) {
      let filename = foto.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      formData.append('foto', {uri: foto, name: filename, type})
    }
    
    formData.append('nik', userData.nik)
    formData.append('fullname', fullname)
    formData.append('gender', selectedId)
    formData.append('email', email)
    formData.append('phone', phone)

    console.log(formData);
    
    
    await fetch(`${API_URL}api/profile`, {
      method: 'POST',
      headers: {
        Accept: "application/x-www-form-urlencoded",
        Authorization: `${token}`
      },
      body: formData
    }).then(res => res.json()).then(res => {
 
      if(res.status) {
        if(profile) {
          setFoto(`${API_URL}assets/profiles/${res.data.foto}`)
        }
        setSelectedId(res.data.gender)
        setFullname(res.data.fullname)
        setEmail(res.data.email)
        setPhone(res.data.phone)
        setProfile(false)
      }

      ToastAndroid.show(res.message, ToastAndroid.SHORT);

    }).catch(err => {
      ToastAndroid.show(err, ToastAndroid.SHORT);
    })

  }

  const loadData =async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY)
    const uinfo = await SecureStore.getItemAsync(USER_DATA)
    const nikp = JSON.parse(uinfo)
    setUserData(JSON.parse(uinfo))
  
    let params = {'nik': nikp.nik}
    
    return fetch(`${API_URL}api/profile?${new URLSearchParams(params)}`, {
      headers: {
        Authorization: `${token}`
      }
    }).then(res => res.json()).then(res => {
      console.log('success')
      setFoto(`${API_URL}assets/profiles/${res.data.foto}`)
      setSelectedId(res.data.gender)
      setFullname(res.data.fullname)
      setEmail(res.data.email)
      setPhone(res.data.phone)
    }).catch(err => {
      console.log('failed')
      return err
    })
  }

  useEffect(() => {
    loadData()
    
  }, [])

  return (
    <SafeAreaView>
      
      <View style={{flex: 1}}>
        <Modal isVisible={showModal}>
          <View style={{backgroundColor: '#fff', paddingVertical: 20, paddingHorizontal: 20, borderRadius: 5, marginHorizontal: 100}}>

            <View style={{justifyContent: 'space-between', flexDirection:'row', marginBottom: 20}}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Source Photo</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name='close' size={20} />
              </TouchableOpacity>
            </View>
            <View style={{justifyContent:'space-between', flexDirection: 'row'}}>
              <TouchableOpacity style={{width: 60, height:60, backgroundColor:'#cecece', borderRadius: 10, justifyContent:'center', alignItems:'center'}} onPress={() => selectImage(false)}>
                <Ionicons name='camera' size={30} style={{color: 'blue'}} />
                <Text style={{fontWeight:'bold'}}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{width: 60, height:60, backgroundColor:'#cecece', borderRadius: 10, justifyContent:'center', alignItems:'center'}} onPress={() => selectImage(true)}>
                <Ionicons name='image' size={30} style={{color: 'blue'}} />
                <Text style={{fontWeight:'bold'}}>Gallery</Text>
              </TouchableOpacity>
            </View>

          </View>
        </Modal>
      </View>

      <View style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', paddingTop: 15, borderBottomLeftRadius: 30, paddingHorizontal: 20}}>
        <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name='menu' size={25} color='#fff' />
          </TouchableOpacity>
          <Text style={{fontSize: 16, fontWeight: 'bold', color:'#fff'}}>My Profile</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name='home' size={25} color='#fff' />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>

        <View style={{paddingHorizontal: 20, marginTop: 20, alignItems:'center'}}>
          <View style={{width: 150, height:150, borderRadius: 75, alignItems:'center', justifyContent:'center', backgroundColor:'#fefefe', position:'relative'}}> 
            {foto == '' ? <Ionicons name='person-outline' size={125} /> : <Image source={{uri:foto}} style={{width:140, height:140, borderRadius:70}} />}
            <TouchableOpacity style={{width:30, height: 30, borderRadius:15, backgroundColor:'gray', position:'absolute', bottom: 10, right:10, justifyContent:'center', alignItems:'center'}} onPress={() => setShowModal(true)}>
              <Ionicons name='camera' size={20} style={{color:'#fff'}} />
            </TouchableOpacity>
          </View>
          <Text style={{fontSize: 16, fontWeight:'bold', marginTop: 10}}>NIK: {userData.nik}</Text>
        </View>


        <View style={{paddingHorizontal: 20, marginTop: 20}}>
        
          <Text style={{fontWeight: 'bold'}}>Fullname</Text>
          <TextInput placeholder='Fullname' style={styles.input} onChangeText={(value) => {setFullname(value)}} value={fullname} />

          <Text style={{fontWeight: 'bold'}}>Email</Text>
          <TextInput placeholder='Email' style={styles.input} onChangeText={(value) => {setEmail(value)}} keyboardType='email-address' value={email} />
        
          <Text style={{fontWeight: 'bold'}}>Phone (Start With 62)</Text>
          <TextInput placeholder='Phone' style={styles.input} onChangeText={(value) => {setPhone(value)}} keyboardType='numeric' value={phone} />
        
          <Text style={{fontWeight: 'bold'}}>Gender</Text>
          <RadioGroup 
              radioButtons={radioButtons} 
              onPress={setSelectedId}
              selectedId={selectedId}
              layout='row'
              containerStyle={{marginLeft: -9, paddingBottom: 20}}
          />
        
          <TouchableOpacity 
            style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', borderRadius: 10, justifyContent:'center', alignItems:'center', marginTop: 10}}
            onPress={() => sendData()}
          >
            <Text style={{fontSize: 20, fontWeight:'bold', color:'white'}}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      
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
  }
})

export default Profile