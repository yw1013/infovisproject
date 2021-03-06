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
  if (error) throw serror;
  // dropdowns
  var dropregion = d3.select("#dropregion"),
    droplocale = d3.select("#droplocale"),
    dropschool = d3.select("#dropschool"),
    defaultdropdown = "----------";

  dropregion.selectAll("option")
    .remove();
  dropregion.append("option")
    .text(defaultdropdown);
  droplocale.selectAll("option")
    .remove();
  droplocale.append("option")
    .text(defaultdropdown)
  dropschool.selectAll("option")
    .remove();
  dropschool.append("option")
    .text(defaultdropdown);

  var region = d3.nest().key(function(d) {
      return d.Region;
    }).entries(data),
    locale = d3.nest().key(function(d) {
      return d.Locale;
    }).entries(data),
    school = d3.nest().key(function(d) {
      return d.Name;
    }).entries(data);

  region = region.sort(function(a, b) {
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });

  locale = locale.sort(function(a, b) {
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });

  school = school.sort(function(a, b) {
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });

  dropregion.selectAll("option")
    .data(region, function(d) {
      return d;
    })
    .enter()
    .append("option")
    .text(function(d) {
      return d.key;
    });

  droplocale.selectAll("option")
    .data(locale, function(d) {
      return d;
    })
    .enter()
    .append("option")
    .text(function(d) {
      return d.key;
    });

  dropschool.selectAll("option")
    .data(school, function(d) {
      return d;
    })
    .enter()
    .append("option")
    .text(function(d) {
      return d.key;
    });

  var currentRegion = defaultdropdown,
    currentLocale = defaultdropdown,
    currentSchool = defaultdropdown,
    selectRegion;

  dropregion.on("change", function() {
    currentRegion = this.value;
    selectRegion = data.filter(function(d) {
      if (currentRegion == defaultdropdown) {
        currentLocale = defaultdropdown;
        currentSchool = defaultdropdown;
        return d;
      }
      return d["Region"] == currentRegion;
    });

    scoreplots(selectRegion);
    parallelplots(selectRegion);

    droplocale.selectAll("option")
      .remove();
    droplocale.append("option")
      .text(defaultdropdown);
    dropschool.selectAll("option")
      .remove();
    dropschool.append("option")
      .text(defaultdropdown);

    droplocale.selectAll("option")
      .data(locale, function(d) {
        return d;
      })
      .enter()
      .append("option")
      .text(function(d) {
        return d.key;
      });

    dropschool.selectAll("option")
      .data(selectRegion, function(d) {
        return d;
      })
      .enter()
      .append("option")
      .text(function(d) {
        return d.Name;
      });

  })

  droplocale.on("change", function() {
    currentLocale = this.value;
    selectLocale = data.filter(function(d) {
      if (currentLocale == defaultdropdown) {
        currentSchool = defaultdropdown;
        if (currentRegion == defaultdropdown && currentSchool == defaultdropdown) {
          return d;
        } else if (currentRegion != defaultdropdown && currentSchool == defaultdropdown) {
          return d["Region"] == currentRegion;
        }
      } else if (currentRegion == defaultdropdown && currentSchool == defaultdropdown) {
        return d["Locale"] == currentLocale;
      }
      return d["Region"] == currentRegion && d["Locale"] == currentLocale;
    })

    scoreplots(selectLocale);
    parallelplots(selectLocale);

    dropschool.selectAll("option")
      .remove();
    dropschool.append("option")
      .text(defaultdropdown);

    if (currentLocale != defaultdropdown) {
      dropschool.selectAll("option")
        .data(selectLocale, function(d) {
          return d;
        })
        .enter()
        .append("option")
        .text(function(d) {
          return d.Name;
        });
    } else {
      dropschool.selectAll("option")
        .data(selectRegion, function(d) {
          return d;
        })
        .enter()
        .append("option")
        .text(function(d) {
          return d.Name;
        });
    }
  })

  dropschool.on("change", function() {
    currentSchool = this.value;
    selectSchool = data.filter(function(d) {
      if (currentSchool == defaultdropdown) {
        if (currentRegion == defaultdropdown && currentLocale == defaultdropdown) {
          return d;
        } else if (currentRegion != defaultdropdown && currentLocale == defaultdropdown) {
          return d["Region"] == currentRegion;
        } else if (currentRegion != defaultdropdown && currentLocale != defaultdropdown) {
          return d["Region"] == currentRegion && d["Locale"] == currentLocale;
        } else if (currentRegion == defaultdropdown && currentLocale != defaultdropdown) {
          return d["Locale"] == currentLocale;
        }
      }
      return d["Name"] == currentSchool;
    })
    scoreplots(selectSchool);
    parallelplots(selectSchool);
  })

  //score scatter plot
  var xScale = d3.scaleLinear().domain([0, 1504]).range([0, width]);
  var yScale = d3.scaleLinear().domain([0, 34]).range([height, 0]);

  var xAxis = d3.axisBottom().scale(xScale);
  var yAxis = d3.axisLeft().scale(yScale);

  var scolor = d3.scaleOrdinal(d3.schemeCategory20);

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
    .attr("width", 100)
    .attr("height", 300)
    .attr("transform", "translate(" + 10 + "," + 20 + ")");

  /*
    Parallel coordinates plot
   */
  var MedFamIncome_YScale = d3.scaleLinear().domain([0, 116850]).range([height, 0]);
  var AverageCost_YScale = d3.scaleLinear().domain([0, 62636]).range([height, 0]);
  var MedEarnings_YScale = d3.scaleLinear().domain([0, 125600]).range([height, 0]);

    var MedFamIncome_YScaleData = d3.scaleLinear().domain([0, d3.max(data, function(d) {
        return d['Median Family Income'];
    })]).range([0, height]);
    var AverageCost_YScaleData = d3.scaleLinear().domain([0, d3.max(data, function(d) {
        return d['Average Cost'];
    })]).range([0, height]);
    var MedEarnings_YScaleData = d3.scaleLinear().domain([0, d3.max(data, function(d) {
        return d['Median Earnings 8 years After Entry'];
    })]).range([0, height]);


  var parallel_Y1Axis = d3.axisLeft().scale(MedFamIncome_YScale);
  var parallel_Y2Axis = d3.axisRight().scale(AverageCost_YScale);
  var parallel_Y3Axis = d3.axisRight().scale(MedEarnings_YScale);

  var parallel = d3.select("#parallel")
    .append("svg")
    .attr("width", width * 2 + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .classed("parallelplot", true)
    .attr("transform", "translate(" + 2*margin.left + "," + margin.top + ")");

  parallel.append("g")
    .classed("y axis", true)
    .call(parallel_Y1Axis)
    .append("text")
    .classed("label", true)
    .attr("transform", "translate(50,260)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .style("fill", "black")
    .text("Median Family Income");

  parallel.append("g")
    .attr("transform", "translate(200,0)")
    .classed("y axis", true)
    .call(parallel_Y2Axis)
    .append("text")
    .classed("label", true)
    .attr("transform", "translate(45,215)")
    .attr("y", 50)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .style("fill", "black")
    .text("Average Cost");

  parallel.append("g")
    .attr("transform", "translate(400,0)")
    .classed("y axis", true)
    .call(parallel_Y3Axis)
    .append("text")
    .classed("label", true)
    .attr("transform", "translate(45,215)")
    .attr("y", 50)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .style("fill", "black")
    .text("Median Earnings");

  function parallelplots(data) {
        d3.selectAll("path").remove();

        var stooltip = d3.select("#parallel").append("div")
            .classed("tooltip", true)
            .style("opacity", 0);

        var parallel_plot = parallel.selectAll(".line")
            .data(data)
            .enter()
            .append("path")
            .classed("line", true)
            .attr("d", function (d) {
                return ("M 0," + MedFamIncome_YScale(d['Median Family Income']) + " 200," + AverageCost_YScale(d['Average Cost']) + " 400," + MedEarnings_YScale(d['Median Earnings 8 years After Entry']));
            })
            .style("stroke", function (d) {
                return scolor(d['Locale']);
            })
            .style("stroke-width", "1.5px")
            .style("fill", "none")
            .style("opacity", ".2")
            .on("mouseover", parallelmouseover)
            .on("mouseout", parallelmouseout)
            .on("click", parallelclick);

        function parallelmouseover(d) {

            var html = d.Name + "<br/>" + d.Region + "<br/>" + "SAT Avg: " + d["SAT Average"] + "<br/>" + "ACT Med: " + d["ACT Median"] + "<br/>" + "Admission Rate: " + d["Admission Rate"];
            stooltip.html(html)
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .transition()
                .duration(200)
                .style("opacity", .7);
        }

        function parallelmouseout(d) {
            stooltip.transition()
                .duration(300)
                .style("opacity", 0);
        }

        function parallelclick(d, i) {
            parallel.selectAll("path")
                .filter(function (d) {
                    return d["SAT Average"] != sat || d["ACT Median"] != act;
                })
                .classed("clicked", false);

            parallel.selectAll("path")
                .filter(function(d) {
                    return d["SAT Average"] == sat && d["ACT Median"] == act;
                })
                .classed("clicked", true);
            schooldetails(d, i);
            racepie(raceratio(d));
            barChart(d);
        }
    }

    function parallelplotone(d) {
        var stooltip = d3.select("#parallel").append("div")
            .classed("tooltip", true)
            .style("opacity", 0);

        d3.selectAll("path").remove();

        var parallel_plot = parallel
            .append("path")
            .classed("line", true)
            .attr("d", ("M 0," + MedFamIncome_YScale(d['Median Family Income']) + " 200," + AverageCost_YScale(d['Average Cost']) + " 400," + MedEarnings_YScale(d['Median Earnings 8 years After Entry'])))
            .style("stroke", scolor(d['Locale']))
            .style("stroke-width", "3px")
            .style("fill", "none")
            .style("opacity", "1")
            .on("mouseover", parallelmouseover)
            .on("mouseout", parallelmouseout)

        function parallelmouseover() {

            var html = d.Name + "<br/>" + d.Region + "<br/>" + "SAT Avg: " + d["SAT Average"] + "<br/>" + "ACT Med: " + d["ACT Median"] + "<br/>" + "Admission Rate: " + d["Admission Rate"];
            stooltip.html(html)
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .transition()
                .duration(200)
                .style("opacity", .9);
        }

        function parallelmouseout() {
            stooltip.transition()
                .duration(300)
                .style("opacity", 0);
        }
    }

    //bar chart
    var barchart = d3.select('#barchart')
        .append("svg")
        .classed("bargraph", true)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //populate axes
    var barYScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);
    var barYScaleData = d3.scaleLinear().domain([0, 1]).range([0, height]);
    var barYAxis = d3.axisLeft().scale(barYScale);
    barchart.append("g")
        .classed("y axis", true)
        .call(barYAxis)
        .append("text")
        .classed("label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("fill", "black")
        .text("Admission Rate");

  function scoreplots(data) {
    d3.selectAll("circle").remove();

    data.forEach(function(d) {
      d["SAT Average"] = +d["SAT Average"];
      d["ACT Median"] = +d["ACT Median"];
    });

    var stooltip = d3.select("#score").append("div")
      .classed("tooltip", true)
      .style("opacity", 0);

    var scoreplot = score.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .classed("dot", true)
      .attr("r", function(d) {
        return Math.sqrt(d["Admission Rate"]) * 8;
      })
      .attr("cx", function(d) {
        return xScale(d["SAT Average"]);
      })
      .attr("cy", function(d) {
        return yScale(d["ACT Median"]);
      })
      .style("fill", function(d) {
        return scolor(d.Locale);
      })
      .on("mouseover", scoremouseover)
      .on("mouseout", scoremouseout)
      .on("click", scoreclick);

    function scoremouseover(d) {
      var html = d.Name + "<br/>" + d.Region + "<br/>" + "SAT Avg: " + d["SAT Average"] + "<br/>" + "ACT Med: " + d["ACT Median"] + "<br/>" + "Admission Rate: " + d["Admission Rate"];
      stooltip.html(html)
        .style("left", (d3.event.pageX + 15) + "px")
        .style("top", (d3.event.pageY - 28) + "px")
        .transition()
        .duration(200)
        .style("opacity", .9);
    }

    function scoremouseout(d) {
      stooltip.transition()
        .duration(300)
        .style("opacity", 0);
    }

    function scoreclick(d, i) {
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
      parallelplotone(d);

      schooldetails(d, i);
      racepie(raceratio(d));
      barChart(d);
    }

    var legend = svglegend.selectAll(".legend")
      .data(scolor.domain())
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
      });

    legend.append("rect")
      .attr("x", 0)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", scolor);

    legend.append("text")
      .attr("x", 15)
      .attr("y", 5)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .style("fill", scolor)
      .text(function(d) {
        return d;
      });


  };

    function schooldetails(d) {
        var sat = d["SAT Average"],
            act = d["ACT Median"],
            name = d["Name"],
            admissionrate = d["Admission Rate"],
            familyincome = d['Median Family Income'],
            averagecost = d['Average Cost'],
            salary = d['Median Earnings 8 years After Entry'];

        d3.select("#name")
            .text(name);
        d3.select("#sat")
            .text(sat);
        d3.select("#act")
            .text(act);
        d3.select("#admissionrate")
            .text(admissionrate);
        d3.select("#familyincome")
            .text(familyincome);
        d3.select("#averagecost")
            .text(averagecost);
        d3.select("#salary")
            .text(salary);
    }
  function barChart(d) {

    d3.selectAll(".bar").remove();

      //append specific school bar
      d3.select(".bargraph")
          .append("rect")
          .classed("bar", true)
          .attr("transform", "translate(75,"+(20+barYScale(d['Admission Rate']))+")")
          .attr("height",(barYScaleData(d['Admission Rate'])))
          .attr("width", "50")
          .attr("fill", scolor(d['Locale']));
      //append average bar
      var mean = d3.mean(data, function(d) {
          return +d['Admission Rate']
      });
      d3.select(".bargraph")
          .append("rect")
          .classed("bar", true)
          .attr("transform", "translate(195,"+(20+barYScale(mean))+")")
          .attr("height",(barYScaleData(mean)))
          .attr("width", "50");
      var schools = [d['Name'], "Average"];
      var barXScale = d3.scaleBand().domain(schools).range([0, width]);
      var barXAxis = d3.axisBottom().scale(barXScale);


      barchart.append("g")
          .call(barXAxis)
          .attr("transform","translate(0,250)")
          .classed("bar", true);
  }

  scoreplots(data);
  parallelplots(data);

  var pwidth = 200,
    pheight = 200,
    radius = Math.min(width, height) / 2;

  var pcolor = d3.scaleOrdinal(d3.schemeCategory10);

  var piechart = d3.select("#piechart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + 150 + "," + 150 + ")");

  piechart.append("g")
    .attr("class", "slices");

  var pielegend = d3.select("#piechart")
    .append("svg")
    .attr("class", 'pielegend')
    .attr("width", 100)
    .attr("height", 300)
    .attr("transform", "translate(" + 10 + "," + 20 + ")");

  function racepie(data) {
    var pie = d3.pie()
      .sort(null)
      .value(function(d) {
        return d.value;
      });

    var arc = d3.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    var ptooltip = d3.select("#piechart")
      .append("div")
      .classed("tooltip", true)
      .style("opacity", 0);

    var slice = piechart
      .select(".slices")
      .selectAll("path.slice");

    slice.remove();

    slice = piechart
      .select(".slices")
      .selectAll("path.slice")
      .data(pie(data))
      .enter()
      .append("g")
      .append("path")
      .attr("d", arc)
      .style("fill", function(d) {
        return pcolor(d.data.race);
      })
      // .style("opacity", 0.7)
      .style("stroke", 'white')
      .on("mouseover", function(d) {
        var html = (d.data.race) + "<br>" + (d.data.value) + "%";
        ptooltip.html(html)
          .style("left", (d3.event.pageX + 15) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
          .transition()
          .duration(200)
          .style("opacity", .9);
      })
      .on("mouseout", function(d) {
        ptooltip.transition()
          .duration(300)
          .style("opacity", 0);
      });

    var racelegend = pielegend.selectAll(".legend")
      .data(pcolor.domain()).enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
      });

    racelegend.append("rect")
      .attr("x", 0)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", pcolor)
      .style('stroke', pcolor);

    racelegend.append("text")
      .attr("x", 15)
      .attr("y", 5)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .style("fill", pcolor)
      .text(function(d) {
        return d;
      });
  }

  function raceratio(d) {
    white = +d['% White'];
    black = +d['% Black'];
    hispanic = +d['% Hispanic'];
    asian = +d['% Asian'];
    indian = +d['% American Indian'];
    pacific = +d['% Pacific Islander'];
    biracial = +d['% Biracial'];
    nonresident = +d['% Nonresident Aliens'];
    totalRace = [{
        race: "White",
        value: white
      },
      {
        race: "Black",
        value: black
      },
      {
        race: "Hispanic",
        value: hispanic
      },
      {
        race: "Asian",
        value: asian
      },
      {
        race: "American Indian",
        value: indian
      },
      {
        race: "Pacific Islander",
        value: pacific
      },
      {
        race: "Biracial",
        value: biracial
      },
      {
        race: "Nonresident Alien",
        value: nonresident
      }
    ];
    return totalRace;
  }

});
