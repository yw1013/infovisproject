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

  var selectRegion;
  var currentRegion;
  var currentLocale;
  var empty = [" "];
  dropregion.on('change', function() {
    currentRegion = this.value;
    selectRegion = data.filter(function(d) {
      return d['Region'] == currentRegion;
    });

    droplocale.selectAll('option')
      .remove();

    droplocale.selectAll('option')
      .data(empty)
      .enter()
      .append('option');

    selectRegion = selectRegion.sort(function(a, b) {
      if (a.Locale < b.Locale) return -1;
      if (a.Locale > b.Locale) return 1;
      return 0;
    })

    droplocale.selectAll('option')
      .data(selectRegion, function(d) {
        return d;
      })
      .enter()
      .append('option')
      .text(function(d) {
        return d.Locale;
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
