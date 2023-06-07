require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const connectBD = require('./config');
const Ticker = require('./model/model')
const path = require('path');
const NodeCache = require('node-cache');

const port = process.env.PORT || 3000

connectBD();

const staticPath = path.join(__dirname + '/public');
const cache = new NodeCache();

app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('', async (req, res) => {

    try {
        const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
        const tickersData = response.data;

        const top10Tickers = Object.values(tickersData).slice(0, 10);
        cache.set('top10Tickers', top10Tickers, 60);

        for (const tickerData of top10Tickers) {
            const existingTicker = await Ticker.findOne({ name: tickerData.name });

            if (existingTicker) {

                existingTicker.last = tickerData.last;
                existingTicker.buy = tickerData.buy;
                existingTicker.sell = tickerData.sell;
                existingTicker.volume = tickerData.volume;
                existingTicker.base_unit = tickerData.base_unit;

                await existingTicker.save();
            } else {

                await Ticker.create({
                    name: tickerData.name,
                    last: tickerData.last,
                    buy: tickerData.buy,
                    sell: tickerData.sell,
                    volume: tickerData.volume,
                    base_unit: tickerData.base_unit,
                });
            }
        }

        const foundData = await Ticker.find({});

        res.render('index', { top10: foundData });

    } catch (error) {
        console.log(error)
    }
});

app.listen(port, () => {
    console.log(`Listening at port number ${port}`)
})