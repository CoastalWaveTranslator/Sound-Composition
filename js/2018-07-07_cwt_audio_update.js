/* ------------------------------

Co•–st•–l W•–ve Tr•–nsl•–tor
Art installation by Kynan Tan + Devon Ward
Web Audio API javascript code

------------------------------ */

var initialised = 0;

// variables for Web Audio
var AudioContext = window.AudioContext;
var lowCut;

var frameCount;
var myArrayBuffer;

var audioCtx;
var mix;
var analyser;

// variables for scheduling and sequencing
var currentPreset;
var noteLength;

var presetIncrement = 0;

var lookahead = 100;       // this is how frequently to check for notes that need to be scheduled
var scheduleTime = 0.75;   // schedule notes this far into the future (s)

var pi = 1;

var morseVal2 = 0;
var morseVal3 = 0;
var morse3Index = 1;
var morse2Index = 1;

// seq means we are using the data input to sequence notes
var seq = true;

var refreshTime = 10 * 60 * 1000;

// var osc1, osc2, osc3, osc4;
// var gn1, gn2, gn3, gn4;

// multiple any oscillators that are modulators by this factor
var modFactor = 24.0;

var index = 1;


/* ------------------------------
  data test set stored as variables, for testing when not connected to data
  ------------------------------*/

// first buoy text
// var text = '{"52403":[{"timestamp":"2016-12-19 03:00:00","height":"4439.304"},{"timestamp":"2016-12-19 02:45:00","height":"4439.265"},{"timestamp":"2016-12-19 02:30:00","height":"4439.224"},{"timestamp":"2016-12-19 02:15:00","height":"4439.181"},{"timestamp":"2016-12-19 02:00:00","height":"4439.142"},{"timestamp":"2016-12-19 01:45:00","height":"4439.1"},{"timestamp":"2016-12-19 01:30:00","height":"4439.058"},{"timestamp":"2016-12-19 01:15:00","height":"4439.016"},{"timestamp":"2016-12-19 01:00:00","height":"4438.978"},{"timestamp":"2016-12-19 00:45:00","height":"4438.943"},{"timestamp":"2016-12-19 00:30:00","height":"4438.904"},{"timestamp":"2016-12-19 00:15:00","height":"4438.872"},{"timestamp":"2016-12-19 00:00:00","height":"4438.842"},{"timestamp":"2016-12-18 23:45:00","height":"4438.816"},{"timestamp":"2016-12-18 23:30:00","height":"4438.794"},{"timestamp":"2016-12-18 23:15:00","height":"4438.78"},{"timestamp":"2016-12-18 23:00:00","height":"4438.764"},{"timestamp":"2016-12-18 22:45:00","height":"4438.753"},{"timestamp":"2016-12-18 22:30:00","height":"4438.747"},{"timestamp":"2016-12-18 22:15:00","height":"4438.745"},{"timestamp":"2016-12-18 22:00:00","height":"4438.749"},{"timestamp":"2016-12-18 21:45:00","height":"4438.756"},{"timestamp":"2016-12-18 21:30:00","height":"4438.767"},{"timestamp":"2016-12-18 21:15:00","height":"4438.783"},{"timestamp":"2016-12-18 21:00:00","height":"4438.799"},{"timestamp":"2016-12-18 20:45:00","height":"4438.819"},{"timestamp":"2016-12-18 20:30:00","height":"4438.839"},{"timestamp":"2016-12-18 20:15:00","height":"4438.868"},{"timestamp":"2016-12-18 20:00:00","height":"4438.898"},{"timestamp":"2016-12-18 19:45:00","height":"4438.927"},{"timestamp":"2016-12-18 19:30:00","height":"4438.959"},{"timestamp":"2016-12-18 19:15:00","height":"4438.997"},{"timestamp":"2016-12-18 19:00:00","height":"4439.032"},{"timestamp":"2016-12-18 18:45:00","height":"4439.069"},{"timestamp":"2016-12-18 18:30:00","height":"4439.105"},{"timestamp":"2016-12-18 18:15:00","height":"4439.137"},{"timestamp":"2016-12-18 18:00:00","height":"4439.169"},{"timestamp":"2016-12-18 17:45:00","height":"4439.202"},{"timestamp":"2016-12-18 17:30:00","height":"4439.232"},{"timestamp":"2016-12-18 17:15:00","height":"4439.261"},{"timestamp":"2016-12-18 17:00:00","height":"4439.283"},{"timestamp":"2016-12-18 16:45:00","height":"4439.307"},{"timestamp":"2016-12-18 16:30:00","height":"4439.328"},{"timestamp":"2016-12-18 16:15:00","height":"4439.345"},{"timestamp":"2016-12-18 16:00:00","height":"4439.355"},{"timestamp":"2016-12-18 15:45:00","height":"4439.364"},{"timestamp":"2016-12-18 15:30:00","height":"4439.372"},{"timestamp":"2016-12-18 15:15:00","height":"4439.378"},{"timestamp":"2016-12-18 15:00:00","height":"4439.375"},{"timestamp":"2016-12-18 14:45:00","height":"4439.373"},{"timestamp":"2016-12-18 14:30:00","height":"4439.371"},{"timestamp":"2016-12-18 14:15:00","height":"4439.366"},{"timestamp":"2016-12-18 14:00:00","height":"4439.36"},{"timestamp":"2016-12-18 13:45:00","height":"4439.351"},{"timestamp":"2016-12-18 13:30:00","height":"4439.34"},{"timestamp":"2016-12-18 13:15:00","height":"4439.326"},{"timestamp":"2016-12-18 13:00:00","height":"4439.316"},{"timestamp":"2016-12-18 12:45:00","height":"4439.309"},{"timestamp":"2016-12-18 12:30:00","height":"4439.299"},{"timestamp":"2016-12-18 12:15:00","height":"4439.291"},{"timestamp":"2016-12-18 12:00:00","height":"4439.285"},{"timestamp":"2016-12-18 11:45:00","height":"4439.279"},{"timestamp":"2016-12-18 11:30:00","height":"4439.272"},{"timestamp":"2016-12-18 11:15:00","height":"4439.269"},{"timestamp":"2016-12-18 11:00:00","height":"4439.272"},{"timestamp":"2016-12-18 10:45:00","height":"4439.273"},{"timestamp":"2016-12-18 10:30:00","height":"4439.281"},{"timestamp":"2016-12-18 10:15:00","height":"4439.287"},{"timestamp":"2016-12-18 10:00:00","height":"4439.296"},{"timestamp":"2016-12-18 09:45:00","height":"4439.312"},{"timestamp":"2016-12-18 09:30:00","height":"4439.327"},{"timestamp":"2016-12-18 09:15:00","height":"4439.34"},{"timestamp":"2016-12-18 09:00:00","height":"4439.357"},{"timestamp":"2016-12-18 08:45:00","height":"4439.372"},{"timestamp":"2016-12-18 08:30:00","height":"4439.388"},{"timestamp":"2016-12-18 08:15:00","height":"4439.403"},{"timestamp":"2016-12-18 08:00:00","height":"4439.421"},{"timestamp":"2016-12-18 07:45:00","height":"4439.438"},{"timestamp":"2016-12-18 07:30:00","height":"4439.452"},{"timestamp":"2016-12-18 07:15:00","height":"4439.471"},{"timestamp":"2016-12-18 07:00:00","height":"4439.487"},{"timestamp":"2016-12-18 06:45:00","height":"4439.499"},{"timestamp":"2016-12-18 06:30:00","height":"4439.513"},{"timestamp":"2016-12-18 06:15:00","height":"4439.526"},{"timestamp":"2016-12-18 06:00:00","height":"4439.533"},{"timestamp":"2016-12-18 05:45:00","height":"4439.538"},{"timestamp":"2016-12-18 05:30:00","height":"4439.542"},{"timestamp":"2016-12-18 05:15:00","height":"4439.54"},{"timestamp":"2016-12-18 05:00:00","height":"4439.538"},{"timestamp":"2016-12-18 04:45:00","height":"4439.531"},{"timestamp":"2016-12-18 04:30:00","height":"4439.521"},{"timestamp":"2016-12-18 04:15:00","height":"4439.508"},{"timestamp":"2016-12-18 04:00:00","height":"4439.492"},{"timestamp":"2016-12-18 03:45:00","height":"4439.468"},{"timestamp":"2016-12-18 03:30:00","height":"4439.441"},{"timestamp":"2016-12-18 03:15:00","height":"4439.41"},{"timestamp":"2016-12-18 03:00:00","height":"4439.376"},{"timestamp":"2016-12-18 02:45:00","height":"4439.338"},{"timestamp":"2016-12-18 02:30:00","height":"4439.301"},{"timestamp":"2016-12-18 02:15:00","height":"4439.261"}]}';

// full text
var text = '{"52403":[{"timestamp":"2016-12-19 03:00:00","height":"4439.304"},{"timestamp":"2016-12-19 02:45:00","height":"4439.265"},{"timestamp":"2016-12-19 02:30:00","height":"4439.224"},{"timestamp":"2016-12-19 02:15:00","height":"4439.181"},{"timestamp":"2016-12-19 02:00:00","height":"4439.142"},{"timestamp":"2016-12-19 01:45:00","height":"4439.1"},{"timestamp":"2016-12-19 01:30:00","height":"4439.058"},{"timestamp":"2016-12-19 01:15:00","height":"4439.016"},{"timestamp":"2016-12-19 01:00:00","height":"4438.978"},{"timestamp":"2016-12-19 00:45:00","height":"4438.943"},{"timestamp":"2016-12-19 00:30:00","height":"4438.904"},{"timestamp":"2016-12-19 00:15:00","height":"4438.872"},{"timestamp":"2016-12-19 00:00:00","height":"4438.842"},{"timestamp":"2016-12-18 23:45:00","height":"4438.816"},{"timestamp":"2016-12-18 23:30:00","height":"4438.794"},{"timestamp":"2016-12-18 23:15:00","height":"4438.78"},{"timestamp":"2016-12-18 23:00:00","height":"4438.764"},{"timestamp":"2016-12-18 22:45:00","height":"4438.753"},{"timestamp":"2016-12-18 22:30:00","height":"4438.747"},{"timestamp":"2016-12-18 22:15:00","height":"4438.745"},{"timestamp":"2016-12-18 22:00:00","height":"4438.749"},{"timestamp":"2016-12-18 21:45:00","height":"4438.756"},{"timestamp":"2016-12-18 21:30:00","height":"4438.767"},{"timestamp":"2016-12-18 21:15:00","height":"4438.783"},{"timestamp":"2016-12-18 21:00:00","height":"4438.799"},{"timestamp":"2016-12-18 20:45:00","height":"4438.819"},{"timestamp":"2016-12-18 20:30:00","height":"4438.839"},{"timestamp":"2016-12-18 20:15:00","height":"4438.868"},{"timestamp":"2016-12-18 20:00:00","height":"4438.898"},{"timestamp":"2016-12-18 19:45:00","height":"4438.927"},{"timestamp":"2016-12-18 19:30:00","height":"4438.959"},{"timestamp":"2016-12-18 19:15:00","height":"4438.997"},{"timestamp":"2016-12-18 19:00:00","height":"4439.032"},{"timestamp":"2016-12-18 18:45:00","height":"4439.069"},{"timestamp":"2016-12-18 18:30:00","height":"4439.105"},{"timestamp":"2016-12-18 18:15:00","height":"4439.137"},{"timestamp":"2016-12-18 18:00:00","height":"4439.169"},{"timestamp":"2016-12-18 17:45:00","height":"4439.202"},{"timestamp":"2016-12-18 17:30:00","height":"4439.232"},{"timestamp":"2016-12-18 17:15:00","height":"4439.261"},{"timestamp":"2016-12-18 17:00:00","height":"4439.283"},{"timestamp":"2016-12-18 16:45:00","height":"4439.307"},{"timestamp":"2016-12-18 16:30:00","height":"4439.328"},{"timestamp":"2016-12-18 16:15:00","height":"4439.345"},{"timestamp":"2016-12-18 16:00:00","height":"4439.355"},{"timestamp":"2016-12-18 15:45:00","height":"4439.364"},{"timestamp":"2016-12-18 15:30:00","height":"4439.372"},{"timestamp":"2016-12-18 15:15:00","height":"4439.378"},{"timestamp":"2016-12-18 15:00:00","height":"4439.375"},{"timestamp":"2016-12-18 14:45:00","height":"4439.373"},{"timestamp":"2016-12-18 14:30:00","height":"4439.371"},{"timestamp":"2016-12-18 14:15:00","height":"4439.366"},{"timestamp":"2016-12-18 14:00:00","height":"4439.36"},{"timestamp":"2016-12-18 13:45:00","height":"4439.351"},{"timestamp":"2016-12-18 13:30:00","height":"4439.34"},{"timestamp":"2016-12-18 13:15:00","height":"4439.326"},{"timestamp":"2016-12-18 13:00:00","height":"4439.316"},{"timestamp":"2016-12-18 12:45:00","height":"4439.309"},{"timestamp":"2016-12-18 12:30:00","height":"4439.299"},{"timestamp":"2016-12-18 12:15:00","height":"4439.291"},{"timestamp":"2016-12-18 12:00:00","height":"4439.285"},{"timestamp":"2016-12-18 11:45:00","height":"4439.279"},{"timestamp":"2016-12-18 11:30:00","height":"4439.272"},{"timestamp":"2016-12-18 11:15:00","height":"4439.269"},{"timestamp":"2016-12-18 11:00:00","height":"4439.272"},{"timestamp":"2016-12-18 10:45:00","height":"4439.273"},{"timestamp":"2016-12-18 10:30:00","height":"4439.281"},{"timestamp":"2016-12-18 10:15:00","height":"4439.287"},{"timestamp":"2016-12-18 10:00:00","height":"4439.296"},{"timestamp":"2016-12-18 09:45:00","height":"4439.312"},{"timestamp":"2016-12-18 09:30:00","height":"4439.327"},{"timestamp":"2016-12-18 09:15:00","height":"4439.34"},{"timestamp":"2016-12-18 09:00:00","height":"4439.357"},{"timestamp":"2016-12-18 08:45:00","height":"4439.372"},{"timestamp":"2016-12-18 08:30:00","height":"4439.388"},{"timestamp":"2016-12-18 08:15:00","height":"4439.403"},{"timestamp":"2016-12-18 08:00:00","height":"4439.421"},{"timestamp":"2016-12-18 07:45:00","height":"4439.438"},{"timestamp":"2016-12-18 07:30:00","height":"4439.452"},{"timestamp":"2016-12-18 07:15:00","height":"4439.471"},{"timestamp":"2016-12-18 07:00:00","height":"4439.487"},{"timestamp":"2016-12-18 06:45:00","height":"4439.499"},{"timestamp":"2016-12-18 06:30:00","height":"4439.513"},{"timestamp":"2016-12-18 06:15:00","height":"4439.526"},{"timestamp":"2016-12-18 06:00:00","height":"4439.533"},{"timestamp":"2016-12-18 05:45:00","height":"4439.538"},{"timestamp":"2016-12-18 05:30:00","height":"4439.542"},{"timestamp":"2016-12-18 05:15:00","height":"4439.54"},{"timestamp":"2016-12-18 05:00:00","height":"4439.538"},{"timestamp":"2016-12-18 04:45:00","height":"4439.531"},{"timestamp":"2016-12-18 04:30:00","height":"4439.521"},{"timestamp":"2016-12-18 04:15:00","height":"4439.508"},{"timestamp":"2016-12-18 04:00:00","height":"4439.492"},{"timestamp":"2016-12-18 03:45:00","height":"4439.468"},{"timestamp":"2016-12-18 03:30:00","height":"4439.441"},{"timestamp":"2016-12-18 03:15:00","height":"4439.41"},{"timestamp":"2016-12-18 03:00:00","height":"4439.376"},{"timestamp":"2016-12-18 02:45:00","height":"4439.338"},{"timestamp":"2016-12-18 02:30:00","height":"4439.301"},{"timestamp":"2016-12-18 02:15:00","height":"4439.261"}],"56001":[{"timestamp":"2016-12-19 02:00:00","height":"5652.462"},{"timestamp":"2016-12-19 01:45:00","height":"5652.471"},{"timestamp":"2016-12-19 01:30:00","height":"5652.489"},{"timestamp":"2016-12-19 01:15:00","height":"5652.517"},{"timestamp":"2016-12-19 01:00:00","height":"5652.554"},{"timestamp":"2016-12-19 00:45:00","height":"5652.604"},{"timestamp":"2016-12-19 00:30:00","height":"5652.661"},{"timestamp":"2016-12-19 00:15:00","height":"5652.725"},{"timestamp":"2016-12-19 00:00:00","height":"5652.796"},{"timestamp":"2016-12-18 23:45:00","height":"5652.878"},{"timestamp":"2016-12-18 23:30:00","height":"5652.964"},{"timestamp":"2016-12-18 23:15:00","height":"5653.056"},{"timestamp":"2016-12-18 23:00:00","height":"5653.15"},{"timestamp":"2016-12-18 22:45:00","height":"5653.246"},{"timestamp":"2016-12-18 22:30:00","height":"5653.342"},{"timestamp":"2016-12-18 22:15:00","height":"5653.438"},{"timestamp":"2016-12-18 22:00:00","height":"5653.53"},{"timestamp":"2016-12-18 21:45:00","height":"5653.618"},{"timestamp":"2016-12-18 21:30:00","height":"5653.699"},{"timestamp":"2016-12-18 21:15:00","height":"5653.776"},{"timestamp":"2016-12-18 21:00:00","height":"5653.845"},{"timestamp":"2016-12-18 20:45:00","height":"5653.907"},{"timestamp":"2016-12-18 20:30:00","height":"5653.959"},{"timestamp":"2016-12-18 20:15:00","height":"5654.002"},{"timestamp":"2016-12-18 20:00:00","height":"5654.037"},{"timestamp":"2016-12-18 19:45:00","height":"5654.063"},{"timestamp":"2016-12-18 19:30:00","height":"5654.079"},{"timestamp":"2016-12-18 19:15:00","height":"5654.083"},{"timestamp":"2016-12-18 19:00:00","height":"5654.076"},{"timestamp":"2016-12-18 18:45:00","height":"5654.06"},{"timestamp":"2016-12-18 18:30:00","height":"5654.031"},{"timestamp":"2016-12-18 18:15:00","height":"5653.997"},{"timestamp":"2016-12-18 18:00:00","height":"5653.951"},{"timestamp":"2016-12-18 17:45:00","height":"5653.9"},{"timestamp":"2016-12-18 17:30:00","height":"5653.836"},{"timestamp":"2016-12-18 17:15:00","height":"5653.767"},{"timestamp":"2016-12-18 17:00:00","height":"5653.696"},{"timestamp":"2016-12-18 16:45:00","height":"5653.62"},{"timestamp":"2016-12-18 16:30:00","height":"5653.541"},{"timestamp":"2016-12-18 16:15:00","height":"5653.463"},{"timestamp":"2016-12-18 16:00:00","height":"5653.381"},{"timestamp":"2016-12-18 15:45:00","height":"5653.301"},{"timestamp":"2016-12-18 15:30:00","height":"5653.226"},{"timestamp":"2016-12-18 15:15:00","height":"5653.156"},{"timestamp":"2016-12-18 15:00:00","height":"5653.087"},{"timestamp":"2016-12-18 14:45:00","height":"5653.025"},{"timestamp":"2016-12-18 14:30:00","height":"5652.972"},{"timestamp":"2016-12-18 14:15:00","height":"5652.927"},{"timestamp":"2016-12-18 14:00:00","height":"5652.888"},{"timestamp":"2016-12-18 13:45:00","height":"5652.862"},{"timestamp":"2016-12-18 13:30:00","height":"5652.845"},{"timestamp":"2016-12-18 13:15:00","height":"5652.835"},{"timestamp":"2016-12-18 11:00:00","height":"5653.151"},{"timestamp":"2016-12-18 10:45:00","height":"5653.217"},{"timestamp":"2016-12-18 10:30:00","height":"5653.284"},{"timestamp":"2016-12-18 10:15:00","height":"5653.357"},{"timestamp":"2016-12-18 10:00:00","height":"5653.428"},{"timestamp":"2016-12-18 09:45:00","height":"5653.493"},{"timestamp":"2016-12-18 09:30:00","height":"5653.557"},{"timestamp":"2016-12-18 09:15:00","height":"5653.618"},{"timestamp":"2016-12-18 09:00:00","height":"5653.673"},{"timestamp":"2016-12-18 08:45:00","height":"5653.72"},{"timestamp":"2016-12-18 08:30:00","height":"5653.76"},{"timestamp":"2016-12-18 08:15:00","height":"5653.792"},{"timestamp":"2016-12-18 08:00:00","height":"5653.815"},{"timestamp":"2016-12-18 07:45:00","height":"5653.826"},{"timestamp":"2016-12-18 07:30:00","height":"5653.824"},{"timestamp":"2016-12-18 07:15:00","height":"5653.818"},{"timestamp":"2016-12-18 07:00:00","height":"5653.799"},{"timestamp":"2016-12-18 06:45:00","height":"5653.767"},{"timestamp":"2016-12-18 06:30:00","height":"5653.728"},{"timestamp":"2016-12-18 06:15:00","height":"5653.678"},{"timestamp":"2016-12-18 06:00:00","height":"5653.619"},{"timestamp":"2016-12-18 05:45:00","height":"5653.551"},{"timestamp":"2016-12-18 05:30:00","height":"5653.478"},{"timestamp":"2016-12-18 05:15:00","height":"5653.395"},{"timestamp":"2016-12-18 05:00:00","height":"5653.309"},{"timestamp":"2016-12-18 04:45:00","height":"5653.219"},{"timestamp":"2016-12-18 04:30:00","height":"5653.128"},{"timestamp":"2016-12-18 04:15:00","height":"5653.034"},{"timestamp":"2016-12-18 04:00:00","height":"5652.937"},{"timestamp":"2016-12-18 03:45:00","height":"5652.846"},{"timestamp":"2016-12-18 03:30:00","height":"5652.757"},{"timestamp":"2016-12-18 03:15:00","height":"5652.677"},{"timestamp":"2016-12-18 03:00:00","height":"5652.6"},{"timestamp":"2016-12-18 02:45:00","height":"5652.533"},{"timestamp":"2016-12-18 02:30:00","height":"5652.476"},{"timestamp":"2016-12-18 02:15:00","height":"5652.427"},{"timestamp":"2016-12-18 02:00:00","height":"5652.39"},{"timestamp":"2016-12-18 01:45:00","height":"5652.367"},{"timestamp":"2016-12-18 01:30:00","height":"5652.355"},{"timestamp":"2016-12-18 01:15:00","height":"5652.354"},{"timestamp":"2016-12-18 01:00:00","height":"5652.366"},{"timestamp":"2016-12-18 00:45:00","height":"5652.393"},{"timestamp":"2016-12-18 00:30:00","height":"5652.431"},{"timestamp":"2016-12-18 00:15:00","height":"5652.481"},{"timestamp":"2016-12-18 00:00:00","height":"5652.54"},{"timestamp":"2016-12-17 23:45:00","height":"5652.61"},{"timestamp":"2016-12-17 23:30:00","height":"5652.688"},{"timestamp":"2016-12-17 23:15:00","height":"5652.777"}],"52406":[{"timestamp":"2016-12-19 03:00:00","height":"1764.013"},{"timestamp":"2016-12-19 02:45:00","height":"1764.052"},{"timestamp":"2016-12-19 02:30:00","height":"1764.092"},{"timestamp":"2016-12-19 02:15:00","height":"1764.133"},{"timestamp":"2016-12-19 02:00:00","height":"1764.176"},{"timestamp":"2016-12-19 01:45:00","height":"1764.216"},{"timestamp":"2016-12-19 01:30:00","height":"1764.258"},{"timestamp":"2016-12-19 01:15:00","height":"1764.293"},{"timestamp":"2016-12-19 01:00:00","height":"1764.319"},{"timestamp":"2016-12-19 00:45:00","height":"1764.347"},{"timestamp":"2016-12-19 00:30:00","height":"1764.366"},{"timestamp":"2016-12-19 00:15:00","height":"1764.382"},{"timestamp":"2016-12-19 00:00:00","height":"1764.398"},{"timestamp":"2016-12-18 23:45:00","height":"1764.404"},{"timestamp":"2016-12-18 23:30:00","height":"1764.4"},{"timestamp":"2016-12-18 23:15:00","height":"1764.391"},{"timestamp":"2016-12-18 23:00:00","height":"1764.372"},{"timestamp":"2016-12-18 22:45:00","height":"1764.349"},{"timestamp":"2016-12-18 22:30:00","height":"1764.317"},{"timestamp":"2016-12-18 22:15:00","height":"1764.281"},{"timestamp":"2016-12-18 22:00:00","height":"1764.242"},{"timestamp":"2016-12-18 21:45:00","height":"1764.194"},{"timestamp":"2016-12-18 21:30:00","height":"1764.144"},{"timestamp":"2016-12-18 21:15:00","height":"1764.092"},{"timestamp":"2016-12-18 21:00:00","height":"1764.038"},{"timestamp":"2016-12-18 20:45:00","height":"1763.978"},{"timestamp":"2016-12-18 20:30:00","height":"1763.922"},{"timestamp":"2016-12-18 20:15:00","height":"1763.865"},{"timestamp":"2016-12-18 20:00:00","height":"1763.808"},{"timestamp":"2016-12-18 19:45:00","height":"1763.756"},{"timestamp":"2016-12-18 19:30:00","height":"1763.705"},{"timestamp":"2016-12-18 19:15:00","height":"1763.66"},{"timestamp":"2016-12-18 19:00:00","height":"1763.617"},{"timestamp":"2016-12-18 18:45:00","height":"1763.58"},{"timestamp":"2016-12-18 18:30:00","height":"1763.541"},{"timestamp":"2016-12-18 18:15:00","height":"1763.512"},{"timestamp":"2016-12-18 18:00:00","height":"1763.492"},{"timestamp":"2016-12-18 17:45:00","height":"1763.476"},{"timestamp":"2016-12-18 17:30:00","height":"1763.474"},{"timestamp":"2016-12-18 17:15:00","height":"1763.479"},{"timestamp":"2016-12-18 17:00:00","height":"1763.49"},{"timestamp":"2016-12-18 16:45:00","height":"1763.5"},{"timestamp":"2016-12-18 16:30:00","height":"1763.522"},{"timestamp":"2016-12-18 16:15:00","height":"1763.558"},{"timestamp":"2016-12-18 16:00:00","height":"1763.6"},{"timestamp":"2016-12-18 15:45:00","height":"1763.645"},{"timestamp":"2016-12-18 15:30:00","height":"1763.697"},{"timestamp":"2016-12-18 15:15:00","height":"1763.757"},{"timestamp":"2016-12-18 15:00:00","height":"1763.824"},{"timestamp":"2016-12-18 14:45:00","height":"1763.893"},{"timestamp":"2016-12-18 14:30:00","height":"1763.967"},{"timestamp":"2016-12-18 14:15:00","height":"1764.04"},{"timestamp":"2016-12-18 14:00:00","height":"1764.117"},{"timestamp":"2016-12-18 13:45:00","height":"1764.196"},{"timestamp":"2016-12-18 13:30:00","height":"1764.269"},{"timestamp":"2016-12-18 13:15:00","height":"1764.347"},{"timestamp":"2016-12-18 13:00:00","height":"1764.42"},{"timestamp":"2016-12-18 12:45:00","height":"1764.488"},{"timestamp":"2016-12-18 12:30:00","height":"1764.548"},{"timestamp":"2016-12-18 12:15:00","height":"1764.616"},{"timestamp":"2016-12-18 12:00:00","height":"1764.666"},{"timestamp":"2016-12-18 11:45:00","height":"1764.712"},{"timestamp":"2016-12-18 11:30:00","height":"1764.748"},{"timestamp":"2016-12-18 11:15:00","height":"1764.781"},{"timestamp":"2016-12-18 11:00:00","height":"1764.799"},{"timestamp":"2016-12-18 10:45:00","height":"1764.81"},{"timestamp":"2016-12-18 10:30:00","height":"1764.812"},{"timestamp":"2016-12-18 10:15:00","height":"1764.801"},{"timestamp":"2016-12-18 10:00:00","height":"1764.779"},{"timestamp":"2016-12-18 09:45:00","height":"1764.749"},{"timestamp":"2016-12-18 09:30:00","height":"1764.71"},{"timestamp":"2016-12-18 09:15:00","height":"1764.66"},{"timestamp":"2016-12-18 09:00:00","height":"1764.608"},{"timestamp":"2016-12-18 08:45:00","height":"1764.55"},{"timestamp":"2016-12-18 08:30:00","height":"1764.488"},{"timestamp":"2016-12-18 08:15:00","height":"1764.423"},{"timestamp":"2016-12-18 08:00:00","height":"1764.351"},{"timestamp":"2016-12-18 07:45:00","height":"1764.28"},{"timestamp":"2016-12-18 07:30:00","height":"1764.209"},{"timestamp":"2016-12-18 07:15:00","height":"1764.148"},{"timestamp":"2016-12-18 07:00:00","height":"1764.077"},{"timestamp":"2016-12-18 06:45:00","height":"1764.011"},{"timestamp":"2016-12-18 06:30:00","height":"1763.948"},{"timestamp":"2016-12-18 06:15:00","height":"1763.895"},{"timestamp":"2016-12-18 06:00:00","height":"1763.844"},{"timestamp":"2016-12-18 05:45:00","height":"1763.802"},{"timestamp":"2016-12-18 05:30:00","height":"1763.769"},{"timestamp":"2016-12-18 05:15:00","height":"1763.739"},{"timestamp":"2016-12-18 05:00:00","height":"1763.713"},{"timestamp":"2016-12-18 04:45:00","height":"1763.696"},{"timestamp":"2016-12-18 04:30:00","height":"1763.689"},{"timestamp":"2016-12-18 04:15:00","height":"1763.691"},{"timestamp":"2016-12-18 04:00:00","height":"1763.699"},{"timestamp":"2016-12-18 03:45:00","height":"1763.715"},{"timestamp":"2016-12-18 03:30:00","height":"1763.735"},{"timestamp":"2016-12-18 03:15:00","height":"1763.751"},{"timestamp":"2016-12-18 03:00:00","height":"1763.793"},{"timestamp":"2016-12-18 02:45:00","height":"1763.839"},{"timestamp":"2016-12-18 02:30:00","height":"1763.887"},{"timestamp":"2016-12-18 02:15:00","height":"1763.937"}],"51425":[{"timestamp":"2016-12-19 03:00:00","height":"1764.013"},{"timestamp":"2016-12-19 02:45:00","height":"1764.052"},{"timestamp":"2016-12-19 02:30:00","height":"1764.092"},{"timestamp":"2016-12-19 02:15:00","height":"1764.133"},{"timestamp":"2016-12-19 02:00:00","height":"1764.176"},{"timestamp":"2016-12-19 01:45:00","height":"1764.216"},{"timestamp":"2016-12-19 01:30:00","height":"1764.258"},{"timestamp":"2016-12-19 01:15:00","height":"1764.293"},{"timestamp":"2016-12-19 01:00:00","height":"1764.319"},{"timestamp":"2016-12-19 00:45:00","height":"1764.347"},{"timestamp":"2016-12-19 00:30:00","height":"1764.366"},{"timestamp":"2016-12-19 00:15:00","height":"1764.382"},{"timestamp":"2016-12-19 00:00:00","height":"1764.398"},{"timestamp":"2016-12-18 23:45:00","height":"1764.404"},{"timestamp":"2016-12-18 23:30:00","height":"1764.4"},{"timestamp":"2016-12-18 23:15:00","height":"1764.391"},{"timestamp":"2016-12-18 23:00:00","height":"1764.372"},{"timestamp":"2016-12-18 22:45:00","height":"1764.349"},{"timestamp":"2016-12-18 22:30:00","height":"1764.317"},{"timestamp":"2016-12-18 22:15:00","height":"1764.281"},{"timestamp":"2016-12-18 22:00:00","height":"1764.242"},{"timestamp":"2016-12-18 21:45:00","height":"1764.194"},{"timestamp":"2016-12-18 21:30:00","height":"1764.144"},{"timestamp":"2016-12-18 21:15:00","height":"1764.092"},{"timestamp":"2016-12-18 21:00:00","height":"1764.038"},{"timestamp":"2016-12-18 20:45:00","height":"1763.978"},{"timestamp":"2016-12-18 20:30:00","height":"1763.922"},{"timestamp":"2016-12-18 20:15:00","height":"1763.865"},{"timestamp":"2016-12-18 20:00:00","height":"1763.808"},{"timestamp":"2016-12-18 19:45:00","height":"1763.756"},{"timestamp":"2016-12-18 19:30:00","height":"1763.705"},{"timestamp":"2016-12-18 19:15:00","height":"1763.66"},{"timestamp":"2016-12-18 19:00:00","height":"1763.617"},{"timestamp":"2016-12-18 18:45:00","height":"1763.58"},{"timestamp":"2016-12-18 18:30:00","height":"1763.541"},{"timestamp":"2016-12-18 18:15:00","height":"1763.512"},{"timestamp":"2016-12-18 18:00:00","height":"1763.492"},{"timestamp":"2016-12-18 17:45:00","height":"1763.476"},{"timestamp":"2016-12-18 17:30:00","height":"1763.474"},{"timestamp":"2016-12-18 17:15:00","height":"1763.479"},{"timestamp":"2016-12-18 17:00:00","height":"1763.49"},{"timestamp":"2016-12-18 16:45:00","height":"1763.5"},{"timestamp":"2016-12-18 16:30:00","height":"1763.522"},{"timestamp":"2016-12-18 16:15:00","height":"1763.558"},{"timestamp":"2016-12-18 16:00:00","height":"1763.6"},{"timestamp":"2016-12-18 15:45:00","height":"1763.645"},{"timestamp":"2016-12-18 15:30:00","height":"1763.697"},{"timestamp":"2016-12-18 15:15:00","height":"1763.757"},{"timestamp":"2016-12-18 15:00:00","height":"1763.824"},{"timestamp":"2016-12-18 14:45:00","height":"1763.893"},{"timestamp":"2016-12-18 14:30:00","height":"1763.967"},{"timestamp":"2016-12-18 14:15:00","height":"1764.04"},{"timestamp":"2016-12-18 14:00:00","height":"1764.117"},{"timestamp":"2016-12-18 13:45:00","height":"1764.196"},{"timestamp":"2016-12-18 13:30:00","height":"1764.269"},{"timestamp":"2016-12-18 13:15:00","height":"1764.347"},{"timestamp":"2016-12-18 13:00:00","height":"1764.42"},{"timestamp":"2016-12-18 12:45:00","height":"1764.488"},{"timestamp":"2016-12-18 12:30:00","height":"1764.548"},{"timestamp":"2016-12-18 12:15:00","height":"1764.616"},{"timestamp":"2016-12-18 12:00:00","height":"1764.666"},{"timestamp":"2016-12-18 11:45:00","height":"1764.712"},{"timestamp":"2016-12-18 11:30:00","height":"1764.748"},{"timestamp":"2016-12-18 11:15:00","height":"1764.781"},{"timestamp":"2016-12-18 11:00:00","height":"1764.799"},{"timestamp":"2016-12-18 10:45:00","height":"1764.81"},{"timestamp":"2016-12-18 10:30:00","height":"1764.812"},{"timestamp":"2016-12-18 10:15:00","height":"1764.801"},{"timestamp":"2016-12-18 10:00:00","height":"1764.779"},{"timestamp":"2016-12-18 09:45:00","height":"1764.749"},{"timestamp":"2016-12-18 09:30:00","height":"1764.71"},{"timestamp":"2016-12-18 09:15:00","height":"1764.66"},{"timestamp":"2016-12-18 09:00:00","height":"1764.608"},{"timestamp":"2016-12-18 08:45:00","height":"1764.55"},{"timestamp":"2016-12-18 08:30:00","height":"1764.488"},{"timestamp":"2016-12-18 08:15:00","height":"1764.423"},{"timestamp":"2016-12-18 08:00:00","height":"1764.351"},{"timestamp":"2016-12-18 07:45:00","height":"1764.28"},{"timestamp":"2016-12-18 07:30:00","height":"1764.209"},{"timestamp":"2016-12-18 07:15:00","height":"1764.148"},{"timestamp":"2016-12-18 07:00:00","height":"1764.077"},{"timestamp":"2016-12-18 06:45:00","height":"1764.011"},{"timestamp":"2016-12-18 06:30:00","height":"1763.948"},{"timestamp":"2016-12-18 06:15:00","height":"1763.895"},{"timestamp":"2016-12-18 06:00:00","height":"1763.844"},{"timestamp":"2016-12-18 05:45:00","height":"1763.802"},{"timestamp":"2016-12-18 05:30:00","height":"1763.769"},{"timestamp":"2016-12-18 05:15:00","height":"1763.739"},{"timestamp":"2016-12-18 05:00:00","height":"1763.713"},{"timestamp":"2016-12-18 04:45:00","height":"1763.696"},{"timestamp":"2016-12-18 04:30:00","height":"1763.689"},{"timestamp":"2016-12-18 04:15:00","height":"1763.691"},{"timestamp":"2016-12-18 04:00:00","height":"1763.699"},{"timestamp":"2016-12-18 03:45:00","height":"1763.715"},{"timestamp":"2016-12-18 03:30:00","height":"1763.735"},{"timestamp":"2016-12-18 03:15:00","height":"1763.751"},{"timestamp":"2016-12-18 03:00:00","height":"1763.793"},{"timestamp":"2016-12-18 02:45:00","height":"1763.839"},{"timestamp":"2016-12-18 02:30:00","height":"1763.887"},{"timestamp":"2016-12-18 02:15:00","height":"1763.937"}]}';

// var newData = getData();

// only first 20 items of first buoy data
var text = '{"52403":[{"timestamp":"2016-12-19 03:00:00","height":"4439.304"},{"timestamp":"2016-12-19 02:45:00","height":"4439.265"},{"timestamp":"2016-12-19 02:30:00","height":"4439.224"},{"timestamp":"2016-12-19 02:15:00","height":"4439.181"},{"timestamp":"2016-12-19 02:00:00","height":"4439.142"},{"timestamp":"2016-12-19 01:45:00","height":"4439.1"},{"timestamp":"2016-12-19 01:30:00","height":"4439.058"},{"timestamp":"2016-12-19 01:15:00","height":"4439.016"},{"timestamp":"2016-12-19 01:00:00","height":"4438.978"},{"timestamp":"2016-12-19 00:45:00","height":"4438.943"},{"timestamp":"2016-12-19 00:30:00","height":"4438.904"},{"timestamp":"2016-12-19 00:15:00","height":"4438.872"},{"timestamp":"2016-12-19 00:00:00","height":"4438.842"},{"timestamp":"2016-12-18 23:45:00","height":"4438.816"},{"timestamp":"2016-12-18 23:30:00","height":"4438.794"},{"timestamp":"2016-12-18 23:15:00","height":"4438.78"},{"timestamp":"2016-12-18 23:00:00","height":"4438.764"},{"timestamp":"2016-12-18 22:45:00","height":"4438.753"},{"timestamp":"2016-12-18 22:30:00","height":"4438.747"},{"timestamp":"2016-12-18 22:15:00","height":"4438.745"}]}';


/* ------------------------------
  variables for morse
  ------------------------------ */

var morseobj = '{"letters":[{ "A": ".-","B": "-...","C": "-.-.","D": "-..","E": ".", "F": "..-.","G": "--.","H": "....","I": "..","J": ".---","K": "-.-","L": ".-..","M": "--","N": "-.","O": "---","P": ".--.","Q": "--.-","R": ".-.","S": "...","T": "-","U": "..-","V": "...-","W": ".--","X": "-..-","Y": "-.--","Z": "--..","1": ".----","2": "..---","3": "...--","4": "....-","5": ".....","6": "-....","7": "--...","8": "---..","9": "----.","0": "-----"}],"numbers":[{"1": ".-","2": "-...","3": "-.-.","4": "-..","5": ".","6": "..-.","7": "--.","8": "....","9": "..","10": ".---","11": "-.-","12": ".-..","13": "--","14": "-.","15": "---","16": ".--.","17": "--.-","18": ".-.","19": "...","20": "-","21": "..-","22": "...-","23": ".--","24": "-..-","25": "-.--","26": "--..","27": ".----","28": "..---","29": "...--","30": "....-","31": ".....","32": "-....","33": "--...","34": "---..","35": "----.","36": "-----"}]}';

var morse = JSON.parse(morseobj);
var numbers = "numbers";
var letters = "letters";

/* ------------------------------
  variables for buoy
  ------------------------------ */

var obj = JSON.parse(text);
var buoys = [52403, 56001, 52406, 51425];
// var buoynames = ["[Manus Island]", "[Christmas Island]", "[Nauru Island]", "[Tuvalu Island]"]
// var buoyname1 = "[Manus Island]";
var datacount =  obj[buoys[0]].length;
var height = "height";
var i = 0;

var buoyheights1 = null;
var buoyheights2 = null;
var buoyheights3 = null;
var buoyheights4 = null;

//console.log(obj[buoys[0]][i]["height"]);


/* ------------------------------
  variables for wave height differentials
  ------------------------------ */

var maxVal = 0,
    minVal = 0,
    dif = 0,
    absDif = 0,
    sumDif = 0,
    avgDif = 0,
    i=1,
    t=0;


/* ------------------------------
  presets for sound synthesis
  ------------------------------ */

/*
  these presets designate both the creation of the synth (including oscillators)
  and for triggering the 'note'

  presets for oscillators
  m =   is this a modulator? if so multiply gain to apply better to frequency
  t =   type of oscillator
  f =   (base) frequency
  fm =
  g =   gain
  gm =
  i =
  a =   attack
  d =   decay
  s =   sustain
  r =   release

  global presets
  gtime = global time value
  transposition = shift by x semitones
  routing = map to route oscillators to modulate each other
  durationFactor =
  kick =
  morseVal2 =

  pitchEnv presets (for the whole synth)
  connections = which oscillators to affect
  ramp = time value set for how to ramp across values in the form
          [semitones, time(s)]
  semitones = no. of semitones to transpose

*/
window.pre = {
  oscs : [
    osc1 = {
      m: 0,
      t: "sine",
      f: 400,
      fm: 0.0,
      g: 0.9,
      gm: 0.0,
      i: 0.0,
      a: 0.272,
      d: 11.6,
      s: 1.0,
      r: 10.0 // was 24
    },
    osc2 = {
      m: 1,
      t: "sine",
      f: 700,
      fm: 0.5,
      g: decToLin(0), // was -19
      gm: 0.25,
      i: 1.0,
      a: 0.5, //3.98
      d: 4.66,
      s: 0.8,
      r: 10.0
    },
    osc3 = {
      m: 1,
      t: "sine",
      f: 41,
      fm: 1.0,
      g: decToLin(-12), // was -18
      gm: 0.2,
      i: 0.0,
      a: 0.272,
      d: 11.16,
      s: 1.0,
      r: 6.0
    },
    osc4 = {
      m: 1,
      t: "sine",
      f: 1300,
      fm: 0.0,
      g: decToLin(-3), // was -5.3
      gm: 0.2,
      i: 0.0,
      a: 0.001,
      d: 1.2,
      s: 1.0,
      r: 0.05
    }
  ],
  global : {
    gtime : 1.0, // 8 is equivalent to +100% in operator
    transposition : 0,
    routing : [ 0, 1, 2, 3 ],
    durationFactor : 300,
    kick : 0,
    morseVal2 : 0.0
  },
  pitchEnv : {
    connections : [ 1, 0, 0, 0 ],
    ramp : [
      [0, 2.5],
      [12, 12.6],
      [6, 8.66]
    ],
    semitones : 3
  }
}

window.longTonesNoPitchEnv = {
  oscs : [
    osc1 = {
      m: 0,
      t: "sine",
      f: 400,
      fm: 1.0,
      g: 0.9,
      gm: 0.0,
      i: 0.0,
      a: 0.272,
      d: 11.6,
      s: 1.0,
      r: 12.0 // was 24
    },
    osc2 = {
      m: 1,
      t: "sine",
      f: 700,
      fm: 0.0,
      g: decToLin(0), // was -19
      gm: 0.25,
      i: 1.0,
      a: 0.9, //3.98
      d: 4.66,
      s: 0.8,
      r: 12.0
    },
    osc3 = {
      m: 1,
      t: "sine",
      f: 41,
      fm: 0.0,
      g: decToLin(-12), // was -18
      gm: 0.4,
      i: 0.0,
      a: 0.272,
      d: 11.16,
      s: 1.0,
      r: 12.0
    },
    osc4 = {
      m: 1,
      t: "sine",
      f: 1300,
      fm: 0.0,
      g: decToLin(-3), // was -5.3
      gm: 1.0,
      i: 0.0,
      a: 0.001,
      d: 1.2,
      s: 1.0,
      r: 0.05
    }
  ],
  global : {
    gtime : 2.0, // 8 is equivalent to +100% in operator
    transposition : 0,
    routing : [ 0, 1, 2, 3 ],
    durationFactor : 800,
    kick : 0,
    morseVal2 : 0.0
  },
  pitchEnv : {
    connections : [ 0, 0, 0, 0 ],
    ramp : [
      [0, 2.5],
      [12, 12.6],
      [6, 8.66]
    ],
    semitones : 3
  }
}

window.testPre = {
  oscs : [
    osc1 = {
      m: 0,
      t: "sine",
      f: 500,
      fm: 0.1,
      i: 0.0,
      g: 1.0,
      gm: 0.0,
      a: 0.001, // or 0.001
      d: 1.0,
      s: 1.0,
      r: 0.001
    },
    osc2 = {
      m: 1,
      t: "sine",
      f: 625,
      fm: 0.3,
      i: 0.0,
      g: 1.0,
      gm: 0.0,
      a: 0.001,
      d: 1.0,
      s: 1.0,
      r: 0.001
    },
    osc3 = {
      m: 1,
      t: "sine",
      f: 800,
      fm: 0.5,
      i: 0.0,
      g: decToLin(-12),
      gm: 0.0,
      a: 0.001,
      d: 1.0,
      s: 1.0,
      r: 0.001
    },
    osc4 = {
      m: 0,
      t: "sine",
      f: 1300,
      fm: 0.0,
      i: 1.0,
      g: decToLin(-5.3),
      gm: 0.0,
      a: 0.1,
      d: 1.2,
      s: 1.0,
      r: 0.05
    },
  ],
  global : {
    gtime: 1.0,
    transposition: 0,
    routing : [ 0, 1, 2, 3 ],
    durationFactor : 0.5,
    kick : 0,
    morseVal2 : 0.0
  },
  pitchEnv : {
    connections : [ 0, 0, 0, 0 ],
    ramp : [
      [0, 2.5],
      [12, 12.6],
      [6, 8.66]
    ],
    semitones : 3
  }
}

window.lowFmPre = {
  oscs : [
    osc1 = {
      m: 0,
      t: "sine",
      f: 80, // was 80
      fm: 0.0,
      g: 1.0,
      gm: 0.0,
      i: 0.0,
      a: 0.0016, // 0.0016
      d: 0.315, // 0.315
      s: 1.0,
      r: 0.001 // 0.00396
    },
    osc2 = {
      m: 1,
      t: "sine",
      f: 160, // was 0.1
      fm: 1.0,
      g: decToLin(-6), // was decToLin(-23)
      gm: 0.0,
      i: 1.0,
      a: 0.136, // was 0.136
      d: 0.458, // was 0.458
      s: 1.0,
      r: 0.012
    },
    osc3 = {
      m: 1,
      t: "sine",
      f: 784, //261.63 * 3, // midi note 60 = C4 = 261.63 Hz
      fm: 0.2,
      g: decToLin(-12),
      gm: 0.5,
      i: 0.0,
      a: 0.2, // 1.00106
      d: 0.3,
      s: 0.5,
      r: 0.05
    },
    osc4 = {
      m: 1,
      t: "sine",
      f: 261.63,
      fm: 0.0,
      g: decToLin(-24),
      gm: -0.8,
      i: 0.0,
      a: 2.0,
      d: 0.116,
      s: 0.7,
      r: 0.05
    }
  ],
  global : {
    gtime : 0.5, // 8 is equivalent to +100% in operator
    transposition : 13,
    routing : [ 0, 1, 2, 3 ],
    durationFactor : 1,
    kick : 1,
    morseVal2 : 0.0
  },
  pitchEnv : {
    connections : [ 1, 1, 0, 0 ],
    ramp : [
      [-12, 0.01],
      [1, 3.83],
      [0, 0.1]
    ],
    semitones : 12
  }
}

window.lowFmPreOneOsc = {
  oscs : [
    osc1 = {
      m: 0,
      t: "sine",
      f: 80, // was 80
      fm: 0.0,
      g: 1.0,
      gm: 0.0,
      i: 0.0,
      a: 0.0016, // 0.0016
      d: 0.315, // 0.315
      s: 1.0,
      r: 0.01 // 0.00396
    },
    osc2 = {
      m: 1,
      t: "sine",
      f: 160, // was 0.1
      fm: 0.0,
      g: 0.0, // was decToLin(-23)
      gm: 0.0,
      i: 0.0,
      a: 0.136, // was 0.136
      d: 0.458, // was 0.458
      s: 1.0,
      r: 0.012
    },
    osc3 = {
      m: 1,
      t: "sine",
      f: 784, //261.63 * 3, // midi note 60 = C4 = 261.63 Hz
      fm: 0.0,
      g: 0.0,
      gm: 0.0,
      i: 0.0,
      a: 0.2, // 1.00106
      d: 0.3,
      s: 0.5,
      r: 0.05
    },
    osc4 = {
      m: 1,
      t: "sine",
      f: 261.63,
      fm: 0.0,
      g: 0.0,
      gm: 0.0,
      i: 0.0,
      a: 2.0,
      d: 0.116,
      s: 0.7,
      r: 0.05
    }
  ],
  global : {
    gtime : 1.0, // 8 is equivalent to +100% in operator
    transposition : 13,
    routing : [ 0, 1, 2, 3 ],
    durationFactor : 1,
    kick : 1,
    morseVal2 : 0.0
  },
  pitchEnv : {
    connections : [ 1, 0, 0, 0 ],
    ramp : [
      [-24, 0.01],
      [1, 3.83],
      [0, 0.1]
    ],
    semitones : 12
  }
}

window.kickPre = {
  oscs : [
    osc1 = {
      m: 0,
      t: "sine",
      f: 80,
      fm: 0.0,
      i: 0,
      g: 1,
      gm: 0.0,
      a: 0.01,
      d: 0.3,
      s: 0,
      r: 0.001
    },
    osc2 = {
      m: 1,
      t: "sine",
      f: 120,
      fm: 0.0,
      i: 0,
      g: decToLin(-3),
      gm: 0.0,
      a: 0.00001,
      d: 0.02,
      s: 0,
      r: 0.05
    },
    osc3 = {
      m: 0,
      t: "sine",
      f: 80,
      fm: 0.0,
      i: 0.0,
      g: 0.0,
      gm: 0.0,
      a: 0.01,
      d: 0.3,
      s: 0,
      r: 0.001
    },
    osc4 = {
      m: 0,
      t: "sine",
      f: 120,
      fm: 0.0,
      i: 0.0,
      g: 0.0,
      gm: 0.0,
      a: 0.00001,
      d: 0.02,
      s: 0,
      r: 0.05
    }
  ],
  global : {
    gtime: 1,
    transposition: -12,
    routing : [ 0, 1, 0, 0 ],
    durationFactor : 0.5,
    kick : 1,
    morseVal2 : 0.0
  },
  pitchEnv : {
    connections : [ 0, 0, 0, 0 ],
    ramp : [
      [-24, 0.01],
      [1, 3.83],
      [0, 0.1]
    ],
    semitones : 12
  }
}

window.silence = {
  oscs : [
    osc1 = {
      m: 0,
      t: "sine",
      f: 80,
      fm: 0.0,
      i: 0,
      g: 0,
      gm: 0.0,
      a: 0.01,
      d: 0.3,
      s: 0,
      r: 0.001
    },
    osc2 = {
      m: 1,
      t: "sine",
      f: 120,
      fm: 0.0,
      i: 0,
      g: 0,
      gm: 0.0,
      a: 0.00001,
      d: 0.02,
      s: 0,
      r: 0.05
    },
    osc3 = {
      m: 1,
      t: "sine",
      f: 80,
      fm: 0.0,
      i: 0.0,
      g: 0.0,
      gm: 0.0,
      a: 0.01,
      d: 0.3,
      s: 0,
      r: 0.001
    },
    osc4 = {
      m: 1,
      t: "sine",
      f: 120,
      fm: 0.0,
      i: 0.0,
      g: 0.0,
      gm: 0.0,
      a: 0.00001,
      d: 0.02,
      s: 0,
      r: 0.05
    }
  ],
  global : {
    gtime: 1,
    transposition: 0,
    routing : [ 0, 1, 2, 3 ],
    durationFactor : 0.5,
    kick : 1,
    morseVal2 : 0.0
  },
  pitchEnv : {
    connections : [ 0, 0, 0, 0 ],
    ramp : [
      [-24, 0.01],
      [1, 3.83],
      [0, 0.1]
    ],
    semitones : 12
  }
}

window.hiFmPre = {
  oscs : [
    osc1 = {
      m: 0,
      t: "sine",
      f: 80,
      fm: 0.0,
      i: 0,
      g: 1.0,
      gm: 0.0,
      a: 0.016,
      d: 0.315,
      s: 1,
      r: 0.004
    },
    osc2 = {
      m: 1,
      t: "sine",
      f: 10,
      fm: 0.0,
      i: 1.0,
      g: decToLin(0),
      gm: 0.5,
      a: 0.136,
      d: 0.458,
      s: 0,
      r: 0.012
    },
    osc3 = {
      m: 1,
      t: "sine",
      f: 783,
      fm: 0.0,
      i: 0.0,
      g: decToLin(0),
      gm: 1.0,
      a: 0.002,
      d: 0.356,
      s: 0.0,
      r: 0.05
    },
    osc4 = {
      m: 1,
      t: "sine",
      f: 261,
      fm: 0.0,
      i: 0.0,
      g: decToLin(-24),
      gm: 1.0,
      a: 20.0,
      d: 0.115,
      s: 0.0,
      r: 0.05
    }
  ],
  global : {
    gtime: 8,
    transposition: 0,
    routing : [ 0, 1, 2, 2 ],
    durationFactor : 1.0,
    kick : 1,
    morseVal2 : 0.0
  },
  pitchEnv : {
    connections : [ 1, 1, 1, 0 ],
    ramp : [
      [48, 0.11],
      [-12, 0.02],
      [0, 0.1]
    ],
    semitones : -48
  }
}

// this holds all presets so that they can be interpolated between in some kind of order
// (some are duplicated to change the frequency of the presets occurring)
presetList = [longTonesNoPitchEnv, // 0
              lowFmPre,
              lowFmPre,
              kickPre,
              pre,
              pre,
              hiFmPre,
              silence,
              lowFmPreOneOsc,
              lowFmPreOneOsc,
              longTonesNoPitchEnv, // 0
              lowFmPre,
              silence,
              hiFmPre,
              testPre,
              lowFmPre,
              hiFmPre,
              pre,
              pre,
              longTonesNoPitchEnv,
              longTonesNoPitchEnv
              ];

/* ------------------------------
  oscillators
  ------------------------------ */

// a  basic oscillator has an oscillator and a gain node
var BasicOsc = function() {
  this.osc = audioCtx.createOscillator();
  this.gn = audioCtx.createGain();
  this.osc.connect(this.gn);
  this.gainVal = 0.0;
}

// the full FM Synthesiser has multiple oscillators and connections between them
function allFm (pre, _noteVol, _noteDuration, _time) {
  var mods = [];
  // create audioNodes as objects
  for(var i = 0; i < pre.oscs.length; i++) {
    mods[i] = new BasicOsc();
  }

  // set up type, frequency and gain
  for(var i = 0; i < pre.oscs.length; i++){
    mods[i].osc.type = pre.oscs[i].t;
    mods[i].osc.frequency.value = (pre.oscs[i].f * semiToHz(pre.global.transposition)) + (pre.oscs[i].f * ((morseVal2 + 1) * (pre.oscs[i].fm)));

    // if this a modulator, multiply the gain by modFactor * frequency
    if(pre.oscs[i].m == 1) {
      mods[i].gainVal = pre.oscs[i].g * _noteVol * modFactor * pre.oscs[i].f * ((morseVal3 + 1) * (pre.oscs[i].gm + 1));
    } else {
      mods[i].gainVal = pre.oscs[i].g * _noteVol;
    }
  }
  // pitch envelope
  if( typeof pre.pitchEnv !== 'undefined' ) {
    for( var i = 0; i < pre.pitchEnv.connections.length; i++ ) {
      if(pre.pitchEnv.connections[i] == 1) {
        mods[i].osc.detune.setValueAtTime((pre.pitchEnv.semitones * 100), _time);
        var incTime = _time;
        for(var j = 0; j < pre.pitchEnv.ramp.length; j++) {
          incTime += pre.pitchEnv.ramp[j][1];
          // console.log("ramping to value: " + mods[i].osc.frequency.value * semiToHz(pre.pitchEnv.ramp[j][0]) + " at time:  " + incTime);
          mods[i].osc.detune.linearRampToValueAtTime((pre.pitchEnv.ramp[j][0] * 100), incTime);
        }
      }
    }
  }
  // routing
  for(var i = 0; i < pre.oscs.length; i++) {
    if(pre.global.routing[i] == 0) {
      mods[i].gn.connect(mix); // connect to output
    }
    else {
      let targetOsc = pre.global.routing[i] - 1;
      mods[i].gn.connect(mods[targetOsc].osc.frequency); // connect osc to other osc
    }
  }
  // triggering 'note' envelope
  for(var i = 0; i < pre.oscs.length; i++) {
    mods[i].osc.start(_time);
    // initial
    mods[i].gn.gain.cancelScheduledValues(_time);
    mods[i].gn.gain.setValueAtTime(pre.oscs[i].i * mods[i].gainVal, _time);
    // attack
    mods[i].gn.gain.linearRampToValueAtTime(pre.oscs[i].g * mods[i].gainVal, _time + (pre.oscs[i].a * pre.global.gtime) );
    // decay
    mods[i].gn.gain.linearRampToValueAtTime(pre.oscs[i].s * mods[i].gainVal, _time + (pre.oscs[i].a * pre.global.gtime) + (pre.oscs[i].d * pre.global.gtime) );
    // sustain phase
    if(_noteDuration > (pre.oscs[i].a * pre.global.gtime) + (pre.oscs[i].d * pre.global.gtime) ) {
      mods[i].gn.gain.setValueAtTime(pre.oscs[i].g * mods[i].gainVal, _time + _noteDuration);
    } else {
      // if less than a + d then cut note short, fade out for release, cancel anything extra
      mods[i].gn.gain.cancelScheduledValues(_time + _noteDuration);
    }
    mods[i].gn.gain.linearRampToValueAtTime(0, _time + _noteDuration + (pre.oscs[i].r * pre.global.gtime) + 0.01); // little fade out
    mods[i].osc.stop((_time + _noteDuration + (pre.oscs[i].r * pre.global.gtime)));
  }
}

/* --------------------
  initialise
--------------------  */

function init() {
  console.log("script loaded...");

  // load the AudioContext, allowing for webkit (Safari)
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  //give an error if browser cannot use Web Audio API
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }

  mix = audioCtx.createGain();
  mix.gain.value = decToLin(-6);

  // we will put a low cut (highpass) filter on everything to avoid any really low sounds
  lowCut = audioCtx.createBiquadFilter();
  lowCut.type = "highpass";
  lowCut.frequency.value = 80;
  mix.connect(lowCut);
  lowCut.connect(audioCtx.destination);


  analyser = audioCtx.createAnalyser();
  lowCut.connect(analyser);
  // pass audio to the analyser for visualisation
  analyser.connect(audioCtx.destination)


  text = getdata();
  // alert(text);
  obj = JSON.parse(text);

  /*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    Translate Data to Morse Tones
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */

	buoyheights1 = getMinAndMaxValues(obj, buoys[0], height, datacount);
	buoyheights2 = getMinAndMaxValues(obj, buoys[1], height, datacount);
	buoyheights3 = getMinAndMaxValues(obj, buoys[2], height, datacount);
	buoyheights4 = getMinAndMaxValues(obj, buoys[3], height, datacount);

  // console.log("buoyheights");
  // console.log(buoyheights1.maxVal);
  // console.log(buoyheights1.minVal);

  // get the current time and adjust for processing
  var t = audioCtx.currentTime + 2;

  console.log("datacount: " + datacount);

  // calculate which preset to use at this time
  // currentPreset = interpolate(lowFmPre, pre, 0.1);
  calculatePreset();
  noteLength = 0.06 * currentPreset.global.durationFactor;

  translateToMorse(obj, buoys[0], height, datacount, 2000, 1); // 0.06
  // translateToMorse(obj, buoys[1], height, datacount, 1000, 0.08, 0.04);
  // translateToMorse(obj, buoys[2], height, datacount, 100, 0.08, 0.3);
  // translateToMorse(obj, buoys[3], height, datacount, 50, 0.4, 0.75);

  setTimeout(function() {
    console.log("reloading webpage in 15 seconds");
    mix.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 10);

    setTimeout(function() {
    location.reload();
    }, 15000); // reload 5 seconds after fade out
  }, refreshTime); // refresh after some amount of time


  setInterval( calculatePreset, 1000 );

  // at regular intervals, get more values from the data
  setInterval( getMorse, 450 );
}


/*
this function gets the wave height data and calculates the Difference
it takes two consecutive values and works out the Difference
this is then mapped between 0 and 1, based on the full range of data values
*/
function getMorse () {
  var _this = obj[buoys[2]][morse2Index][height];
  var _prevthis = obj[buoys[2]][morse2Index-1][height];
  var dif = _this-_prevthis;

  morseVal3 = (map(dif, buoyheights3.minVal, buoyheights3.maxVal, -1.0, 1.0));
  // console.log("morseVal3: " + morseVal3);

  morse3Index++;
  if(morse3Index === datacount) {
    morse3Index = 1;
  }
}

// -----------------------------------------------------

function calculatePreset() {
  // Date.getHours()
  // Date.getMinutes()
  // presetIncrement++;
  // let incMax = 45;
  // if(presetIncrement > incMax) presetIncrement = 0;
  var d = new Date();
  var m = (d.getMinutes() % 20);
  // console.log("m: " + m);
  var s = d.getSeconds();
  let r = map(s, 0, 60, 0, 1)

  // currentPreset = interpolate(lowFmPre, lowFmPreOneOsc, r);
  // currentPreset = interpolate(presetList[pi-1], presetList[pi], r);
  currentPreset = interpolate(presetList[m], presetList[m+1], r);
  // console.log("pi: " + pi);
  // console.log("pi-1: " + (pi-1));
  // console.log("seconds: " + s);
  // console.log("presetIncrement: " + presetIncrement);
  // console.log("r: " + r);
  // console.log("currentPreset.global.durationFactor: " + currentPreset.global.durationFactor);

  var _this = obj[buoys[1]][morse2Index][height];
  var _prevthis = obj[buoys[1]][morse2Index-1][height];
  var dif = _this-_prevthis;

  morseVal2 = (map(dif, buoyheights2.minVal, buoyheights2.maxVal, -1.0, 1.0));
  // console.log("morseVal2: " + morseVal2);
  // currentPreset.global.morseVal2 = morseVal2;
  // console.log("currentPreset.global.morseVal2: " + currentPreset.global.morseVal2);

  // if(s === 59) pi++;
  // if(presetIncrement === incMax) pi++;
  // if(pi === presetList.length) pi = 1;
  // console.log("presetList.length: " + presetList.length);

  morse2Index++;
  if(morse2Index === datacount) {
    morse2Index = 1;
  }

  // console.log("durationFactor: " + currentPreset.global.durationFactor);
}

// ------------------------------------------------------

// listen for keypress
document.addEventListener("keydown", function(event) {
  // console.log(event.which);
  if (event.which === 32) {

    // console.log("noteLength: " + noteLength);
    // allFm(currentPreset, 0.8, noteLength, audioCtx.currentTime + 0.1);
    // console.log(currentPreset);

    if(audioCtx.isSuspended === false){
    	audioCtx.suspend();
    } else {
    	audioCtx.resume();
    }


  } else if (event.which === 82) { // 'r' key
    console.log("restarting the audio context!")
    audioCtx.close();
    setTimeout(init(), 1000);

  }
});

// values for attack, decay, sustain, release, cannot be 0!!!! but can be very small

// function to convert to decibels
function linToDec (linearLevel) {
  return 10 * log10( linearLevel );
}

function decToLin (decibelLevel) {
  return Math.pow(10, ( decibelLevel/10 ));
}

function log10(x) {
  return Math.log(x)/Math.LN10;
}

function semiToHz(semitone) {
  // console.log(semitone);
  return Math.pow( 2, semitone / 12);
}

// this function interpolates between presets
// it works between two presets and finds a midpoint ratio (r) between their settings
function interpolate(p1, p2, r) {
  var newPreset = {
    oscs : [
      osc1 = {
        t: "sine"
      },
      osc2 = {
        t: "sine"
      },
      osc3 = {
        t: "sine"
      },
      osc4 = {
        t: "sine"
      }
    ],
    global : {
      gtime : 0.5, // 8 is equivalent to +100% in operator
      transposition : 13,
      routing : [ 0, 1, 2, 3 ],
      durationFactor : 1,
      kick : 1,
      morseVal2 : 0
    },
    pitchEnv : {
      connections : [ 0, 0, 0, 0 ],
      ramp : [
        [-24, 0.01],
        [1, 3.83],
        [0, 0.1]
      ],
      semitones : 24
    }
  }
  for(var i = 0; i < p1.oscs.length; i++) {
    // for(var j = 0; j < p1.oscs[i].length; j++) {

      newPreset.oscs[i].m = r <= 0.5 ? p1.oscs[i].m : p2.oscs[i].m;
      newPreset.oscs[i].f = p1.oscs[i].f + ((p2.oscs[i].f - p1.oscs[i].f) * r);
      newPreset.oscs[i].fm = p1.oscs[i].fm + ((p2.oscs[i].fm - p1.oscs[i].fm) * r);
      newPreset.oscs[i].g = p1.oscs[i].g + ((p2.oscs[i].g - p1.oscs[i].g) * r);
      newPreset.oscs[i].gm = p1.oscs[i].gm + ((p2.oscs[i].gm - p1.oscs[i].gm) * r);
      newPreset.oscs[i].i = p1.oscs[i].i + ((p2.oscs[i].i - p1.oscs[i].i) * r);
      newPreset.oscs[i].a = p1.oscs[i].a + ((p2.oscs[i].a - p1.oscs[i].a) * r);
      newPreset.oscs[i].d = p1.oscs[i].d + ((p2.oscs[i].d - p1.oscs[i].d) * r);
      newPreset.oscs[i].s = p1.oscs[i].s + ((p2.oscs[i].s - p1.oscs[i].s) * r);
      newPreset.oscs[i].r = p1.oscs[i].r + ((p2.oscs[i].r - p1.oscs[i].r) * r);
    // }
  }

  newPreset.global.gtime = p1.global.gtime + ((p2.global.gtime - p1.global.gtime) * r);
  newPreset.global.transposition = p1.global.transposition + ((p2.global.transposition - p1.global.transposition) * r);
  newPreset.global.durationFactor = p1.global.durationFactor + ((p2.global.durationFactor - p1.global.durationFactor) * r); //Math.pow(r, 2));
  // console.log(Math.pow(r, 20));
  // console.log(400 * Math.pow(0.01, 20));
  newPreset.global.kick = r <= 0.5 ? p1.global.kick : p2.global.kick;

  for(var i = 0; i < 4; i++) {
    newPreset.global.routing[i] = r <= 0.5 ? p1.global.routing[i] : p2.global.routing[i];
    newPreset.pitchEnv.connections[i] = r <= 0.5 ? p1.pitchEnv.connections[i] : p2.pitchEnv.connections[i];
  }
  newPreset.pitchEnv.semitones = p1.pitchEnv.semitones + ((p2.pitchEnv.semitones - p1.pitchEnv.semitones) * r);
  for(var i = 0; i < 3; i++) {
    for(var j = 0; j < 2; j++) {
      newPreset.pitchEnv.ramp[i][j] = p1.pitchEnv.ramp[i][j] + ((p2.pitchEnv.ramp[i][j] - p1.pitchEnv.ramp[i][j]) * r);
    }
  }

  // console.log("newPreset.oscs[i].f: " + newPreset.oscs[0].f);
  return newPreset;
}

/* =================================================
Translate to Morse
================================================== */

// here we use setInterval to repeatedly convert morse code to sound
// this does a block of morse every x ms, see lookahead variable
function translateToMorse(objectname, buoyid, prop, length, f, v) {

  setInterval(function () {
    // if the note sequencing time falls behind the currentTime then push it ahead a bit
    if( audioCtx.currentTime + scheduleTime >= t ) {

      // console.log("currentTime: " + audioCtx.currentTime);
      var dot = noteLength;
      let dash = 3.3*dot;

      // console.log("i#"+ i);
      let _this = objectname[buoyid][index][prop];
      let _prevthis = objectname[buoyid][index-1][prop];
      let dif = _this-_prevthis;

      // buoyheights = getMinAndMaxValues(obj, buoys[0], height, datacount);

      let morseVal = Math.floor(map(dif, buoyheights1.minVal, buoyheights1.maxVal, 1, 36));

      //console.log("Morse Val: " + morseVal);
      let morseCode = morse[numbers][0][morseVal];
      //console.log("Code: " + morseCode);
      //console.log(morseCode.charAt(0));

      let morseCodeLength = morseCode.length;
      //console.log("Code Length: " + morseCodeLength);
      //console.log("id: " + i + ", Height Differential: " + dif + ", Code: " + morseVal);
      //console.log(morseCode + " : " + morseCodeLength);
      var z = 0;
      //console.log("morseCode print: " + morseCode);

      // the translate function reads the morse code and makes our synthesis
      let translate = function() {
        //console.log("/nindex: " + z + "\nchar: " + morseCode.charAt(z) + "\ntime: " + t);
        //console.log("morseCode.charAt(z): " + morseCode.charAt(z));

        // var deltaT = 0;
        noteLength = 0.06 * currentPreset.global.durationFactor;

        switch( morseCode.charAt(z) )
        {
          // if the morse character is a dot
          case '.':
            // gainNode.gain.setTargetAtTime(gain, t, 0.01);

            // if we are using the data to sequence notes
            if(seq){
              // trigger the creation of a synthesiser and make it play a note!
              // pass the current preset, the note volume, duration,
              //  and current time (for scheduling)
              allFm(currentPreset, 0.7, dot, t);

              // also add a kick (low tone) if in the preset
              if(currentPreset.global.kick == 1)
                allFm(kickPre, 0.9, dot, t)
            }

            t += dot;
            break;
          // if the morse character is a dash
          case '-':

            if(seq) {

              // trigger the creation of a synthesiser and make it play a note!
              // pass the current preset, the note volume, duration,
              //  and current time (for scheduling)
              allFm(currentPreset, 0.7, dash, t);

              // also add a kick (low tone) if in the preset
              if(currentPreset.global.kick == 1)
                allFm(kickPre, 0.9, dash, t)

            }

            t += dash;
            break;
        }
        t += dot; // add a 'space' to the time tracking variables
        z++;
        // console.log("z: " + z);
        // console.log("morseCodeLength: " + morseCodeLength);
        if ( z < morseCodeLength ) {
          // setTimeout(translate(), deltaT);
          translate();
          // console.log("translating");
        }
      };

      // console.log("calling translate the first time");
      // while(z < morseCodeLength) {
      //   setTimeout(translate(), 500);
      // }
      translate();

      // console.log("i should be incremented here");
      // i++;

      index++;
      // console.log("index: " + index);
      // console.log("length: " + length);
      if ( index === length ) {
        index = 1;
        // console.log("END OF DATA -- CYCLING");
      }
    }
  }, lookahead); // End setTimeout
}


/* =================================================
function to get min and max wave height from object
================================================== */

function getMinAndMaxValues(objectname, buoyid, prop, length) {
  for (var i=1; i< length; i++) {
    var _this = objectname[buoyid][i][prop];
    var _prevthis = objectname[buoyid][i-1][prop];
    dif = _this-_prevthis;
    absDif = Math.abs(dif);
    sumDif += absDif;
    avgDif = sumDif/(length-1);
    if (dif >= maxVal) {
      maxVal = dif;
    }
    if (dif <= minVal) {
      minVal =dif;
    }

    // console.log("\nIndex:" + i +"\nCurrent Water Level: " + _this + "\nPrevious Water Level: "+ _prevthis + "\nRaw Difference: " + dif + "\nAbsolute Dif: "+ absDif +"Running Total: " + sumDif + "\nDataCount: " + datacount+"\n**************\nMaxValue: " + maxVal+"\nMinValue: "+minVal + "\nAverageValue:" + avgDif);

  }

  returnedObject = {};
  returnedObject.maxVal = maxVal;
  returnedObject.minVal = minVal;
  return returnedObject;
}

/* =================================================
    Remap value to new value range
================================================== */
function map(value, in_min, in_max, out_min, out_max) {
  return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var tapped=false;

//document.getElementById("play-pause-button").addEventListener("click", initOnce );
//document.addEventListener("click", initOnce );
//document.addEventListener("touchstart", initOnce);
//document.getElementById("play-pause-button").addEventListener("click", initOnce());
document.getElementById("play-pause-button").addEventListener("click", playPauseLogic);
document.getElementById("intro-button").addEventListener("click", playPauseLogic);

var hidetext1s;
var hidetext2s;


function playingSound() {
	$('#play-pause-text-comment').empty().append("mute. Double-tap for mobile");
	//$('#intro > h1').empty().append("Coâ€¢â€“stâ€¢â€“l Wâ€¢â€“ve Trâ€¢â€“nslâ€¢â€“tor ");
	$("#play").addClass("hide");
	//$("#play").addClass("hide");
	$("#intro").addClass("playing-sound");
}


function pausingSoundFromIntro() {
	$('#play-pause-text-comment').empty().append("play");
	$("#play").removeClass("hide");
	clearTimeout(hidetext1s);
	clearTimeout(hidetext2s);
	//$("#play").removeClass("hide");
	//$('#play-pause-text-comment').empty().append("play");
	//$('#intro > h1').empty().append("Coâ€¢â€“stâ€¢â€“l <br/>Wâ€¢â€“ve <br/> Trâ€¢â€“nslâ€¢â€“tor ");
	$("#intro").removeClass("playing-sound");
	$("#intro, #intro-button, #about-button, #artists-button, #documentation-button").stop(true,false).fadeIn(0);
}

function pausingSoundtoInfo() {
	$('#play-pause-text-comment').empty().append("play");
	$("#play").removeClass("hide");
	clearTimeout(hidetext1s);
	clearTimeout(hidetext2s);
	//$("#play").removeClass("hide");
	/*
	$('#play-pause-text-comment').empty().append("play");
	$('#intro > h1').empty().append("Coâ€¢â€“stâ€¢â€“l <br/>Wâ€¢â€“ve <br/> Trâ€¢â€“nslâ€¢â€“tor ");
	$("#intro").removeClass("playing-sound");

	*/
	$("#intro, #intro-button, #about-button, #artists-button, #documentation-button").stop(true,false).fadeIn(0);
}

function hideTextAfter1s() {
	hidetext1s = setTimeout(function(){
			console.log("first hide of intro text ")
			$("#intro, #intro-button, #about-button, #artists-button, #documentation-button").fadeOut(1000);
	}, 1300);
	$("#play-pause-button").on('mousemove', function() {
		if (initialised == 1 || initialised == 0) {
			clearTimeout(hidetext2s);

			$("#intro, #intro-button, #about-button, #artists-button, #documentation-button").stop( true, false ).fadeIn(200);

			hidetext2s = setTimeout(function(){
				console.log("initialised: " + initialised);
				console.log("hiding intro");
				$("#intro, #intro-button, #about-button, #artists-button, #documentation-button").fadeOut(1500);
			}, 3000);
		}
	})
}

function initDummy() {
	var dummyOsc = audioCtx.createOscillator();
	var dummyGain = audioCtx.createGain();
	dummyGain.gain.value = 0;
	dummyOsc.connect(dummyGain);
	dummyGain.connect(mix);
	dummyOsc.start(audioCtx.currentTime);
	dummyOsc.stop(audioCtx.currentTime + 0.1);
	console.log("playing sound");
}

function touchFunctions() {
	var tapped=false;
	$("#play-pause-button").bind("touchstart",function(e){
	    if(!tapped){ //if tap is not set, set up single tap
	    	tapped=setTimeout(function(){
	    	    tapped=null;
				//insert things you want to do when single tapped
				console.log("singletap");
				if (initialised == 0) {
					initialised = 1;
					//alert('tap');
					//$("#play-comment").addClass("hide");
					//$("#play-comment-tap").removeClass("hide");
					console.log("intialised: " + initialised);
					//start sound
					init();
					//make volume 80%
					mix.gain.value = .8;
					//initiate dummy sound
					initDummy();
					//render the new visualisation;

					console.log("rendering chart");
					$("#intro-button").addClass("current-button")
									  .addClass("underline");
					renderChart();
					//hide intro text
					playingSound();

					hideTextAfter1s();
				} else if (initialised == 1) {
					console.log("intialised: " + initialised + ", playing, reveal text");
					clearTimeout(hidetext2s);
					clearTimeout(hidetext1s);

					$("#intro-button").removeClass("current-button")
									  .removeClass("underline");
					$("#intro, #intro-button, #about-button, #artists-button, #documentation-button")
						.stop( true, false )
						.fadeIn(200);

					hidetext2s = setTimeout(function(){
						$("#intro, #intro-button, #about-button, #artists-button, #documentation-button").fadeOut(1500);
					}, 3000);
					initialised = 1;

				} else if (initialised == 2) {
					initialised = 1;
					mix.gain.value = .8;
					console.log("intialised: " + initialised);
					//$("#play-comment").addClass("hide");
					//$("#play-comment-tap").removeClass("hide");
					$("#intro-button").addClass("current-button")
									  .addClass("underline");
					// hide intro text

					console.log("playing sound");
					playingSound();
					$("#audio-visualiser").fadeIn(0);
					hideTextAfter1s();

				}
	      	},300);   //END tap Timeout wait 300ms then run single click code
	    } else {    //tapped within 300ms of last tap. double tap
	      clearTimeout(tapped); //stop single tap callback
	      tapped=null;
	      //insert things you want to do when double tapped
	      console.log("double tap");
	      //playPauseLogic();

	      if (initialised == 1) {
		      initialised = 2;
			  // volume down
			  mix.gain.value = 0;
			  console.log("intialised: " + initialised, ", pausing");
			  console.log("paused")
			  //clearTimeout(hidetext2s);
			  clearTimeout(hidetext1s);
			  //$("#play-comment").removeClass("hide");
			  //$("#play-comment-tap").addClass("hide");
			  pausingSoundFromIntro();
			  clearTimeout(hidetext2s);
			  $("#intro").stop(true,false).fadeIn(0);
			  //show intro text

	      } // END if


	    } // END else
	    e.preventDefault()
	}); // END function
}// END touchFunctions

function playPauseLogic() {
	if ( initialised == 0) {
			initialised = 1;
			console.log("intialised: " + initialised);

			//start sound
			init();
			//make volume 80%
			mix.gain.value = .8;
			//initiate dummy sound
			initDummy();
			//render the new visualisation;
			console.log("rendering chart");
			$("#intro-button").addClass("current-button")
							  .addClass("underline");
			renderChart();
			//hide intro text
			playingSound();
			hideTextAfter1s();
			if (!$("#intro").hasClass("current")) {
				//remove "current-button" attributes and remove underline
				$(".current-button").removeClass("current-button")
		 				 	 		.removeClass("underline");
		 		//remove "current" info container attributes and hide container
		 		$(".current").removeClass("current")
							 .addClass("hide");

				//show intro title
				$("#intro").addClass("current")
				   		   .removeClass("hide");
				//show play-pause-button
				$("#play-pause-button").removeClass("hide");
			}

		} else if (initialised == 1) {
			initialised = 2;
			// volume down
			mix.gain.value = 0;
			console.log("intialised: " + initialised);
			$("#intro-button").removeClass("current-button")
							  .removeClass("underline");

			if ($("#play-comment").hasClass("hide")) {
				$("#play-comment").removeClass("hide");
				$("#play-comment-tap").addClass("hide");
			}

			console.log("paused")
			//clearTimeout(hidetext2sec);

			//show intro text
			pausingSoundFromIntro();
			if( $("#about-button").hasClass("current-button") ||
				$("#artists-button").hasClass("current-button") ||
				$("#documentation-button").hasClass("current-button") ) {
					$("#play").addClass("hide");
			} else {
				$("#play").removeClass("hide");
			}

		} else if (initialised == 2) {
			initialised = 1;
			mix.gain.value = .8;
			console.log("intialised: " + initialised);
			$("#intro-button").addClass("current-button")
							  .addClass("underline");
			if (!$("#intro").hasClass("current")) {
				//remove "current-button" attributes and remove underline
				$(".current-button").removeClass("current-button")
		 				 	 		.removeClass("underline");
		 		//remove "current" info container attributes and hide container
		 		$(".current").removeClass("current")
							 .addClass("hide");

				//show intro title
				$("#intro").addClass("current")
				   		   .removeClass("hide");
				//show play-pause-button
				$("#play-pause-button").removeClass("hide");
			}
			// hide intro text
			console.log("playing sound");
			playingSound();
			hideTextAfter1s();
			$("#play").addClass("hide");
			$("#audio-visualiser").fadeIn(0);


		}


}

/* ==================================================
		Sound Visualisation
	===================================================*/
	var resizeTimer;
	var maxFreq = 260;

	var array_size = 500;

	var frequencyData = new Uint8Array(array_size);

	var svgHeight = $('body').outerHeight();
	var svgWidth = $('body').outerWidth();
	//alert(svgHeight);
	var svgid = "audio-visualiser";
	var barPadding = '0';

	//function to create svg element
	function createSvg(parent, height, width, Id, className) {
		return d3.select(parent).append('svg')
				 .attr('height', height)
				 .attr('width', width)
				 .attr('id', Id)
				 .attr('class', className);
	}

	//create svg for visualisation
	var svg = createSvg('body', svgHeight, svgWidth, svgid);

		// create our initial D3 chart.
		svg.selectAll('rect')
		   .data(frequencyData)
		   .enter()
		   .append('rect')
		   .attr('class','bar')
		   .attr('x', function (d, i) {
		      return i * (svgWidth / frequencyData.length);
		   })
		   .attr('width', svgWidth / frequencyData.length - barPadding)
		   .attr('stroke','rgb(d, d, d)');

		// continuously loop and update chart with frequency data.
		function renderChart() {
			requestAnimationFrame(renderChart);

			// copy frequency data to frequencyData array.
			analyser.getByteFrequencyData(frequencyData);

			// update d3 chart with new data.
		   svg.selectAll('rect')
		      .data(frequencyData)
		      .attr('y', function(d) {
		         return svgHeight - map(d, 0, maxFreq, 0, svgHeight);
		      })
		      .attr('height', function(d) {

		         return map(d, 0, maxFreq, 0, svgHeight);
		      })
		      .attr('fill', function(d) {
		         //return 'rgb(5, 5, 5)';
		         return 'rgb(' + d +',' + d + ',' + d + ')';
		      })
		      .attr('stroke', function(d) {
			      return 'rgb(' + d +',' + d + ',' + d + ')';
		      });
		}

	/* =================================================
	 functions to resize display window
	================================================== */
	function resizeDiv(element) {
		$("#"+element).outerHeight($("body").innerHeight());
		$("#"+element).outerWidth($("body").innerWidth());
	}
	function resizeDivWidth(element) {
		$("#"+element).outerWidth($("body").innerWidth());
	}


	/* =================================================
	 button functions
	================================================== */
	function hideShowContent() {
		$("#play-pause-button").addClass("hide");
		$(".current-button").removeClass("underline").removeClass("current-button");
		//add .current-button + .underline to this button
		$(this).addClass("current-button").addClass("underline");
		contentContainerId = "#" +$(this).attr("name");
		console.log("menu button clicked: " + contentContainerId);
		$('.current').addClass("hide")
					 .removeClass("current");
		$(contentContainerId).removeClass("hide").addClass("current");

	}
var clickHandler = ('ontouchstart' in document.documentElement ? "touchstart" : "click");


var tapped=false;
$(document).ready(function(){
	document.getElementById("play-pause-button").addEventListener("click", touchFunctions);
	//document.getElementById("play-pause-button").addEventListener("click", touchFunctions);


	/* =================================================
	 functions to resize display window
	================================================== */
	$(window).resize(function(){
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function(){
			//resize the div#audio-visualiser
			resizeDivWidth("audio-visualiser");
			//remove all rectangles;
			svg.selectAll('rect').remove();
			//get new body height and width
			svgHeight = $('body').outerHeight();
			svgWidth = $('body').outerWidth();
			//create new rectangles that are the right size;
			svg.selectAll('rect')
			   .data(frequencyData)
			   .enter()
			   .append('rect')
			   .attr('class','bar')
			   .attr('x', function (d, i) {
			      return i * (svgWidth / frequencyData.length);
			   })
			   .attr('y', function(d,i) {
				   return svgHeight - map(d, 0, maxFreq, 0, svgHeight);
			   })
			   .attr('width', svgWidth / frequencyData.length - barPadding)

			   .attr('stroke','rgb(5, 5, 5)');
			//render the new chart;
			if (initialised == 1) {
				renderChart();
			}


		}, 200);

	});


	/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”      Activity!!!!!      â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”â€”
	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */

	/*
	$('#play-pause-button').click(function(){


	}); //END play-pause click fn
	*/
	var contentContainerId;

	var contentContainer;
	$(".menu-button").click(function(){
		if (!$(this).hasClass("current-button")) { // if this is not the current button, do the following
			//remove previous "current" menu button attributes
			$(".current-button").removeClass("current-button")
								.removeClass("underline");
			//add "current" menu button attributes to this button
			$(this).addClass("current-button")
				   .addClass("underline");
			//remove "current" info container attributes and hide container
			$(".current").removeClass("current")
						 .addClass("hide");
			//get this name and find the corresponding info-container
			contentContainerId = "#" + $(this).attr("name");
			//add "current" to corresponding info-container and show
			$(contentContainerId).addClass("current")
								 .removeClass("hide");
			//hide the play button background
			$("#play, #play-pause-button").addClass("hide");


			if (initialised !== 1) { // extra actions for if ###no sound is playing###
				//alert("initialised: " + initialised + ", new button click, no sound playing. showing info");
			} else { // extra actions for if ***sound is playing***
				//alert("initialised was : " + initialised + ", new button click, sound muted. showing info");
				$("#intro-button").addClass("current-button")
								  .addClass("underline");
				//alert($("#audio-visualiser").width());
				$("#audio-visualiser").fadeOut(0);
				//initialised = 2;
				//mix.gain.value = 0;

				clearTimeout(hidetext2s);
				clearTimeout(hidetext1s);
				$("#intro-button, #about-button, #artists-button, #documentation-button").stop(true,false).fadeIn(0);
			}
		} else { // if this is the current button, do the following
			//alert("this is the current button")
			//remove previous "current" menu button attributes
			$(".current-button").removeClass("current-button")
			 					.removeClass("underline");
			//remove "current" info container attributes and hide container
			$(".current").removeClass("current")
						 .addClass("hide");
			//get this name and find the corresponding info-container
			contentContainerId = "#" + $(this).attr("name");
			//remove "current" to corresponding info-container and hide
			$(contentContainerId).removeClass("current")
								 .addClass("hide");
			//show intro title
			$("#intro").addClass("current")
					   .removeClass("hide");
			//show play-pause-button
			$("#play-pause-button").removeClass("hide");

			if (initialised !==1) { // actions for if ###no sound is playing###
				//alert("initialised: " + initialised + ", button reclicked. no was sound playing. removing info & showing intro text and bg");
				//alert("initialised was : " + initialised);
				//show play bg arrow
				if ($("#intro").hasClass("playing-sound")) {
				//alert("initialised: " + initialised + "close clicked. sound was playing.removing content, unmuting sound and showing visualiser")
				//mix.gain.value = .8;
				//initialised = 1;
				console.log("playing sound");
				//$("#play").addClass("hide");
			} else {
				$("#intro-button").addClass("current-button")
								  .addClass("underline");

				$("#play").removeClass("hide");
			}
			} else { // actions for if ***sound was playing before this button was clicked***
				//alert("initialised was : " + initialised +", button reclicked, sound muted. removing info & showing intro text and bg");
				//initialised = 2;
				//mix.gain.value = 0;
				$("#audio-visualiser").fadeIn(0);
				$("#intro-button").addClass("current-button")
								  .addClass("underline");
			}
			//$()
		}
	}); //END .menu-button click fn


	$("img").click(function() {
		if (!$(this).hasClass("fullscreen")){
			$(this).addClass("fullscreen");
			$("#img-bg").removeClass("hide");
		}else {
			$(this).removeClass("fullscreen");
			$("#img-bg").addClass("hide");
		}

	})

	$("p.close").click(function() {
		//remove previous "current" menu button attributes
		$(".current-button").removeClass("current-button")
		 					.removeClass("underline");
		//remove "current" info container attributes and hide container
		$(".current").removeClass("current")
					 .addClass("hide");

		//show intro title
		$("#intro").addClass("current")
				   .removeClass("hide");
		//show play-pause-button
		$("#play-pause-button").removeClass("hide");
		if (initialised !== 1) { // actions for if ###no sound is playing###
			//alert("initialised: " + initialised + ", close button clicked. no sound was playing. removing info & showing intro text and bg");
			//show play bg arrow
			if ($("#intro").hasClass("playing-sound")) {
				//alert("initialised: " + initialised + "close clicked. sound was playing.removing content, unmuting sound and showing visualiser")

				//mix.gain.value = .8;
				//initialised = 1;
				//$("#play").addClass("hide");

				console.log("playing sound");


			} else {
				$("#intro-button").addClass("current-button")
								  .addClass("underline");
				$("#play").removeClass("hide");
			}


		} else { // actions for if ***sound was playing before this button was clicked***
			//alert("initialised was : " + initialised +", button reclicked, sound was muted and will now play again. removing info & showing intro text and underlining intro button");

			//initialised = 2;
			//mix.gain.value = 0;

			$("#intro-button").addClass("current-button")
							  .addClass("underline");
			$("#audio-visualiser").fadeIn(0);
		}

	})
		/*
	$("#about-button").click(function(){
			alert('more soon');
			//$("#close").css({'text-decoration':'underline'});
			//$(this).hide(0);
			//$("#title").hide(0);
			//$("#close,#about-container").show(0);
	});
	$("#artists-button").click(function(){
		alert('more soon');
	})
	*/

}); // END $(document).ready(function(){
