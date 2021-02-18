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
  const [contactos, setContactos] = useState([]);
  const [online, setOnline] = useState([]);

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
      .update({state: 0});
      if (appState != nextAppState) {
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
          console.log('App State: ' + 'App has come to the foreground!');
          alert('App State: ' + 'App has come to the foreground!');
        }
      alert('App State: ' + nextAppState);
      setAppState(nextAppState);
      database()
        .ref('usuarios/' + user.uid)
        .update({state: 1});
      }
  };

  useEffect(() => {
   //Rama Contactos de usuarios con ultimos mensajes
   //listarContactos();
    listarOnline();
    /*
    const chatContactos = database()
      .ref(`usuarios/${user.uid}/contactos/`)
      .orderByChild('lm')
      .on('child_changed', (snap) => {

        /* Esto es lo que estaban haciendo
        {
          obj1 : {algo, algo},
          obj2 : {algo, algo},
          obj3 : {algo, algo}
        }

        {
          obj1 : {algo, algo},
          obj2 : {algoMásGrande, algo2, otraCosa},
          obj3 : {algo, algo}
        }

        Obj2

        Así inicia Valores = [];
        state = Valores = [obj2, obj2, obj2];
        */


        // [0,1,2,3] Así se ve un array
        // {uno, dos, tres} así se ve un objeto


        /* Más o menos es lo que tiene que hacer.

          Primero obtengo los último 10 mensajes o las últimas 10 interacciones (Usuarios)
          .orderByChild().toLimitLast().on('child_added')
          Valores = (resultadoDelQuery);

          Valores = {
            KeyDelSnap: {loQueTengaSuIbjeto(), Snap}
          }

          Segundo paso:

          .on('child_changed')

          Obtener el KeyDelSnap para "comparar"
          En valores existe ya este KeySnap???

          -> valore[keySnap] = snap.val(); <-

          valores[uid1] = si existe entonces remplaza;
          valores[uid2] = no existse entonces crea;

          //escuchando desde que inicia lo que se se agregue y lo que cambie;
          useEfect(() => {
            1 Aquí va cuando agregue
              setValores((prevState) => {
              prevState[keySnap] = snap.val();

              return prevState;
            });



            2 Aquí va cuando cambie
            setValores((prevState) => {
              prevState[keySnap] = snap.val();

              return prevState;
            });
          }, []);   


        */


        /*
          setValores             ((prevState)           =>                  [...prevState, snap.val()]);
          Función que actualiza    Estado anterior     Arrow function       Esto es lo que se retorna
                                                                            []
                                                                            heredar lo que tiene el state al array
                                                                            pasando el nuevo valor
                                                                            array.push(NuevoValor)

          setValores((prevState) => {...prevState, snap.val()});
          setValores((prevState) => {}); aquí hay una función, tengo que retornar algo.

          setValores((prevState) => {
            //{key: valor}//
            return { ...prevState, [key]: snap.val() }
            return { ...prevState, KeyEstático: snap.val() }
          });
        */


        //console.log('Contactos ARRAY: ', snap.val())
        //console.log("CAMBIO changed, "+snap.val().email)
        //setValores((prevState) => [...prevState, snap.val()]);
    


    //Rama usuarios conectados
    /*
    const usuariosOnline = database()
    .ref('usuarios')
    .on('child_added', snap => {
      if (user.uid !== snap.key) {
        console.log('user', snap.val())
        setValores((prevState) => [...prevState, snap.val()]);
      }
    });
    */

   
    //return () => database().ref(`usuarios`).off('child_added', usuariosOnline);
    //return () => database().ref(`usuarios/${user.uid}/contactos/`).off('child_added', chatAdded);
    //return () => database().ref(`usuarios/${user.uid}/contactos/`).off('child_changed', chatContactos);
    
  }, []);

  async function listarContactos(){
    try {
      ref(`usuarios/${user.uid}/contactos`).orderByValue('lm').LimitToLast(10)


      const chatAdded = await database()
        .ref(`usuarios/${user.uid}/contactos/`).orderByChild('lm')
        .on('child_added', snap => {
          //console.log('Contactos ARRAY: ', snap.val())
          console.log("CAMBIO added, ",snap.val().email)
          //setValores((prevState) => [...prevState, snap.val()]);
          setContactos((prevState) => [...prevState, snap.val()]);
      });
    } catch (error) {
      console.log(error)
    }
    
    //return () => database().ref(`usuarios/${user.uid}/contactos/`).off('child_added', chatAdded);
  }

  async function listarOnline(){
    try {
      const chatAdded = await database()
        .ref(`usuarios`)
        .on('child_added', snap => {  
          if(snap.val().state == 1){
            //console.log('Contactos ARRAY: ', snap.val())
            console.log("User Online:, ",snap.val().email)
            setOnline((prevState) => [...prevState, snap.val()]);
          }else{
            online.forEach(function (item, index) {
              if (snap.val().uid === item.uid) {
                  online.splice(index, 1);
              }
            });
          }
          //background 
      });
    } catch (error) {
      console.log(error)
    }
    
  }

  return (
    <View>
      <FlatList
        data={online}
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
