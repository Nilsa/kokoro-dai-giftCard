/*------------------------------------------------------**
** Primary file for API                 				**
**------------------------------------------------------*/

// Dependencies
const server = require('./server');  


const app = {};

// Init function
app.init = function(){

  // Start the server
  server.init();


};

// Self executing
app.init();

// Export the app
module.exports = app;
