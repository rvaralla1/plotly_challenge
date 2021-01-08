function init() {
    var dropdownMenu = d3.select("#selDataset")};

    d3.json("samples.json").then((data) => {
        var names = data.names;
        names.forEach((sample) => {
            dropdownMenu.append("option")
                .text(sample)
                .property("value", sample);

        });

        var firstDisplay = names[0];
        build_barchart(firstDisplay);
        build_bubble(firstDisplay);
        build_meta(firstDisplay);
    });
}

function optionChanged(new_name) {
    build_barchart(new_name);
    build_bubble(new_name);
    build_meta(new_name);
}

function build_barchart (sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var tinyJSON = samples.filter(sampleID => sampleID.id == sample);
        var object = tinyJSON[0];

        var otu_ids = object.otu_ids;
        var otu_labels = object.otu_labels;
        var sample_values = object.sample_values;

        var BAR_layout = {
            title: "Top 10 Bacterial Cultures in this Belly Button",
            margin: {t:50, l:150}
        };

        var BAR_tracel = [
            {
                y: otu_ids.slice(0, 10).map(otuID => `OTU ID: ${otuID}`).reverse(),
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"
            }
        ];

        Plotly.newPlot("bar", BAR_tracel, BAR_layout);

    });
}

function build_bubble(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var tinyJSON = samples.filter(sampleID => sampleID.id == sample);
        var object = tinyJSON[0];

        var otu_ids = object.otu.otu_ids;
        var otu_labels = object.otu_labels;
        var sample_values = object.sample_values;

        var bubble_layout = {
            title: "Occurance of OTU's",
            showlegend: false,
            height: 500,
            width: 1200
        };

        var bubble_trace1 = [
            {
                y: sample_values,
                x: otu_ids,
                text: otu_labels,
                mode: 'markers',
                marker: {
                    color: otu_ids,
                    size: sample_values
                }
            }
        ];

        Plotyly.newPlot("bubble", bubble_trace1, bubble_layout);

    });
}

function build_meta(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var tinyJSON2 = metadata.filter(sampleID => sampleID.id == sample);
        var object2 = tinyJSON2[0];

        var Display = d3.select("sample-metadata");

        Display.html("");

        Object.defineProperties(object2).forEach(({key, value]) => {
            Display.append("p").text(`${key}:${value}`);

        });
    });
}

init()