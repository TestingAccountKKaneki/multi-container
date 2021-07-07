const keys = require('./keys');
const redis = require('redis');
const express = require('express');

const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const { Pool }  = require('pg');
const pgPool = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgPool.on('error', () => console.log('Lost PG connection'));

pgPool.query('CREATE TABLE IF NOT EXISTS values(number INT)')
    .catch((err) => console.log(err));

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort, 
    retry_strategy: () => 1000
});



const redisPub = redisClient.duplicate();


// ROUTES
app.get('/a', (req, res) => {
    res.send('Hello from Fib calc')
});

app.get('/values/all', async (req, res) => {
    const values = await pgPool.query('SELECT * FROM values');

    res.send(values.rows);
});


app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});


app.post('/values', async(req, res) => {
    const index = req.body.index;
    if(parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }
    redisClient.hset('values',index,'Nothing yet');
    redisPub.publish('insert',index);
    pgPool.query('INSERT INTO values(number) VALUES($1)',[index]);
    res.send({working: true});
});

app.listen(5000, err => {
    console.log('Listening');
})