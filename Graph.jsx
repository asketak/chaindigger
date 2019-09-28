const React = require('react');

import SvgContainer from './SvgContainer.jsx'

import { Field, FieldBody, Label, Control, Input, Icon, Button,  Columns, Column } from 'bloomer';

export default class Graph extends React.Component {
	constructor(props) {
		super(props)
	}

	state = {
		queryDate: 0,
		data: undefined,

		nodeInfo: undefined
	}

	onNodeInfoChange = (nodeInfo) => {
		this.setState({nodeInfo: nodeInfo})
	}

	componentDidMount() {
		d3.json("./miserables.json").then(data => this.setState({data: data, queryDate: new Date().valueOf()}))
	}

	render() {
		return (
			<div id="Graph">
				{this.state.nodeInfo &&
						<div id="node-info">
							<Field><Label>Address: </Label><span className="node-value">{this.state.nodeInfo.id}</span></Field>
							<Field><Label>Balance: </Label><span className="node-value">{this.state.nodeInfo.group}</span></Field>
						</div>
				}
				<SvgContainer key={this.state.queryDate} data={this.state.data} onNodeInfoChange={this.onNodeInfoChange}/>
			</div>
		)
	}
}