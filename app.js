const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { Event, User } = require('./models');
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

            type User {
                _id:ID!
                email:String!
                password:String
            }

            input CreatEventInput {
                title:String!
                description:String!
                price:Float!
                date:String!
            }

            input CreateUserInput {
                email:String!
                password:String!
            }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                createEvent(input: CreatEventInput!): Event
                createUser(input: CreateUserInput!): User
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
				let createdEvent = null;
				const event = new Event({
					title,
					description,
					price,
					date: new Date(date)
				});
				return event
					.save()
					.then((result) => {
						createdEvent = { ...result._doc, _id: result.id };
						return User.findById('5d405ff16e623c2de42ea81a');
					})
					.then((user) => {
						if (!user) throw new Error('User not found');
						user.createdEvents.push(createdEvent);
						return user.save();
					})
					.then(() => createdEvent)
					.catch((err) => {
						console.log('new doc err==>', err);
						throw err;
					});
			},
			createUser: (args) => {
				const { email, password } = args.input;
				return User.findOne({ email })
					.then((user) => {
						if (user) {
							throw new Error('User already exists');
						}
						return bcrypt.hash(password, 12);
					})
					.then((hashedPass) => {
						const user = new User({
							email,
							password: hashedPass
						});
						return user.save();
					})
					.then((result) => {
						return { ...result._doc, _id: result.id };
					})
					.catch((err) => {
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
