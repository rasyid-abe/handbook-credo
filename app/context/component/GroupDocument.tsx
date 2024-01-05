import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'

const Detail = ({title, icon, onPress}:any) => {
    return (
        <View style={{flex:1, alignItems: 'center', marginBottom: 10}}>
            <TouchableOpacity onPress={onPress}>
                <View style={{width: 60, height: 60, borderRadius: 10, backgroundColor: '#cecece', justifyContent: 'center', alignItems: 'center'}}>
                    <Ionicons name={icon != null ? icon : 'albums'} size={50} color='#2a4fa3' />
                </View>
            </TouchableOpacity>
            <Text style={{justifyContent: 'center', alignItems:'center', fontSize: 12, fontWeight: 'bold', marginTop: 5, marginBottom: 10}}>{title}</Text>
        </View>
    )
}

const NoneData = () => {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <Text style={{marginTop:30}}>No Data</Text>
      </View>
    )
  }

const GroupDocument = ({item, navigation}:any) => {
  return (
    <SafeAreaView>
        <View style={{flex: 1, flexDirection: 'row'}}>
            {item.length > 0 ? item.map(item => (
               <Detail 
                    key={item.id}  
                    title={item.name}
                    icon={item.icon}
                    onPress={() => navigation.navigate('ListDocuments', {title: item.name, id: item.id})}
                />
            )) : <NoneData />}
        </View>
    </SafeAreaView>
  )
}

export default GroupDocument