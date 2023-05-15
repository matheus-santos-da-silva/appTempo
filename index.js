import express from 'express';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import { engine } from 'express-handlebars';
import bodyParser from "body-parser";

dotenv.config();

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/city', async (req, res) => {

    try {
        const city = req.body.city;

        if (!city) throw 'Você deve passar uma cidade, tente novamente!!';

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.APIKEY}&lang=pt_br`);

        const data = await response.json();
        const temperature = Math.round(data.main.temp);
        const name = data.name;
        const description = data.weather[0].description;
        const country = data.sys.country;
        const humidity = data.main.humidity;
        const wind = data.wind.speed;
        const icon = data.weather[0].icon;

        res.render('weatherInfo', { name, temperature, description, country, humidity, wind, icon });

    } catch (error) {
        error = 'Ocorreu uma falha, tente novamente!!'
        res.render('weather', {error});
    }

})

app.get('/', (req, res) => {
    res.render('weather');
})

app.listen(process.env.PORT, () => console.log(`App rodando com sucesso na porta ${process.env.PORT}`));