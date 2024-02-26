import {useState, useEffect} from 'react'

const WeatherDisplayer = () => {
    const [data, setData] = useState(null);
    const [searchData, setSearchData] = useState(null);

    const [searchParam, setSearchParam] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [city, setCity] = useState("Helsinki");

    const [showSuggestions, setShowSuggestions] = useState(true);

    const url=`http://api.weatherapi.com/v1/current.json?key=c8d88bd87e7b406d8f4142651233110&q=${city}&aqi=no`
    const urlSearch=`http://api.weatherapi.com/v1/search.json?key=c8d88bd87e7b406d8f4142651233110&q=${searchParam}&aqi=no`

    const fetchData = () => {
        fetch(url)
        .then(response => {
            if(!response.ok) {
                throw new Error("Response is not ok" + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            setData(data);
            setLoading(false);
            console.log(data);
        })
        .catch(error => {
            setError(error);
            setLoading(false);
        });
    }

    const fetchSearchData = () => {
        fetch(urlSearch)
        .then(response => {
            if(!response.ok) {
                throw new Error("Response is not ok" +response.statusText);
            }
            return response.json();
        })
        .then(data => {
            setSearchData(data);
            setLoading(false);
            console.log(data);
        })
        .catch(error => {
            setError(error);
            setLoading(false);
        });
    }

    const handleCity = (e) => {
        setCity(e.target.value) 
        console.log("handleCity");
        console.log(city);
    }

    const handleSearch = (e) => {
        setSearchParam(e.target.value)
        console.log(searchParam);
        
        searchParam.length > 2 && fetchSearchData()
        
        setShowSuggestions(true);
    }

    const handleSuggestions = () => {
        setSearchParam("");
        fetchData();
        setShowSuggestions(false);
    }

    useEffect(() => {
        if(searchData && searchData.length>0){ // Remember to do this check
            handleCity({target: {value: searchData[0].name} });
        }
    },[searchData]);

    return(
<>
        <div className="WeatherDisplayer">
        <h1>Weather Data for cities</h1>
        <div className="DataSection">

        {data!=null ? (
            <>
        <h1>{data.location.name}</h1>
        <p style={{marginTop: -20}}>________________________________________________________________________________________________</p>
        <div id="CurrentCondition">
        <h3 style={{float: "right"}}>{data.current.condition.text} </h3>
        <img id="Weather" src={data.current.condition.icon} />
        </div>
        <h3>Current temperature: {data.current.temp_c} °C</h3>
        <h3>Current wind speed: {data.current.wind_kph} km/h</h3>
        <h3>Humidity: {data.current.humidity}</h3>
        <h3>Precipitation: {data.current.precip_mm}</h3>
        <h3>Longitude: {data.location.lon}</h3>
        </>
        ) : loading ? ( 
            <p>Loading</p> 
            ) : ( 
                <>
                <p>____________________________Search to see data here_______________________________</p> 
                <p>Type text into the box, press search cities, select city from the dropdown, and click get data</p>
                </>
                )}
        </div>

            <h3>Select a city</h3>
            <div id="Search">
                <div id="SearchGrid">
                <input id="SearchBox" type="text" value={searchParam} onChange={handleSearch}/>
            {searchData && searchData.length>2 && showSuggestions==true &&(
                <ul style={{id: "SearchUl", listStyleType: "none", backgroundColor: "white"}}>
                    {searchData.map((item, index) => (
                    <li key={index} value={item.name} onClick={handleSuggestions}>
                        {item.name}
                        </li>
            ))}
            </ul>
            )}
                        </div>

            <button onClick={fetchSearchData}>Search cities</button>

            {searchData!=null ? (
                <>
            <select id="search" name="search" value={searchParam} onChange={handleCity}>
                <option value="" disabled hidden>Choose a city</option>
                {searchData.map((item, index) => (
                <option key={index} value={item.name}>
                    {item.name}
                </option>
                ))}
            </select>
            </>
    ) : (
        <select id="search" name="search" defaultValue="" onChange={handleCity}>
                            <option value="" disabled hidden >Choose a city</option>
            </select>
        )}
            <button onClick={fetchData}>Get data</button>

            </div>

        </div>

        </>
        
    )}

export default WeatherDisplayer