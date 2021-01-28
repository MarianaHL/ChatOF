import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import {AuthContext} from './AuthProvider';
import ChatScreen from '../screens/ChatScreen';

const ChatAppStack = createStackNavigator();
const ModalStack = createStackNavigator();

/**
 * All chat app related screens
 */

function ChatApp() {
  const {logout} = useContext(AuthContext);

  return (
    <ChatAppStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6646ee',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontSize: 22,
        },
        headerTitleAlign: {
          alignItems: 'center',
        },
      }}>
      <ChatAppStack.Screen name="Home" component={HomeScreen} />
      <ChatAppStack.Screen
        name="Chat"
        component={ChatScreen}
        /* options={({route}) => ({
          title: route.params.thread.name,
        })} */
      />
    </ChatAppStack.Navigator>
  );
}

export default function HomeStack() {
  return (
    <ModalStack.Navigator mode="modal" headerMode="none">
      <ModalStack.Screen name="ChatApp" component={ChatApp} />
    </ModalStack.Navigator>
  );
}
