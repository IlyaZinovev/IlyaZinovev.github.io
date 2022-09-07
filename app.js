const API_KEY = "64a15844ff104b88a11205731212109"
const BASE_URL = "https://api.weatherapi.com/v1/current.json?key=" + API_KEY + "&q="
const PORT = 3000

const express = require('express')
const https = require('https')
const app = express()
const cors = require('cors')

function LoadData(city, response)
{
    let url = BASE_URL + city
    https.get(url, (httpsResponse) => {
		let data = ''
		httpsResponse.on('data', (newData) => {
            data = newData
        })
        httpsResponse.on('end', () => {
            data = JSON.parse(data)
            response.status(200).send(data)
        })
	}).on("error", (error) => {
		response.status(400).send('{"message": "Something wrong with the weather API"}')
	})
}

app.use(cors())

app.get('/weather/city', (request, response) =>
{
    LoadData(request.query.q, response)
})

app.get('/weather/coordinates', (request, response) =>
    LoadData(request.query.lat + ',' + request.query.lon)
)

app.listen(PORT, ()=>console.log('Listening now'))