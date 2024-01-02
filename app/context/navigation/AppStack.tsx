import React from 'react'
import {createDrawerNavigator} from '@react-navigation/drawer';

import Profile from '../screens/Profile';
import Password from '../screens/Password';
import FraudAdd from '../screens/FraudAdd';

import CustomDrawer from '../component/CustomDrawer';

import Ionicons from '@expo/vector-icons/Ionicons'
import TabNavigator from './TabNavigator';
import GroupDocument from '../component/GroupDocument';
import TermCondition from '../screens/TermCondition';
const Drawer = createDrawerNavigator();

const AppStack = () => {
  return (
    <Drawer.Navigator 
      drawerContent={props => <CustomDrawer {...props} />} 
      screenOptions={{
        headerShown: false, 
        drawerActiveBackgroundColor: '#2a4fa3',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {marginLeft: -25}
      }}
    >
      <Drawer.Screen name='Home' component={TabNavigator} options={{
        drawerIcon: ({color}) => (
          <Ionicons name="home-outline" size={20} color={color} />
        )
      }}/>
      <Drawer.Screen name='Term & Conditions' component={TermCondition} options={{
        drawerIcon: ({color}) => (
          <Ionicons name="alert-circle-outline" size={20} color={color} />
        )
      }}/>
      <Drawer.Screen name='Profile' component={Profile} options={{
        drawerIcon: ({color}) => (
          <Ionicons name="person-outline" size={20} color={color} />
        )
      }}/>
      <Drawer.Screen name='Change Password' component={Password} options={{
        drawerIcon: ({color}) => (
          <Ionicons name="key-outline" size={20} color={color} />
        )
      }}/>

    </Drawer.Navigator>
  )
}

export default AppStack