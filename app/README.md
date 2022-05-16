# Prototype app

This prototype is built using the [Express](https://expressjs.com/) web framework, written in JavaScript and hosted within the [Node.js](https://nodejs.org/en/) runtime environment.

The prototype uses a modular structure:

- `routes.js` - routes to forward the supported requests (and any information encoded in request URLs) to the appropriate controller functions
- Models - manages the data structure and business logic
- Views - templates used by the controllers to render the data
- Controllers - contains functions to get the requested data from the models, create an HTML page displaying the data, and return it to the user to view in the browser
