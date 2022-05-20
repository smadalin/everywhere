import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import DeckGL, { GeoJsonLayer, ArcLayer } from 'deck.gl';

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
                    data={AIR_PORTS}
                    filled={true}
                    pointRadiusMinPixels={2}
                    pointRadiusScale={2000}
                    getPointRadius={f => 11 - f.properties.scalerank}
                    getFillColor={[256, 256, 256 , 180]}
                    pickable={true}
                    autoHighlight={true}
                />
            </DeckGL>
        </div>
    )
}
