const React = require('react');
const ReactDOM = require('react-dom');

import QueryPanel from './QueryPanel.jsx'
import Graph from './Graph.jsx'

import { Columns, Column } from 'bloomer';


class ChainDigger extends React.Component {
	constructor(props) {
		super(props)
	}

	state = {
		queryDate: 0,
		data: null,
		address: null
	}

	componentDidMount() {
		//d3.json("./miserables.json").then(data => this.setState({data: data, queryDate: new Date().valueOf()}))
	}

	render() {
		return (
				<div id="ChainDigger">
						<div id="query-panel-column">
							<QueryPanel setData={result=>this.setState({data: result.data, address: result.address, queryDate: new Date().valueOf()})}/>
						</div>
						<div id="result-column">
							<Graph data={this.state.data} address={this.state.address} queryDate={this.state.queryDate}/>
						</div>
				</div>
		)
	}
}

ReactDOM.render(
		React.createElement(ChainDigger, null, null),
		document.getElementById('app')
)