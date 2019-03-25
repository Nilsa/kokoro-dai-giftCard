/*------------------------------------------------------**
** Dependencies - Helpers                               **
**------------------------------------------------------*/
const helpers = require('../helpers/index');


/*------------------------------------------------------**
** Class Rule                                           **
**------------------------------------------------------*/
class Rule{
  constructor(clientId, amount, discount, expirationDate){
    this.clientId = helpers.isNotEmptyString(clientId) ? clientId.trim() : false;
    this.amount = helpers.isNotEmptyString(amount) ? amount.trim() : false;
    this.discount = helpers.isNotEmptyString(discount) ? discount.trim() : false;    
    this.expirationDate = helpers.isNotEmptyString(expirationDate) ? expirationDate.trim() : false;
   

  }

  setId(){
    this.ruleId = helpers.createRandomString(10);
    // return helpers.createRandomString("UnaPalabra");
  }
 
  hasRequiredProperties(){
    return this.clientId && this.amount && this.discount && this.expirationDate;
  }

  static getAvailableMethods(){
    return ['post','get','put','delete']
  }

  static getAvailableActions(){
    return ['getAll','getOne','update','delete'];
  }

  static getDataSource(){
    return 'rules';
  }

}

// Export the Rule Model
module.exports = Rule;