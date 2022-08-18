const API_KEY = "64a15844ff104b88a11205731212109";
const BASE_URL = "http://api.weatherapi.com/v1/current.json?key=" + API_KEY + "&q=";

async function LoadData(city)
{
    try {
        let url = BASE_URL + city;
        let res = await fetch(url);
        let data = await res.json();
        return data;
    }catch(err) {
        console.error(err);
    }
};

function UpdateLocation()
{
    let position = navigator.geolocation.getCurrentPosition(UpdateMainCity);
}

function AddFavouriteCity()
{
    let input = document.getElementsByClassName("find")[0];
    let city = document.getElementsByClassName("favouriteTemplate")[0].content.cloneNode(true);
    let favourites = document.getElementsByClassName("favourites")[0];
    favourites.appendChild(city);
    UpdateBackground();
    FillFavouriteCity();
    input.value = "";
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

async function FillFavouriteCity()
{
    let name = document.querySelector(".find").value;
    data = await LoadData(name);
    let city = document.querySelector(".favourites");
    FillCity(data, city.children[city.children.length - 1]);
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
    let currentHeight = site.offsetHeight;
    site.style.height = "fit-content";
    if (site.offsetHeight < currentHeight)
    {
        site.style.height = "100%";
    }
}


UpdateBackground();
UpdateLocation();

let input = document.querySelector(".find");
input.addEventListener("keyup", function(event)
{
    if (event.key === "Enter")
    {
        AddFavouriteCity();
    }
});