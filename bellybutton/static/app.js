function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`

  // Use `.html("") to clear any existing metadata

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  d3.json(`/metadata/${sample}`).then(data => {
    var sample_metadata = d3.select("#sample-metadata");
    sample_metadata.html("");
    Object.entries(data).forEach(([key, value]) => {
      sample_metadata.append("h6").text(`${key} : ${value}`)
    });
  });

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  // @TODO: Build a Bubble Chart using the sample data

  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).

  d3.json(`samples/${sample}`).then(function (response) {

    var sample_ids = response.otu_ids;
    var sample_values = response.sample_values;
    var sample_labels = response.otu_labels;
    var trace = {
      x: sample_ids,
      y: sample_values,
      mode: "markers",
      marker: {
        size: response.sample_values,
        color: sample_ids
      },
      text: sample_labels
    };
    Plotly.newPlot("bubble", [trace]);

    var slicedValues = sample_values.slice(0, 10);
    var slicedLabels = sample_labels.slice(0, 10);
    var slicedIds = sample_ids.slice(0, 10);
    var pie_data = {
      values: slicedValues,
      labels: slicedIds,
      text: slicedLabels,
      type: "pie"
    };
    var layout = {
      showlegend: true,
      legend: { "orientation": "h" }
    }
    Plotly.newPlot("pie", [pie_data], layout);

  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
