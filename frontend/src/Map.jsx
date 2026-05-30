import { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const API_URL = import.meta.env.VITE_API_URL;


export default function Map({onResults})
{   
    const [loading, setLoading] = useState(true);
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
            for (let [id, plant] of Object.entries(data))
            {
                
                L.marker([plant.Latitude, plant.Longitude]).addTo(map).on('click', async () => {
                    const res = await fetch(`${API_URL}/plants/${id}`);
                    const plantData = await res.json();
                    onResults(null, plantData);
                });
            }
            setLoading(false); 
        }
        loadMap();
        


        return() => {
            map.remove();
        }
    }, []);

    return (
        <div style={{ position: 'relative' }} className="h-screen">
            <div ref={mapRef} className="h-screen" />
            {loading && (
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.7)', zIndex: 1000,
                fontSize: 13, color: '#4A5C4E', fontFamily: "'IBM Plex Sans', sans-serif"
            }}>
                Loading plant data — this may take up to 60s on first load…
            </div>
            )}
        </div>
    );
}