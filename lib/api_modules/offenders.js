var names = require("./offenders.json");
var libxmljs = require("libxmljs");
var faker = require('Faker');

var Offenders = module.exports = function (options) {
  var self = this;
  options = (options !== null && options !== undefined && options.constructor === Object) ? options : {};
  Object.keys(options).forEach(function (key) {
    if (!self.__proto__.hasOwnProperty(key)) {
      self[key] = options[key];
    }
  });
};

Offenders.prototype.test = {
  get:function (request, response) {
    var self = this;
    response.writeHead(200, {
      'content-type':'application/xml'
    });

    var doc = libxmljs.Document();
    var root = doc.node('ArrayOfName');

    for (var i = 0, len = names.length; i < len; ++i) {
      var name = names[i];
      self._generateXml(name, root);

    }

    var text = doc.toString();
    response.end(text);
  }


};

Offenders.prototype.generate = {
  get:function (request, response) {
    var self = this;

    var fs = require('fs');
    var people = [];
    for(var i = 0; i<20; ++i){


      var person = {};

      var date = new Date();
      person.First = faker.Name.firstName();
      person.Last = faker.Name.lastName();
      person.PersonId = faker.Helpers.randomNumber(2000000);
      person.DateEntered = self._generateDate(date);
      person.AliasType = faker.Helpers.randomNumber(10);
      person.Middle = "";
      person.BirthDate = self._generateDate(date);
      person.ExtraName = "";
      person.Title = "";
      person.Suffix = "";
      person.DateInvalid = "";
      person.UserId = faker.Helpers.randomNumber(10000);
      person.DateUpdated = self._generateDate(date);
      person.TransactionOrigin = faker.Helpers.randomNumber(100);
      person.Description = "";
      person.Source = true;
      person.FirstLast = person.First + ' ' + person.Last;
      person.LastFirst = person.Last + ', ' + person.First;
      person.Age = self._getAge(person.BirthDate);
      person.IsPrimary = true;

      people.push(person);


    }

    names = people;
    fs.writeFile('./lib/api_modules/offenders.json', JSON.stringify(people), 'utf-8');
    response.serveJSON({success: true, offenders: people});
    console.info('generated offenders\n'.green);
  }
};

Offenders.prototype._generateXml = function (name, root) {
  var elem = root.node('Name');
  for(var key in name){
    elem.node(key, name[key].toString());
  }
};


Offenders.prototype._generateDate = function (date) {
      var range = 365 * 10;
      var offset = faker.Helpers.randomNumber(range);
      var day = date.getDate();

      date.setDate(day - offset);

      return date.toISOString();
};

Offenders.prototype._getAge = function (dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  console.info(age);
  return age;
};