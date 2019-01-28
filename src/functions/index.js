var functions = require('firebase-functions');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var { routes } = require('./routes');


var app = express();

var headers1 = 'Origin, X-Requested-With, Content-Type, Accept';
var headers2 = 'Authorization, Access-Control-Allow-Credentials, x-access-token';

var corsOptionsDelegate = (req, callback) => {
    let corsOptions = { origin: true };
    callback(null, corsOptions);
};

var router = express.Router();
routes(router);

// setup body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Allow CORS to be parsed to the API and reduce cors issues as a result of having different request origin.
// Set different request methods that should be allowed to pass through when making a request.
// This serves as a middleware and allows request headers to be intepreted and accepted during the request/response cycle.
var clientHeaderOrigin = process.env.CLIENT_URL;
app.use(cors(corsOptionsDelegate));
app.use((req, res, next) => {
    const origin = req.headers.origin;
    res.header('Access-Control-Allow-Origin', clientHeaderOrigin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, OPTIONS, PUT');
    res.header('Access-Control-Allow-Headers', `${headers1},${headers2}`);
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Add API Routes 
app.use('/v1', router);

// Mount app to use firebase functions to serve requesst and response.
var api = functions.https.onRequest((request, response) => {
    if (!request.path) {
        request.url = `/${request.url}`
    }
    return app(request, response)
});

module.exports = { api }