/**
 * @class Ext.ux.HighStock.Serie
 * Series class for the highcharts widget.
 * @constructor
 */
Ext.define('Chart.ux.HighStockSerie', {

  type : null,

  /**
   * The field used to access the x-axis value from the items from the data source.
   *
   * @property xField
   * @type String
   */
  xField : null,

  /**
   * The field used to access the y-axis value from the items from the data source.
   *
   * @property yField
   * @type String
   */
  yField : null,

  /**
   * The field used to hide the serie initial. Defaults to true.
   *
   * @property visible
   * @type boolean
   */
  visible : true,

  clear : Ext.emptyFn,

  getData : function(record) {
    var yField = this.yField || this.dataIndex, xField = this.xField, point = {
      data : record.data,
      y : record.data[yField]
    };
    if(xField)
      point.x = record.data[xField];
    //console.log("x " + point.x + ", y " + point.y);
    return [ point.x, point.y ];
  },
  
  serieCls : true,

  constructor : function(config) {
    config.type = this.type;
    if(!config.data) {
      config.data = [];
    }
    Ext.apply(this, config);
    this.config = config;
  }
});
