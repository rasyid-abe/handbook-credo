import { FlatList, SafeAreaView, StyleSheet, Animated, View } from 'react-native'
import React, { useRef } from 'react'
import SlildeItem from './SlildeItem';
import SlidePagination from './SlidePagination';
import { API_URL, NIK_USER, TOKEN_KEY, useAuth } from '../AuthContext'

const NoSlide = [
  {
    image: 'no_slide.png'
  }
];

const Slider = ({images, rows}:any) => {
  const scrollX = useRef(new Animated.Value(1)).current
  const handleOnScroll = event => {
    Animated.event([
      {
        nativeEvent: {
          contentOffset: {
            x: scrollX,
          },
        },
      },
    ],
    {
      useNativeDriver: false,
    })(event)
  }
  return (
    <SafeAreaView>
      <FlatList 
        // data={NoSlide} 
        data={rows > 0 ? images : NoSlide} 
        renderItem={({item}) => <SlildeItem item={item} />} 
        horizontal
        pagingEnabled
        snapToAlignment='center'
        showsHorizontalScrollIndicator={false}
        onScroll={handleOnScroll}
      />
      {/* <SlidePagination data={NoSlide} scrollX={scrollX} /> */}
      <SlidePagination data={rows > 0 ? images : NoSlide} scrollX={scrollX} />
    </SafeAreaView>
  )
}

export default Slider

const styles = StyleSheet.create({})