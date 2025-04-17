/* eslint-disable */
am5.ready(function() {
  // Only create chart if element exists
  if (!document.getElementById('chartdiv')) return;

  // Create root element
  var root = am5.Root.new("chartdiv");
  
  // Set themes
  root.setThemes([
    am5themes_Animated.new(root)
  ]);
  
  // Create chart
  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none",
      paddingBottom: 50,
      paddingTop: 40
    })
  );
  
  // Create axes
  var xRenderer = am5xy.AxisRendererX.new(root, {
    minorGridEnabled: true,
    minGridDistance: 60
  });
  xRenderer.grid.template.set("visible", false);
  
  var xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      paddingTop: 40,
      categoryField: "name",
      renderer: xRenderer
    })
  );
  
  var yRenderer = am5xy.AxisRendererY.new(root, {});
  yRenderer.grid.template.set("strokeDasharray", [3]);
  
  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      min: 0,
      renderer: yRenderer
    })
  );
  
  // Add series
  var series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Bookings",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "bookings",
      categoryXField: "name",
      sequencedInterpolation: true,
      calculateAggregates: true,
      maskBullets: false,
      tooltip: am5.Tooltip.new(root, {
        dy: -30,
        pointerOrientation: "vertical",
        labelText: "{valueY}"
      })
    })
  );
  
  series.columns.template.setAll({
    strokeOpacity: 0,
    cornerRadiusBR: 10,
    cornerRadiusTR: 10,
    cornerRadiusBL: 10,
    cornerRadiusTL: 10,
    maxWidth: 50,
    fillOpacity: 0.8
  });
  
  var currentlyHovered;
  
  series.columns.template.events.on("pointerover", (e) => {
    handleHover(e.target.dataItem);
  });
  
  series.columns.template.events.on("pointerout", (e) => {
    handleOut();
  });
  
  function handleHover(dataItem) {
    if (dataItem && currentlyHovered != dataItem) {
      handleOut();
      currentlyHovered = dataItem;
      var bullet = dataItem.bullets[0];
      bullet.animate({
        key: "locationY",
        to: 1,
        duration: 600,
        easing: am5.ease.out(am5.ease.cubic)
      });
    }
  }
  
  function handleOut() {
    if (currentlyHovered) {
      var bullet = currentlyHovered.bullets[0];
      bullet.animate({
        key: "locationY",
        to: 0,
        duration: 600,
        easing: am5.ease.out(am5.ease.cubic)
      });
    }
  }
  
  var circleTemplate = am5.Template.new({});
  
  series.bullets.push((root, series, dataItem) => {
    var bulletContainer = am5.Container.new(root, {});
    var circle = bulletContainer.children.push(
      am5.Circle.new(
        root,
        {
          radius: 34
        },
        circleTemplate
      )
    );
  
    var maskCircle = bulletContainer.children.push(
      am5.Circle.new(root, { radius: 27 })
    );
  
    var imageContainer = bulletContainer.children.push(
      am5.Container.new(root, {
        mask: maskCircle
      })
    );
  
    var image = imageContainer.children.push(
      am5.Picture.new(root, {
        templateField: "pictureSettings",
        centerX: am5.p50,
        centerY: am5.p50,
        width: 60,
        height: 60
      })
    );
  
    return am5.Bullet.new(root, {
      locationY: 0,
      sprite: bulletContainer
    });
  });
  
  // heatrule
  series.set("heatRules", [
    {
      dataField: "valueY",
      min: am5.color(0xe5dc36),
      max: am5.color(0x5faa46),
      target: series.columns.template,
      key: "fill"
    },
    {
      dataField: "valueY",
      min: am5.color(0xe5dc36),
      max: am5.color(0x5faa46),
      target: circleTemplate,
      key: "fill"
    }
  ]);
  
  series.data.setAll(data);
  xAxis.data.setAll(data);
  
  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  cursor.lineX.set("visible", false);
  cursor.lineY.set("visible", false);
  
  cursor.events.on("cursormoved", () => {
    var dataItem = series.get("tooltip").dataItem;
    if (dataItem) {
      handleHover(dataItem);
    } else {
      handleOut();
    }
  });
  
  // Make stuff animate on load
    series.appear();
    chart.appear(1000, 100);

    // Cleanup on destroy
    return () => {
      root.dispose();
    };
  });

