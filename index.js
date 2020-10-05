const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const info = { user: 'volunteerNetworkUser', pass: 'Network11', db: 'volunteerNetwork' };

const port = 5500;



const uri = "mongodb+srv://volunteerNetworkUser:Network11@cluster0.pf9xm.mongodb.net/volunteerNetwork?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const events = client.db("volunteerNetwork").collection("events");

    app.post('/registeredUser', (req, res) => {
        const registeredData = req.body;
        events.insertOne(registeredData)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });

    app.get('/enrolledEvents', (req, res) => {
        events.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.delete('/delete/:id', (req, res) => {
        events.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
                console.log(result);
            })
    })
});

app.get('/', (req, res) => {
    res.send('Hello World')
});


app.listen( process.env.PORT || port)