
// =================================================================
// get the packages we need ========================================
// =================================================================
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

// =======================
// configuration =========
// =======================
const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 8080;

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// app.use(bodyParser.json({ type: 'application/json' }));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(require('./app/middleware/headers'));

// use morgan to log requests to the console
app.use(morgan('dev'));

// app.use(express.static('./public'));

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------

const apiRoutes = express.Router();

apiRoutes.use('/landmarks', require('./route/google'));
apiRoutes.use('/details', require('./route/details'));

app.use('/api', apiRoutes);

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
