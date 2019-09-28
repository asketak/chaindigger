const React = require('react');
const ReactDOM = require('react-dom');

import QueryPanel from './QueryPanel.jsx'
import Graph from './Graph.jsx'

import { Columns, Column } from 'bloomer';


class ChainDigger extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
				<div id="ChainDigger">
						<div id="query-panel-column">
							<QueryPanel/>
						</div>
						<div id="result-column">
							<Graph/>
						</div>
				</div>
		)
	}
}

ReactDOM.render(
		React.createElement(ChainDigger, null, null),
		document.getElementById('app')
)