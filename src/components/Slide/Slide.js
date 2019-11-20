import React from "react"
import { Row, Col, Card, Button, ButtonGroup, Image } from "react-bootstrap"
import { ReactMic } from "react-mic"
import "./Slide.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMicrophoneAlt,
  faTrash,
  faPlay,
  faStop,
  faAngleDoubleLeft,
  faAngleDoubleRight
} from "@fortawesome/free-solid-svg-icons"

class Slide extends React.Component {
  state = {
    recording: false,
    playing: false
  }

  startRecording = () => {
    this.setState({
      recording: true
    })
  }

  stopRecording = () => {
    this.setState({
      recording: false
    })
  }

  deleteAudio = () => {
    if (window.confirm("Are you sure you want to delete audio for this slide?"))
      this.props.onAudioSave(null)
  }

  onStop = recordedBlob => {
    this.props.onAudioSave({
      blob: recordedBlob.blob,
      time:
        Math.round((recordedBlob.stopTime - recordedBlob.startTime) / 100) / 10
    })
  }

  playSound = () => {
    this.player = new Audio(URL.createObjectURL(this.props.audio.blob))
    this.player.play()
    this.player.onended = () => {
      this.setState({ playing: false })
    }

    this.setState({ playing: true })
  }

  stopSound = () => {
    this.setState({ playing: false })
    this.player.pause()
  }

  onImageUploaded = event => {
    const file = event.target.files[0]

    if (file.type === "image/jpeg") {
      const reader = new FileReader()
      reader.addEventListener(
        "load",
        () => this.props.onImageSave(reader.result),
        false
      )
      reader.readAsDataURL(file)
    } else {
      alert("File type is not acceptable.")
    }
  }

  render() {
    return (
      <Card bg="light">
        <Card.Header>Slide {this.props.index + 1}</Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Image src={this.props.image} alt="" thumbnail></Image>
            </Col>
            <Col>
              <h6>Audio</h6>
              {this.props.audio ? (
                <div>
                  <div>{this.props.audio.time} s</div>
                  <ButtonGroup>
                    {this.state.playing ? (
                      <Button variant="dark" onClick={this.stopSound}>
                        <FontAwesomeIcon icon={faStop} /> Stop
                      </Button>
                    ) : (
                      <Button variant="dark" onClick={this.playSound}>
                        <FontAwesomeIcon icon={faPlay} /> Play
                      </Button>
                    )}
                    <Button variant="danger" onClick={this.deleteAudio}>
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </Button>
                  </ButtonGroup>
                </div>
              ) : (
                <div>
                  <ReactMic
                    className="audio-vizualizer"
                    backgroundColor="#f8f9fa"
                    record={this.state.recording}
                    onStop={this.onStop}
                  />
                  {this.state.recording ? (
                    <Button variant="dark" onClick={this.stopRecording}>
                      <FontAwesomeIcon icon={faStop} /> Stop
                    </Button>
                  ) : (
                    <Button variant="danger" onClick={this.startRecording}>
                      <FontAwesomeIcon icon={faMicrophoneAlt} /> Record Audio
                    </Button>
                  )}
                </div>
              )}
              <h6 className="mt-3">Upload New Image</h6>
              <input type="file" onChange={this.onImageUploaded} />
              <h6 className="mt-3">Reorder</h6>
              <ButtonGroup>
                {this.props.index > 0 && (
                  <Button
                    variant="dark"
                    onClick={() => this.props.onMove(false)}
                  >
                    <FontAwesomeIcon icon={faAngleDoubleLeft} /> Move Prev
                  </Button>
                )}
                {this.props.index < this.props.total - 1 && (
                  <Button
                    variant="dark"
                    onClick={() => this.props.onMove(true)}
                  >
                    Move Next <FontAwesomeIcon icon={faAngleDoubleRight} />
                  </Button>
                )}
              </ButtonGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    )
  }
}

export default Slide
