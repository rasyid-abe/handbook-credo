import { View, Text, SafeAreaView, TouchableOpacity, ScrollView,StyleSheet } from 'react-native'
import React, { useEffect, useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons'
import { API_URL, USER_DATA, TOKEN_KEY, useAuth } from "../AuthContext";
import * as SecureStore from "expo-secure-store";

const ListFid = ({branch, contract, customer, type, onPress}: any) => {
  return (
      <View>
          <TouchableOpacity onPress={onPress}>
              <View style={{flex:1, backgroundColor:'#6cad5f', borderRadius: 5, padding: 10, justifyContent: 'center', marginVertical: 5}}>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                      <Ionicons name={'document-text-outline'} size={50} style={{color:'#fff'}} />  
                      <View>
                          <Text style={{textTransform: 'uppercase', color:'#fff', fontSize:10}}>{type}</Text>
                          <Text style={{fontSize: 16, fontWeight: 'bold', color:'#fff'}}>{branch}</Text>
                          <Text style={{marginTop:-2, color:'#fff'}}>{customer + ' - ' + contract}</Text>
                      </View>
                  </View>  
              </View>    
          </TouchableOpacity>
      </View>
  )
}

const Fid = ({navigation, route}:any) => {
  const [fid, setFid] = useState([])
  const [showData, setShowData] = useState(false)

  const loadData = async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const uinfo = await SecureStore.getItemAsync(USER_DATA);

    const nikp = JSON.parse(uinfo);
    let params = {'nik': nikp.nik};

    fetch(`${API_URL}api/fid?${new URLSearchParams(params)}`, {
      headers: {
        Authorization: `${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {        
        if (res.data) {
          setShowData(true)
          setFid(res.data.result)
        }
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }

  useEffect(() => {
    loadData();
    
  }, []);
  return (
    <SafeAreaView>
        <View style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', paddingTop: 10, borderBottomLeftRadius: 30, paddingHorizontal: 20}}>

            <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name='arrow-back' size={25} color='#fff' />
                </TouchableOpacity>
                <Text style={{fontSize: 16, fontWeight: 'bold', color:'#fff'}}>Data Fid</Text>
            </View>

        </View>

        <View style={{paddingHorizontal: 20}}>
        <ScrollView style={{marginTop:10}}>
        {showData ? fid.map((item,i) => (
            <ListFid
                key={i}
                branch={item.branch_name}
                contract={item.contract_no}
                customer={item.customer_name}
                type={item.type}
                onPress={() => navigation.navigate('FidForm', {id: item.id, type:item.type})}
            />
            )) : <Text style={{alignItems:'center'}}>No Data</Text>}
        </ScrollView>
        </View>
    </SafeAreaView>
  )
}

export default Fid

const styles = StyleSheet.create({})