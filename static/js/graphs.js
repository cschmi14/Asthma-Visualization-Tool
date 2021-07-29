d3.json("/asthma/projects").then(function(data) { 
    d3.json("static/geojson/us-states-abb.json").then(function(statesJson) {

        console.log(data);
        dc.config.defaultColors(d3.schemeCategory10);

        var dateParse = d3.timeParse("%Y");
        data.forEach(function(d) {
            d["Year"] = dateParse(d["Year"]);
        });

        var ndx = crossfilter(data);
        var all = ndx.groupAll();

        var yearDim = ndx.dimension(function(d) { return d.Year; });
        var stateNameDim = ndx.dimension(function(d) { return d.State_Name; });
        var numCasesDim = ndx.dimension(function(d) { return d.Num_Cases; });
        var percentCasesDim = ndx.dimension(function(d) { return d.Percent_Cases; });
        var ageDim = ndx.dimension(function(d) { return d.Income; });

        var sumCases = yearDim.groupAll().reduceSum(function(d) {return d.Num_Cases});
        var avgCases = percentCasesDim.group().reduce(
            // add 
            function (p,v){
                p.totalCases += v.Num_Cases; 
                p.count++; 
                p.avg = (p.totalCases / p.count);
                return p;
            },
            // remove
            function (p,v){
                p.totalCases -= v.Num_Cases; 
                p.count--; 
                p.avg = (p.totalCases / p.count);
                return p;
            },
            // init
            function init (){ 
                return {
                totalCases: 0, 
                count: 0,
                avg: 0
                };
            }
            )
            .order (function (d){return d.avg;});
        var numCasesByState = stateNameDim.group().reduceSum(function(d) {return (Math.round(d.Num_Cases))});
        var percentByAge = ageDim.group().reduce(
            // add 
            function (p,v){
                p.totalPower += v["Percent_Cases"]; 
                p.count++; 
                p.avg = (p.totalPower / p.count);
                return p;
            },
            // remove
            function (p,v){
                p.totalPower -= v["Percent_Cases"]; 
                p.count--; 
                p.avg = (p.totalPower / p.count);
                return p;
            },
            // init
            function init (){ 
                return {
                totalPower: 0, 
                count: 0,
                avg: 0
                };
            }
            );
        var numCasesByYear = yearDim.group().reduceSum(function(d) {return d.Num_Cases / 100000}); 
        var numCasesByIncome = ageDim.group().reduceSum(function(d) {return d.Num_Cases / 100000});
        var percentByYear = yearDim.group().reduce(
            // add 
            function (p,v){
                p.totalPower += v["Percent_Cases"]; 
                p.count++; 
                p.avg = (p.totalPower / p.count);
                return p;
            },
            // remove
            function (p,v){
                p.totalPower -= v["Percent_Cases"]; 
                p.count--; 
                p.avg = (p.totalPower / p.count);
                return p;
            },
            // init
            function init (){ 
                return {
                totalPower: 0, 
                count: 0,
                avg: 0
                };
            }
            );
        var percentByState = stateNameDim.group().reduce(
            // add 
            function (p,v){
                p.totalPower += v["Percent_Cases"]; 
                p.count++; 
                p.avg = (p.totalPower / p.count);
                return p;
            },
            // remove
            function (p,v){
                p.totalPower -= v["Percent_Cases"]; 
                p.count--; 
                p.avg = (p.totalPower / p.count);
                return p;
            },
            // init
            function init (){ 
                return {
                totalPower: 0, 
                count: 0,
                avg: 0
                };
            }
            );
        var sumCases = numCasesDim.groupAll().reduceSum(function(d) {return d.Num_Cases});
        var avgCases = ageDim.group().reduce(
            // add 
            function (p,v){
                p.totalCases += v["Num_Cases"]; 
                p.count++; 
                p.avg = (p.totalCases / p.count);
                return p;
            },
            // remove
            function (p,v){
                p.totalCases -= v["Num_Cases"]; 
                p.count--; 
                p.avg = (p.totalCases / p.count);
                return p;
            },
            // init
            function init (){ 
                return {
                totalCases: 0, 
                count: 0,
                avg: 0
                };
            }
            );

        var yearChart = dc.barChart("#year-line-chart");
        var yearPercentChart = dc.lineChart("#percent-line-chart");
        var usChart = dc.geoChoroplethChart("#us-chart");
        var ageCasesChart = dc.rowChart("#age-cases-chart");
        var yearCasesChart = dc.rowChart("#year-chart");
        var totalCasesND = dc.numberDisplay("#cases-display");
        var avgCasesND = dc.numberDisplay("#avg-cases-display");
        
        totalCasesND
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d){return d; })
        .html({
            some:"<span style=\"color:black; font-size: 60px;\">%number</span>",
          })
        .group(sumCases);

        avgCasesND
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d){return d.value.avg; })
        .html({
            some:"<span style=\"color:black; font-size: 60px;\">%number</span>",
          })
        .group(avgCases);


        ageCasesChart
        .ordering(function(d){ return -d.value.avg})
        .othersGrouper(false)
        .width(null)
        .height(250)
        .dimension(ageDim)
        .group(percentByAge).valueAccessor(function(d) {
            return Math.round(d.value.avg * 1000) / 1000;
        })
        .elasticX(true)
        .xAxis().ticks(6)

        yearCasesChart
        .ordering(function(d){ return -d.value.avg})
        .cap(10)
        .othersGrouper(false)
        .width(null)
        .height(250)
        .dimension(stateNameDim)
        .group(percentByState).valueAccessor(function(d) {
            return Math.round(d.value.avg * 1000) / 1000;
        })
        .elasticX(true)
        .xAxis().ticks(6);

        yearChart
        .width(null)
        .height(250)
        .ordering(function(d){ return -d.value.avg})
        .margins({ top: 10, left: 30, right: 10, bottom: 75})
        .dimension(ageDim)
        .group(percentByAge).valueAccessor(function(d) {
            return Math.round(d.value.avg * 1000) / 1000;
        })
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .yAxisLabel("Average Asthma Percentage")
        .xAxisLabel("Income")
        .elasticY(true)
        .transitionDuration(500)
        .gap(10)
        .renderlet(
            function (yearChart) {
                yearChart.selectAll('g.x text')
                         .attr('dx', '-30')
                         .attr('transform', 'rotate(-65)');
            }
        );

        yearPercentChart
        .width(null)
        .height(250)
        .margins({ top: 10, left: 30, right: 10, bottom: 50})
        .x(d3.scaleTime().domain([d3.timeYear.floor(new Date("2011-03-31 00:00:00")), d3.timeYear.ceil(new Date("2023-03-31 10:00:00"))]))
        //.y(d3.scaleLinear().domain([6, 13]))
        .yAxisLabel("Percent of Population with Asthma")
        .xAxisLabel("Year")
        .elasticY(true)
        .yAxisPadding(0.5)
        .round(d3.timeYear.round)
        .dimension(yearDim)
        .group(percentByYear)
        .valueAccessor(function(d) {
            return Math.round(d.value.avg * 1000) / 1000;
        })
        .transitionDuration(500)
        .xUnits(d3.timeYears)
        .renderlet(
            function (yearChart) {
                yearChart.selectAll('g.x text')
                         .attr('dx', '-30')
                         .attr('transform', 'rotate(-65)');
            }
        );;

        usChart.width(null)
        .height(600)
        .dimension(stateNameDim)
            .group(percentByState).valueAccessor(function(d) {
                return Math.round(d.value.avg * 1000) / 1000;
            })
            .colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
            .colorDomain([7, 20])
            .overlayGeoJson(statesJson["features"], "state", function (d) {
                return d.properties.name;
            })
            .projection(d3.geoAlbersUsa()
                        .scale((usChart.height() + usChart.width()) / 1.7)
                        .translate([usChart.width() / 2, usChart.height() / 2]))
            .title(function (p) {
                return "State: " + p["key"]
                        + "\n"
                        + "Asthma Percentage: " + (p["value"]) + "%";
            });

            dc.renderAll();

            function AddXAxis(chartToUpdate, displayText)
            {
                chartToUpdate.svg()
                    .append("text")
                    .attr("class", "x-axis-label")
                    .attr("text-anchor", "middle")
                    .attr("x", chartToUpdate.width()/2)
                    .attr("y", chartToUpdate.height() - 3)
                    .text(displayText);
            }
            AddXAxis(yearCasesChart, "Average Asthma Percentage");
            AddXAxis(ageCasesChart, "Average Asthma Percentage");

            function average_percent(d) {
                var sum = 0;
                d.forEach(function(k, v) {
                    sum += v;
                });
                return d.size() ? sum / d.size() : 0;
            }

            function nonzero_min(chart) {
                dc.override(chart, 'yAxisMin', function () {
                     var min = d3.min(chart.data(), function (layer) {
                         return d3.min(layer.values, function (p) {
                             return p.y + p.y0;
                         });
                     });
                     return dc.utils.subtract(min, chart.yAxisPadding());
                });
                return chart;
            }

    });
});