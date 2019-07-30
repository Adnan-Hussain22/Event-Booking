const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const { Event } = require('./models');
const { buildSchema } = require('graphql');
const PORT = 3000;
const app = express();
app.use(bodyParser.json());

app.use(
	'/graphql',
	graphqlHttp({
		schema: buildSchema(`

            type Event {
                _id:ID!
                title:String!
                description:String!
                price:Float!
                date:String!
            }

            input CreatEventInput {
                title:String!
                description:String!
                price:Float!
                date:String!
            }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                createEvent(input: CreatEventInput!): Event!
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
		rootValue: {
			events: () => {
				return Event.find()
					.then((events) => {
						return events.map((event) => {
							return { ...event._doc, _id: event.id };
						});
					})
					.catch((err) => {
						throw err;
					});
			},
			createEvent: (args) => {
				const { title, description, price, date } = args.input;
				const event = new Event({
					title,
					description,
					price,
					date: new Date(date)
				});
				return event
					.save()
					.then((result) => {
						return { ...result._doc, _id: result.id };
					})
					.catch((err) => {
						console.log('new doc err==>', err);
						throw err;
					});
			}
		},
		graphiql: true
	})
);

mongoose
	.connect(
		`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@bookingevent-5rziv.mongodb.net/${process
			.env.MONGO_DB}?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true
		}
	)
	.then(() => {
		app.listen(PORT, () => {
			console.log('The server is listening to port ' + PORT);
		});
	})
	.catch((err) => console.log('db error==>', err));
