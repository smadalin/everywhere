import React, { useState, useRef, useCallback, useEffect } from "react";
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import ReactMapGL from "react-map-gl";
import DeckGL, { GeoJsonLayer, ArcLayer } from "deck.gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, onSnapshot, query } from "firebase/firestore";
import data2 from "./data/data.json";

const COUNTRIES =
    'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson'; //eslint-disable-line

const AIR_PORTS =
    'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';

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
let data = {
    "type": "FeatureCollection",
    "features": []
};
let points = {
    "type": "FeatureCollection",
    "features": []
}

const INITIAL_VIEW_STATE = {
    latitude: 51.47,
    longitude: 0.45,
    zoom: 2,
    bearing: 0,
    pitch: 0,
};

export default function Home() {

    const [viewport, setViewport] = useState({
        height: "100%",
        width: "100%"
    });

    const [dataref, setDataref] = useState({});

    const dataRef = useRef(points);

    const [, updateState] = React.useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect(() => {
        onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change, index) => {
                if (change.type === "added") {
                    points.features.push({
                        "type": "Feature",
                        "properties": {
                            "color": [195, 70, 101],
                            "size": "5"
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [change.doc.data().to[0], change.doc.data().to[1]]
                        }
                    },
                        {
                            "type": "Feature",
                            "properties": {
                                "color": [255, 255, 255],
                                "size": "2"
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": [change.doc.data().from[0], change.doc.data().from[1]]
                            }
                        })
                    data.features.push({

                        "type": "Feature",
                        "properties": {
                            "scalerank": 2
                        },
                        "geometry": {
                            "type": "LineString",
                            "coordinates": []
                        }

                    });

                    data.features[index].geometry.coordinates.push([change.doc.data().from[0], change.doc.data().from[1]]);
                    data.features[index].geometry.coordinates.push([change.doc.data().to[0], change.doc.data().to[1]])

                }
            });
            forceUpdate();

            setDataref(dataRef.current);
            console.log(dataRef.current)
        })
    }, []);

    const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoic21hZGFsaW4iLCJhIjoiY2wzY3BjemRhMDBzbTNjbW9sdWc3cDg3YyJ9.wmPQQp-K_CjUVrtwdJPglQ';
    return (
        <div className={styles.container}>
            {dataRef.current.features[0]?.geometry.coordinates[0] != null &&
                <DeckGL controller={true} initialViewState={INITIAL_VIEW_STATE}>

                    <GeoJsonLayer
                        id="points"
                        data={dataref}
                        filled={true}
                        pointRadiusMinPixels={5}
                        pointRadiusScale={2000}
                        getPointRadius={f => 11 - f.properties.scalerank}
                        getFillColor={f => f.properties.color}
                        pickable={true}
                        autoHighlight={true}
                    />
                    <ArcLayer
                        id="arcs"
                        data={data}
                        dataTransform={d => d.features.filter(f => f.properties.scalerank < 4)}
                        getSourcePosition={f => f.geometry.coordinates[0]}
                        getTargetPosition={f => f.geometry.coordinates[1]}
                        getSourceColor={[255, 255, 255]}
                        getTargetColor={[195, 70, 101]}
                        getWidth={2}
                    />
                    <ReactMapGL mapStyle="mapbox://styles/mapbox/light-v9" style={{ width: '100vw', height: '100vh' }} mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
                </DeckGL>
            }
        </div>
    )
}
