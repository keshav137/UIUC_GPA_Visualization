"use strict";

/* Boilerplate jQuery */
$(function() {
  $.get("res/CollegeofEngineering.csv")
   .done(function (csvData) {
     var data = d3.csvParse(csvData);
     visualize(data, "Engineering");
   })
  .fail(function(e) {
     alert("Failed to load CSV file!");
  });

  $.get("res/AppliedHealthSciences.csv")
   .done(function (csvData) {
     var data = d3.csvParse(csvData);
     visualize(data, "Applied Health Sciences");
   })
  .fail(function(e) {
     alert("Failed to load CSV file!");
  });

  $.get("res/CollegeofAgricultureConsumerandEnvironmentalSciences.csv")
   .done(function (csvData) {
     var data = d3.csvParse(csvData);
     visualize(data, "Agriculture Consumer and Environmental Sciences");
   })
  .fail(function(e) {
     alert("Failed to load CSV file!");
  });

  $.get("res/CollegeofBusiness.csv")
   .done(function (csvData) {
     var data = d3.csvParse(csvData);
     visualize(data, "Business");
   })
  .fail(function(e) {
     alert("Failed to load CSV file!");
  });

  $.get("res/CollegeofEducation.csv")
   .done(function (csvData) {
     var data = d3.csvParse(csvData);
     visualize(data, "Education");
   })
  .fail(function(e) {
     alert("Failed to load CSV file!");
  });

  $.get("res/CollegeofLiberalArtsandSciences.csv")
   .done(function (csvData) {
     var data = d3.csvParse(csvData);
     visualize(data, "Liberal Arts and Sciences");
   })
  .fail(function(e) {
     alert("Failed to load CSV file!");
  });

  $.get("res/CollegeofMedia.csv")
   .done(function (csvData) {
     var data = d3.csvParse(csvData);
     visualize(data, "Media");
   })
  .fail(function(e) {
     alert("Failed to load CSV file!");
  });

  $.get("res/FineandAppliedArts.csv")
   .done(function (csvData) {
     var data = d3.csvParse(csvData);
     visualize(data, "Fine and Applied Arts");
   })
  .fail(function(e) {
     alert("Failed to load CSV file!");
  });

  $.get("res/OtherUnknown.csv")
   .done(function (csvData) {
     var data = d3.csvParse(csvData);
     visualize(data, "Unknown");
   })
  .fail(function(e) {
     alert("Failed to load CSV file!");
  });
});

/* Visualize the data in the visualize function */
var visualize = function(data, title) {
  console.log(data);

  var formatDecimal = d3.format(".2f");

  var sizeScale = d3.scalePow()
                  .exponent(0.3)
                  .domain( [1, _.max(data, "sum_students")["sum_students"]] )
                  .range([1, 20]);

  var color = d3.scaleLinear()
                .range(["hsla(360, 95%, 41%, 0.77)", "hsla(199, 77%, 41%, 0.77)"])
                .interpolate(d3.interpolateHcl);

  var subjects = _.map(data,"Subject")
  subjects = _.uniq(subjects);

  // == BOILERPLATE ==

  // creating a list of all the majors from each department

  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
     width = 800 - margin.left - margin.right,
     height = 600,
     padding = 50;

  var svg = d3.select("#chart")
              .append("svg")
              .attr("width", width + margin.left + margin.right + padding)
              .attr("height", height + margin.top + margin.bottom + padding)
              .style("width", width + margin.left + margin.right + padding)
              .style("height", height + margin.top + margin.bottom + padding)
              .append("g")
              .attr("transform", "translate(" + (margin.left ) + "," + (margin.top ) + ")");

  svg.append("text")
          .attr("x", (width / 2))
          .attr("y", 0 - (margin.top / 2))
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("text-decoration", "underline")
          .text(title);

  var averageGPAScale = d3.scaleLinear()
                    .domain([0.0,4.0])
                    .range([0,width])
                    .nice();

  var courseNumberScale = d3.scaleLinear()
                          .domain([600,0])
                          .range([0 , height]);

  var xAxis = d3.axisBottom().scale(averageGPAScale)
                          .tickFormat(d3.format("d"))
                          .ticks(4);
  var yAxis = d3.axisLeft().scale(courseNumberScale)
                           .tickFormat(d3.format("d"))
                           .ticks(6);
  var tip = d3.tip()
              .attr('class','d3-tip')
              .html(function(d) {
                return '<div style="text-align: center;">' + d["subject"] + " " + d["number"] + "</div>" +
                                    '<div class="row" style="text-align: center; margin-top: 5px; padding-top: 5px; margin-bottom: 5px; padding-bottom: 5px; border-top: dotted 1px black; border-bottom: dotted 1px black;">' +
                                    '<div class="col-xs-6">' +
                                       '<span style="font-size: 28px;">' + formatDecimal(d["avg_gpa"]) + '</span><br>' +
                                       '<span style="font-size: 14px;">' + "Average GPA" + '</span>' +
                                    '</div>' +
                                    '<div class="col-xs-6">' +
                                       '<span style="font-size: 28px;">' + d["sum_students"] + '</span><br>' +
                                       '<span style="font-size: 14px;">' + "Class Size" + '</span>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div style="text-align: center;">' +
                                    '<span style="font-size: 12px";</span>' + d["title"]
                                     + "</div>";

/*
                return d["Subject"] + " " + d["Course Number"] +
                       "\nAverage GPA : " + d["Average GPA"] +
                       "\nCredit Hours : " + d["Credit Hours"] +
                       "\nPercentage of As : " + d["% of 4s"];
                       */
              });

  svg.append("g").attr("transform", "translate(" + padding + "," + ( height) + ")")
                 .call(xAxis);
  /* .attr("transform", "translate(0," + height + ")")
  .call(d3.svg.axis().scale(x).orient("bottom").tickSize(-height)) */
  svg.append("g").attr("transform", "translate("+padding+",0)")
                .call(yAxis);

  svg.selectAll("circles")
   .data(data)
   .enter()
   .append("circle")
   .attr("cx", function(d) {
     return averageGPAScale(d["avg_gpa"]);
   })
   .attr("cy", function(d) {
     return courseNumberScale(d["number"]);
   })
   .attr("r", function(d) {
     return sizeScale(d["sum_students"])
   })
   .attr("fill", function(d){
     return color(d["avg_gpa"]/4)
   })
   .attr("transform", "translate("+padding+",0)")
   .style("opacity", .6)
   .on("mouseover", tip.show)
   .on("mouseout", tip.hide);

   svg.append("text")
               .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
               .attr("transform", "translate(0,"+((height)/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
               .text("Course Number");

   svg.append("text")
       .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
       .attr("transform", "translate("+ ((width + margin.left + margin.right + padding)/2) +"," + (height + padding ) + ")")  // centre below axis
       .text("Average GPA");

   svg.call(tip);

/*
   for (var option in subjects) {
     if (subjects.hasOwnProperty(option)) {
         var pair = subjects[option];
         var checkbox = document.createElement("input");
         checkbox.type = "checkbox";
         checkbox.name = pair;
         checkbox.value = pair;
         svg.append(checkbox);

         var label = document.createElement('label')
         label.htmlFor = pair;
         label.appendChild(document.createTextNode(pair));

         svg.append(label);
         sv.append(document.createElement("br"));
     }
   }
*/

/*
svg.selectAll("input")
.data(subjects)
.enter()
.append('label')
    .attr('for',function(d,i){ return 'a'+i; })
    .text(function(d) { return d; })
.append("input")
    .attr("checked", true)
    .attr("type", "checkbox")
    .attr("id", function(d,i) { return 'a'+i; })
    .attr("onClick", "change(this)");
    */
};
