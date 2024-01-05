import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions} from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { API_URL, USER_DATA, TOKEN_KEY} from '../AuthContext'
import * as SecureStore from 'expo-secure-store';
import { FlatList } from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('screen')

const ShowImage = ({item}:any) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image source={{uri:`${API_URL}assets/fraudimg/${item}`}} resizeMode='contain' style={styles.image} />
            </View>
        </View>
    )
}

const DetailFraud = ({navigation, route}:any) => {
    const [detail, setDetail] = useState([])
    const [img, setImg] = useState([])

    const loadData =async () => {
        const token = await SecureStore.getItemAsync(TOKEN_KEY)
        const uinfo = await SecureStore.getItemAsync(USER_DATA)
        
        const nikp = JSON.parse(uinfo)
        let params = {'id': route.params?.id, 'nik':nikp.nik}
        
        return fetch(`${API_URL}api/fraud_detail?${new URLSearchParams(params)}`, {
          headers: {
            Authorization: `${token}`
          }
        }).then(res => res.json()).then(res => {
            console.log(res.data);
            console.log('success');
            
            setDetail(res.data)
            setImg(JSON.parse(res.data.images))
        }).catch(err => {
            console.log('failed');
          return err
        })
    }

    useEffect(() => {
        loadData()
    }, [])
  return (
    <View style={{flex: 1}}>
    <View style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', paddingTop: 10, borderBottomLeftRadius: 30, paddingHorizontal: 20}}>

        <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name='arrow-back' size={25} color='#fff' />
            </TouchableOpacity>
            <Text style={{fontSize: 16, fontWeight: 'bold', color:'#fff'}}>No. {route.params?.contract}</Text>
        </View>

    </View>

    <View style={{paddingHorizontal: 20}}>
        <ScrollView style={{marginTop:10}}>
            <View style={styles.listitem}>
                <Text style={styles.title}>Branch:</Text>
                <Text style={styles.content}>{detail.branch_name}</Text>
            </View>
            <View style={styles.listitem}>
                <Text style={styles.title}>Installment:</Text>
                <Text style={styles.content}>{detail.installments}</Text>
            </View>
            <View style={styles.listitem}>
                <Text style={styles.title}>Customer:</Text>
                <Text style={styles.content}>{detail.customer_name}</Text>
            </View>
            <View style={styles.listitem}>
                <Text style={styles.title}>Marketing:</Text>
                <Text style={styles.content}>{detail.marketing_name}</Text>
            </View>
            <View>
                <Text style={styles.title}>Pictures:</Text>
                {/* {img.map((item, i) => (
                   <ShowImage key={i} img={item} /> 
                ))} */}
                <FlatList 
                    data={img}
                    renderItem={({item}) => <ShowImage item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <View style={styles.listitem}>
                <Text style={styles.title}>Description:</Text>
                <Text style={styles.content}>{detail.description}</Text>
            </View>
        </ScrollView>
    </View>
    </View>
  )
}

export default DetailFraud

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    listitem: {
        marginBottom: 15
    },
    container:{
        width,
        height: 220
    },
    content: {
        flex: 1,
        marginTop: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignItems: 'center'
    },
    image:{
        width: '95%',
        height: 200,
        borderRadius: 10,
    }
})