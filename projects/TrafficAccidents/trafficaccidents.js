/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */

/*
Code sources:
- https://www.d3-graph-gallery.com/graph/barplot_stacked_basicWide.html
- http://using-d3js.com/
- colors: https://observablehq.com/@d3/color-schemes
- tooltip: https://stackoverflow.com/questions/44427544/embed-a-svg-shape-in-d3tip-tooltip
*/


var margin = {top: 20, right: 40, bottom: 60, left: 60},
            width =  930 - margin.left - margin.right, 
            height = 1500    - margin.top - margin.bottom;   

        //second chart
        var svg1 = d3.select("#my_chart")
            .append("svg")
                .attr("width", width/5 + margin.left + margin.right)
                .attr("height", height/5 + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")");
        var tool_tip1 = d3.tip()
          .attr("class", "d3-tip")
          .offset([20, 40])
          .html("<div id='mySVGtooltip1'></div>");
        
        svg1.call(tool_tip1);
        
d3.csv("CollisionType.csv").then(function(data){

            var div = d3.select("#sub-heading")
                    .attr("class", "heading")
                    .style("opacity", 0);

            //subgroup = features within the group
            //we do not care about the total calculated column
            var subgroups = ["Unknown", "Undivided(NH)", "Undivided(SH)", "Undivided(OT)", "Divided(NH)", "Divided(SH)", "Divided(OT)"]
            //console.log(subgroups)
            //group = RTA, fatalities, injuries
            var groups = ["RTA"]
            //var percentages = data[9];
            //console.log(percentages);
            //insert X axis
            var x = d3.scaleBand()
                    .domain(groups)
                    .range([0, width/5])
                    .padding([0.7]);
                svg1.append("g")
                    .append("text")
                    .attr("class", "label")
                    .attr("x", width/5/2)
                    .attr("y", 310)
                    .style("text-anchor", "middle")
                    .attr("font-size", "12px")
                    .attr("fill", "black")
                    .text("Collision Type")
                    .on("mouseover", function () {
                                div.transition()
                                    .duration(1)
                                    .style("opacity", 0.9);
                                div.html( 
                                    "<p style = 'text-align:center; color:black;margin:0'>Collision Type" +
                                    "<p style = 'text-align:left; color:black;margin:0'> Excluding unknown reasons (which accounts for 46% of the accidents), although most accidents occur at undivided OT (16.4%), undivided national highways NH (12.8%), undivided state highways SH (12.8%), but divided highways also account for 13% of accidents (8.8% for divided national highways, 2.27% divided OH and 2.0% divided state highways).</p></p>");
                        });
            //insert Y Axis

            var y = d3.scaleLinear()
                    .domain([1, 11000])
                    .range([height/5,0]);
                svg1.append("g")
                    .attr("class", "grid")
                    .call(d3.axisLeft(y).ticks(8).tickSize(-width/5, 0, 0))
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("x", 0)
                .attr("y", -55)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .attr("font-size", "12px")
                .attr("fill", "black")
                .text("Number of Accidents");


            //add different colors per subgroup 
            var color = d3.scaleOrdinal()
                    .range(["lightgrey", "#66c2a5","#fc8d62","#8da0cb", "#519b84","#c9704e","#7080a2"]) 
                    .domain(subgroups);

              //stack the data? --> stack per subgroup
          var stackedData = d3.stack()
            .keys(subgroups)([data[8]]);
        //console.log(stackedData);
          // Show the bars
          var colors = [];
          svg1.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)

            .enter().append("g")
              .attr("fill", function(d) { colors.push(color(d.key)); return color(d.key); })
              //Tooltip
                .on('mouseover', function(d) {
                    tool_tip1.show();
                    var legendSVG = d3.select("#mySVGtooltip1")
                    .append("svg")
                      .attr("width", 220)
                      .attr("height", 60);

            var legend = legendSVG.append("g")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", 12);


            legend.append("rect")
                 .attr("y", 8)
                 .attr("x", 15)
                 .attr("width", 20)
                 .attr("height", 20)
                 .attr("fill", color(d.key));
              
            legend.append("text")
                 .attr("x", 130)
                 .attr("y", 20)
                 .attr("text-anchor", "middle")
                 .attr("font-weight", "bold")
                 .text(function() {return d.key;});
              
            legend.append("text")
                 .attr("x", 15)
                 .attr("y", 45)
                 .attr("text-anchor", "left")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        return (distance);
                      });
                    
            legend.append("text")
                 .attr("x", 130)
                 .attr("y", 45)
                 .attr("text-anchor", "middle")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        var percentage = (distance/10042)*100;
                        return ("(" + percentage.toFixed(2) + "%)");
                      });
                  })
                .on('mouseout', tool_tip1.hide)

              .selectAll("rect")
              // enter a second time = loop subgroup per subgroup to add all rectangles
              .data(function(d) { return d; })
              .enter().append("rect")
                .attr("x", function(d) { return x(d.data.Collisiontype); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width",x.bandwidth());

        });


//third chart
var svg2 = d3.select("#my_chart")
    .append("svg")
        .attr("width", width/5 + margin.left + margin.right)
        .attr("height", height/5 + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")");
var tool_tip2 = d3.tip()
          .attr("class", "d3-tip")
          .offset([20, 40])
          .html("<div id='mySVGtooltip2'></div>");
        
svg2.call(tool_tip2);

d3.csv("VehicleType.csv").then(function(data){
    var div = d3.select("#sub-heading")
            .attr("class", "heading")
            .style("opacity", 0);
    
    //subgroup = features within the group
    //we do not care about the total calculated column
    var subgroups = ["Truck/Lorry", "Car/Jeep/Van/Taxi", "Motorised two-wheeler", "Bus", "Tempo/Tractor", "Auto Rickshaw", "HAV/Trolley", "Unknown", "E-Rickshaw", "Bicycle", "Cycle Rickshaw", "Hand Drawn Cart", "Animal Drawn Cart", "Others"]
    //console.log(subgroups)
    //group = RTA, fatalities, injuries
    var groups = ["RTA"]
    
    //insert X axis
    var x = d3.scaleBand()
            .domain(groups)
            .range([0, width/5])
            .padding([0.7]); //rotates the text to be -60 
        svg2.append("g")
            .append("text")
            .attr("class", "label")
            .attr("x", width/5/2)
            .attr("y", 310)
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .text("Vehicle Type")
            .on("mouseover", function () {
                        div.transition()
                            .duration(1)
                            .style("opacity", 0.9);
                        div.html( 
                            "<p style = 'text-align:center; color:black;margin:0'>Vehicle Type" +
                            "<p style = 'text-align:left; color:black;margin:0'> Trucks/Lorries are involved in almost 1/3 rd (31.5%) of the accidents followed by car/ van/ jeep/ taxi (22.8%), and motorized two-wheeler (22.35%). Vehicles involved in remaining accidents include bus (8.85%), tempo/tractor (3.66%), auto rickshaw (2.73%), and others (6.08%).</p></p>");
                });
    //insert Y Axis
    var y = d3.scaleLinear()
            .domain([1, 11000])
            .range([height/5,0]);
        svg2.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y).ticks(8).tickSize(-width/5, 0, 0))
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -55)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .text("Number of Accidents");
    
    
    //add different colors per subgroup 
    var color = d3.scaleOrdinal()
            .range(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494", "#66c2a5", "#b3b3b3", "#fc8d62","#8da0cb","#e78ac3","#a6d854","lightgrey"]) 
            .domain(subgroups);
    
      //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)([data[0]])
//console.log(stackedData);
  // Show the bars
  svg2.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
//Tooltip
      .on('mouseover', function(d) {
            tool_tip2.show();
            var legendSVG = d3.select("#mySVGtooltip2")
                    .append("svg")
                      .attr("width", 220)
                      .attr("height", 60);

            var legend = legendSVG.append("g")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", 12);


            legend.append("rect")
                 .attr("y", 8)
                 .attr("x", 15)
                 .attr("width", 20)
                 .attr("height", 20)
                 .attr("fill", color(d.key));
              
            legend.append("text")
                 .attr("x", 130)
                 .attr("y", 20)
                 .attr("text-anchor", "middle")
                 .attr("font-weight", "bold")
                 .text(function() {return d.key;});
                    
            legend.append("text")
                 .attr("x", 15)
                 .attr("y", 45)
                 .attr("text-anchor", "left")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        return (distance);
                      });
                    
            legend.append("text")
                 .attr("x", 130)
                 .attr("y", 45)
                 .attr("text-anchor", "middle")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        var percentage = (distance/10042)*100;
                        return ("(" + percentage.toFixed(2) + "%)");
                      });
            })
                .on('mouseout', tool_tip2.hide)
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.VehicleType); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth());
});

//tenth chart 
var svg9 = d3.select("#my_chart")
    .append("svg")
        .attr("width", width/5 + margin.left + margin.right)
        .attr("height", height/5 + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")");
var tool_tip9 = d3.tip()
          .attr("class", "d3-tip")
          .offset([20, 40])
          .html("<div id='mySVGtooltip9'></div>");
        
svg9.call(tool_tip9);

d3.csv("TypeofTrafficRuleViolation.csv").then(function(data){
    var div = d3.select("#sub-heading")
            .attr("class", "heading")
            .style("opacity", 0);
    
    //subgroup = features within the group
    //we do not care about the total calculated column
    var subgroups = ["not known", "no violation", "driving or wrong side", "over speeding", "jumping red light", "use of mobile phone", "drunken driving"]
    //console.log(subgroups)
    //group = RTA, fatalities, injuries
    var groups = ["RTA"]
    
    //insert X axis
    var x = d3.scaleBand()
            .domain(groups)
            .range([0, width/5])
            .padding([0.7]); //rotates the text to be -60 
        svg9.append("g")
            .append("text")
            .attr("class", "label")
            .attr("x", width/5/2)
            .attr("y", 310)
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .text("Type of Traffic Rule Violation")
            .on("mouseover", function () {
                        div.transition()
                            .duration(1)
                            .style("opacity", 0.9);
                        div.html( 
                            "<p style = 'text-align:center; color:black;margin:0'>Type of Traffic Rule Violation" +
                            "<p style = 'text-align:left; color:black;margin:0'> Unfortunately, a whopping 45.5% of accidents do not list any type of traffic rule violation. Overspeeding is registered as 46.2% of the cause of accidents although this number may be inflated as this violation may be registered at the FIR before an investigation is carried out. No violation is registered as 5.72% of accidents while driving on the wrong side or drunken driving are listed only 1.85% and 0.46% respectively.</p></p>");
                });
    //insert Y Axis
    var y = d3.scaleLinear()
            .domain([1, 11000])
            .range([height/5,0]);
        svg9.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y).ticks(8).tickSize(-width/5, 0, 0))
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -55)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .text("Number of Accidents");
    
    
    //add different colors per subgroup 
    var color = d3.scaleOrdinal()
            .range(["lightgrey", "#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494", "#b3b3b3", "#66c2a5"])
            .domain(subgroups);
    
      //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups).order(d3.stackOrderDescending)([data[2]])
//console.log(stackedData);
  // Show the bars
  svg9.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
        //Tooltip
      .on('mouseover', function(d) {
            tool_tip9.show();
            var legendSVG = d3.select("#mySVGtooltip9")
                    .append("svg")
                      .attr("width", 220)
                      .attr("height", 60);

            var legend = legendSVG.append("g")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", 12);


            legend.append("rect")
                 .attr("y", 8)
                 .attr("x", 15)
                 .attr("width", 20)
                 .attr("height", 20)
                 .attr("fill", color(d.key));
              
            legend.append("text")
                 .attr("x", 130)
                 .attr("y", 20)
                 .attr("text-anchor", "middle")
                 .attr("font-weight", "bold")
                 .text(function() {return d.key;});
                    
            legend.append("text")
                 .attr("x", 15)
                 .attr("y", 45)
                 .attr("text-anchor", "left")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        return (distance);
                      });
                    
            legend.append("text")
                 .attr("x", 130)
                 .attr("y", 45)
                 .attr("text-anchor", "middle")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        var percentage = (distance/10042)*100;
                        return ("(" + percentage.toFixed(2) + "%)");
                      });
            })
                .on('mouseout', tool_tip9.hide)
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.Typeoftrafficrulesviolation); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth());
      
});

//fourth chart
var svg3 = d3.select("#my_chart")
    .append("svg")
        .attr("width", width/5 + margin.left + margin.right)
        .attr("height", height/5 + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")");
var tool_tip3 = d3.tip()
          .attr("class", "d3-tip")
          .offset([20, 40])
          .html("<div id='mySVGtooltip3'></div>");
        
svg3.call(tool_tip3);

d3.csv("Urban-Rural.csv").then(function(data){
    var div = d3.select("#sub-heading")
            .attr("class", "heading")
            .style("opacity", 0);
    
    //subgroup = features within the group
    //we do not care about the total calculated column
    var subgroups = ["UrbanArea", "RuralArea"]
    //console.log(subgroups)
    //group = RTA, fatalities, injuries
    var groups = ["RTA"]
    
    //insert X axis
    var x = d3.scaleBand()
            .domain(groups)
            .range([0, width/5])
            .padding([0.7]); //rotates the text to be -60 
        svg3.append("g")
            .append("text")
            .attr("class", "label")
            .attr("x", width/5/2)
            .attr("y", 310)
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .text("Urban-Rural")
            .on("mouseover", function () {
                        div.transition()
                            .duration(1)
                            .style("opacity", 0.9);
                        div.html( 
                            "<p style = 'text-align:center; color:black;margin:0'>Urban-Rural" +
                            "<p style = 'text-align:center; color:black;margin:0'> 69.5% accidents occur in rural areas while remaining 30.5% accidents occur in urban areas.</p></p>");
                });
    //insert Y Axis
    var y = d3.scaleLinear()
            .domain([1, 11000])
            .range([height/5,0]);
        svg3.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y).ticks(8).tickSize(-width/5, 0, 0))
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -55)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .text("Number of Accidents");
    
    
    //add different colors per subgroup 
    var color = d3.scaleOrdinal()
            .range(d3.schemeSet2)
            .domain(subgroups);
    
      //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups).order(d3.stackOrderDescending)([data[0]])
//console.log(stackedData);
  // Show the bars
  svg3.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
        //Tooltip
      .on('mouseover', function(d) {
            tool_tip3.show();
            var legendSVG = d3.select("#mySVGtooltip3")
                    .append("svg")
                      .attr("width", 220)
                      .attr("height", 60);

            var legend = legendSVG.append("g")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", 12);


            legend.append("rect")
                 .attr("y", 8)
                 .attr("x", 15)
                 .attr("width", 20)
                 .attr("height", 20)
                 .attr("fill", color(d.key));
              
            legend.append("text")
                 .attr("x", 130)
                 .attr("y", 20)
                 .attr("text-anchor", "middle")
                 .attr("font-weight", "bold")
                 .text(function() {return d.key;});
                    
            legend.append("text")
                 .attr("x", 15)
                 .attr("y", 45)
                 .attr("text-anchor", "left")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        return (distance);
                      });
                    
            legend.append("text")
                 .attr("x", 130)
                 .attr("y", 45)
                 .attr("text-anchor", "middle")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        var percentage = (distance/10042)*100;
                        return ("(" + percentage.toFixed(2) + "%)");
                      });
            })
                .on('mouseout', tool_tip3.hide)
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.UrbanRural); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth());
    
});

//fifth chart 
var svg4 = d3.select("#my_chart")
    .append("svg")
        .attr("width", width/5 + margin.left + margin.right)
        .attr("height", height/5 + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")");
var tool_tip4 = d3.tip()
          .attr("class", "d3-tip")
          .offset([20, -250])
          .html("<div id='mySVGtooltip4'></div>");
        
svg4.call(tool_tip4);

d3.csv("RoadJunctionType.csv").then(function(data){
    var div = d3.select("#sub-heading")
            .attr("class", "heading")
            .style("opacity", 0);
    
    //console.log(data[1])
    //subgroup = features within the group
    //we do not care about the total calculated column
    var subgroups = ["T Junction", "Y Junction", "Four Arm Junction", "Staggered Junction", "Round About Junction", "No Road Junction"]
    //console.log(subgroups)
    //group = RTA, fatalities, injuries
    var groups = ["RTA"]
    
    //insert X axis
    var x = d3.scaleBand()
            .domain(groups)
            .range([0, width/5])
            .padding([0.7]); //rotates the text to be -60 
        svg4.append("g")
            .append("text")
            .attr("class", "label")
            .attr("x", width/5/2)
            .attr("y", 310)
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .text("Road Junction Type")
            .on("mouseover", function () {
                        div.transition()
                            .duration(1)
                            .style("opacity", 0.9);
                        div.html( 
                            "<p style = 'text-align:center; color:black;margin:0'>Road Junction Type" +
                            "<p style = 'text-align:left; color:black;margin:0'> Overwhelmingly, almost 60% of accidents do not involve any road junction. Staggered junction and T-junctions are involved in 15% and 13% of accidents. Other junctions involved in accidents include Y-junction (5%), Four-arm junction (4%), and Round-about junction (3.7%).</p></p>");
                });
    //insert Y Axis
    var y = d3.scaleLinear()
            .domain([1, 11000])
            .range([height/5,0]);
        svg4.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y).ticks(8).tickSize(-width/5, 0, 0))
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -55)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .text("Number of Accidents");
    
    
    //add different colors per subgroup 
    var color = d3.scaleOrdinal()
            .range(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","lightgrey"])
            .domain(subgroups);
    
      //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups).order(d3.stackOrderDescending)([data[0]])
//console.log(stackedData);
  // Show the bars
  svg4.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
        //Tooltip
      .on('mouseover', function(d) {
            tool_tip4.show();
            var legendSVG = d3.select("#mySVGtooltip4")
                    .append("svg")
                      .attr("width", 220)
                      .attr("height", 60);

            var legend = legendSVG.append("g")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", 12);


            legend.append("rect")
                 .attr("y", 8)
                 .attr("x", 15)
                 .attr("width", 20)
                 .attr("height", 20)
                 .attr("fill", color(d.key));
              
            legend.append("text")
                 .attr("x", 130)
                 .attr("y", 20)
                 .attr("text-anchor", "middle")
                 .attr("font-weight", "bold")
                 .text(function() {return d.key;});
                    
            legend.append("text")
                 .attr("x", 15)
                 .attr("y", 45)
                 .attr("text-anchor", "left")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        return (distance);
                      });
                    
            legend.append("text")
                 .attr("x", 130)
                 .attr("y", 45)
                 .attr("text-anchor", "middle")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        var percentage = (distance/10042)*100;
                        return ("(" + percentage.toFixed(2) + "%)");
                      });
            })
                .on('mouseout', tool_tip4.hide)
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.RoadJunctionType); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth());
});

//sixth chart
var svg5 = d3.select("#my_chart")
    .append("svg")
        .attr("width", width/5 + margin.left + margin.right)
        .attr("height", height/5 + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")");
var tool_tip5 = d3.tip()
          .attr("class", "d3-tip")
          .offset([20, 40])
          .html("<div id='mySVGtooltip5'></div>");
        
svg5.call(tool_tip5);

d3.csv("TrafficControlType.csv").then(function(data){
    var div = d3.select("#sub-heading")
            .attr("class", "heading")
            .style("opacity", 0);
    //console.log(data[1])
    //subgroup = features within the group
    //we do not care about the total calculated column
    var subgroups = ["Traffic Light Signal", "Police Control", "Stop Sign", "Flashing Signal/Blinker", "Uncontrolled", "No Road Junction"]
    //console.log(subgroups)
    //group = RTA, fatalities, injuries
    var groups = ["RTA"]
    
    //insert X axis
    var x = d3.scaleBand()
            .domain(groups)
            .range([0, width/5])
            .padding([0.7]); //rotates the text to be -60 
        svg5.append("g")
            .append("text")
            .attr("class", "label")
            .attr("x", width/5/2)
            .attr("y", 310)
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .text("Traffic Control Type")
            .on("mouseover", function () {
                        div.transition()
                            .duration(1)
                            .style("opacity", 0.9);
                        div.html( 
                            "<p style = 'text-align:center; color:black;margin:0'>Traffic Control Type" +
                            "<p style = 'text-align:left; color:black;margin:0'> Of the 40% accidents where road junctions are involved, 25.8% are uncontrolled followed by 10.4% police-controlled junctions. Other traffic control types include traffic light signal (3.24%), stop sign (0.92%) and flashing signal or blinker (0.38%).</p></p>");
                });
    //insert Y Axis
    var y = d3.scaleLinear()
            .domain([1, 11000])
            .range([height/5,0]);
        svg5.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y).ticks(8).tickSize(-width/5, 0, 0))
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -55)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .text("Number of Accidents");
    
    
    //add different colors per subgroup 
    var color = d3.scaleOrdinal()
            .range(["#66c2a5","#fc8d62","#8da0cb","#e78ac3", "#b3b3b3", "lightgrey"])
            .domain(subgroups);
    
      //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups).order(d3.stackOrderDescending)([data[0]])
//console.log(stackedData);
  // Show the bars
  svg5.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
        //Tooltip
      .on('mouseover', function(d) {
            tool_tip5.show();
            var legendSVG = d3.select("#mySVGtooltip5")
                    .append("svg")
                      .attr("width", 220)
                      .attr("height", 60);

            var legend = legendSVG.append("g")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", 12);


            legend.append("rect")
                 .attr("y", 8)
                 .attr("x", 15)
                 .attr("width", 20)
                 .attr("height", 20)
                 .attr("fill", color(d.key));
              
            legend.append("text")
                 .attr("x", 130)
                 .attr("y", 20)
                 .attr("text-anchor", "middle")
                 .attr("font-weight", "bold")
                 .text(function() {return d.key;});
                    
            legend.append("text")
                 .attr("x", 15)
                 .attr("y", 45)
                 .attr("text-anchor", "left")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        return (distance);
                      });
                    
            legend.append("text")
                 .attr("x", 130)
                 .attr("y", 45)
                 .attr("text-anchor", "middle")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        var percentage = (distance/10042)*100;
                        return ("(" + percentage.toFixed(2) + "%)");
                      });
            })
                .on('mouseout', tool_tip5.hide)
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.TrafficControlType); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth());
});

//first chart 
var svg = d3.select("#my_chart")
    .append("svg")
        .attr("width", width/5 + margin.left + margin.right)
        .attr("height", height/5 + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var tool_tip = d3.tip()
          .attr("class", "d3-tip")
          .offset([20, 40])
          .html("<div id='mySVGtooltip'></div>");
        
svg.call(tool_tip);

d3.csv("RoadFeatures.csv").then(function(data){
    var div = d3.select("#sub-heading")
            .attr("class", "heading")
            .style("opacity", 0);
    //subgroup = features within the group
    //we do not care about the total calculated column
    var subgroups = ["Straight Road", "Curved Road", "Bridge", "Culvert", "Pot holes", "Steep Gradient", "Ongoing roadworks Construction"]
    //console.log(subgroups)
    //group = RTA, fatalities, injuries
    var groups = ["RTA"]
    
    //insert X axis
    var x = d3.scaleBand()
            .domain(groups)
            .range([0, width/5])
            .padding([0.7]); //rotates the text to be -60 
        svg.append("g")
            .append("text")
            .attr("class", "label")
            .attr("x", width/5/2)
            .attr("y", 310)
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .text("Road Features")
            .on("mouseover", function () {
                        div.transition()
                            .duration(1)
                            .style("opacity", 0.9);
                        div.html( 
                            "<p style = 'text-align:center; color:black;margin:0'>Road Features" +
                            "<p style = 'text-align:left; color:black;margin:0'> Excluding the straight roads (which accounts for 79% of the accidents), most accidents occur at curved roads (12%) followed by bridge (2.66%), culvert (1.8%), construction work, pot holes, and steep gradient, each accounting for approximately 0.9% accidents.</p></p>");
                });
    //insert Y Axis
    var y = d3.scaleLinear()
            .domain([1, 11000])
            .range([height/5,0]);
        svg.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y).ticks(8).tickSize(-width/5, 0, 0))
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -55)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .text("Number of Accidents");
    
    
    //add different colors per subgroup 
    var color = d3.scaleOrdinal()
            .range(["lightgrey","#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f"])
            .domain(subgroups);
    
      //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups).order(d3.stackOrderDescending)([data[0]])
  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
        .attr("fill", function(d) { return color(d.key); })
         //Tooltip
      .on('mouseover', function(d) {
            tool_tip.show();
            var legendSVG = d3.select("#mySVGtooltip")
                    .append("svg")
                      .attr("width", 240)
                      .attr("height", 60);

            var legend = legendSVG.append("g")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", 12);


            legend.append("rect")
                 .attr("y", 8)
                 .attr("x", 15)
                 .attr("width", 20)
                 .attr("height", 20)
                 .attr("fill", color(d.key));
              
            legend.append("text")
                 .attr("x", 140)
                 .attr("y", 20)
                 .attr("text-anchor", "middle")
                 .attr("font-weight", "bold")
                 .text(function() {return d.key;});
                    
            legend.append("text")
                 .attr("x", 15)
                 .attr("y", 45)
                 .attr("text-anchor", "left")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        return (distance);
                      });
                    
            legend.append("text")
                 .attr("x", 130)
                 .attr("y", 45)
                 .attr("text-anchor", "middle")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        var percentage = (distance/10042)*100;
                        return ("(" + percentage.toFixed(2) + "%)");
                      });
            })
                .on('mouseout', tool_tip.hide)
    .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function(d) { return d; })
    .enter().append("rect")
        .attr("x", function(d) { return x(d.data.RoadFeatures); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth());

});

//seventh chart
var svg6 = d3.select("#my_chart")
    .append("svg")
        .attr("width", width/5 + margin.left + margin.right)
        .attr("height", height/5 + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")");
var tool_tip6 = d3.tip()
          .attr("class", "d3-tip")
          .offset([20, 40])
          .html("<div id='mySVGtooltip6'></div>");
        
svg6.call(tool_tip6);

d3.csv("TimeoftheDay.csv").then(function(data){
    var div = d3.select("#sub-heading")
            .attr("class", "heading")
            .style("opacity", 0);
    //console.log(data[1])
    //subgroup = features within the group
    //we do not care about the total calculated column
    var subgroups = ["06:00 - 09:00 (day)", "09:00 - 12:00 (day)", "12:00 - 15:00 (day)", "15:00 - 18:00 (day)", "18:00 - 21:00 (night)", "21:00 - 24:00 (night)", "00:00 - 03:00 (night)","03:00 - 06:00 (night)"]
    //console.log(subgroups)
    //group = RTA, fatalities, injuries
    var groups = ["RTA"]
    
    //insert X axis
    var x = d3.scaleBand()
            .domain(groups)
            .range([0, width/5])
            .padding([0.7]); //rotates the text to be -60 
        svg6.append("g")
            .append("text")
            .attr("class", "label")
            .attr("x", width/5/2)
            .attr("y", 310)
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .text("Time of the Day")
            .on("mouseover", function () {
                        div.transition()
                            .duration(1)
                            .style("opacity", 0.9);
                        div.html( 
                            "<p style = 'text-align:center; color:black;margin:0'>Time of the Day" +
                            "<p style = 'text-align:left; color:black;margin:0'> Roughly, the time distribution for accidents is surprisingly uniform throughout the day with a slight dip during the night (except during 12 midnight to 3 am when the maximum accidents occur). In each of the eight three-hour interval starting from 6am in the morning, the percentage of accidents are 10.8%, 15.4%, 13.5%, 13.8%, 12.67%, 9.20%, 16.29%, and 8.32%.</p></p>");
                });
    //insert Y Axis
    var y = d3.scaleLinear()
            .domain([1, 11000])
            .range([height/5,0]);
        svg6.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y).ticks(8).tickSize(-width/5, 0, 0))
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -55)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .text("Number of Accidents");
    
    
    //add different colors per subgroup 
    var color = d3.scaleOrdinal()
            .range(["#fdae61","#f46d43","#d73027","#a50026", "#e0e0e0","#bababa","#878787","#4d4d4d"])
            .domain(subgroups);
    
      //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)([data[0]])
//console.log(stackedData);
  // Show the bars
  svg6.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
        //Tooltip
      .on('mouseover', function(d) {
            tool_tip6.show();
            var legendSVG = d3.select("#mySVGtooltip6")
                    .append("svg")
                      .attr("width", 220)
                      .attr("height", 60);

            var legend = legendSVG.append("g")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", 12);


            legend.append("rect")
                 .attr("y", 8)
                 .attr("x", 15)
                 .attr("width", 20)
                 .attr("height", 20)
                 .attr("fill", color(d.key));
              
            legend.append("text")
                 .attr("x", 115)
                 .attr("y", 20)
                 .attr("text-anchor", "middle")
                 .attr("font-weight", "bold")
                 .text(function() {return d.key;});
                    
            legend.append("text")
                 .attr("x", 15)
                 .attr("y", 45)
                 .attr("text-anchor", "left")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        return (distance);
                      });
                    
            legend.append("text")
                 .attr("x", 130)
                 .attr("y", 45)
                 .attr("text-anchor", "middle")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        var percentage = (distance/10042)*100;
                        return ("(" + percentage.toFixed(2) + "%)");
                      });
            })
                .on('mouseout', tool_tip6.hide)
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.Time); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) {  return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth());
});

//eighth chart
var svg7 = d3.select("#my_chart")
    .append("svg")
        .attr("width", width/5 + margin.left + margin.right)
        .attr("height", height/5 + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")");
var tool_tip7 = d3.tip()
          .attr("class", "d3-tip")
          .offset([20, 40])
          .html("<div id='mySVGtooltip7'></div>");
        
svg7.call(tool_tip7);

d3.csv("PedestrianInvolved.csv").then(function(data){
    var div = d3.select("#sub-heading")
            .attr("class", "heading")
            .style("opacity", 0);
    //console.log(data[1])
    //subgroup = features within the group
    //we do not care about the total calculated column
    var subgroups = ["Pedestrian Involved - Urban", "Pedestrian Involved - Rural", "Pedestrian Not Involved"]
    //console.log(subgroups)
    //group = RTA, fatalities, injuries
    var groups = ["RTA"]
    
    //insert X axis
    var x = d3.scaleBand()
            .domain(groups)
            .range([0, width/5])
            .padding([0.7]); //rotates the text to be -60 
        svg7.append("g")
            .append("text")
            .attr("class", "label")
            .attr("x", width/5/2)
            .attr("y", 310)
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .text("Pedestrian Involved")
            .on("mouseover", function () {
                        div.transition()
                            .duration(1)
                            .style("opacity", 0.9);
                        div.html( 
                            "<p style = 'text-align:center; color:black;margin:0'>Pedestrian Involved" +
                            "<p style = 'text-align:center; color:black;margin:0'> Pedestrians are involved in roughly 41.5% of the accidents of which 29.65% occur in urban areas are 11.8% occur in rural areas.</p></p>");
                });
    //insert Y Axis
    var y = d3.scaleLinear()
            .domain([1, 11000])
            .range([height/5,0]);
        svg7.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y).ticks(8).tickSize(-width/5, 0, 0))
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -55)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .text("Number of Accidents");
    
    
    //add different colors per subgroup 
    var color = d3.scaleOrdinal()
            .range(["#66c2a5","#fc8d62", "lightgrey"])
            .domain(subgroups);
    
      //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups).order(d3.stackOrderDescending)([data[2]])
//console.log(stackedData);
  // Show the bars
  svg7.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
        //Tooltip
      .on('mouseover', function(d) {
            tool_tip7.show();
            var legendSVG = d3.select("#mySVGtooltip7")
                    .append("svg")
                      .attr("width", 220)
                      .attr("height", 60);

            var legend = legendSVG.append("g")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", 12);


            legend.append("rect")
                 .attr("y", 8)
                 .attr("x", 15)
                 .attr("width", 20)
                 .attr("height", 20)
                 .attr("fill", color(d.key));
              
            legend.append("text")
                 .attr("x", 130)
                 .attr("y", 20)
                 .attr("text-anchor", "middle")
                 .attr("font-weight", "bold")
                 .text(function() {return d.key;});
                    
            legend.append("text")
                 .attr("x", 15)
                 .attr("y", 45)
                 .attr("text-anchor", "left")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        return (distance);
                      });
                    
            legend.append("text")
                 .attr("x", 130)
                 .attr("y", 45)
                 .attr("text-anchor", "middle")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        var percentage = (distance/10042)*100;
                        return ("(" + percentage.toFixed(2) + "%)");
                      });
            })
                .on('mouseout', tool_tip7.hide)
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.PedestrianInvolved); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth());

});

//ninth chart
var svg8 = d3.select("#my_chart")
    .append("svg")
        .attr("width", width/5 + margin.left + margin.right)
        .attr("height", height/5 + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")");
var tool_tip8 = d3.tip()
          .attr("class", "d3-tip")
          .offset([20, -250])
          .html("<div id='mySVGtooltip8'></div>");
        
svg8.call(tool_tip8);

d3.csv("TypeofArea.csv").then(function(data){
    var div = d3.select("#sub-heading")
            .attr("class", "heading")
            .style("opacity", 0);
    //console.log(data[1])
    //subgroup = features within the group
    //we do not care about the total calculated column
    var subgroups = ["Pedestrians Not Involved", "residential area", "open area", "market/commercial area", "bus stop", "petrol pump", "institutional area", "hospital", "others",]
    //console.log(subgroups)
    //group = RTA, fatalities, injuries
    var groups = ["RTA"]
    
    //insert X axis
    var x = d3.scaleBand()
            .domain(groups)
            .range([0, width/5])
            .padding([0.7]); //rotates the text to be -60 
        svg8.append("g")
            .append("text")
            .attr("class", "label")
            .attr("x", width/5/2)
            .attr("y", 310)
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .text("Type of Area (when pedestrians involved)")
            .on("mouseover", function () {
                        div.transition()
                            .duration(1)
                            .style("opacity", 0.9);
                        div.html( 
                            "<p style = 'text-align:center; color:black;margin:0'>Type of Area (when pedestrians involved)" +
                            "<p style = 'text-align:left; color:black;margin:0'>Residential areas top (14.6%) the list of areas when pedestrians are involved in traffic accidents followed by open area (10.8%) and market area (7.8%). Other areas involved in pedestrian accidents are bus stops (4.6%), petrol pump (0.94%), institutional areas (0.84%), hospitals (0.39%) and others (1.53%).</p></p>");
                });
    //insert Y Axis
    var y = d3.scaleLinear()
            .domain([1, 11000])
            .range([height/5,0]);
        svg8.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y).ticks(8).tickSize(-width/5, 0, 0))
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -55)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .text("Number of Accidents");
    
    
    //add different colors per subgroup 
    var color = d3.scaleOrdinal()
            .range(["lightgrey","#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"])
            .domain(subgroups);
    
      //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)([data[2]])
//console.log(stackedData);
  // Show the bars
  svg8.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
        //Tooltip
      .on('mouseover', function(d) {
            tool_tip8.show();
            var legendSVG = d3.select("#mySVGtooltip8")
                    .append("svg")
                      .attr("width", 220)
                      .attr("height", 60);

            var legend = legendSVG.append("g")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", 12);


            legend.append("rect")
                 .attr("y", 8)
                 .attr("x", 15)
                 .attr("width", 20)
                 .attr("height", 20)
                 .attr("fill", color(d.key));
              
            legend.append("text")
                 .attr("x", 130)
                 .attr("y", 20)
                 .attr("text-anchor", "middle")
                 .attr("font-weight", "bold")
                 .text(function() {return d.key;});
                    
            legend.append("text")
                 .attr("x", 15)
                 .attr("y", 45)
                 .attr("text-anchor", "left")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        return (distance);
                      });
                    
            legend.append("text")
                 .attr("x", 130)
                 .attr("y", 45)
                 .attr("text-anchor", "middle")
                 .text(function() {
                        var distance = d[0][1] - d[0][0];
                        var percentage = (distance/10042)*100;
                        return ("(" + percentage.toFixed(2) + "%)");
                      });
            })
                .on('mouseout', tool_tip8.hide)
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.TypeofArea); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth());
});
