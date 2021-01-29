import React, {useState, useContext, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import database from '@react-native-firebase/database';
import {AuthContext} from '../navigation/AuthProvider';
import { TextComponent } from 'react-native';

//componente que estan exportando.
export default function ChatScreen() {
  //hook useContext
  const {user} = useContext(AuthContext);
  const currentUser = user.toJSON();

  //es un hook useState();
  //[ miVariable, función para actualizar mi variable ] useState(elValorInicialDeMiVariable);
  const [messages, setMessages] = useState([]);

  // []); => se ejecute una sola vez cuando se abre el componente.
  // [user]); => se ejecuta cada vez que el usuario cambia.
  // [user, messages]); => se ejecuta cada vez que el usuario cambia y cada vez que los mensajes cambian.

  //Hook
  useEffect(() => {
    //uno auno de los mensajes
    database()
      .ref('chat/')
      .orderBy('fecha')
      .on('child_added', (snapshot) => {
        console.log('User data: ', snapshot.val());

        //setMessages(snapshot.val());

        //no se deben perder los mensajes
        //Inicio = []
        //1er = [msj1];
        //2do = [msj1, msj2];
        //setMessages([...messages, snapshot.val()]);

        //CallBack
        //prevenir que una actualización se cumplió.

        /*snapshot.val() = {
          fecha: timestamp
          texto: "texto",
          uid: 2345
        }
        */

        /*1er. [] => [{
          fecha: timestamp
          texto: "texto",
          uid: 2345
        }]
        */

        /*2do. 
          [{
            fecha: timestamp
            texto: "texto",
            uid: 2345
          }] => 
          [..., {
          fecha: timestamp2
          texto: "texto2",
          uid: 2345-2
        }]
        */
        setMessages((prevState) => [...prevState, snapshot.val()]);
        //estoy actualizando 1, espera
          //ahora actualiza 2
        //estoy actualizando 2, espera
          //ahora actualiza 3
        //ya actualice 3
          //ahora actualiza 4
        //ya actualice 1
      });
  }, []);

  function handleSend(messages = []) {
    database()
      .ref('chat/')
      .push({
        text,
        uid: user.uid,
        fecha: Date.now(),
      })
      .then((res) => {
        console.log('mensaje guardado');
      })
      .catch((e) => console.log(e));
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessage) => handleSend(newMessage)}
      user={{
        _id: 1,
      }}
    />
  );
}
