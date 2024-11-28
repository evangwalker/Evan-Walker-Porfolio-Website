import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 800,
      height = 400,
      barWidth = width / 275;

const tooltip = d3
  .select('.graph')
  .append('div')
  .attr('id', 'tooltip')
  .attr("x", 100).attr("y", 100);

d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json")
   .then((data) => {
  const gdp = data.data.map(function (item) {
    return item[1];
  });

  
  const max_gdp = d3.max(gdp)
  
  const yearsDate = data.data.map(function (item) {
      return new Date(item[0]);
    });

  const xMax = new Date(d3.max(yearsDate));
  xMax.setMonth(xMax.getMonth() + 3);

  const xScale = d3
      .scaleTime()
      .domain([d3.min(yearsDate), xMax])
      .range([0, width]);

  const xAxis = d3.axisBottom().scale(xScale);
  
  const linearScale = d3.scaleLinear().domain([0, max_gdp]).range([0, height]);

  const scaled_gdp = gdp.map(x => linearScale(x)) ;

  const yAxisScale = d3.scaleLinear().domain([0, max_gdp]).range([height, 0]);

  const yAxis = d3.axisLeft(yAxisScale);
  
  const svg = d3.select(".graph")
                .append("svg")
                .attr("width", width + 50)
                .attr("height", height + 50)
                
  svg.append('g')
     .call(yAxis)
     .attr("id", "y-axis")
     .attr('transform', 'translate(40, 0)');
  
  svg.append('g')
     .call(xAxis)
     .attr('id', 'x-axis')
     .attr('transform', 'translate(60, 400)');
  
  svg.selectAll("rect")
     .data(scaled_gdp)
     .enter()
     .append("rect")
     .attr("width", width/data.data.length)
     .attr("height", (d, i) => d)
     .attr("fill", "navy")
     .attr("x", (d, i) => barWidth*i + 40)
     .attr("class", "bar")
     .attr("y", (d, i) => height - d)
     .attr('data-date', function (d, i) {
        return data.data[i][0];
      })
     .attr('data-gdp', function (d, i) {
        return data.data[i][1];
      })
     .on("mouseover", function(event, d) {
       const i = this.getAttribute('index');
       d3.select(this).transition()
         .duration(0)
         .attr("fill", "red");
      
     // tooltip.transition().duration(100);
        tooltip
             //.attr('data-date', data.data[i][0])
             .style("visibility", "visible")
             .text(d);
      })
     .on("mouseout", function(event, d) {
        d3.select(this).transition()
          .duration(0)
          .attr("fill", "navy");
    
        tooltip.style("visibility", "hidden")
  })
 }) 