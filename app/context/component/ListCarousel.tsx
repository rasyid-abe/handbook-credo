import React, { useEffect, useState } from "react";
import { API_URL, USER_DATA, TOKEN_KEY, useAuth } from "../AuthContext";
import * as SecureStore from "expo-secure-store";
import Ionicons from "@expo/vector-icons/Ionicons";

//import all the components we are going to use
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity
} from "react-native";

//import ImageViewer which will help us to zoom Image
import ImageViewer from 'react-native-image-zoom-viewer';

const ListCarousel = ({ navigation, route }: any) => {
  const images = [
    {
      url:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/sample_img.png',
    },
    {
      url:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/old_logo.png',
    },
  ];
  
  const imgSlide = route.params?.images
  let listimg = []
    for (let i = 0; i < imgSlide.length; i++) {
      const lsimg = {'url': `${API_URL}assets/slides/${imgSlide[i].image}`}
      listimg.push(lsimg)
  }
  const [result, setResult] = useState(listimg);
  return (
    <SafeAreaView style={{flex:1, backgroundColor:'black'}}>
        <View style={{width: '100%', height: 60, backgroundColor: '#2a4fa3', paddingTop: 10, borderBottomLeftRadius: 30, paddingHorizontal: 20}}>

            <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name='arrow-back' size={25} color='#fff' />
                </TouchableOpacity>
                <Text style={{fontSize: 16, fontWeight: 'bold', color:'#fff'}}>Image Slide</Text>
            </View>

        </View>

        {/* <View style={{height:10, width:'100%', backgroundColor:'#F5FCFF'}} />  */}
        <View style={styles.container}>
          <ImageViewer
            imageUrls={result}
            renderIndicator={() => null}
          />
        </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
});

export default ListCarousel;