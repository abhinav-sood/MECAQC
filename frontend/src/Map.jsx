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
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'})
        .addTo(map);
        async function loadMap()
        {
            const response = await fetch(API_URL+'/plants/summary', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            for (let plant of data)
            {
                
                L.circleMarker([plant.lat, plant.lon],
                    {
                        radius : Math.sqrt(plant.capacity) * .5,
                        color: plant.bestNetBenefit >= 0 ? 'green' : 'red', 
                    }
                ).addTo(map).bindTooltip(`Plant: ${plant.facilityName}, Capacity: ${plant.capacity} MW, Best: ${plant.bestScenario}`,
                                    {direction: 'top',
                                 sticky: true}
                            ).on('click', async () => {
                    const res = await fetch(`${API_URL}/plants/${plant.facilityID}`);
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
            
            )}<div style={{
                position: 'absolute', bottom: 24, right: 10, zIndex: 1000,
                background: 'white', border: '1px solid #D6DDD6', borderRadius: 8,
                padding: '12px 14px', fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 11.5, color: '#1A2B1E', minWidth: 160,
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7A907E' }}>
                    Scenarios
                </div>
                {[
                    { label: 'bau', desc: 'Business as Usual' },
                    { label: 'ac',  desc: 'Add-on Scrubber' },
                    { label: 'gt',  desc: 'Gas Transition' },
                    { label: 'rt',  desc: 'Renewable Transition' },
                ].map(({ label, desc }) => (
                    <div key={label} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, minWidth: 28 }}>{label}</span>
                        <span style={{ color: '#4A5C4E' }}>{desc}</span>
                    </div>
                ))}
                <div style={{ borderTop: '1px solid #E8EDE8', margin: '8px 0' }} />
                <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7A907E' }}>
                    Map key
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'green', flexShrink: 0 }} />
                    <span style={{ color: '#4A5C4E' }}>Positive net benefit</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'red', flexShrink: 0 }} />
                    <span style={{ color: '#4A5C4E' }}>Negative net benefit</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid green', flexShrink: 0 }} />
                    <span style={{ color: '#4A5C4E' }}>Larger = more capacity</span>
                </div>
            </div>
        </div>
    );
}
            
