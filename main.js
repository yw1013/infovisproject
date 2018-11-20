var fileName = "./colleges.csv";

d3.csv(fileName, function(error, data) {
  if (error) throw error;

  var margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
    },
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var dropregion = d3.select("#dropregion");
  var droplocale = d3.select("#droplocale");
  var dropschool = d3.select("#dropschool");

  var school = d3.nest()
    .key(function(d) {
      return d.Name;
    })
    .entries(data);

  school = school.sort(function(a, b) {
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  })

  dropschool.selectAll('option')
    .data(school, function(d) {
      return d;
    })
    .enter()
    .append('option')
    .text(function(d) {
      return d.key;
    })

  dropschool.on('change', function() {
    currentSchool = this.value;
    selectSchool = data.filter(function(d) {
      return d['Name'] == currentSchool;
    })
    details(selectSchool);
  })

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

  dropregion.selectAll('option')
    .data(region, function(d) {
      return d;
    })
    .enter()
    .append("option")
    .text(function(d) {
      return d.key;
    });

  var currentRegion;
  var alllocale = ["----------", "Distant Rural", "Distant Town", "Fringe Rural", "Fringe Town", "Large City", "Large Suburb", "Mid-size City", "Mid-size Suburb", "Remote Rural", "Remote Town", "Small City", "Small Suburb"];

  dropregion.on('change', function() {
    currentRegion = this.value;
    selectRegion = data.filter(function(d) {
      return d['Region'] == currentRegion;
    });

    details(selectRegion);

    droplocale.selectAll('option')
      .remove();

    dropschool.selectAll('option')
      .remove();

    droplocale.selectAll('option')
      .data(alllocale)
      .enter()
      .append('option')
      .text(function(d) {
        return d;
      });

    droplocale.on('change', function() {
      dropschool.selectAll('option')
        .remove();

      currentLocale = this.value;
      selectLocale = data.filter(function(d) {
        if (currentLocale == "----------") {
          return d['Region'] == currentRegion;
        }
        return (d['Region'] == currentRegion && d['Locale'] == currentLocale);
      })

      details(selectLocale);

      dropschool.selectAll('option')
        .data(selectLocale, function(d) {
          return d;
        })
        .enter()
        .append('option')
        .text(function(d) {
          return d.Name;
        })
    })

  })

  var xScale = d3.scaleLinear().domain([0, 1504]).range([0, width]);
  var yScale = d3.scaleLinear().domain([0, 34]).range([height, 0]);

  var xAxis = d3.axisBottom().scale(xScale);
  var yAxis = d3.axisLeft().scale(yScale);

  var score = d3.select("#score")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  score.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("SAT");

  score.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("ACT");


  function details(data) {
    d3.selectAll("circle").remove();

    data.forEach(function(d) {
      d['SAT Average'] = +d['SAT Average'];
      d['ACT Median'] = +d['ACT Median'];
    });

    var tooltip = d3.select("#score").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    var temp1 = score.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 4)
      .attr("cx", function(d) {
        return xScale(d['SAT Average']);
      })
      .attr("cy", function(d) {
        return yScale(d['ACT Median']);
      })
      .on("mouseover", function(d) {
        var html = d.Name + "<br/>" + "SAT Avg: " + d['SAT Average'] + "<br/>" + "ACT Med: " + d['ACT Median'];
        tooltip.html(html)
          .style("left", (d3.event.pageX + 15) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
          .transition()
          .duration(200)
          .style("opacity", .9)

      })
      .on("mouseout", function(d) {
        tooltip.transition()
          .duration(300)
          .style("opacity", 0);
      })
      .on("click", function(d, i) {
        var sat = d['SAT Average'];
        var act = d['ACT Median'];

        d3.select("#sat")
          .text(sat);
        d3.select("#act")
          .text(act);

        score.selectAll("circle")
          .filter(function(d) {
            return d['SAT Average'] != sat && d['ACT Median'] != act;
          })
          .classed("clicked", false);

        score.selectAll("circle")
          .filter(function(d) {
            return d['SAT Average'] == sat && d['ACT Median'] == act;
          })
          .classed("clicked", true);

      });
  };

});
