const React = require('react');

export default class Graph extends React.Component {
	constructor(props) {
		super(props)
	}

	svgContainerRef = React.createRef()

	componentDidMount() {
		if (this.props.data) {
			renderGraph(this.props, this.svgContainerRef.current)
		}
	}

	render() {
		return (
				<div ref={this.svgContainerRef} id="SvgContainer"/>
		)
	}
}

let selectedElement = null


function renderGraph(props, graphNode) {

	const data = props.data

	const width = graphNode.clientWidth;
	const height = graphNode.clientHeight;


	function drag(simulation) {

		function dragstarted(d) {
			if (!d3.event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(d) {
			d.fx = d3.event.x;
			d.fy = d3.event.y;
		}

		function dragended(d) {
			if (!d3.event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}

		return d3.drag()
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended);
	}



	const scale = d3.scaleOrdinal(d3.schemeCategory10);
	const color = d => {
		if (d.id === props.address) {
			return "red"//"#00d1b2"
		} else {
			return scale(d.group)
		}
	};



	const filteredEdges = data.edges
			.filter(edge => {
				return edge.start !== edge.end
			});

	const coinMap = {};
	let curEdgeGroup = 2;

	filteredEdges.forEach(edge => {
		if (!coinMap[edge.asset]) {
			coinMap[edge.asset] = curEdgeGroup++;
		}
	})

	const edges = filteredEdges
			.map(edge => {
				return {
					id: edge.hash,
					source: edge.start,
					target: edge.end,
					amount: edge.amount,
					asset: edge.asset,
					timestamp: +edge.timestamp,
					group: coinMap[edge.asset]
				}
			});

	const nodes = data.nodes.map(node => {
		return {
			id: node.hash
		}
	});

	const simulation = d3.forceSimulation(nodes)
			.force("link", d3.forceLink(edges).id(d => d.id))
			.force("charge", d3.forceManyBody())
			.force('collide', d3.forceCollide(function (d) {
				return d.id === props.address ? 50 : 20
			}))
			.force("center", d3.forceCenter(width / 2, height / 2));

	const svg = d3.create("svg")
			.attr("viewBox", [0, 0, width, height]);

	svg.append('defs').append('marker')
			.attr("id", "arrowhead")
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", 20)
			.attr("markerWidth", 3)
			.attr("markerHeight", 3)
			.attr("orient", "auto")
			.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5")
			.style('stroke','none');

	const link = svg.append("g")
			//.attr("stroke", "#999")
			.attr("stroke-opacity", 1)
			.attr("stroke-width", "4px")
			.selectAll("line")
			.data(edges)
			.join("line")
			.attr("stroke", (l => scale(l.group)))
			.on("mouseover", mouseover)
			.on("mouseout", mouseout)
			.on("click", mouseclick)
			.attr("stroke-width", d => Math.sqrt(d.value))
			.attr('marker-end','url(#arrowhead)');

	const node = svg.append("g")
			.attr("stroke", "#fff")
			.attr("stroke-width", 1.5)
			.selectAll("circle")
			.data(nodes)
			.join("circle")
			.attr("r", 8)
			.attr("fill", color)
			.on("mouseover", mouseover)
			.on("mouseout", mouseout)
			.on("click", mouseclick)
			.call(drag(simulation));

	node.append("title")
			.text(d => d.id);

	simulation.on("tick", () => {
		link
				.attr("x1", d => d.source.x)
				.attr("y1", d => d.source.y)
				.attr("x2", d => d.target.x)
				.attr("y2", d => d.target.y);

		node
				.attr("cx", d => d.x)
				.attr("cy", d => d.y);
	});


	function mouseover() {
		highlight(this)

		props.onNodeInfoChange(this.__data__)
	}

	function mouseout() {
		if (this === selectedElement) {
			return
		}

		unhighlight(this)

		if (selectedElement !== null) {
			props.onNodeInfoChange(selectedElement.__data__)
		} else {
			props.onNodeInfoChange(undefined)
		}
	}

	function mouseclick() {
		if (selectedElement) {
			unhighlight(selectedElement)
		}

		if (this === selectedElement) {
			selectedElement = null
			props.onNodeInfoChange(undefined)
		} else {
			selectedElement = this
		}
	}

	function highlight(node) {
		d3.select(node).transition().duration(350).attr("r", 16);
	}

	function unhighlight(node) {
		d3.select(node).transition().duration(350).attr("r", 8);
	}

	//invalidation.then(() => simulation.stop());

	graphNode.appendChild(svg.node())
}