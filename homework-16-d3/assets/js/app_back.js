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

function loadChart() {
    var svgWidth = 0.8 * window.innerWidth;
    var svgHeight = 0.8 * window.innerHeight;

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

    d3.csv("assets/data/data.csv", function(error, baseData) {
        if (error) return console.warn(error);

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

        var labels = baseData.map(d => d.poverty);
        // scale x to chart
        var xScale = d3.scaleLinear()
            .domain([d3.min(labels), d3.max(labels)])
            .range([0, chartWidth]);

        var healthcare = baseData.map(d => d.healthcare);
        // scale y
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(healthcare)])
            .range([chartHeight, 0]);

        var yAxis = d3.axisLeft(yScale);
        var xAxis = d3.axisBottom(xScale);
        //circle radius
        var radius = 15;

        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis);

        chartGroup.append("g")
            .attr("transform", `translate(0, 0)`)
            .call(yAxis);

        var circle = chartGroup.append('g').selectAll("cirlce")
            .data(baseData)
            .enter()
            .append("circle")
            .classed('stateCircle', true)
            .attr("cx", d => xScale(d.poverty))
            .attr("cy", d => yScale(d.healthcare))
            .attr("r", radius);

        var circleText = chartGroup.append('g').selectAll('text')
            .data(baseData)
            .enter()
            .append('text')
            .attr('x', d => xScale(d.poverty))
            .attr('y', d => yScale(d.healthcare) + radius - 19 / 2)
            .classed('stateText', true)
            .text(function(d) {
                return d.abbr;
            });
    });
    // add label axis to chart
    // add x label group
    var xLableGroup = chartGroup.append('g')
        .attr('transform', `translate(${chartWidth / 2}, ${chartHeight + margin.top / 2})`);

    var povertyLable = xLableGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty(%)");

    var ageLabel = xLableGroup.append('text')
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age(Median)");

    var incomeLable = xLableGroup.append('text')
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income(Median)");
    // add y axis group
    var yLableGroup = chartGroup.append('g')
        .attr('transform', `translate(${0 - margin.left}, ${chartHeight / 2})`);
    var healthLabel = yLableGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0)
        .attr('y', 60)
        .attr('value', 'health')
        .attr("dy", "1em")
        .classed('active', true)
        .text("Lacks Healthcare(%)");
    var smokeLabel = yLableGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'smokes')
        .attr("dy", "1em")
        .classed('inactive', true)
        .text("Smokes(%)");
    var obeseLabel = yLableGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'obesity')
        .attr("dy", "1em")
        .classed('inactive', true)
        .text("Obese(%)");
}