import { View, Text, TouchableOpacity, SafeAreaView, Image, Dimensions, FlatList, ScrollView, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import Ionicons from '@expo/vector-icons/Ionicons'
import Slider from '../component/Slider'
import GroupDocument from '../component/GroupDocument'
import { API_URL, USER_DATA, TOKEN_KEY, useAuth } from '../AuthContext'
import * as SecureStore from 'expo-secure-store';

const datas = [
  {
    id: 1,
    content:  [
      {
        title: 'Spider-Man',
        icon: 'construct',
        id: '1',
      },
      {
        title: 'Battlefield 2042',
        icon: 'gift',
        id: '2',
      },
      {
        title: 'Spider-Man: Miles Morales',
        icon: 'qr-code',
        id: '3',
      }
    ]
  },
  {
    id: 2,
    content: [
      {
        title: 'Halo Infinite',
        icon: 'library',
        id: '4',
      },
      {
        title: 'Far Cry 6',
        icon: 'newspaper',
        id: '5',
      },
      {
        title: 'God of War: Ragnarok',
        icon: 'school',
        id: '6',
      },
    ]
  }
  
];

const NoneGroup = () => {
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <Text style={{marginTop:30}}>No Data</Text>
    </View>
  )
}

const Home = ({navigation, route}: any) => {
  const {authState, onLogin, onLogout} = useAuth()
  const [result, setResult] = useState([])
  const [slide, setSlide] = useState([])
  const [looks, setLooks] = useState('')
  const [userData, setUserData] = useState([])
  
  const loadData = async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY)
    const uinfo = await SecureStore.getItemAsync(USER_DATA)
    
    const nikp = JSON.parse(uinfo)
    setUserData(JSON.parse(uinfo))
    
    let params = {}
    params['nik'] = nikp.nik 
    
    return fetch(`${API_URL}api/home?${new URLSearchParams(params)}`, {
      headers: {
        Authorization: `${token}`
      }
    }).then(res => res.json()).then(res => {
      if (res.message == 'Invalid Token!' || res.message == 'Invalid request!') {
        onLogout()
      }
      setResult(res.data.group)
      setSlide(res.data.slide)
    }).catch(err => {
      console.log(err)
      return err
    })
  }

  const searchFunc = () => {
    navigation.navigate('Search', {key:looks})
    setLooks('')
  }
  
  
  useEffect(() => {
    loadData()
  }, [route])
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={'#2a4fa3'} barStyle="light-content" />
      <View style={{width: '100%', height:150, backgroundColor:'#2a4fa3', paddingTop: 15, borderBottomLeftRadius: 25, borderBottomRightRadius: 25}}>
        
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', paddingHorizontal: 20}}>
          <View>
            <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>Hia. {userData.fullname}</Text>
            <Text style={{color: '#fff', gap: 8}}>Let's explore this application</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image source={{uri: `${API_URL}assets/profiles/${userData.foto}`}} style={{height: 45, width: 45, borderRadius: 5}} />
          </TouchableOpacity>
        </View>
     
        <View style={{paddingHorizontal: 20, marginTop: 20}}>
          <View style={{ flexDirection:'row', backgroundColor: '#fff', borderRadius: 8, paddingRight: 5, paddingLeft:10, paddingVertical: 5, alignItems: 'center', height: 45}}>

          <TextInput placeholder='Search document ...' style={{flex: 1, width: 100}} onSubmitEditing={() => searchFunc()} onChangeText={(text:string) => setLooks(text)} value={looks} />
          
          <TouchableOpacity style={{width: 40, height: 40, borderRadius: 10, justifyContent:'center', alignItems:'center'}} onPress={() => searchFunc()}>
            <Ionicons name='search' size={25} color='gray' />
          </TouchableOpacity>
          </View>
        </View>
     
      </View>

      <View style={{paddingHorizontal: 20, marginTop: 10}}>
          <Text style={{fontSize: 16,fontWeight: 'bold'}}>Upcoming Information</Text>
      </View>
      <Slider images={slide} rows={slide.length} />

      <View style={{paddingHorizontal: 20, marginBottom: 10}}>
          <Text style={{fontSize: 16,fontWeight: 'bold'}}>Document Group</Text>
      </View>
          
      <ScrollView style={{paddingHorizontal: 20}} showsVerticalScrollIndicator={false}>
        {/* { datas.map((item,i) => (
          <GroupDocument 
            key={i}
            content={item.content}
            navigation={navigation}
          />
        ))} */}
        { result.length > 0 ? result.map((item,i) => (
          <GroupDocument 
            key={i}
            item={item}
            navigation={navigation}
          />
        )) : <NoneGroup />}
      </ScrollView>

    </SafeAreaView>
  )
}

export default Home