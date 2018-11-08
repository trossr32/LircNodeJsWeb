var config = require('config');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync; // this works better for macro feature
var util = require('util');
var express = require('express');
var router = express.Router();

var devices = config.get('devices');
var macros = config.get('macros');
var irsendRoute = '/devices/:device/:directive/:key';

var msleep = function(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

var sleep = function(n) {
  msleep(n*1000);
}

var irsendRouteHandler = function(req, res){
  var command = util.format('irsend %s %s %s', req.params.directive, req.params.device, req.params.key);
  var result;
  console.log('executing: ' + command);
  exec(command, (error, stdout, stderr) => {
    result = stdout.trim();
    // success returns a blank string, I want to return something back to the browswer
    if(!result){
      result = "success";
    }
    res.json({result: result});
  });
};

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/devices/:device', function(req, res, next) {
  res.render(req.params.device, {title: devices[device].title, device: device});
});

router.post('/macro/:macro', function(req, res, next){
  var macroName = req.params.macro;
  var macro = macros[macroName];
  var command;
  var step;
  var delay;
  var result = "success";
  if(macro){
    for(var i = 0, len = macro.length; i < len; i++){
      step = macro[i];
      command = util.format('irsend %s %s %s', step.directive, devices[step.device].device, step.key);
      console.log('executing: ' + command);
      execSync(command);
      if(step.delay){
        sleep.msleep(step.delay);
      }
    }
  } else {
    result = "macro not found: " + macroName;
  }
  res.json({result: result});
});

// not doing .all because keeping security in mind even though this website should be internal
router.get(irsendRoute, irsendRouteHandler); 
router.post(irsendRoute, irsendRouteHandler);

module.exports = router;
