const Firebase = require('firebase');

require('dotenv').config();

var config = {
    apiKey: "AIzaSyAPLWyTLvliroMxXPmY_BVtyiZvLXk4biU",
    authDomain: "toka-bb359.firebaseapp.com",
    databaseURL: "https://toka-bb359.firebaseio.com",
    projectId: "toka-bb359",
    storageBucket: "toka-bb359.appspot.com",
    messagingSenderId: "105832499670"
}

var firebase = !Firebase.apps.length
    ? Firebase.initializeApp(config)
    : Firebase.app()

module.exports = { firebase };
