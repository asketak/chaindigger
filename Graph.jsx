const React = require('react');

import SvgContainer from './SvgContainer.jsx'

import { Field, FieldBody, Label, Control, Input, Icon, Button,  Columns, Column } from 'bloomer';

export default class Graph extends React.Component {
	constructor(props) {
		super(props)
	}

	state = {
		nodeInfo: undefined
	}

	onNodeInfoChange = (nodeInfo) => {
		this.setState({nodeInfo: nodeInfo})
	}

	getExplorerAddressLink(hash) {
		return "https://explorer.testnet2.matic.network/address/"+hash+"/transactions"
	}

	getExplorerTransactionLink(hash) {
		return "https://explorer.testnet2.matic.network/tx/"+hash+"/token_transfers"
	}

	renderAddressInfoNode() {
		return (
				<div id="node-info">
					<Field><Label>Address: </Label><span className="node-value"><a href={this.getExplorerAddressLink(this.state.nodeInfo.id)}>{this.state.nodeInfo.id}</a></span></Field>
					<Field><Label>Balance: </Label><span className="node-value">{this.state.nodeInfo.group}</span></Field>
				</div>
		)
	}

	renderTransactionInfoNode() {
		return (
				<div id="node-info">
					<Field><Label>Transaction: </Label><span className="node-value"><a href={this.getExplorerTransactionLink(this.state.nodeInfo.id)}>{this.state.nodeInfo.id}</a></span></Field>
					<Field><Label>Amount: </Label><span className="node-value">{this.state.nodeInfo.group}</span></Field>
				</div>
		)
	}

	renderInfoNode() {
		if (!this.state.nodeInfo) {
			return null
		} else if (this.state.nodeInfo.address) {
			return this.renderAddressInfoNode()
		} else {
			return this.renderTransactionInfoNode()
		}
	}

	render() {
		return (
			<div id="Graph">
				{this.renderInfoNode()}
				<SvgContainer key={this.props.queryDate} data={this.props.data} onNodeInfoChange={this.onNodeInfoChange}/>
			</div>
		)
	}
}