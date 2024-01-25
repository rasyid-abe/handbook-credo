/* eslint-disable no-undef */
import React, {useState, useEffect, useRef} from 'react';
import {View, Text, SafeAreaView, StatusBar, Dimensions, StyleSheet, ScrollView} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
const {width} = Dimensions.get('window');
import SelectDropdown from 'react-native-select-dropdown';

const FidForm = ({navigation, route}:any) => {

  let date = new Date()
  const years = [];
  for (let i = date.getFullYear(); i < date.getFullYear() + 10; i++) {
    years.push(i)
  }

  const months = ['01','02','03','04','05','06','07','08','09','10','11','12']

  let end = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); // end date of month
  var days = [];

  for(let i = 1; i <= end; i++){
    days.push((i < 10 ? '0'+ i: i))
  }

  let hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push((i < 10 ? '0'+ i: i)) 
  }

  let minutes = [];
  for (let i = 0; i < 60; i++) {
    minutes.push((i < 10 ? '0'+ i: i)) 
  }

  const renderHeader = () => {
    return (
      <View style={[styles.header, styles.shadow]}>
        <Text style={styles.headerTitle}>{'Demo 2'}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.saveAreaViewContainer}>
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
      <View style={styles.viewContainer}>
        {renderHeader()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
          contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.dropdownsRow}>

            <SelectDropdown
              data={years}
              onSelect={(selectedItem, index) => {
               console.log(selectedItem, index);
               
              }}
              defaultButtonText={'Year'}
              buttonStyle={styles.dropdown1BtnStyle}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              renderDropdownIcon={isOpened => {
                return <Ionicons name={isOpened ? 'chevron-up' : 'chevron-down'} size={18} color="gray" />;
              }}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
            />

            <View style={styles.divider} />

            <SelectDropdown
              data={months}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
              }}
              defaultButtonText={'Month'}
              buttonStyle={styles.dropdown2BtnStyle}
              buttonTextStyle={styles.dropdown2BtnTxtStyle}
              renderDropdownIcon={isOpened => {
                return <Ionicons name={isOpened ? 'chevron-up' : 'chevron-down'} size={18} color="gray" />;
              }}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown2DropdownStyle}
              rowStyle={styles.dropdown2RowStyle}
              rowTextStyle={styles.dropdown2RowTxtStyle}
            />
            
            <View style={styles.divider} />

            <SelectDropdown
              data={days}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
              }}
              defaultButtonText={'Day'}
              buttonStyle={styles.dropdown2BtnStyle}
              buttonTextStyle={styles.dropdown2BtnTxtStyle}
              renderDropdownIcon={isOpened => {
                return <Ionicons name={isOpened ? 'chevron-up' : 'chevron-down'} size={18} color="gray" />;
              }}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown2DropdownStyle}
              rowStyle={styles.dropdown2RowStyle}
              rowTextStyle={styles.dropdown2RowTxtStyle}
            />

          </View>
          <View style={styles.dropdownsRow}>

            <SelectDropdown
              data={hours}
              onSelect={(selectedItem, index) => {
               console.log(selectedItem, index);
               
              }}
              defaultButtonText={'Year'}
              buttonStyle={styles.dropdown1BtnStyle}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              renderDropdownIcon={isOpened => {
                return <Ionicons name={isOpened ? 'chevron-up' : 'chevron-down'} size={18} color="gray" />;
              }}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
            />

            <View style={styles.divider} />

            <SelectDropdown
              data={minutes}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
              }}
              defaultButtonText={'Month'}
              buttonStyle={styles.dropdown2BtnStyle}
              buttonTextStyle={styles.dropdown2BtnTxtStyle}
              renderDropdownIcon={isOpened => {
                return <Ionicons name={isOpened ? 'chevron-up' : 'chevron-down'} size={18} color="gray" />;
              }}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown2DropdownStyle}
              rowStyle={styles.dropdown2RowStyle}
              rowTextStyle={styles.dropdown2RowTxtStyle}
            />
            
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default FidForm
const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
  },
  headerTitle: {color: '#000', fontWeight: 'bold', fontSize: 16},
  saveAreaViewContainer: {flex: 1, backgroundColor: '#FFF'},
  viewContainer: {flex: 1, width, backgroundColor: '#FFF'},
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '10%',
  },
  dropdownsRow: {flexDirection: 'row'},

  dropdown1BtnStyle: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    color: 'blue',
    borderColor: '#444',
  },
  dropdown1BtnTxtStyle: {textAlign: 'left', fontSize: 16},
  dropdown1DropdownStyle: {backgroundColor: '#fff'},
  dropdown1RowStyle: {backgroundColor: '#fff', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {textAlign: 'left', fontSize: 16},
  divider: {width: 10},
  dropdown2BtnStyle: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown2BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown2DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown2RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown2RowTxtStyle: {color: '#444', textAlign: 'left'},
});