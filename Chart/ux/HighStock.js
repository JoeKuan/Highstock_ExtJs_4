/**
 * @author Joe Kuan
 * @email kuan.joe@gmail.com
 * @version 1.0
 * @date 8 May 2012
 *
 * You are not permitted to remove the author section from this file.
 */

if(!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(elt /*, from*/) {
    var len = this.length;

    var from = Number(arguments[1]) || 0;
    from = (from < 0) ? Math.ceil(from) : Math.floor(from);
    if(from < 0)
      from += len;

    for(; from < len; from++) {
      if( from in this && this[from] === elt)
        return from;
    }
    return -1;
  };
}

var logObj = function(obj, opt) {
  var msg = '';
  if(opt && opt.nameOnly) {
    for(var i in obj) {
      msg += i + ', ';
    }
    //console.log(msg);
  } else {
    for(var i in obj) {
      msg += i + ': ' + obj[i];
    }
    if(Ext.isObject(obj[i]))
      logObj(obj[i]);
  }

  if(opt && opt.header) {
    msg = opt.header + ': ' + msg;
  }
  //console.log(msg);
};

Ext.define("Chart.ux.HighStock", {
  extend : 'Ext.Component',
  alias : ['widget.highstock'],

  /**
   * @cfg {Array} array of store
   * Set the list of stores for the multiple series.
   */
  stores : [],

  /**
   * @cfg {Object} defaultSerieType
   * Sets styles for this chart. This contains default styling, so modifying this property will <b>override</b>
   * the built in styles of the chart. Use {@link #extraStyle} to add customizations to the default styling.
   */
  defaultSerieType : null,

  /**
   * @cfg {Boolean} resizable
   * True to allow resizing, false to disable resizing (defaults to true).
   */
  resizable : true,

  /**
   * @cfg {Integer} updateDelay
   * (defaults to 0)
   */
  updateDelay : 0,

  /**
   * @cfg {Object} loadMask An {@link Ext.LoadMask} config or true to mask the chart while
   * loading. Defaults to false.
   */
  loadMask : false,

  // Create getter and setter function
  config : {
    title : '',
    subTitle : ''
  },

  initComponent : function() {
    // If only store is defined and not this.stores, then
    // put into the list
    if((!this.stores || !this.stores.length) && (this.store)) {
      this.stores = [this.store];
    }

    // If this.stores is defined, then ignore this.store even is defined
    if(this.stores.length) {
      for(var i = 0; i < this.stores.length; i++) {
        this.stores[i] = Ext.data.StoreManager.lookup(this.stores[i]);
      }
    }

    this.callParent(arguments);
  },
  /**
   * Add one or more series to the chart
   * @param {Array} series An array of series
   * @param {Boolean} append the serie. Defaults to true
   */
  addSeries : function(series, append) {
    append = (append == null) ? true : false;
    var n = new Array(), c = new Array(), cls, serieObject;
    // Add empty data to the serie or just leave it normal. Bug in HighStocks?
    for(var i = 0; i < series.length; i++) {
      var serie = Ext.clone(series[i]);
      var cls = "Chart.ux.HighStockSerie";
      serieObject = Ext.create(cls, serie);

      c.push(serieObject.config);
      n.push(serieObject);
    }

    // Show in chart
    if(this.chart) {
      if(!append) {
        this.removeAllSeries();
        this.series = n;
        this.chartConfig.series = c;
      } else {
        this.chartConfig.series = this.chartConfig.series ? this.chartConfig.series.concat(c) : c;
        this.series = this.series ? this.series.concat(n) : n;
      }
      for(var i = 0; i < c.length; i++) {
        this.chart.addSeries(c[i], true);
      }
      this.refresh();

      // Set the data in the config.
    } else {

      if(append) {
        this.chartConfig.series = this.chartConfig.series ? this.chartConfig.series.concat(c) : c;
        this.series = this.series ? this.series.concat(n) : n;
      } else {
        this.chartConfig.series = c;
        this.series = n;
      }
    }
  },
  /**
   *
   */
  removeSerie : function(id, redraw) {
    redraw = redraw || true;
    if(this.chart) {
      this.chart.series[id].remove(redraw);
      this.chartConfig.series.splice(id, 1);
    }
    this.series.splice(id, 1);
  },
  /**
   * Remove all series
   */
  removeAllSeries : function() {
    var sc = this.series.length;
    for(var i = 0; i < sc; i++) {
      this.removeSerie(0);
    }
  },
  /**
   * Set the title of the chart
   * @param {String} title Text to set the subtitle
   */
  setTitle : function(title) {
    if(this.chartConfig.title)
      this.chartConfig.title.text = title;
    else
      this.chartConfig.title = {
        text : title
      };
    if(this.chart && this.chart.container)
      this.draw();
  },
  /**
   * Set the subtitle of the chart
   * @param {String} title Text to set the subtitle
   */
  setSubTitle : function(title) {
    if(this.chartConfig.subtitle)
      this.chartConfig.subtitle.text = title;
    else
      this.chartConfig.subtitle = {
        text : title
      };
    if(this.chart && this.chart.container)
      this.draw();
  },
  initEvents : function() {
    if(this.loadMask) {
      this.loadMask = new Ext.LoadMask(this.el, Ext.apply({
        stores : this.stores
      }, this.loadMask));
    }
  },
  afterRender : function() {

    if(this.stores) {
      Ext.each(this.stores, function(store, index) {
        this.bindSeriesStore(index, store, true);
      }, this);
      //this.bindStore(this.store, true);
    }

    Chart.ux.HighStock.superclass.afterRender.call(this);

    this.bindComponent(true);

    // Use Ext.apply insteadof Ext.applyIf
    Ext.apply(this.chartConfig.chart, {
      renderTo : this.el.dom
    });

    Ext.applyIf(this.chartConfig, {
      xAxis : [{}]
    });

    if(this.xField && this.store) {
      this.updatexAxisData();
    }

    if(this.series) {
      this.addSeries(this.series, false);
    } else
      this.series = [];

    this.initEvents();

    // Make a delayed call to update the chart.
    //this.update(500);
    // The store(s) will be loaded and then call this.draw
  },
  onMove : function() {

  },
  // Should be only called when there is data
  draw : function() {

    if(!this.stores)
      return;

    // Don't bother to draw until all the stores have been loaded
    for(var i = 0; i < this.stores.length; i++) {
      if(this.stores[i].isLoading())
        return;
    }

    var seriesCount = this.series.length, i;

    // initialise chartConfig series data
    for( i = 0; i < seriesCount; i++) {
      if(this.series[i] && this.series[i].plot != 'flags')
        this.series[i].data = [];
      this.chartConfig.series[i] = this.series[i];
      this.chartConfig.series[i].type = this.chartConfig.series[i].plot ? this.chartConfig.series[i].plot : 'line';
    }

    // NOTE: Multiple series, a store for each series
    if(this.stores.length == this.series.length) {
      for(var s = 0; s < this.stores.length; s++) {

        // If this is a flags data series. Ignore
        if(this.chartConfig.series[s].type == 'flags') {
          continue;
        }

        var items = this.stores[s].data.items;
        var xFieldData = [];

        for(var x = 0; x < items.length; x++) {
          var record = items[x];
          var serie = this.series[s], point;
          point = serie.getData(record);
          this.chartConfig.series[s].data.push(point);
        }
      }
    }
    // NOTE: single store, multiple fields for multiple series
    else {
      var store = this.stores[0];
      var items = store.data.items;
      var xFieldData = [];

      for(var x = 0; x < items.length; x++) {
        for(var s = 0; s < this.series.length; s++) {

          // If this is a flags data series. Ignore
          if(this.chartConfig.series[s].type == 'flags') {
            continue;
          }

          var record = items[x];
          var serie = this.series[s], point;
          point = serie.getData(record);
          this.chartConfig.series[s].data.push(point);
        }
      }
    }

    /**
     * Redraw the chart
     */
    if(this.chart && this.rendered) {
      if(this.resizable) {
        for(var i = 0; i < this.series.length; i++) {
          this.series[i].visible = this.chart.series[i].visible;
        }

        // Destroy
        this.chart.destroy();
        delete this.chart;

        // Create a new chart
        var seriesConfig = this.chartConfig.series;
        this.chart = new Highcharts.StockChart(this.chartConfig);
        // StockChart() will remove chartConfig.series which causes
        // all sort of troule. Restore it
        this.chartConfig.series = seriesConfig;
      }

      /**
       * Create the chart
       */
    } else if(this.rendered) {
      // Create the chart
      var seriesConfig = this.chartConfig.series;
      this.chart = new Highcharts.StockChart(this.chartConfig);
      // StockChart() will remove chartConfig.series which causes
      // all sort of troule. Restore it
      this.chartConfig.series = seriesConfig;
    }

    for( i = 0; i < this.series.length; i++) {
      if(!this.series[i].visible) {
        this.chart.series[i].hide();
      }
    }
    // Refresh the data
    //this.refresh();
  },
  //@deprecated
  onContainerResize : function() {
    this.draw();
  },
  //private
  updatexAxisData : function() {
    var data = [], items = this.store.data.items;

    if(this.xField && this.store) {
      for(var i = 0; i < items.length; i++) {
        data.push(items[i].data[this.xField]);
      }
      if(this.chart)
        this.chart.xAxis[0].setCategories(data, true);
      else
        this.chartConfig.xAxis[0].categories = data;
    }
  },
  bindComponent : function(bind) {
    /**
     * Make the chart update the positions
     * positions are based on the window object and not on the
     * owner object.
     */
    var getWindow = function(parent) {
      if(parent.ownerCt)
        return getWindow(parent.ownerCt);
      else
        return parent;
    };
    var w = getWindow(this);

    if(bind) {
      w.on('move', this.onMove, this);
      w.on('resize', this.onResize, this);

      if(this.ownerCt)
        this.ownerCt.on('render', this.update, this);
    } else {
      if(this.ownerCt)
        this.ownerCt.un('render', this.update, this);
      w.un('move', this.onMove, this);
    }
  },
  bindSeriesStore : function(series_index, store, initial) {

    var series_store = this.stores[series_index];

    if(!initial && series_store) {
      if(store !== series_store && series_store.autoDestroy) {
        series_store.destroy();
      } else {
        series_store.un("datachanged", this.onDataChange, this);
        series_store.un("load", this.onLoad, this);
        series_store.un("add", this.onAdd, this);
        series_store.un("remove", this.onRemove, this);
        series_store.un("update", this.onUpdate, this);
        series_store.un("clear", this.onClear, this);
      }
    }

    if(store) {
      store = Ext.StoreMgr.lookup(store);
      store.on({
        scope : this,
        load : this.onLoad,
        datachanged : this.onDataChange,
        add : this.onAdd,
        remove : this.onRemove,
        update : this.onUpdate,
        clear : this.onClear
      });
    }

    this.stores[series_index] = store;
    if(store && !initial) {
      // This should eventually call up this.onLoad
      store.load();
      //this.refresh();
    }
  },
  /**
   * Changes the data store bound to this chart and refreshes it.
   * @param {Store} store The store to bind to this chart
   */
  bindStore : function(store, initial) {

    if(!initial && this.store) {
      if(store !== this.store && this.store.autoDestroy) {
        this.store.destroy();
      } else {
        this.store.un("datachanged", this.onDataChange, this);
        this.store.un("load", this.onLoad, this);
        this.store.un("add", this.onAdd, this);
        this.store.un("remove", this.onRemove, this);
        this.store.un("update", this.onUpdate, this);
        this.store.un("clear", this.onClear, this);
      }
    }

    if(store) {
      store = Ext.StoreMgr.lookup(store);
      store.on({
        scope : this,
        load : this.onLoad,
        datachanged : this.onDataChange,
        add : this.onAdd,
        remove : this.onRemove,
        update : this.onUpdate,
        clear : this.onClear
      });
    }

    this.store = store;
    if(store && !initial) {
      this.refresh();
    }
  },
  /**
   * Complete refresh of the chart
   */
  refresh : function() {
    this.draw();
    /*
     if(this.store && this.chart) {

     var data = new Array(), seriesCount = this.series.length, i;

     for( i = 0; i < seriesCount; i++) {
     data.push(new Array());
     this.chartConfig.series[i].data = [];

     }

     // We only want to go true the data once.
     // So we need to have all columns that we use in line.
     // But we need to create a point.
     var items = this.store.data.items;
     var xFieldData = [];

     for(var x = 0; x < items.length; x++) {
     var record = items[x];
     if(this.xField) {
     xFieldData.push(record.data[this.xField]);
     }
     for( i = 0; i < seriesCount; i++) {
     var serie = this.series[i], point;
     point = serie.getData(record, x);
     data[i].push(point);
     this.chartConfig.series[i].data.push([point.x, point.y]);
     }
     }

     // Update the series
     /*
     console.log("Number of series in StockChart " + this.chart.series.length);
     for( i = 0; i < seriesCount; i++) {
     if(this.series[i].useTotals) {
     this.chart.series[i].setData(this.series[i].getTotals())
     } else if(data[i].length > 0) {
     this.chart.series[i].setData(data[i], (i == (seriesCount - 1)));
     // true == redraw.
     }
     }

     if(this.xField) {
     this.updatexAxisData();
     }

     }
     */
  },
  /**
   * Update a selected row.
   */
  refreshRow : function(record) {
    var index = this.store.indexOf(record);
    if(this.chart) {
      for(var i = 0; i < this.chart.series.length; i++) {
        var serie = this.chart.series[i];
        var point = this.series[i].getData(record, index);
        if(this.series[i].type == 'pie' && this.series[i].useTotals) {
          this.series[i].update(record);
          this.chart.series[i].setData(this.series[i].getTotals());
        } else
          serie.data[index].update(point);
      }

      if(this.xField) {
        this.updatexAxisData();
      }
    }
  },
  /**
   * A function to delay the updates
   * @param {Integer} delay Set a custom delay
   */
  update : function(delay) {
    var cdelay = delay || this.updateDelay;
    if(!this.updateTask) {
      this.updateTask = new Ext.util.DelayedTask(this.draw, this);
    }
    this.updateTask.delay(cdelay);
  },
  // private
  onDataChange : function(store, eOpts) {
    // Don't use onDataChange for ExtJs 4.0 because this is ambigous
    // Will be fixed in ExtJs 4.1
    //console.log("onDataChange");
    //this.refresh();
  },
  // private
  onClear : function() {
    this.refresh();
  },
  // private
  onUpdate : function(ds, record) {
    this.refreshRow(record);
  },
  // private
  onAdd : function(ds, records, index) {

    var redraw = false, xFieldData = [];

    for(var i = 0; i < records.length; i++) {
      var record = records[i];
      if(i == records.length - 1)
        redraw = true;
      if(this.xField) {
        xFieldData.push(record.data[this.xField]);
      }

      // Note: The for loop has to rely this.seres.length, not
      // this.chart.series.length because after StockChart()
      // is created, this.chart.series is inserted with a
      // navigator series which is the scale chart at the bottom
      for(var x = 0; x < this.chart.series.length; x++) {
        var serie = this.chart.series[x], s = this.series[x];
        if(s && s.getData) {
          var point = s.getData(record, index + i);
          if(!(s.type == 'pie' && s.useTotals)) {
            serie.addPoint(point, redraw, true);
          }
        }
      }
    }
    if(this.xField) {
      this.chart.xAxis[0].setCategories(xFieldData, true);
    }

  },
  //private
  onResize : function() {
    Chart.ux.HighStock.superclass.onResize.call(this);
    this.update();
  },
  // private
  onRemove : function(ds, record, index, isUpdate) {
    for(var i = 0; i < this.series.length; i++) {
      var s = this.series[i];
      if(s.type == 'pie' && s.useTotals) {
        s.removeData(record, index);
        this.chart.series[i].setData(s.getTotals());
      } else {
        this.chart.series[i].data[index].remove(true);
      }
    }
    Ext.each(this.chart.series, function(serie) {
      serie.data[index].remove(true);
    });
    if(this.xField) {
      this.updatexAxisData();
    }
  },
  // private
  onLoad : function(store) {
    //console.log("call onLoad, loading " + store.isLoading());
    this.draw();
  },
  loadStores : function() {
    Ext.each(this.stores, function(store) {
      store.load();
    });
  },
  destroy : function() {
    delete this.series;
    if(this.chart) {
      this.chart.destroy();
      delete this.chart;
    }

    this.bindStore(null);
    this.bindComponent(null);

    Chart.ux.HighStock.superclass.destroy.call(this);
  }
});

/**
 * @class Ext.ux.HighStock.Series
 * This class registers all available series, and provide backward compatibility
 * @constructor
 */
Chart.ux.HighStock.Series = function() {
  var items = new Array(), values = new Array();

  return {
    reg : function(id, cls) {
      items.push(cls);
      values.push(id);
    },
    get : function(id) {
      return items[values.indexOf(id)];
    }
  };
}();
