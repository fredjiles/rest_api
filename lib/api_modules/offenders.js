var names = require("./offenders.json");
var faker = require('Faker');
var mu = require("mu2");
mu.root = __dirname + "/templates";

var Offenders = module.exports = function (options) {
  var self = this;
  options = (options !== null && options !== undefined && options.constructor === Object) ? options : {};
  Object.keys(options).forEach(function (key) {
    if (!self.__proto__.hasOwnProperty(key)) {
      self[key] = options[key];
    }
  });
};

Offenders.prototype.clients = {
  get:function (request, response) {
    var self = this;
    response.writeHead(200, {
      'content-type':'application/xml'
    });

    var people = [];
    Object.keys(names).forEach(function(key) {
      people.push(names[key]);
    });

    var data = {'people': people};
    var text = "";
    mu.compileAndRender('search.handlebars', data)
      .on('data', function(data) {
        console.log('Search Performed'.green);
        text += data.toString();
      })
      .on('end', function() {
        response.end(text);
      });

  }


};


Offenders.prototype.client = {
  get:function (request, response) {
    var personId = Number(request.querystring.PersonId);
    var self = this;
    response.writeHead(200, {
      'content-type':'application/xml'
    });


    var data = names[personId];
    data.names = [];
    data.names.push(data);
    data.activeCase = data.cases[0];

    var text = "";
    mu.compileAndRender('details.handlebars', data)
      .on('data', function(data) {
        text += data.toString();
      })
      .on('end', function() {
        response.end(text);
      });

  }


};

Offenders.prototype.cases = {
  get:function (request, response) {
    var personId = Number(request.querystring.PersonId);
    var self = this;
    response.writeHead(200, {
      'content-type':'application/xml'
    });


    var data = names[personId];
    data.names = [];
    data.names.push(data);
    data.activeCase = data.cases[0];


    var text = "";
    mu.compileAndRender('clientCases.handlebars', data)
      .on('data', function(data) {
        text += data.toString();
      })
      .on('end', function() {
        response.end(text);
      });

  }


};
Offenders.prototype.generate = {
  get:function (request, response) {
    var self = this;

    var fs = require('fs');
    var people = {};
    for(var i = 0; i < 20; ++i){

      var person = self._generateOffender();

      people[person.PersonId] = person;


    }

    names = people;
    fs.writeFile('./lib/api_modules/offenders.json', JSON.stringify(people, null, '\t'), 'utf-8');
    response.serveJSON({success: true, offenders: people});
    console.info('generated offenders\n'.green);
  }
};


Offenders.prototype._generateDate = function (date, diff) {
      var range = 365 * (diff);
      var offset = faker.Helpers.randomNumber(range);
      var day = date.getDate();

      date.setDate(day + offset);

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
  return age;
};

Offenders.prototype._generateOffender = function() {

  var self = this;
  var person = {};

  var date = new Date();
  person.First = faker.Name.firstName();
  person.Last = faker.Name.lastName();
  person.PersonId = faker.Helpers.randomNumber(2000000);
  person.DateEntered = self._generateDate(date, -10);
  person.AliasType = faker.Helpers.randomNumber(10);
  person.Middle = "";
  person.BirthDate = self._generateDate(date, -10);
  person.ExtraName = "";
  person.Title = "";
  person.Suffix = "";
  person.DateInvalid = "";
  person.UserId = faker.Helpers.randomNumber(10000);
  person.DateUpdated = self._generateDate(date, -8);
  person.TransactionOrigin = faker.Helpers.randomNumber(100);
  person.Description = "";
  person.Source = true;
  person.FirstLast = person.First + ' ' + person.Last;
  person.LastFirst = person.Last + ', ' + person.First;
  person.Age = self._getAge(person.BirthDate);
  person.IsPrimary = true;

  person.cases = [];

  // make sure we have at least one and no more than 10
  for(var i = 0, len = faker.Helpers.randomNumber(10) + 1; i < len; i++) {
    var c = self._generateCase(person);
    person.cases.push(c);
  }
  return person;
};

Offenders.prototype._generateCase = function(person) {
  var self = this;

  var date = new Date();

  var offenderCase = {
    "CaseId": faker.Helpers.randomNumber(1000000000),
    "PersonId": person.PersonId,
    "DateNameEntered": person.DateEntered,
    "Access": faker.Helpers.randomNumber(100),
    "StatusDate": self._generateDate(new Date(), -1),
    "DispositionDate": self._generateDate(date, -5),
    "Stage": faker.Helpers.randomNumber(100),
    "StageDate": self._generateDate(date, -.1),
    "DateDemoRecorded": self._generateDate(date, -.1),
    "CourtLocation": faker.Helpers.randomNumber(1000),
    "Juvenile": 0,
    "UserId": faker.Helpers.randomNumber(20000),
    "DateUpdated": self._generateDate(date, 1),
    "TransactionOrigin": faker.Helpers.randomNumber(100),
    "PublicCaseId": faker.Helpers.randomNumber(5000000000),
    "AddressId": faker.Helpers.randomNumber(10000000),
    "AgencyLocation": "COV",
    "IndexEnteredDate": self._generateDate(date, -10),
    "Index": faker.Helpers.randomNumber(100),
    "DateOriginalViolation": self._generateDate(new Date(), -10 ),
    "Jurisdiction": null
  };

  offenderCase.DisplayName = person.Last + ', ' + person.First;
  offenderCase.PrimaryDefendant= 1;
  offenderCase.DateFiled = offenderCase.DateOriginalViolation;
  offenderCase.OriginalDispositionDate = offenderCase.DispositionDate;
  offenderCase.OriginalDisposition = offenderCase.Disposition;
  offenderCase.DateSentenced = "2011-12-22T15:51:25.94";
  offenderCase.StatusCode = self._generateStatusCode();
  offenderCase.DispositionCode = self._generateDispositionCode();
  offenderCase.OffenseLevelCode = self._generateOffenseLevelCode();

  console.info(offenderCase);
  return offenderCase;
};

Offenders.prototype._generateStatusCode = function() {

  var codes = [
    {"id": 16408, "value": "DSCHCT", "description": "Discharged by Court"},
    {"id": 18417, "value": "REL", "description": "Released"},
    {"id": 15037, "value": "DSCHSHER", "description": "Discharged from Sheriff"},
    {"id": 15051, "value": "ONPROB", "description": "On Probation"},
    {"id": 15031, "value": "CUSTVCJ", "description": "In Custody Ventura County Jail"},
    {"id": 170, "value": "CR", "description": "Cited and Released"}
  ];

  var code = faker.Helpers.randomNumber(codes.length);
  var statusCode = {
    "id": codes[code].id,
    "table": "DEFSTS",
    "value": codes[code].value,
    "dateInvalid": null,
    "description": codes[code].description

    };

  return statusCode;
};

Offenders.prototype._generateDispositionCode = function() {


  var codes = [
    {"id": 1016, "value": "DEFDSP", "description": "Dismissed"},
    {"id": 16405, "value": "OPEN", "description": "Open"},
    {"id": 1019, "value": "CTCN", "description": "Convicted"},
    {"id": 20064, "value": "CREREJ", "description": "Rejected"},
    {"id": 15620, "value": "DSCH", "description": "Discharged"},
    {"id": 15621, "value": "CLOSED", "description": "Closed"}
  ];

  var code = faker.Helpers.randomNumber(codes.length);
  var statusCode = {
    "id": codes[code].id,
    "table": "DEFDSP",
    "value": codes[code].value,
    "dateInvalid": null,
    "description": codes[code].description

    };

  return statusCode;
};
Offenders.prototype._generateOffenseLevelCode = function() {


  var codes = [
    {"id": 16754, "value": "F", "description": "Felony"},
    {"id": 16756, "value": "M", "description": "Misdemeanor"},
    {"id": 16755, "value": "I", "description": "Infraction"}
  ];

  var code = faker.Helpers.randomNumber(codes.length);
  var statusCode = {
    "id": codes[code].id,
    "table": "OFFLEV",
    "value": codes[code].value,
    "dateInvalid": null,
    "description": codes[code].description

    };

  return statusCode;
};
