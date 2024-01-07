import React, { useEffect, useState } from 'react'
import { StyleSheet, Dimensions, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import Pdf from 'react-native-pdf';
import Ionicons from '@expo/vector-icons/Ionicons'
import { API_URL, USER_DATA, TOKEN_KEY} from '../AuthContext'
import * as SecureStore from 'expo-secure-store';

const ReadPdf = ({navigation, route}:any) => {
  const [text, setText] = useState([])
  const source = { uri: 'http://handbook-credo.id/assets/documents/Sistem.pdf', cache: true };

  const loadData =async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY)
    const uinfo = await SecureStore.getItemAsync(USER_DATA)
    
    const nikp = JSON.parse(uinfo)
    let params = {'pdf_id': route.params?.id, 'nik':nikp.nik}
    
    return fetch(`${API_URL}api/document_pdf?${new URLSearchParams(params)}`, {
        headers: {
            Authorization: `${token}`
        }
    }).then(res => res.json()).then(res => {
        console.log('success');
        console.log(res);
        
        setText(res.data)
    }).catch(err => {
        console.log('failed');
        
        return err
    })
}

useEffect(() => {
    loadData()
    
}, [])

  return (
    <SafeAreaView>
       <View style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', paddingTop: 10, borderBottomLeftRadius: 30, paddingHorizontal: 20}}>

        <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name='arrow-back' size={25} color='#fff' />
            </TouchableOpacity>
            <Text style={{fontSize: 16, fontWeight: 'bold', color:'#fff'}}>{text.doc_name}</Text>
        </View>

      </View>

      <View style={{justifyContent:'center', alignItems:'center', marginTop:15}}>
            <Pdf
                source={{uri:`${API_URL}assets/documents/${text.file_name}`, cache: true}}
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
                style={styles.pdf}
            />
      </View>
      <View style={{marginBottom:15}}></View>

    </SafeAreaView>
  )
}

export default ReadPdf

const styles = StyleSheet.create({
  container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 25,
        paddingVertical: 20
  },
  pdf: {
        width: Dimensions.get('window').width - 40,
        height: Dimensions.get('window').height - 10
  }
});