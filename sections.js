// A lot of sources for this and the code is all over the place:
// Here is a list of the many sources:
// https://bl.ocks.org/FrissAnalytics/b121a8095cd4cee898fe6b9b54a83e1f
// https://vallandingham.me/scroller.html
// https://github.com/visualizedata/major-studio-1/tree/main/lab09_ui/scrollytelling




const region = ['Europe', 'North America', 'South America', 'Africa', 'Asia', 'Oceania']

const regionBubble = {'Europe': [0, 400, 3.86, 23.9],
                    'North America': [200, 400, 3.55, 48.3],
                    'South America': [400, 400, 3.70, 50.9],
                    'Africa': [0, 600, 4.01, 48.3],
                    'Asia': [200, 600, 3.50, 31.2],
                    'Oceania': [400, 600, 3.80, 40.5],
                    }

const margin = {left: 150, top: 50, bottom: 50, right: 50}
const width = 1000 - margin.left - margin.right
const height = 950 - margin.top - margin.bottom



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
        HistColumn: +d.HistColumn,
        HistX: d.HistX
        

    };
}).then(data => {
    dataset = data
    console.log(dataset)
    preLoad()
    setTimeout(drawInitial(), 100)
})


//Create all the scales and save to global variables

function preLoad(){
    ratingSizeScale = d3.scaleLinear(d3.extent(dataset, d => d.Rating), [25, 50])
    ratingXScale = d3.scaleLinear(d3.extent(dataset, d => d.Rating), [margin.left, margin.left + width+2])
    ratingYScale = d3.scaleLinear([0, 5], [margin.top + height, margin.top])
    PriceXScale = d3.scaleLinear(d3.extent(dataset, d => d.Price), [margin.left, margin.left + width+250])
    PriceYScale = d3.scaleLinear(d3.extent(dataset, d => d.Price), [margin.top + height, margin.top])
    categoryColorScale = d3.scaleOrdinal(region, colors)
    RegionXScale = d3.scaleLinear(d3.extent(dataset, d => d.Region), [margin.left, margin.left + width])
    histXScale = d3.scaleLinear(d3.extent(dataset, d => d.HistX), [margin.left, margin.left + width])
    histYScale = d3.scaleLinear(d3.extent(dataset, d => d.HistColumn), [margin.top + height, margin.top])

}

const colors = ['#9B7479', '#584718', '#325818', '#185835', '#184458', '#231858', '#581856','#ffcc00', '#ff6666', '#cc0066', '#66cccc', '#5a3b58', '#baf1a1', '#333333', '#75b79e',  '#66cccc', '#9de3d0', '#f1935c', '#0c7b93', '#eab0d9', '#baf1a1', '#9399ff','#d8a1f1', '#f1d8a1', '#DFFF00',"#FFBF00","#FF7F50","#DE3163","#9FE2BF",  ]


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
        .attr('margin', '10%')

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




function drawInitial(){
    
    createSizeLegend()


    let svg = d3.select("#vis")
                    .append('svg')
                    .attr('width', 1000)
                    .attr('height', 950)
                    .attr('opacity', 1)

    simulation = d3.forceSimulation(dataset)

    simulation.on('tick', () => {
        nodes
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
    })

    let xAxis = d3.axisBottom(ratingXScale)
    .ticks(2)
    .tickSize(height + 35)

let xAxisGroup = svg.append('g')
.attr('class', 'first-axis')
.attr('transform', 'translate(0, 0)')
.call(xAxis)
.call(g => g.select('.domain')
.remove())
.call(g => g.selectAll('.tick line'))
.attr('stroke-opacity', 0.2)
.attr('stroke-dasharray', 5)

    simulation.stop()

    nodes = svg
        .selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
            .attr('fill', 'purple')
            .attr('r', 10)
            .attr('cx', (d, i) => ratingXScale(d.Rating) )
            .attr('cy', (d, i) => i * 28 + 30)
            .attr('opacity', 0.8)
        
//  Tooltip
    svg.selectAll('circle')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)

    function mouseOver(d, i){
        d3.select('#tooltip')
            .style('left', (d3.event.pageX + 10)+ 'px')
            .style('top', (d3.event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .html(`Country: ${d.Country}
                <br> Region: ${d.Region} 
                <br> Rating : ${d3.format(",.2r")(d.Rating)+'/5'} 
                <br> Average Age: ${d3.format(",.2r")(d.Age) * -1} years
                <br> Avg Price: ${d3.format(",.3r")(d.Price)}`+" euro")
    }
    
    function mouseOut(d, i){
        d3.select('#tooltip')
            .style('display', 'none')


    }

    // Small text label for first graph
    svg.selectAll('.small-text')
        .data(dataset)
        .enter()
        .append('text')
            .text((d, i) => d.Country)
            .attr('class', 'small-text')
            .attr('x', margin.left - 20)
            .attr('y', (d, i) => i * 28 + 30)
            .attr('font-size', 20)
            .attr('text-anchor', 'end')
    
    //All the required components for the small multiples charts
    //Initialises the text and rectangles, and sets opacity to 0 



    svg.selectAll('.lab-text')
        .data(region).enter()
        .append('text')
        .attr('class', 'lab-text')
        .attr('opacity', 0)
        .raise()
        .text(d => `Rating: ${(regionBubble[d][2])}`)
        .attr('x', d => regionBubble[d][0] + 200 + 1000)
        .attr('y', d => regionBubble[d][1] - 500)
        .attr('font-family', 'Futura')
        .attr('font-size', '20px')
        .attr('font-weight', 900)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')       



}

//This will remove the visualizations when it's their turn

function remove(chartType){
    let svg = d3.select('#vis').select('svg')

    if (chartType !== "bubbles"){
        svg.selectAll('.lab-text').transition().attr('opacity', 0)
            .attr('x', 1800)
        svg.selectAll('.cat-rect').transition().attr('opacity', 0)
            .attr('x', 1800)
    }
    if (chartType !== "first"){
        svg.select('.first-axis').transition().attr('opacity', 0)
        svg.selectAll('.small-text').transition().attr('opacity', 0)
            .attr('x', -200)
    }
    if (chartType !== "histogram"){
        svg.selectAll('.hist-axis').transition().attr('opacity', 0)
    }
 
}


//First draw function

function scatter(){
    //Stop simulation
    simulation.stop()
    
    let svg = d3.select("#vis")
                    .select('svg')
                    .attr('width', 1000)
                    .attr('height', 950)
    
    remove('first')


    d3.select('.categoryLegend').transition().remove()

    svg.select('.first-axis')
        .attr('opacity', 1)
    
    svg.selectAll('circle')
        .transition().duration(500).delay(100)
        .attr('fill', 'purple')
        .attr('r', 10)
        .attr('cx', (d, i) => ratingXScale(d.Rating))
        .attr('cy', (d, i) => i * 28 + 30)

    svg.selectAll('.small-text').transition()
        .attr('opacity', 1)
        .attr('class', 'small-text')
        .attr('x', margin.left - 20)
        .attr('y', (d, i) => i * 28 + 100)
        .attr('font-size', 20)
        .attr('text-anchor', 'end')
}


function bubble(){
    let svg = d3.select("#vis").select('svg')
    
    remove('none')

    svg.selectAll('circle')
        .transition().duration(300).delay((d, i) => i * 5)
        .attr('r', d => ratingSizeScale(d.Rating) * 0.5)
        .attr('fill', d => categoryColorScale(d.Region))

    simulation  
        .force('charge', d3.forceManyBody().strength(20))
        .force('forceX', d3.forceX(d => regionBubble[d.Region][0]+400))
        .force('forceY', d3.forceY(d => regionBubble[d.Region][1]-70))
        .force('collide', d3.forceCollide(d => ratingSizeScale(d.Rating)-17))
        .alphaDecay([0.02])


    simulation.alpha(0.9).restart()
    
    createLegend(20, 50)
}

function flyingtext(){
    let svg = d3.select("#vis").select('svg')
    remove('bubbles')
    
    svg.selectAll('circle')
        .transition().duration(400).delay((d, i) => i * 5)
        .attr('r', d => ratingSizeScale(d.Rating) * 0.5)
        .attr('fill', d => categoryColorScale(d.Region))

        
    svg.selectAll('.lab-text').transition().duration(300).delay((d, i) => i * 30)
        .text(d => `Rating: ${(regionBubble[d][2])}`)
        .attr('x', d => regionBubble[d][0] + 400)   
        .attr('y', d => regionBubble[d][1] + 50)
        .attr('opacity', 1)



    simulation  
        .force('charge', d3.forceManyBody().strength(20))
        .force('forceX', d3.forceX(d => regionBubble[d.Region][0]+400))
        .force('forceY', d3.forceY(d => regionBubble[d.Region][1]-50))
        .force('collide', d3.forceCollide(d => ratingSizeScale(d.Rating)-10))
        .alpha(0.7).alphaDecay(0.02).restart()

    simulation.stop()

}


function histogram(){
    let svg = d3.select('#vis').select('svg')

    remove('histogram')

    simulation.stop()

    svg.selectAll('circle')
        .transition().duration(600).delay((d, i) => i * 2).ease(d3.easeBack)
            .attr('r', 10)
            .attr('cx', d => histXScale(d.HistX))
            .attr('cy', d => histYScale(d.HistColumn))
            .attr('fill', d => categoryColorScale(d.Country))

    let xAxis = d3.axisBottom(histXScale)
    svg.append('g')
        .attr('class', 'hist-axis')
        .attr('transform', `translate(0, ${height + margin.top + 10})`)
        .call(xAxis)

    svg.selectAll('.lab-text')
        .on('mouseout', )
}


let scrollers = [
    scatter,
    bubble,
    flyingtext, 
    histogram
]
   

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
        scrollers[i]();
    })
    lastIndex = activeIndex;

})

scroll.on('progress', function(index, progress){
    if (index == 2 & progress > 0.7){

    }
})