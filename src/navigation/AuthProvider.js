import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export const AuthContext = createContext({});



export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
        },
        register: async (email, password) => {
          try {
            let {user} = await auth().createUserWithEmailAndPassword(email, password);
            //setUser(user)
            console.log(user)
            const usuario = {
              uid: user.uid,
              nombre: user.displayName,
              email: user.email,
              foto: user.photoURL,
              nuevosmensajes: 0,
            };
            await database().ref('usuarios/' + user.uid).set(usuario);
            console.log("Usuario guardado")
            
          } catch (e) {
            console.log(e);
          }
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
