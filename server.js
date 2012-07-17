require('console-trace')({ always: true, right: true, colors: true });

var ApiServer = require("apiserver"),
    ApiModules = require("./lib/api_modules"),
    routes = require('./config/routes.json'),
    jsonRequest = require("request"),
    colors = require('colors');

var apiServer = new ApiServer({
    timeout: 1000,
    domain: 'localhost'
});


var offenderModule = {
    test: function (request, response) {
        response.writeHead(200, {
            'content-type': 'application/xml'
        });
        var names =
                [
                    {
                        Last: 'Simpson',
                        First: 'Bart'
                    },
                    {
                        Last: 'Last',
                        First: 'First'
                    }
                ];

        for(var i = 0, len = names.length; i<len; ++i) {
            var name = names[i];
            console.info(name.Last + ', ' + name.First + '\n'.red);
        }
        var text = '<?xml version="1.0" encoding="utf-8"?>' +
        '<ArrayOfName xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">' +
            '<Name>' +
                '<Last>Simpson</Last>' +
                '<First>Bart</First>' +
                '<PersonId>845107</PersonId>' +
                '<DateEntered>2003-04-10T21:08:25.016</DateEntered>' +
                '<OwnerAgency>VCPA</OwnerAgency>' +
                '<AliasType>4</AliasType>' +
                '<Middle/>' +
                '<Soundex>S512</Soundex>' +
                '<BirthDate>2002-03-29T00:00:00</BirthDate>' +
                '<ExtraName/>' +
                '<Title/>' +
                '<Suffix/>' +
                '<DateInvalid xsi:nil="true"/>' +
                '<UserId>5347</UserId>' +
                '<DateUpdated>2012-03-29T19:49:41.486</DateUpdated>' +
                '<TransactionOrigin>16</TransactionOrigin>' +
                '<Description/>' +
                '<Source xsi:nil="true"/>' +
                '<FirstLast>Bart Simpson</FirstLast>' +
                '<LastFirst>Simpson,  Bart</LastFirst>' +
                '<Age>10</Age>' +
                '<IsPrimary>false</IsPrimary>' +
            '</Name>' +
        '</ArrayOfName>';
        /*
        var text = '<?xml version="1.0" encoding="utf-8"?>' +
            '<ArrayOfName xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">' +
            '<name><Last>Test</Last></name>' +
            '</ArrayOfName>';
        */
        response.end(text);
    }
};

apiServer.addModule('1', 'offenders', offenderModule);

apiServer.router.addRoutes(routes);

apiServer.listen(8080, function () {
    console.info(' ✈ ApiServer listening at http://localhost:8080\n'.green)
});
