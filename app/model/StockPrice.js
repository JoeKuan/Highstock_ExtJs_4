Ext.define('HighCharts.model.StockPrice', {
  extend : 'Ext.data.Model',
  //fields: [ { name: 'time', mapping: 0}, { name: 'price', mapping: 1}],
  statics : {
    // Convert stock pricing url parameters to into model fields
    // e.g. 'c' for price, 'v' for volume
    createFields : function(urlParamsStr) {
      // The first one should be always time
      var model_fields = [{
        name : 'time',
        mapping : 0
      }];
      // Turn stock url parameter string into an array
      Ext.each(urlParamsStr.split(''), function(item) {
        var index = this.length;
        switch(item) {
          case 'c':
            this.push({
              name : 'price',
              mapping : index
            });
            break;
          case 'v':
            this.push({
              name : 'volume',
              mapping : index
            });
            break;
          case 'o':
            this.push({
              name : 'open',
              mapping : index
            });
            break;
          case 'h':
            this.push({
              name : 'high',
              mapping : index
            });
            break;
          case 'l':
            this.push({
              name : 'low',
              mapping : index
            });
            break;
        }
      }, model_fields);
      return model_fields;
    },
    // Generate a model dynamically, provide fields
    modelFactory : function(name, fields) {
      return Ext.define(name, {
        extend : 'Ext.data.Model',
        fields : fields
      });
    }
  }

});
