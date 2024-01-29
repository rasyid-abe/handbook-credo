import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Fraud from '../screens/Fraud';
import Ionicons from '@expo/vector-icons/Ionicons'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListDocuments from '../screens/ListDocuments';
// import GroupDocument from '../component/GroupDocument';
import ReadPdf from '../screens/ReadPdf';
import ReadText from '../screens/ReadText';
import FraudAdd from '../screens/FraudAdd';
import DetailFraud from '../screens/DetailFraud';
import Search from '../screens/Search';
import Fid from '../screens/Fid';
import FidForm from '../screens/FidForm';
import ListCarousel from '../component/ListCarousel';
import Notification from '../component/Notification';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const FakeComponent = () => {return null}

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='Home' component={Home} />
      <Stack.Screen name='ListDocuments' component={ListDocuments} />
      <Stack.Screen name='ReadPdf' component={ReadPdf} />
      <Stack.Screen name='ReadText' component={ReadText} />
      <Stack.Screen name='Search' component={Search} />
      <Stack.Screen name='Fid' component={Fid} />
      <Stack.Screen name='FidForm' component={FidForm} />
      <Stack.Screen name='ListCarousel' component={ListCarousel} />
      <Stack.Screen name='Notification' component={Notification} />
    </Stack.Navigator>
  )
}

const FraudStack = () => {
  return (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name='Fraud' component={Fraud} />
    <Stack.Screen name='FraudAdd' component={FraudAdd} />
    <Stack.Screen name='DetailFraud' component={DetailFraud} />
  </Stack.Navigator> 
  )
}

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {backgroundColor: '#2a4fa3'},
        tabBarInactiveTintColor:'darkgray',
        tabBarActiveTintColor: '#fff'
    }}>
        <Tab.Screen name='Home2' component={HomeStack} options={{
            tabBarIcon: ({color, size}) => (
                <Ionicons name='home-outline' color={color} size={size} />
            )
        }}/>
        <Tab.Screen name='Fraud2' component={FraudStack} options={{
            tabBarIcon: ({color, size}) => (
                <Ionicons name='file-tray-full-outline' color={color} size={size} />
            )
        }}/>
        <Tab.Screen name='My Profile' component={FakeComponent} options={({navigation}) => ({
            tabBarButton:props => <TouchableOpacity {...props} onPress={()=>navigation.openDrawer()}/>,
            tabBarIcon: ({color, size}) => (
                <Ionicons name='options-outline' color={color} size={size} />
            )
        })} />
    </Tab.Navigator>
  )
}

export default TabNavigator