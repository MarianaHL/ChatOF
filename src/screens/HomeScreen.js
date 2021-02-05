import React, {useContext, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList, Text} from 'react-native';
import {Avatar} from 'react-native-paper';
import {AuthContext} from '../navigation/AuthProvider';
import database from '@react-native-firebase/database';
import {Separator} from '../components/Separator';

export default function HomeScreen({navigation}) {
  const {user, logout} = useContext(AuthContext);
  const keyExtractor = (item, index) => index.toString();
  const currentUser = user.toJSON();

  useEffect(() => {
    console.log({currentUser});
    const usuario = {
      uid: user.uid,
      nombre: user.displayName,
      email: user.email,
      foto: user.photoURL,
      nuevosmensajes: 0,
    };
    database()
      .ref('usuarios/' + user.uid)
      .set(usuario)
      .then((res) => {
        console.log('usuario guardado');
      })
      .catch((e) => console.log(e));
  }, []);

  const valores = [{}];
  database()
    .ref('usuarios')
    .once('value', (query) => {
      query.forEach((element) => {
        const val = element.val();
        if (!(currentUser.uid === val.uid)) {
          valores.push(element.val());
          console.log(valores);
        }
      });
    });
  return (
    <View>
      <FlatList
        data={valores}
        keyExtractor={keyExtractor}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Chat', {thread: item})}>
            <View style={styles.avatar}>
              <Avatar.Image size={40} source={{uri: item.foto}} />
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.nombre}>{item.email}</Text>
                <Text style={styles.puesto}>{item.uid}</Text>
              </View>
            </View>
            <Separator />
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
