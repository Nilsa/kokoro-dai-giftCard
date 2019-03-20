/*------------------------------------------------------**
** Dependencies - Helpers                               **
**------------------------------------------------------*/
const helpers = require('../helpers/index');


/*------------------------------------------------------**
** Class Rule                                           **
**------------------------------------------------------*/
class Rule{
  constructor(clientId, amount, discount, expirationDate, ruleId){
    this.clientId = helpers.isNotEmptyString(clientId) ? clientId.trim() : false;
    this.amount = helpers.isNotEmptyString(amount) ? amount.trim() : false;
    this.discount = helpers.isNotEmptyString(discount) ? discount.trim() : false;    
    this.expirationDate = helpers.isNotEmptyString(expirationDate) ? expirationDate.trim() : false;
    this.ruleId = helpers.isNotEmptyString(ruleId) ? ruleId.trim() : false;

  }


 
  hasRequiredProperties(){
    return this.clientId && this.amount && this.discount && this.expirationDate && this.ruleId;
  }

  static getAvailableMethods(){
    return ['post','get','put','delete']
  }

  static getAvailableActions(){
    return ['getAll','getOne','update','delete'];
  }

  static getDataSource(){
    return 'Rules';
  }

}

// Export the Rule Model
module.exports = Rule;