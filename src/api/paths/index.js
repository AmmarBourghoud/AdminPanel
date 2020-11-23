//BASE_PATH
export const BASE_PATH = "https://contribute-api.herokuapp.com/";

//REGISTER
export const REGISTER = "register";

//LOGIN
export const LOGIN = "login";

//SIGNALS
export const SIGNALS = "signal";

//SIGNAL
export var SIGNAL = (signal_id) => `signal/${signal_id}`

//USER_SIGNALID
export var USER_SIGNALID = (signal_id) => `user/${signal_id}`

//SIGNAL_AUTHOR
export var SIGNAL_AUTHOR = (signal_author) => `user/${signal_author}`

//SIGNAL_COMMENTS
export var SIGNAL_COMMENTS = (signal_id) => `comment/signal/${signal_id}`

//MAP_TOKEN
export const MAP_TOKEN = "pk.eyJ1IjoiY2VjZW5uYmwiLCJhIjoiY2s1ZjRlaHpxMGN2cTNybGNhcDBnZXlobSJ9.lhP6L3pVC1NIqDZeRP4uLg"

//MAP_TOKEN
export const MAP_IMAGE = "https://i.imgur.com/MK4NUzI.png"
