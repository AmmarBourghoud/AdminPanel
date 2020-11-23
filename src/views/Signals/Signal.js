import React, { Component } from 'react';
import {Card, CardBody, CardHeader, Col, Row, Table} from 'reactstrap';
import Moment from 'moment';
import mapboxgl from 'mapbox-gl'
import { loadSignal, loadSignal_author, loadSignal_comments } from '../../api/functions/SignalsFunctions'
import { MAP_TOKEN, MAP_IMAGE } from '../../api/paths/index'


class Signal extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
//State of a signal
    this.state = {
      item: {},
      user: {},
      comments: {},
      isLoading: false,
      map: null
    };
  }

   componentDidMount() {
    this._isMounted = true;
    mapboxgl.accessToken = MAP_TOKEN;

    // Load signal function
    loadSignal(this.props.match.params.id).then(response => {
      if (this._isMounted)
        this.setState({
          isLoading: true
        });
        // If true === there's a response create the map, call the signal author function, call signal comments function
    if (response) {
      var map = new mapboxgl.Map({
          container: this.Mapcontainer,
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [response.data.localization.long, response.data.localization.int],
          zoom: 16
      });
      map.on("load", function () {
          map.loadImage(MAP_IMAGE, function(error, image) {
            if (error) throw error;
            map.addImage("custom-marker", image);
            map.addLayer({
              id: "markers",
              type: "symbol",
              source: {
                type: "geojson",
                data: {
                  type: 'FeatureCollection',
                  features: [
                    {
                      type: 'Feature',
                      properties: {},
                      geometry: {
                      type: "Point",
                      coordinates: [response.data.localization.long, response.data.localization.int]
                      }
                    }
                  ]
                }
              },
              layout: {
                "icon-image": "custom-marker",
              }
            });
          });
        });

        // Load signal author
        loadSignal_author(response.data.author).then(resUser => {
          if (this._isMounted) {
            if (resUser)
            this.setState({
              user: resUser.data,
              item: response.data,
              });
            else
            this.setState({
              user: null,
              item: response.data,
              });
            }
          });

//Load signal comments
        loadSignal_comments(this.props.match.params.id).then(resComments => {
          if (this._isMounted)
          this.setState({
            isLoading: false,
            comments: resComments.data
            });
        })
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.match.params.id !== this.props.match.params.id)
      await this.loadSignal()
  }

//Final render
  render() {
    const {item: signal, user: user, comments:comments, map: map} = this.state



    let listItems
    let commentList = this.state
    //Comments area
    if (commentList.comments.length > 0) {
        commentList = commentList.comments
        listItems = commentList.map(function(item, i){
          return(
          <Card>
            <CardBody key={i}>
              {item.author.firstName} {item.author.lastName}  <br />
              {Moment(item.date).format('DD/MM/YY à HH:mm')} <br /> <br />

              {item.comment}
            </CardBody>
          </Card>);
        })
    }
    else listItems = "Pas de commentaires pour l'instant."

//Render of the page
    return (
      <div className="animated fadeIn">
        <Row>
          <div className="divSameHeight">
            <Col lg={6} className="sameHeight">
              <Card  className="fullHeight">
                <CardHeader className="card card-accent-primary mb-3">
                  <strong><i className="icon-info pr-1"></i>Signalement</strong>
                </CardHeader>
                <CardBody>
                  <Table responsive striped hover>
                    <tbody>
                    {/*<tr>*/}
                      <tr>
                        <th>Identifiant du signalement</th>
                        <td>{signal._id}</td>
                      </tr>
                      <tr>
                        <th>Nom</th>
                        <td>{signal.name}</td>
                      </tr>
                      <tr>
                        <th>Catégorie</th>
                        <td>{signal.category}</td>
                      </tr>
                      <tr>
                        <th>Description</th>
                        <td>{signal.description}</td>
                      </tr>
                      <tr>
                        <th>Ville</th>
                        <td>{signal.city}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>{signal.status}</td>
                      </tr>
                      <tr>
                        <th>Date</th>
                        <td>{Moment(signal.date).format('DD/MM/YY à HH:mm')}</td>
                      </tr>
                      <tr>
                        <th>Date de création</th>
                        <td>{Moment(signal.created_date).format('DD/MM/YY à HH:mm')}</td>
                      </tr>
                      <tr>
                        <th>Dernière mis à jour</th>
                        <td>{Moment(signal.last_update).format('DD/MM/YY à HH:mm')}</td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}  className="sameHeight">
              <Card className="fullHeight">
                <CardHeader className="card card-accent-warning mb-3" >
                  <strong><i className="icon-info pr-1"></i>Localisation</strong>
                </CardHeader>
                <CardBody >
                <div className='MapContent' ref={(x) => { this.Mapcontainer = x }}></div>
                </CardBody>
              </Card>
            </Col>
          </div>

          <Col lg={12}>
            <Card>
              <CardHeader className="card card-accent-success mb-3">
                <strong><i className="icon-info pr-1"></i>Auteur du signalement</strong>
              </CardHeader>
              <CardBody>
                <Table responsive striped hover>
                  <thead>
                  <tr>
                    <th scope="col">Nom</th>
                    <th scope="col">Email</th>
                    <th scope="col">Numéro de téléphone</th>
                  </tr>
                  </thead>
                  <tbody>
                    <tr key={user ? user._id: ""}>
                      <td><strong>{user ? user.firstName  + " " + user.lastName : "Pas d'informations disponible"}</strong></td>
                      <td>{user ? user.email: ""}</td>
                      <td>{user ? user.phone: ""}</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>

          <Col lg={12}>
            <Card>
              <CardHeader className="card card-accent-danger mb-3">
                <strong><i className="icon-info pr-1"></i>Commentaires</strong>
              </CardHeader>
              <CardBody>
                {listItems}
              </CardBody>
            </Card>
          </Col>

        </Row>
      </div>
    )
  }
}

export default Signal;
