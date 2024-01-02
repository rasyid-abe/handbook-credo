import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { API_URL, TOKEN_KEY, USER_DATA} from '../AuthContext'
import * as SecureStore from 'expo-secure-store';

const ListFraud = ({branch, contract, onPress}:any) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress}>
          <View style={{flex:1, backgroundColor:'darkgreen' , borderRadius: 5, padding: 10, justifyContent: 'center', marginVertical: 5}}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Ionicons name='reader-outline' size={50} style={{color:'#fff'}} />  
                  <View>
                      <Text style={{textTransform: 'uppercase', color:'#fff', fontSize:12, marginBottom:-5}}>No. {contract}</Text>
                      <Text style={{fontSize: 20, fontWeight: 'bold', color:'#fff'}}>{branch}</Text>
                  </View>
              </View>  
          </View>    
      </TouchableOpacity>
  </View>
  )
}

const NoData = () => {
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <Text style={{marginTop:30}}>No Data</Text>
    </View>
  )
}

const Fraud = ({navigation, route}:any) => {
  const [document, setDocument] = useState([])
  const [docEmpty, setDocEmpty] = useState(false)
  const [userData, setUserData] = useState([])

  const loadData =async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY)
    const uinfo = await SecureStore.getItemAsync(USER_DATA)
    setUserData(JSON.parse(uinfo))
  
    // let params = {'group_id': route.params?.id}
    let params = {}
    params['nik'] = userData.nik
    
    return fetch(`${API_URL}api/fraud_list?${new URLSearchParams(params)}`, {
      headers: {
        Authorization: `${token}`
      }
    }).then(res => res.json()).then(res => {
        console.log(res.data);
        
        if (res.data != undefined){
          setDocument(res.data)
          setDocEmpty(true)
        }
  
      }).catch(err => {
      console.log(err);
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
          <Text style={{fontSize: 16, fontWeight: 'bold', color:'#fff'}}>Fraud</Text>
          <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}} onPress={() => navigation.navigate('FraudAdd')}>
            <Ionicons name='add-circle' size={25} color='#fff' />
            <Text style={{color: '#fff', fontSize:16}}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{paddingHorizontal: 20}}>

        <ScrollView style={{marginTop: 10}}>

          {docEmpty ? document.map((item, i) => (
            <ListFraud 
              key={i}
              branch={item.branch_name}
              contract={item.contract_no}
              onPress={() => navigation.navigate('DetailFraud', {id: item.id, contract: item.contract_no} )}
            />
          )) : <NoData />}
  
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Fraud