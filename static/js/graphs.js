d3.json("/asthma/projects").then(function(data) { 
    d3.json("static/geojson/us-states-abb.json").then(function(statesJson) {

        console.log(data);
        dc.config.defaultColors(d3.schemeCategory10);

        var dateParse = d3.timeParse("%Y");
        data.forEach(function(d) {
            d["Year"] = dateParse(d["Year"]);
        });

        data.forEach(function(d) {
            if (d.Income == "") {
                //delete d.Income;
                d.Income = "1";
            }
            if (d.Race == "") {
                //delete d.Race;
                d.Race = "1";
            }
            if (d.Education == "") {
                //delete d.Education;
                d.Education = "1";
            }
            if (d.Age == "") {
                //delete d.Age;
                d.Age = "1";
            }
        });

        var ndx = crossfilter(data);
        var all = ndx.groupAll();

        var yearDim = ndx.dimension(function(d) { return d.Year; });
        var stateNameDim = ndx.dimension(function(d) { return d.State_Name; });
        var numCasesDim = ndx.dimension(function(d) { return d.Num_Cases; });
        var percentCasesDim = ndx.dimension(function(d) { return d.Percent_Cases; });
        var incomeDim = ndx.dimension(function(d) { return d.Income; });
        var ageDim = ndx.dimension(function(d) { return d.Age});
        var eduDim = ndx.dimension(function(d) { return d.Education});
        var raceDim = ndx.dimension(function(d) { return d.Race});

        var sumCases = yearDim.groupAll().reduceSum(function(d) {return d.Num_Cases / 4});
        var avgPercent = ndx.groupAll().reduce(
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
        var numCasesByRace = raceDim.group().reduceSum(function(d) {return (Math.round(d.Num_Cases))});
        var percentByIncome = incomeDim.group().reduce(
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
        var percentByRace = raceDim.group().reduce(
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
        var percentByEdu = eduDim.group().reduce(
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
        // remove_empty_bins(percentByIncome);
        // remove_empty_bins(percentByRace);
        // remove_empty_bins(percentByEdu);
        // remove_empty_bins(percentByAge);
        var numCasesByYear = yearDim.group().reduceSum(function(d) {return d.Num_Cases / 100000}); 
        var numCasesByIncome = incomeDim.group().reduceSum(function(d) {return d.Num_Cases / 100000});
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
        var yearCases = yearDim.group().reduce(
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
    var numCasesByState = yearDim.group().reduce(
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
            console.log(new Date("2011-01-01 00:00:00").getTime());
        var avgCases = ndx.groupAll().reduce(
            // add 
            function (p,v){
                p.totalCases += v["Num_Cases"]; 
                switch (v.Year.getTime()) {
                    case (new Date("2011-01-01 00:00:00").getTime()) : {
                        p.cases2011 += v["Num_Cases"];
                        break;
                    }
                    case (new Date("2012-01-01 00:00:00").getTime()) : {
                        p.cases2012 += v["Num_Cases"];
                        break;
                    }
                    case (new Date("2013-01-01 00:00:00").getTime()) : {
                        p.cases2013 += v["Num_Cases"];
                        break;
                    }
                    case (new Date("2014-01-01 00:00:00").getTime()) : {
                        p.cases2014 += v["Num_Cases"];
                        break;
                    }
                    case (new Date("2015-01-01 00:00:00").getTime()) : {
                        p.cases2015 += v["Num_Cases"];
                        break;
                    }
                    case (new Date("2016-01-01 00:00:00").getTime()) : {
                        p.cases2016 += v["Num_Cases"];
                        break;
                    }
                    case (new Date("2017-01-01 00:00:00").getTime()) : {
                        p.cases2017 += v["Num_Cases"];
                        break;
                    }
                    case (new Date("2018-01-01 00:00:00").getTime()) : {
                        p.cases2018 += v["Num_Cases"];
                        break;
                    }
                    case (new Date("2019-01-01 00:00:00").getTime()) : {
                        p.cases2019 += v["Num_Cases"];
                        break;
                    }
                    case (new Date("2020-01-01 00:00:00").getTime()) : {
                        p.cases2020 += v["Num_Cases"];
                        break;
                    }
                    case (new Date("2021-01-01 00:00:00").getTime()) : {
                        p.cases2021 += v["Num_Cases"];
                        break;
                    }
                    case (new Date("2022-01-01 00:00:00").getTime()) : {
                        p.cases2022 += v["Num_Cases"];
                        break;
                    }
                    case (new Date("2023-01-01 00:00:00").getTime()) : {
                        p.cases2023 += v["Num_Cases"];
                        break;
                    }
                }
                p.count++; 
                p.avg = (p.totalCases / p.count);
                return p;
            },
            // remove
            function (p,v){
                p.totalCases -= v["Num_Cases"]; 
                p.count--; 
                switch (v.Year.getTime()) {
                    case (new Date("2011-01-01 00:00:00").getTime()) : {
                        p.cases2011 -= v["Num_Cases"];
                        break;
                    }
                    case (new Date("2012-01-01 00:00:00").getTime()) : {
                        p.cases2012 -= v["Num_Cases"];
                        break;
                    }
                    case (new Date("2013-01-01 00:00:00").getTime()) : {
                        p.cases2013 -= v["Num_Cases"];
                        break;
                    }
                    case (new Date("2014-01-01 00:00:00").getTime()) : {
                        p.cases2014 -= v["Num_Cases"];
                        break;
                    }
                    case (new Date("2015-01-01 00:00:00").getTime()) : {
                        p.cases2015 -= v["Num_Cases"];
                        break;
                    }
                    case (new Date("2016-01-01 00:00:00").getTime()) : {
                        p.cases2016 -= v["Num_Cases"];
                        break;
                    }
                    case (new Date("2017-01-01 00:00:00").getTime()) : {
                        p.cases2017 -= v["Num_Cases"];
                        break;
                    }
                    case (new Date("2018-01-01 00:00:00").getTime()) : {
                        p.cases2018 -= v["Num_Cases"];
                        break;
                    }
                    case (new Date("2019-01-01 00:00:00").getTime()) : {
                        p.cases2019 -= v["Num_Cases"];
                        break;
                    }
                    case (new Date("2020-01-01 00:00:00").getTime()) : {
                        p.cases2020 -= v["Num_Cases"];
                        break;
                    }
                    case (new Date("2021-01-01 00:00:00").getTime()) : {
                        p.cases2021 -= v["Num_Cases"];
                        break;
                    }
                    case (new Date("2022-01-01 00:00:00").getTime()) : {
                        p.cases2022 -= v["Num_Cases"];
                        break;
                    }
                    case (new Date("2023-01-01 00:00:00").getTime()) : {
                        p.cases2023 -= v["Num_Cases"];
                        break;
                    }
                }
                p.avg = (p.totalCases / p.count);
                return p;
            },
            // init
            function init (){ 
                return {
                totalCases: 0,
                cases2023: 0, 
                cases2022: 0, 
                cases2021: 0, 
                cases2020: 0, 
                cases2019: 0, 
                cases2018: 0, 
                cases2017: 0, 
                cases2016: 0, 
                cases2015: 0, 
                cases2014: 0, 
                cases2013: 0, 
                cases2012: 0, 
                cases2011: 0, 
                count: 0,
                avg: 0
                };
            }
            );

        var yearChart = dc.barChart("#year-line-chart");
        var yearPercentChart = dc.lineChart("#percent-line-chart");
        var usChart = dc.geoChoroplethChart("#us-chart");
        var ageCasesChart = dc.barChart("#age-cases-chart");
        var raceCasesChart = dc.barChart("#race-cases-chart");
        var eduCasesChart = dc.barChart("#edu-cases-chart");
        var yearCasesChart = dc.rowChart("#year-chart");
        var totalCasesND = dc.numberDisplay("#cases-display");
        var avgCasesND = dc.numberDisplay("#avg-cases-display");
        var avgPercentND = dc.numberDisplay("#avg-percent-display");
        
        totalCasesND
        .formatNumber(d3.format(",d"))
        .valueAccessor(function(d){return d; })
        .html({
            some:"<span style=\"color:black; font-size: 60px;\">%number</span>",
          })
        .group(numCasesByState)
        .valueAccessor(function(d) {
            return sumCases.value() / 4;
        });

        // totalCasesND.value = function() {
        //     return sumCases.value() / (yearCases.value().count);
        // };

        avgCasesND
        .formatNumber(d3.format("~r"))
        .html({
            some:"<span style=\"color:black; font-size: 60px;\">%number</span>",
          })
        .group(avgPercent);

        avgCasesND.value = function() {
            return (Math.round(avgCases.value().cases2022 * 1000) / 1000);
        };

        avgPercentND
        .formatNumber(d3.format(",d"))
        .html({
            some:"<span style=\"color:black; font-size: 60px;\">%number</span>",
          })
        .group(avgCases).valueAccessor(function() {
            var maxYear;
            var minYear;
            if (avgCases.value().cases2023 > 1) {
                maxYear = avgCases.value().cases2023;
            }
            else if (avgCases.value().cases2022 > 1) {
                maxYear = avgCases.value().cases2022;
            }
            else if (avgCases.value().cases2021 > 1) {
                maxYear = avgCases.value().cases2021;
            }
            else if (avgCases.value().cases2020 > 1) {
                maxYear = avgCases.value().cases2020;
            }
            else if (avgCases.value().cases2019 > 1) {
                maxYear = avgCases.value().cases2019;
            }
            else if (avgCases.value().cases2018 > 1) {
                maxYear = avgCases.value().cases2018;
            }
            else if (avgCases.value().cases2017 > 1) {
                maxYear = avgCases.value().cases2017;
            }
            else if (avgCases.value().cases2016 > 1) {
                maxYear = avgCases.value().cases2016;
            }
            else if (avgCases.value().cases2015 > 1) {
                maxYear = avgCases.value().cases2015;
            }
            else if (avgCases.value().cases2014 > 1) {
                maxYear = avgCases.value().cases2014;
            }
            else if (avgCases.value().cases2013 > 1) {
                maxYear = avgCases.value().cases2013;
            }
            else if (avgCases.value().cases2012 > 1) {
                maxYear = avgCases.value().cases2012;
            }
            else if (avgCases.value().cases2011 > 1) {
                maxYear = avgCases.value().cases2011;
            }

            if (avgCases.value().cases2011 > 0) {
                minYear = avgCases.value().cases2011;
            }
            else if (avgCases.value().cases2012 > 0) {
                minYear = avgCases.value().cases2012;
            }
            else if (avgCases.value().cases2013 > 0) {
                minYear = avgCases.value().cases2013;
            }
            else if (avgCases.value().cases2014 > 0) {
                minYear = avgCases.value().cases2014;
            }
            else if (avgCases.value().cases2015 > 0) {
                minYear = avgCases.value().cases2015;
            }
            else if (avgCases.value().cases2016 > 0) {
                minYear = avgCases.value().cases2016;
            }
            else if (avgCases.value().cases2017 > 0) {
                minYear = avgCases.value().cases2017;
            }
            else if (avgCases.value().cases2018 > 0) {
                minYear = avgCases.value().cases2018;
            }
            else if (avgCases.value().cases2019 > 0) {
                minYear = avgCases.value().cases2019;
            }
            else if (avgCases.value().cases2020 > 0) {
                minYear = avgCases.value().cases2020;
            }
            else if (avgCases.value().cases2021 > 0) {
                minYear = avgCases.value().cases2021;
            }
            else if (avgCases.value().cases2022 > 0) {
                minYear = avgCases.value().cases2022;
            }
            else if (avgCases.value().cases2023 > 0) {
                minYear = avgCases.value().cases2023;
            }

            return ((maxYear - minYear) / 4);

        }

        );

        ageCasesChart
        .width(null)
        .height(usChart.height() + usChart.width() / 3.6)
        .ordering(function(d){ return -d.value.avg})
        .margins({ top: 10, left: 30, right: 40, bottom: 75})
        .dimension(ageDim)
        .group(percentByAge).valueAccessor(function(d) {
            if (d.key != 1)
            return Math.round(d.value.avg * 1000) / 1000;
        })
        .x(d3.scaleOrdinal().domain(["18-24", "55-64", "45-54", "35-44", "25-34", "65+"]))
        .xUnits(dc.units.ordinal)
        .yAxisLabel("Average Asthma Percentage")
        .xAxisLabel("Age")
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
        
        raceCasesChart
        .width(null)
        .height(usChart.height() + usChart.width() / 3.5)
        .ordering(function(d){ return d.value.avg})
        .margins({ top: 10, left: 30, right: 40, bottom: 75})
        .dimension(eduDim)
        .group(percentByRace).valueAccessor(function(d) {
            if (d.key != 1)
            return Math.round(d.value.avg * 1000) / 1000;
        })
        .x(d3.scaleOrdinal().domain(["Multirace NH", "Black NH", "White NH", "Hispanic", "Other NH"]))
        .xUnits(dc.units.ordinal)
        .yAxisLabel("Average Asthma Percentage")
        .xAxisLabel("Race")
        .elasticY(true)
        .transitionDuration(500)
        .gap(10)
        .renderlet(
            function (yearChart) {
                yearChart.selectAll('g.x text')
                         .attr('dx', '-30')
                         .attr('transform', 'rotate(-65)');
                });

        eduCasesChart
        .width(null)
        .height(usChart.height() + usChart.width() / 3.5)
        .ordering(function(d){ return -d.value.avg})
        .margins({ top: 10, left: 30, right: 40, bottom: 75})
        .dimension(eduDim)
        .group(percentByEdu).valueAccessor(function(d) {
            if (d.key != 1)
            return Math.round(d.value.avg * 1000) / 1000;
        })
        .x(d3.scaleOrdinal().domain(["HS Nongrad", "HS Grad", "Some Coll", "Coll Grad"]))
        .xUnits(dc.units.ordinal)
        .yAxisLabel("Average Asthma Percentage")
        .xAxisLabel("Education")
        .elasticY(true)
        .transitionDuration(500)
        .gap(10)
        .renderlet(
            function (yearChart) {
                yearChart.selectAll('g.x text')
                         .attr('dx', '-30')
                         .attr('transform', 'rotate(-65)');
                });

        yearCasesChart
        .ordering(function(d){ return -d.value.avg})
        .cap(10)
        .margins({ top: 10, left: 5, right: 80, bottom: 50})
        .othersGrouper(false)
        .width(null)
        .height(usChart.height() + usChart.width() / 3.7)
        .dimension(stateNameDim)
        .group(percentByState).valueAccessor(function(d) {
            return Math.round(d.value.avg * 1000) / 1000;
        })
        .elasticX(true)
        .xAxis().ticks(6);

        yearChart
        .width(null)
        .height(usChart.height() + usChart.width() / 3.7)
        .ordering(function(d){ return -d.value.avg})
        .margins({ top: 10, left: 30, right: 40, bottom: 75})
        .dimension(incomeDim)
        .group(percentByIncome).valueAccessor(function(d) {
            if (d.key != 1)
            return Math.round(d.value.avg * 1000) / 1000;
        })
        .x(d3.scaleOrdinal().domain(["< $15,000", "$15-$24,999", "$25-$49,999", "$50-$74,999", ">=$75,000"]))
        .xUnits(dc.units.ordinal)
        .yAxisLabel("Average Asthma Percentage")
        .xAxisLabel("Income")
        .elasticY(true)
        .transitionDuration(500)
        .gap(10)
        .renderlet(
            function (yearChart) {
                yearChart.selectAll('g.rect')
                        .attr('fill', 'red');
                yearChart.selectAll('g.x text')
                         .attr('dx', '-30')
                         .attr('transform', 'rotate(-65)');
            }
        );

        yearPercentChart
        .width(null)
        .height(usChart.height() + usChart.width() / 3.7)
        .margins({ top: 10, left: 30, right: 30, bottom: 50})
        .x(d3.scaleTime().domain([d3.timeYear.floor(new Date("2011-03-31 00:00:00")), d3.timeYear.ceil(new Date("2024-03-31 10:00:00"))]))
        //.y(d3.scaleLinear().domain([6, 13]))
        .yAxisLabel("Percent of Population with Asthma")
        .xAxisLabel("Year")
        .elasticY(true)
        .elasticX(true)
        .yAxisPadding(0.5)
        .round(d3.timeYear.round)
        .dimension(yearDim)
        .group(percentByYear)
        .valueAccessor(function(d) {
            return Math.round(d.value.avg * 1000) / 1000;
        })
        .transitionDuration(500)
        .xUnits(d3.timeYears)
        .renderHorizontalGridLines(true)
        .renderDataPoints(true)
        .renderlet(
            function (yearChart) {
                yearChart.selectAll('g.x text')
                         .attr('dx', '-20')
                         .attr('transform', 'rotate(-65)');
            }
        );


        usChart.width(null)
        .height(function() {
            if (window.innerWidth < 768) {
                return usChart.width() / 2;
            }
            return usChart.width() / 1.5;
        })
        .dimension(stateNameDim)
            .group(percentByState).valueAccessor(function(d) {
                return Math.round(d.value.avg * 1000) / 1000;
            })
            .colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
            .colorDomain([5, 18])
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
                    .attr("y", chartToUpdate.height() - 4)
                    .text(displayText);
            }
            //AddXAxis(raceCasesChart, "Race");

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

            function remove_empty_bins(source_group) {
                return {
                    all:function () {
                        return source_group.all().filter(function(d) {
                            return d.value != 0;
                        });
                    }
                };
            }

            function find_max_year(data) {
                var maxDate = new Date("2010-03-31 00:00:00");
                console.log(data.Year);
                data.forEach(function(d) {
                    if (d.Year > maxDate) {
                        maxDate = d.Year;
                    }
                })
                return maxDate;
            }

            function find_min_year(data) {
                var minDate = new Date("2023-03-31 00:00:00");
                console.log(data);
                data.forEach(function(d) {
                    if (d.Year > maxDate) {
                        minDate = d.Year;
                    }
                })
                return minDate;
            }

    });
});
