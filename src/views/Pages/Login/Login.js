import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Alert, Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { login } from '../../../api/functions/UserFunctions'

class Login extends Component {

  constructor() {
     super()
     //State of login
     this.state = {
       email: '',
       password: '',
       errors: {},
       show: false
     }

     this.onChange = this.onChange.bind(this)
     this.onSubmit = this.onSubmit.bind(this)
   }

//On change on form
   onChange(e) {
     this.setState({ [e.target.name]: e.target.value })
   }

//Show pop up modal function on false login
   showPopUp = (show) => {
     if (show === true)
     return(
       <div>
        <Modal isOpen={this.state.show} size="sm">
          <ModalHeader>Erreur d'authentification</ModalHeader>
          <ModalBody>
            <br/>
            <br/>
            <strong> Veuillez saisir la bonne adresse e-mail et le bon mot de passe </strong>
            <br/>
            <br/>
          </ModalBody>
          <ModalFooter>
              <Button color="secondary" onClick={() => this.changeShowState()}>Fermer</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }

    //If true show modal, false not show
    changeShowState = () => {
      this.setState({
        show: !this.state.show
      })
    }

//On submit tests login if good change to signals page else change modal state and show the modal
   onSubmit(e) {
     e.preventDefault()

     const user = {
       email: this.state.email,
       password: this.state.password
     }

// Login function
   login(user).then(res => {
     if (res) {
       this.props.history.push(`/Signals`)
     } else {
         this.changeShowState()
     }
   })
 }

// Login render
render() {
  return (
    <div className="app flex-row align-items-center">
      {this.showPopUp(this.state.show)}
      <Container>
        <Row className="justify-content-center">
          <Col md="9" lg="7" xl="6">
            <Card className="mx-4">
              <CardBody className="p-4">
                <Form noValidate onSubmit={this.onSubmit}>
                  <h1>S'identifier</h1>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>@</InputGroupText>
                    </InputGroupAddon>
                    <Input
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    required
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                    type="password"
                    placeholder="Mot de passe"
                    autoComplete="new-password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    required/>
                  </InputGroup>
                  <Button color="success" type="submit" block>Se connecter</Button>
                </Form>
              </CardBody>
              </Card>
          </Col>
        </Row>
      </Container>
    </div>
        );
    }
}

export default Login;
