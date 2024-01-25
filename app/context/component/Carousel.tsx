import {
	FlatList,
	Image,
	StyleSheet,
	Text,
	View,
	Dimensions,
	LogBox,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { API_URL, NIK_USER, TOKEN_KEY, useAuth } from '../AuthContext'

const Carousel = ({images}:any) => {
	const flatlistRef = useRef();
	// Get Dimesnions
	const screenWidth = Dimensions.get("window").width;
	const [activeIndex, setActiveIndex] = useState(0);

	// Auto Scroll

	useEffect(() => {
        
		let interval = setInterval(() => {
            
			if (Math.ceil(activeIndex) === images.length - 1) {
				flatlistRef.current.scrollToIndex({
					index: 0,
					animation: true,
				});
			} else {
				flatlistRef.current.scrollToIndex({
					index: Math.ceil(activeIndex) + 1,
					animation: true,
				});
			}
		}, 3000);

		return () => clearInterval(interval);
	});

	const getItemLayout = (data, index) => ({
		length: screenWidth,
		offset: screenWidth * index, // for first image - 300 * 0 = 0pixels, 300 * 1 = 300, 300*2 = 600
		index: index,
	});
	// Data for carousel
	// const images = [
	// 	{
	// 		id: "01",
	// 		image: require("../../../assets/homescreen/game-1.jpeg"),
	// 	},
	// 	{
	// 		id: "02",
	// 		image: require("../../../assets/homescreen/game-2.jpeg"),
	// 	},
	// 	{
	// 		id: "03",
	// 		image: require("../../../assets/homescreen/game-3.png"),
	// 	},
	// ];

	//  Display Images // UI
	const renderItem = ({ item, index }) => {
		return (
			<View style={styles.container}>
                <View style={styles.content}>
                    <Image source={{uri:`${API_URL}assets/slides/${item.image}`}} resizeMode='contain' style={styles.image} />
                </View>
            </View>
		);
	};

	// Handle Scroll
	const handleScroll = (event) => {
		// Get the scroll position
		const scrollPosition = event.nativeEvent.contentOffset.x;
		// console.log({ scrollPosition });
		// Get the index of current active item

		const index = scrollPosition / screenWidth;

		// console.log({ index });
		// Update the index

		setActiveIndex(index);
	};

	// Render Dot Indicators
	const renderDotIndicators = () => {
        return (
            <View style={{flexDirection:'row'}}>
                {images.map((item, i) => (
                    <View key={i}
                    style={{
                        marginTop: -55,
                        backgroundColor: Math.ceil(activeIndex) === i ? "darkblue" : "gray",
                        height: 10,
                        width: 10,
                        borderRadius: 5,
                        marginHorizontal: 5,
                    }}
                ></View>
                ))}
            </View>
        )
	};

	return (
		<View>
			<FlatList
				data={images}
				ref={flatlistRef}
				getItemLayout={getItemLayout}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				horizontal={true}
				pagingEnabled={true}
				onScroll={handleScroll}
				showsHorizontalScrollIndicator={false}
			/>

			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					marginTop: 30,
				}}
			>
				{renderDotIndicators()}
			</View>
		</View>
	);
};

export default Carousel;

const styles = StyleSheet.create({
    container:{
        width: Dimensions.get("window").width,
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
        left: -20,
        width: '95%',
        height: 200,
        borderRadius: 10,
    }
});