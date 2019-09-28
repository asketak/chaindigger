const React = require('react');

import { Field, FieldBody, Label, Control, Input, Icon, Button,  Columns, Column } from 'bloomer';

import bulmaCalendar from 'bulma-calendar';


export default class QueryPanel extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		initDatePicker()
	}

	render() {
		return (
				<div id="QueryPanel" className={"ahoj"}>

					<Label className="form-option-label">Time Range</Label>
					<Columns>
						<Column>
							<Field>
								<Label>From</Label>
								<input className="start-date" type="date"/>
							</Field>
						</Column>

						<Column>
							<Field>
								<Label>To</Label>
								<input className="end-date" type="date"/>
							</Field>
						</Column>
					</Columns>

					<Field>
						<Label className="form-option-label">Addresses which owns</Label>
						<FieldBody>
							<Control hasIcons='left'>
								<Icon isSize='small' isAlign='left' className="fa fa-equals"></Icon>
								<Input type="text" isColor='primary' placeholder="Exactly"/>
							</Control>
							<Label className="form-and-ampersand">&</Label>
							<Control hasIcons='left'>
								<Icon isSize='small' isAlign='left' className="fa fa-greater-than"></Icon>
								<Input type="text" isColor='primary' placeholder="More Than"/>
							</Control>
							<Label className="form-and-ampersand">&</Label>
							<Control hasIcons='left'>
								<Icon isSize='small' isAlign='left' className="fa fa-less-than"></Icon>
								<Input type="text" isColor='primary' placeholder="Less Than"/>
							</Control>
						</FieldBody>
					</Field>

					<Field>
						<Label className="form-option-label">Addresses which received</Label>
						<FieldBody>
							<Control hasIcons='left'>
								<Icon isSize='small' isAlign='left' className="fa fa-greater-than"></Icon>
								<Input type="text" isColor='primary' placeholder="More Than"/>
							</Control>
							<Label className="form-text form-text-depth">through max of</Label>
							<Control hasIcons='left' className="form-max-depth">
								<Icon isSize='small' isAlign='left' className="fa fa-ruler-horizontal"></Icon>
								<Input type="text" isColor='primary' placeholder="Depth"/>
							</Control>
							<Label className="form-text">addresses</Label>
						</FieldBody>
						<Label className="form-text">from address</Label>
						<FieldBody>
							<Control hasIcons='left' isExpanded>
								<Icon isSize='small' isAlign='left' className="fa fa-address-card"></Icon>
								<Input type="text" isColor='primary' placeholder="Address"/>
							</Control>
						</FieldBody>
					</Field>

					<Field>
						<Label className="form-option-label">Addresses which sent</Label>
						<FieldBody>
							<Control hasIcons='left'>
								<Icon isSize='small' isAlign='left' className="fa fa-greater-than"></Icon>
								<Input type="text" isColor='primary' placeholder="More Than"/>
							</Control>
							<Label className="form-text form-text-depth">through max of</Label>
							<Control hasIcons='left' className="form-max-depth">
								<Icon isSize='small' isAlign='left' className="fa fa-ruler-horizontal"></Icon>
								<Input type="text" isColor='primary' placeholder="Depth"/>
							</Control>
							<Label className="form-text">addresses</Label>
						</FieldBody>
						<Label className="form-text">to address</Label>
						<FieldBody>
							<Control hasIcons='left' isExpanded>
								<Icon isSize='small' isAlign='left' className="fa fa-address-card"></Icon>
								<Input type="text" isColor='primary' placeholder="Address"/>
							</Control>
						</FieldBody>
					</Field>

					<Button isColor='primary' isSize='large'>Submit</Button>
				</div>
		)
	}
}

function initDatePicker() {
	const endDate = new Date()
	let startDate = new Date(endDate.valueOf())
	startDate.setDate(startDate.getDate()-7)

	const options = {
		type: "datetime",
		validateLabel: "OK"
	}

	const startDatePicker = bulmaCalendar.attach('.start-date', Object.assign({}, options, {startDate: startDate}));
	const endDatePicker = bulmaCalendar.attach('.end-date', Object.assign({}, options, {startDate: endDate}));
}