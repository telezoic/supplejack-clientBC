import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel(transition){
    //VARIABLE DEFINITIONS
    let queryParams = transition.queryParams;
    let validFields = this.controllerFor('search').get('recordValues'); //array of all possible field values
    let regExp = new RegExp(/[`~,.<>;':"/[\]|{}=+\@\!]/,"g"); //regexp that tests a string for reserved characters
    let isInt = new RegExp("^[0-9]+$"); //regexp that tests that a string only contains numbers.
    //FUNCTIONS
    //function for testing if a paramArray item contains an invalid field or reserved character
    let testKeyVal = (key, value)=>{
      let keyVal = value.split(":");
      if (!validFields.includes(keyVal[0]) || regExp.test(keyVal[0]) || regExp.test(keyVal[1])){
        let obj = {};
        obj[key] = queryParams[key].replace(`${keyVal[0]}:${keyVal[1]},`, '');
        this.transitionTo({queryParams:obj});
      }
    };
    //VALIDATIONS FOR QUERY PARAMS
    for (const key in queryParams){
      if (queryParams.hasOwnProperty(key)){
        //special validation rules for serialized params
        if ((key==="and")||(key==="or")||(key==="without")){
          if (typeof queryParams[key] !== "undefined" && queryParams[key].length > 0){
            let paramArray = queryParams[key].split(",").slice(0,-1);
            //test each paramArray item for validity
            for (const value of paramArray){testKeyVal(key, value);}
          }
          //special validation rules for integer params
        } else if (key==="page" || key==="per_page") {
          //get default value from controller
          let defaultVal = this.controllerFor('search').get(`${key}`);
          //if the param contains anything other than numbers...
          if (!isInt.test(queryParams[key])){
            //reset this param to default value and reload.
            let obj = {};
            obj[key] = defaultVal;
            this.transitionTo({queryParams:obj});
          }
        } else { //validations for any other param
          //if the param contains a reserved character...
          if (regExp.test(queryParams[key])){
            //reset this param to be blank and reload.
            let obj = {};
            obj[key] = '';
            this.transitionTo({queryParams:obj});
          }
        }
      }
    }
  },
  model(params){
    //FUNCTIONS
    //function for returning the key from a paramArray item
    let getKey = (value)=>{
      let keyVal = value.split(":");
      return keyVal[0];
    };
    //function for returning the value from a paramArray item
    let getVal = (value)=>{
      let keyVal = value.split(":");
      return keyVal[1];
    };
    //USER EDITABLE PARAMS (from queryParams)
    for (const key in params){
      if (!params.hasOwnProperty(key)) {continue;}
      //removes any params that haven't been assigned a value
      if (params[key] === '' || params[key] === null){
        delete params[key];
      }
      //serializes and/or/without params into params expected by Supplejack
      if ((key === "and")||(key === "or")||(key === "without")){
        if (typeof params[key] !== "undefined" && params[key].length > 0){
          //deserialize param into an array
          let paramArray = params[key].split(",").slice(0,-1);
          //create a set of unique keys among params
          let keySet = new Set();
          for (const value of paramArray){keySet.add(getKey(value));}
          //for each unique key, create an array of all values that belong to said key
          for (const uniqueKey of keySet){
            let array = [];
            for (const value of paramArray){
              if (getKey(value) === uniqueKey) {array.push(getVal(value));}
            }
            //if a unique key has multiple values, send those values as an array
            //if a unique key has one value, send that value as a string
            if (array.length > 1){
              params[`and[${uniqueKey}]`] = array;
            } else {
              params[`and[${uniqueKey}]`] = array[0];
            }
          }
        }
        //delete the original param
        delete params[key];
      }
    }
    //SYSTEM-BASED PARAMS (added here)
    //adds the api key and field set to the params to be sent to the API
    params.api_key = 'apikey';
    params.fields = 'all';
    params.facets_per_page = 100;
    //adds facets to params
    let facets = this.controllerFor('search').get('recordFacets');
    if(facets.length > 0){
      params.facets = facets;
    }
    //MODEL RETURN
    //fetches the model from the API with given params
    return this.get('store').query('record', params);
  },

  queryParams: {
    page: {refreshModel: true},
    text: {refreshModel: true},
    per_page: {refreshModel: true, replace: true},
    //note: using and/or/without because Ember doesn't support dynamically-generated queryParams,
    // and this seems like a better solution than manually generating 3 queryParams for every schema field
    // we can pass serialized objects into these 3 params in ember, and then deserialize them just before
    // passing them to the API.
    and: {refreshModel: true},
    or: {refreshModel: true},
    without: {refreshModel: true}
  }
});
