//INTEGRAÇÇÃO COM O FIREBASE

import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/database'

//variaveis ambiente, apenas neste computador. os valores dessas variaveis serão diferentes em outro computador
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
  };

firebase.initializeApp(firebaseConfig) //inicializa o app

 const auth = firebase.auth()
 const database = firebase.database()

 export {firebase, auth, database}