var fileName = "./colleges.csv";

var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
  },
  width = 300 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

d3.csv(fileName, function(error, data) {
  if (error) throw error;

  // dropdowns
  var dropregion = d3.select("#dropregion");
  var droplocale = d3.select("#droplocale");

  var region = d3.nest()
    .key(function(d) {
      return d.Region;
    })
    .entries(data);

  region = region.sort(function(a, b) {
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  })

  dropregion.selectAll("option")
    .data(region, function(d) {
      return d;
    })
    .enter()
    .append("option")
    .text(function(d) {
      return d.key;
    });

  var alllocale = ["----------", "Distant Rural", "Distant Town", "Fringe Rural", "Fringe Town", "Large City", "Large Suburb", "Mid-size City", "Mid-size Suburb", "Remote Rural", "Remote Town", "Small City", "Small Suburb"];

  dropregion.on("change", function() {
    var currentRegion = this.value;
    selectRegion = data.filter(function(d) {
      return d["Region"] == currentRegion;
    });

    scoredetails(selectRegion);

    droplocale.selectAll("option")
      .remove();

    droplocale.selectAll("option")
      .data(alllocale)
      .enter()
      .append("option")
      .text(function(d) {
        return d;
      });

    droplocale.on("change", function() {
      currentLocale = this.value;
      selectLocale = data.filter(function(d) {
        if (currentLocale == "----------") {
          return d["Region"] == currentRegion;
        }
        return (d["Region"] == currentRegion && d["Locale"] == currentLocale);
      })

      scoredetails(selectLocale);
    })
  })

  //score scatter plot
  var xScale = d3.scaleLinear().domain([0, 1504]).range([0, width]);
  var yScale = d3.scaleLinear().domain([0, 34]).range([height, 0]);

  var xAxis = d3.axisBottom().scale(xScale);
  var yAxis = d3.axisLeft().scale(yScale);

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var score = d3.select("#score")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  score.append("g")
    .classed("x axis", true)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .classed("label", true)
    .attr("x", width)
    .attr("y", -10)
    .style("text-anchor", "end")
    .style("fill", "black")
    .text("SAT");

  score.append("g")
    .classed("y axis", true)
    .call(yAxis)
    .append("text")
    .classed("label", true)
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .style("fill", "black")
    .text("ACT");

  var svglegend = d3.select("#score")
    .append("svg")
    .attr("class", 'svglegend')
    .attr("width", 120)
    .attr("height", 300)
    .attr("transform", "translate(" + 0 + "," + 20 + ")");

  function scoredetails(data) {
    d3.selectAll("circle").remove();

    data.forEach(function(d) {
      d["SAT Average"] = +d["SAT Average"];
      d["ACT Median"] = +d["ACT Median"];
    });

    var tooltip = d3.select("#score").append("div")
      .classed("tooltip", true)
      .style("opacity", 0);

    var scoreplot = score.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .classed("dot", true)
      .attr("r", function(d) {
        return d["Admission Rate"] * 10;
      })
      .attr("cx", function(d) {
        return xScale(d["SAT Average"]);
      })
      .attr("cy", function(d) {
        return yScale(d["ACT Median"]);
      })
      .style("fill", function(d) {
        return color(d.Locale);
      })
      .on("mouseover", scoremouseover)
      .on("mouseout", scoremouseout)
      .on("click", scoreclick);

    function scoremouseover(d) {
      var html = d.Name + "<br/>" + "SAT Avg: " + d["SAT Average"] + "<br/>" + "ACT Med: " + d["ACT Median"] + "<br/>" + "Admission Rate: " + d["Admission Rate"];
      tooltip.html(html)
        .style("left", (d3.event.pageX + 15) + "px")
        .style("top", (d3.event.pageY - 28) + "px")
        .transition()
        .duration(200)
        .style("opacity", .9)
    }

    function scoremouseout(d) {
      tooltip.transition()
        .duration(300)
        .style("opacity", 0);
    }

    function scoreclick(d, i) {
      var sat = d["SAT Average"];
      var act = d["ACT Median"];
      var name = d["Name"];

      d3.select("#sat")
        .text(sat);
      d3.select("#act")
        .text(act);
      d3.select("#name")
        .text(name);

      score.selectAll("circle")
        .filter(function(d) {
          return d["SAT Average"] != sat || d["ACT Median"] != act;
        })
        .classed("clicked", false);

      score.selectAll("circle")
        .filter(function(d) {
          return d["SAT Average"] == sat && d["ACT Median"] == act;
        })
        .classed("clicked", true);

    }

    var legend = svglegend.selectAll(".legend")
      .data(color.domain())
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
      });

    legend.append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend.append("text")
      .attr("x", 30)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) {
        return d;
      });
  };
});
