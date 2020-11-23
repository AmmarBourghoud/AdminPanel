import React, { Component } from 'react';
import {Form,Button,Badge, Card, CardBody, CardHeader, Col, Row, Table} from 'reactstrap';
import wretch from 'wretch';
import Moment from 'moment';
import mapboxgl from 'mapbox-gl'
import { MAP_TOKEN, MAP_IMAGE } from '../../api/paths/index'
import { loadSignalsToMap } from '../../api/functions/SignalsFunctions'


class SignalsMap extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    //The stae of Signals Map
    this.state = {
      items: {},
      isLoading: false,
      categoryValue: '',
      statusValue: '',
      map: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

//Handle change
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

//Handle submit,
  handleSubmit(event) {
    event.preventDefault()
    //new state
    const newState = this.state;
    const result = [];
    //if no selection show all the singals
    if(this.state.categoryValue !== '' || this.state.statusValue !== '') {
     this.state.items.data.forEach(function (item, index) {
       //If selection of a category and a status
      if (newState.categoryValue !== '' && newState.statusValue !== '') {
        //If the categorie and the status correspands to the item
        if(newState.categoryValue === item.category && newState.statusValue === item.status)
            result.push(newState.items.data[index])
          } else if (newState.categoryValue !== '' || newState.statusValue !== '') {
            //If selection of a category or a status and the selection correspands to the item
            if(newState.categoryValue === item.category || newState.statusValue === item.status)
              result.push(newState.items.data[index])
          }
     });
     console.log(result);
     //generate the corresponding map
     this.generateMap(result)
   } else {
       console.log(newState.items.data);

       this.generateMap(newState.items.data)
     }
  }

  async componentDidMount() {
    this._isMounted = true;

//Load the signals to the map
    loadSignalsToMap().then(response => {
      if (this._isMounted)
        this.setState({
          isLoading: true
        });
        if (response) {
          this.setState({
           isLoading: false,
           items: response,
         });
         mapboxgl.accessToken = MAP_TOKEN;
        this.generateMap(response.data)
          }
      })

  }

//Create map
generateMap = (response) => {
  this.Mapcontainer.innerHTML = ""

  const map = new mapboxgl.Map({
    container: this.Mapcontainer,
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [2.4159, 48.7651],
    zoom: 13
  });
  map.on("load", function () {
        map.loadImage(MAP_IMAGE, function(error, image) {
        if (error) throw error;
        response.forEach(
          signal => {
            // Add signal image
          map.addImage(signal._id, image);
          //add signal details
          map.addLayer({
            id: signal._id,
            type: "symbol",
            source: {
              type: "geojson",
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    properties: {
                      "description":"<strong>"+ signal.name +"</strong><p>"+
                      signal.description + "</p> <p>Date: "+ Moment(signal.created_date).format('DD/MM/YY à HH:mm') +
                      "</p> <p><a href='"+ `#/signal/${signal._id}/` +"'><em>Voir la fiche du signalement</em></a> </p>"
                    },
                    geometry: {
                    type: "Point",
                    coordinates: [signal.localization.long, signal.localization.int]
                    }
                  }
                ]
              }
            },
            layout: {
              "icon-image": signal._id,
              "icon-allow-overlap": true
            }
          });
//Show details on click
          map.on('click', signal._id, function (e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description;
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
            });

          }
        );
      })
    });
    }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.match.params.id !== this.props.match.params.id)
      await this.loadSignal()
  }
//The render of the page, the 2 selections, submit and the map
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="card card-accent-warning mb-3" >
                <strong><i className="icon-info pr-1"></i>Localisation</strong>
              <div className="dropdown" style={{display: 'inline-block'}}>
                <Form noValidate onSubmit={this.handleSubmit} style={{marginTop: "2%"}}>
                <select name="statusValue" value={this.state.statusValue} onChange={this.handleChange} className="form-select form-select-lg mb-3" style={{marginLeft: '5%'}}>
                <option value="">Afficher par status de signalement</option>
                <option value="Ouvert">Ouvert</option>
                <option value="Terminé">Terminé</option>
                <option value="En Attente">En Attente</option>
                <option value="En Cours">En Cours</option>
                </select>
                <select name="categoryValue" value={this.state.categoryValue} onChange={this.handleChange} className="form-select form-select-sm" style={{marginLeft: '5%'}}>
                <option value="">Afficher par categorie de signalement</option>
                <option value="Propreté">Propreté</option>
                <option value="Panne">Panne</option>
                <option value="Dégradation">Dégradation</option>
                </select>
                <Button color="success" type="submit" style={{width: '20%', marginLeft: "5%"}}>Lancer recherche</Button>
                </Form>
              </div>
              </CardHeader>
              <CardBody>
              <div className='FullMap' ref={(x) => { this.Mapcontainer = x }}></div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default SignalsMap;
