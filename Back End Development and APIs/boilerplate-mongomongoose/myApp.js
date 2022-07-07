require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

let personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: Number,
  favoriteFoods: [String]
})

let Person = mongoose.model('Person', personSchema);

const createAndSavePerson = (done) => {
  let newPerson = new Person({
    name: "Owen", 
    age: 12, 
    favoriteFoods: ["Food B", "Food A"]
  });

  newPerson.save(function(err, data) {
    if (err) {
     return done(err);
    }
    done(null, data);
  });
};

let arrayOfPeople = [
  {name: "Frankie", age: 74, favoriteFoods: ["Del Taco"]},
  {name: "Sol", age: 76, favoriteFoods: ["roast chicken"]},
  {name: "Robert", age: 78, favoriteFoods: ["wine"]}
];

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function (err, data) {
    if (err) {
     return done(err);
    }
    done(null, data);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, function (err, data) {
    if (err) {
     return done(err);
    }
    done(null, data);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, function (err, data) {
    if (err) {
     return done(err);
    }
    done(null, data);
  });
};

const findPersonById = (personId, done) => {
  Person.findById(personId, function (err, data) {
    if (err) {
     return done(err);
    }
    done(null, data);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId, function (err, data) {
    if (err) {
     return done(err);
    }
    data.favoriteFoods.push(foodToAdd);
    data.save(function(err, updatedData) {
      if (err) {
       return done(err);
      }
      done(null, updatedData);
    });
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name: personName}, {$set:{age:ageToSet}}, {new: true}, function (err, data) {
    if (err) {
     return done(err);
    }
    done(null, data);
  });
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, function (err, data) {
    if (err) {
     return done(err);
    }
    done(null, data);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.deleteMany({name:nameToRemove}, function (err, data) {
    if (err) {
     return done(err);
    }
    done(null, data);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({favoriteFoods:foodToSearch}).sort({name : "asc"}).limit(2).select("-age").exec((err, data) => {
     if(err)
       done(err);
    done(null, data);
  });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
