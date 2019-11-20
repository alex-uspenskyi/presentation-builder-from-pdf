import React from "react"
import { ButtonGroup, Button, Modal } from "react-bootstrap"
import Slide from "../Slide/Slide"
import { connect } from "react-redux"
import { updateSlides } from "../../redux/actions"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"

class Slides extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      slides: props.slides ? props.slides : [],
      active: 0,
      showNewSlideModal: false
    }
  }

  onAudioSave = data => {
    let slides = this.state.slides
    slides[this.state.active].audio = data
    this.setState({ slides })
    this.saveSlides()
  }

  onImageSave = data => {
    let slides = this.state.slides
    slides[this.state.active].image = data
    this.setState({ slides })
    this.saveSlides()
  }

  onMove = next => {
    let slides = this.state.slides
    const active = slides[this.state.active]
    const index = next ? this.state.active + 1 : this.state.active - 1
    slides[this.state.active] = slides[index]
    slides[index] = active

    this.setState({ slides: slides, active: index })
    this.saveSlides()
  }

  onNewSlideImage = event => {
    const file = event.target.files[0]

    if (file.type === "image/jpeg") {
      const reader = new FileReader()
      reader.addEventListener(
        "load",
        () => {
          let slides = this.state.slides
          slides.push({
            image: reader.result,
            audio: null
          })
          this.setState({ slides: slides, active: slides.length - 1 })
          this.saveSlides()
        },
        false
      )
      reader.readAsDataURL(file)
    } else {
      alert("File type is not acceptable.")
    }
    this.closeNewSlideModal()
  }

  saveSlides = () => {
    this.props.updateSlides(this.state.slides)
  }

  closeNewSlideModal = () => {
    this.setState({ showNewSlideModal: false })
  }

  render() {
    return (
      <>
        <ButtonGroup>
          {this.state.slides &&
            this.state.slides.map((slide, index) => (
              <Button
                variant={this.state.active === index ? "outline-dark" : "dark"}
                key={index}
                onClick={() => this.setState({ active: index })}
              >
                Slide {index + 1}
              </Button>
            ))}
          {this.state.slides.length < 20 && (
            <Button
              variant="success"
              onClick={() => this.setState({ showNewSlideModal: true })}
            >
              <FontAwesomeIcon icon={faPlusCircle} /> Add
            </Button>
          )}
        </ButtonGroup>
        {this.state.slides.length > 0 && (
          <Slide
            image={this.state.slides[this.state.active].image}
            audio={this.state.slides[this.state.active].audio}
            index={this.state.active}
            total={this.state.slides.length}
            onMove={this.onMove}
            onAudioSave={this.onAudioSave}
            onImageSave={this.onImageSave}
          ></Slide>
        )}
        <Modal
          show={this.state.showNewSlideModal}
          onHide={this.closeNewSlideModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add New Slide</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type="file" onChange={this.onNewSlideImage} />
          </Modal.Body>
        </Modal>
      </>
    )
  }
}

export default connect(
  state => ({
    slides: state.slides
  }),
  { updateSlides }
)(Slides)
