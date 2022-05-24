// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { query, limit, collection, orderBy, getFirestore, onSnapshot } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD_xara_Vh0lEOh2sQHFmd1MzJY4qxsrAs",
    authDomain: "everywhere-18dd2.firebaseapp.com",
    projectId: "everywhere-18dd2",
    storageBucket: "everywhere-18dd2.appspot.com",
    messagingSenderId: "848673175928",
    appId: "1:848673175928:web:e9622a35ff5c806a4ef08d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function loadCoordinates() {
    const recentMessagesQuery = query(collection(getFirestore(), 'coordinates'), orderBy('timestamp', 'desc'), limit(2));
//console.log(recentMessagesQuery);
    // Start listening to the query.
    onSnapshot(recentMessagesQuery, function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
           console.log("new coordinates saved");
        });
    });
}

export default (req, res) => {
    res.statusCode = 200;

    loadCoordinates();

   res.json( {
        message: "Hello World"
    });
}
