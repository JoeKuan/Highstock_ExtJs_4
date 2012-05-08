Ext.define("Chart.ux.SampleConfigs", {

  statics : {
    getConfig : function(name) {
      if(Chart.ux.SampleConfigs[name]) {
        return Ext.clone(Chart.ux.SampleConfigs[name]);
      }
    },

    single_line : {
      stockQuery : {
        name : 'aapl',
        fields : 'c'
      },
      series : [{
        name : 'AAPL',
        tooltip : {
          yDecimals : 2
        },
        xField : 'time',
        yField : 'price'
      }],
      height : 500,
      width : 700,
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        rangeSelector : {
          selected : 1
        },
        title : {
          text : 'AAPL Stock Price'
        }
      }
    },

    two_panes : {
      stockQuery : {
        name : 'aapl',
        fields : 'ohlcv'
      },
      series : [{
        plot : 'candlestick',
        name : 'AAPL',
        getData : function(record) {
          return [record.raw[0], // the date
          record.raw[1], // open
          record.raw[2], // high
          record.raw[3], // low
          record.raw[4] // close
          ];
        },

        //data : ohlc,
        dataGrouping : {
          // unit name, allowed multiples
          units : [['week', [1]], ['month', [1, 2, 3, 4, 6]]]
        }
      }, {
        plot : 'column',
        name : 'Volume',
        //data : volume,
        getData : function(record) {
          return [record.data.time, record.data.volume];
        },

        yAxis : 1,
        dataGrouping : {
          units : [['week', [1]], ['month', [1, 2, 3, 4, 6]]]
        }
      }],
      height : 500,
      width : 700,
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50,
          alignTicks : false
        },
        rangeSelector : {
          selected : 1
        },
        title : {
          text : 'AAPL Historical'
        },
        yAxis : [{
          title : {
            text : 'OHLC'
          },
          height : 200,
          lineWidth : 2
        }, {
          title : {
            text : 'Volume'
          },
          top : 300,
          height : 100,
          offset : 0,
          lineWidth : 2
        }]
      }
    },

    multi_series : {
      // Stock query match the series array
      stockQuery : [{
        name : 'msft',
        fields : 'c'
      }, {
        name : 'aapl',
        fields : 'c'
      }, {
        name : 'goog',
        fields : 'c'
      }],
      // Multiple series
      series : [{
        name : 'MSFT',
        xField : 'time',
        yField : 'price'
      }, {
        name : 'AAPL',
        xField : 'time',
        yField : 'price'
      }, {
        name : 'GOOG',
        xField : 'time',
        yField : 'price'
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        rangeSelector : {
          selected : 4
        },
        yAxis : {
          labels : {
            formatter : function() {
              return (this.value > 0 ? '+' : '') + this.value + '%';
            }

          },
          plotLines : [{
            value : 0,
            width : 2,
            color : 'silver'
          }]
        },
        plotOptions : {
          series : {
            compare : 'percent'
          }
        },
        tooltip : {
          pointFormat : '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
          yDecimals : 2
        }
      }
    },

    data_grouping : {
      stockQuery : {
        name : 'large-dataset'
      },
      series : [{
        name : 'Temperature',
        getData : function(record) {
          return record.data.temperature;
        },
        pointStart : Date.UTC(2004, 3, 1),
        pointInterval : 3600 * 1000,
        tooltip : {
          yDecimals : 1,
          ySuffix : 'Â°C'
        }
      }],
      chartConfig : {
        chart : {
          events : {
            /* Can't do this
             load : function(chart) {
             this.setTitle(null, {
             text : 'Built chart at ' + (new Date() - start) + 'ms'
             });
             }
             */
          },
          zoomType : 'x'
        },
        rangeSelector : {
          buttons : [{
            type : 'day',
            count : 3,
            text : '3d'
          }, {
            type : 'week',
            count : 1,
            text : '1w'
          }, {
            type : 'month',
            count : 1,
            text : '1m'
          }, {
            type : 'month',
            count : 6,
            text : '6m'
          }, {
            type : 'year',
            count : 1,
            text : '1y'
          }, {
            type : 'all',
            text : 'All'
          }],
          selected : 3
        },
        yAxis : {
          title : {
            text : 'Temperature (Â°C)'
          }
        },
        title : {
          text : 'Hourly temperatures in Vik i Sogn, Norway, 2004-2010'
        },
        subtitle : {
          text : 'Built chart at...' // dummy text to reserve space for dynamic
          // subtitle
        }
      }
    },

    intraday_area : {
      stockQuery : {
        name : 'new-intraday',
        // The example only uses the first 2 items even it return an array of 6
        // items
        model_fields : [{
          name : 'time',
          mapping : 0
        }, {
          name : 'price',
          mapping : 1
        }]
      },
      series : [{
        name : 'AAPL',
        plot : 'area',
        xField : 'time',
        yField : 'price',
        gapSize : 5,
        tooltip : {
          yDecimals : 2
        },
        fillColor : {
          linearGradient : {
            x1 : 0,
            y1 : 0,
            x2 : 0,
            y2 : 1
          },
          stops : [[0, Highcharts.getOptions().colors[0]], [1, 'rgba(0,0,0,0)']]
        },
        threshold : null
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        title : {
          text : 'AAPL stock price by minute'
        },
        xAxis : {
          gapGridLineWidth : 0
        },
        rangeSelector : {
          buttons : [{
            type : 'hour',
            count : 1,
            text : '1h'
          }, {
            type : 'day',
            count : 1,
            text : '1D'
          }, {
            type : 'all',
            count : 1,
            text : 'All'
          }],
          selected : 1,
          inputEnabled : false
        }
      }
    },

    intraday_candle : {
      stockQuery : {
        name : 'new-intraday',
        // This example uses ohlc
        model_fields : [{
          name : 'time',
          mapping : 0
        }, {
          name : 'open',
          mapping : 1
        }, {
          name : 'high',
          mapping : 2
        }, {
          name : 'low',
          mapping : 3
        }, {
          name : 'close',
          mapping : 4
        }]
      },
      series : [{
        name : 'AAPL',
        plot : 'candlestick',
        getData : function(record) {
          return [record.data.time, record.data.open, record.data.high, record.data.low, record.data.close];
        },

        tooltip : {
          yDecimals : 2
        }
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        title : {
          text : 'AAPL stock price by minute'
        },
        rangeSelector : {
          buttons : [{
            type : 'hour',
            count : 1,
            text : '1h'
          }, {
            type : 'day',
            count : 1,
            text : '1D'
          }, {
            type : 'all',
            count : 1,
            text : 'All'
          }],
          selected : 1,
          inputEnabled : false
        }
      }
    },

    flags_marking : {
      stockQuery : {
        name : 'usdeur',
        model_fields : [{
          name : 'time',
          mapping : 0
        }, {
          name : 'rate',
          mapping : 1
        }]
      },
      series : [{
        name : 'USD to EUR',
        xField : 'time',
        yField : 'rate',
        id : 'dataseries'
      },
      // the event marker flags
      {
        plot : 'flags',
        data : [{
          x : Date.UTC(2011, 3, 25),
          title : 'H',
          text : 'Euro Contained by Channel Resistance'
        }, {
          x : Date.UTC(2011, 3, 28),
          title : 'G',
          text : 'EURUSD: Bulls Clear Path to 1.50 Figure'
        }, {
          x : Date.UTC(2011, 4, 4),
          title : 'F',
          text : 'EURUSD: Rate Decision to End Standstill'
        }, {
          x : Date.UTC(2011, 4, 5),
          title : 'E',
          text : 'EURUSD: Enter Short on Channel Break'
        }, {
          x : Date.UTC(2011, 4, 6),
          title : 'D',
          text : 'Forex: U.S. Non-Farm Payrolls Expand 244K, U.S. Dollar Rally Cut Short By Risk Appetite'
        }, {
          x : Date.UTC(2011, 4, 6),
          title : 'C',
          text : 'US Dollar: Is This the Long-Awaited Recovery or a Temporary Bounce?'
        }, {
          x : Date.UTC(2011, 4, 9),
          title : 'B',
          text : 'EURUSD: Bearish Trend Change on Tap?'
        }],
        onSeries : 'dataseries',
        shape : 'circlepin',
        width : 16
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        rangeSelector : {
          selected : 1
        },
        title : {
          text : 'USD to EUR exchange rate'
        },
        tooltip : {
          style : {
            width : '200px'
          },
          yDecimals : 4
        },
        yAxis : {
          title : {
            text : 'Exchange rate'
          }
        }
      }
    },

    dynamic_update : {
      series : [{
        name : 'Random data',
        xField : 'time',
        yField : 'value'
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        /*
         events : {
         load : function() {
         // set up the updating of the chart each second
         var series = this.series[0];
         setInterval(function() {
         var x = (new Date()).getTime(), // current time
         y = Math.round(Math.random() * 100);
         series.addPoint([x, y], true, true);
         }, 1000);
         }
         },
         */
        rangeSelector : {
          buttons : [{
            count : 1,
            type : 'minute',
            text : '1M'
          }, {
            count : 5,
            type : 'minute',
            text : '5M'
          }, {
            type : 'all',
            text : 'All'
          }],
          inputEnabled : false,
          selected : 0
        },
        title : {
          text : 'Live random data'
        },
        exporting : {
          enabled : false
        }
      }
    },

    line_markers : {
      stockQuery : {
        name : 'aapl',
        fields : 'c'
      },
      series : [{
        name : 'AAPL Stock Price',
        xField : 'time',
        yField : 'price',
        marker : {
          enabled : true,
          radius : 3
        },
        shadow : true,
        tooltip : {
          yDecimals : 2
        }
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        rangeSelector : {
          selected : 1
        },
        title : {
          text : 'AAPL Stock Price'
        }
      }
    },

    spline : {
      stockQuery : {
        name : 'aapl',
        fields : 'c'
      },
      series : [{
        name : 'AAPL Stock Price',
        xField : 'time',
        yField : 'price',
        plot : 'spline',
        tooltip : {
          yDecimals : 2
        }
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        rangeSelector : {
          selected : 1
        },
        title : {
          text : 'AAPL Stock Price'
        }
      }
    },

    step : {
      stockQuery : {
        name : 'aapl',
        fields : 'c'
      },
      series : [{
        name : 'AAPL Stock Price',
        xField : 'time',
        yField : 'price',
        step : true,
        tooltip : {
          yDecimals : 2
        }
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        rangeSelector : {
          selected : 1
        },
        title : {
          text : 'AAPL Stock Price'
        }
      }
    },

    area : {
      stockQuery : {
        name : 'aapl',
        fields : 'c'
      },
      series : [{
        name : 'AAPL Stock Price',
        xField : 'time',
        yField : 'price',
        plot : 'area',
        threshold : null,
        tooltip : {
          yDecimals : 2
        },
        fillColor : {
          linearGradient : {
            x1 : 0,
            y1 : 0,
            x2 : 0,
            y2 : 1
          },
          stops : [[0, Highcharts.getOptions().colors[0]], [1, 'rgba(0,0,0,0)']]
        }
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        rangeSelector : {
          selected : 1
        },
        title : {
          text : 'AAPL Stock Price'
        }
      }
    },

    areaspline : {
      stockQuery : {
        name : 'aapl',
        fields : 'c'
      },
      series : [{
        name : 'AAPL Stock Price',
        plot : 'areaspline',
        xField : 'time',
        yField : 'price',
        threshold : null,
        tooltip : {
          yDecimals : 2
        },
        fillColor : {
          linearGradient : {
            x1 : 0,
            y1 : 0,
            x2 : 0,
            y2 : 1
          },
          stops : [[0, Highcharts.getOptions().colors[0]], [1, 'rgba(0,0,0,0)']]
        }
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        rangeSelector : {
          selected : 1
        },
        title : {
          text : 'AAPL Stock Price'
        }
      }
    },

    ohlc : {
      stockQuery : {
        name : 'aapl',
        fields : 'ohlc'
      },
      series : [{
        plot : 'ohlc',
        name : 'AAPL Stock Price',
        getData : function(record) {
          return [record.data.time, record.data.open, record.data.high, record.data.low, record.data.price];
        },

        dataGrouping : {
          units : [['week', // unit name
          [1] // allowed multiples
          ], ['month', [1, 2, 3, 4, 6]]]
        }
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        rangeSelector : {
          selected : 2
        },
        title : {
          text : 'AAPL Stock Price'
        }
      }
    },

    column : {
      stockQuery : {
        name : 'aapl',
        fields : 'v'
      },
      series : [{
        plot : 'column',
        name : 'AAPL Stock Volume',
        xField : 'time',
        yField : 'volume',
        dataGrouping : {
          units : [['week', // unit name
          [1] // allowed multiples
          ], ['month', [1, 2, 3, 4, 6]]]
        }
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50,
          alignTicks : false
        },
        rangeSelector : {
          selected : 1
        },
        title : {
          text : 'AAPL Stock Volume'
        }
      }
    },

    point_markers : {
      stockQuery : {
        name : 'aapl',
        fields : 'c'
      },
      series : [{
        name : 'AAPL Stock Price',
        lineWidth : 0,
        xField : 'time',
        yField : 'price',
        marker : {
          enabled : true,
          radius : 2
        },
        tooltip : {
          yDecimals : 2
        }
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        rangeSelector : {
          selected : 2
        },
        title : {
          text : 'AAPL Stock Price'
        }
      }
    },

    lines_y_axis : {
      stockQuery : {
        name : 'usdeur',
        model_fields : [{
          name : 'time',
          mapping : 0
        }, {
          name : 'rate',
          mapping : 1
        }]
      },
      series : [{
        name : 'USD to EUR',
        xField : 'time',
        yField : 'rate',
        tooltip : {
          yDecimals : 4
        }
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        rangeSelector : {
          selected : 1
        },
        title : {
          text : 'USD to EUR exchange rate'
        },
        yAxis : {
          title : {
            text : 'Exchange rate'
          },
          plotLines : [{
            value : 0.6738,
            color : 'green',
            dashStyle : 'shortdash',
            width : 2,
            label : {
              text : 'Last quarter minimum'
            }
          }, {
            value : 0.7419,
            color : 'red',
            dashStyle : 'shortdash',
            width : 2,
            label : {
              text : 'Last quarter maximum'
            }
          }]
        }
      }
    },

    bands_y_axis : {
      stockQuery : {
        name : 'usdeur',
        model_fields : [{
          name : 'time',
          mapping : 0
        }, {
          name : 'rate',
          mapping : 1
        }]
      },
      series : [{
        name : 'USD to EUR',
        xField : 'time',
        yField : 'rate',
        tooltip : {
          yDecimals : 4
        }
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        rangeSelector : {
          selected : 1
        },
        title : {
          text : 'USD to EUR exchange rate'
        },
        yAxis : {
          title : {
            text : 'Exchange rate'
          },
          plotBands : [{
            from : 0.6738,
            to : 0.7419,
            color : 'rgba(68, 170, 213, 0.2)',
            label : {
              text : 'Last quarter\'s value range'
            }
          }]
        }
      }
    },

    reversed_y_axis : {
      stockQuery : {
        name : 'aapl',
        fields : 'c'
      },
      series : [{
        name : 'AAPL Stock Price',
        xField : 'time',
        yField : 'price',
        plot : 'area',
        threshold : null,
        tooltip : {
          yDecimals : 2
        },
        fillColor : {
          linearGradient : {
            x1 : 0,
            y1 : 1,
            x2 : 0,
            y2 : 0
          },
          stops : [[0, Highcharts.getOptions().colors[0]], [1, 'rgba(0,0,0,0)']]
        }
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        rangeSelector : {
          selected : 1
        },
        title : {
          text : 'AAPL Stock Price'
        },
        yAxis : {
          reversed : true,
          showFirstLabel : false,
          showLastLabel : true
        }
      }
    },

    styled_scrollbar : {
      stockQuery : {
        name : 'aapl',
        fields : 'c'
      },
      series : [{
        name : 'AAPL Stock Price',
        xField : 'time',
        yField : 'price',
        tooltip : {
          yDecimals : 2
        }
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        rangeSelector : {
          selected : 1
        },
        title : {
          text : 'AAPL Stock Price'
        },
        scrollbar : {
          barBackgroundColor : 'gray',
          barBorderRadius : 7,
          barBorderWidth : 0,
          buttonBackgroundColor : 'gray',
          buttonBorderWidth : 0,
          buttonBorderRadius : 7,
          trackBackgroundColor : 'none',
          trackBorderWidth : 1,
          trackBorderRadius : 8,
          trackBorderColor : '#CCC'
        }
      }
    },

    disabled_scrollbar : {
      stockQuery : {
        name : 'aapl',
        fields : 'c'
      },
      series : [{
        name : 'AAPL Stock Price',
        xField : 'time',
        yField : 'price',
        tooltip : {
          yDecimals : 2
        }
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        rangeSelector : {
          selected : 1
        },
        title : {
          text : 'AAPL Stock Price'
        },
        scrollbar : {
          enabled : false
        }
      }
    },

    disabled_navigator : {
      stockQuery : {
        name : 'aapl',
        fields : 'c'
      },
      series : [{
        name : 'AAPL Stock Price',
        xField : 'time',
        yField : 'price',
        tooltip : {
          yDecimals : 2
        }
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        rangeSelector : {
          selected : 1
        },
        title : {
          text : 'AAPL Stock Price'
        },
        navigator : {
          enabled : false
        }
      }
    },

    flags_placement : {
      stockQuery : {
        name : 'usdeur',
        model_fields : [{
          name : 'time',
          mapping : 0
        }, {
          name : 'rate',
          mapping : 1
        }]
      },
      series : [{
        name : 'USD to EUR',
        xField : 'time',
        yField : 'rate',
        tooltip : {
          yDecimals : 4
        },
        id: 'dataseries'
      }, {
        plot: 'flags',
        data : [{
          x : Date.UTC(2011, 1, 14),
          title : 'On series'
        }, {
          x : Date.UTC(2011, 3, 28),
          title : 'On series'
        }],
        onSeries : 'dataseries',
        shape : 'squarepin'

      }, {
        plot : 'flags',
        data : [{
          x : Date.UTC(2011, 2, 1),
          title : 'On axis'
        }, {
          x : Date.UTC(2011, 3, 1),
          title : 'On axis'
        }],
        shape : 'squarepin'
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        rangeSelector : {
          selected : 1
        },
        title : {
          text : 'USD to EUR exchange rate'
        },
        yAxis : {
          title : {
            text : 'Exchange rate'
          }
        }
      }
    },

    flags_shapes : {
      stockQuery : {
        name : 'usdeur',
        model_fields : [{
          name : 'time',
          mapping : 0
        }, {
          name : 'rate',
          mapping : 1
        }]
      },
      series : [{
        name : 'USD to EUR',
        xField : 'time',
        yField : 'rate',
        tooltip : {
          yDecimals : 4
        },
        id: 'dataseries'
      }, {
        plot: 'flags',
        data : [{
          x : Date.UTC(2011, 1, 14),
          title : 'A',
          text : 'Shape: "squarepin"'
        }, {
          x : Date.UTC(2011, 3, 28),
          title : 'A',
          text : 'Shape: "squarepin"'
        }],
        onSeries : 'dataseries',
        shape : 'squarepin',
        width : 16
      }, {
        plot : 'flags',
        data : [{
          x : Date.UTC(2011, 2, 1),
          title : 'B',
          text : 'Shape: "circlepin"'
        }, {
          x : Date.UTC(2011, 3, 1),
          title : 'B',
          text : 'Shape: "circlepin"'
        }],
        shape : 'circlepin',
        width : 16
      }, {
        plot : 'flags',
        data : [{
          x : Date.UTC(2011, 2, 10),
          title : 'C',
          text : 'Shape: "flag"'
        }, {
          x : Date.UTC(2011, 3, 11),
          title : 'C',
          text : 'Shape: "flag"'
        }],
        color : '#5F86B3',
        fillColor : '#5F86B3',
        onSeries : 'dataseries',
        width : 16,
        style : {// text style
          color : 'white'
        },
        states : {
          hover : {
            fillColor : '#395C84' // darker
          }
        }
      }],
      chartConfig : {
        chart : {
          marginLeft : 50,
          marginRight : 50
        },
        rangeSelector : {
          selected : 1
        },
        title : {
          text : 'USD to EUR exchange rate'
        },
        yAxis : {
          title : {
            text : 'Exchange rate'
          }
        }
      }
    }
  } // status

});
