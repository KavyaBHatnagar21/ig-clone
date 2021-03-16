import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/firestore'
import 'firebase/auth'
 

const firebaseConfig = {
    apiKey: "AIzaSyBuGyNX7BHkdwVsyrbZvH9-AEuwtsbUZB4",
    authDomain: "instagram-clone-f567f.firebaseapp.com",
    projectId: "instagram-clone-f567f",
    storageBucket: "instagram-clone-f567f.appspot.com",
    messagingSenderId: "486014713401",
    appId: "1:486014713401:web:0d6e5d444a6cb4574a57e8"
  };

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore(); 
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export {db, storage, auth, provider};
