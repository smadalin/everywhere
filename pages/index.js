import React, { useState } from "react";
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import ReactMapGL, {FullscreenControl, NavigationControl} from "react-map-gl";
import DeckGL, { ArcLayer} from "deck.gl";
import {LineLayer} from '@deck.gl/layers';
import "mapbox-gl/dist/mapbox-gl.css";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, onSnapshot, query } from "firebase/firestore";


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
const db = getFirestore(app);
const q = query(collection(db, "coordinates"));
const unsubscribe = onSnapshot(q, (snapshot) => {
    console.log(snapshot.docChanges().length)
    snapshot.docChanges().forEach((change) => {

        if (change.type === "added") {

        }
    });
});

const INITIAL_VIEW_STATE = {
    latitude: 51.47,
    longitude: 0.45,
    zoom: 2,
    bearing: 0,
    pitch: 0,
};

const data = [
    {
        "flyFrom": "SIN",
        "flyTo": "KUL",
        "source": [103.989444, 1.359167],
        "target": [101.714722, 2.745556]
    },
    {
        "flyFrom": "KUL",
        "flyTo": "LGK",
        "source": [101.714722, 2.745556],
        "target": [99.732222, 6.338611]
    },
    {
        "flyFrom": "KUL",
        "flyTo": "KUA",
        "source": [101.714722, 2.745556],
        "target": [103.209444, 3.780833]
    },
    {
        "flyFrom": "KUL",
        "flyTo": "TGG",
        "source": [101.714722, 2.745556],
        "target": [103.104722, 5.381389]
    },
    {
        "flyFrom": "KUL",
        "flyTo": "AOR",
        "source": [101.714722, 2.745556],
        "target": [100.400833, 6.194444]
    },
    {
        "flyFrom": "KUL",
        "flyTo": "KBR",
        "source": [101.714722, 2.745556],
        "target": [102.291111, 6.1675]
    }
];

const layer = new ArcLayer({
    id: "flight-arcs",
    data: data,
    getSourcePosition: d => d.source,
    getTargetPosition: d => d.target,
    getSourceColor: () => [255, 0, 0, 120],
    getTargetColor: () => [0, 255, 0, 120],
    getStrokeWidth: () => 2
  });


export default function Home() {

    const [viewport, setViewport] = useState({
        height: "100%",
        width: "100%"
    });
    const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoic21hZGFsaW4iLCJhIjoiY2wzY3BjemRhMDBzbTNjbW9sdWc3cDg3YyJ9.wmPQQp-K_CjUVrtwdJPglQ';
        const data = [
            {sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}
        ];
        const layers = [
            new LineLayer({id: 'line-layer', data})
        ];


    return (
            <div className={styles.container}>
            <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                layers={layers}
                style={{width: '100vw', height: '100vh'}}
            >
                <ReactMapGL mapStyle="mapbox://styles/mapbox/light-v9" style={{width: '100vw', height: '100vh'}} mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
            </DeckGL>
        </div>
    )
}
