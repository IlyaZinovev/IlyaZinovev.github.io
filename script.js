const API_KEY = "64a15844ff104b88a11205731212109";
const BASE_URL = "http://api.weatherapi.com/v1/current.json?key=" + API_KEY + "&q=";

async function LoadData(city)
{
    try
    {
        let url = BASE_URL + city;
        let res = await fetch(url);
        if (res.status != 200)
        {
            throw new Error();
        }
        let data = await res.json();
        return data;
    }
    catch(err)
    {
        window.alert("There is no city like that!");
        return null;
    }
};

function UpdateLocation()
{
    let position = navigator.geolocation.getCurrentPosition(UpdateMainCity);
}

async function ParseName()
{
    let input = document.querySelector(".find");
    let data = await LoadData(input.value);
    input.value = "";
    if (data === null)
    {
        return;
    }
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
        if (data === null)
        {
            return;
        }
    }
    let city = document.querySelector(".favouriteTemplate").content.cloneNode(true);
    let favourites = document.querySelector(".favourites");
    favourites.appendChild(city);
    UpdateBackground();
    CreateFavouriteCity(data);
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
        UpdateBackground();
    });
}

async function UpdateMainCity(position)
{
    let coordinates = position["coords"]["latitude"] + "," + position["coords"]["longitude"];
    let data =  await LoadData(coordinates);
    let city = document.querySelector(".mainCity");
    FillCity(data, city);
}

function UpdateBackground()
{
    let site = document.querySelector("html");
    site.style.height = "fit-content";
    let heightContent = site.offsetHeight;
    site.style.height = "100%";
    if (site.offsetHeight < heightContent)
    {
        site.style.height = "fit-content";
    }
}

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

window.onload = function()
{
    //localStorage.removeItem("favourites");
    UpdateBackground();
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