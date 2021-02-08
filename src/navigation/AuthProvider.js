import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {Alert} from 'react-native';
import {GoogleSignin} from '@react-native-community/google-signin';

GoogleSignin.configure({
  webClientId:
    '1041975985573-1jggsb6hrc5396vqmgub9ifs56q615vh.apps.googleusercontent.com',
  offlineAccess: true,
  client_type: 3,
});

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
        google: async function onGoogleButtonPress() {
          try {
            // Get the users ID token
            const {idToken} = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(
              idToken,
            );

            // Sign-in the user with the credential
            return auth().signInWithCredential(googleCredential);
          } catch (error) {
            console.log(error);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
