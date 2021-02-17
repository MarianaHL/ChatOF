import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  AppState,
} from 'react-native';
import {Avatar, Divider} from 'react-native-paper';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

export default function HomeScreen({navigation}) {
  const keyExtractor = (item, index) => index.toString();
  const user = auth().currentUser;
  const [valores, setValores] = useState([]);

  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    console.log('App State: ' + nextAppState);
    database()
      .ref('usuarios/' + user.uid)
      .update({state: 1});
    if (appState != nextAppState) {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App State: ' + 'App has come to the foreground!');
        alert('App State: ' + 'App has come to the foreground!');
      }
      alert('App State: ' + nextAppState);
      setAppState(nextAppState);
      database()
        .ref('usuarios/' + user.uid)
        .update({state: 0});
    }
  };

  useEffect(() => {
    /*
    if user -> mensaje
      1.- Listar usuarios online => 0
      2.- Listar usuarios offline => .......

    if user leyo el mensaje

    */

    //Rama Contactos de usuarios con ultimos mensajes
    database()
      .ref(`usuarios/${user.uid}/contactos/`)
      .orderByChild('lm')
      .on('child_added', (snap) => {
        //console.log('Contactos ARRAY: ', snap.val())
        console.log('AGREGAR, ' + snap.val().email);
        setValores((prevState) => [...prevState, snap.val()]);
      });

    const chatContactos = database()
      .ref(`usuarios/${user.uid}/contactos/`)
      .orderByChild('lm')
      .on('child_changed', (snap) => {
        //console.log('Contactos ARRAY: ', snap.val())
        console.log('CAMBIO, ' + snap.val().email);
        setValores((prevState) => [...prevState, snap.val()]);
      });

    return () =>
      database()
        .ref(`usuarios/${user.uid}/contactos/`)
        .off('child_changed', chatContactos);

    //Rama usuarios conectados

    // database()
    //   .ref('usuarios')
    //   .on('child_added', (snap) => {
    //     if (user.uid !== snap.key) {
    //       console.log('user', snap.val());
    //       setValores((prevState) => [...prevState, snap.val()]);
    //     }
    //   });
  }, []);

  return (
    <View>
      <FlatList
        data={valores}
        keyExtractor={keyExtractor}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Chat', {keyExtractor: item})}>
            <View style={styles.avatar}>
              {/* <Avatar.Image size={40} source={{uri: item.foto}} /> */}
              <Avatar.Icon size={40} icon="account" />
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.nombre}>{item.email}</Text>
                <Text style={styles.puesto}>{item.uid}</Text>
              </View>
            </View>
            <Divider />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    flexDirection: 'row',
    padding: 10,
  },
  nombre: {
    flexDirection: 'column',
    flex: 8,
    paddingLeft: 10,
    paddingTop: 5,
  },
  puesto: {
    paddingLeft: 10,
    color: 'grey',
  },
});
