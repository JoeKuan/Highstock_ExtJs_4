// !!! Current workaround, ExtJs 4 store fires datachanged
// event on add, delete, insertion and no way to distinguish what
// operation. loadData fires datachanged instead of load event
// ExtJs 4.1 will have new event
Ext.data.Store.override({
  loadData : function() {
    this.callOverridden(arguments);
    this.fireEvent('load', this);
  }

});

Ext.define('HighCharts.controller.Charts', {
  extend : 'Ext.app.Controller',
  views : ['chart.Tree'],
  models : ['Chart', 'StockPrice'],
  stores : ['ChartsTree'],

  init : function() {

    this.control({

      // Click on the reload button
      '#reload[action=reload]' : {
        click : function() {
          var mainChart = Ext.getCmp('main_chart');
          if(mainChart && mainChart.store) {
            mainChart.store.load();
          }
        }

      },

      // Click on entry in the left tree
      'chartsTree' : {
        itemclick : function(view, model, item) {

          console.log("Call item click");
          var selectedType = model.data.id.toLowerCase();

          if(HighCharts.updateTask) {
            HighCharts.updateTask.cancel();
          }

          // Destroy the current on and load a new one
          var mainChart = Ext.getCmp('main_chart');
          if(mainChart) {
            console.log("Remove main chart");
            var chartStores = mainChart.stores;
            Ext.getCmp('centerpane').remove(mainChart);
            mainChart.destroy();
            /*
             console.log("Removed main chart");
             Ext.each(chartStores, function(store) {
             store.destroy();
             console.log("Destroy store");
             });
             */
          }

          // Generate the highchart config based on the selected type
          // Create the store if not exists
          var hcConfg = null;
          hcConfig = Chart.ux.SampleConfigs.getConfig(selectedType);

          // Store for the chart
          var store = null;
          switch (selectedType) {

            // Single store, two series from different fields
            case 'two_panes':
            // Single store setup to Highstock
            case 'single_line':
            case 'intraday_area':
            case 'intraday_candle':
            case 'flags_marking':
            case 'line_markers':
            case 'spline':
            case 'step':
            case 'area':
            case 'areaspline':
            case 'ohlc':
            case 'column':
            case 'point_markers':
            case 'lines_y_axis':
            case 'bands_y_axis':
            case 'reversed_y_axis':
            case 'styled_scrollbar':
            case 'disabled_scrollbar':
            case 'disabled_navigator':
            case 'flags_placement':
            case 'flags_shapes':

              // Setup the query
              var model_fields = null;
              var query = null;
              if(!hcConfig.stockQuery.fields) {
                model_fields = hcConfig.stockQuery.model_fields;
                query = hcConfig.stockQuery.name + ".json";
              } else {
                // Map from url parameter to store's model fields
                model_fields = HighCharts.model.StockPrice.createFields(hcConfig.stockQuery.fields);
                query = hcConfig.stockQuery.name + "-" + hcConfig.stockQuery.fields + ".json";
              }

              // Create dynamic model and put into the store
              HighCharts.model.StockPrice.modelFactory(selectedType, model_fields);
              store = Ext.create('HighCharts.store.StockPrice', {
                model : selectedType
              });
              store.getProxy().setModel(selectedType);

              // Set the store's url query parameters
              Ext.apply(store.getProxy().extraParams, {
                filename : query
              });
              console.log(store);
              hcConfig.store = store;
              break;

            // Multiple series, create multiple stores and put them to the
            // highstock object
            case 'multi_series':
              var stores = [];
              Ext.each(hcConfig.stockQuery, function(sQuery, index) {

                // Create dynamic model and put into the existing store
                var model_fields = HighCharts.model.StockPrice.createFields(sQuery.fields);
                HighCharts.model.StockPrice.modelFactory('multi_series_' + index, model_fields);
                store = Ext.create('HighCharts.store.StockPrice');
                store.getProxy().setModel('multi_series_' + index);

                // Setup the query
                var query = sQuery.name + "-" + sQuery.fields + ".json";
                if(!sQuery.fields) {
                  query = hcConfig.stockQuery.name + ".json";
                }
                Ext.apply(store.getProxy().extraParams, {
                  filename : query
                });

                this.push(store);

              }, stores);


              hcConfig.stores = stores;
              //console.log(hcConfig.stores);
              break;

            // Single store
            // 52,000 points returned in one massive array
            // The only way (that I can think of) is to use ArrayStore to feed
            case 'data_grouping':
              // Just use a simple array store
              store = Ext.create('Ext.data.ArrayStore', {
                fields : ['temperature'],
                storeId : 'bigArrStore',
              });

              //console.log(store.getProxy());
              hcConfig.store = store;

              // Override the loadStores function to use a dedicate JsonP request
              // to get the
              // very large single array back and then dissect it into the array
              // store
              hcConfig.loadStores = function() {
                Ext.data.JsonP.request({
                  url : 'http://www.highcharts.com/samples/data/jsonp.php?filename=large-dataset.json&callback=?',
                  callback : function(data, result) {
                    if(Ext.isArray(result)) {
                      var bigData = [];
                      Ext.each(result, function(item) {
                        this.push([item]);
                      }, bigData);

                      // Refers to the array store
                      //console.log("Load Bulk data " + bigData.length);
                      this.loadData(bigData);
                    }
                  },

                  scope : store
                });
              };

              break;

            // This example has no JsonP query. It's use auto generated random
            // data
            // So uses an ArrayStore to do that
            case 'dynamic_update':
              // Just use a simple array store
              store = Ext.create('Ext.data.ArrayStore', {
                fields : ['time', 'value'],

                // Auto generated the data - same as the original highstock
                // example
                data : (function() {
                  // generate an array of random data
                  var data = [], time = (new Date()).getTime(), i;
                  for( i = -999; i <= 0; i++) {
                    data.push([time + i * 1000, Math.round(Math.random() * 100)]);
                  }
                  return data;
                })(),
                listeners : {
                  // Once the store is added with new point, setup another
                  // delayed task for the next second
                  add : function(store, records) {
                    if(HighCharts.updateTask) {
                      HighCharts.updateTask.delay(1000);
                    }
                  }

                }
              });

              //console.log(store.getProxy());
              hcConfig.store = store;

              // The store's add event should kick up the chart's onAdd function
              // Setup delay task
              if(HighCharts.updateTask)
                HighCharts.updateTask.cancel();

              HighCharts.updateTask = new Ext.util.DelayedTask(function() {
                // New random data
                var x = (new Date()).getTime(), // current time
                y = Math.round(Math.random() * 100);
                this.add({
                  time : x,
                  value : y
                });
              }, store);


              HighCharts.updateTask.delay(3000);
              break;

          }

          // New chart with config and id
          hcConfig.id = 'main_chart';
          
          // Credit
          hcConfig.chartConfig.credits = {
            href: 'http://joekuan.wordpress.com',
            text: 'Joe Kuan (joekuan.wordpress.com)',
            style: {
              color: '#898989'
            }
          };
          
          mainChart = Ext.widget('highstock', hcConfig);
          Ext.getCmp('centerpane').add(mainChart);
          mainChart.loadStores();

          // Enable all the chart relate buttons
          Ext.getCmp('reload').setDisabled(false);
        }

      }
    });
  }

});
