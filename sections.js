let dataset, svg
let ratingSizeScale, ratingXScale, ratingYScale, categoryColorScale
let simulation, nodes
let categoryLegend, salaryLegend



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


    simulation  
        .force('charge', d3.forceManyBody().strength(20))
        .force('forceX', d3.forceX(d => regionXY[d.Region][0]+400))
        .force('forceY', d3.forceY(d => regionXY[d.Region][1]-50))
        .force('collide', d3.forceCollide(d => ratingSizeScale(d.Rating)-10))
        .alpha(0.7).alphaDecay(0.02).restart()

}


//Array of all the graph functions
//Will be called from the scroller functionality

let activationFunctions = [
    draw1,
    draw2,
    draw3
]

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
