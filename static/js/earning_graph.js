
var margin = {top: 20, right: 170, bottom: 30, left: 60},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<p><strong>County:</strong> <span style='color:orange'>" + d.County_Name + "</span></p>" + "<p><strong>Male Median Wage:</strong> <span style='color:orange'>" + d.Median_earnings_for_male_fulltime + "</span></p>" 
    + "<p><strong>Female Median Wage:</strong> <span style='color:orange'>" + d.Median_earnings_for_female_fulltime + "</span></p>" ;
  })


var x = d3.scale.ordinal()
    .rangeRoundBands([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var z = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var zAxis = d3.svg.axis()
    .scale(z)
    .orient("right");

var chart4 = d3.select("#chart4").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
chart4.call(tip);

d3.csv("http://127.0.0.1:5002/templates/data/earning_data.csv", type, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.County_Name; }));
  y.domain([0, d3.max(data, function(d) { if (isNaN(d.Median_earnings_for_male_fulltime)==false) return parseInt(d.Median_earnings_for_male_fulltime); })]);
  z.domain([0, d3.max(data, function(d) { if (isNaN(d.Median_earnings_for_female_fulltime)==false) return parseInt(d.Median_earnings_for_female_fulltime); })]);
  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(xAxis);



  chart4.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("font-weight", "bold")
      .style("font-size", "15px")
      // .text("Median_earnings_for_male_fulltime");
      ;
  chart4.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + " ,0)") 
      .call(zAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("z", 6)
      .attr("zy", ".71em")
      .style("text-anchor", "end")
      .style("font-weight", "bold")
      .style("font-size", "15px")
      ;
  chart4.selectAll(".bar2")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar2")
      .attr("x", function(d) { return x( String(d.County_Name)); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { if (isNaN(d.Median_earnings_for_female_fulltime) == false) return parseInt(z(d.Median_earnings_for_female_fulltime)); })
      .attr("height", function(d) { if (isNaN(d.Median_earnings_for_female_fulltime) == false) return height - parseInt(z(d.Median_earnings_for_female_fulltime)); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  chart4.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x( String(d.County_Name)); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { if (isNaN(d.Median_earnings_for_male_fulltime) == false) return parseInt(y(d.Median_earnings_for_male_fulltime)); })
      .attr("height", function(d) { if (isNaN(d.Median_earnings_for_male_fulltime) == false) return height - parseInt(y(d.Median_earnings_for_male_fulltime)); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
  

  d3.select("#check5").on("change", change);
  d3.select("#check6").on("change", change2);

  function change() {
    d3.select("#check6").property("checked",false);
    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.Median_earnings_for_male_fulltime - a.Median_earnings_for_male_fulltime; }
        : function(a, b) { return d3.ascending(a.County_Name, b.County_Name); })
        .map(function(d) { return d.County_Name; }))
        .copy();

    var x1 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.Median_earnings_for_female_fulltime - a.Median_earnings_for_female_fulltime; }
        : function(a, b) { return d3.ascending(a.County_Name, b.County_Name); })
        .map(function(d) { return d.County_Name; }))
        .copy();

    chart4.selectAll(".bar")
        .sort(function(a, b) { return x0(a.County_Name) - x0(b.County_Name); });
    chart4.selectAll(".bar2")
        .sort(function(a, b) { return x0(a.County_Name) - x0(b.County_Name); });

    var transition = chart4.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.County_Name); });
    transition.selectAll(".bar2")
        .delay(delay)
        .attr("x", function(d) { return x0(d.County_Name); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }
  function change2() {
    d3.select("#check5").property("checked",false);
    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.Median_earnings_for_female_fulltime - a.Median_earnings_for_female_fulltime; }
        : function(a, b) { return d3.ascending(a.County_Name, b.County_Name); })
        .map(function(d) { return d.County_Name; }))
        .copy();

    chart4.selectAll(".bar")
        .sort(function(a, b) { return x0(a.County_Name) - x0(b.County_Name); });
    chart4.selectAll(".bar2")
        .sort(function(a, b) { return x0(a.County_Name) - x0(b.County_Name); });

    var transition = chart4.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.County_Name); });
    transition.selectAll(".bar2")
        .delay(delay)
        .attr("x", function(d) { return x0(d.County_Name); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }

});

function type(d) {
  if (isNaN(d.Median_earnings_for_male_fulltime)==false){
    d.Median_earnings_for_male_fulltime = +d.Median_earnings_for_male_fulltime;
    d.Median_earnings_for_female_fulltime = +d.Median_earnings_for_female_fulltime;
    return d;
  }
}
