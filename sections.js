let dataset, svg
let ratingSizeScale, ratingXScale, ratingYScale, categoryColorScale
let simulation, nodes
let categoryLegend, salaryLegend

// const categories = ['France', 'Italy', 'Australia', 'Argentina', 'Austria', 'Brazil', 'Bulgaria','Canada', 'Chile','China','Croatia', 'Georgia','Germany', 'Greece','Hungary','Israel', 'Lebanon', 'Moldova', 'New Zealand', 'Mexico', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'South Africa', 'Spain', 'Switzerland', 'Turkey', 'United States', 'Uruguay']

// Þriðja talan er bara avarage laun eftir útskrift, í okkar case væri það avarage rating eftir löndum eða verð

// const categoriesXY = {'France': [0, 400, 5, 23.9],
//                         'Italy': [0, 600, 43538, 48.3],
//                         'Australia': [0, 800, 41890, 50.9],
//                         'Argentina': [0, 200, 42200, 48.3],
//                         'Austria': [200, 400, 42745, 31.2],
//                         'Brazil': [200, 600, 36900, 40.5],
//                         'Bulgaria': [200, 600, 36900, 40.5],
//                         'Chile': [200, 800, 36342, 35.0],
//                         'Canada': [200, 600, 36900, 40.5],
//                         'China': [200, 600, 36900, 40.5],
//                         'Croatia': [200, 600, 36900, 40.5],
//                         'Germany': [200, 200, 33062, 60.4],
//                         'Georgia': [200, 600, 36900, 40.5],
//                         'Greece': [400, 400, 36825, 79.5],
//                         'Hungary': [200, 600, 36900, 40.5],
//                         'Israel': [200, 600, 36900, 40.5],
//                         'Lebanon': [400, 600, 37344, 55.4],
//                         'Moldova': [400, 800, 36421, 58.7],
//                         'New Zealand': [400, 200, 32350, 74.9],
//                         'Mexico': [600, 400, 31913, 63.2],
//                         'Portugal': [600, 600, 30100, 79.4],
//                         'Romania': [600, 800, 34500, 65.9],
//                         'Slovakia': [600, 800, 34500, 65.9],
//                         'Slovenia': [600, 800, 34500, 65.9],
//                         'South Africa': [600, 800, 34500, 65.9],
//                         'Spain': [600, 800, 34500, 65.9],
//                         'Switzerland': [600, 800, 34500, 65.9],
//                         'Turkey': [600, 800, 34500, 65.9],
//                         'United States': [600, 200, 35000, 77.1],
//                         'Uruguay': [600, 800, 34500, 65.9]}

// const margin = {left: 170, top: 50, bottom: 50, right: 20}
// const width = 1000 - margin.left - margin.right
// const height = 950 - margin.top - margin.bottom

const region = ['Europe', 'North America', 'South America', 'Africa', 'Asia', 'Oceania']


const regionXY = {'Europe': [0, 400, 4.2, 23.9],
                    'North America': [200, 400, 3.7, 48.3],
                    'South America': [400, 400, 3.8, 50.9],
                    'Africa': [0, 600, 4.5, 48.3],
                    'Asia': [200, 600, 4.0, 31.2],
                    'Oceania': [400, 600, 4.1, 40.5],
                    }

const margin = {left: 150, top: 50, bottom: 50, right: 50}
const width = 1000 - margin.left - margin.right
const height = 950 - margin.top - margin.bottom

//Read Data, convert numerical categories into floats
//Create the initial visualisation


d3.csv('data/red (1).csv', function(d){
    return {
        // Name: d.Name,
        Price: +d.AvgPrice,
        Region: d.Region,
        // countryCount: +d.country.length,
        // Region: d.Region,
        // Winery: +d.Winery,
        Rating: +d.AvgRating,
        AvgNrRatings: +d.AvgNrRatings,
        Country: d.Country,
        Age: +d.AvgAge, 
        

    };
}).then(data => {
    dataset = data
    console.log(dataset)
    createScales()
    setTimeout(drawInitial(), 100)
})



const colors = ['#ffcc00', '#ff6666', '#cc0066', '#66cccc', '#5a3b58', '#baf1a1', '#333333', '#75b79e',  '#66cccc', '#9de3d0', '#f1935c', '#0c7b93', '#eab0d9', '#baf1a1', '#9399ff','#d8a1f1', '#f1d8a1', '#DFFF00',"#FFBF00","#FF7F50","#DE3163","#9FE2BF",  ]

//Create all the scales and save to global variables

function createScales(){
    ratingSizeScale = d3.scaleLinear(d3.extent(dataset, d => d.Rating), [20, 30])
    ratingXScale = d3.scaleLinear(d3.extent(dataset, d => d.Rating), [margin.left, margin.left + width+2])
    ratingYScale = d3.scaleLinear([0, 5], [margin.top + height, margin.top])
    
    PriceXScale = d3.scaleLinear(d3.extent(dataset, d => d.Price), [margin.left, margin.left + width+250])
    PriceYScale = d3.scaleLinear(d3.extent(dataset, d => d.Price), [margin.top + height, margin.top])

    categoryColorScale = d3.scaleOrdinal(region, colors)
    RegionXScale = d3.scaleLinear(d3.extent(dataset, d => d.Region), [margin.left, margin.left + width])
    enrollRegiontScale = d3.scaleLinear(d3.extent(dataset, d => d.Price), [margin.left + 120, margin.left + width - 50])
    enrollRegiontSizeScale = d3.scaleLinear(d3.extent(dataset, d=> d.Price), [10,60])
    histXScale = d3.scaleLinear(d3.extent(dataset, d => d.Midpoint), [margin.left, margin.left + width])
    histYScale = d3.scaleLinear(d3.extent(dataset, d => d.HistCol), [margin.top + height, margin.top])
}

function createLegend(x, y){
    let svg = d3.select('#legend')

    svg.append('g')
        .attr('class', 'categoryLegend')
        .attr('transform', `translate(${x},${y})`)

    categoryLegend = d3.legendColor()
                            .shape('path', d3.symbol().type(d3.symbolCircle).size(150)())
                            .shapePadding(10)
                            .scale(categoryColorScale)
    
    d3.select('.categoryLegend')
        .call(categoryLegend)
}

function createSizeLegend(){
    let svg = d3.select('#legend2')
    svg.append('g')
        .attr('class', 'sizeLegend')
        .attr('transform', `translate(100,50)`)

    sizeLegend2 = d3.legendSize()
        .scale(ratingSizeScale)
        .shape('circle')
        .shapePadding(15)
        .title('Rating Scale')
        .labelFormat(d3.format(",.2r"))
        .cells(5)

    d3.select('.sizeLegend')
        .call(sizeLegend2)
}

function createSizeLegend2(){
    let svg = d3.select('#legend3')
    svg.append('g')
        .attr('class', 'sizeLegend2')
        .attr('transform', `translate(50,100)`)

    sizeLegend2 = d3.legendSize()
        .scale(enrollRegiontSizeScale)
        .shape('circle')
        .shapePadding(55)
        .orient('horizontal')
        .title('EnrolRegiont Scale')
        .labels(['1000', '200000', '400000'])
        .labelOffset(30)
        .cells(3)

    d3.select('.sizeLegend2')
        .call(sizeLegend2)
}

// All the initial eleRegionts should be create in the drawInitial function
// As they are required, their attributes can be modified
// They can be shown or hidden using their 'opacity' attribute
// Each eleRegiont should also have an associated class name for easy reference

// set the dimensions and margins of the graph
// var margin = {top: 10, right: 30, bottom: 30, left: 60},
//     width = 460 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
// function drawInitial(){
//     createSizeLegend()
//     createSizeLegend2()


// let svg = d3.select("#vis")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

// //Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv", function(data) {

//   // Add X axis
//   var x = d3.scaleLinear()
//     .domain([0, 4000])
//     .range([ 0, width ]);
//   svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x));

//   // Add Y axis
//   var y = d3.scaleLinear()
//     .domain([0, 500000])
//     .range([ height, 0]);
//   svg.append("g")
//     .call(d3.axisLeft(y));

//   // Add dots
//   svg.append('g')
//     .selectAll("dot")
//     .data(data)
//     .enter()
//     .append("circle")
//       .attr("cx", function (d) { return x(d.GrLivArea); } )
//       .attr("cy", function (d) { return y(d.SalePrice); } )
//       .attr("r", 1.5)
//       .style("fill", "#69b3a2")

// })

function drawInitial(){
    createSizeLegend()
    createSizeLegend2()

    let svg = d3.select("#vis")
                    .append('svg')
                    .attr('width', 1000)
                    .attr('height', 950)
                    .attr('opacity', 1)

    let xAxis = d3.axisBottom(ratingXScale)
                    .ticks(5)
                    .tickSize(height + 50)

    let xAxisGroup = svg.append('g')
        .attr('class', 'first-axis')
        .attr('transform', 'translate(0, 0)')
        .call(xAxis)
        .call(g => g.select('.domain')
            .remove())
        .call(g => g.selectAll('.tick line'))
            .attr('stroke-opacity', 0.2)
            .attr('stroke-dasharray', 5)

    // Instantiates the force simulation
    // Has no forces. Actual forces are added and removed as required

    simulation = d3.forceSimulation(dataset)

    //  Define each tick of simulation
    simulation.on('tick', () => {
        nodes
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
    })

    // Stop the simulation until later
    simulation.stop()

    // Selection of all the circles 
    nodes = svg
        .selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
            .attr('fill', 'purple')
            .attr('r', 7)
            .attr('cx', (d, i) => ratingXScale(d.Rating) + 5)
            .attr('cy', (d, i) => i * 5.2 + 30)
            .attr('opacity', 0.8)
        
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('circle')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)

    function mouseOver(d, i){

        console.log('hi')
        d3.select(this)
            .transition('mouseover').duration(100)
            .attr('opacity', 1)
            .attr('stroke-width', 5)
            .attr('stroke', 'black')
            
        d3.select('#tooltip')
            .style('left', (d3.event.pageX + 10)+ 'px')
            .style('top', (d3.event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .html(`<strong>Region:</strong> ${d.Region[0] + d.Region.slice(1,).toLowerCase()} 
                <br> <strong>Rating :</strong> ${d3.format(",.2r")(d.Rating)+'/5'} 
                <br> <strong>Country:</strong> ${d.Country}
                <br> <strong>Region:</strong> ${d.Region}
                <br> <strong>Age:</strong> ${d.Age}
                <br> <strong>Avg Price:</strong> ${d3.format(",.3r")(d.Price)}`+" euro")
    }
    
    function mouseOut(d, i){
        d3.select('#tooltip')
            .style('display', 'none')

        d3.select(this)
            .transition('mouseout').duration(100)
            .attr('opacity', 0.8)
            .attr('stroke-width', 0)
    }

    //Small text label for first graph
    // svg.selectAll('.small-text')
    //     .data(dataset)
    //     .enter()
    //     .append('text')
    //         .text((d, i) => d.Country)
    //         .attr('class', 'small-text')
    //         .attr('x', margin.left)
    //         .attr('y', (d, i) => i * 5.2 + 30)
    //         .attr('font-size', 20)
    //         .attr('text-anchor', 'end')
    
    //All the required components for the small multiples charts
    //Initialises the text and rectangles, and sets opacity to 0 
    svg.selectAll('.cat-rect')
        .data(region).enter()
        .append('rect')
            .attr('class', 'cat-rect')
            .attr('x', d => regionXY[d][0] + 120 + 1000)
            .attr('y', d => regionXY[d][1] + 30)
            .attr('width', 160)
            .attr('height', 30)
            .attr('opacity', 0)
            .attr('fill', 'grey')


    svg.selectAll('.lab-text')
        .data(region).enter()
        .append('text')
        .attr('class', 'lab-text')
        .attr('opacity', 0)
        .raise()

    svg.selectAll('.lab-text')
        .text(d => `Average: $${d3.format(",.2r")(regionXY[d][2])}`)
        .attr('x', d => regionXY[d][0] + 200 + 1000)
        .attr('y', d => regionXY[d][1] - 500)
        .attr('font-family', 'Domine')
        .attr('font-size', '12px')
        .attr('font-weight', 700)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')       

    svg.selectAll('.lab-text')
            .on('mouseover', function(d, i){
                d3.select(this)
                    .text(d)
            })
            .on('mouseout', function(d, i){
                d3.select(this)
                    .text(d => `Average rating: ${d3.format("")(regionXY[d][2])}`)
            })


    // Best fit line for gender scatter plot

    const bestFitLine = [{x: 0, y: 56093}, {x: 1, y: 25423}]
    const lineFunction = d3.line()
                            .x(d => PriceXScale(d.x))
                            .y(d => ratingYScale(d.y))

    // Axes for Scatter Plot
    svg.append('path')
        .transition('best-fit-line').duration(430)
            .attr('class', 'best-fit')
            .attr('d', lineFunction(bestFitLine))
            .attr('stroke', 'grey')
            .attr('stroke-dasharray', 6.2)
            .attr('opacity', 0)
            .attr('stroke-width', 3)

    let scatterxAxis = d3.axisBottom(PriceXScale)
    let scatteryAxis = d3.axisLeft(ratingYScale).tickSize([width])

    svg.append('g')
        .call(scatterxAxis)
        .attr('class', 'scatter-x')
        .attr('opacity', 0)
        .attr('transform', `translate(0, ${height + margin.top})`)
        .call(g => g.select('.domain')
            .remove())
    
    svg.append('g')
        .call(scatteryAxis)
        .attr('class', 'scatter-y')
        .attr('opacity', 0)
        .attr('transform', `translate(${margin.left - 20 + width}, 0)`)
        .call(g => g.select('.domain')
            .remove())
        .call(g => g.selectAll('.tick line'))
            .attr('stroke-opacity', 0.2)
            .attr('stroke-dasharray', 2.5)

    // Axes for Histogram 

    let histxAxis = d3.axisBottom(enrollRegiontScale)

    svg.append('g')
        .attr('class', 'enrolRegiont-axis')
        .attr('transform', 'translate(0, 700)')
        .attr('opacity', 0)
        .call(histxAxis)
}

//Cleaning Function
//Will hide all the eleRegionts which are not necessary for a given chart type 

function clean(chartType){
    let svg = d3.select('#vis').select('svg')
    if (chartType !== "isScatter") {
        svg.select('.scatter-x').transition().attr('opacity', 0)
        svg.select('.scatter-y').transition().attr('opacity', 0)
        svg.select('.best-fit').transition().duration(200).attr('opacity', 0)
    }
    if (chartType !== "isMultiples"){
        svg.selectAll('.lab-text').transition().attr('opacity', 0)
            .attr('x', 1800)
        svg.selectAll('.cat-rect').transition().attr('opacity', 0)
            .attr('x', 1800)
    }
    if (chartType !== "isFirst"){
        svg.select('.first-axis').transition().attr('opacity', 0)
        svg.selectAll('.small-text').transition().attr('opacity', 0)
            .attr('x', -200)
    }
    if (chartType !== "isHist"){
        svg.selectAll('.hist-axis').transition().attr('opacity', 0)
    }
    if (chartType !== "isBubble"){
        svg.select('.enrolRegiont-axis').transition().attr('opacity', 0)
    }
}

//First draw function

function draw1(){
    //Stop simulation
    simulation.stop()
    
    let svg = d3.select("#vis")
                    .select('svg')
                    .attr('width', 1000)
                    .attr('height', 950)
    
    clean('isFirst')

    d3.select('.categoryLegend').transition().remove()

    svg.select('.first-axis')
        .attr('opacity', 1)
    
    svg.selectAll('circle')
        .transition().duration(500).delay(100)
        .attr('fill', 'black')
        // .attr('r', 15)
        .attr('cx', (d, i) => ratingXScale(d.Rating))
        .attr('cy', (d, i) => PriceXScale(d.Price))

    svg.selectAll('.small-text').transition()
        .attr('opacity', 1)
        .attr('x', margin.left)
        .attr('y', (d, i) => i * 5.2 + 30)
}


function draw2(){
    let svg = d3.select("#vis").select('svg')
    
    clean('none')

    svg.selectAll('circle')
        .transition().duration(300).delay((d, i) => i * 5)
        .attr('r', d => ratingSizeScale(d.Rating) * 0.5)
        .attr('fill', d => categoryColorScale(d.Region))

    simulation  
        .force('charge', d3.forceManyBody().strength(20))
        .force('forceX', d3.forceX(d => regionXY[d.Region][0]+400))
        .force('forceY', d3.forceY(d => regionXY[d.Region][1]-50))
        .force('collide', d3.forceCollide(d => ratingSizeScale(d.Rating)-10))
        .alphaDecay([0.02])


    simulation.alpha(0.9).restart()
    
    createLegend(20, 50)
}

function draw3(){
    let svg = d3.select("#vis").select('svg')
    clean('isMultiples')
    
    svg.selectAll('circle')
        .transition().duration(400).delay((d, i) => i * 5)
        .attr('r', d => ratingSizeScale(d.Rating) * 0.5)
        .attr('fill', d => categoryColorScale(d.Region))

    // svg.selectAll('.cat-rect').transition().duration(300).delay((d, i) => i * 30)
    //     .attr('opacity', 0.2)
    //     .attr('x', d => regionXY[d][0] + 120)
        
    svg.selectAll('.lab-text').transition().duration(300).delay((d, i) => i * 30)
        .text(d => `Average rating: $${d3.format(",.2r")(regionXY[d][2])}`)
        .attr('x', d => regionXY[d][0] + 400)   
        .attr('y', d => regionXY[d][1] + 50)
        .attr('opacity', 1)

    svg.selectAll('.lab-text')
        .on('mouseover', function(d, i){
            d3.select(this)
                .text(d)
        })
        .on('mouseout', function(d, i){
            d3.select(this)
                .text(d => `Average rating: $${d3.format(",.2r")(regionXY[d][2])}`)
        })

    // simulation  
    //     .force('charge', d3.forceManyBody().strength([2]))
    //     .force('forceX', d3.forceX(d => regionXY[0] + 200))
    //     .force('forceY', d3.forceY(d => regionXY[1] - 50))
    //     .force('collide', d3.forceCollide(d => ratingSizeScale(d.Rating) + 4))
    //     .alpha(0.7).alphaDecay(0.02).restart()
    simulation  
        .force('charge', d3.forceManyBody().strength(20))
        .force('forceX', d3.forceX(d => regionXY[d.Region][0]+400))
        .force('forceY', d3.forceY(d => regionXY[d.Region][1]-50))
        .force('collide', d3.forceCollide(d => ratingSizeScale(d.Rating)-10))
        .alpha(0.7).alphaDecay(0.02).restart()

}

// function draw5(){
    
//     let svg = d3.select('#vis').select('svg')
//     clean('isMultiples')

//     simulation
//         .force('forceX', d3.forceX(d => regionXY[d.Region][0] + 200))
//         .force('forceY', d3.forceY(d => regionXY[d.Region][1] - 50))
//         .force('collide', d3.forceCollide(d => ratingSizeScale(d.Rating) + 4))

//     simulation.alpha(1).restart()
   
//     svg.selectAll('.lab-text').transition().duration(300).delay((d, i) => i * 30)
//         .text(d => `% Female: ${(regionXY[d][3])}%`)
//         .attr('x', d => regionXY[d][0] + 200)   
//         .attr('y', d => regionXY[d][1] + 50)
//         .attr('opacity', 1)
    
//     svg.selectAll('.lab-text')
//         .on('mouseover', function(d, i){
//             d3.select(this)
//                 .text(d)
//         })
//         .on('mouseout', function(d, i){
//             d3.select(this)
//                 .text(d => `% Female: ${(regionXY[d][3])}%`)
//         })
   
//     svg.selectAll('.cat-rect').transition().duration(300).delay((d, i) => i * 30)
//         .attr('opacity', 0.2)
//         .attr('x', d => regionXY[d][0] + 120)

//     svg.selectAll('circle')
//         .transition().duration(400).delay((d, i) => i * 4)
//             .attr('fill', colorByGender)
//             .attr('r', d => ratingSizeScale(d.Rating))

// }

// function colorByGender(d, i){
//     if (d.Region < 0.4){
//         return 'blue'
//     } else if (d.Region > 0.6) {
//         return 'red'
//     } else {
//         return 'grey'
//     }
// }

// function draw6(){
//     simulation.stop()
    
//     let svg = d3.select("#vis").select("svg")
//     clean('isScatter')

//     svg.selectAll('.scatter-x').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)
//     svg.selectAll('.scatter-y').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)

//     svg.selectAll('circle')
//         .transition().duration(800).ease(d3.easeBack)
//         .attr('cx', d => RegionXScale(d.Region))
//         .attr('cy', d => ratingYScale(d.Rating))
    
//     svg.selectAll('circle').transition(1600)
//         .attr('fill', colorByGender)
//         .attr('r', 5)

//     svg.select('.best-fit').transition().duration(300)
//         .attr('opacity', 0.5)
   
// }

// function draw7(){
//     let svg = d3.select('#vis').select('svg')

//     clean('isBubble')

//     simulation
//         .force('forceX', d3.forceX(d => enrollRegiontScale(d.AvgPrice)))
//         .force('forceY', d3.forceY(500))
//         .force('collide', d3.forceCollide(d => enrollRegiontSizeScale(d.AvgPrice) + 2))
//         .alpha(0.8).alphaDecay(0.05).restart()

//     svg.selectAll('circle')
//         .transition().duration(300).delay((d, i) => i * 4)
//         .attr('r', d => enrollRegiontSizeScale(d.AvgPrice))
//         .attr('fill', d => categoryColorScale(d.Region))

//     //Show enrolRegiont axis (remember to include domain)
//     svg.select('.enrolRegiont-axis').attr('opacity', 0.5).selectAll('.domain').attr('opacity', 1)

// }

// function draw4(){
//     let svg = d3.select('#vis').select('svg')

//     clean('isHist')

//     simulation.stop()

//     svg.selectAll('circle')
//         .transition().duration(600).delay((d, i) => i * 2).ease(d3.easeBack)
//             .attr('r', 10)
//             .attr('cx', d => histXScale(d.Midpoint))
//             .attr('cy', d => histYScale(d.HistCol))
//             .attr('fill', d => categoryColorScale(d.Region))

//     let xAxis = d3.axisBottom(histXScale)
//     svg.append('g')
//         .attr('class', 'hist-axis')
//         .attr('transform', `translate(0, ${height + margin.top + 10})`)
//         .call(xAxis)

//     svg.selectAll('.lab-text')
//         .on('mouseout', )
// }

// function draw8(){
//     clean('none')

//     let svg = d3.select('#vis').select('svg')
//     svg.selectAll('circle')
//         .transition()
//         .attr('r', d => ratingSizeScale(d.Rating) * 1.3)
//         .attr('fill', d => categoryColorScale(d.Region))

//     simulation 
//         .force('forceX', d3.forceX(500))
//         .force('forceY', d3.forceY(500))
//         .force('collide', d3.forceCollide(d => ratingSizeScale(d.Rating) * 1.6 + 4))
//         .alpha(0.6).alphaDecay(0.05).restart()
        
// }

//Array of all the graph functions
//Will be called from the scroller functionality

let activationFunctions = [
    draw1,
    draw2,
    draw3
]
    // draw4,
    // draw5, 
    // draw6, 
    // draw7,
    // draw8
//All the scrolling function
//Will draw a new graph based on the index provided by the scroll


let scroll = scroller()
    .container(d3.select('#graphic'))
scroll()

let lastIndex, activeIndex = 0

scroll.on('active', function(index){
    d3.selectAll('.step')
        .transition().duration(500)
        .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});
    
    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1; 
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(i => {
        activationFunctions[i]();
    })
    lastIndex = activeIndex;

})

scroll.on('progress', function(index, progress){
    if (index == 2 & progress > 0.7){

    }
})