const React = require('react');

import SvgContainer from './SvgContainer.jsx'

import { Field, FieldBody, Label, Control, Input, Icon, Button,  Columns, Column } from 'bloomer';

export default class Graph extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidCatch(error, info) {
		console.error(error);
	}

	static getDerivedStateFromError() {
		return {}
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

	walletBalanceRef = React.createRef()

	componentDidUpdate() {
		if (this.state.nodeInfo && !this.state.nodeInfo.start) {
			const currentNode = this.walletBalanceRef.current
			fetch("https://explorer.testnet2.matic.network/api?module=account&action=balance&address=" + this.state.nodeInfo.id, {
				headers: {
					'accept': 'application/json'
				}
			}).then(response => {
				return response.json()
			}).then(json => {
				if (currentNode) {
					currentNode.innerText = json.result + " MATIC"
				}
			})
		}
	}

	renderAddressInfoNode() {
		return (
				<div id="node-info">
					<Field>
						<Label>Address: </Label>
						<span className="node-value"><a target="_blank" href={this.getExplorerAddressLink(this.state.nodeInfo.id)}>{this.state.nodeInfo.id}<Icon isSize='small' isAlign='right' className="fa fa-external-link-alt"/></a></span>
					</Field>
					<Field><Label>Balance: </Label><span className="node-value" ref={this.walletBalanceRef}></span></Field>
				</div>
		)
	}

	renderTransactionInfoNode() {
		return (
				<div id="node-info">
					<Field>
						<Label>Transaction: </Label>
						<span className="node-value"><a target="_blank" href={this.getExplorerTransactionLink(this.state.nodeInfo.id)}>{this.state.nodeInfo.id}<Icon isSize='small' isAlign='right' className="fa fa-external-link-alt"/></a></span>
					</Field>
					<Field style={{float: "left"}}><Label>Amount: </Label><span className="node-value">{this.state.nodeInfo.amount} {this.state.nodeInfo.asset.toUpperCase()}</span></Field>
					<Field style={{float: "left", marginLeft: "20px"}}><Label>Time: </Label><span className="node-value">{new Date(this.state.nodeInfo.timestamp).toLocaleString()}</span></Field>
				</div>
		)
	}

	renderInfoNode() {
		if (!this.state.nodeInfo) {
			return null
		} else if (this.state.nodeInfo.timestamp) {
			return this.renderTransactionInfoNode()
		} else {
			return this.renderAddressInfoNode()
		}
	}

	render() {
		return (
			<div id="Graph">
				{this.renderInfoNode()}
				<SvgContainer key={this.props.queryDate} data={this.props.data} address={this.props.address} onNodeInfoChange={this.onNodeInfoChange}/>
			</div>
		)
	}
}