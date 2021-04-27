import *as firebase from 'firebase';

require('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyApnFb5dlAbZqb2ksrzxCq9GjDwjELypyU",
    authDomain: "wily-b14cc.firebaseapp.com",
    projectId: "wily-b14cc",
    storageBucket: "wily-b14cc.appspot.com",
    messagingSenderId: "94150259295",
    appId: "1:94150259295:web:975e462817902d20cae1ea"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase.firestore();