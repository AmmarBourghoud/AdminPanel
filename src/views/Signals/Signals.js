import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Modal, ModalHeader, ModalBody, ModalFooter, Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import wretch from 'wretch'
import qs from 'query-string'
import Moment from 'moment';
import { loadSignals, loadSignal, updateSignal } from '../../api/functions/SignalsFunctions'
import sortArrow from '../../assets/img/sortArrow.svg'

//Create the signal rows, add badge depending on status
function SignalRow(props) {
  let signal = props.signal
  let signalLink = `/signal/${signal._id}`
  const getBadge = (status)=>{
    switch (status) {
      case 'Terminé': return 'success'
      case 'En Cours': return 'warning'
      case 'Ouvert': return 'info'
      case 'En Attente': return 'danger'
      default: return 'primary'
    }
  }
// Render of the component, contains button that changes the modal state and helps to update the status of signalement
  return (
    <tr key={signal._id}>
      <td><Link to={signalLink}>{signal.name}</Link></td>
      <td>{Moment(signal.date).format('DD/MM/YY à HH:mm')}</td>
      <td>{Moment(signal.created_date).format('DD/MM/YY à HH:mm')}</td>
      <td>{Moment(signal.last_update).format('DD/MM/YY à HH:mm')}</td>
      <td> <Badge color={getBadge(signal.status)}> {signal.status} </Badge> </td>
      <td><strong>{signal.category}</strong></td>
      <td><Button type="button" className="btn btn-secondary btn-sm" onClick={() => props.click.changeModalState(signal)}>Modifier Status</Button></td>
    </tr>
  )
}

export class Signals extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    //State of Signals
    this.state = {
      items: [],
      page: 1,
      pageTotal: 1,
      offset: 10,
      total: 0,
      isLoading: false,
      showModal: false,
      signalModalId: "none",
      signalModal: [],
      signalModalStatus: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(event) {
    this.setState({ signalModalStatus: event.target.value})
  }

//Submit for the status change : updates it and close the modal
  handleSubmit(event) {
    event.preventDefault()
    this.updateStatus(this.state.signalModalStatus,this.state.signalModalId,this.state.signalModal)
    this.changeModalState(this.state.signalModal)
  }

//Open/close the modal, calls loadSignalfunction to get the signalement to update
  changeModalState = (item) => {
    console.log("changeModalState");
    this.setState({ showModal: !this.state.showModal,
                   signalModalId: item._id,
                   signalModal: this.loadSignalfunction(item)});
    this.createModal(item)
  }

//Update status function calls the updateSignal api function with the data containing the new status
  updateStatus = (newStatus,signalId,signalJSON) => {

    if(newStatus !== '')
    signalJSON.status = newStatus

    updateSignal(signalId,signalJSON).then(response => {
    if (response) {
        if (this._isMounted) {
        this.setState({
           isLoading: false,
           signalModalStatus: response.data.status,
           signalModal: response.data
         })
          }
          window.location.reload(false);
    }
  })
  }

//Crate the Modal for signal update
  createModal = (item) => {
    console.log("createMODAL FUNCTIONS");
    let item2 = []
    //If a signal was selected
    if (this.state.signalModal !== undefined && this.state.signalModal.length === undefined){
      item2.push(this.state.signalModal.category)
      item2.push(this.state.signalModal.name)
      item2.push(this.state.signalModal.status)
    }
    //Render of the modal : Informations about the signalement, Select option for different status, submit the changes and update states
  return(
     <div>
      <Modal isOpen={this.state.showModal}>
        <ModalHeader>Modifier le status d'un signalement</ModalHeader>
        <ModalBody>
          <strong>Signalement : </strong>
          <br/>
          <br/>
          <strong>Nom :  {item2["name"]} </strong>
          <br/>
          <strong>Categorie :  {item2["category"]} </strong>
          <br/>
          <strong>Status :  {item2["status"]} </strong>
          <br/>
          <br/>

          <div className="dropdown" style={{display: 'inline-block'}}>
           <Form noValidate onSubmit={this.handleSubmit} >
           <option value={item2["status"]}>Changer l'etat du signalement</option>
           <select name="statusValue" value={this.state.signalModalStatus} onChange={this.handleChange} className="form-select form-select-lg mb-3" style={{marginLeft: '20%'}}>
           <option value="Ouvert">Ouvert</option>
           <option value="Terminé">Terminé</option>
           <option value="En Attente">En Attente</option>
           <option value="En Cours">En Cours</option>
           </select>
           <Button color="success" type="submit" style={{width: '40%', marginLeft: "23%"}}>Valider la modification</Button>
           </Form>
          </div>

        </ModalBody>
        <ModalFooter>
            <Button color="secondary" onClick={() => this.changeModalState(item)}>Annuler</Button>
        </ModalFooter>
      </Modal>
    </div>
       )

  }


  componentDidMount() {
    this._isMounted = true;
    const parsed = qs.parse(this.props.location.search, {parseNumbers: true});
    const page = parsed && parsed.page && typeof parsed.page === "number" ? parsed.page : 1;
    this.setState({
      page
    });
      loadSignals(page).then(response => {
        if (this._isMounted)
           this.setState({
             isLoading: true
           });
      if (response) {
        if (this._isMounted) {
          this.setState({
             isLoading: false,
             items: response
           })
           }
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.location.search !== this.props.location.search) {
      const parsed = qs.parse(this.props.location.search, {parseNumbers: true});
      const page = parsed && parsed.page && typeof parsed.page === "number" ? parsed.page : 1;
      if (this._isMounted)
        this.setState({
          page
        });
      console.log('page', page)
      loadSignals(page)
    }
  }

  renderPagination = () => {
    const { page, totalPage } = this.state

    let pagination = []
    for (let i = 1; i <= totalPage; i++) {
      pagination.push(
        <PaginationItem key={i} active={page === i}>
          <PaginationLink href={`#/signal?page=${i}`}>
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return <Pagination>{pagination}</Pagination>
  }

//Crate the signal list calls the signal row component
  createSignals = (signalsList) => {
    let  listItems = signalsList.map((signal, index) => <SignalRow key={index} signal={signal} click={this}/>)
    return listItems
  }

//Sort Signals by date function
   SortByDate = (listItems) => {
    console.log("SortByDate Function Trigged");
    //First condition => signals exists, second condition => the state is false ascending
    if (listItems !== undefined)
      if (this.state.isLoading === false) {
        //Sort by date
      listItems.sort((a, b) => {
          return new Date(b.props.signal.date) - new Date(a.props.signal.date)
        });
        const newState = this.state;
        //Update the states, crate Signals ordred and product Table
        listItems.forEach(function (item, index) {
          newState.items.data[index] = item.props.signal
         });
        this.setState({ items: newState.items,
                        isLoading: true });
        this.createSignals(listItems)
        this.ProductTable(listItems)
        //This condition for descending ordering
      } else if (this.state.isLoading === true) {
        listItems.sort((a, b) => {
            return new Date(a.props.signal.date) - new Date(b.props.signal.date)
          });
          const newState = this.state;
          listItems.forEach(function (item, index) {
            newState.items.data[index] = item.props.signal
           });
          this.setState({ items: newState.items,
                          isLoading: false});
          this.createSignals(listItems)
          this.ProductTable(listItems)
      }
      }


//Same as sort by date
      SortString = (listItems,type) => {
       if (listItems !== undefined)
       if (this.state.isLoading === false) {
//Sort on category area, Get all the strings to toUpperCase to avoid sorting conflicts
        if (type == 'category') {
         listItems.sort((a, b) => {
        if (a.props.signal.category.toUpperCase() < b.props.signal.category.toUpperCase()) {
          return -1;
        }
        if (a.props.signal.category.toUpperCase() > b.props.signal.category.toUpperCase()) {
          return 1;
        }
        return 0;
      });
//Sort on status area, Get all the strings to toUpperCase to avoid sorting conflicts
    } else if (type == 'status') {
        listItems.sort((a, b) => {
       if (a.props.signal.status.toUpperCase() < b.props.signal.status.toUpperCase()) {
         return -1;
       }
       if (a.props.signal.status.toUpperCase() > b.props.signal.status.toUpperCase()) {
         return 1;
       }
       return 0;
     });
//Sort on name area, Get all the strings to toUpperCase to avoid sorting conflicts
    } else if (type == 'name') {
        listItems.sort((a, b) => {
       if (a.props.signal.name.toUpperCase() < b.props.signal.name.toUpperCase()) {
         return -1;
       }
       if (a.props.signal.name.toUpperCase() > b.props.signal.name.toUpperCase()) {
         return 1;
       }
       return 0;
     });
    }

//Update state, create new ordred signals and product new table
      const newState = this.state;
      listItems.forEach(function (item, index) {
        newState.items.data[index] = item.props.signal
       });
      this.setState({ items: newState.items,
                      isLoading: true });
      this.createSignals(listItems)
      this.ProductTable(listItems)

//In case of descending ordering
    } else if (this.state.isLoading === true) {

        if (type == 'category') {
         listItems.sort((a, b) => {
           if (a.props.signal.category.toUpperCase() < b.props.signal.category.toUpperCase()) {
                 return 1;
                 }
           if (a.props.signal.category.toUpperCase() > b.props.signal.category.toUpperCase()) {
               return -1;
               }
               return 0;
             });
        } else if (type == 'status') {
          listItems.sort((a, b) => {
          if (a.props.signal.status.toUpperCase() < b.props.signal.status.toUpperCase()) {
                return 1;
                }
          if (a.props.signal.status.toUpperCase() > b.props.signal.status.toUpperCase()) {
              return -1;
              }
              return 0;
            });
        } else if (type == 'name') {
          listItems.sort((a, b) => {
          if (a.props.signal.name.toUpperCase() < b.props.signal.name.toUpperCase()) {
                return 1;
                }
          if (a.props.signal.name.toUpperCase() > b.props.signal.name.toUpperCase()) {
              return -1;
              }
              return 0;
            });
        }

             const newState = this.state;
             listItems.forEach(function (item, index) {
               newState.items.data[index] = item.props.signal
              });
             this.setState({ items: newState.items,
                             isLoading: false });
             this.createSignals(listItems)
             this.ProductTable(listItems)
            }

     }

//Load single signal used to update the signal
     loadSignalfunction = (signalId) => {
       if(signalId.length === undefined)
       signalId = signalId._id

       loadSignal(signalId).then(response => {
       if (response) {
          if (this._isMounted) {
           this.setState({
              isLoading: false,
              signalModal: response.data
            })
             }
         console.log(response);
         return response.data
       }
     })
     }

//Creates the Table and the the sorting methods, the modal and the list of signals
ProductTable = (listItems) => {
  return(
  <Table responsive hover striped>
    <thead>
    <tr>
      <th scope="col" onClick={() => this.SortString(listItems,'name')}><div>Nom<img src={sortArrow} alt="sort" style={{width:'10px', marginLeft:'4px'}}/></div></th>
      <th scope="col" onClick={() => this.SortByDate(listItems)}><div>Date<img src={sortArrow} alt="sort" style={{width:'10px', marginLeft:'4px'}}/></div></th>
      <th scope="col" onClick={() => this.SortByDate(listItems)}><div>Date de création<img src={sortArrow} alt="sort" style={{width:'10px', marginLeft:'4px'}}/></div></th>
      <th scope="col" onClick={() => this.SortByDate(listItems)}><div>Dernière modification<img src={sortArrow} alt="sort" style={{width:'10px', marginLeft:'4px'}}/></div></th>
      <th scope="col" onClick={() => this.SortString(listItems,'status')}><div>Status<img src={sortArrow} alt="sort" style={{width:'10px', marginLeft:'4px'}}/></div></th>
      <th scope="col" onClick={() => this.SortString(listItems,'category')}><div>Categorie<img src={sortArrow} alt="sort" style={{width:'10px', marginLeft:'4px'}}/></div></th>
      <th scope="col"><div>Action</div></th>

    </tr>
    </thead>
    <tbody>
    {listItems}
    {this.createModal(this.state.signalModalId)}
    </tbody>
  </Table>
  )
}

//The render, gets the signals list, producters the table
  render() {
    let signalsList = this.state;
    console.log(this.state);
    let listItems
    if (signalsList.items.data) {
          signalsList = signalsList.items.data
          listItems = this.createSignals(signalsList)
      }
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Signalements <small className="text-muted">{signalsList.length}</small>
              </CardHeader>
              <CardBody>
                {this.ProductTable(listItems)}
              </CardBody>
            </Card>
          </Col>
          <Col xl={12}>
            {this.renderPagination()}
          </Col>
        </Row>
      </div>
    )
  }
}

export default Signals;
