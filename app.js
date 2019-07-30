const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const PORT = 3000;
const app = express();

app.use(bodyParser.json());

app.use(
	'/graphql',
	graphqlHttp({
		schema: buildSchema(`

            type RootQuery {
                events: [String!]!
            }

            type RootMutation {
                createEvent( name: String ): String
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
		rootValue: {
			events: () => {
				return [ 'A', 'B', 'C' ];
			},
			createEvent: (args) => {
				const eventName = args.name;
				return eventName;
			}
		},
		graphiql: true
	})
);

app.listen(PORT, () => {
	console.log('The server is listening to port ' + PORT);
});
