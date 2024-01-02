import { StyleSheet, Animated, View, Dimensions } from 'react-native'
import React from 'react'

const {width} = Dimensions.get('screen')

const SlidePagination = ({data, scrollX}) => {
  return (
    <View style={styles.container}>
        {
            data.map((_, idx) => {
                const inputRange = [(idx-1)*width, idx*width, (idx+1)*width]
                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10,25,10],
                    extrapolate: 'clamp'
                })
                return <Animated.View key={idx.toString()} style={[
                    styles.dot, 
                    {width: dotWidth}
                ]} />
            })
        }
    </View>
  )
}

export default SlidePagination

const styles = StyleSheet.create({
    container:{
        position: 'absolute',
        top: 193,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 3,
        backgroundColor: '#ccc'
    },
    dotActive: {
        backgroundColor: '#000'
    }
})