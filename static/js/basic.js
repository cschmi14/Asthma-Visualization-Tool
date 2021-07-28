d3.json("/asthma/projects").then(function(data) { 
    d3.json("static/geojson/us-states.json").then(function(statesJson) {

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

        var numCasesByState = stateNameDim.group().reduceSum(function(d) {return (Math.round(d.Num_Cases / 1000))});
        var numCasesByYear = yearDim.group().reduceSum(function(d) {return d.Num_Cases / 1000000}); 
        var percentByState = stateNameDim.group().reduceSum(function(d) {return (d.Percent_Cases)});
        var sumCases = numCasesDim.groupAll().reduceSum(function(d) {return d.Num_Cases});
        var sumPercent = percentCasesDim.groupAll().reduceSum(function(d) {return d.Percent_Cases});

        var minDate = yearDim.bottom(1)[0]["Year"];
        var maxDate = yearDim.top(1)[0]["Year"];

        var yearChart = dc.lineChart("#year-line-chart");
        var usChart = dc.geoChoroplethChart("#us-chart");
        var stateCasesChart = dc.rowChart("#state-cases-chart");
        var yearCasesChart = dc.rowChart("#year-chart");
        var totalCasesND = dc.numberDisplay("#cases-display");
        var percentND = dc.numberDisplay("#percent-display");
        
        totalCasesND
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d){return d; })
        .html({
            some:"<span style=\"color:black; font-size: 40px;\">%number</span>",
          })
        .group(sumCases);

        stateCasesChart
        .width(300)
        .height(800)
        .dimension(stateNameDim)
        .group(percentByState)
        .elasticX(true)
        .xAxis().ticks(6)

        yearCasesChart
        .width(300)
        .height(400)
        .dimension(yearDim)
        .group(numCasesByYear)
        .elasticX(true)
        .xAxis().ticks(6);

        yearChart
        .width(600)
        .height(300)
        .x(d3.scaleTime().domain([minDate, maxDate]))
        .y(d3.scaleLinear().domain([21, 23]))
        .brushOn(false)
        .yAxisLabel("Asthma Cases")
        .xAxisLabel("Year")
        .elasticX(true)
        .dimension(yearDim)
        .group(numCasesByYear)
        .transitionDuration(500);

        var max_state = percentByState.top(1)[0].value;

        usChart.width(1000)
        .height(330)
        .dimension(stateNameDim)
            .group(percentByState)
            .colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
            .colorDomain([4, max_state])
            .overlayGeoJson(statesJson["features"], "state", function (d) {
                return d.properties.name;
            })
            .projection(d3.geoAlbersUsa()
                        .scale(700)
                        .translate([340, 150]))
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
                    .attr("y", chartToUpdate.height())
                    .text(displayText);
            }
            AddXAxis(stateCasesChart, "Asthma Cases (Thousands)");
    });
});
