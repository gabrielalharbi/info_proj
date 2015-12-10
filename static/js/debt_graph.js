
var margin = {top: 20, right: 170, bottom: 30, left: 60},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    radius = Math.min(width, height) / 2;

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset(function(d) {return [-10,0];})
  .html(function(d) {
    return "<p><strong>Type of Debt:</strong> <span style='color:orange'>" + capitalizeFirstLetter(d.data.debt_type) + "</span></p>" 
    + "<p><strong>Average Debt Amount:</strong> <span style='color:orange'>" + d.data.debt_amount + "</span></p>" ;
  })

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { if (isNaN(d.debt_amount) == false) return d.debt_amount; });

var chart3 = d3.select("#chart3").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

chart3.call(tip);

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



d3.csv("http://127.0.0.1:5002/templates/data/debts_data.csv", type, function(error, data) {
  if (error) throw error;

  var g = chart3.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);


  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.debt_type); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { if (isNaN(d.debt_amount) == false) return d.data.debt_type; });
});

function type(d) {
  if (isNaN(d.debt_amount)==false){
    d.debt_amount = +d.debt_amount;
    d.debt_type = d.debt_type.split("_").join(" ")
    return d;
  }
}

