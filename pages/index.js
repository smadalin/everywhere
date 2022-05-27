import React, { useState, useRef, useCallback, useEffect } from "react";

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


const INITIAL_VIEW_STATE = {
    latitude: 51.47,
    longitude: 0.45,
    zoom: 2,
    bearing: 0,
    pitch: 50,
};

export default function Home() {

    const [viewport, setViewport] = useState({
        height: "100%",
        width: "100%"
    });

    const [points, setPoints] = useState({
        "type": "FeatureCollection",
        "features": []
    });

    let [data, setData] = useState({
        "type": "FeatureCollection",
        "features": []
    });
    const dataRef = useRef(points);

    const [, updateState] = React.useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect(() => {
        let tempPoints = {
            "type": "FeatureCollection",
            "features": []
        };

        let tempData = {
            "type": "FeatureCollection",
            "features": []
        }
        onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change, index) => {
                if (change.type === "added") {
                

                tempPoints.features.push({
                    "type": "Feature",
                    "properties": {
                        "color": [7, 80, 133],
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
                            "color": [111, 0, 103],
                            "size": "2"
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [change.doc.data().from[0], change.doc.data().from[1]]
                        }
                    })

                tempData.features.push({

                    "type": "Feature",
                    "properties": {
                        "scalerank": 2
                    },
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [[change.doc.data().from[0], change.doc.data().from[1]], [change.doc.data().to[0], change.doc.data().to[1]]]
                    }

                });
                console.log(tempData)
             

                setPoints({
                    ...tempPoints
                })

                setData({
                    ...tempData
                })
            }
                forceUpdate();
            });


        })
    }, []);
    const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoic21hZGFsaW4iLCJhIjoiY2wzY3BjemRhMDBzbTNjbW9sdWc3cDg3YyJ9.wmPQQp-K_CjUVrtwdJPglQ';
    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src="https://osf.digital/library/media/osf/digital/common/header/osf_digital_logo.svg?h=60&la=en&w=366&hash=5FF21BA406E10D94D9778FA8A3A8AEC43C247D2B" />
            </div>
            <div className={styles.box}>
                <h1>Work from Anywhere <span>Deliver Everywhere</span></h1>
            </div>
            {points != null &&
                <DeckGL controller={true} initialViewState={INITIAL_VIEW_STATE}>
                    <GeoJsonLayer
                        id="points"
                        data={points}
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
                        getSourceColor={[111, 0, 103]}
                        getTargetColor={[7, 80, 133]}
                        getWidth={2}
                    />
                    <ReactMapGL mapStyle="mapbox://styles/mapbox/light-v9" style={{ width: '100vw', height: '100vh' }} mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
                </DeckGL>
            }
        </div>
    )
}
