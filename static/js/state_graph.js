
var margin = {top: 20, right: 170, bottom: 30, left: 60},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<p><strong>County:</strong> <span style='color:orange'>" + d.county_name + "</span></p>" + "<p><strong>Median Wage Deviation:</strong> <span style='color:orange'>" + d.county_deviation + "</span></p>" ;
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


var chart7 = d3.select("#chart7").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
chart7.call(tip);

d3.csv("http://127.0.0.1:5002/templates/data/county_deviation_data.csv", type, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.county_name; }));
  y.domain([0, d3.max(data, function(d) { if (isNaN(d.county_deviation)==false) return d.county_deviation + .1; })]);
  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(xAxis);



  chart7.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("font-weight", "bold")
      .style("font-size", "15px")
      // .text("county_deviation");
      ;

  chart7.selectAll(".bar3")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar3")
      .attr("x", function(d) { return x( String(d.county_name)); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { if (isNaN(d.county_deviation) == false) return y(d.county_deviation); })
      .attr("height", function(d) { if (isNaN(d.county_deviation) == false) return height - y(d.county_deviation); })
      .attr("fill",function(d) { if (d.county_deviation < .8 && d.county_deviation > .6 || d.county_deviation > 1.2 && d.county_deviation < 1.4) return "violet"; if (d.county_deviation > 1.4 || d.county_deviation < 0.6) return "red"; else return "steelblue";})
      .attr("fill-opacity",.6)
      .attr("stroke-width",5)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
  

  d3.select("#check7").on("change", change);

  function change() {
    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.county_deviation - a.county_deviation; }
        : function(a, b) { return d3.ascending(a.county_name, b.county_name); })
        .map(function(d) { return d.county_name; }))
        .copy();

    chart7.selectAll(".bar3")
        .sort(function(a, b) { return x0(a.county_name) - x0(b.county_name); });

    var transition = chart7.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar3")
        .delay(delay)
        .attr("x", function(d) { return x0(d.county_name); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }
});

function type(d) {
  if (isNaN(d.county_deviation)==false){
    d.county_deviation = +d.county_deviation;
    d.Median_earnings_for_female_fulltime = +d.Median_earnings_for_female_fulltime;
    return d;
  }
}
