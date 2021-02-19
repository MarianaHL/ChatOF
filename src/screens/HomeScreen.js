import React, {useContext, useEffect, useState} from 'react';
import {Icon} from 'react-native-elements';
import {Avatar, Divider} from 'react-native-paper';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {useIsFocused} from '@react-navigation/native';
import Loading from '../components/Loading';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  AppState,
} from 'react-native';

export default function HomeScreen({navigation}) {
  const keyExtractor = (item, index) => index.toString();
  const user = auth().currentUser;
  const [loading, setLoading] = useState(true);
  const [valores, setValores] = useState({});
  const [contactos, setContactos] = useState([]);
  const [online, setOnline] = useState({});

  const isFocused = useIsFocused();

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
    let isCancelled = false;
    //Rama Contactos de usuarios con ultimos mensajes
    database()
      .ref(`usuarios/${user.uid}/contactos/`)
      .orderByChild('lm')
      .limitToLast(10)
      .on('child_added', (snap) => {
        console.log('AGREGAR, ', snap);
        if (!isCancelled) {
          setValores((prevState) => {
            return {...prevState, [snap.key]: snap.val()};
          });

          if (loading) {
            setLoading(false);
          }
        }
      });

    const chatContactos = database()
      .ref(`usuarios/${user.uid}/contactos/`)
      .orderByChild('lm')
      .on('child_changed', (snap) => {
        console.log('CAMBIO, ', snap);
        if (!isCancelled) {
          setValores((prevState) => {
            return {...prevState, [snap.key]: snap.val()};
          });

          if (loading) {
            setLoading(false);
          }
        }
      });

    listarOnline();

    return () => {
      isCancelled = true;
    };
  }, [isFocused, loading]);

  async function listarContactos() {
    try {
      const chatAdded = await database()
        .ref(`usuarios/${user.uid}/contactos/`)
        .orderByChild('lm')
        .limitToLast(10)
        .on('child_added', (snap) => {
          //console.log('Contactos ARRAY: ', snap.val())
          console.log('CAMBIO added, ', snap.val().email);
          //setValores((prevState) => [...prevState, snap.val()]);
          setContactos((prevState) => [...prevState, snap.val()]);
        });
    } catch (error) {
      console.log(error);
    }

    //return () => database().ref(`usuarios/${user.uid}/contactos/`).off('child_added', chatAdded);
  }

  async function listarOnline() {
    try {
      const chatAdded = await database()
        .ref(`usuarios`)
        .orderByChild('lm')
        .limitToLast(10)
        .on('child_added', (snap) => {
          if (snap.val().state == 1) {
            console.log('User Online:, ', snap.val().email);
            if (user.uid !== snap.key) {
              setOnline((prevState) => {
                return {...prevState, [snap.key]: snap.val()};
              });
            }
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <View>
      <FlatList
        data={Object.keys(valores)}
        keyExtractor={keyExtractor}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Chat', {keyExtractor: valores[item]})
            }>
            <View style={styles.avatar}>
              {/* <Avatar.Image size={40} source={{uri: item.foto}} /> */}
              <Avatar.Icon size={40} icon="account" />
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.nombre}>{valores[item].email}</Text>
                <Text style={styles.puesto}>{valores[item].uid}</Text>
              </View>
            </View>
            <Divider />
          </TouchableOpacity>
        )}
      />
      <View style={styles.contenedorTexto}>
        <Text style={styles.texto}>En línea</Text>
        <Icon name="circle" color="#00e676" />
      </View>
      <FlatList
        data={Object.keys(online)}
        keyExtractor={keyExtractor}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Chat', {keyExtractor: online[item]})
            }>
            <View style={styles.avatar}>
              {/* <Avatar.Image size={40} source={{uri: item.foto}} /> */}
              <Avatar.Icon size={40} icon="account" />
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.nombre}>{online[item].email}</Text>
                <Text style={styles.puesto}>{online[item].uid}</Text>
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
  texto: {
    fontSize: 20,
  },
  contenedorTexto: {
    margin: 10,
    marginTop: 30,
    flexDirection: 'row',
  },
});
