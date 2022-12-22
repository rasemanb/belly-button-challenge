const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"


function init() {d3.json(url).then(function(data){
    console.log(data);

    let menu = d3.select("#selDataset");
    let names = data.samples.map(n => n.id);
    names.forEach(function(name) {

        menu.append("option").text(name);
        
    });

    let vals = data.samples.map(v => v.sample_values).sort((a,b) => a - b);
    let id = data.samples.map(i => i.otu_ids).sort((a,b) => a - b);
    let labs = data.samples.map(l => l.otu_labels).sort((a,b) => a - b);

    let slicedVals = vals.map(sv => sv.slice(0,10));
    let slicedId = id.map(si => si.slice(0,10));
    let formattedId = slicedId[0].map(i => "OTU" + i)
    let slicedLabs = labs.map(sl => sl.slice(0,10));

    let topTenTrace = {
        x: slicedVals[0],
        y: formattedId,
        type: "bar",
        text: slicedLabs,
        orientation: "h",
    };

    let layout = {
        title: `Top 10 OTU's Found`
    }

    let bubTrace = {
        x: id[0],
        y: vals[0],
        labels: labs[0],
        mode: "markers",
        marker: {
            size: vals[0],
            color: id[0]
        }
       
    };

    let layout2 = {
        title: "Bubble Chart",
        margin: {
            l: 200,
            r: 75,
            b: 75,
            t: 75,
            pad: 6
        }
    };

    let config = {responsive:true}

    Plotly.newPlot('bar', [topTenTrace], layout,config)
    Plotly.newPlot('bubble',[bubTrace], layout2, config )

    let display1 = data.metadata[0];
    let md = d3.select("#sample-metadata").selectAll("h1");

    let meta = md.data(d3.entries(display1))
    
    meta.enter().append("h1").merge(meta).text(d => `${d.key} : ${d.value}`).style("font-size", "100%");
});
};

function plotUpdate(id) {
    d3.json(url).then(function(data){
        console.log(data);

        let newDat = data.samples.filter(n => n.id === id);
        let newVals = newDat.map(n => n.sample_values).sort((a,b) => a - b);
        let newId = newDat.map(n => n.otu_ids).sort((a,b) => a - b);
        let newLabs = newDat.map(n => n.otu_labels).sort((a,b) => a - b);

        let sortedNewVals = newVals.map(n => n.slice(0,10));
        let sortedNewId = newId.map(n => n.slice(0,10));
        let formattedId = sortedNewId[0].map(n => "OTU" + n);
        let sortedNewLabs = newLabs.map(n => n.slice(0,10));

        let bubx = newDat.map(n => n.otu_ids)[0];
        let buby = newDat.map(n => n.sample_values)[0];
        let bubLabs = newDat.map(n => n.otu_labels)[0];

        let md = d3.select("#sample-metadata").selectAll("h1");
        let display1 = data.metadata.filter(n => n.id === +id)[0];
        let meta = md.data(d3.entries(display1));

        meta.enter().append("h1").merge(meta).text(d => `${d.key} : ${d.value}`).style("font-size", "100%");

        let config = {
            responsive:true
        }

        let barTrace = {

            x: sortedNewVals[0],
            y: formattedId,
            text: sortedNewLabs[0],
            type: "bar",
            orientation: "h"
        }

        let barLay = {
            title: "Top 10 OTU's Found"
        }

        Plotly.newPlot("bar", [barTrace], barLay, config)

        let bubTrace = {

            x: bubx,
            y: buby,
            text: bubLabs,
            mode: "markers",
            marker: {
                size: buby,
                color: bubx
            }

        }

        let bubLay = {
            title: "Bubble Chart",
            margin: {
                l: 100,
                r: 50,
                b: 50,
                t: 50,
                pad: 3
            }
        }


        Plotly.newPlot("bubble", [bubTrace], bubLay, config);
    })
}

function optionChanged(id) {
    plotUpdate(id)
    }

init();
