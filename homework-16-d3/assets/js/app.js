// @TODO: YOUR CODE HERE!
d3.select(window).on("resize", handleResize);
// When the browser loads, loadChart() is called
loadChart();

function handleResize() {
    var svgArea = d3.select("svg");
    // If there is already an svg container on the page, remove it and reload the chart
    if (!svgArea.empty()) {
        svgArea.remove();
        loadChart();
    }
}
// initial chart
function loadChart() {
    var svgWidth = 0.8 * window.innerWidth;
    var svgHeight = 0.9 * window.innerHeight;

    var scatter = d3.select('#scatter')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    var margin = {
        top: 30,
        right: 30,
        bottom: 90,
        left: 100
    };
    var chartWidth = svgWidth - margin.left - margin.right;
    var chartHeight = svgHeight - margin.top - margin.bottom;

    var svg = scatter.append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr('width', chartWidth)
        .attr('height', chartHeight);

    // add x label group
    var xLableGroup = chartGroup.append('g')
        .attr('transform', `translate(${chartWidth / 2}, ${chartHeight + margin.top / 2})`);

    xLableGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty(%)");

    xLableGroup.append('text')
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age(Median)");

    xLableGroup.append('text')
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income(Median)");
    // add y axis group
    var yLableGroup = chartGroup.append('g')
        .attr('transform', `translate(${0 - margin.left}, ${chartHeight / 2})`);

    yLableGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0)
        .attr('y', 60)
        .attr('value', 'healthcare')
        .attr("dy", "1em")
        .classed('active', true)
        .text("Lacks Healthcare(%)");

    yLableGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'smokes')
        .attr("dy", "1em")
        .classed('inactive', true)
        .text("Smokes(%)");

    yLableGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'obesity')
        .attr("dy", "1em")
        .classed('inactive', true)
        .text("Obese(%)");
    // load csv data
    d3.csv("assets/data/data.csv", function(error, baseData) {
        if (error) return console.warn(error);
        //console.log(baseData);
        // convert datatype to number
        baseData.forEach(function(data) {
            data.age = +data.age;
            data.ageMoe = +data.ageMoe;
            data.healthcare = +data.healthcare;
            data.healthcareHigh = +data.healthcareHigh;
            data.healthcareLow = +data.healthcareLow;
            data.id = +data.id;
            data.income = +data.income;
            data.incomeMoe = +data.incomeMoe;
            data.obesity = +data.obesity;
            data.obesityHigh = +data.obesityHigh;
            data.obesityLow = +data.obesityLow;
            data.poverty = +data.poverty;
            data.povertyMoe = +data.povertyMoe;
            data.smokes = +data.smokes;
            data.smokesHigh = +data.smokesHigh;
            data.smokesLow = +data.smokesLow;
        });
        //circle radius
        var radius = 15;
        var xValue = 'poverty';
        var yValue = 'healthcare';
        var xLabel = baseData.map(d => d[xValue]);
        // scale x to chart
        var xScale = updateXScale(xLabel, chartWidth);

        var yLable = baseData.map(d => d[yValue]);
        // scale y
        var yScale = updateYScale(yLable, chartHeight);

        var leftAxis = d3.axisLeft(yScale);
        var bottomAxis = d3.axisBottom(xScale);

        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);

        var yAxis = chartGroup.append("g")
            .attr("transform", `translate(0, 0)`)
            .call(leftAxis);

        var circle = chartGroup.append('g').selectAll("cirlce")
            .data(baseData)
            .enter()
            .append("circle")
            .classed('stateCircle', true)
            .attr("cx", d => xScale(d.poverty))
            .attr("cy", d => yScale(d.healthcare))
            .attr("r", radius);
        // add hover tool tip
        var toolTip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([60, 60])
            .html(function(d) {
                return (`state: ${d.state}<br>${xValue}: ${d[xValue]}<br>${yValue}: ${d[yValue]}`);
            });

        var circleText = chartGroup.append('g').selectAll('text')
            .data(baseData)
            .enter()
            .append('text')
            .attr('x', d => xScale(d[xValue]))
            .attr('y', d => yScale(d[yValue]) + radius - 19 / 2)
            .classed('stateText', true)
            .text(function(d) {
                return d.abbr;
            })
            .on('mouseover', function(data) {
                toolTip.show(data, this);
            }).on('mouseout', function() {
                toolTip.hide();
            });
        circleText.call(toolTip);
        // x label on click 
        xLableGroup.selectAll('text').on('click', function() {
            xLableGroup.selectAll('text')
                .classed("active", false)
                .classed("inactive", true);
            d3.select(this)
                .classed("active", true)
                .classed("inactive", false);
            xValue = d3.select(this).attr('value');
            var label = baseData.map(d => d[xValue]);
            //update xScale
            xScale = updateXScale(label, chartWidth);
            // update x axis
            renderAxes(xScale, xAxis);
            //update circle 
            renderCircles(circle, circleText, toolTip, xScale, xValue, yScale, yValue);
        });
        // y labe on click
        yLableGroup.selectAll('text').on('click', function() {
            yLableGroup.selectAll('text')
                .classed("active", false)
                .classed("inactive", true);
            d3.select(this)
                .classed("active", true)
                .classed("inactive", false);

            yValue = d3.select(this).attr('value');
            var label = baseData.map(d => d[yValue]);
            yScale = updateYScale(label, chartHeight);
            renderYAxis(yScale, yAxis);
            //update circle
            renderCircles(circle, circleText, toolTip, xScale, xValue, yScale, yValue);
        });
        // y label click END 
    });
}
// update scale
function updateXScale(dataLabel, chartWidth) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(dataLabel) * 0.9, d3.max(dataLabel) * 1.1])
        .range([0, chartWidth]);

    return xLinearScale;
}

function updateYScale(dataLabel, chartHeight) {
    // scale y
    var yScale = d3.scaleLinear()
        .domain([d3.min(dataLabel) * 0.8, d3.max(dataLabel) * 1.1])
        .range([chartHeight, 0]);

    return yScale;
}
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
}

function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
}
// function used for updating circles group with a transition
function renderCircles(circlesGroup, textGroup, toolTip, xScale, xValue, yScale, yValue) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => xScale(d[xValue]))
        .attr('cy', d => yScale(d[yValue]));
    //updating text on circles with a transition
    var radius = 15;
    textGroup.transition()
        .duration(1000)
        .attr("x", d => xScale(d[xValue]))
        .attr('y', d => yScale(d[yValue]) + radius - 19 / 2);
    //updating tool tip on circles with a transition
    toolTip.html(function(d) {
        return (`state: ${d.state}<br>${xValue}: ${d[xValue]}<br>${yValue}: ${d[yValue]}`);
    });
}