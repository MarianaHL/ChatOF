import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList, Text} from 'react-native';
import {Avatar, Divider} from 'react-native-paper';
import {AuthContext} from '../navigation/AuthProvider';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

export default function HomeScreen({navigation}) {
  //const {user, logout} = useContext(AuthContext);
  const keyExtractor = (item, index) => index.toString();
  //const currentUser = user.toJSON();
  const user = auth().currentUser;
  const [valores, setValores] = useState([]);

  useEffect(() => {
    //console.log({user: user.email});

    database()
    .ref('usuarios')
    .on('child_added', snap => {
      if (user.uid !== snap.key) {
        console.log('user', snap.val())
        setValores((prevState) => [...prevState, snap.val()]);
      }
    });

    //usuariosConectados();
  }, []);

  /*async function usuariosConectados() {
    try {
      let usersOnline = await database().ref('usuarios').once('value');
      usersOnline.forEach((element) => {
        const val = element.val();
        if (!(currentUser.uid === val.uid)) {
          const valores = (prevState) => [...prevState, element.val()];
          setValores(valores);
        }
      });      
      console.log(valores);
    } catch (error) {
      console.log(error);
    }
  }*/

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
