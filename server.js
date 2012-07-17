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


apiServer.addModule('1', 'offenders', new ApiModules.Offenders({}));

apiServer.router.addRoutes(routes);

apiServer.listen(8080, function () {
    console.info(' ✈ ApiServer listening at http://localhost:8080\n'.green)
});
