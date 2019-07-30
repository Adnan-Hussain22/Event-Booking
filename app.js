const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const PORT = 3000;
const app = express();
const events = [];
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
                createEvent(input: CreatEventInput!): [Event!]!
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
		rootValue: {
			events: () => {
				return events;
			},
			createEvent: (args) => {
				const { title, description, price, date } = args.input;
				const event = {
					_id: Math.random().toString(),
					title,
					description,
					price,
					date
				};
                events.push(event);
                return events
			}
		},
		graphiql: true
	})
);

app.listen(PORT, () => {
	console.log('The server is listening to port ' + PORT);
});
