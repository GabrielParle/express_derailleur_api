const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Hangers = require("./models/hangers")
const http = require("http")
var helmet = require('helmet');

const port = 8081;

const app = express();
app.use(morgan('combined'));
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());

app.get('/hangers', (req, res) => {
    Hangers.find({}, 'name bolts inside outside qr thruAxle image', function (error, hangers) {
		if (error) { console.error(error); }
		res.send({
			hangers: hangers
		})
	}).sort({_id:-1})
});

app.post('/hangers', (req, res) => {
	const db = req.db;
	const name = req.body.name;
	const bolts = req.body.bolts;
	const inside = req.body.inside;
	const outside = req.body.outside;
	const qr = req.body.qr;
	const thruAxle = req.body.thruAxle;
	const image = req.body.image;
	var new_hanger = new Hangers({
		name: name,
		bolts: bolts,
		inside: inside,
		outside: outside,
		qr: qr,
		thruAxle: thruAxle,
		image: image
	})

	new_hanger.save(function (error) {
		if (error) {
			console.log(error)
		}
		res.send({
			success: true,
			message: 'Hanger Saved!'
		})
	})
})

//fetch single post
app.get('/hanger/:id', (req,res) => {
	const db = req.db;
	Hangers.findById(req.params.id, 'name bolts inside outside qr thruAxle', (error, hanger) => {
		if (error) { console.error(error);}
		res.send(hanger)
	})
})

//find your hanger quiz
app.get('/findhanger/:bolts&:qr&:thruAxle&:outside&:inside', (req, res) => {
	const bolts = req.params.bolts;
	const qr = req.params.qr;
	const thruAxle = req.params.thruAxle;
	const inside = req.params.inside;
	const outside = req.params.outside;
	console.log(bolts);
	const db = req.db;
	Hangers.find({bolts: bolts, qr: qr, thruAxle: thruAxle, outside: outside, inside: inside }, (error, hangers) => {
		if(error) { console.error(error);}
		console.log(hangers);
		res.send({hangers: hangers });
	})
})

//update a hanger
app.put('/hangers/:id', (req, res) => {
	const db = req.db;
	Hangers.findById(req.params.id, 'name bolts', (error, hanger) => {
		if(error) { console.error(error); }

		hanger.name = req.body.name;
		hanger.bolts = req.body.bolts;
		hanger.save(error => {
			if (error) {
				console.log(error)
			}
			res.send({
				success: true
			})
		})
	})
})

//delete a hanger
app.delete('/hangers/:id', (req, res) => {
	const db = req.db;
	Hangers.remove({
		_id: req.params.id
	}, (err, post) => {
		if (err) {
			res.send(err)
		}
		res.send({
			success: true
		})
	})

})
const dev_db_url = process.env.MONGODDB_URI || 'mongodb://localhost:27017/posts';

mongoose.connect(dev_db_url);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Connection Succeeded");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`)
});