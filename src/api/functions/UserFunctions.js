import axios from 'axios'
import { BASE_PATH, LOGIN, REGISTER } from '../paths/index'

//Register function
export const register = newUser => {
  return axios
    .post(BASE_PATH + REGISTER, {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      me: newUser.me,
      phone: newUser.phone,
      address: newUser.address,
      email: newUser.email,
      password: newUser.password
    })
    .then(response => {
      console.log('Registered')
    })
    .catch(err => {
      console.log(newUser);
      console.log(err)
    })
}

// Login function
export const login = user => {
  return axios
    .post(BASE_PATH + LOGIN, {
      email: user.email,
      password: user.password
    })
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
      return err;
    })
}
