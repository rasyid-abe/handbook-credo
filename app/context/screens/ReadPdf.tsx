import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
// import Pdf from 'react-native-pdf';
import { API_URL, TOKEN_KEY} from '../AuthContext'

const ReadPdf = () => {
  return (
    <View>
        <Text>ReadPdf</Text>
        {/* <Pdf
            trustAllCerts={false}
            source={{uri: `${API_URL}assets/documents/Pdf_1_Alpha.pdf`, cache: true}}
            onLoadComplete={(numberOfPages,filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page,numberOfPages) => {
                console.log(`Current page: ${page}`);
            }}
            onError={(error) => {
                console.log(error);
            }}
            onPressLink={(uri) => {
                console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdf}
        /> */}
    </View>
  )
}

export default ReadPdf

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