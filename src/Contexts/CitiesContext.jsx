import { createContext, useContext, useReducer,useCallback } from "react";
import { useEffect } from "react";


const CitiesContext = createContext();
const BASE_URL = 'http://localhost:9000';

const initialState={
  cities:[],
  loading:false,
  currentCity:{},
  error:""
}
function reducer(state,action){
   switch(action.type){
     case 'loading':
       return {...state,loading:true}

    case 'city/loaded':
      return {...state,loading:false,currentCity:action.payload}

     case 'cities/loaded':
       return {...state, loading:false,cities:action.payload}

    case 'cities/created':
      return {...state, loading:false,cities:[...state.cities,action.payload]}
     case 'cities/deleted':
       return {...state,loading:false,currentCity:{} ,cities: state.cities.filter((city) => city.id !== action.payload)}

     case 'rejected':
        return {...state,loading:false,error:action.payload}

     default: throw new Error('Unknown action type')
   }
    
}
function CitiesProvider({children}){
  const [{cities,loading,currentCity},dispatch]=useReducer(reducer,initialState);
  
    useEffect(function(){
       async function fetchCities(){
         try{
             dispatch({type:'loading'})
             const res = await fetch(`${BASE_URL}/cities`);
             const data = await res.json();
             dispatch({type:'cities/loaded',payload:data})
         }
         catch{
            dispatch({type:'rejected',payload:'There is an error loading data...'})
         } 
        
       }
       fetchCities();
    },[])


    const getcity = useCallback(async function getCity(id){
      if(id===currentCity.id) return;
      try{
          dispatch({type:'loading'})
          const res = await fetch(`${BASE_URL}/cities/${id}`);
          const data = await res.json();
          dispatch({type:'city/loaded',payload:data})
      }
      catch{
        dispatch({type:'rejected',payload:'There is an error getting data...'})
     } 
     
    },[currentCity.id])


    async function createCity(newCity){
      try{
          dispatch({type:'loading'})
          const res = await fetch(`${BASE_URL}/cities`,{
            method:'POST',
            body: JSON.stringify(newCity),
            headers:{
              'content-type':'application/json',
            }
          });
          const data = await res.json();
          dispatch({type:'cities/loaded',payload:data})
          //setCities([...cities,data])
      }
      catch{
        dispatch({type:'rejected',payload:'There is an error creating data...'})
     } 
     
    }
    async function deleteCity(id){
      try{
         dispatch({type:'loading'})
          await fetch(`${BASE_URL}/cities/${id}`,{
          method:'DELETE',
        });
        dispatch({type:"cities/deleted",payload:id})
       /* setCities((prevCities) => {
          const updatedCities = prevCities.filter((city) => city.id !== id);
          return [...updatedCities];
        });*/
      
    }
    catch{
      dispatch({type:'rejected',payload:'There is an error deleting data...'})
   } 
   
    }


    return <CitiesContext.Provider value={{
        cities,loading,currentCity,getcity,createCity,deleteCity
    }}>
        {children}
    </CitiesContext.Provider>
}

function useCities(){
    const context = useContext(CitiesContext);
    if(context === undefined) throw new Error("CitiesContext was used outside of the CitiesProvider");
    
    return context;
}

export {CitiesProvider,useCities};