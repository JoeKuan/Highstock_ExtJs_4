Ext.Loader.setConfig({
  enabled : true,
  disableCaching : false, // For debug only
  paths : {
    'Chart' : 'Chart'
  }
});

Ext.require('Chart.ux.HighStock');

Ext.application({
  name : 'HighStock',
  launch : function() {

    Ext.define('StockData', {
      extend : 'Ext.data.Model',
      fields : [{
        name : 'time',
        mapping : 0
      }, {
        name : 'price',
        mapping : 1
      }]
    });

    // Use JSONP store for
    // http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?
    var store = Ext.create('Ext.data.Store', {
      model : 'StockData',
      proxy : {
        type : 'jsonp',
        url : 'http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json',
        reader : {
          type : 'array'
        }
      },
      autoLoad : false
    });

    var win = Ext.create('Ext.Window', {
      width : 800,
      height : 600,
      minHeight : 400,
      minWidth : 550,
      hidden : false,
      shadow : false,
      maximizable : true,
      title : 'Highstock example',
      renderTo : Ext.getBody(),
      layout : 'fit',
      tbar : [{
        text : 'Reload Data',
        handler : function() {
          store.load();
        }

      }],
      items : [{
        xtype : 'highstock',
        id : 'chart',
        series : [{
          name : 'AAPL',
          tooltip : {
            yDecimals : 2
          },
          xField : 'time',
          yField : 'price',
        }],
        height : 500,
        width : 700,
        store : store,
        chartConfig : {
          chart : {
            marginLeft : 50,
            marginRight : 50
          },
          credits : {
            href : 'http://joekuan.wordpress.com',
            text : 'Joe Kuan (joekuan.wordpress.com)',
            style : {
              color : '#898989'
            }
          },
          rangeSelector : {
            selected : 1
          },
          title : {
            text : 'AAPL Stock Price'
          }
        }
      }]
    });
    win.show();
    store.load();
  }

});
