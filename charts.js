function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array. 
    let sampleArray = data.samples;
    console.log(sampleArray);
 
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let choosenArray = sampleArray.filter(choosen => choosen.id == sample);
    console.log(choosenArray);

    //4. (gaguge)
    let metaArray = data.metadata.filter(chartObj => chartObj.id == sample);
    console.log(metaArray)

    //5. Create a variable that holds the first sample in the array 
    //(bar)
    let dataset = choosenArray[0]
    console.log(dataset);

    //5. (gauge)
    let gResults = metaArray[0]
    console.log(gResults);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    //bar
    let otuIds = dataset.otu_ids
    console.log(otuIds)

    let otuLabels = dataset.otu_labels
    console.log(otuLabels)

    let sampleValues = dataset.sample_values
    console.log(sampleValues);

  // 3. (gauge) Create a variable that holds the washing frequency.
    let washFq = Math.round(gResults.wfreq);
    console.log(washFq);


////////Bar Chart/////////

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    let yticks = otuIds.slice(0, 10).map(otuIds => `OTU ${otuIds}`).reverse();
       console.log(yticks);
    
    // 8. Create the trace for the bar chart. 
      var barData = {
          x: sampleValues.slice(0,10).reverse(),
          y: yticks,
          type: "bar",
          orientation:'h',
          marker: {
            color: '#37c1ba'
          }
        };
    
  //  // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: "Top 10 Bacterial Cultures Found",
        pad: t = 25,
        margin: { t: 80, l: 150}, 
        hovertext: otuLabels,
        font:{
          family: 'Verdana',
          color: "#e8a45b",
          size: 16
        }
      };

  //  // 10. Use Plotly to plot the data with the layout. 
  Plotly.newPlot("bar", [barData], barLayout);

  ////////Bubble Chart/////////

      // 1. Create the trace for the bubble chart.
      var bubbleData = [{
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: { 
          color: otuIds,
          size: sampleValues,
        } 
      }
    ];
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
      
        xaxis: {title: "OTU ID"},
        hovertext: otuLabels,
        hovermode: "closest",
        margin: { t: 75},    
        font:{
          family: 'Verdana',
          color: "#e8a45b",
          size: 18
        },
      };

    // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

///////Gauge/////////
let gPlot = [{
  domain: { x: [0, 1], y: [0, 1] },
  type: "indicator",
  mode: "gauge+number",
  value: washFq,
  title: {
    text: '<em>Belly Button Washing Frequency</em><br>Scrubs per week',
  },
  gauge: {
    axis: {range: [null, 10]},
    bar: {color: "white"},
    
    steps: [
      {range: [0, 2], color: "#EF476F"},
      {range: [2, 4], color: "#FFB703"},
      {range: [4, 6], color: "#FFEB66"},
      {range: [6, 8], color: "#9FFFCB"},
      {range: [8, 10], color: "#37c1ba"}
    ]
  }
}];
// 5. Create the layout for the gauge chart.
var gLayout = { 
 width: 450,
 height: 450,
 font:{
  family: 'Verdana',
  color: "#e8a45b",
  size: 24
},
};
// 6. Use Plotly to plot the gauge data and layout.
Plotly.newPlot("gauge", gPlot, gLayout);
});
};