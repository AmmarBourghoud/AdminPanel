import axios from 'axios'
import { BASE_PATH, SIGNALS, SIGNAL, SIGNAL_AUTHOR, SIGNAL_COMMENTS, USER_SIGNALID } from '../paths/index'

//Load all signals
export function loadSignals(page){
  return axios
     .get(BASE_PATH + SIGNALS)
     .then(response => {
       console.log(response);
       return response
        })
      .catch(err => {
           console.log(err)
      })
}

//Load single signal
export function loadSignal(signal_id) {
  return axios
      .get(BASE_PATH + SIGNAL(signal_id))
      .then(response => {
        // console.log(response)
        return response
      })
      .catch(err => {
        console.log('err', err);
      })
  }

//Update Signal status
  export function updateSignal(signal_id, newSignal) {
    return axios
        .patch(BASE_PATH + SIGNAL(signal_id), {
          category: newSignal.category,
          description: newSignal.description,
          status: newSignal.status
        }, {
          headers: {'Content-Type': 'application/json' }
        })
        .then(response => {
           console.log(response)
          return response
        })
        .catch(err => {
          console.log('err', err);
        })
    }

//Load signal author
export function loadSignal_author(signal_author) {
  return axios
  .get(BASE_PATH + SIGNAL_AUTHOR(signal_author))
   .then(res => {
       console.log(res);
      return res
    })
    .catch(err => {
      console.log('err', err);
    })
}

//load signal comments
export function loadSignal_comments(signal_id) {
  return axios
  .get(BASE_PATH + SIGNAL_COMMENTS(signal_id))
   .then(res => {
      // console.log(res);
      return res
    })
    .catch(err => {
      console.log('err', err);
    })
}

//Load all signals to map
export function loadSignalsToMap(){
  return axios
     .get(BASE_PATH + SIGNALS)
     .then(response => {
       console.log(response);
       return response
        })
      .catch(err => {
           console.log(err)
      })
}
