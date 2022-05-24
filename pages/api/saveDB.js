// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

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
  

  const db = getDatabase(app);
  set(ref(db, 'coordinates'), {
    from: req.body.coordinates3,
    to: req.body.coordinates2
  });

  res.json({ message: 'success' })
}
