const  url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Build the metadata panel
function buildMetadata(sample) {
  d3.json(url).then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filteredMetadata = metadata.filter(row => row.id == sample)[0]; 
    console.log(filteredMetadata);

    // Use d3 to select the panel with id of `#sample-metadata`
    //info for panel id is in the json 
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    let keysData = Object.keys(filteredMetadata);
    for (let i = 0; i < keysData.length; i++) {
      
      let key = keysData[i]; 
      let value = filteredMetadata[key];

      // add to html
      //Making key values uppercase to match example

      panel.append("p").text(`${key.toUpperCase()}: ${value}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json(url).then((data) => {

    // Get the samples field

    let samples = data.samples; 

    // Filter the samples for the object with the desired sample number

    let sampleData = samples.filter(row => row.id == sample)[0]; 

    //checking to see if the correct sampleData will show in the console
    console.log(sampleData);

    // Get the otu_ids, otu_labels, and sample_values

    let otu_ids = sampleData.otu_ids;
    let otu_labels = sampleData.otu_labels;
    let sample_values = sampleData.sample_values;
    
    // Build a Bubble Chart
    //canva instructions tells me what to fill in for x, y, text, etc 

    let trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        colorscale: 'Portland',
        size: sample_values
      }
    };
    
    let traces = [trace];
    
    let layout = {
      title: {
        text: 'Bacteria Cultures Per Sample'
      },

      yaxis: {
        title: {
          text: "Number of Bacteria"
        }
      },

      xaxis: {
        title: {
          text: "OTU ID"
        }
      },
      height: 600
    };
    
    // Render the Bubble Chart
    //Note from index html this is called bubble

    Plotly.newPlot('bubble', traces, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks

   let top_otu_ids = otu_ids.slice(0, 10);
   let top_sample_values = sample_values.slice(0, 10);
   let top_otu_labels = otu_labels.slice(0, 10);
   let yvalues = top_otu_ids.map(x => `OTU ${x} `);

    let bartrace = {
      y: yvalues,
      x: top_sample_values,
      hovertext: top_otu_labels,
      type: 'bar',
      marker: {
        color: 'rgb(115, 39, 157)'
      },
      orientation: 'h'
    }

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately

    let bartraces = [bartrace];

    let barlayout = {
      title: {
        text: `Top 10 Bacteria Cultures Found`
      },

      yaxis: {
        autorange: 'reversed',
        dtick: 1,
      },

      xaxis: {
        title: {
          text: 'Number of Bacteria'
        }
      },
      height: 600
    };

    // Render the Bar Chart

    Plotly.newPlot('bar', bartraces, barlayout);

  });
}

// Function to run on page load
//Note to start here since this is the init function that runs on page load
function init() {
  d3.json(url).then((data) => {

    // Get the names field
    let namesID = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    console.log(namesID);

    for (let i = 0; i < namesID.length; i++) {
      let ID = namesID[i];

      // Create option
      dropdown.append("option").text(ID).property("value", ID);
    }


    // Get the first sample from the list
    let first_sample = namesID[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(first_sample);
    buildCharts(first_sample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
