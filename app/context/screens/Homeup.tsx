import { Button, ScrollView, StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'

import axios from 'axios';
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons'
import * as SecureStore from 'expo-secure-store';
import { API_URL, TOKEN_KEY, useAuth } from '../AuthContext'

const imgDir = FileSystem.documentDirectory + 'images/';
const ensureDirExists =async () => {
    const dirInfo = await FileSystem.getInfoAsync(imgDir);
    if(!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imgDir, {intermediates: true})
    }
}

const Home = ({navigation}: any) => {
    const [images, setImages] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const {authState, onLogin, onLogout} = useAuth()

    useEffect(() => {
        loadImages();
    }, [])

    const loadImages = async () => {
        await ensureDirExists()
        const files = await FileSystem.readDirectoryAsync(imgDir)
        if (files.length > 0) {
            setImages(files.map(f => imgDir + f))
        }
    }

    const selectImage = async (useLibrary: boolean) => {
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
            saveImage(result.assets[0].uri)
        }
    }

    const saveImage = async (uri: string) => {
        await ensureDirExists()
        const filename = new Date().getTime() + '.jpg'
        const dest = imgDir + filename
        await FileSystem.copyAsync({from:uri, to:dest})
        setImages([...images, dest])
    }
 
    const deleteImage =async (uri:string) => {
        await FileSystem.deleteAsync(uri)
        setImages(images.filter((i) => i !== uri))
    }

    const uploadImage =async (uri:string) => {
        setLoading(true)

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
        setLoading(false);
    }
    
    const renderItem = ({item}:{item: string}) => {
        const filename = item.split('/').pop()

        return (
            <View style={{flexDirection: 'row', margin:1, alignItems: 'center',gap:5}}>
                <Image source={{uri:item}} style={{width:80, height:80}} />
                <Text style={{flex: 1}}>{filename}</Text>
                <Ionicons.Button name="cloud-upload" onPress={() => uploadImage(item)} />
                <Ionicons.Button name="trash" onPress={() => deleteImage(item)} />
            </View>
        )
    }
    return (
        <SafeAreaView>
            <TouchableOpacity
                style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', borderRadius: 10, justifyContent:'center', alignItems:'center', marginVertical: 10}}
                onPress={() => navigation.navigate('Profile')}
            >
                <Text style={{fontSize: 20, fontWeight:'bold', color:'white'}}>Profile</Text>
            </TouchableOpacity>
            <View>
                <Button title="Photo Library" onPress={() => selectImage(true)} />
                <Button title="Capture Image" onPress={() => selectImage(false)} />
            </View>

            <Text style={{alignItems: 'center', fontSize:20, fontWeight: '500'}}>MyImages</Text>
            <FlatList data={images} renderItem={renderItem} />
        </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({})