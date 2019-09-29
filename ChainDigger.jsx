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
		data: null
	}

	componentDidMount() {
		//d3.json("./miserables.json").then(data => this.setState({data: data, queryDate: new Date().valueOf()}))
	}

	render() {
		return (
				<div id="ChainDigger">
						<div id="query-panel-column">
							<QueryPanel setData={data=>this.setState({data: data, queryDate: new Date().valueOf()})}/>
						</div>
						<div id="result-column">
							<Graph data={this.state.data} queryDate={this.state.queryDate}/>
						</div>
				</div>
		)
	}
}

ReactDOM.render(
		React.createElement(ChainDigger, null, null),
		document.getElementById('app')
)