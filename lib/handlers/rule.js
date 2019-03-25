/*--------------------------------------------------------------**
** Dependencies - Controllers                                   **
**--------------------------------------------------------------*/
let _userCtrl = require('../controllers/user');
let _tokenCtrl = require('../controllers/token');
let _ruleCtrl = require('../controllers/rule');
//let _giftCtrl = require('../controllers/gift');

/*--------------------------------------------------------------**
** Define the users handlers                                    **
/*--------------------------------------------------------------*/
const ruleHandlers = {  
  handlers: function(req,callback){    
    if(_ruleCtrl.getAvailableMethods(req.method)){ 
      let data = (req.method !== "get") ? JSON.parse(req.payload) : req.queryStringObject;  

      // Send data, headers and callback function to available user's methods    
      _rules[req.method](data, req.headers, callback);      
    } else
      callback(405);
  }
};

// Container for all the users methods
_rules  = {};

/*--------------------------------------------------------------**
** Handler for creating a new user                              **
/*--------------------------------------------------------------**
* @param {Object} data: user data                               **
**--------------------------------------------------------------*/
_rules.post = function(data, headers, callback){
   
     if (data.amount){//si ya tiene como requerido en el model rule , pq sirve ?      rule controllers linea 74   
        _ruleCtrl.create(data,callback);
      }
      else {
        callback(true, {message: "You cannot create a rulr sending data without a monto property"})
      }
};

/*--------------------------------------------------------------**
** Handler for getting data for one or more users               **
** A token valid is needed for this action                      **
/*--------------------------------------------------------------**
* @param {Object} data: Info about the request Object           **
*   - data.id: user's id (optional)                             **
*   - headers: the headers contain the user token               **
**--------------------------------------------------------------*/
_rules.get = function(data, headers, callback){
 
  // Checking the queryStringObject for the user token
  let token = headers.token && typeof(headers.token) == 'string' ? headers.token.trim() : false;

  if(!token){
    callback(true, {message: "Access denied: you need a valid token for this action"});  
    return
  }
   
  // Verify the user token
  _tokenCtrl.verifyToken(token, function(err, tokenData){
    
    if(!err && tokenData){
      // Get the user id, if any 
      let id = typeof(data.id) == 'string' ? data.id.trim() : false; 
      
      //if(id && _ruleCtrl.pertenece(tokenData.username))
      if(id )
        // Getting data of a particular user
        _ruleCtrl.getOne(id, callback);
      else{
        if(id)
          callback(true,{message: 'Only the user data owner can get its record.'})  
        else
          // Getting the users collection
          _ruleCtrl.getAll(data, callback);         
      }
    }else{
      callback(403, err);      
    }
   });  
};

/*--------------------------------------------------------------**
** Handler for updating a user                                  **
** A valid token is nedeed for this action                      **
/*--------------------------------------------------------------**
* @param {Object} data: user data                               **
* @param {Object} headers                                       **
*   - {String} headers.token: user's token                      **
**--------------------------------------------------------------*/
_rules.put = function(data, headers, callback){
  let token = headers.token && typeof(headers.token) == 'string' ? headers.token.trim() : false;

  if(!token){
    callback(true, {message: "Access denied: you need a valid token for this action"});
    return
  }
  
  if(!data.username){
    callback(true, {message: "Missing field id for update the user"})
    return    
  }

  _tokenCtrl.verifyToken(token, function(err, tokenData){
    if(!err && tokenData){
      if(tokenData.username == data.username)
        _ruleCtrl.update(data, callback);
      else
        callback(true,{message: 'Only the user data owner can update its record.'})  
    }else
      // Send token error
      callback(true, err);
  });    
};

/*--------------------------------------------------------------**
** Handler for deleting a user                                  **
** A valid token is nedeed for this action                      **
/*--------------------------------------------------------------**
* @param {Object} data: Info about the request Object           **
*   - data.queryStringObject.id: user's id (required)           **
* @param {Object} headers                                       **
    - {String} headers.token: user's token                      **
**--------------------------------------------------------------*/
_rules.delete = function(data, headers, callback){
  // Check that phone number is valid
  let id = typeof(data.username) == 'string' ? data.username.trim() : false;
  let token = headers.token && typeof(headers.token) == 'string' ? headers.token.trim() : false;

  if(!token){
    callback(403, {message: "Access denied: you need a valid token for this action"});
    return
  }

  if(!id){
    callback(406,{'Error' : "Missing id: the user's id is required"});
    return
  }

  _tokenCtrl.verifyToken(token, function(err, tokenData){    
    if(!err && tokenData){
      if(tokenData.username == id){
        _userCtrl.getOne(id, function(err, userData){
          if(!err && userData){
            _ruleCtrl.delete(data.ruleId);
          }else
            callback(404, {message: `The user with the id ${id} doesn't exist.`})
        });        
      }else
        callback(403,{message: 'Only the user data owner can delete its record.'})     
    }else
      // Send token error
      callback(403, {message: "Access denied: you need a valid token for this action"});
  });    
};

module.exports = ruleHandlers;