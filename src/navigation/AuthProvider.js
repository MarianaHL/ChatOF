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
            let {user} = await auth().signInWithEmailAndPassword(email, password);
            await database()
                .ref('usuarios/' + user.uid)
                .update({state: 1});
            console.log('Usuario loggeado');
          } catch (e) {
            console.log(e);
          }
        },
        register: async (displayName, email, password) => {
          setLoading(true);
          try {
            let {user} = await auth().createUserWithEmailAndPassword(email, password)
            //setUser(user)
            console.log(user);
            const usuario = {
              nombre: displayName,
              email: user.email,
              state: 1
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
