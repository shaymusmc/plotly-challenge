// Thanks to classmate Dagney, when heading in the wrong coding direction and sharing code advice
// Inspiration found on https://com2m.de/blog/technology/gauge-charts-with-plotly/,
// And from github users hunterracheld & SabaTass

// Use D3 to read the JSON file
    d3.json("data/samples.json").then((data) => {
        window.data = data;
        console.log(data);
        var data = data;
    
        // Add ID numbers to dropdown menu
        var dropDown = data.names;
        for (var i = 0; i < dropDown.length; i++) {
        selectBox = d3.select("#selDataset");
        selectBox.append("option").text(dropDown[i]);
        }
    
        // Set the initial plot to first Subject ID
        updatePlots(0)
    
        // Function for updating plots   
        function updatePlots(index) {
    
            // Setup arrays for bar chart
            var sampleOTU = data.samples[index].otu_ids;
            var sampleFreq = data.samples[index].sample_values;
            var otuLabels = data.samples[index].otu_labels;

            // Capture Wash Frequency
            var washFrequency = data.metadata[+index].wfreq;
    
            // Gather Demographic Data
            var demoKeys = Object.keys(data.metadata[index]);
            var demoValues = Object.values(data.metadata[index])
            var demoData = d3.select('#sample-metadata');

            // Clear Demo Data
            demoData.html("");

            for (var i = 0; i < demoKeys.length; i++) {
                demoData.append("p").text(`${demoKeys[i]}: ${demoValues[i]}`);
            };


            // Slice then reverse data for bar chart
            var topOTUS = sampleOTU.slice(0, 10).reverse();
            var topFreq = sampleFreq.slice(0, 10).reverse();
            var topLabels = topOTUS.map((otu => "OTU " + otu));
            var reversedLabels = topLabels.reverse();

            // Bar Chart
            // Establish Trace1 for bar chart
            var trace1 = {
                x: topFreq,
                y: reversedLabels,
                type: "bar",
                orientation: "h"
            };

            var barData = [trace1];

            var layout = {
                title: "Top 10 OTUs",
                xaxis: {title: "Count"},
                yaxis: {title: "OTU ID"},
            };

            // Plot Bar Chart
            Plotly.newPlot("bar", barData, layout);

            // Bubble Chart
            // Establish Trace 2 for bubble chart
            trace2 = {
                x: sampleOTU,
                y: sampleFreq,
                text: otuLabels,
                mode: 'markers',
                marker: {
                    color: sampleOTU,
                    opacity: [1, 0.8, 0.6, 0.4],
                    size: sampleFreq
                }
            }

            var bubbleData = [trace2];

            var layout = {
                title: 'OTU Frequency',
                showlegend: false,
                height: 500,
                width: 1000
            }

            // Plot Bubble chart
            Plotly.newPlot("bubble", bubbleData, layout)

            // Gauge chart
            // Establish Trace 3 for gauge chart
            var trace3 = [{
                domain: {x: [0, 1], y: [0,1]},
                type: "indicator",
                mode: "gauge+number",
                value: washFrequency,
                title: {text: "Belly Button Washing Frequency: Weekly Scrubs"},
                gauge: {
                    axis: {range: [0, 9], tickwidth: 1, tickcolor: "black"},
                    bar: {color: "darkred"},
                    bgcolor: "white",
                    bordercolor: "transparent",
                    steps: [
                    { range: [0, 1], color: "rgba(250, 250, 250, .5)" },
                    { range: [1, 2], color: "rgba(245, 245, 220, .5)" },
                    { range: [2, 3], color: "rgba(232, 226, 202, .5)" },
                    { range: [3, 4], color: "rgba(220, 216, 185, .5)" },
                    { range: [4, 5], color: "rgba(210, 206, 145, .5)" },
                    { range: [5, 6], color: "rgba(202, 209, 95, .5)" },
                    { range: [6, 7], color: "rgba(170, 202, 42, .5)" },
                    { range: [7, 8], color: "rgba(110, 154, 22, .5)" },
                    { range: [8, 9], color: "rgba(14, 127, 0, .5)" }

                    ],
                }
            }];

            gaugeData = trace3;

            var layout = {
                width: 600,
                height: 500,
                margin: { t: 0, b: 0 }
            };

            // Plot gauge
            Plotly.newPlot("gauge", gaugeData, layout);

        }

        // On button click, call refreshData()
        d3.selectAll("#selDataset").on("change", refreshData);


        // Function to refresh data
        function refreshData() {
            var newDropDownMenu = d3.select("#selDataset");
            // Assign the value of the dropdown menu option to a variable
            var newUser = newDropDownMenu.property("value");
            // Initialize an empty array for the person's data
                for (var i = 0; i < data.names.length; i++) {
                    if (newUser === data.names[i]) {
                        updatePlots(i);
                        return
                }
            }
        }

        });