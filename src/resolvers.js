// import { users } from "./db";
// const connectMongo = require('./mongo-connector');
const {MongoClient} = require('mongodb');
const MONGO_URL = 'mongodb://localhost:27017/';

let users;

MongoClient.connect(MONGO_URL, { useNewUrlParser: true },async function (err, client) {
	if (err) {
		console.error(err);
		throw err;
	}
	
	users = await client.db('game').collection('records');
	console.log(`Connected to db ${MONGO_URL}`);
});

const resolvers = {
	Query: {
		userResults: async  (parent, { name }, context, info) => {
		
			return await users
				.find({"name" : `${name}`})
				.limit(10)
				.toArray();
		},
		
		users: async (parent, { level }, context, info) => {
			return await users
				.find({"level" : `${level}`}, { _id: 0 })
				.sort({result: 1})
				.limit(10)
				.toArray();
		}
	},
	
	Mutation: {
		createUser: async (parent, { level, name, result }, context, info) => {
			const newUser = { level, name, result };
			
			await users.insertOne(newUser);
			
			return newUser;
		},

		deleteUser: async (parent, { name }, context, info) => {
			const deletedUsers = await users.find({"name": `${name}`}).toArray();
			
			await users.deleteMany({"name": `${name}`});

			return await deletedUsers;
		}
	}
};

export default resolvers;
