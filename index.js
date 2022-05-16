const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


/* middleware */
app.use(cors());
app.use(express.json());

/* mongoDB  */

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hd4la.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('doctor_bhai').collection('services');
        const bookingCollection = client.db('doctor_bhai').collection('booking');
        const usersCollection = client.db('doctor_bhai').collection('users');

        /***
         * API Naming Convestion
         * app.get('/booking') // get all bookings in this collection. get one more than by any filter
         * app.get('/booking/:id')// get a specific booking 
         * app.post('/booking') // add a new booking
         * app.patch('/booking/:id') //one item update on your DB
         * app.put('/booking/:id') //upsert ==> update (if exists) or insert(if don't exits) // we are not sure data have or not
         * app.delete('/booking/:id') //one item delete on your DB
         */

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = await serviceCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/booking', async (req, res) => {
            const patient = req.query.patient;
            const authorization = req.headers.authorization;
            console.log('auth header: ',authorization);
            const query = { patient: patient };
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings);
        })

        app.get('/available', async (req, res) => {
            const date = req.query.date || 'May 15, 2022';
            // step-01: GET ALL SERVICES 
            const services = await serviceCollection.find().toArray();
            // res.send(services);

            //step-02: get the bookig of that day
            const query = { date: date };
            const bookings = await bookingCollection.find(query).toArray();
            // res.send(booking);

            // step-03: for each service, find bookings for that service
            services.forEach(service => {
                const serviceBooking = bookings.filter(b => b.treatment === service.name);
                const booked = serviceBooking.map(s => s.slot);
                // service.booked = booked; // for checking ;
                const available = service.slots.filter(s => !booked.includes(s));
                // service.available = available;
                service.slots = available;

            })
            res.send(services);
        })


        app.post('/booking', async (req, res) => {
            const booking = req.body;
            // console.log(booking);
            const query = { treatment: booking.treatment, date: booking.date, patient: booking.patient }
            const exists = await bookingCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, booking: exists })
            }
            const result = await bookingCollection.insertOne(booking);
            return res.send({ success: true, result });
        })

        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            // ekta inforation thake user body te 
            const user = req.body;

            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.send({ result, token });
        })


    } finally {

        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello Doctor bhai');
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})