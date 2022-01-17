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

    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter(object => object.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = filteredSamples[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    //     // Hint: Get the the top 10 otu_ids and map them in descending order  
    //     //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0, 10).map(ids => "OTU " + ids).reverse();
    console.log(yticks)
    //     // 8. Create the trace for the bar chart. 
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels,
        type: "bar",
        orientation: "h",
      }
    ];
    //     // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top Bacteria Found ",
      xaxis: { title: "Amount of Bacteria" },
      yaxis: { title: "Type of Bacteria" },
    };
    //     // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)


    // // Bar and Bubble charts
    // // Create the buildCharts function.
    // function buildCharts(sample) {
    //   // Use d3.json to load and retrieve the samples.json file 
    // d3.json("samples.json").then((data) => {


    //     // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
    // Plotly.newPlot("bar", barData, barLayout)

    //     // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Jet",

        }
      }
    ];

    //     // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria per Sample",
      showlegend: false,
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Bacteria Count" },
      hovermode: 'closest',
    };

    //     // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    // // Create the buildChart function.
    // function buildCharts(sample) {
    // //   // Use d3.json to load the samples.json file 
    //   d3.json("samples.json").then((data) => {
    //     console.log(data);

    // Create a variable that holds the samples array. 
    // let samples = data.samples
    // Create a variable that filters the samples for the object with the desired sample number.
    let sampleObject = samples.filter(sampleObj => sampleObj.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    let metadata = data.metadata;

    let metadataObject = metadata.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    let sampleResult = sampleObject[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    let metadataResult = metadataObject[0];
    // console.log(metadataResult);
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    // let otu_ids = result.otu_ids
    // let otu_labels = result.otu_labels
    // let sample_values = result.sample_values
    // 3. Create a variable that holds the washing frequency.
    var washFreq = metadataResult.wfreq;
      // console.log(washFreq),
    // Create the yticks for the bar chart.
    // yticks = otu_ids.slice(0, 10).map(ids => "OTU " + ids).reverse();
    // Use Plotly to plot the bar data and layout.
    // Plotly.newPlot();

    // // Use Plotly to plot the bubble data and layout.
    // Plotly.newPlot();


    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: washFreq,
        title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "black" },
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lime" },
            { range: [8, 10], color: "green" },
          ],
         
          }
        }
      
    ];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "white",
      font: { color: "black", family: "Arial" },
      text: "Washes per Week",
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
