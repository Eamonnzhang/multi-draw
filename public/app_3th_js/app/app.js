(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/js/themes/html/app.js":[function(require,module,exports){
// Essentials
require('essential/js/main');

// Layout
require('layout/js/main');

// Sidebar
require('sidebar/js/main');

// Charts
require('charts/js/main');

// Messages
require('messages/js/main');

// Media
require('media/js/main');

// Material
require('material/js/main');

// Maps
window.initGoogleMaps = require('maps/js/google/main');

// CORE
require('./main');
},{"./main":"/Code/html/themes/learning-1.1.0/src/js/themes/html/main.js","charts/js/main":"/Code/html/themes/learning-1.1.0/lib/charts/js/main.js","essential/js/main":"/Code/html/themes/learning-1.1.0/lib/essential/js/main.js","layout/js/main":"/Code/html/themes/learning-1.1.0/lib/layout/js/main.js","maps/js/google/main":"/Code/html/themes/learning-1.1.0/lib/maps/js/google/main.js","material/js/main":"/Code/html/themes/learning-1.1.0/lib/material/js/main.js","media/js/main":"/Code/html/themes/learning-1.1.0/lib/media/js/main.js","messages/js/main":"/Code/html/themes/learning-1.1.0/lib/messages/js/main.js","sidebar/js/main":"/Code/html/themes/learning-1.1.0/lib/sidebar/js/main.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/easy-pie/_easy-pie.js":[function(require,module,exports){
(function ($) {
    "use strict";

    var skin = require('../lib/_skin')();

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkEasyPie = function () {

        if (! this.length) return;

        if (!$.fn.easyPieChart) return;

        var color = config.skins[ skin ][ 'primary-color' ];
        if (this.is('.info')) color = colors[ 'info-color' ];
        if (this.is('.danger')) color = colors[ 'danger-color' ];
        if (this.is('.success')) color = colors[ 'success-color' ];
        if (this.is('.warning')) color = colors[ 'warning-color' ];
        if (this.is('.inverse')) color = colors[ 'inverse-color' ];

        this.easyPieChart({
            barColor: color,
            animate: ($('html').is('.ie') ? false : 3000),
            lineWidth: 4,
            size: 50
        });

    };

    $.each($('.easy-pie'), function (k, v) {
        $(this).tkEasyPie();
    });

})(jQuery);
},{"../lib/_skin":"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/easy-pie/main.js":[function(require,module,exports){
require('./_easy-pie');
},{"./_easy-pie":"/Code/html/themes/learning-1.1.0/lib/charts/js/easy-pie/_easy-pie.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_autoupdate.js":[function(require,module,exports){
(function ($) {

    var charts = require('./_helper');

    if (typeof charts == 'undefined')
        return;

    charts.chart_live =
    {
        // chart data
        data: [],
        totalPoints: 300,
        updateInterval: 200,

        // we use an inline data source in the example, usually data would
        // be fetched from a server
        getRandomData: function () {
            if (this.data.length > 0)
                this.data = this.data.slice(1);

            // do a random walk
            while (this.data.length < this.totalPoints) {
                var prev = this.data.length > 0 ? this.data[ this.data.length - 1 ] : 50;
                var y = prev + Math.random() * 10 - 5;
                if (y < 0)
                    y = 0;
                if (y > 100)
                    y = 100;
                this.data.push(y);
            }

            // zip the generated y values with the x values
            var res = [];
            for (var i = 0; i < this.data.length; ++ i)
                res.push([ i, this.data[ i ] ]);
            return res;
        },

        // will hold the chart object
        plot: null,

        // chart options
        options: {
            series: {
                grow: {active: false},
                shadowSize: 0,
                lines: {
                    show: true,
                    fill: true,
                    lineWidth: 2,
                    steps: false
                }
            },
            grid: {
                show: true,
                aboveData: false,
                color: colors[ 'default-light-color' ],
                labelMargin: 5,
                axisMargin: 0,
                borderWidth: 0,
                borderColor: null,
                minBorderMargin: 5,
                clickable: true,
                hoverable: true,
                autoHighlight: false,
                mouseActiveRadius: 20,
                backgroundColor: {}
            },
            colors: [],
            tooltip: true,
            tooltipOpts: {
                content: "Value is : %y.0",
                shifts: {
                    x: - 30,
                    y: - 50
                },
                defaultTheme: false
            },
            yaxis: {
                min: 0,
                max: 100,
                tickColor: '#efefef'
            },
            xaxis: {
                show: false
            }
        },

        // initialize
        init: function (wrapper) {

            if (!wrapper.length) return;

            // apply styling
            charts.utility.applyStyle(this);

            this.plot = $.plot(wrapper, [ this.getRandomData() ], this.options);
            setTimeout(this.update, charts.chart_live.updateInterval);
        },

        // update
        update: function () {
            charts.chart_live.plot.setData([ charts.chart_live.getRandomData() ]);
            charts.chart_live.plot.draw();

            setTimeout(charts.chart_live.update, charts.chart_live.updateInterval);
        }
    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkFlotChartLive = function () {

        if (! this.length) return;

        charts.chart_live.init(this);

    };

    $('[data-toggle="flot-chart-live"]').tkFlotChartLive();

})(jQuery);
},{"./_helper":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_helper.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_bars-ordered.js":[function(require,module,exports){
(function ($) {

    var charts = require('./_helper');

    if (typeof charts == 'undefined')
        return;

    charts.chart_ordered_bars =
    {
        // chart data
        data: null,

        // will hold the chart object
        plot: null,

        // chart options
        options: {
            bars: {
                show: true,
                barWidth: 0.2,
                fill: 1
            },
            grid: {
                show: true,
                aboveData: false,
                color: colors[ 'default-light-color' ],
                labelMargin: 5,
                axisMargin: 0,
                borderWidth: 0,
                borderColor: null,
                minBorderMargin: 5,
                clickable: true,
                hoverable: true,
                autoHighlight: false,
                mouseActiveRadius: 20,
                backgroundColor: {}
            },
            series: {
                grow: {active: false}
            },
            legend: {
                position: "ne",
                backgroundColor: null,
                backgroundOpacity: 0,
                noColumns: 3
            },
            yaxis: {
                ticks: 3,
                tickColor: '#efefef'
            },
            xaxis: {
                ticks: 4,
                tickDecimals: 0,
                tickColor: 'transparent'
            },
            colors: [],
            tooltip: true,
            tooltipOpts: {
                content: "%s : %y.0",
                shifts: {
                    x: - 30,
                    y: - 50
                },
                defaultTheme: false
            }
        },

        // initialize
        init: function (wrapper) {

            if (! wrapper.length) return;

            // apply styling
            charts.utility.applyStyle(this);

            //some data
            var d1 = [];
            for (var i = 0; i <= 10; i += 1)
                d1.push([ i, parseInt(Math.random() * 30) ]);

            var d2 = [];
            for (var j = 0; j <= 10; j += 1)
                d2.push([ j, parseInt(Math.random() * 30) ]);

            var d3 = [];
            for (var k = 0; k <= 10; k += 1)
                d3.push([ k, parseInt(Math.random() * 30) ]);

            var ds = [];

            ds.push({
                label: "Data One",
                data: d1,
                bars: {order: 1}
            });
            ds.push({
                label: "Data Two",
                data: d2,
                bars: {order: 2}
            });
            ds.push({
                label: "Data Three",
                data: d3,
                bars: {order: 3}
            });

            this.data = ds;

            this.plot = $.plot(wrapper, this.data, this.options);
        }
    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkFlotChartOrderedBars = function () {

        if (! this.length) return;

        charts.chart_ordered_bars.init(this);

    };

    $('[data-toggle="flot-chart-ordered-bars"]').tkFlotChartOrderedBars();

})(jQuery);
},{"./_helper":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_helper.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_bars-stacked.js":[function(require,module,exports){
(function ($) {

    var charts = require('./_helper');

    if (typeof charts == 'undefined')
        return;

    charts.chart_stacked_bars =
    {
        // chart data
        data: null,

        // will hold the chart object
        plot: null,

        // chart options
        options: {
            grid: {
                show: true,
                aboveData: false,
                color: colors[ 'default-light-color' ],
                labelMargin: 5,
                axisMargin: 0,
                borderWidth: 0,
                borderColor: null,
                minBorderMargin: 5,
                clickable: true,
                hoverable: true,
                autoHighlight: true,
                mouseActiveRadius: 20,
                backgroundColor: {}
            },
            series: {
                grow: {active: false},
                stack: 0,
                lines: {show: false, fill: true, steps: false},
                bars: {show: true, barWidth: 0.5, fill: 1}
            },
            yaxis: {
                ticks: 3,
                tickColor: '#efefef'
            },
            xaxis: {
                ticks: 11,
                tickDecimals: 0,
                tickColor: 'transparent'
            },
            legend: {
                position: "ne",
                backgroundColor: null,
                backgroundOpacity: 0,
                noColumns: 3
            },
            colors: [],
            shadowSize: 1,
            tooltip: true,
            tooltipOpts: {
                content: "%s : %y.0",
                shifts: {
                    x: - 30,
                    y: - 50
                },
                defaultTheme: false
            }
        },

        // initialize
        init: function (wrapper) {

            if (! wrapper.length) return;

            // apply styling
            charts.utility.applyStyle(this);

            var d1 = [];
            for (var i = 0; i <= 10; i += 1)
                d1.push([ i, parseInt(Math.random() * 30) ]);

            var d2 = [];
            for (var j = 0; j <= 10; j += 1)
                d2.push([ j, parseInt(Math.random() * 20) ]);

            var d3 = [];
            for (var k = 0; k <= 10; k += 1)
                d3.push([ k, parseInt(Math.random() * 20) ]);

            this.data = [];

            this.data.push({
                label: "Data One",
                data: d1
            });
            this.data.push({
                label: "Data Two",
                data: d2
            });
            this.data.push({
                label: "Data Tree",
                data: d3
            });

            this.plot = $.plot(wrapper, this.data, this.options);
        }
    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkFlotChartStackedBars = function () {

        if (! this.length) return;

        charts.chart_stacked_bars.init(this);

    };

    $('[data-toggle="flot-chart-stacked-bars"]').tkFlotChartStackedBars();

})(jQuery);
},{"./_helper":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_helper.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_donut.js":[function(require,module,exports){
(function ($) {

    var charts = require('./_helper');

    if (typeof charts == 'undefined')
        return;

    charts.chart_donut =
    {
        // chart data
        data: [
            {label: "USA", data: 38},
            {label: "Brazil", data: 23},
            {label: "India", data: 15},
            {label: "Turkey", data: 9},
            {label: "France", data: 7},
            {label: "China", data: 5},
            {label: "Germany", data: 3}
        ],

        // will hold the chart object
        plot: null,

        // chart options
        options: {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.4,
                    highlight: {
                        opacity: 0.1
                    },
                    radius: 1,
                    stroke: {
                        color: '#fff',
                        width: 8
                    },
                    startAngle: 2,
                    combine: {
                        color: '#EEE',
                        threshold: 0.05
                    },
                    label: {
                        show: true,
                        radius: 1,
                        formatter: function (label, series) {
                            return '<div class="label label-default">' + label + '&nbsp;' + Math.round(series.percent) + '%</div>';
                        }
                    }
                },
                grow: {active: false}
            },
            legend: {show: false},
            grid: {
                hoverable: true,
                clickable: true,
                backgroundColor: {}
            },
            colors: [],
            tooltip: true,
            tooltipOpts: {
                content: "%s : %y.1" + "%",
                shifts: {
                    x: - 30,
                    y: - 50
                },
                defaultTheme: false
            }
        },

        // initialize
        init: function (wrapper) {

            if (! wrapper.length) return;

            // apply styling
            charts.utility.applyStyle(this);

            this.plot = $.plot(wrapper, this.data, this.options);
        }
    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkFlotChartDonut = function () {

        if (! this.length) return;

        charts.chart_donut.init(this);

    };

    $('[data-toggle="flot-chart-donut"]').tkFlotChartDonut();

})(jQuery);
},{"./_helper":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_helper.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_helper.js":[function(require,module,exports){
var skin = require('../lib/_skin')();

var charts =
{
    // utility class
    utility: {
        chartColors: [ config.skins[ skin ][ 'primary-color' ], colors[ 'default-color' ], colors[ 'danger-color' ], colors[ 'success-color' ], colors[ 'warning-color' ] ],
        chartBackgroundColors: [ "rgba(255,255,255,0)", "rgba(255,255,255,0)" ],

        applyStyle: function (that) {
            that.options.colors = charts.utility.chartColors;
            that.options.grid.backgroundColor = { colors: charts.utility.chartBackgroundColors };
            that.options.grid.borderColor = charts.utility.chartColors[ 0 ];
            that.options.grid.color = charts.utility.chartColors[ 0 ];
        },

        // generate random number for charts
        randNum: function () {
            return (Math.floor(Math.random() * (1 + 40 - 20)) ) + 20;
        }
    }

};

module.exports = charts;
},{"../lib/_skin":"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_horizontal.js":[function(require,module,exports){
(function ($) {

    var skin = require('../lib/_skin')();
    var charts = require('./_helper');

    if (typeof charts == 'undefined')
        return;

    charts.chart_horizontal_bars =
    {
        // chart data
        data: null,

        // will hold the chart object
        plot: null,

        // chart options
        options: {
            grid: {
                color: "#dedede",
                borderWidth: 1,
                borderColor: "transparent",
                clickable: true,
                hoverable: true
            },
            series: {
                grow: {active: false},
                bars: {
                    show: true,
                    horizontal: true,
                    barWidth: 0.2,
                    fill: 1
                }
            },
            legend: {position: "nw", backgroundColor: null, backgroundOpacity: 0},
            yaxis: {
                ticks: 3,
                tickColor: 'transparent',
                tickFormatter: function (val, axis) {
                    return val + "k";
                }
            },
            xaxis: {
                ticks: 4,
                tickDecimals: 0
            },
            colors: [ config.skins[ skin ][ 'primary-color' ] ],
            tooltip: true,
            tooltipOpts: {
                content: "%s : %y.0",
                shifts: {
                    x: - 30,
                    y: - 50
                },
                defaultTheme: false
            }
        },

        // initialize
        init: function (wrapper) {

            if (!wrapper.length) return;

            // apply styling
            // charts.utility.applyStyle(this);

            var d1 = [];
            for (var i = 1; i <= 5; i += 1)
                d1.push([ parseInt(Math.random() * 30), i ]);

            this.data = [];

            this.data.push({
                label: "Sales Volume",
                data: d1,
                bars: {
                    horizontal: true,
                    show: true,
                    barWidth: 0.5
                }
            });

            this.plot = $.plot(wrapper, this.data, this.options);
        }
    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkFlotChartHorizontalBars = function () {

        if (! this.length) return;

        charts.chart_horizontal_bars.init(this);

    };

    $('[data-toggle="flot-chart-horizontal-bars"]').tkFlotChartHorizontalBars();

})(jQuery);
},{"../lib/_skin":"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js","./_helper":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_helper.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_line.js":[function(require,module,exports){
(function ($) {

    var skin = require('../lib/_skin')();
    var charts = require('./_helper');

    if (typeof charts == 'undefined')
        return;

    charts.chart_lines_fill_nopoints_3 =
    {
        // chart data
        data: {
            d1: []
        },

        // will hold the chart object
        plot: null,

        // chart options
        options: {
            colors: [  colors[ 'success-color' ]],
            grid: {
                color: colors[ 'default-light-color' ],
                borderWidth: 1,
                borderColor: "transparent",
                clickable: true,
                hoverable: true
            },
            series: {
                grow: {active: false},
                lines: {
                    show: true,
                    fill: false,
                    lineWidth: 2,
                    steps: false,
                    color: config.skins[ skin ][ 'primary-color' ]
                },
                points: {show: false}
            },
            legend: {position: "nw", backgroundColor: null, backgroundOpacity: 0},
            yaxis: {
                ticks: 3,
                tickSize: 40,
                tickFormatter: function (val, axis) {
                    return val + "k";
                }
            },
            xaxis: {ticks: 4, tickDecimals: 0, tickColor: 'transparent'},
            shadowSize: 0,
            tooltip: true,
            tooltipOpts: {
                content: "%s : %y.0",
                shifts: {
                    x: - 30,
                    y: - 50
                },
                defaultTheme: false
            }
        },

        // initialize
        init: function (wrapper) {

            if (!wrapper.length) return;

            // generate some data
            this.data.d1 = [ [ 1, 3 + charts.utility.randNum() ], [ 2, 6 + charts.utility.randNum() ], [ 3, 30 + charts.utility.randNum() ], [ 4, 110 + charts.utility.randNum() ], [ 5, 80 + charts.utility.randNum() ], [ 6, 18 + charts.utility.randNum() ], [ 7, 50 + charts.utility.randNum() ], [ 8, 15 + charts.utility.randNum() ], [ 9, 18 + charts.utility.randNum() ], [ 10, 60 + charts.utility.randNum() ], [ 11, 110 + charts.utility.randNum() ], [ 12, 27 + charts.utility.randNum() ], [ 13, 30 + charts.utility.randNum() ], [ 14, 33 + charts.utility.randNum() ], [ 15, 24 + charts.utility.randNum() ], [ 16, 80 + charts.utility.randNum() ], [ 17, 30 + charts.utility.randNum() ], [ 18, 33 + charts.utility.randNum() ], [ 19, 36 + charts.utility.randNum() ], [ 20, 39 + charts.utility.randNum() ], [ 21, 42 + charts.utility.randNum() ], [ 22, 70 + charts.utility.randNum() ], [ 23, 36 + charts.utility.randNum() ], [ 24, 39 + charts.utility.randNum() ], [ 25, 42 + charts.utility.randNum() ], [ 26, 45 + charts.utility.randNum() ], [ 27, 60 + charts.utility.randNum() ], [ 28, 51 + charts.utility.randNum() ], [ 29, 55 + charts.utility.randNum() ], [ 30, 100 + charts.utility.randNum() ] ];

            // make chart
            this.plot = $.plot(
                wrapper,
                [ {
                    label: "Net Revenue",
                    data: this.data.d1
                } ],
                this.options
            );
        }
    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkFlotChartLines3 = function () {

        if (! this.length) return;

        charts.chart_lines_fill_nopoints_3.init(this);

    };

    $('[data-toggle="flot-chart-lines-3"]').tkFlotChartLines3();

})(jQuery);
},{"../lib/_skin":"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js","./_helper":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_helper.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_line_fill_nopoints.js":[function(require,module,exports){
(function ($) {

    var skin = require('../lib/_skin')();
    var charts = require('./_helper');

    if (typeof charts == 'undefined')
        return;

    charts.chart_lines_fill_nopoints =
    {
        // chart data
        data: {
            d1: [],
            d2: []
        },

        // will hold the chart object
        plot: null,

        // chart options
        options: {
            grid: {
                show: true,
                aboveData: false,
                color: colors[ 'default-color' ],
                labelMargin: 5,
                axisMargin: 0,
                borderWidth: 0,
                borderColor: null,
                minBorderMargin: 5,
                clickable: true,
                hoverable: true,
                mouseActiveRadius: 20,
                backgroundColor: {}
            },
            series: {
                grow: {
                    active: false
                },
                lines: {
                    show: true,
                    fill: true,
                    lineWidth: 2,
                    steps: false
                },
                points: {
                    show: false
                }
            },
            legend: {
                position: "nw",
                noColumns: 2
            },
            yaxis: {
                ticks: 4,
                tickDecimals: 0,
                tickColor: '#efefef'
            },
            xaxis: {
                ticks: 11,
                tickDecimals: 0,
                tickColor: 'transparent'
            },
            colors: [],
            shadowSize: 1,
            tooltip: true,
            tooltipOpts: {
                content: "%s : %y.0",
                shifts: {
                    x: - 30,
                    y: - 50
                },
                defaultTheme: false
            }
        },

        // initialize
        init: function (wrapper) {

            if (! wrapper.length) return;

            // apply styling
            charts.utility.applyStyle(this);

            // generate some data
            this.data.d1 = [ [ 1, 3 + charts.utility.randNum() ], [ 2, 6 + charts.utility.randNum() ], [ 3, 9 + charts.utility.randNum() ], [ 4, 12 + charts.utility.randNum() ], [ 5, 15 + charts.utility.randNum() ], [ 6, 18 + charts.utility.randNum() ], [ 7, 21 + charts.utility.randNum() ], [ 8, 15 + charts.utility.randNum() ], [ 9, 18 + charts.utility.randNum() ], [ 10, 21 + charts.utility.randNum() ], [ 11, 24 + charts.utility.randNum() ], [ 12, 27 + charts.utility.randNum() ], [ 13, 30 + charts.utility.randNum() ], [ 14, 33 + charts.utility.randNum() ], [ 15, 24 + charts.utility.randNum() ], [ 16, 27 + charts.utility.randNum() ], [ 17, 30 + charts.utility.randNum() ], [ 18, 33 + charts.utility.randNum() ], [ 19, 36 + charts.utility.randNum() ], [ 20, 39 + charts.utility.randNum() ], [ 21, 42 + charts.utility.randNum() ], [ 22, 45 + charts.utility.randNum() ], [ 23, 36 + charts.utility.randNum() ], [ 24, 39 + charts.utility.randNum() ], [ 25, 42 + charts.utility.randNum() ], [ 26, 45 + charts.utility.randNum() ], [ 27, 38 + charts.utility.randNum() ], [ 28, 51 + charts.utility.randNum() ], [ 29, 55 + charts.utility.randNum() ], [ 30, 60 + charts.utility.randNum() ] ];
            this.data.d2 = [ [ 1, charts.utility.randNum() - 5 ], [ 2, charts.utility.randNum() - 4 ], [ 3, charts.utility.randNum() - 4 ], [ 4, charts.utility.randNum() ], [ 5, 4 + charts.utility.randNum() ], [ 6, 4 + charts.utility.randNum() ], [ 7, 5 + charts.utility.randNum() ], [ 8, 5 + charts.utility.randNum() ], [ 9, 6 + charts.utility.randNum() ], [ 10, 6 + charts.utility.randNum() ], [ 11, 6 + charts.utility.randNum() ], [ 12, 2 + charts.utility.randNum() ], [ 13, 3 + charts.utility.randNum() ], [ 14, 4 + charts.utility.randNum() ], [ 15, 4 + charts.utility.randNum() ], [ 16, 4 + charts.utility.randNum() ], [ 17, 5 + charts.utility.randNum() ], [ 18, 5 + charts.utility.randNum() ], [ 19, 2 + charts.utility.randNum() ], [ 20, 2 + charts.utility.randNum() ], [ 21, 3 + charts.utility.randNum() ], [ 22, 3 + charts.utility.randNum() ], [ 23, 3 + charts.utility.randNum() ], [ 24, 2 + charts.utility.randNum() ], [ 25, 4 + charts.utility.randNum() ], [ 26, 4 + charts.utility.randNum() ], [ 27, 5 + charts.utility.randNum() ], [ 28, 2 + charts.utility.randNum() ], [ 29, 2 + charts.utility.randNum() ], [ 30, 3 + charts.utility.randNum() ] ];

            // make chart
            this.plot = $.plot(
                wrapper,
                [ {
                    label: "Visits",
                    data: this.data.d1
                },
                {
                    label: "Unique Visits",
                    data: this.data.d2
                } ],
                this.options
            );
        }
    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkFlotChartLines1 = function () {

        if (! this.length) return;

        charts.chart_lines_fill_nopoints.init(this);

    };

    $('[data-toggle="flot-chart-lines-1"]').tkFlotChartLines1();

})(jQuery);
},{"../lib/_skin":"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js","./_helper":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_helper.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_line_fill_nopoints_2.js":[function(require,module,exports){
(function ($) {

    var skin = require('../lib/_skin')();
    var charts = require('./_helper');

    if (typeof charts == 'undefined')
        return;

    charts.chart_lines_fill_nopoints_2 =
    {
        // chart data
        data: {
            d1: []
        },

        // will hold the chart object
        plot: null,

        // chart options
        options: {
            colors: [ config.skins[ skin ][ 'primary-color' ] ],
            grid: {
                color: colors[ 'default-light-color' ],
                borderWidth: 1,
                borderColor: "transparent",
                clickable: true,
                hoverable: true
            },
            series: {
                grow: {active: false},
                lines: {
                    show: true,
                    fill: false,
                    lineWidth: 5,
                    steps: false,
                    color: config.skins[ skin ][ 'primary-color' ]
                },
                points: {show: false}
            },
            legend: {position: "nw", backgroundColor: null, backgroundOpacity: 0},
            yaxis: {
                ticks: 3,
                tickSize: 40,
                tickFormatter: function (val, axis) {
                    return val + "k";
                }
            },
            xaxis: {
                ticks: 4,
                tickDecimals: 0,
                tickColor: 'transparent'
            },
            shadowSize: 0,
            tooltip: true,
            tooltipOpts: {
                content: "%s : %y.0",
                shifts: {
                    x: - 30,
                    y: - 50
                },
                defaultTheme: false
            }
        },

        // initialize
        init: function (wrapper) {

            if (! wrapper.length) return;

            // generate some data
            this.data.d1 = [ [ 1, 3 + charts.utility.randNum() ], [ 2, 6 + charts.utility.randNum() ], [ 3, 30 + charts.utility.randNum() ], [ 4, 110 + charts.utility.randNum() ], [ 5, 80 + charts.utility.randNum() ], [ 6, 18 + charts.utility.randNum() ], [ 7, 50 + charts.utility.randNum() ], [ 8, 15 + charts.utility.randNum() ], [ 9, 18 + charts.utility.randNum() ], [ 10, 60 + charts.utility.randNum() ], [ 11, 110 + charts.utility.randNum() ], [ 12, 27 + charts.utility.randNum() ], [ 13, 30 + charts.utility.randNum() ], [ 14, 33 + charts.utility.randNum() ], [ 15, 24 + charts.utility.randNum() ], [ 16, 80 + charts.utility.randNum() ], [ 17, 30 + charts.utility.randNum() ], [ 18, 33 + charts.utility.randNum() ], [ 19, 36 + charts.utility.randNum() ], [ 20, 39 + charts.utility.randNum() ], [ 21, 42 + charts.utility.randNum() ], [ 22, 70 + charts.utility.randNum() ], [ 23, 36 + charts.utility.randNum() ], [ 24, 39 + charts.utility.randNum() ], [ 25, 42 + charts.utility.randNum() ], [ 26, 45 + charts.utility.randNum() ], [ 27, 60 + charts.utility.randNum() ], [ 28, 51 + charts.utility.randNum() ], [ 29, 55 + charts.utility.randNum() ], [ 30, 100 + charts.utility.randNum() ] ];

            // make chart
            this.plot = $.plot(
                wrapper,
                [ {
                    label: "Net Revenue",
                    data: this.data.d1
                } ],
                this.options
            );
        }
    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkFlotChartLines2 = function () {

        if (! this.length) return;

        charts.chart_lines_fill_nopoints_2.init(this);

    };

    $('[data-toggle="flot-chart-lines-2"]').tkFlotChartLines2();

})(jQuery);
},{"../lib/_skin":"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js","./_helper":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_helper.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_mixed.js":[function(require,module,exports){
(function ($) {

    var skin = require('../lib/_skin')();
    var charts = require('./_helper');

    if (typeof charts == 'undefined')
        return;

    charts.chart_mixed_1 =
    {
        // chart data
        data: {
            d1: []
        },

        // will hold the chart object
        plot: null,

        // chart options
        options: {
            colors: [ "#dedede", config.skins[ skin ][ 'primary-color' ] ],
            grid: {
                color: "#dedede",
                borderWidth: 1,
                borderColor: "transparent",
                clickable: true,
                hoverable: true
            },
            series: {
                grow: {active: false},
                lines: {
                    show: true,
                    fill: false,
                    lineWidth: 2,
                    steps: false,
                    color: config.skins[ skin ][ 'primary-color' ]
                },
                points: {show: false}
            },
            legend: {position: "nw", backgroundColor: null, backgroundOpacity: 0},
            yaxis: {
                ticks: 3,
                tickSize: 40,
                tickFormatter: function (val, axis) {
                    return val + "k";
                }
            },
            xaxis: {ticks: 4, tickDecimals: 0, tickColor: 'transparent'},
            shadowSize: 0,
            tooltip: true,
            tooltipOpts: {
                content: "%s : %y.0",
                shifts: {
                    x: - 30,
                    y: - 50
                },
                defaultTheme: false
            }
        },

        // initialize
        init: function (wrapper) {

            if (! wrapper.length) return;

            // generate some data
            this.data.d1 = [ [ 1, 3 + charts.utility.randNum() ], [ 2, 6 + charts.utility.randNum() ], [ 3, 30 + charts.utility.randNum() ], [ 4, 110 + charts.utility.randNum() ], [ 5, 80 + charts.utility.randNum() ], [ 6, 18 + charts.utility.randNum() ], [ 7, 50 + charts.utility.randNum() ], [ 8, 15 + charts.utility.randNum() ], [ 9, 18 + charts.utility.randNum() ], [ 10, 60 + charts.utility.randNum() ], [ 11, 110 + charts.utility.randNum() ], [ 12, 27 + charts.utility.randNum() ], [ 13, 30 + charts.utility.randNum() ] ];

            // make chart
            this.plot = $.plot(
                wrapper,
                [ {
                    label: "Net Revenue",
                    data: this.data.d1,
                    bars: {show: true, fill: 1, barWidth: 0.75, align: "center"}
                },
                {
                    data: this.data.d1,
                    lines: {show: true, fill: false},
                    points: {
                        show: true,
                        radius: 5,
                        symbol: "circle",
                        fill: true,
                        fillColor: config.skins[ skin ][ 'primary-color' ],
                        borderColor: "#fff"
                    }
                } ],
                this.options
            );
        }
    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkFlotChartMixed = function () {

        if (! this.length) return;

        charts.chart_mixed_1.init(this);

    };

    $('[data-toggle="flot-chart-mixed"]').tkFlotChartMixed();

})(jQuery);
},{"../lib/_skin":"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js","./_helper":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_helper.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_pie.js":[function(require,module,exports){
(function ($) {

    var charts = require('./_helper');

    if (typeof charts == 'undefined')
        return;

    charts.chart_pie =
    {
        // chart data
        data: [
            {label: "USA", data: 38},
            {label: "Brazil", data: 23},
            {label: "India", data: 15},
            {label: "Turkey", data: 9},
            {label: "France", data: 7},
            {label: "China", data: 5},
            {label: "Germany", data: 3}
        ],

        // will hold the chart object
        plot: null,

        // chart options
        options: {
            series: {
                pie: {
                    show: true,
                    highlight: {
                        opacity: 0.1
                    },
                    radius: 1,
                    stroke: {
                        color: '#fff',
                        width: 2
                    },
                    startAngle: 2,
                    combine: {
                        color: '#353535',
                        threshold: 0.05
                    },
                    label: {
                        show: true,
                        radius: 1,
                        formatter: function (label, series) {
                            return '<div class="label label-default">' + label + '&nbsp;' + Math.round(series.percent) + '%</div>';
                        }
                    }
                },
                grow: {active: false}
            },
            colors: [],
            legend: {show: false},
            grid: {
                hoverable: true,
                clickable: true,
                backgroundColor: {}
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : %y.1" + "%",
                shifts: {
                    x: - 30,
                    y: - 50
                },
                defaultTheme: false
            }
        },

        // initialize
        init: function (wrapper) {

            if (! wrapper.length) return;

            // apply styling
            charts.utility.applyStyle(this);

            this.plot = $.plot(wrapper, this.data, this.options);
        }
    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkFlotChartPie = function () {

        if (! this.length) return;

        charts.chart_pie.init(this);

    };

    $('[data-toggle="flot-chart-pie"]').tkFlotChartPie();

})(jQuery);
},{"./_helper":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_helper.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_simple.js":[function(require,module,exports){
(function ($) {

    var skin = require('../lib/_skin')();
    var charts = require('./_helper');

    if (typeof charts == 'undefined')
        return;

    charts.chart_simple =
    {
        // data
        data: {
            sin: [],
            cos: []
        },

        // will hold the chart object
        plot: null,

        // chart options
        options: {
            colors: [ config.skins[ skin ][ 'primary-color' ], colors[ 'default-color' ] ],
            grid: {
                color: colors[ 'default-light-color' ],
                borderWidth: 1,
                borderColor: "transparent",
                clickable: true,
                hoverable: true
            },
            series: {
                grow: {active: false},
                lines: {
                    show: true,
                    fill: false,
                    lineWidth: 4,
                    steps: false
                },
                points: {
                    show: true,
                    radius: 5,
                    symbol: "circle",
                    fill: true,
                    borderColor: "#fff"
                }
            },
            legend: {position: "se", backgroundColor: null, backgroundOpacity: 0, noColumns: 2},
            shadowSize: 0,
            yaxis: {ticks: 3},
            xaxis: {ticks: 4, tickDecimals: 0, tickColor: 'transparent'},
            tooltip: true, //activate tooltip
            tooltipOpts: {
                content: "%s : %y.3",
                shifts: {
                    x: - 30,
                    y: - 50
                },
                defaultTheme: false
            }
        },

        // initialize
        init: function (wrapper) {

            if (! wrapper.length) return;

            if (this.plot === null) {
                for (var i = 0; i < 14; i += 0.5) {
                    this.data.sin.push([ i, Math.sin(i) ]);
                    this.data.cos.push([ i, Math.cos(i) ]);
                }
            }
            this.plot = $.plot(
                wrapper,
                [ {
                    label: "Sin",
                    data: this.data.sin,
                    lines: {fillColor: colors[ 'default-color' ]},
                    points: {fillColor: "#fff"}
                },
                {
                    label: "Cos",
                    data: this.data.cos,
                    lines: {fillColor: "#444"},
                    points: {fillColor: "#fff"}
                } ],
                this.options
            );
        }
    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkFlotChartSimple = function () {

        if (! this.length) return;

        charts.chart_simple.init(this);

    };

    $('[data-toggle="flot-chart-simple"]').tkFlotChartSimple();

})(jQuery);
},{"../lib/_skin":"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js","./_helper":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_helper.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/main.js":[function(require,module,exports){
require('./_simple');
require('./_mixed');
require('./_line');
require('./_horizontal');
require('./_line_fill_nopoints');
require('./_line_fill_nopoints_2');
require('./_bars-ordered');
require('./_donut');
require('./_bars-stacked');
require('./_pie');
require('./_autoupdate');
},{"./_autoupdate":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_autoupdate.js","./_bars-ordered":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_bars-ordered.js","./_bars-stacked":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_bars-stacked.js","./_donut":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_donut.js","./_horizontal":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_horizontal.js","./_line":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_line.js","./_line_fill_nopoints":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_line_fill_nopoints.js","./_line_fill_nopoints_2":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_line_fill_nopoints_2.js","./_mixed":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_mixed.js","./_pie":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_pie.js","./_simple":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_simple.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js":[function(require,module,exports){
module.exports = (function () {
    var skin = $.cookie('skin');

    if (typeof skin == 'undefined') {
        skin = 'default';
    }
    return skin;
});
},{}],"/Code/html/themes/learning-1.1.0/lib/charts/js/main.js":[function(require,module,exports){
require('./morris/main');
require('./sparkline/main');
require('./flot/main');
require('./easy-pie/main');

},{"./easy-pie/main":"/Code/html/themes/learning-1.1.0/lib/charts/js/easy-pie/main.js","./flot/main":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/main.js","./morris/main":"/Code/html/themes/learning-1.1.0/lib/charts/js/morris/main.js","./sparkline/main":"/Code/html/themes/learning-1.1.0/lib/charts/js/sparkline/main.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/morris/_area.js":[function(require,module,exports){
(function ($) {
    "use strict";

    $.fn.tkMorrisChartArea = function () {

        if (! this.length) return;

        if (! this.attr('id')) return;

        var skin = require('../lib/_skin')();

        this.empty();

        new Morris.Area({
            lineColors: [ config.skins[ skin ][ 'primary-color' ], colors[ 'danger-color' ] ],
            pointFillColors: config.skins[ skin ][ 'primary-color' ],
            fillOpacity: '0.3',
            element: this.attr('id'),
            data: [
                {y: '1.1.', a: 30, b: 90},
                {y: '2.1.', a: 35, b: 65},
                {y: '3.1.', a: 50, b: 40},
                {y: '4.1.', a: 75, b: 65},
                {y: '5.1.', a: 50, b: 40},
                {y: '6.1.', a: 75, b: 65},
                {y: '7.1.', a: 60, b: 90}
            ],
            xkey: 'y',
            ykeys: [ 'a' ],
            labels: [ 'Series A' ],
            gridTextColor: colors[ 'default-color' ],
            gridTextWeight: 'bold',
            resize: true
        });

    };

    $(function () {

        $('[data-toggle="morris-chart-area"]').tkMorrisChartArea();

        $('[data-skin]').on('click', function () {
            $('[data-toggle="morris-chart-area"]').tkMorrisChartArea();
        });

    });

})(jQuery);
},{"../lib/_skin":"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/morris/_bar.js":[function(require,module,exports){
(function ($) {
    "use strict";

    $.fn.tkMorrisChartBar = function () {

        if (! this.length) return;

        if (! this.attr('id')) return;

        var skin = require('../lib/_skin')();

        this.empty();

        new Morris.Bar({
            barColors: [ config.skins[ skin ][ 'primary-color' ], colors[ 'default-color' ], colors[ 'danger-color' ] ],
            element: this.attr('id'),
            data: [
                {y: '2006', a: 100, b: 90, c: 40},
                {y: '2007', a: 75, b: 65, c: 100},
                {y: '2008', a: 50, b: 40, c: 30},
                {y: '2009', a: 75, b: 65, c: 85},
                {y: '2010', a: 50, b: 40, c: 45},
                {y: '2011', a: 75, b: 65, c: 90},
                {y: '2012', a: 100, b: 90, c: 80}
            ],
            gridTextColor: colors[ 'default-color' ],
            gridTextWeight: 'bold',
            resize: true,
            xkey: 'y',
            ykeys: [ 'a', 'b', 'c' ],
            labels: [ 'Series A', 'Series B', 'Series C' ]
        });
    };

    $(function () {

        $('[data-toggle="morris-chart-bar"]').tkMorrisChartBar();

        $('[data-skin]').on('click', function(){

            $('[data-toggle="morris-chart-bar"]').tkMorrisChartBar();

        });

    });

})(jQuery);

},{"../lib/_skin":"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/morris/_donut.js":[function(require,module,exports){
(function ($) {
    "use strict";

    $.fn.tkMorrisChartDonut = function () {

        if (! this.length) return;

        if (! this.attr('id')) return;

        var skin = require('../lib/_skin')();

        this.empty();

        new Morris.Donut({
            element: this.attr('id'),
            colors: [ colors[ 'danger-color' ], config.skins[ skin ][ 'primary-color' ], colors[ 'default-color' ] ],
            data: [
                {label: "Download Sales", value: 12},
                {label: "In-Store Sales", value: 30},
                {label: "Mail-Order Sales", value: 20}
            ]
        });

    };

    $(function () {

        $('[data-toggle="morris-chart-donut"]').tkMorrisChartDonut();

        $('[data-skin]').on('click', function(){

            $('[data-toggle="morris-chart-donut"]').tkMorrisChartDonut();

        });

    });

})(jQuery);
},{"../lib/_skin":"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/morris/_line.js":[function(require,module,exports){
(function ($) {
    "use strict";

    $.fn.tkMorrisChartLine = function () {

        if (! this.length) return;

        if (! this.attr('id')) return;

        var skin = require('../lib/_skin')();

        this.empty();

        new Morris.Line({
            lineColors: [ config.skins[ skin ][ 'primary-color' ], colors[ 'danger-color' ] ],
            pointFillColors: [ config.skins[ skin ][ 'primary-color' ], colors[ 'danger-color' ] ],
            pointStrokeColors: [ '#ffffff', '#ffffff' ],
            gridTextColor: colors[ 'default-color' ],
            gridTextWeight: 'bold',

            // ID of the element in which to draw the chart.
            element: this.attr('id'),
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
            data: [
                {date: '2014-02', a: 2000, b: 2400},
                {date: '2014-03', a: 1200, b: 2500},
                {date: '2014-04', a: 3200, b: 2000},
                {date: '2014-05', a: 1600, b: 1440},
                {date: '2014-06', a: 1290, b: 2830},
                {date: '2014-07', a: 1930, b: 1200},
                {date: '2014-08', a: 2120, b: 3000}
            ],
            // The name of the data record attribute that contains x-values.
            xkey: 'date',
            // A list of names of data record attributes that contain y-values.
            ykeys: [ 'a', 'b' ],
            // Labels for the ykeys -- will be displayed when you hover over the
            // chart.
            labels: [ 'Series A', 'Series B' ],
            resize: true
        });

    };

    $(function () {

        $('[data-toggle="morris-chart-line"]').tkMorrisChartLine();

        $('[data-skin]').on('click', function(){

            $('[data-toggle="morris-chart-line"]').tkMorrisChartLine();

        });

    });

})(jQuery);
},{"../lib/_skin":"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/morris/main.js":[function(require,module,exports){
require('./_area');
require('./_bar');
require('./_donut');
require('./_line');
},{"./_area":"/Code/html/themes/learning-1.1.0/lib/charts/js/morris/_area.js","./_bar":"/Code/html/themes/learning-1.1.0/lib/charts/js/morris/_bar.js","./_donut":"/Code/html/themes/learning-1.1.0/lib/charts/js/morris/_donut.js","./_line":"/Code/html/themes/learning-1.1.0/lib/charts/js/morris/_line.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/sparkline/_sparkline.js":[function(require,module,exports){
(function ($) {
    "use strict";

    var skin = require('../lib/_skin')();

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkSparkLine = function () {

        if (! this.length) return;

        this.sparkline(
            this.data('data') || "html", {
                type: 'line',
                height: '24',
                width: '100%',
                spotRadius: '3.2',
                spotColor: config.skins[ skin ][ 'primary-color' ],
                minSpotColor: config.skins[ skin ][ 'primary-color' ],
                maxSpotColor: config.skins[ skin ][ 'primary-color' ],
                highlightSpotColor: colors[ 'danger-color' ],
                lineWidth: '2',
                lineColor: config.skins[ skin ][ 'primary-color' ],
                fillColor: colors[ 'body-bg' ]
            }
        );

    };

    $.fn.tkSparkBar = function () {

        if (! this.length) return;

        this.text(this.find('span').text());

        this.sparkline(
            this.data('data') || "html", {
                type: 'bar',
                height: '70',
                barWidth: 10,
                barSpacing: 8,
                zeroAxis: false,
                stackedBarColor: [ config.skins[ skin ][ 'primary-color' ], colors[ 'default-light-color' ] ],
                colorMap: this.data('colors') ? [ config.skins[ skin ][ 'primary-color' ], colors[ 'success-color' ], colors[ 'danger-color' ], colors[ 'default-light-color' ] ] : [],
                enableTagOptions: true
            }
        );

    };

    $(".sparkline-bar").each(function () {
        $(this).tkSparkBar();
    });

    $(".sparkline-line").each(function () {
        $(this).tkSparkLine();
    });

})(jQuery);
},{"../lib/_skin":"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js"}],"/Code/html/themes/learning-1.1.0/lib/charts/js/sparkline/main.js":[function(require,module,exports){
require('./_sparkline');

},{"./_sparkline":"/Code/html/themes/learning-1.1.0/lib/charts/js/sparkline/_sparkline.js"}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_bootstrap-carousel.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkCarousel = function () {

        if (! this.length) return;

        this.carousel();

        this.find('[data-slide]').click(function (e) {
            e.preventDefault();
        });

    };

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_bootstrap-collapse.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkCollapse = function () {

        if (! this.length) return;

        var target = this.attr('href') || this.attr('target');
        if (! target) return;

        this.click(function(e){
            e.preventDefault();
        });

        $(target).collapse({toggle: false});

    };

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_bootstrap-modal.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkModal = function () {

        if (! this.length) return;

        var target = this.attr('href') || this.attr('target');
        if (! target) return;

        this.click(function (e) {
            e.preventDefault();
        });

        $(target).modal({show: false});

    };

    /**
     * Modal creator for the demo page.
     * Allows to explore different modal types.
     * For demo purposes only.
     */

    // Process the modal via Handlebars templates
    var modal = function (options) {
        var source = $("#" + options.template).html();
        var template = Handlebars.compile(source);
        return template(options);
    };

    var randomId = function () {
        /** @return String */
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };

    $.fn.tkModalDemo = function () {

        if (! this.length) return;

        var targetId = this.attr('href') || this.attr('target'),
            target = $(targetId);

        if (! targetId) {
            targetId = randomId();
            this.attr('data-target', '#' + targetId);
        }

        targetId.replace('#', '');

        if (! target.length) {
            target = $(modal({
                id: targetId,
                template: this.data('template') || 'tk-modal-demo',
                modalOptions: this.data('modalOptions') || '',
                dialogOptions: this.data('dialogOptions') || '',
                contentOptions: this.data('contentOptions') || ''
            }));
            $('body').append(target);
            target.modal({show: false});
        }

        this.click(function (e) {
            e.preventDefault();
            target.modal('toggle');
        });

    };

    $('[data-toggle="tk-modal-demo"]').each(function () {
        $(this).tkModalDemo();
    });

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_bootstrap-switch.js":[function(require,module,exports){
(function ($) {
    "use strict";

    $('[data-toggle="switch-checkbox"]').each(function () {

        $(this).bootstrapSwitch({
            offColor: 'danger'
        });

    });

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_check-all.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkCheckAll = function(){

        if (! this.length) return;

        this.on('click', function () {
            $($(this).data('target')).find(':checkbox').prop('checked', this.checked);
        });

    };

    // Check All Checkboxes
    $('[data-toggle="check-all"]').tkCheckAll();

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_cover.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
     * images to fit into a certain area.
     *
     * @param {Number} srcWidth Source area width
     * @param {Number} srcHeight Source area height
     * @param {Number} maxWidth Fittable area maximum available width
     * @param {Number} maxHeight Fittable area maximum available height
     * @return {Object} { width, heigth }
     */
    var aspectRatioFit = function (srcWidth, srcHeight, maxWidth, maxHeight) {

        var wRatio = maxWidth / srcWidth,
            hRatio = maxHeight / srcHeight,
            width = srcWidth,
            height = srcHeight;

        if (srcWidth / maxWidth < srcHeight / maxHeight) {
            width = maxWidth;
            height = srcHeight * wRatio;
        } else {
            width = srcWidth * hRatio;
            height = maxHeight;
        }

        return {width: width, height: height};
    };

    $.fn.tkCover = function () {

        if (! this.length) return;

        this.filter(':visible').not('[class*="height"]').each(function () {
            var t = $(this),
                i = t.find('img:first');

            if (i.length) {
                $.loadImage(i.attr('src')).done(function (img) {
                    t.height(i.height());
                    $('.overlay-full', t).innerHeight(i.height());
                    $(document).trigger('domChanged');
                });
            }
            else {
                i = t.find('.img:first');
                t.height(i.height());
                $('.overlay-full', t).innerHeight(i.height());
                $(document).trigger('domChanged');
            }
        });

        this.filter(':visible').filter('[class*="height"]').each(function () {
            var t = $(this),
                img = t.find('img') || t.find('.img');

            img.each(function () {
                var i = $(this);
                if (i.data('autoSize') === false) {
                    return true;
                }
                if (i.is('img')) {
                    $.loadImage(i.attr('src')).done(function (img) {
                        i.removeAttr('style');
                        i.css(aspectRatioFit(i.width(), i.height(), t.width(), t.height()));
                    });
                }
                else {
                    i.removeAttr('style');
                    i.css(aspectRatioFit(i.width(), i.height(), t.width(), t.height()));
                }
            });
        });

    };

    function height() {

        $('.cover.overlay').each(function () {
            $(this).tkCover();
        });

    }

    $(document).ready(height);
    $(window).on('load', height);

    var t;
    $(window).on("debouncedresize", function () {
        clearTimeout(t);
        t = setTimeout(height, 200);
    });

})(jQuery);

},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_datepicker.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkDatePicker = function () {

        if (! this.length) return;

        if (typeof $.fn.datepicker != 'undefined') {

            this.datepicker();

        }

    };

    $('.datepicker').tkDatePicker();

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_daterangepicker.js":[function(require,module,exports){
(function ($) {
    "use strict";

    $.fn.tkDaterangepickerReport = function () {
        var e = this;
        this.daterangepicker(
            {
                ranges: {
                    'Today': [ moment(), moment() ],
                    'Yesterday': [ moment().subtract('days', 1), moment().subtract('days', 1) ],
                    'Last 7 Days': [ moment().subtract('days', 6), moment() ],
                    'Last 30 Days': [ moment().subtract('days', 29), moment() ],
                    'This Month': [ moment().startOf('month'), moment().endOf('month') ],
                    'Last Month': [ moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month') ]
                },
                startDate: moment().subtract('days', 29),
                endDate: moment()
            },
            function (start, end) {
                var output = start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY');
                e.find('span').html(output);
            }
        );
    };

    $.fn.tkDaterangepickerReservation = function () {
        this.daterangepicker({
            timePicker: true,
            timePickerIncrement: 30,
            format: 'MM/DD/YYYY h:mm A'
        });
    };

    $('.daterangepicker-report').tkDaterangepickerReport();

    $('.daterangepicker-reservation').tkDaterangepickerReservation();

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_expandable.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     * @todo: Angular directive.
     */
    $.fn.tkExpandable = function () {

        if (! this.length) return;

        this.find('.expandable-content').append('<div class="expandable-indicator"><i></i></div>');

    };

    $('.expandable').each(function () {
        $(this).tkExpandable();
    });

    $('body').on('click', '.expandable-indicator', function(){
        $(this).closest('.expandable').toggleClass('expandable-open');
    });

    $('body').on('click', '.expandable-trigger:not(.expandable-open)', function(){
        $(this).addClass('expandable-open');
    });

}(jQuery));
},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_iframe.js":[function(require,module,exports){
(function () {
    "use strict";

    // if we're inside an iframe, reload without iframe
    if (window.location != window.parent.location)
        top.location.href = document.location.href;

})();

},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_minicolors.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     * @todo: Angular directive.
     */
    $.fn.tkMiniColors = function () {

        if (! this.length) return;

        if (typeof $.fn.minicolors != 'undefined') {

            this.minicolors({
                control: this.attr('data-control') || 'hue',
                defaultValue: this.attr('data-defaultValue') || '',
                inline: this.attr('data-inline') === 'true',
                letterCase: this.attr('data-letterCase') || 'lowercase',
                opacity: this.attr('data-opacity'),
                position: this.attr('data-position') || 'bottom left',
                change: function (hex, opacity) {
                    if (! hex) return;
                    if (opacity) hex += ', ' + opacity;
                    if (typeof console === 'object') {
                        console.log(hex);
                    }
                },
                theme: 'bootstrap'
            });

        }

    };

    $('.minicolors').each(function () {

        $(this).tkMiniColors();

    });

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_nestable.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     * @todo: Angular directive.
     */
    $.fn.tkNestable = function () {

        if (! this.length) return;

        if (typeof $.fn.nestable != 'undefined') {

            this.nestable({
                rootClass: 'nestable',
                listNodeName: 'ul',
                listClass: 'nestable-list',
                itemClass: 'nestable-item',
                dragClass: 'nestable-drag',
                handleClass: 'nestable-handle',
                collapsedClass: 'nestable-collapsed',
                placeClass: 'nestable-placeholder',
                emptyClass: 'nestable-empty'
            });

        }

    };

    $('.nestable').tkNestable();

})(jQuery);

},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_panel-collapse.js":[function(require,module,exports){
(function ($) {
    "use strict";

    var randomId = function() {
        /** @return String */
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkPanelCollapse = function () {

        if (! this.length) return;

        var body = $('.panel-body', this),
            id = body.attr('id') || randomId(),
            collapse = $('<div/>');

        collapse
            .attr('id', id)
            .addClass('collapse' + (this.data('open') ? ' in' : ''))
            .append(body.clone());

        body.remove();

        $(this).append(collapse);

        $('.panel-collapse-trigger', this)
            .attr('data-toggle', 'collapse' )
            .attr('data-target', '#' + id)
            .collapse({ trigger: false });

    };

    $('[data-toggle="panel-collapse"]').each(function(){
        $(this).tkPanelCollapse();
    });

})(jQuery);

},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_progress-bars.js":[function(require,module,exports){
(function ($) {

    // Progress Bar Animation
    $('.progress-bar').each(function () {
        $(this).width($(this).attr('aria-valuenow') + '%');
    });

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_select2.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkSelect2 = function () {

        if (! this.length) return;

        if (typeof $.fn.select2 != 'undefined') {

            var t = this,
                options = {
                    allowClear: t.data('allowClear')
                };

            if (t.is('button')) return true;
            if (t.is('input[type="button"]')) return true;

            if (t.is('[data-toggle="select2-tags"]')) {
                options.tags = t.data('tags').split(',');
            }

            t.select2(options);

        }

    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkSelect2Enable = function () {

        if (! this.length) return;

        if (typeof $.fn.select2 != 'undefined') {

            this.click(function () {
                $($(this).data('target')).select2("enable");
            });

        }

    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkSelect2Disable = function () {

        if (! this.length) return;

        if (typeof $.fn.select2 != 'undefined') {

            this.click(function () {
                $(this.data('target')).select2("disable");
            });

        }

    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkSelect2Flags = function () {

        if (! this.length) return;

        if (typeof $.fn.select2 != 'undefined') {

            // templating
            var format = function (state) {
                if (! state.id) return state.text;
                return "<img class='flag' src='http://select2.github.io/select2/images/flags/" + state.id.toLowerCase() + ".png'/>" + state.text;
            };

            this.select2({
                formatResult: format,
                formatSelection: format,
                escapeMarkup: function (m) {
                    return m;
                }
            });

        }

    };

    $('[data-toggle*="select2"]').each(function() {

        $(this).tkSelect2();

    });

    $('[data-toggle="select2-enable"]').tkSelect2Enable();

    $('[data-toggle="select2-disable"]').tkSelect2Disable();

    $("#select2_7").tkSelect2Flags();

})(jQuery);

},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_selectpicker.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkSelectPicker = function () {

        if (! this.length) return;

        if (typeof $.fn.selectpicker != 'undefined') {

            this.selectpicker({
                width: this.data('width') || '100%'
            });

        }

    };

    $(function () {

        $('.selectpicker').each(function () {
           $(this).tkSelectPicker();
        });

    });

})(jQuery);

},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_show-hover.js":[function(require,module,exports){
(function ($) {

    var showHover = function () {
        $('[data-show-hover]').hide().each(function () {
            var self = $(this),
                parent = $(this).data('showHover');

            self.closest(parent).on('mouseover', function (e) {
                e.stopPropagation();
                self.show();
            }).on('mouseout', function () {
                self.hide();
            });
        });
    };

    showHover();

    window.showHover = showHover;

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_skin.js":[function(require,module,exports){
module.exports=require("/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js")
},{"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js":"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js"}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_slider.js":[function(require,module,exports){
(function ($) {
    "use strict";

    var bars = function(el){
        $('.slider-handle', el).html('<i class="fa fa-bars fa-rotate-90"></i>');
    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkSlider = function () {

        if (! this.length) return;

        if (typeof $.fn.slider != 'undefined') {

            this.slider();

            bars(this);

        }

    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkSliderFormatter = function () {

        if (! this.length) return;

        if (typeof $.fn.slider != 'undefined') {

            this.slider({
                formatter: function (value) {
                    return 'Current value: ' + value;
                }
            });

            bars(this);

        }

    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkSliderUpdate = function () {

        if (! this.length) return;

        if (typeof $.fn.slider != 'undefined') {

            this.on("slide", function (slideEvt) {
                $(this.attr('data-on-slide')).text(slideEvt.value);
            });

            bars(this);

        }

    };

    $('[data-slider="default"]').tkSlider();

    $('[data-slider="formatter"]').tkSliderFormatter();

    $('[data-on-slide]').tkSliderUpdate();

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_summernote.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkSummernote = function () {

        if (! this.length) return;

        if (typeof $.fn.summernote != 'undefined') {

            this.summernote({
                height: 300
            });

        }

    };

    $(function () {

        $('.summernote').each(function () {
           $(this).tkSummernote();
        });

    });

})(jQuery);

},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_tables.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkDataTable = function(){

        if (! this.length) return;

        if (typeof $.fn.dataTable != 'undefined') {

            this.dataTable();

        }

    };

    $('[data-toggle="data-table"]').tkDataTable();

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_tabs.js":[function(require,module,exports){
(function ($) {

    var skin = require('./_skin')();

    $('.tabbable .nav-tabs').each(function(){
        var tabs = $(this).niceScroll({
            cursorborder: 0,
            cursorcolor: config.skins[ skin ][ 'primary-color' ],
            horizrailenabled: true,
            oneaxismousemode: true
        });

        var _super = tabs.getContentSize;
        tabs.getContentSize = function() {
            var page = _super.call(tabs);
            page.h = tabs.win.height();
            return page;
        };
    });

    $('[data-scrollable]').getNiceScroll().resize();

    $('.tabbable .nav-tabs a').on('shown.bs.tab', function(e){
        var tab = $(this).closest('.tabbable');
        var target = $(e.target),
            targetPane = target.attr('href') || target.data('target');

        // refresh tabs with horizontal scroll
        tab.find('.nav-tabs').getNiceScroll().resize();

        // refresh [data-scrollable] within the activated tab pane
        $(targetPane).find('[data-scrollable]').getNiceScroll().resize();
    });

}(jQuery));
},{"./_skin":"/Code/html/themes/learning-1.1.0/lib/essential/js/_skin.js"}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_tooltip.js":[function(require,module,exports){
(function ($) {
    "use strict";

    // Tooltip
    $("body").tooltip({selector: '[data-toggle="tooltip"]', container: "body"});

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_touchspin.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkTouchSpin = function () {

        if (! this.length) return;

        if (typeof $.fn.TouchSpin != 'undefined') {

            this.TouchSpin();

        }

    };

    $('[data-toggle="touch-spin"]').tkTouchSpin();

}(jQuery));
},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_tree.js":[function(require,module,exports){
(function ($) {

    var tree_glyph_options = {
        map: {
            checkbox: "fa fa-square-o",
            checkboxSelected: "fa fa-check-square",
            checkboxUnknown: "fa fa-check-square fa-muted",
            error: "fa fa-exclamation-triangle",
            expanderClosed: "fa fa-caret-right",
            expanderLazy: "fa fa-angle-right",
            expanderOpen: "fa fa-caret-down",
            doc: "fa fa-file-o",
            noExpander: "",
            docOpen: "fa fa-file",
            loading: "fa fa-refresh fa-spin",
            folder: "fa fa-folder",
            folderOpen: "fa fa-folder-open"
        }
    },
    tree_dnd_options = {
        autoExpandMS: 400,
            focusOnClick: true,
            preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
            preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
            dragStart: function(node, data) {
            /** This function MUST be defined to enable dragging for the tree.
             *  Return false to cancel dragging of node.
             */
            return true;
        },
        dragEnter: function(node, data) {
            /** data.otherNode may be null for non-fancytree droppables.
             *  Return false to disallow dropping on node. In this case
             *  dragOver and dragLeave are not called.
             *  Return 'over', 'before, or 'after' to force a hitMode.
             *  Return ['before', 'after'] to restrict available hitModes.
             *  Any other return value will calc the hitMode from the cursor position.
             */
            // Prevent dropping a parent below another parent (only sort
            // nodes under the same parent)
            /*
            if(node.parent !== data.otherNode.parent){
                return false;
            }
            // Don't allow dropping *over* a node (would create a child)
            return ["before", "after"];
            */
            return true;
        },
        dragDrop: function(node, data) {
            /** This function MUST be defined to enable dropping of items on
             *  the tree.
             */
            data.otherNode.moveTo(node, data.hitMode);
        }
    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkFancyTree = function(){

        if (! this.length) return;

        if (typeof $.fn.fancytree == 'undefined') return;

        var extensions = [ "glyph" ];
        if (typeof this.attr('data-tree-dnd') !== "undefined") {
            extensions.push( "dnd" );
        }
        this.fancytree({
            extensions: extensions,
            glyph: tree_glyph_options,
            dnd: tree_dnd_options,
            clickFolderMode: 3,
            checkbox: typeof this.attr('data-tree-checkbox') !== "undefined" || false,
            selectMode: typeof this.attr('data-tree-select') !== "undefined" ? parseInt(this.attr('data-tree-select')) : 2
        });

    };

    // using default options
    $('[data-toggle="tree"]').each(function () {
        $(this).tkFancyTree();
    });

}(jQuery));
},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/_wizard.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkWizard = function () {

        if (! this.length) return;

        if (typeof $.fn.slick == 'undefined') return;

        var t = this,
            container = t.closest('.wizard-container');

        t.slick({
            dots: false,
            arrows: false,
            slidesToShow: 1,
            rtl: this.data('rtl'),
            slide: 'fieldset',
            onAfterChange: function (wiz, index) {
                $(document).trigger('after.wizard.step', {
                    wiz: wiz,
                    target: index,
                    container: container,
                    element: t
                });
            }
        });

        container.find('.wiz-next').click(function (e) {
            e.preventDefault();
            t.slickNext();
        });

        container.find('.wiz-prev').click(function (e) {
            e.preventDefault();
            t.slickPrev();
        });

        container.find('.wiz-step').click(function (e) {
            e.preventDefault();
            t.slickGoTo($(this).data('target'));
        });

        $(document).on('show.bs.modal', function () {
            t.closest('.modal-body').hide();
        });

        $(document).on('shown.bs.modal', function () {
            t.closest('.modal-body').show();
            t.slickSetOption('dots', false, true);
        });

    };

    $('[data-toggle="wizard"]').each(function () {
        $(this).tkWizard();
    });

    /**
     * By leveraging events we can hook into the wizard to add functionality.
     * This example updates the progress bar after the wizard step changes.
     */
    $(document).on('after.wizard.step', function (event, data) {

        if (data.container.is('#wizard-demo-1')) {

            var target = data.container.find('.wiz-progress li:eq(' + data.target + ')');

            data.container.find('.wiz-progress li').removeClass('active complete');

            target.addClass('active');

            target.prevAll().addClass('complete');

        }

    });

}(jQuery));
},{}],"/Code/html/themes/learning-1.1.0/lib/essential/js/main.js":[function(require,module,exports){
require('./_tabs');
require('./_tree');
require('./_show-hover');
require('./_daterangepicker');
require('./_expandable');
require('./_nestable');
require('./_cover');
require('./_tooltip');
require('./_tables');
require('./_check-all');
require('./_progress-bars');
require('./_iframe');
require('./_bootstrap-collapse');
require('./_bootstrap-carousel');
require('./_bootstrap-modal');
require('./_panel-collapse');

// Forms
require('./_touchspin');
require('./_select2');
require('./_slider');
require('./_selectpicker');
require('./_datepicker');
require('./_minicolors');
require('./_bootstrap-switch');
require('./_wizard');
require('./_summernote');
},{"./_bootstrap-carousel":"/Code/html/themes/learning-1.1.0/lib/essential/js/_bootstrap-carousel.js","./_bootstrap-collapse":"/Code/html/themes/learning-1.1.0/lib/essential/js/_bootstrap-collapse.js","./_bootstrap-modal":"/Code/html/themes/learning-1.1.0/lib/essential/js/_bootstrap-modal.js","./_bootstrap-switch":"/Code/html/themes/learning-1.1.0/lib/essential/js/_bootstrap-switch.js","./_check-all":"/Code/html/themes/learning-1.1.0/lib/essential/js/_check-all.js","./_cover":"/Code/html/themes/learning-1.1.0/lib/essential/js/_cover.js","./_datepicker":"/Code/html/themes/learning-1.1.0/lib/essential/js/_datepicker.js","./_daterangepicker":"/Code/html/themes/learning-1.1.0/lib/essential/js/_daterangepicker.js","./_expandable":"/Code/html/themes/learning-1.1.0/lib/essential/js/_expandable.js","./_iframe":"/Code/html/themes/learning-1.1.0/lib/essential/js/_iframe.js","./_minicolors":"/Code/html/themes/learning-1.1.0/lib/essential/js/_minicolors.js","./_nestable":"/Code/html/themes/learning-1.1.0/lib/essential/js/_nestable.js","./_panel-collapse":"/Code/html/themes/learning-1.1.0/lib/essential/js/_panel-collapse.js","./_progress-bars":"/Code/html/themes/learning-1.1.0/lib/essential/js/_progress-bars.js","./_select2":"/Code/html/themes/learning-1.1.0/lib/essential/js/_select2.js","./_selectpicker":"/Code/html/themes/learning-1.1.0/lib/essential/js/_selectpicker.js","./_show-hover":"/Code/html/themes/learning-1.1.0/lib/essential/js/_show-hover.js","./_slider":"/Code/html/themes/learning-1.1.0/lib/essential/js/_slider.js","./_summernote":"/Code/html/themes/learning-1.1.0/lib/essential/js/_summernote.js","./_tables":"/Code/html/themes/learning-1.1.0/lib/essential/js/_tables.js","./_tabs":"/Code/html/themes/learning-1.1.0/lib/essential/js/_tabs.js","./_tooltip":"/Code/html/themes/learning-1.1.0/lib/essential/js/_tooltip.js","./_touchspin":"/Code/html/themes/learning-1.1.0/lib/essential/js/_touchspin.js","./_tree":"/Code/html/themes/learning-1.1.0/lib/essential/js/_tree.js","./_wizard":"/Code/html/themes/learning-1.1.0/lib/essential/js/_wizard.js"}],"/Code/html/themes/learning-1.1.0/lib/layout/js/_async.js":[function(require,module,exports){
function contentLoaded(win, fn) {

    var done = false, top = true,

        doc = win.document,
        root = doc.documentElement,
        modern = doc.addEventListener,

        add = modern ? 'addEventListener' : 'attachEvent',
        rem = modern ? 'removeEventListener' : 'detachEvent',
        pre = modern ? '' : 'on',

        init = function (e) {
            if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
            (e.type == 'load' ? win : doc)[ rem ](pre + e.type, init, false);
            if (! done && (done = true)) fn.call(win, e.type || e);
        },

        poll = function () {
            try {
                root.doScroll('left');
            } catch (e) {
                setTimeout(poll, 50);
                return;
            }
            init('poll');
        };

    if (doc.readyState == 'complete') fn.call(win, 'lazy');
    else {
        if (! modern && root.doScroll) {
            try {
                top = ! win.frameElement;
            } catch (e) {
            }
            if (top) poll();
        }
        doc[ add ](pre + 'DOMContentLoaded', init, false);
        doc[ add ](pre + 'readystatechange', init, false);
        win[ add ](pre + 'load', init, false);
    }
}

module.exports = function(urls, callback) {

    var asyncLoader = function (urls, callback) {

        urls.foreach(function (i, file) {
            loadCss(file);
        });

        // checking for a callback function
        if (typeof callback == 'function') {
            // calling the callback
            contentLoaded(window, callback);
        }
    };

    var loadCss = function (url) {
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;
        document.getElementsByTagName('head')[ 0 ].appendChild(link);
    };

    // simple foreach implementation
    Array.prototype.foreach = function (callback) {
        for (var i = 0; i < this.length; i ++) {
            callback(i, this[ i ]);
        }
    };

    asyncLoader(urls, callback);

};
},{}],"/Code/html/themes/learning-1.1.0/lib/layout/js/_breakpoints.js":[function(require,module,exports){
(function ($) {

    $(window).setBreakpoints({
        distinct: true,
        breakpoints: [ 320, 480, 768, 1024 ]
    });

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/layout/js/_gridalicious.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkGridalicious = function () {

        if (! this.length) return;

        this.gridalicious({
            gutter: this.data('gutter') || 15,
            width: this.data('width') || 370,
            selector: '> div',
            animationOptions: {
                complete: function () {
                    $(window).trigger('resize');
                }
            }
        });

    };

    $('[data-toggle*="gridalicious"]').each(function () {
        $(this).tkGridalicious();
    });

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/layout/js/_isotope.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkIsotope = function () {

        if (! this.length) return;

        this.isotope({
            layoutMode: this.data('layoutMode') || "packery",
            itemSelector: '.item'
        });

        /*
        this.isotope('on', 'layoutComplete', function(){
            $(window).trigger('resize');
        });
        */

    };

    $(function(){

        setTimeout(function () {
            $('[data-toggle="isotope"]').each(function () {
                $(this).tkIsotope();
            });
        }, 300);

        $(document).on('domChanged', function(){
            $('[data-toggle="isotope"]').each(function(){
                $(this).isotope();
            });
        });

    });

})(jQuery);

},{}],"/Code/html/themes/learning-1.1.0/lib/layout/js/_parallax.js":[function(require,module,exports){
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function () {
    var lastTime = 0;
    var vendors = [ 'ms', 'moz', 'webkit', 'o' ];
    for (var x = 0; x < vendors.length && ! window.requestAnimationFrame; ++ x) {
        window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
        window.cancelAnimationFrame = window[ vendors[ x ] + 'CancelAnimationFrame' ] || window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
    }

    if (! window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (! window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

(function ($, window) {
    "use strict";

    $.fn.tkParallax = function () {

        if (Modernizr.touch) return;

        var getOptions = function (e) {
            return {
                speed: e.data('speed') || 4,
                translate: e.data('speed') || true,
                translateWhen: e.data('translateWhen') || 'inViewportTop',
                autoOffset: e.data('autoOffset'),
                offset: e.data('offset') || 0,
                opacity: e.data('opacity')
            };
        };

        var $window = $(window),
            $windowContent = $('.st-content-inner'),
            $element = this;

        var ticking = false,
            $scrollable = null,
            lastScrollTop = 0;

        var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

        var requestTick = function (e) {
            if (! ticking) {
                $scrollable = $(e.currentTarget);
                // although Safari has support for requestAnimationFrame,
                // the animation in this case is choppy so we'll just run it directly
                if (isSafari) {
                    animate();
                } else {
                    window.requestAnimationFrame(animate);
                    ticking = true;
                }
            }
        };

        // Translates an element on the Y axis using translate3d to ensure
        // that the rendering is done by the GPU
        var translateY = function (elm, value) {
            var translate = 'translate3d(0px,' + value + 'px, 0px)';
            elm.style[ '-webkit-transform' ] = translate;
            elm.style[ '-moz-transform' ] = translate;
            elm.style[ '-ms-transform' ] = translate;
            elm.style[ '-o-transform' ] = translate;
            elm.style.transform = translate;
        };

        var layers = $element.find('.parallax-layer');

        var init = function () {
            layers.each(function () {

                var layer = $(this),
                    layerOptions = getOptions(layer),
                    height = $element.outerHeight(true);

                if (layerOptions.translate) {
                    if (layer.is('img') && layerOptions.autoOffset) {
                        $.loadImage(layer.attr('src')).done(function () {
                            layer.removeAttr('style');
                            var layerHeight = layer.height();
                            var offset = layerHeight * 0.33;
                            if ((offset + height) > layerHeight) {
                                offset = layerHeight - height;
                            }
                            offset = offset * - 1;
                            layer.attr('data-offset', offset);
                            translateY(layer.get(0), offset);
                        });
                    }
                }

            });
        };

        init();
        $(window).on("debouncedresize", init);

        var animate = function () {
            var scrollTop = parseInt($scrollable.scrollTop());
            var scrollableTop = $scrollable.is($window) ? 0 : $scrollable.offset().top;
            var height = $element.outerHeight(true);
            var bodyPadding = {
                top: parseInt($(document.body).css('padding-top')),
                bottom: parseInt($(document.body).css('padding-bottom'))
            };
            var windowHeight = $scrollable.innerHeight();
            var windowBottom = scrollTop + windowHeight - (bodyPadding.bottom + bodyPadding.top);
            var top = $element.offset().top - scrollableTop - bodyPadding.top;
            var bottom = top + height;
            var topAbs = Math.abs(top);
            var pos = top / windowHeight * 100;
            var opacityKey = height * 0.5;
            var when = {};

            /*
             * ONLY when the scrollable element IS NOT the window
             */

            // when the element is anywhere in viewport
            when.inViewport = (bottom > 0) && (top < windowHeight);

            // when the top of the viewport is crossing the element
            when.inViewportTop = (bottom > 0) && (top < 0);

            // when the bottom of the viewport is crossing the element
            when.inViewportBottom = (bottom > 0) && (top < windowHeight) && (bottom > windowHeight);

            /*
             * ONLY when the scrollable element IS the window
             */

            if ($scrollable.is($window)) {

                // when the window is scrollable and the element is completely in the viewport
                when.inWindowViewportFull = (top >= scrollTop) && (bottom <= windowBottom);

                when.inWindowViewport2 = (top >= scrollTop) && (top <= windowBottom);

                when.inWindowViewport3 = (bottom >= scrollTop) && (bottom <= windowBottom);

                when.inWindowViewport4 = (bottom >= scrollTop) && (bottom >= windowHeight) && (height > windowHeight);

                // when the window is scrollable and the top of the viewport is crossing the element
                when.inWindowViewportTop = ! when.inWindowViewport2 && (when.inWindowViewport3 || when.inWindowViewport4);

                // when the window is scrollable and the bottom of the viewport is crossing the element
                when.inWindowViewportBottom = when.inWindowViewport2 && ! when.inWindowViewport3;

                // when the window is scrollable and the element is anywhere in viewport
                when.inWindowViewport = when.inWindowViewportTop || when.inWindowViewportBottom || when.inWindowViewportFull;

                when.inViewport = when.inWindowViewport;
                when.inViewportTop = when.inWindowViewportTop;
                when.inViewportBottom = when.inWindowViewportBottom;

                pos = (top - scrollTop) / windowHeight * 100;
            }

            if (when.inViewportTop && when.inViewportBottom) {
                when.inViewportBottom = false;
            }

            if (! isNaN(scrollTop)) {
                layers.each(function () {

                    var layer = $(this);
                    var layerOptions = getOptions(layer);

                    var ty = (windowHeight + height) - bottom;

                    if ($scrollable.is($window)) {
                        ty = windowBottom - top;
                    }

                    if (layerOptions.translate) {

                        var layerPos = (- 1 * pos * layerOptions.speed) + layerOptions.offset;
                        var layerHeight = layer.height();

                        if (when.inViewport && ! when.inViewportTop && ! when.inViewportBottom) {
                            if (layer.is('img') && layerHeight > height) {
                                if ((Math.abs(layerPos) + height) > layerHeight) {
                                    layerPos = (layerHeight - height) * - 1;
                                }
                            }
                            if (! layer.is('img')) {
                                layerPos = 0;
                            }
                        }

                        if (when.inViewportTop && ((layer.is('img') && layerHeight == height) || ! layer.is('img') )) {
                            layerPos = Math.abs(layerPos);
                        }

                        if (when.inViewportBottom && ! layer.is('img')) {
                            layerPos = height - ty;

                            // scrolling up
                            if (scrollTop < lastScrollTop) {
                                layerPos = layerPos * - 1;
                            }
                        }

                        if (when.inViewport) {
                            layerPos = (layerPos).toFixed(5);
                            if (layerHeight > $window.height() && scrollTop <= 0) {
                                layerPos = 0;
                            }
                            translateY(layer.get(0), layerPos);
                        }

                    }

                    if (layerOptions.opacity) {

                        // fade in
                        if (when.inViewportBottom) {

                            var y, yP;

                            if ($scrollable.is($window)) {

                                y = ty;
                                yP = (y / height).toFixed(5);

                                if (y > opacityKey) {
                                    layer.css({opacity: yP});
                                }
                                else {
                                    layer.css({opacity: 0});
                                }
                            }
                            else {
                                if (bottom < (windowHeight + opacityKey)) {

                                    y = (windowHeight + opacityKey) - bottom;
                                    yP = (y / opacityKey).toFixed(5);

                                    layer.css({opacity: yP});
                                } else {
                                    layer.css({opacity: 0});
                                }
                            }
                        }

                        // fade out
                        else if (when.inViewportTop) {
                            var topOrigin = $scrollable.is($window) ? scrollTop - top : topAbs;
                            if (topOrigin > opacityKey) {
                                layer.css({
                                    'opacity': (1 - (topOrigin / height)).toFixed(5)
                                });
                            } else {
                                layer.css({'opacity': 1});
                            }
                        }

                        // reset
                        else {
                            layer.css({'opacity': 1});
                        }

                        if (when.inViewportBottom && scrollTop <= 0) {
                            layer.css({'opacity': 1});
                        }

                    }

                });

                lastScrollTop = scrollTop;
            }

            ticking = false;
        };

        if ($windowContent.length) {
            $windowContent.scroll(requestTick);
        } else {
            $window.scroll(requestTick);
        }

    };

    $('.parallax').each(function () {
        $(this).tkParallax();
    });

})(jQuery, window);
},{}],"/Code/html/themes/learning-1.1.0/lib/layout/js/_scrollable.js":[function(require,module,exports){
(function ($) {
    "use strict";

    var skin = require('./_skin')();

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkScrollable = function (options) {

        if (! this.length) return;

        var settings = $.extend({
            horizontal: false
        }, options);

        var nice = this.niceScroll({
            cursorborder: 0,
            cursorcolor: config.skins[ skin ][ 'primary-color' ],
            horizrailenabled: settings.horizontal
        });

        if (! settings.horizontal) return;

        var _super = nice.getContentSize;

        nice.getContentSize = function () {
            var page = _super.call(nice);
            page.h = nice.win.height();
            return page;
        };

    };

    $('[data-scrollable]').tkScrollable();

    $('[data-scrollable-h]').each(function () {

       $(this).tkScrollable({ horizontal: true });

    });

    var t;
    $(window).on('debouncedresize', function () {
        clearTimeout(t);
        t = setTimeout(function () {
            $('[data-scrollable], [data-scrollable-h]').getNiceScroll().resize();
        }, 100);
    });

}(jQuery));
},{"./_skin":"/Code/html/themes/learning-1.1.0/lib/layout/js/_skin.js"}],"/Code/html/themes/learning-1.1.0/lib/layout/js/_sidebar-pc.js":[function(require,module,exports){
(function ($) {
    "use strict";

    $.fn.tkSidebarSizePcDemo = function(){

        var t, spc_demo = this;

        if (! spc_demo.length) return;

        $(document)
            .on('sidebar.show', function(){
                $('#pc-open').prop('disabled', true);
            })
            .on('sidebar.hidden', function(){
                $('#pc-open').prop('disabled', false);
            });

        spc_demo.on('submit', function (e) {
            e.preventDefault();
            var s = $('.sidebar'), ve = $('#pc-value'), v = ve.val();
            ve.blur();
            if (! v.length || v < 25) {
                v = 25;
                ve.val(v);
            }
            s[ 0 ].className = s[ 0 ].className.replace(/sidebar-size-([\d]+)pc/ig, 'sidebar-size-' + v + 'pc');
            sidebar.open('sidebar-menu');
            clearTimeout(t);
            t = setTimeout(function () {
                sidebar.close('sidebar-menu');
            }, 5000);
        });

    };

    $('[data-toggle="sidebar-size-pc-demo"]').tkSidebarSizePcDemo();

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/layout/js/_skin.js":[function(require,module,exports){
module.exports=require("/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js")
},{"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js":"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js"}],"/Code/html/themes/learning-1.1.0/lib/layout/js/_skins.js":[function(require,module,exports){
var asyncLoader = require('./_async');

(function ($) {

    var changeSkin = function () {
        var skin = $.cookie("skin"),
            file = $.cookie("skin-file");
        if (typeof skin != 'undefined') {
            asyncLoader([ 'css/' + file + '.min.css' ], function () {
                $('[data-skin]').removeProp('disabled').parent().removeClass('loading');
            });
        }
    };

    $('[data-skin]').on('click', function () {

        if ($(this).prop('disabled')) return;

        $('[data-skin]').prop('disabled', true);

        $(this).parent().addClass('loading');

        $.cookie("skin", $(this).data('skin'));

        $.cookie("skin-file", $(this).data('file'));

        changeSkin();

    });

    var skin = $.cookie("skin");

    if (typeof skin != 'undefined' && skin != 'default') {
        changeSkin();
    }

})(jQuery);
},{"./_async":"/Code/html/themes/learning-1.1.0/lib/layout/js/_async.js"}],"/Code/html/themes/learning-1.1.0/lib/layout/js/main.js":[function(require,module,exports){
require('./_breakpoints.js');
require('./_gridalicious.js');
require('./_scrollable.js');
require('./_skins');
require('./_isotope');
require('./_parallax');

// Sidebar Percentage Sizes Demo
require('./_sidebar-pc');
},{"./_breakpoints.js":"/Code/html/themes/learning-1.1.0/lib/layout/js/_breakpoints.js","./_gridalicious.js":"/Code/html/themes/learning-1.1.0/lib/layout/js/_gridalicious.js","./_isotope":"/Code/html/themes/learning-1.1.0/lib/layout/js/_isotope.js","./_parallax":"/Code/html/themes/learning-1.1.0/lib/layout/js/_parallax.js","./_scrollable.js":"/Code/html/themes/learning-1.1.0/lib/layout/js/_scrollable.js","./_sidebar-pc":"/Code/html/themes/learning-1.1.0/lib/layout/js/_sidebar-pc.js","./_skins":"/Code/html/themes/learning-1.1.0/lib/layout/js/_skins.js"}],"/Code/html/themes/learning-1.1.0/lib/maps/js/_skin.js":[function(require,module,exports){
module.exports=require("/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js")
},{"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js":"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js"}],"/Code/html/themes/learning-1.1.0/lib/maps/js/google/_edit.js":[function(require,module,exports){
(function ($) {
    "use strict";

    var find = function (mapData, location, marker, markerData) {

        var eventData = $.extend({}, {marker: marker}, markerData, mapData),
            state = '',
            country = '',
            address = '';

        mapData.container.gmap('search', {'location': location}, function (results, status) {

            if (status === 'OK') {
                address = results[ 0 ].formatted_address;
                $.each(results[ 0 ].address_components, function (i, v) {
                    if (v.types[ 0 ] == "administrative_area_level_1" || v.types[ 0 ] == "administrative_area_level_2") {
                        state = v.long_name;
                    } else if (v.types[ 0 ] == "country") {
                        country = v.long_name;
                    }
                });
                eventData = $.extend({}, eventData, {state: state, country: country, address: address});
            }

            $(document).trigger('map.marker.find', eventData);

        });

    };

    var bindFind = function(marker, markerData, data) {

        if (typeof markerData.open !== 'undefined' && markerData.open === true) {
            find(data, markerData.latLng, marker, markerData);
        }

        google.maps.event.addListener(marker, 'dragend', function (e) {
            find(data, e.latLng, this, markerData);
        });

        google.maps.event.addListener(marker, 'click', function (e) {
            find(data, e.latLng, this, markerData);
        });

    };

    $(document).on('map.init', function (event, data) {

        if (data.container.data('id') == 'map-edit') {

            var markers = data.container.gmap('get', 'markers'),
                markerOptions = {
                    "draggable": true
                },
                markerData = {
                    "open": true,
                    "template": "tpl-edit",
                    "icon": "building-01"
                };

            google.maps.event.addListener(data.map, 'click', function (event) {

                markerData = $.extend({}, markerData, {"latLng": event.latLng});

                var marker = data.addMarker(markers.length, markerData, markerOptions);

                bindFind(marker, markerData, data);

            });

            google.maps.event.addListener(data.iw.window, 'domready', function () {

                $('#map-delete-marker').on('click', function (e) {
                    e.stopPropagation();
                    var id = $(this).data('id');
                    data.iw.close(id);
                    markers[ id ].setMap(null);
                });

            });

            $.each(markers, function(i, marker){

                var markerData = marker.get('content');

                bindFind(marker, markerData, data);

            });

        }

    });

    $(document).on('map.marker.find', function (event, data) {

        data.marker.setTitle(data.address);

        if (data.iw.window.isOpen === false) return;

        data.iw.open(data.marker.get('id'), data);

    });

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/maps/js/google/_filters.js":[function(require,module,exports){
(function ($) {
    "use strict";

    var arrayUnique = function(a) {
        return a.reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
        }, []);
    };

    var filter = function(data){

        data.iw.close();
        data.container.gmap('set', 'bounds', null);

        var filters = [];

        $('#radios :checked').each(function (i, checkbox) {
            filters.push($(checkbox).val());
        });

        if (filters.length) {
            data.container.gmap('find', 'markers', {
                'property': 'tags',
                'value': filters,
                'operator': 'OR'
            }, function (marker, found) {
                if (found) {
                    data.container.gmap('addBounds', marker.position);
                }
                marker.setVisible(found);
            });
        } else {
            $.each(data.container.gmap('get', 'markers'), function (i, marker) {
                data.container.gmap('addBounds', marker.position);
                marker.setVisible(false);
            });
        }

    };

    $(document).on('map.init', function (event, data) {

        if (data.container.data('filters') === true) {

            var map = data,
                markers = data.container.gmap('get', 'markers'),
                tags = [],
                templateId = data.container.data('filtersTemplate') || '#map-filters-template';

            $.each(markers, function(i, marker){
                $.each(marker.tags, function(i, tag){
                    tags.push(tag);
                });
            });

            tags = arrayUnique(tags);

            var source = $(templateId).html();
            var template = Handlebars.compile(source);
            var $el = $(template({ tags: tags }));

            $el.insertAfter(data.container);

            var skin = require('../../../layout/js/_skin')();

            $('[data-scrollable]', $el).niceScroll({
                cursorborder: 0,
                cursorcolor: config.skins[ skin ][ 'primary-color' ],
                horizrailenabled: false
            });

            setTimeout(function(){
                filter(data);
            }, 100);

            $('body').on('click', '#radios :checkbox', function(){
                filter(data);
            });

        }

    });

})(jQuery);
},{"../../../layout/js/_skin":"/Code/html/themes/learning-1.1.0/lib/layout/js/_skin.js"}],"/Code/html/themes/learning-1.1.0/lib/maps/js/google/_library.js":[function(require,module,exports){
module.exports = function () {

    var centerWindow = function (container, map, data) {

        if (data.lat && data.lng) {

            container.gmap('option', 'center', new google.maps.LatLng(data.lat, data.lng));

            map.panBy(0, -170);

            return true;

        }
        return false;
    };

    var centerMap = function (container, data) {

        if (data && data.length === 2) {

            container.gmap('option', 'center', new google.maps.LatLng(data[ 0 ], data[ 1 ]));

            return true;

        }
        return false;
    };

    var resize = function (container, map, windowData, mapData) {

        if (typeof google == 'undefined') return;

        google.maps.event.trigger(map, 'resize');

        if (! centerMap(container, mapData)) centerWindow(container, map, windowData);

    };

    return {
        centerWindow: centerWindow,
        centerMap: centerMap,
        resize: resize
    };

};
},{}],"/Code/html/themes/learning-1.1.0/lib/maps/js/google/main.js":[function(require,module,exports){
function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
    'callback=initGoogleMaps';
    //document.body.appendChild(script);
}

window.onload = loadScript;

function initScripts() {
    var $scripts = [
        "js/vendor/maps/google/jquery-ui-map/ui/jquery.ui.map.js",
        "js/vendor/maps/google/jquery-ui-map/ui/jquery.ui.map.extensions.js",
        "js/vendor/maps/google/jquery-ui-map/ui/jquery.ui.map.services.js",
        "js/vendor/maps/google/jquery-ui-map/ui/jquery.ui.map.microdata.js",
        "js/vendor/maps/google/jquery-ui-map/ui/jquery.ui.map.microformat.js",
        "js/vendor/maps/google/jquery-ui-map/ui/jquery.ui.map.overlays.js",
        "js/vendor/maps/google/jquery-ui-map/ui/jquery.ui.map.rdfa.js",
        "js/vendor/maps/google/jquery-ui-map/addons/infobox_packed.js",
        "js/vendor/maps/google/jquery-ui-map/addons/markerclusterer.min.js"
    ];

    $.each($scripts, function (k, v) {
        if ($('[src="' + v + '"]').length) return true;
        var scriptNode = document.createElement('script');

        scriptNode.src = v;
        $('head').prepend($(scriptNode));
    });

    $.extend($.ui.gmap.prototype, {
        pagination: function (prop, mapData) {
            var source = $("#map-pagination").html();
            var template = Handlebars.compile(source);
            var $el = $(template());

            var self = this, i = 0;
            prop = prop || 'title';
            self.set('pagination', function (a, b) {
                if (a) {
                    i = i + b;
                    var m = self.get('markers')[ i ];
                    mapData.iw.open(i, m.get('content'));
                    $el.find('.display').text(m[ prop ]);
                    self.get('map').panTo(m.getPosition());
                }
            });
            self.get('pagination')(true, 0);
            $el.find('.back-btn').click(function (e) {
                e.preventDefault();
                self.get('pagination')((i > 0), - 1, this);
            });
            $el.find('.fwd-btn').click(function (e) {
                e.preventDefault();
                self.get('pagination')((i < self.get('markers').length - 1), 1, this);
            });
            self.addControl($el, google.maps.ControlPosition[ mapData.options.paginationPosition ]);
        }
    });
}

var library = require('./_library.js')();

// Holds google maps styles
var styles = {
    "light-grey": require('./styles/_light-grey.js'),
    "light-monochrome": require('./styles/_light-monochrome.js'),
    "cool-grey": require('./styles/_cool-grey.js'),
    "blue-gray": require('./styles/_blue-gray.js'),
    "paper": require('./styles/_paper.js'),
    "apple": require('./styles/_apple.js'),
    "light-green": require('./styles/_light-green.js'),
    "lemon-tree": require('./styles/_lemon-tree.js'),
    "clean-cut": require('./styles/_clean-cut.js'),
    "nature": require('./styles/_nature.js')
};

// Process the infoWindow content via Handlebars templates
var infoWindowContent = function (marker) {
    var source = $("#" + marker.template).html();
    var template = Handlebars.compile(source);
    return template(marker);
};

/**
 * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
 */
$.fn.tkGoogleMap = function () {

    if (! this.length) return;

    var container = this;

    if (typeof google == 'undefined' || typeof InfoBox == 'undefined') {
        setTimeout(function(){
            container.tkGoogleMap();
        }, 200);

        return;
    }

    var options = {
        mapZoomPosition: container.data('zoomPosition') || "TOP_LEFT",
        mapZoom: container.data('zoom') || 16,
        mapStyle: container.data('style') || "light-grey",
        mapType: container.data('type') || "ROADMAP",
        file: container.data('file'),
        center: container.data('center') ? container.data('center').split(",") : false,
        pagination: container.data('pagination') || false,
        paginationPosition: container.data('paginationPosition') || 'TOP_LEFT',
        draggable: container.data('draggable') !== false
    };

    var mapData;

    // provide a default object for data collected from the currently opened infoWindow
    var infoWindowData = {
        lat: false,
        lng: false
    };

    var infoWindowOpen = function (i, marker) {

        var markerInst = container.gmap('get', 'markers')[ i ];

        infoWindow.setContent(infoWindowContent(marker));
        infoWindow.open(map, markerInst);
        infoWindow.isOpen = i;

        infoWindowData = {
            lat: marker.latitude,
            lng: marker.longitude
        };
    };

    var infoWindowClose = function (i) {
        if (typeof i == 'undefined') {
            infoWindow.close();
            infoWindow.isOpen = false;
            return true;
        }
        if (typeof infoWindow.isOpen != 'undefined' && infoWindow.isOpen === i) {
            infoWindow.close();
            infoWindow.isOpen = false;
            return true;
        }
        return false;
    };

    /* InfoBox */
    var infoWindow = new InfoBox({
        maxWidth: 240,
        alignBottom: true
    });

    var addMarker = function (i, marker, options) {
        var iconBase = 'images/markers/';
        var position = typeof marker.latLng !== 'undefined' ? marker.latLng : false;
        if (! position && typeof marker.latitude !== 'undefined' && typeof marker.longitude !== 'undefined') position = new google.maps.LatLng(marker.latitude, marker.longitude);
        if (! position) return false;

        var markerOptions = {
            "id": i,
            "position": position,
            "draggable": true,
            "icon": iconBase + marker.icon + ".png"
        };

        if (typeof options == 'object') markerOptions = $.extend({}, markerOptions, options);

        var open = typeof marker.open !== 'undefined' && marker.open === true;

        container.gmap('addMarker', markerOptions);

        var markerInst = container.gmap('get', 'markers')[ i ];

        markerInst.setTitle(marker.title);

        google.maps.event.addListener(markerInst, 'click', function () {
            if (! infoWindowClose(i)) {
                infoWindowOpen(i, marker);
                library.centerWindow(container, map, infoWindowData);
            }
        });

        google.maps.event.addListener(markerInst, 'dragend', function () {
            var lat = markerInst.getPosition().lat();
            var lng = markerInst.getPosition().lng();
            console.log('"latitude": ' + lat + ', "longitude": ' + lng);
        });

        var markerData = $.extend({}, marker, {
            "id": i,
            "latLng": new google.maps.LatLng(marker.latitude, marker.longitude)
        });

        markerInst.set('content', markerData);

        if (open) infoWindowOpen(i, marker);

        return markerInst;
    };

    container.gmap(
        {
            'zoomControl': true,
            'zoomControlOptions': {
                'style': google.maps.ZoomControlStyle.SMALL,
                'position': google.maps.ControlPosition[ options.mapZoomPosition ]
            },
            'panControl': false,
            'streetViewControl': false,
            'mapTypeControl': false,
            'overviewMapControl': false,
            'scrollwheel': false,
            'draggable': options.draggable,
            'mapTypeId': google.maps.MapTypeId[ options.mapType ],
            'zoom': options.mapZoom,
            'styles': styles[ options.mapStyle ]
        })
        .bind('init', function () {

            mapData = {
                container: container,
                map: map,
                options: options,
                addMarker: addMarker,
                library: library,
                iw: {
                    data: infoWindowData,
                    window: infoWindow,
                    content: infoWindowContent,
                    open: infoWindowOpen,
                    close: infoWindowClose
                }
            };

            if (options.file) {

                $.getJSON(options.file, function (data) {

                    $.each(data.markers, function (i, marker) {
                        var o = typeof marker.options !== 'undefined' ? marker.options : {};
                        addMarker(i, marker, o);
                    });

                    google.maps.event.addListenerOnce(map, 'idle', function () {

                        library.resize(container, map, infoWindowData, options.center);

                        if (options.pagination) {
                            container.gmap('pagination', 'title', mapData);
                        }

                    });
                });

            }
            else {
                library.centerMap(container, options.center);
            }

            google.maps.event.addListenerOnce(map, 'idle', function () {

                $(document).trigger('map.init', mapData);

            });

            google.maps.event.addListener(infoWindow, 'domready', function () {
                var iw = $('.infoBox');
                infoWindow.setOptions({
                    pixelOffset: new google.maps.Size(- Math.abs(iw.width() / 2), - 45)
                });
                setTimeout(function(){

                    $('.cover', iw).each(function(){
                        $(this).tkCover();
                    });

                }, 200);
            });
        });

    var map = container.gmap('get', 'map');

    var t;
    $(window).on('debouncedresize', function () {
        clearTimeout(t);
        t = setTimeout(function () {
            library.resize(container, map, infoWindowData, options.center);
        }, 100);
    });

    // handle maps in collapsibles
    $('.collapse').on('shown.bs.collapse', function(){
        if ($(container, this).length) {
            library.resize(container, map, infoWindowData, options.center);
        }
    });

};

module.exports = function () {
    initScripts();

    /*
     * Clustering
     */
    if ($('#google-map-clustering').length) {
        // We need to bind the map with the "init" event otherwise bounds will be null
        $('#google-map-clustering').gmap({'zoom': 2, 'disableDefaultUI': true}).bind('init', function (evt, map) {
            var bounds = map.getBounds();
            var southWest = bounds.getSouthWest();
            var northEast = bounds.getNorthEast();
            var lngSpan = northEast.lng() - southWest.lng();
            var latSpan = northEast.lat() - southWest.lat();

            function openInfoWindow() {
                $('#google-map-clustering').gmap('openInfoWindow', {content: 'Hello world!'}, this);
            }

            for (var i = 0; i < 1000; i ++) {
                var lat = southWest.lat() + latSpan * Math.random();
                var lng = southWest.lng() + lngSpan * Math.random();
                $('#google-map-clustering').gmap('addMarker', {
                    'position': new google.maps.LatLng(lat, lng)
                }).click(openInfoWindow);
            }

            $('#google-map-clustering').gmap('set', 'MarkerClusterer', new MarkerClusterer(map, $(this).gmap('get', 'markers')));
        });
    }

};

(function($){
    "use strict";

    $(document).on('map.init', function (event, data) {

        var styleTpl = $('#map-style-switch'),
            toggleStyleWrapper = $('[data-toggle="map-style-switch"]');

        if (styleTpl.length && toggleStyleWrapper.length) {

            var target = $(toggleStyleWrapper.data('target'));

            if (! target) return;

            if (data.container.is(target)) {

                var s = styleTpl.html();
                var t = Handlebars.compile(s);

                toggleStyleWrapper.html(t({
                    styles: styles
                }));

                $('select', toggleStyleWrapper).val(data.options.mapStyle);

                if (typeof $.fn.selectpicker != 'undefined') {

                    $('.selectpicker', toggleStyleWrapper).each(function () {
                        $(this).selectpicker({
                            width: $(this).data('width') || '100%'
                        });
                    });

                }

                var skin = require('../_skin')();

                $('[data-scrollable]', toggleStyleWrapper).niceScroll({
                    cursorborder: 0,
                    cursorcolor: config.skins[ skin ][ 'primary-color' ],
                    horizrailenabled: false
                });

                $('select', toggleStyleWrapper).on('change', function () {
                    var style = typeof styles[ $(this).val() ] ? styles[ $(this).val() ] : false;
                    if (! style) return;

                    target.gmap('option', 'styles', style);
                });

            }

        }

    });

    $('[data-toggle="google-maps"]').each(function () {

        $(this).tkGoogleMap();

    });

})(jQuery);

require('./_edit');
require('./_filters');
},{"../_skin":"/Code/html/themes/learning-1.1.0/lib/maps/js/_skin.js","./_edit":"/Code/html/themes/learning-1.1.0/lib/maps/js/google/_edit.js","./_filters":"/Code/html/themes/learning-1.1.0/lib/maps/js/google/_filters.js","./_library.js":"/Code/html/themes/learning-1.1.0/lib/maps/js/google/_library.js","./styles/_apple.js":"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_apple.js","./styles/_blue-gray.js":"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_blue-gray.js","./styles/_clean-cut.js":"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_clean-cut.js","./styles/_cool-grey.js":"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_cool-grey.js","./styles/_lemon-tree.js":"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_lemon-tree.js","./styles/_light-green.js":"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_light-green.js","./styles/_light-grey.js":"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_light-grey.js","./styles/_light-monochrome.js":"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_light-monochrome.js","./styles/_nature.js":"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_nature.js","./styles/_paper.js":"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_paper.js"}],"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_apple.js":[function(require,module,exports){
module.exports = [ {
    "featureType": "landscape.man_made",
    "elementType": "geometry",
    "stylers": [ {"color": "#f7f1df"} ]
}, {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [ {"color": "#d0e3b4"} ]
}, {
    "featureType": "landscape.natural.terrain",
    "elementType": "geometry",
    "stylers": [ {"visibility": "off"} ]
}, {
    "featureType": "poi",
    "elementType": "labels",
    "stylers": [ {"visibility": "off"} ]
}, {
    "featureType": "poi.business",
    "elementType": "all",
    "stylers": [ {"visibility": "off"} ]
}, {
    "featureType": "poi.medical",
    "elementType": "geometry",
    "stylers": [ {"color": "#fbd3da"} ]
}, {"featureType": "poi.park", "elementType": "geometry", "stylers": [ {"color": "#bde6ab"} ]}, {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [ {"visibility": "off"} ]
}, {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [ {"visibility": "off"} ]
}, {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [ {"color": "#ffe15f"} ]
}, {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [ {"color": "#efd151"} ]
}, {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [ {"color": "#ffffff"} ]
}, {
    "featureType": "road.local",
    "elementType": "geometry.fill",
    "stylers": [ {"color": "black"} ]
}, {
    "featureType": "transit.station.airport",
    "elementType": "geometry.fill",
    "stylers": [ {"color": "#cfb2db"} ]
}, {"featureType": "water", "elementType": "geometry", "stylers": [ {"color": "#a2daf2"} ]} ];
},{}],"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_blue-gray.js":[function(require,module,exports){
module.exports = [ {
    "featureType": "water",
    "stylers": [ {"visibility": "on"}, {"color": "#b5cbe4"} ]
}, {"featureType": "landscape", "stylers": [ {"color": "#efefef"} ]}, {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [ {"color": "#83a5b0"} ]
}, {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [ {"color": "#bdcdd3"} ]
}, {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [ {"color": "#ffffff"} ]
}, {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [ {"color": "#e3eed3"} ]
}, {
    "featureType": "administrative",
    "stylers": [ {"visibility": "on"}, {"lightness": 33} ]
}, {"featureType": "road"}, {
    "featureType": "poi.park",
    "elementType": "labels",
    "stylers": [ {"visibility": "on"}, {"lightness": 20} ]
}, {}, {"featureType": "road", "stylers": [ {"lightness": 20} ]} ];
},{}],"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_clean-cut.js":[function(require,module,exports){
module.exports = [ {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [ {"lightness": 100}, {"visibility": "simplified"} ]
}, {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [ {"visibility": "on"}, {"color": "#C6E2FF"} ]
}, {"featureType": "poi", "elementType": "geometry.fill", "stylers": [ {"color": "#C5E3BF"} ]}, {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [ {"color": "#D1D1B8"} ]
} ];
},{}],"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_cool-grey.js":[function(require,module,exports){
module.exports = [ {
    "featureType": "landscape",
    "elementType": "labels",
    "stylers": [ {"visibility": "off"} ]
}, {"featureType": "transit", "elementType": "labels", "stylers": [ {"visibility": "off"} ]}, {
    "featureType": "poi",
    "elementType": "labels",
    "stylers": [ {"visibility": "off"} ]
}, {"featureType": "water", "elementType": "labels", "stylers": [ {"visibility": "off"} ]}, {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [ {"visibility": "off"} ]
}, {"stylers": [ {"hue": "#00aaff"}, {"saturation": - 100}, {"gamma": 2.15}, {"lightness": 12} ]}, {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [ {"visibility": "on"}, {"lightness": 24} ]
}, {"featureType": "road", "elementType": "geometry", "stylers": [ {"lightness": 57} ]} ];
},{}],"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_lemon-tree.js":[function(require,module,exports){
module.exports = [ {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [ {"hue": "#ffffff"}, {"saturation": - 100}, {"lightness": 100}, {"visibility": "off"} ]
}, {
    "featureType": "landscape.natural",
    "elementType": "all",
    "stylers": [ {"hue": "#ffffff"}, {"saturation": - 100}, {"lightness": 100}, {"visibility": "on"} ]
}, {
    "featureType": "road",
    "elementType": "all",
    "stylers": [ {"hue": "#ffe94f"}, {"saturation": 100}, {"lightness": 4}, {"visibility": "on"} ]
}, {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [ {"hue": "#ffe94f"}, {"saturation": 100}, {"lightness": 4}, {"visibility": "on"} ]
}, {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [ {"hue": "#333333"}, {"saturation": - 100}, {"lightness": - 74}, {"visibility": "off"} ]
} ];
},{}],"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_light-green.js":[function(require,module,exports){
module.exports = [ {"stylers": [ {"hue": "#baf4c4"}, {"saturation": 10} ]}, {
    "featureType": "water",
    "stylers": [ {"color": "#effefd"} ]
}, {
    "featureType": "all",
    "elementType": "labels",
    "stylers": [ {"visibility": "off"} ]
}, {
    "featureType": "administrative",
    "elementType": "labels",
    "stylers": [ {"visibility": "on"} ]
}, {"featureType": "road", "elementType": "all", "stylers": [ {"visibility": "off"} ]}, {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [ {"visibility": "off"} ]
} ];
},{}],"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_light-grey.js":[function(require,module,exports){
module.exports = [ {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [ {"color": "#e9e9e9"}, {"lightness": 17} ]
}, {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [ {"color": "#f5f5f5"}, {"lightness": 20} ]
}, {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [ {"color": "#ffffff"}, {"lightness": 17} ]
}, {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [ {"color": "#ffffff"}, {"lightness": 29}, {"weight": 0.2} ]
}, {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [ {"color": "#ffffff"}, {"lightness": 18} ]
}, {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [ {"color": "#ffffff"}, {"lightness": 16} ]
}, {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [ {"color": "#f5f5f5"}, {"lightness": 21} ]
}, {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [ {"color": "#dedede"}, {"lightness": 21} ]
}, {
    "elementType": "labels.text.stroke",
    "stylers": [ {"visibility": "on"}, {"color": "#ffffff"}, {"lightness": 16} ]
}, {
    "elementType": "labels.text.fill",
    "stylers": [ {"saturation": 36}, {"color": "#333333"}, {"lightness": 40} ]
}, {"elementType": "labels.icon", "stylers": [ {"visibility": "off"} ]}, {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [ {"color": "#f2f2f2"}, {"lightness": 19} ]
}, {
    "featureType": "administrative",
    "elementType": "geometry.fill",
    "stylers": [ {"color": "#fefefe"}, {"lightness": 20} ]
}, {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [ {"color": "#fefefe"}, {"lightness": 17}, {"weight": 1.2} ]
} ];
},{}],"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_light-monochrome.js":[function(require,module,exports){
module.exports = [ {
    "featureType": "administrative.locality",
    "elementType": "all",
    "stylers": [ {"hue": "#2c2e33"}, {"saturation": 7}, {"lightness": 19}, {"visibility": "on"} ]
}, {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [ {"hue": "#ffffff"}, {"saturation": - 100}, {"lightness": 100}, {"visibility": "simplified"} ]
}, {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [ {"hue": "#ffffff"}, {"saturation": - 100}, {"lightness": 100}, {"visibility": "off"} ]
}, {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [ {"hue": "#bbc0c4"}, {"saturation": - 93}, {"lightness": 31}, {"visibility": "simplified"} ]
}, {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [ {"hue": "#bbc0c4"}, {"saturation": - 93}, {"lightness": 31}, {"visibility": "on"} ]
}, {
    "featureType": "road.arterial",
    "elementType": "labels",
    "stylers": [ {"hue": "#bbc0c4"}, {"saturation": - 93}, {"lightness": - 2}, {"visibility": "simplified"} ]
}, {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [ {"hue": "#e9ebed"}, {"saturation": - 90}, {"lightness": - 8}, {"visibility": "simplified"} ]
}, {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [ {"hue": "#e9ebed"}, {"saturation": 10}, {"lightness": 69}, {"visibility": "on"} ]
}, {
    "featureType": "water",
    "elementType": "all",
    "stylers": [ {"hue": "#e9ebed"}, {"saturation": - 78}, {"lightness": 67}, {"visibility": "simplified"} ]
} ];
},{}],"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_nature.js":[function(require,module,exports){
module.exports = [ {
    "featureType": "landscape",
    "stylers": [ {"hue": "#FFA800"}, {"saturation": 0}, {"lightness": 0}, {"gamma": 1} ]
}, {
    "featureType": "road.highway",
    "stylers": [ {"hue": "#53FF00"}, {"saturation": - 73}, {"lightness": 40}, {"gamma": 1} ]
}, {
    "featureType": "road.arterial",
    "stylers": [ {"hue": "#FBFF00"}, {"saturation": 0}, {"lightness": 0}, {"gamma": 1} ]
}, {
    "featureType": "road.local",
    "stylers": [ {"hue": "#00FFFD"}, {"saturation": 0}, {"lightness": 30}, {"gamma": 1} ]
}, {
    "featureType": "water",
    "stylers": [ {"hue": "#00BFFF"}, {"saturation": 6}, {"lightness": 8}, {"gamma": 1} ]
}, {
    "featureType": "poi",
    "stylers": [ {"hue": "#679714"}, {"saturation": 33.4}, {"lightness": - 25.4}, {"gamma": 1} ]
} ];
},{}],"/Code/html/themes/learning-1.1.0/lib/maps/js/google/styles/_paper.js":[function(require,module,exports){
module.exports = [ {
    "featureType": "administrative",
    "elementType": "all",
    "stylers": [ {"visibility": "off"} ]
}, {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [ {"visibility": "simplified"}, {"hue": "#0066ff"}, {"saturation": 74}, {"lightness": 100} ]
}, {"featureType": "poi", "elementType": "all", "stylers": [ {"visibility": "simplified"} ]}, {
    "featureType": "road",
    "elementType": "all",
    "stylers": [ {"visibility": "simplified"} ]
}, {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [ {"visibility": "off"}, {"weight": 0.6}, {"saturation": - 85}, {"lightness": 61} ]
}, {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [ {"visibility": "on"} ]
}, {
    "featureType": "road.arterial",
    "elementType": "all",
    "stylers": [ {"visibility": "off"} ]
}, {"featureType": "road.local", "elementType": "all", "stylers": [ {"visibility": "on"} ]}, {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [ {"visibility": "simplified"} ]
}, {
    "featureType": "water",
    "elementType": "all",
    "stylers": [ {"visibility": "simplified"}, {"color": "#5f94ff"}, {"lightness": 26}, {"gamma": 5.86} ]
} ];
},{}],"/Code/html/themes/learning-1.1.0/lib/material/js/_forms.js":[function(require,module,exports){
(function ($) {
    "use strict";

    $.fn.tkFormControlMaterial = function(){
        this.blur(function () {
                var me = this, ma = $(this);//xzq add
                if (ma.val()) {
                    if ((me.type == 'text' || me.type == 'password')  && me.form && me.form.obj && !(me.form.obj.noEditing === true)) me.form.obj.set(me.id, ma.val());
                    if (me.type == 'file' && me.form && me.form.obj && !(me.form.obj.noEditing === true)) me.form.obj.set(me.id, me.files[0].name);
                    ma.addClass('used');
                } else {
                    if ((me.type == 'text' || me.type == 'password') && me.form && me.form.obj && !(me.form.obj.noEditing === true) && me.form.obj.get && me.form.obj.get(me.id)) me.form.obj.set(me.id, null);
                    ma.removeClass('used');
                }
            })
            .after('<span class="ma-form-highlight"></span><span class="ma-form-bar"></span>');
    };

    $('.form-control-material .form-control').each(function () {
        $(this).tkFormControlMaterial();
        $(this).blur();//--xzq
    });

    $(document).on('show.bs.dropdown', function (e) {

        if (Modernizr.touch && $(window).width() < 768) return true;

        var dd = $(e.relatedTarget).next('.dropdown-menu');
        var ddHeight = dd.outerHeight();
        dd.css({
            height: 0,
            display: 'block',
            overflow: 'hidden'
        });
        dd.velocity({opacity: 1}, {duration: 650, queue: false, easing: 'easeOutQuad'});
        dd.velocity({
            height: ddHeight,
            top: dd.data('top') || 0
        }, {
            duration: 650,
            queue: false,
            easing: 'easeOutCubic',
            complete: function () {
                dd.css({overflow: 'visible'});
            }
        });
    });

    $(document).on('hide.bs.dropdown', function (e) {

        if (Modernizr.touch && $(window).width() < 768) return true;

        var dd = $(e.relatedTarget).next('.dropdown-menu');
        dd.velocity({
            opacity: 0,
            top: '100%'
        }, {
            duration: 650, queue: false, easing: 'easeOutQuad', complete: function () {
                dd.css({
                    display: 'none',
                    height: 'auto'
                });
            }
        });
    });

})(jQuery);

},{}],"/Code/html/themes/learning-1.1.0/lib/material/js/_ripple.js":[function(require,module,exports){
(function ($) {
    "use strict";

    var ripple = function (e) {

        var el, ink, d, x, y;

        el = $(this);

        el.addClass('ripple');

        if (el.parents('.sidebar-skin-white').length) {
            el.addClass('ripple-dark-fade');
        }

        if (el.parents('.sidebar-skin-dark').length) {
            el.addClass('ripple-light-fade');
        }

        if (el.is('.btn-white')) {
            el.addClass('ripple-dark-fade');
        }

        if (el.attr('href') && ! el.data('toggle')) {
            e.preventDefault();
            if (el.closest('.dropdown-menu').length) {
                e.stopPropagation();
            }
            setTimeout(function () {
                //document.location = el.attr('href'); xzq
            }, 400);
        }

        // create .ink element if it doesn't exist
        if (el.find(".ink").length === 0)
            el.prepend("<span class='ink'></span>");

        ink = el.find(".ink");
        // in case of quick double clicks stop the previous animation
        ink.removeClass("animate");

        // set size of .ink
        if (! ink.height() && ! ink.width()) {
            // use el's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
            d = Math.max(el.outerWidth(), el.outerHeight());
            ink.css({height: d, width: d});
        }

        // get click coordinates
        // logic = click coordinates relative to page - el's position relative to page - half of self height/width to make it controllable from the center;
        x = e.pageX - el.offset().left - ink.width() / 2;
        y = e.pageY - el.offset().top - ink.height() / 2;

        // set the position and add class .animate
        ink.css({top: y + 'px', left: x + 'px'}).addClass("animate");

    };

    var listGroupMenu = $('.list-group-menu > .list-group-item > a'),
        button = $('.btn'),
        navbarNav = $('.navbar-nav > li > a'),
        dropdownMenu = $('.dropdown-menu > li > a'),
        sidebarMenu = $('.sidebar-menu > li > a');

    var addRipple = $()
        .add(listGroupMenu)
        .add(button)
        .add(navbarNav)
        .add(dropdownMenu)
        .add(sidebarMenu);

    if (addRipple.length) {
        addRipple.click(ripple);
    }

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/material/js/main.js":[function(require,module,exports){
require('./_forms');
require('./_ripple');
},{"./_forms":"/Code/html/themes/learning-1.1.0/lib/material/js/_forms.js","./_ripple":"/Code/html/themes/learning-1.1.0/lib/material/js/_ripple.js"}],"/Code/html/themes/learning-1.1.0/lib/media/js/_responsive-videos.js":[function(require,module,exports){
(function ($) {

    // Find all YouTube videos
    var $allVideos = $("iframe[src^='http://player.vimeo.com'], iframe[src^='http://www.youtube.com']"),

    // The element that is fluid width
    $fluidEl = $("panel");

    // Figure out and save aspect ratio for each video
    $allVideos.each(function() {

        $(this)
            .data('aspectRatio', this.height / this.width)

            // and remove the hard coded width/height
            .removeAttr('height')
            .removeAttr('width');

    });

    // When the window is resized
    $(".gallery-grid .panel").resize(function() {

        var newWidth = $fluidEl.width();

        // Resize all videos according to their own aspect ratio
        $allVideos.each(function() {

            var $el = $(this);
            $el
                .width(newWidth)
                .height(newWidth * $el.data('aspectRatio'));

        });

    // Kick off one resize to fix all videos on page load
    }).resize();

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/media/js/carousel/main.js":[function(require,module,exports){
require('./owl/main');
require('./slick/_default');
},{"./owl/main":"/Code/html/themes/learning-1.1.0/lib/media/js/carousel/owl/main.js","./slick/_default":"/Code/html/themes/learning-1.1.0/lib/media/js/carousel/slick/_default.js"}],"/Code/html/themes/learning-1.1.0/lib/media/js/carousel/owl/_default.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkOwlDefault = function () {

        if (! this.length) return;

        var c = this;
        c.owlCarousel({
            dots: true,
            items: c.data('items') || 4,
            responsive: {
                1200: {
                    items: c.data('itemsLg') || 4
                },
                992: {
                    items: c.data('itemsMg') || 3
                },
                768: {
                    items: c.data('itemsSm') || 3
                },
                480: {
                    items: c.data('itemsXs') || 2
                },
                0: {
                    items: 1
                }
            },
            rtl: this.data('rtl'),
            afterUpdate: function () {
                $(window).trigger('resize');
            }
        });

    };

    $(".owl-basic").each(function () {
        $(this).tkOwlDefault();
    });

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/media/js/carousel/owl/_mixed.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkOwlMixed = function () {

        if (! this.length) return;

        this.owlCarousel({
            items: 2,
            nav: true,
            dots: false,
            rtl: this.data('rtl'),
            navText: [ '<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>' ],
            responsive: {
                1200: {
                    items: 2
                },
                0: {
                    items: 1
                }
            }
        });

    };

    $(".owl-mixed").tkOwlMixed();

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/media/js/carousel/owl/_preview.js":[function(require,module,exports){
(function ($) {
    "use strict";

    var syncPosition = function (e, target) {
        if (e.namespace && e.property.name === 'items') {
            target.trigger('to.owl.carousel', [e.item.index, 300, true]);
        }
    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkOwlPreview = function () {

        if (! this.length) return;

        var target = $(this.data('sync')),
            preview = this,
            rtl = this.data('rtl');

        if (! target.length) return;

        this.owlCarousel({
            items: 1,
            slideSpeed: 1000,
            dots: false,
            responsiveRefreshRate: 200,
            rtl: rtl,
            nav: true,
            navigationText: [ '<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>' ]
        });

        this.on('change.owl.carousel', function(e){
            syncPosition(e, target);
        });

        target.owlCarousel({
            items: 5,
            responsive: {
                1200: {
                    items: 7
                },
                768: {
                    items: 6
                },
                480: {
                    items: 3
                },
                0: {
                    items: 2
                }
            },
            dots: false,
            nav: true,
            responsiveRefreshRate: 100,
            rtl: rtl,
            afterInit: function (el) {
                el.find(".owl-item").eq(0).addClass("synced");
            }
        });

        target.on('change.owl.carousel', function(e){
            syncPosition(e, preview);
        });

        target.find('.owl-item').click(function (e) {
            e.preventDefault();
            var item = $(this).data("owl-item");
            preview.trigger("to.owl.carousel", [item.index, 300, true]);
        });

    };

    $(".owl-preview").tkOwlPreview();

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/media/js/carousel/owl/main.js":[function(require,module,exports){
require('./_default');
require('./_mixed');
require('./_preview');
},{"./_default":"/Code/html/themes/learning-1.1.0/lib/media/js/carousel/owl/_default.js","./_mixed":"/Code/html/themes/learning-1.1.0/lib/media/js/carousel/owl/_mixed.js","./_preview":"/Code/html/themes/learning-1.1.0/lib/media/js/carousel/owl/_preview.js"}],"/Code/html/themes/learning-1.1.0/lib/media/js/carousel/slick/_default.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkSlickDefault = function () {

        if (! this.length) return;

        if (typeof $.fn.slick == 'undefined') return;

        var c = this;
        
        c.slick({
            dots: true,
            slidesToShow: c.data('items') || 3,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: c.data('itemsLg') || 4
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: c.data('itemsMd') || 3
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: c.data('itemsSm') || 3
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: c.data('itemsXs') || 2
                    }
                },
                {
                    breakpoint: 0,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ],
            rtl: this.data('rtl'),
            onSetPosition: function () {
                $(window).trigger('resize');
            }
        });

        $(document).on('sidebar.shown', function(){
            c.slickSetOption('dots', true, true);
        });

    };

    $(".slick-basic").each(function () {
        $(this).tkSlickDefault();
    });

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/media/js/main.js":[function(require,module,exports){
// Carousels
require('./carousel/main');

// Responsive Video iFrame Fix
require('./_responsive-videos');
},{"./_responsive-videos":"/Code/html/themes/learning-1.1.0/lib/media/js/_responsive-videos.js","./carousel/main":"/Code/html/themes/learning-1.1.0/lib/media/js/carousel/main.js"}],"/Code/html/themes/learning-1.1.0/lib/messages/js/_breakpoints.js":[function(require,module,exports){
(function ($) {
    "use strict";

    $(window).bind('enterBreakpoint320', function () {
        var img = $('.messages-list .panel ul img');
        $('.messages-list .panel ul').width(img.first().width() * img.length);
    });

    $(window).bind('exitBreakpoint320', function () {
        $('.messages-list .panel ul').width('auto');
    });

})(jQuery);

},{}],"/Code/html/themes/learning-1.1.0/lib/messages/js/main.js":[function(require,module,exports){
require('./_breakpoints');
},{"./_breakpoints":"/Code/html/themes/learning-1.1.0/lib/messages/js/_breakpoints.js"}],"/Code/html/themes/learning-1.1.0/lib/sidebar/js/_breakpoints.js":[function(require,module,exports){
(function ($) {
    "use strict";

    var restore = function () {
            $("html").addClass('show-sidebar');
            $('.sidebar.sidebar-visible-desktop').not(':visible').each(function () {
                var options = sidebar.options($(this));
                sidebar.open($(this).attr('id'), options);
            });
        },
        hide = function () {
            $("html").removeClass('show-sidebar');
            $('.sidebar:visible').each(function () {
                sidebar.close($(this).attr('id'));
            });
        };

    $(window).bind('enterBreakpoint768', function () {
        if (! $('.sidebar').length) return;
        if ($('.hide-sidebar').length) return;
        restore();
    });

    $(window).bind('enterBreakpoint1024', function () {
        if (! $('.sidebar').length) return;
        if ($('.hide-sidebar').length) return;
        restore();
    });

    $(window).bind('enterBreakpoint480', function () {
        if (! $('.sidebar').length) return;
        hide();
    });

    if ($(window).width() <= 480) {
        if (! $('.sidebar').length) return;
        hide();
    }

})(jQuery);

},{}],"/Code/html/themes/learning-1.1.0/lib/sidebar/js/_collapsible.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkSidebarCollapse = function () {

        if (! this.length) return;

        var sidebar = this;

        sidebar.find('.sidebar-menu > li > a').off('mouseenter');
        sidebar.find('.sidebar-menu > li.dropdown > a').off('mouseenter');
        sidebar.find('.sidebar-menu > li > a').off('mouseenter');
        sidebar.find('.sidebar-menu > li > a').off('click');
        sidebar.off('mouseleave');
        sidebar.find('.dropdown').off('mouseover');
        sidebar.find('.dropdown').off('mouseout');

        $('body').off('mouseout', '#dropdown-temp .dropdown');

        sidebar.find('ul.collapse')
            .off('shown.bs.collapse')
            .off('show.bs.collapse')
            .off('hide.bs.collapse')
            .off('hidden.bs.collapse');

        sidebar.find('#dropdown-temp').remove();

        sidebar.find('.hasSubmenu').removeClass('dropdown')
            .find('> ul').addClass('collapse').removeClass('dropdown-menu submenu-hide submenu-show')
            .end()
            .find('> a').attr('data-toggle', 'collapse').on('click', function(e){
                e.preventDefault();
            });

        sidebar.find('.collapse').on('shown.bs.collapse', function () {
            sidebar.find('[data-scrollable]').getNiceScroll().resize();
        });

        // Collapse
        sidebar.find('.collapse').on('show.bs.collapse', function (e) {
            e.stopPropagation();
            var parents = $(this).parents('ul:first').find('> li.open > ul');
            if (parents.length) {
                parents.collapse('hide').closest('.hasSubmenu').removeClass('open');
            }
            $(this).closest('.hasSubmenu').addClass('open');
        });

        sidebar.find('.collapse').on('hidden.bs.collapse', function (e) {
            e.stopPropagation();
            $(this).closest('.hasSubmenu').removeClass('open');
        });

        sidebar.find('.collapse').collapse({ toggle: false });

    };

    $('.sidebar[data-type="collapse"]').each(function(){
        $(this).tkSidebarCollapse();
    });

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/sidebar/js/_dropdown.js":[function(require,module,exports){
(function ($) {
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkSidebarDropdown = function () {

        if (! this.length) return;

        var sidebar = this;

        sidebar.find('.collapse')
            .off('shown.bs.collapse')
            .off('show.bs.collapse')
            .off('hidden.bs.collapse');

        var nice = sidebar.find('[data-scrollable]').getNiceScroll()[ 0 ];

        nice.scrollstart(function () {
            if (! sidebar.is('[data-type="dropdown"]')) return;
            sidebar.addClass('scrolling');
            sidebar.find('#dropdown-temp > ul > li').empty();
            sidebar.find('#dropdown-temp').hide();
            sidebar.find('.open').removeClass('open');
        });

        nice.scrollend(function () {
            if (! sidebar.is('[data-type="dropdown"]')) return;
            $.data(this, 'lastScrollTop', nice.getScrollTop());
            sidebar.removeClass('scrolling');
        });

        sidebar.find('.hasSubmenu').addClass('dropdown').removeClass('open')
            .find('> ul').addClass('dropdown-menu').removeClass('collapse in').removeAttr('style')
            .end()
            .find('> a').removeClass('collapsed')
            .removeAttr('data-toggle');

        sidebar.find('.sidebar-menu > li.dropdown > a').on('mouseenter', function () {

            var c = sidebar.find('#dropdown-temp');

            sidebar.find('.open').removeClass('open');
            c.hide();

            if (! $(this).parent('.dropdown').is('.open') && ! sidebar.is('.scrolling')) {
                var p = $(this).parent('.dropdown'),
                    t = p.find('> .dropdown-menu').clone().removeClass('submenu-hide');

                if (! c.length) {
                    c = $('<div/>').attr('id', 'dropdown-temp').appendTo(sidebar);
                    c.html('<ul><li></li></ul>');
                }

                c.show();
                c.find('.dropdown-menu').remove();
                c = c.find('> ul > li').css({overflow: 'visible'}).addClass('dropdown open');

                p.addClass('open');
                t.appendTo(c).css({
                    top: p.offset().top - c.offset().top,
                    left: '100%'
                }).show();

                if (sidebar.is('.right')) {
                    t.css({
                        left: 'auto',
                        right: '100%'
                    });
                }
            }
        });

        sidebar.find('.sidebar-menu > li > a').on('mouseenter', function () {

            if (! $(this).parent().is('.dropdown')) {
                var sidebar = $(this).closest('.sidebar');
                sidebar.find('.open').removeClass('open');
                sidebar.find('#dropdown-temp').hide();
            }

        });

        sidebar.find('.sidebar-menu > li > a').on('click', function (e) {
            if ($(this).parent().is('.dropdown')) {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        sidebar.on('mouseleave', function () {
            $(this).find('#dropdown-temp').hide();
            $(this).find('.open').removeClass('open');
        });

        sidebar.find('.dropdown').on('mouseover', function () {
            $(this).addClass('open').children('ul').removeClass('submenu-hide').addClass('submenu-show');
        }).on('mouseout', function () {
            $(this).children('ul').removeClass('.submenu-show').addClass('submenu-hide');
        });

        $('body').on('mouseout', '#dropdown-temp .dropdown', function () {
            $('.sidebar-menu .open', $(this).closest('.sidebar')).removeClass('.open');
        });

    };

    var transform_dd = function(){

        $('.sidebar[data-type="dropdown"]').each(function(){
            $(this).tkSidebarDropdown();
        });

    };

    var transform_collapse = function(){

        $('.sidebar[data-type="collapse"]').each(function(){
            $(this).tkSidebarCollapse();
        });

    };

    transform_dd();

    $(window).bind('enterBreakpoint480', function () {
        if (! $('.sidebar[data-type="dropdown"]').length) return;
        $('.sidebar[data-type="dropdown"]').attr('data-type', 'collapse').attr('data-transformed', true);
        transform_collapse();
    });

    function make_dd() {
        if (! $('.sidebar[data-type="collapse"][data-transformed]').length) return;
        $('.sidebar[data-type="collapse"][data-transformed]').attr('data-type', 'dropdown').attr('data-transformed', true);
        transform_dd();
    }

    $(window).bind('enterBreakpoint768', make_dd);

    $(window).bind('enterBreakpoint1024', make_dd);

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/sidebar/js/_options.js":[function(require,module,exports){
module.exports = function (sidebar) {
    return {
        "transform-button": sidebar.data('transformButton') === true,
        "transform-button-icon": sidebar.data('transformButtonIcon') || 'fa-ellipsis-h'
    };
};
},{}],"/Code/html/themes/learning-1.1.0/lib/sidebar/js/_sidebar-menu.js":[function(require,module,exports){
(function ($) {

    var sidebars = $('.sidebar');

    sidebars.each(function () {

        var sidebar = $(this);
        var options = require('./_options')(sidebar);

        if (options[ 'transform-button' ]) {
            var button = $('<button type="button"></button>');

            button
                .attr('data-toggle', 'sidebar-transform')
                .addClass('btn btn-default')
                .html('<i class="fa ' + options[ 'transform-button-icon' ] + '"></i>');

            sidebar.find('.sidebar-menu').append(button);
        }
    });

}(jQuery));
},{"./_options":"/Code/html/themes/learning-1.1.0/lib/sidebar/js/_options.js"}],"/Code/html/themes/learning-1.1.0/lib/sidebar/js/_sidebar-toggle.js":[function(require,module,exports){
(function ($) {
    "use strict";

    $('#subnav').collapse({'toggle': false});

    function mobilecheck() {
        var check = false;
        (function (a) {
            if (/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }

    (function () {

        var defaults = {
                effect: 'st-effect-1',
                duration: 550,
                overlay: false
            },

            containerSelector = '.st-container',

            eventtype = mobilecheck() ? 'touchstart' : 'click',

            getLayoutClasses = function (sidebar, direction) {

                var layoutClasses = sidebar.data('layoutClasses');

                if (! layoutClasses) {
                    var toggleLayout = sidebar.data('toggleLayout');
                    if (typeof toggleLayout == 'string') {
                        layoutClasses = toggleLayout.split(",").join(" ");
                        sidebar.data('layoutClasses', layoutClasses);
                        return layoutClasses;
                    }

                    var match = new RegExp('sidebar-' + direction + '(\\S+)', 'ig');
                    layoutClasses = $('html').get(0).className.match(match);
                    if (layoutClasses !== null && layoutClasses.length) {
                        layoutClasses = layoutClasses.join(" ");
                        sidebar.data('layoutClasses', layoutClasses);
                    }
                }

                return layoutClasses;

            },

            getSidebarDataOptions = function(sidebar){

                return {
                    effect: sidebar.data('effect'),
                    overlay: sidebar.data('overlay')
                };

            },

            animating = function () {

                if ($('body').hasClass('animating')) return true;
                $('body').addClass('animating');

                setTimeout(function () {
                    $('body').removeClass('animating');
                }, defaults.duration);

                return false;

            },

            reset = function (id, options) {

                var container = $(containerSelector);

                var target = typeof id !== 'undefined' ? '#' + id : container.data('stMenuTarget'),
                    sidebar = $(target);

                if (! sidebar.length) return false;
                if (! sidebar.is(':visible')) return false;
                if (sidebar.hasClass('sidebar-closed')) return false;

                var effect = typeof options !== 'undefined' && options.effect ? options.effect : container.data('stMenuEffect'),
                    direction = sidebar.is('.left') ? 'l' : 'r',
                    size = sidebar.get(0).className.match(/sidebar-size-(\S+)/).pop(),
                    htmlClass = 'st-effect-' + direction + size,
                    toggleLayout = sidebar.data('toggleLayout'),
                    layoutClasses = getLayoutClasses(sidebar, direction),
                    eventData = {
                        sidebar: sidebar,
                        target: target
                    };

                $(document).trigger('sidebar.hide', eventData);

                $('[data-toggle="sidebar-menu"][href="' + target + '"]')
                    .removeClass('active')
                    .closest('li')
                    .removeClass('active');

                $('html').addClass(htmlClass);
                sidebar.addClass(effect);
                container.addClass(effect);

                container.removeClass('st-menu-open st-pusher-overlay');

                setTimeout(function () {
                    $('html').removeClass(htmlClass);
                    if (toggleLayout) $('html').removeClass(layoutClasses);
                    sidebar.removeClass(effect);
                    container.get(0).className = 'st-container'; // clear
                    sidebar.addClass('sidebar-closed').hide();
                    $(document).trigger('sidebar.hidden', eventData);
                }, defaults.duration);

            },

            open = function (target, options) {

                var container = $(containerSelector);

                var sidebar = $(target);
                if (! sidebar.length) return false;

                // on mobile, allow only one sidebar to be open at the same time
                if ($(window).width() < 768 && container.hasClass('st-menu-open')) {
                    return reset();
                }

                $('[data-toggle="sidebar-menu"][href="' + target + '"]')
                    .addClass('active')
                    .closest('li')
                    .addClass('active');

                var effect = options.effect,
                    overlay = options.overlay;

                var direction = sidebar.is('.left') ? 'l' : 'r',
                    size = sidebar.get(0).className.match(/sidebar-size-(\S+)/).pop(),
                    htmlClass = 'st-effect-' + direction + size,
                    toggleLayout = sidebar.data('toggleLayout'),
                    layoutClasses = getLayoutClasses(sidebar, direction),
                    eventData = {
                        sidebar: sidebar,
                        target: target
                    };

                $(document).trigger('sidebar.show', eventData);

                $('html').addClass(htmlClass);
                sidebar.show().removeClass('sidebar-closed');

                container.data('stMenuEffect', effect);
                container.data('stMenuTarget', target);

                sidebar.addClass(effect);
                container.addClass(effect);
                if (overlay) container.addClass('st-pusher-overlay');

                setTimeout(function () {
                    container.addClass('st-menu-open');
                    sidebar.find('[data-scrollable]').getNiceScroll().resize();
                    $(window).trigger('resize');
                }, 25);

                setTimeout(function () {
                    if (toggleLayout) $('html').addClass(layoutClasses);
                    $(document).trigger('sidebar.shown', eventData);
                }, defaults.duration);

            },

            toggle = function (e) {

                e.stopPropagation();
                e.preventDefault();

                var a = animating();
                if (a) return false;

                var button = $(this),
                    target = button.attr('href'),
                    sidebar;

                if (target.length > 3) {
                    sidebar = $(target);
                    if (! sidebar.length) return false;
                }

                if (target.length < 3) {
                    var currentActiveElement = $('[data-toggle="sidebar-menu"]').not(this).closest('li').length ? $('[data-toggle="sidebar-menu"]').not(this).closest('li') : $('[data-toggle="sidebar-menu"]').not(this);
                    var activeElement = $(this).closest('li').length ? $(this).closest('li') : $(this);

                    currentActiveElement.removeClass('active');
                    activeElement.addClass('active');

                    if ($('html').hasClass('show-sidebar')) activeElement.removeClass('active');

                    $('html').removeClass('show-sidebar');

                    if (activeElement.hasClass('active')) $('html').addClass('show-sidebar');
                    return;
                }

                var dataOptions = getSidebarDataOptions(sidebar),
                    buttonOptions = {};

                if (button.data('effect')) buttonOptions.effect = button.data('effect');
                if (button.data('overlay')) buttonOptions.overlay = button.data('overlay');

                var options = $.extend({}, defaults, dataOptions, buttonOptions);

                if (! sidebar.hasClass('sidebar-closed') && sidebar.is(':visible')) {
                    reset(sidebar.attr('id'), options);
                    return;
                }

                open(target, options);

            };

        $('body').on(eventtype, '[data-toggle="sidebar-menu"]', toggle);

        $(document).on('keydown', null, 'esc', function () {

            var container = $(containerSelector);

            if (container.hasClass('st-menu-open')) {
                reset();
                return false;
            }

        });

        /**
         * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
         */
        $.fn.tkSidebarToggleBar = function () {

            if (! this.length) return;

            var sidebar = this;

            /* Sidebar Toggle Bar */
            if (sidebar.data('toggleBar')) {
                var bar = $('<a></a>');
                bar.attr('href', '#' + sidebar.attr('id'))
                    .attr('data-toggle', 'sidebar-menu')
                    .addClass('sidebar-toggle-bar');

                sidebar.append(bar);
            }

        };

        $('.sidebar').each(function(){
            $(this).tkSidebarToggleBar();
        });

        window.sidebar = {

            open: function (id, options) {

                var a = animating();
                if (a) return false;

                options = $.extend({}, defaults, options);

                return open('#' + id, options);

            },

            close: function (id, options) {

                options = $.extend({}, defaults, options);

                return reset(id, options);

            },

            options: getSidebarDataOptions

        };

    })();

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/lib/sidebar/js/main.js":[function(require,module,exports){
require('./_breakpoints');
require('./_sidebar-menu');
require('./_collapsible');
require('./_dropdown');
require('./_sidebar-toggle');

(function($){
    "use strict";

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkSidebar = function (options) {

        if (! this.length) return;

        var settings = $.extend({
            menuType: false,
            toggleBar: false
        }, options);

        var sidebar = this;

        if (settings.menuType == "collapse") {
            sidebar.tkSidebarCollapse();
        }

        if (settings.menuType == "dropdown") {
            sidebar.tkSidebarDropdown();
        }

        if (settings.toggleBar === true) {
            sidebar.tkSidebarToggleBar();
        }

    };

})(jQuery);
},{"./_breakpoints":"/Code/html/themes/learning-1.1.0/lib/sidebar/js/_breakpoints.js","./_collapsible":"/Code/html/themes/learning-1.1.0/lib/sidebar/js/_collapsible.js","./_dropdown":"/Code/html/themes/learning-1.1.0/lib/sidebar/js/_dropdown.js","./_sidebar-menu":"/Code/html/themes/learning-1.1.0/lib/sidebar/js/_sidebar-menu.js","./_sidebar-toggle":"/Code/html/themes/learning-1.1.0/lib/sidebar/js/_sidebar-toggle.js"}],"/Code/html/themes/learning-1.1.0/src/js/themes/html/_countdown.js":[function(require,module,exports){
(function ($) {})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/src/js/themes/html/_curriculum.js":[function(require,module,exports){
(function ($) {
    "use strict";

    $.fn.tkCurriculum = function () {

        var e = this;

        if (typeof angular == 'undefined') {
            this.find('.list-group-item').on('click', function () {
                location.href = $(this).data('target');
            });
        }

        this.find('.collapse')
            .on('show.bs.collapse', function () {
                e.addClass('open');
            })
            .on('hide.bs.collapse', function () {
                e.removeClass('open');
            });
    };

    $('.curriculum').tkCurriculum();

})(jQuery);
},{}],"/Code/html/themes/learning-1.1.0/src/js/themes/html/_flotchart-earnings.js":[function(require,module,exports){
(function ($) {

    var skin = require('charts/js/lib/_skin')();
    var charts = require('charts/js/flot/_helper');

    if (typeof charts == 'undefined')
        return;

    charts.chart_earnings =
    {
        // chart data
        data: {
            d1: [],
            d2: []
        },

        // will hold the chart object
        plot: null,

        // chart options
        options: {
            colors: [ colors[ 'warning-color' ], colors[ 'success-color' ] ],
            grid: {
                color: colors[ 'default-light-color' ],
                borderWidth: 1,
                borderColor: "transparent",
                clickable: true,
                hoverable: true
            },
            series: {
                grow: {active: false},
                lines: {
                    show: true,
                    fill: false,
                    lineWidth: 2,
                    steps: false,
                    color: config.skins[ skin ][ 'primary-color' ]
                },
                points: {show: false}
            },
            legend: {
                noColumns: 2,
                position: "nw",
                backgroundColor: null,
                backgroundOpacity: 0
            },
            yaxis: {
                ticks: 3,
                tickSize: 40,
                tickFormatter: function (val, axis) {
                    return val + "k";
                }
            },
            xaxis: {ticks: 4, tickDecimals: 0, tickColor: 'transparent'},
            shadowSize: 0,
            tooltip: true,
            tooltipOpts: {
                content: "%s : %y.0",
                shifts: {
                    x: - 30,
                    y: - 50
                },
                defaultTheme: false
            }
        },

        // initialize
        init: function (wrapper) {

            if (! wrapper.length) return;

            // generate some data
            this.data.d1 = [ [ 1, 10 + charts.utility.randNum() ], [ 2, 20 + charts.utility.randNum() ], [ 3, 50 + charts.utility.randNum() ], [ 4, 160 + charts.utility.randNum() ], [ 5, 110 + charts.utility.randNum() ], [ 6, 36 + charts.utility.randNum() ], [ 7, 70 + charts.utility.randNum() ], [ 8, 30 + charts.utility.randNum() ], [ 9, 36 + charts.utility.randNum() ], [ 10, 80 + charts.utility.randNum() ], [ 11, 140 + charts.utility.randNum() ], [ 12, 47 + charts.utility.randNum() ], [ 13, 50 + charts.utility.randNum() ], [ 14, 50 + charts.utility.randNum() ], [ 15, 45 + charts.utility.randNum() ], [ 16, 100 + charts.utility.randNum() ], [ 17, 50 + charts.utility.randNum() ], [ 18, 53 + charts.utility.randNum() ], [ 19, 56 + charts.utility.randNum() ], [ 20, 59 + charts.utility.randNum() ], [ 21, 62 + charts.utility.randNum() ], [ 22, 90 + charts.utility.randNum() ], [ 23, 56 + charts.utility.randNum() ], [ 24, 59 + charts.utility.randNum() ], [ 25, 62 + charts.utility.randNum() ], [ 26, 65 + charts.utility.randNum() ], [ 27, 80 + charts.utility.randNum() ], [ 28, 71 + charts.utility.randNum() ], [ 29, 75 + charts.utility.randNum() ], [ 30, 120 + charts.utility.randNum() ] ];
            this.data.d2 = [ [ 1, 3 + charts.utility.randNum() ], [ 2, 6 + charts.utility.randNum() ], [ 3, 30 + charts.utility.randNum() ], [ 4, 110 + charts.utility.randNum() ], [ 5, 80 + charts.utility.randNum() ], [ 6, 18 + charts.utility.randNum() ], [ 7, 50 + charts.utility.randNum() ], [ 8, 15 + charts.utility.randNum() ], [ 9, 18 + charts.utility.randNum() ], [ 10, 60 + charts.utility.randNum() ], [ 11, 110 + charts.utility.randNum() ], [ 12, 27 + charts.utility.randNum() ], [ 13, 30 + charts.utility.randNum() ], [ 14, 33 + charts.utility.randNum() ], [ 15, 24 + charts.utility.randNum() ], [ 16, 80 + charts.utility.randNum() ], [ 17, 30 + charts.utility.randNum() ], [ 18, 33 + charts.utility.randNum() ], [ 19, 36 + charts.utility.randNum() ], [ 20, 39 + charts.utility.randNum() ], [ 21, 42 + charts.utility.randNum() ], [ 22, 70 + charts.utility.randNum() ], [ 23, 36 + charts.utility.randNum() ], [ 24, 39 + charts.utility.randNum() ], [ 25, 42 + charts.utility.randNum() ], [ 26, 45 + charts.utility.randNum() ], [ 27, 60 + charts.utility.randNum() ], [ 28, 51 + charts.utility.randNum() ], [ 29, 55 + charts.utility.randNum() ], [ 30, 100 + charts.utility.randNum() ] ];

            // make chart
            this.plot = $.plot(
                wrapper, [
                    {
                        label: "Gross Revenue",
                        data: this.data.d1
                    },
                    {
                        label: "Net Revenue",
                        data: this.data.d2
                    }
                ],
                this.options
            );
        }
    };

    /**
     * jQuery plugin wrapper for compatibility with Angular UI.Utils: jQuery Passthrough
     */
    $.fn.tkFlotChartEarnings = function () {

        if (! this.length) return;

        charts.chart_earnings.init(this);

    };

    $('[data-toggle="flot-chart-earnings"]').tkFlotChartEarnings();

})(jQuery);
},{"charts/js/flot/_helper":"/Code/html/themes/learning-1.1.0/lib/charts/js/flot/_helper.js","charts/js/lib/_skin":"/Code/html/themes/learning-1.1.0/lib/charts/js/lib/_skin.js"}],"/Code/html/themes/learning-1.1.0/src/js/themes/html/_scroll.js":[function(require,module,exports){
(function ($, window) {
    "use strict";

    var $window = $(window),
        $content = $('.st-content-inner');

    $.fn.tkScrollNavbarTransition = function () {

        var handleScroll = function (e) {

            var $navbar = $('.navbar-fixed-top'),
                $html = $('html');

            if (Modernizr.touch || ! $navbar.length || ! $html.is('.transition-navbar-scroll')) return false;

            var scrollTop = parseInt($(e.currentTarget).scrollTop(), 10);

            if (! isNaN(scrollTop)) {
                if (scrollTop > 50) {
                    if ($navbar.data('z') !== 1) {
                        $navbar.attr('data-z', 1);
                    }
                    if ($navbar.is('.navbar-size-xlarge')) {
                        $navbar.removeClass('navbar-size-xlarge');
                    }
                    if ($html.is('.ls-top-navbar-xlarge')) {
                        $html.removeClass('ls-top-navbar-xlarge').addClass('ls-top-navbar-large');
                    }
                    if ($html.is('.top-navbar-xlarge')) {
                        $html.removeClass('top-navbar-xlarge').addClass('top-navbar-large');
                    }
                }
                if (scrollTop <= 0) {
                    $navbar.attr('data-z', 0);
                    $navbar.addClass('navbar-size-xlarge');
                    if ($html.is('.ls-top-navbar-large')) {
                        $html.removeClass('ls-top-navbar-large').addClass('ls-top-navbar-xlarge');
                    }
                    if ($html.is('.top-navbar-large')) {
                        $html.removeClass('top-navbar-large').addClass('top-navbar-xlarge');
                    }
                }
            }

        };

        this.scroll(handleScroll);

    };

    if ($content.length) {
        $content.tkScrollNavbarTransition();
    }
    else {
        $window.tkScrollNavbarTransition();
    }

})(jQuery, window);
},{}],"/Code/html/themes/learning-1.1.0/src/js/themes/html/main.js":[function(require,module,exports){
// Curriculum
require('./_curriculum');

// Scrolling behaviour
require('./_scroll');
},{"./_curriculum":"/Code/html/themes/learning-1.1.0/src/js/themes/html/_curriculum.js","./_flotchart-earnings":"/Code/html/themes/learning-1.1.0/src/js/themes/html/_flotchart-earnings.js","./_scroll":"/Code/html/themes/learning-1.1.0/src/js/themes/html/_scroll.js"}]},{},["./src/js/themes/html/app.js"]);
