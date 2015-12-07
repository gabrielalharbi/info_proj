
var margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<p><strong>County:</strong> <span style='color:orange'>" + d.county_name + "</span></p>" + "<p><strong>Population:</strong> <span style='color:orange'>" + d.population + "</span></p>" ;
  })


var x = d3.scale.ordinal()
    .rangeRoundBands([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
svg.call(tip);

d3.csv("http://127.0.0.1:5002/templates/data/county_data.csv", type, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return String(d.county_name); }));
  y.domain([0, d3.max(data, function(d) { if (isNaN(d.population)==false) return parseInt(d.population); })]);
  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("font-weight", "bold")
      .style("font-size", "15px")
      // .text("Population");
      ;


  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x( String(d.county_name)); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { if (isNaN(d.population) == false) return parseInt(y(d.population)); })
      .attr("height", function(d) { if (isNaN(d.population) == false) return height - parseInt(y(d.population)); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  d3.select("input").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.population - a.population; }
        : function(a, b) { return d3.ascending(a.county_name, b.county_name); })
        .map(function(d) { return d.county_name; }))
        .copy();

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.county_name) - x0(b.county_name); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.county_name); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }

});

function type(d) {
  if (isNaN(d.population)==false){
    d.population = +d.population;
    return d;
  }
}
