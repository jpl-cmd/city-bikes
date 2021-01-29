import React, {useEffect, useState} from 'react';
import './App.css';
import {Map,Marker,Popup,TileLayer} from 'react-leaflet';
import axios from 'axios';


const App = () => {



    const defaultItem ={
        name: "Helsinki",
        id: "defaultHelsinki",
        latitude: 60.166640739,
        longitude:24.943536799,
    };



    const[items,setItems] = useState([]);
    const[marker,setMarker] = useState(defaultItem);
    const[activeItem,setActiveItem] = useState(null);
    const[weatherItem,setWeatherItem] = useState(null);
    const[updateTime,setUpdateTime] = useState(null);


    const click = (item) =>{
        console.log(item.latitude,item.longitude);
        setMarker(item);
    };

    useEffect(() => {
        axios.get("http://api.citybik.es/v2/networks/citybikes-helsinki").then(response => {
            let array = response.data.network.stations;
            setItems(array);
        })
    }, []);


    useEffect(()=>{
       axios.get("http://api.openweathermap.org/data/2.5/weather?q=Helsinki&appid=114332134ea7ed53cb7a0e88a863eb5d&units=metric").then(response=>{
           console.log(response.data);
           setWeatherItem(response.data);
           let today = new Date();
           let hours = today.getHours();
           let minutes = today.getMinutes();
           let seconds = today.getSeconds();
           if(seconds<10){
               seconds = "0"+seconds;
           }
           if(minutes<10){
               minutes = "0"+minutes;
           }
           if(hours<10){
               hours = "0"+hours;
           }

           let time = hours + ":" + minutes + ":" + seconds;
           setUpdateTime(time);
       });
    },[]);

    const content = items.map((item) => {
        return <p className={"menuitem"} key={item.id} onClick={() => click(item)}>{item.name}</p>
    },[]);



    return (
        <div>
            <div className={"navigation-bar"}>
                <div className={"dropdown"}>
                    <p className={"navigation-item"}>Pyöräasemat<br/> &#x2630;</p>
                    <div className={"dropdown-content"}>
                        {content}
                    </div>
                </div>
            </div>
            <div id={"info"}>
                {weatherItem !== null &&
                    <div>
                        <h2>{weatherItem.name}</h2>
                            <div id={"weather-display"}>
                                <img id={"weather-icon"} src={"http://openweathermap.org/img/wn/"+weatherItem.weather[0].icon+"@2x.png"} alt={"weather icon"}/>
                            </div>
                        <p>Update time: {updateTime}</p>
                        <p>Description: {weatherItem.weather[0].description}</p>
                        <p> Current temperature: {weatherItem.main.temp} &#x2103;</p>
                    </div>}
            </div>
            <Map center={[marker.latitude,marker.longitude]} zoom={12}>
                <TileLayer
                    url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                    attribution={'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}
                />

                <Marker key={marker.id} position={[marker.latitude,marker.longitude]} onClick={()=>{
                    setActiveItem(marker);
                }}/>}

                {activeItem && <Popup
                    position={[activeItem.latitude,activeItem.longitude]}
                    onClose={()=> {setActiveItem(null);}}>
                    <div>
                        <h2>
                            {activeItem.name}
                        </h2>
                        {marker.name !== "Helsinki" && <div>
                            <p>Free bikes:{activeItem.free_bikes} </p>
                            <p>Empty slots:{activeItem.empty_slots}</p>
                        </div>}
                    </div>
                </Popup>}
            </Map>
        </div>
    )
};

export default App;
