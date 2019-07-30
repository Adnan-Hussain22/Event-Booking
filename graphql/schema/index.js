const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Event {
    _id:ID!
    title:String!
    description:String!
    price:Float!
    date:String!
    creator:User!
}

type User {
    _id:ID!
    email:String!
    password:String
    createdEvents:[Event!]  
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
`);
