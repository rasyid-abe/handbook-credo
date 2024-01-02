import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, TextInput, Image, Button} from 'react-native'
import React, {useMemo, useState, useEffect} from 'react'
import { API_URL, TOKEN_KEY, useAuth } from '../AuthContext'
import Ionicons from '@expo/vector-icons/Ionicons'
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store';
import Modal from "react-native-modal";


const Profile = ({navigation}) => {
  const radioButtons: RadioButtonProps[] = useMemo(() => ([
    {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Male',
        value: 'option1'
    },
    {
        id: '2',
        label: 'Female',
        value: 'option2'
    }
  ]), []);

  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [foto, setFoto] = useState('')
  const [showModal, setShowModal] = useState(false)

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
    }
  }

  const uploadImage =async (uri:string) => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY)

    let result = await FileSystem.uploadAsync(`${API_URL}api/profile`, uri, {
        httpMethod: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `${token}`
        },
        
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
    });

    console.log(result)
  }

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

      <View style={{width: '100%', height: 80, backgroundColor: '#2a4fa3', paddingTop: 40, borderBottomLeftRadius: 30, paddingHorizontal: 20}}>
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

      <View style={{paddingHorizontal: 20, marginTop: 20, alignItems:'center'}}>
        <View style={{width: 150, height:150, borderRadius: 75, alignItems:'center', justifyContent:'center', backgroundColor:'#fefefe', position:'relative'}}> 
          {foto == '' ? <Ionicons name='person-outline' size={125} /> : <Image source={{uri:foto}} style={{width:140, height:140, borderRadius:70}} />}
          <TouchableOpacity style={{width:30, height: 30, borderRadius:15, backgroundColor:'gray', position:'absolute', bottom: 10, right:10, justifyContent:'center', alignItems:'center'}} onPress={() => setShowModal(true)}>
            <Ionicons name='camera' size={20} style={{color:'#fff'}} />
          </TouchableOpacity>
        </View>
        <Text style={{fontSize: 16, fontWeight:'bold', marginTop: 10}}>NIK: 123456778890</Text>
      </View>


      <View style={{paddingHorizontal: 20, marginTop: 20}}>
      
        <Text style={{fontWeight: 'bold'}}>Fullname</Text>
        <TextInput placeholder='Fullname' style={styles.input}  secureTextEntry={true} />

        <Text style={{fontWeight: 'bold'}}>Email</Text>
        <TextInput placeholder='Email' style={styles.input}  secureTextEntry={true} />
       
        <Text style={{fontWeight: 'bold'}}>Phone</Text>
        <TextInput placeholder='Email' style={styles.input}  secureTextEntry={true} />
       
        <Text style={{fontWeight: 'bold'}}>Gender</Text>
        <RadioGroup 
            radioButtons={radioButtons} 
            onPress={setSelectedId}
            selectedId={selectedId}
            layout='row'
            containerStyle={{marginLeft: -9}}
        />
      
        <TouchableOpacity 
          style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', borderRadius: 10, justifyContent:'center', alignItems:'center', marginTop: 10}}
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
  }
})

export default Profile