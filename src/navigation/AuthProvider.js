import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {Alert} from 'react-native';
import {HelperText} from 'react-native-paper';

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
        },
        register: async (displayName, email, password) => {
          setLoading(true);
          try {
            let {user} = auth()
              .createUserWithEmailAndPassword(email, password)
              .then((credential) => {
                credential.user.updateProfile({displayName: displayName});
              });
            //setUser(user)
            console.log(user);
            const usuario = {
              uid: user.uid,
              nombre: user.displayName,
              email: user.email,
              foto: user.photoURL,
              nuevosmensajes: 0,
            };
            await database()
              .ref('usuarios/' + user.uid)
              .set(usuario);
            console.log('Usuario guardado');
          } catch (e) {
            console.log(e);
          }
          setLoading(false);
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.error(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
