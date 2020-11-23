import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { register } from '../../../api/functions/UserFunctions'

class Register extends Component {
  constructor() {
      super()
      //Register state
      this.state = {
        firstName: '',
        lastName: '',
        phone: '',
        street: '',
        city: '',
        zipcode: '',
        email: '',
        password: '',
        errors: {}
      }

      this.onChange = this.onChange.bind(this)
      this.onSubmit = this.onSubmit.bind(this)
    }

    //On change data on form
    onChange(e) {
      this.setState({ [e.target.name]: e.target.value })
    }
    //on submit
    onSubmit(e) {
      e.preventDefault()

      const adress = {
        street: this.state.street,
        city: this.state.city,
        zipcode: this.state.zipcode,
      }

      const newUser = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phone: this.state.phone,
        address: adress,
        email: this.state.email,
        password: this.state.password
      }

      //Redirection
      register(newUser).then(res => {
        this.props.history.push(`/login`)
      })
    }

//Render of register
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form noValidate onSubmit={this.onSubmit}>
                    <h1>S'inscrire</h1>
                    <p className="text-muted">Creer son compte</p>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                      type="text"
                      placeholder="Prenom"
                      name="firstName"
                      value={this.state.firstName}
                      onChange={this.onChange}
                      required/>
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user-following"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                      type="text"
                      placeholder="Nom"
                      name="lastName"
                      value={this.state.lastName}
                      onChange={this.onChange}
                      required />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-phone"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                      type="number"
                      placeholder="Telephone"
                      name="phone"
                      value={this.state.phone}
                      onChange={this.onChange}
                      required/>
                    </InputGroup>

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
                      required />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={this.state.password}
                      onChange={this.onChange}
                      required/>
                    </InputGroup>

                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-location-pin"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                      type="text"
                      placeholder="rue"
                      name="street"
                      value={this.state.street}
                      onChange={this.onChange}
                      required/>
                    </InputGroup>

                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-direction"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                      type="text"
                      placeholder="ville"
                      name="city"
                      value={this.state.city}
                      onChange={this.onChange}
                      required/>
                    </InputGroup>

                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-map"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                      type="number"
                      placeholder="code postal"
                      name="zipcode"
                      value={this.state.zipcode}
                      onChange={this.onChange}
                      required/>
                    </InputGroup>

                    <Button color="success"  type="submit" block>Creer un compte</Button>
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

export default Register;
