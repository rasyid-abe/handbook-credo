import React, { useEffect, useState } from 'react'
import { StyleSheet, Dimensions, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import Pdf from 'react-native-pdf';
import Ionicons from '@expo/vector-icons/Ionicons'

const Fraud = ({navigation, route}:any) => {
  const [text, setText] = useState([])
  const source = { uri: 'http://handbook-credo.id/assets/documents/Sistem.pdf', cache: true };
  return (
    <SafeAreaView>
       <View style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', paddingTop: 10, borderBottomLeftRadius: 30, paddingHorizontal: 20}}>

        <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name='arrow-back' size={25} color='#fff' />
          </TouchableOpacity>
          <Text style={{fontSize: 16, fontWeight: 'bold', color:'#fff'}}>{text.document_name}</Text>
        </View>

      </View>

      <View>
        <Pdf
          source={source}
          trustAllCerts={false}
          onLoadComplete={(numberOfPages,filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page,numberOfPages) => {
              console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
              console.log(error);
          }}
          style={{width: Dimensions.get('window').width,
          height: Dimensions.get('window').height}}
        />
      </View>
    </SafeAreaView>
  )
}

export default Fraud

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 25,
  },
  pdf: {
      flex:1,
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height,
  }
});