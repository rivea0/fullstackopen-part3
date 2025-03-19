require('dotenv').config();
const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument!');
  process.exit(1);
}

const pwd = process.argv[2];

const connStrPrefix = process.env.MONGODB_CONN_STR_PREFIX;
const connStrUsername = process.env.MONGODB_CONN_STR_USERNAME;
const connStrHost = process.env.MONGODB_CONN_STR_HOST;
const connStrDbName = process.env.MONGODB_CONN_STR_DB_NAME;
const connStrOptions = process.env.MONGODB_CONN_STR_OPTIONS;

const url = `${connStrPrefix}${connStrUsername}:${encodeURIComponent(pwd)}${connStrHost}${connStrDbName}${connStrOptions}`;

mongoose.set('strictQuery',false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  console.log('phonebook:');
  Person.find({}).then(result => {
    result.forEach(p => {
      console.log(`${p.name} ${p.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  let name = process.argv[3];
  let number = process.argv[4];

  const person = new Person({ name, number });

  person.save()
    .then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`);
      mongoose.connection.close();
    })
    .catch(error => {
      console.log('could not save person entry');
      mongoose.connection.close();
    });
} else {
  console.log('incorrect number of arguments');
  mongoose.connection.close();
  process.exit(1);
}
