Ext.Loader.setConfig({
  enabled : true,
  disableCaching : true, // For debug only
  paths : {
    'Chart' : 'Chart'
  }
});

Ext.require('Chart.ux.HighStock');
Ext.require('Chart.ux.SampleConfigs');

Ext.application({
  name : 'HighCharts',
  appFolder : 'app',
  controllers : ['Charts'],

  launch : function() {

    Ext.create('Ext.container.Viewport', {
      layout : 'border',
      border : '5 5 5 5',
      id: 'viewport',
      items : [{
        region : 'north',
        html : '<h1 class="x-panel-header">HighStock examples</h1>',
        autoHeight : true,
        border : false,
        margins : '0 0 5 0'
      }, {
        region : 'west',
        width : 250,
        title : 'Charts',
        id: 'leftTree',
        xtype : 'chartsTree',
        margins : '0 5 5 5'
      }, {
        region : 'center',
        id : 'centerpane',
        xtype : 'panel',
        layout : 'fit',
        margins : '0 5 5 0',
        tbar : [{
          text : 'Reload Data',
          id : 'reload',
          disabled : true,
          action: 'reload'
        }]
      }]
    });

  }
});
