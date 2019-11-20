import React from "react"
import { Container, Navbar, Card, Button } from "react-bootstrap"
import { PDFtoIMG } from "react-pdf-to-image"
import Slides from "../Slides/Slides"
import Settings from "../Settings/Settings"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { connect } from "react-redux"
import { deleteAll, updateSlides, updateSettings } from "../../redux/actions"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons"

class App extends React.Component {
  state = {
    file: null
  }

  onFildeUploaded = event => {
    this.setState({ file: URL.createObjectURL(event.target.files[0]) })
  }

  deletePresentation = () => {
    if (
      window.confirm(
        "Are you sure you want to remove all slides and related audio records?"
      )
    ) {
      this.props.deleteAll()
    }
  }

  export = async () => {
    let manifest = {
      author: "sasha",
      date: new Date(Date.now()).toLocaleString(),
      name: this.props.settings.name,
      description: this.props.settings.description,
      pages: []
    }

    let zip = new JSZip()
    this.props.slides.forEach((slide, index) => {
      const imageName = `${index + 1}.jpeg`
      let page = {
        order: index + 1,
        image: imageName
      }
      const idx = slide.image.indexOf("base64,") + "base64,".length
      zip.file(imageName, slide.image.substring(idx), { base64: true })
      if (slide.audio) {
        page.audio = {
          file: `${index + 1}.wav`,
          length: slide.audio.time
        }
        zip.file(`${index + 1}.wav`, slide.audio.blob)
      }
      manifest.pages.push(page)
    })

    zip.file("manifest.json", JSON.stringify(manifest))
    zip.generateAsync({ type: "blob" }).then(content => {
      saveAs(content, "presentation.zip")
    })
  }

  render() {
    let presentationContent
    if (this.props.slides) {
      presentationContent = <Slides slides={this.props.slides}></Slides>
    } else if (this.state.file) {
      presentationContent = (
        <PDFtoIMG file={this.state.file}>
          {({ pages }) => {
            if (!pages.length) return "Loading..."
            this.props.updateSlides(
              pages.map(page => ({
                image: page,
                audio: null
              }))
            )
            this.setState({ file: null })
            return null
          }}
        </PDFtoIMG>
      )
    } else {
      presentationContent = (
        <input type="file" name="file" onChange={this.onFildeUploaded} />
      )
    }

    return (
      <div className="App">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>Thinkific Presentation Maker</Navbar.Brand>
        </Navbar>
        <Container>
          <h1>Presentation</h1>
          <Card>
            <Card.Header as="h5">
              Presentation Settings
              {this.props.slides && (
                <Button
                  variant="warning"
                  onClick={this.export}
                  className="float-right"
                >
                  <FontAwesomeIcon icon={faSave} /> Export
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              <Card.Body>
                <Settings></Settings>
              </Card.Body>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header as="h5">
              Presentation Content
              {this.props.slides && (
                <Button
                  variant="danger"
                  onClick={this.deletePresentation}
                  className="float-right"
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete Presentation
                </Button>
              )}
            </Card.Header>
            <Card.Body>{presentationContent}</Card.Body>
          </Card>
        </Container>
      </div>
    )
  }
}

export default connect(
  state => ({
    settings: state.settings,
    slides: state.slides
  }),
  { deleteAll, updateSlides, updateSettings }
)(App)
