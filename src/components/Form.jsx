// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
import { useEffect, useState } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import {useUrlPosition} from '../hooks/useUrlPosition'
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import { useCities } from "../Contexts/CitiesContext";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const BASE_URL="https://api.bigdatacloud.net/data/reverse-geocode-client";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [lat,lng]= useUrlPosition();
  const [isLoadingGeo,setIsLoadingGeo] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [geoError, setGeoError] =useState('');

  const {createCity,loading} = useCities();

  const navigate = useNavigate();

  useEffect(function(){
    async function fetchCityData(){
      if(!lat && !lng) return;
      try{
          setIsLoadingGeo(true);
          setGeoError('')
          const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
          const data = await res.json();
     
          if(!data.countryCode) throw new Error("This is not a country. Click somewhere else.")


          setCityName(data.city || data.locality || '');
          setCountry(data.countryName || '');
          setEmoji(convertToEmoji(data.countryCode))
      }
      catch(err){
        setGeoError(err.message);
      } 
      finally{
        setIsLoadingGeo(false);
      }
    }
    fetchCityData();
 },[lat,lng])

  async function handleSubmit(e){
      e.preventDefault();
      if(!cityName && !date) return;

      const newCity ={cityName,country,emoji,date,notes,position:{lat,lng}};
      await createCity(newCity);
      setCityName('');
      setNotes('');
      navigate("/appLayout/cities");
     // setDate('');
      
  }

  if(isLoadingGeo) return <Spinner/>
  if(geoError)return <Message message={geoError}/>


  return (
    <form className={`${styles.form} ${loading? styles.loading:''}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
       { <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />} 
       
        {<span className={styles.flag}>{emoji}</span> }
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
    
         <DatePicker onChange={date=>{setDate(date)}}  selected={date} dateFormat="DD/MM/yyyy" />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>ADD</Button>
        <BackButton/>
        </div>
    </form>
  );
}

export default Form;
