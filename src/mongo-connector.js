const {MongoClient} = require('mongodb');
const MONGO_URL = 'mongodb://localhost:27017/';

module.exports = async () => {
	const client = await MongoClient.connect(MONGO_URL, { useNewUrlParser: true });
	let users = await client.db("game").collection('records');
	// await console.log(users.find({}));
	return await {Users: users};
};

