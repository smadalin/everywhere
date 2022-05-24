// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";

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


export default (req, res) => {
  res.statusCode = 200;
  console.log(req)

  const db = getDatabase(app);
  const dbRef = ref(getDatabase());
  get(child(dbRef, `coordinates`)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });

  res.json({ message: 'success' })
}
