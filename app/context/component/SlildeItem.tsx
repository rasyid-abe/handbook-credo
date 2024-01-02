import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { API_URL, NIK_USER, TOKEN_KEY, useAuth } from '../AuthContext'

const {width, height} = Dimensions.get('screen')

const SlildeItem = ({item}:any) => {
  return (
    <View style={styles.container}>
        <View style={styles.content}>
            <Image source={{uri:`${API_URL}assets/slides/${item.image}`}} resizeMode='contain' style={styles.image} />
        </View>
    </View>
  )
}

export default SlildeItem

const styles = StyleSheet.create({
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