/*------------------------------------------------------**
** Dependencies - Models & Data                         **
**------------------------------------------------------*/
let _Rule = require('../models/rule');
let _store = require('../controllers/data');
const helpers = require('../helpers/index');

const ruleCtrl = {};

ruleCtrl.getAvailableMethods = function(method){
  return _Rule.getAvailableMethods().indexOf(method) > -1;
}

/*------------------------------------------------------**
** Get all rules                                        **
**------------------------------------------------------**
* @param {String} clientId: clients's id   

**------------------------------------------------------*/
ruleCtrl.getAll = function(filters, callback){
  let rules = []
  let ruleDataSource = _Rule.getDataSource();
  _store.list(ruleDataSource, function(err, rulesFiles){
    if(!err){
      if(rulesFiles.length == 0)   
        callback(false, rules);
      else{
        for ( let i = 0, length = rulesFiles.length - 1; i <= length; i++) {
          _store.read(ruleDataSource, rulesFiles[i], function(err, rule){
            if(!err){
                if(filters.clientId==rule.clientId){
                    rules.push(rule);
                }
              if(i == length)
                callback(false, rules);
            }
          });
        }
      }
    }else
      callback(err);    
  });
};

/*------------------------------------------------------**
** Getting data for one user by id                      **
**------------------------------------------------------**
* @param {String} ruleId: rules's id                         **
**------------------------------------------------------*/
ruleCtrl.getOne = function(id, callback){    
  _store.read(_Rule.getDataSource(), id, function(err, rule){
    if(err)
      callback({message: "The rule doesn't exist"});
    else{      
      callback(false, rule);
    }
  });  
};

/*------------------------------------------------------**
** Creating a user                                      **
**------------------------------------------------------**
* @param {Object} data: Info about the request Object   **
*   - data.payload: user data for creating              **
*     - firstName, lastName, username, password, role   **
*       are required                                    **
**------------------------------------------------------*/
ruleCtrl.create = function(ruleData, callback){
  // Set user data and check for required field

  
  let rule = new _Rule(ruleData.clientId,ruleData.amount,ruleData.discount,ruleData.expirationDate)

   if(rule.hasRequiredProperties()){  
      rule.setId();   
    _store.create(_Rule.getDataSource(), rule.ruleId, rule, function(err){
      if(!err)
        callback(false,{message : `The new rule ${rule.ruleId} was created`});
      else 
        callback(err);
    });          
  }else
    callback(true,{'message' : 'Missing data for create the rule.'});
};

/*------------------------------------------------------**
** Updating a user                                      **
**------------------------------------------------------**
* @param {Object} data: Info about the request Object   **
*   - data.payload: user data for creating              **
*     - firstName, lastName, username, password, role   **
*       are optional                                    **
*     - id is required                                  **
**------------------------------------------------------*/
ruleCtrl.update = function(userData, callback){      
  // Get the user and update
  this.getOne(userData.username, function (err, user) {
    if(!err){      
      let editedUser = { ...user,  ...userData };
      if(editedUser._method)
        delete editedUser._method;
      
      if(userData.password && userData.password.length<24)
        editedUser.password = helpers.hash(userData.password)
      
      _store.update(_Rule.getDataSource(), user.username, editedUser, function(err){
        if(!err)
          callback(false, {'message': `The user ${user.username} was updated`});    
        else
          callback(err);
      });      
    }
    else
      callback(404,{'message' : 'The user does not exist'});
  });  
};

/*------------------------------------------------------**
** Handler for deleting a user                          **
**------------------------------------------------------**
* @param {String} id: user's id (required)              **
**------------------------------------------------------*/
ruleCtrl.delete = function(id,callback){
  this.getOne(id, function(err){        
    if(err)
      callback(true, err);
    else{
      _store.delete(_Rule.getDataSource(), id, function(err){
        if(!err)
          callback(false, {message: `The user ${id} was deleted`});
        else
          callback(true, {message: `Error when trying to delete the user ${id}`})
      });
    }
  });  
};

// Export the handlers for rules
module.exports = ruleCtrl;