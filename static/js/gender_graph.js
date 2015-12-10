
var margin = {top: 20, right: 170, bottom: 30, left: 60},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<p><strong>County:</strong> <span style='color:orange'>" + d.county_name + "</span></p>" + "<p><strong>Male to Female Ratio:</strong> <span style='color:orange'>" + d.male_female_income + "</span></p>" 
    + "<p><strong>Median Wage:</strong> <span style='color:orange'>" + d.median_wage + "</span></p>" ;
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

var chart2 = d3.select("#chart2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
chart2.call(tip);

d3.csv("http://127.0.0.1:5002/templates/data/county_data.csv", type, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return String(d.county_name); }));
  y.domain([0, d3.max(data, function(d) { if (isNaN(d.male_female_income)==false) return parseInt(d.male_female_income)+.8; })]);
  z.domain([0, d3.max(data, function(d) { if (isNaN(d.median_wage)==false) return parseInt(d.median_wage); })]);
  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(xAxis);



  chart2.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("font-weight", "bold")
      .style("font-size", "15px")
      // .text("male_female_income");
      ;
  chart2.append("g")
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

  chart2.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x( String(d.county_name)); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { if (isNaN(d.male_female_income) == false) return parseInt(y(d.male_female_income)); })
      .attr("height", function(d) { if (isNaN(d.male_female_income) == false) return height - parseInt(y(d.male_female_income)); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
  

  chart2.selectAll(".bar2")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar2")
      .attr("x", function(d) { return x( String(d.county_name)); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { if (isNaN(d.median_wage) == false) return parseInt(z(d.median_wage)); })
      .attr("height", function(d) { if (isNaN(d.median_wage) == false) return height - parseInt(z(d.median_wage)); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  

  d3.select("#check3").on("change", change);
  d3.select("#check4").on("change", change2);

  function change() {
    d3.select("#check4").property("checked",false);
    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.male_female_income - a.male_female_income; }
        : function(a, b) { return d3.ascending(a.county_name, b.county_name); })
        .map(function(d) { return d.county_name; }))
        .copy();

    var x1 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.median_wage - a.median_wage; }
        : function(a, b) { return d3.ascending(a.county_name, b.county_name); })
        .map(function(d) { return d.county_name; }))
        .copy();

    chart2.selectAll(".bar")
        .sort(function(a, b) { return x0(a.county_name) - x0(b.county_name); });
    chart2.selectAll(".bar2")
        .sort(function(a, b) { return x0(a.county_name) - x0(b.county_name); });

    var transition = chart2.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.county_name); });
    transition.selectAll(".bar2")
        .delay(delay)
        .attr("x", function(d) { return x0(d.county_name); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }
  function change2() {
    d3.select("#check3").property("checked",false);
    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.median_wage - a.median_wage; }
        : function(a, b) { return d3.ascending(a.county_name, b.county_name); })
        .map(function(d) { return d.county_name; }))
        .copy();

    chart2.selectAll(".bar")
        .sort(function(a, b) { return x0(a.county_name) - x0(b.county_name); });
    chart2.selectAll(".bar2")
        .sort(function(a, b) { return x0(a.county_name) - x0(b.county_name); });

    var transition = chart2.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.county_name); });
    transition.selectAll(".bar2")
        .delay(delay)
        .attr("x", function(d) { return x0(d.county_name); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }

});

function type(d) {
  if (isNaN(d.male_female_income)==false){
    d.male_female_income = +d.male_female_income;
    d.median_wage = +d.median_wage;
    return d;
  }
}
