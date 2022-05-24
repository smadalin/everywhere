import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import DeckGL, { GeoJsonLayer, ArcLayer } from 'deck.gl';
import data from "./data/data.json";

console.log(data);
// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const COUNTRIES =
    'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson'; //eslint-disable-line
const AIR_PORTS =
    'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';

const INITIAL_VIEW_STATE = {
    latitude: 51.47,
    longitude: 0.45,
    zoom: 2,
    bearing: 0,
    pitch: 0
};



export default function Home() {
    return (
        <div className={styles.container}>
            <DeckGL controller={true} initialViewState={INITIAL_VIEW_STATE}>
                <GeoJsonLayer
                    id="base-map"
                    data={COUNTRIES}
                    stroked={true}
                    filled={true}
                    lineWidthMinPixels={2}
                    opacity={1}
                    getLineColor={[14, 57, 120]}
                    getFillColor={[14, 57, 99]}
                />
                <GeoJsonLayer
                    id="airports"
                    data={data}
                    filled={true}
                    pointRadiusMinPixels={2}
                    pointRadiusScale={2000}
                    getPointRadius={f => 11 - f.properties.scalerank}
                    getFillColor={[255, 99, 71]}
                    pickable={true}
                    autoHighlight={true}
                />
                <ArcLayer
                    id="arcs"
                    data={data}
                    dataTransform={d => d.features.filter(f => f.properties.scalerank < 4)}
                    getSourcePosition={f => [-0.4531566, 51.4709959]}
                    getTargetPosition={f => f.geometry.coordinates}
                    getSourceColor={[0, 128, 200]}
                    getTargetColor={[200, 0, 80]}
                    getWidth={1}
                />
            </DeckGL>
        </div>
    )
}
