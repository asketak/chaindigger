const React = require('react');

import { Field, FieldBody, Label, Control, Input, Icon, Button,  Columns, Column } from 'bloomer';

import bulmaCalendar from 'bulma-calendar';


export default class QueryPanel extends React.Component {
	constructor(props) {
		super(props)
	}

	shouldComponentUpdate() {
		return false
	}

	componentDidMount() {
		this.initDatePicker()
	}

	initDatePicker() {
		const endDate = new Date()
		let startDate = new Date(endDate.valueOf())
		startDate.setDate(startDate.getDate()-7)

		const options = {
			type: "datetime",
			validateLabel: "OK",
			todayLabel: "Now"
		}

		this.startDatePicker = bulmaCalendar.attach('.start-date', Object.assign({}, options, {startDate: startDate}));
		this.endDatePicker = bulmaCalendar.attach('.end-date', Object.assign({}, options, {startDate: endDate}));
	}

	onSubmit = e => {
		const queryObj = {}

		if(this.startDatePicker[0].startDate) queryObj["start-date"] = this.startDatePicker[0].startDate.valueOf()
		if(this.endDatePicker[0].startDate) queryObj["end-date"] = this.endDatePicker[0].startDate.valueOf()

		function addFieldToQuery(fieldId, type) {
			const value = document.getElementById(fieldId).value
			if (value) {
				let requestValue = undefined

				if (type === "float") {
					requestValue = parseFloat(value)
				} else if (type === "int") {
					requestValue = parseInt(value)
				} else if (type === "text") {
					requestValue = value
				}

				if (requestValue !== undefined && (type === "text" || !isNaN(requestValue))) {
					queryObj[fieldId] = requestValue
				}
			}
		}
		addFieldToQuery("balance-minimum", "float")
		addFieldToQuery("balance-maximum", "float")
		addFieldToQuery("address", "text")
		addFieldToQuery("sent-minimum", "float")
		addFieldToQuery("sent-depth", "int")
		addFieldToQuery("received-minimum", "float")
		addFieldToQuery("received-depth", "int")

		console.log(JSON.stringify(queryObj))

		fetch('http://localhost:5000/request_handler', {
			method: 'POST',
			body: JSON.stringify(queryObj),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(response => {
			return response.json()
		}).then(json => {
			console.log(json)
			this.props.setData({data: json, address: queryObj.address})
		})
	}

	render() {
		return (
				<div id="QueryPanel" className={"ahoj"}>

					<Label className="form-option-label">Time Range</Label>
					<Columns>
						<Column>
							<Field>
								<Label>From</Label>
								<input id="date-start" className="start-date" type="date"/>
							</Field>
						</Column>

						<Column>
							<Field>
								<Label>To</Label>
								<input id="date-end" className="end-date" type="date"/>
							</Field>
						</Column>
					</Columns>

					<Field>
						<Label className="form-option-label">Addresses which owns</Label>
						<FieldBody>
							<Control hasIcons='left'>
								<Icon isSize='small' isAlign='left' className="fa fa-greater-than-equal"/>
								<Input id="balance-minimum" type="text" isColor='primary' placeholder="Minimum of"/>
							</Control>
							<Label className="form-and-ampersand">and</Label>
							<Control hasIcons='left'>
								<Icon isSize='small' isAlign='left' className="fa fa-less-than-equal"/>
								<Input id="balance-maximum" type="text" isColor='primary' placeholder="Maximum of"/>
							</Control>
						</FieldBody>
					</Field>

					<Field>
						<Label className="form-option-label">Address vicinity</Label>
						<Control hasIcons='left' isExpanded>
							<Icon isSize='small' isAlign='left' className="fa fa-address-card"/>
							<Input id="address" type="text" isColor='primary' placeholder="Address"/>
						</Control>

						<Label className="form-vicinity-label">filter addresses which sent a minimum of</Label>
						<FieldBody>
							<Control hasIcons='left'>
								<Icon isSize='small' isAlign='left' className="fa fa-greater-than-equal"/>
								<Input id="sent-minimum" type="text" isColor='primary' placeholder="Minimum of"/>
							</Control>
							<Label className="form-text form-text-depth">through max of</Label>
							<Control hasIcons='left' className="form-max-depth">
								<Icon isSize='small' isAlign='left' className="fa fa-ruler-horizontal"/>
								<Input id="sent-depth" type="text" isColor='primary' placeholder="Depth"/>
							</Control>
							<Label className="form-text">addresses</Label>
						</FieldBody>

						<Label className="form-vicinity-label">filter addresses which received a minimum of</Label>
						<FieldBody>
							<Control hasIcons='left'>
								<Icon isSize='small' isAlign='left' className="fa fa-greater-than-equal"/>
								<Input id="received-minimum" type="text" isColor='primary' placeholder="Minimum of"/>
							</Control>
							<Label className="form-text form-text-depth">through max of</Label>
							<Control hasIcons='left' className="form-max-depth">
								<Icon isSize='small' isAlign='left' className="fa fa-ruler-horizontal"/>
								<Input id="received-depth" type="text" isColor='primary' placeholder="Depth"/>
							</Control>
							<Label className="form-text">addresses</Label>
						</FieldBody>
					</Field>


					<Button id="submit-button" isColor='primary' isSize='large' onClick={this.onSubmit}>Submit</Button>
				</div>
		)
	}
}