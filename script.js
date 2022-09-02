const API_KEY = "64a15844ff104b88a11205731212109";
const BASE_URL = "https://api.weatherapi.com/v1/current.json?key=" + API_KEY + "&q=";
const DEFAULT_CITY = "Saint Petersburg"

async function LoadData(city)
{
    let url = BASE_URL + city;
    let data = null;
    try
    {
        let res = await fetch(url);
        if (res.status != 200)
        {
            throw new Error();
        }
        data = await res.json();
    }
    catch(err)
    {
        window.alert("API Error: Maybe there is no city like that");
    }
    return data;
};

function GetCitiesFromStorage()
{
    if (localStorage.favourites === undefined || localStorage.favourites === "") {
        return [];
    }
    return JSON.parse(localStorage.favourites);
}

function UpdateStorage(array)
{
    localStorage.setItem("favourites", JSON.stringify(array));
}

function UpdateLocation()
{
    let position = navigator.geolocation.getCurrentPosition(LoadMainCity, LoadDefaultCity);
}

async function LoadMainCity(position)
{
    let coordinates = position["coords"]["latitude"] + "," + position["coords"]["longitude"];
    let data =  await LoadData(coordinates);
    UpdateMainCity(data);
}

async function LoadDefaultCity(position)
{
    let data = await LoadData(DEFAULT_CITY);
    UpdateMainCity(data);
}

function UpdateMainCity(data)
{
    let city = document.querySelector(".mainCity");
    FillCity(data, city);
}

async function ParseName()
{
    let input = document.querySelector(".find");
    let data = await LoadData(input.value);
    input.value = "";
    let cities = GetCitiesFromStorage();
    let name = data["location"]["name"];
    if (cities.includes(name)) {
        window.alert("You already have this city in favourites");
        return;
    }
    cities.push(name);
    UpdateStorage(cities);
    AddFavouriteCity(undefined, data);
}

async function AddFavouriteCity(name=null, data=null)
{
    if (data === null)
    {
        data = await LoadData(name);
    }
    let city = document.querySelector(".favouriteTemplate").content.cloneNode(true);
    let favourites = document.querySelector(".favourites");
    favourites.appendChild(city);
    CreateFavouriteCity(data);
}

function CreateFavouriteCity(data)
{
    let cities = document.querySelector(".favourites");
    let city = cities.children[cities.children.length - 1];
    FillCity(data, city);
    let deleteButton = city.querySelector(".delete");
    deleteButton.addEventListener("click", function(event)
    {
        let localCities = GetCitiesFromStorage();
        let name = city.querySelector(".cityName");
        localCities.splice(localCities.indexOf(name), 1);
        UpdateStorage(localCities);
        city.remove();
    });
}

function FillCity(data, city)
{
    city.querySelector(".cityName").innerHTML = data["location"]["name"];
    city.querySelector(".temperature").innerHTML = data["current"]["temp_c"] + "°C";
    city.querySelector(".wind").innerHTML = data["current"]["wind_dir"] + " " + data["current"]["wind_kph"] + " kph";
    city.querySelector(".cloud").innerHTML = data["current"]["cloud"] + "%";
    city.querySelector(".pressure").innerHTML = data["current"]["pressure_mb"] + " MilliBars";
    city.querySelector(".humidity").innerHTML = data["current"]["humidity"] + "%";
    city.querySelector(".coordinates").innerHTML = data["location"]["lat"] + ", " + data["location"]["lon"];
    city.querySelector(".icon").src = "https:" + data["current"]["condition"]["icon"];
} 

window.onload = function()
{
    UpdateLocation();

    let input = document.querySelector(".find");
    input.addEventListener("keyup", function(event)
    {
        if (event.key === "Enter")
        {
            ParseName();
        }
    });
    let cities = GetCitiesFromStorage();
    for (let i = 0; i < cities.length; i++)
    {
        AddFavouriteCity(cities[i]);
    }
}