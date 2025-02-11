import { useNavigate} from 'react-router-dom';
import { MapContainer,TileLayer,Marker,Popup, useMap, useMapEvent } from 'react-leaflet';
import styles from './Map.module.css'
import { useCities } from '../Contexts/CitiesContext';
import { useState,useEffect } from 'react';
import {useUrlPosition} from '../hooks/useUrlPosition'



function Map() {
    const [lat,lng]= useUrlPosition();
    
    const [mapPosition, setMapPosition] = useState([40,0]);
    const {cities} = useCities();

    useEffect(function(){
        if(lat && lng)setMapPosition([lat,lng])
    },[lat,lng])

    return (
        <div className={styles.mapContainer}>
                <MapContainer center={mapPosition} className={styles.map} zoom={10} scrollWheelZoom={true}>
                    <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                    />
                    {cities.map(city=>
                        <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                            <Popup>
                               <span>{city.cityName}</span>
                            </Popup>
                       </Marker>
                    )}
                    <ChangeCenter position={mapPosition} />
                    <DetectClick/>
            </MapContainer>
        </div>
    )
}
function ChangeCenter({position}){
   const map= useMap();
   map.setView(position);

   return null;
}

function DetectClick(){
    const navigate = useNavigate(); 
    useMapEvent({
        click: (e)=>navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    })
}
export default Map
