import { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const API_URL = import.meta.env.VITE_API_URL;


export default function Map()
{
    const mapRef = useRef(null);
    useEffect(() => {
        var map = L.map(mapRef.current,{
            center: [39, -98],
            zoom: 4
        })
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
        async function loadMap()
        {
            const response = await fetch(API_URL+'/plants', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            console.log(data);
            for(let plant of Object.values(data))
            {
                L.marker([plant.Latitude, plant.Longitude]).addTo(map);
            }
        }
        loadMap();
        


        return() => {
            map.remove();
        }
    }, []);

    return <div className="h-screen" ref={mapRef}></div>;
}