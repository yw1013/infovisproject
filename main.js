var fileName = "./colleges.csv";

d3.csv(fileName, function(error, data) {
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
  var alllocale = [" ","Distant Rural", "Distant Town", "Fringe Rural", "Fringe Town", "Large City", "Large Suburb", "Mid-size City", "Mid-size Suburb", "Remote Rural", "Remote Town", "Small City", "Small Suburb"];

  dropregion.on('change', function() {
    currentRegion = this.value;
    selectRegion = data.filter(function(d) {
      return d['Region'] == currentRegion;
    });

    droplocale.selectAll('option')
      .remove();

    droplocale.selectAll('option')
      .data(alllocale)
      .enter()
      .append('option')
      .text(function(d) {
        return d;
      });

    droplocale.on('change', function() {
      currentLocale = this.value;
      selectLocale = data.filter(function(d) {
        return d['Region'] == currentRegion && d['Locale'] == currentLocale;
      })

      details(selectLocale);
    })

  })

  function details(selectLocale) {
    console.log(selectLocale);
  };


});
