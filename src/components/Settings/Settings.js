import React from "react"
import { Form, Button } from "react-bootstrap"
import { connect } from "react-redux"
import { updateSettings } from "../../redux/actions"
import db from "../../db"

class Settings extends React.Component {
  handleNameChange = event => {
    this.props.updateSettings({
      name: event.target.value,
      description: this.props.settings.description
    })
  }

  handleDescriptionChange = event => {
    this.props.updateSettings({
      name: this.props.settings.name,
      description: event.target.value
    })
  }

  submitForm = async event => {
    event.preventDefault()
    await db.data.put({ name: "settings", value: this.props.settings })
  }

  render() {
    return (
      <Form onSubmit={this.submitForm}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            required
            maxLength="255"
            value={this.props.settings.name}
            onChange={this.handleNameChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows="6"
            value={this.props.settings.description}
            onChange={this.handleDescriptionChange}
          />
        </Form.Group>
        <Button variant="success" type="submit">
          Save
        </Button>
      </Form>
    )
  }
}

export default connect(
  state => ({
    settings: state.settings
  }),
  { updateSettings }
)(Settings)
