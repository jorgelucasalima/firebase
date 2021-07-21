import firebase from 'firebase/app'
import 'firebase/firestore'




let firebaseConfig = {
    apiKey: "AIzaSyBN7W7k1AhTT1eWs_AHbNBruem04AlggTs",
    authDomain: "curso-9c82c.firebaseapp.com",
    projectId: "curso-9c82c",
    storageBucket: "curso-9c82c.appspot.com",
    messagingSenderId: "294715491712",
    appId: "1:294715491712:web:a5e0cfae0b7cc6badaed65",
    measurementId: "G-J2N9S8R2KX"
  };
// Initialize Firebase

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase