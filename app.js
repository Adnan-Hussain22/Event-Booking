const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const isAuth = require('./middleware/isAuth');
const { schema, resolver } = require('./graphql');
const PORT = process.env.PORT || 3000;
const MONGODBURI = "mongodb://localhost:27017/Event_Booking";
const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHttp({
    schema,
    rootValue: resolver,
    graphiql: process.env.NODE_ENV !== "production"
  })
);

mongoose
	.connect(MONGODBURI, {
		useNewUrlParser: true
	})
	.then(() => {
		app.listen(PORT, () => {
			console.log('The server is listening to port ' + PORT);
		});
	})
	.catch((err) => console.log('db error==>', err));
