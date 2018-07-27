'use strict';

// imports
var express = require('express')
var app = express()
var axios = require('axios')
var bodyParser = require('body-parser')

//configuration
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended : true}));     // to support URL-encoded bodies

/////////////
// on load //
/////////////

AssertEnvironment()

/**
 * asserts neccesary environment variables are set in process.env
 **/
function AssertEnvironment() {
  let requiredEnv = [
    //zenhub
    "ZENHUB_REPO_ID",
    "ZENHUB_ACCESS_TOKEN",
    "ZENHUB_POSITION"
  ]
  // assert that all are not null
  requiredEnv.forEach(env => {
    if (!process.env[env]) {
      console.error(`environment variable '${env}' must be declared`)
      process.exit(1)
    }
  })
}

/////////////
// routing //
/////////////

// re-route '/' to docs page
app.get('/', function(req, res) {
   res.redirect('/docs.html');
});

// post update from github -> zenhub
app.post('/updateZenhub', function(request, response) {

  // someone if pushing to a branch
  if (isPushEvent(request.body)) {
    var branchName = request.body.ref || "";
    var issueNumber = parseInt(branchName.match(/[0-9 , \.]+/g), 10);

    // log out data
    console.log("Push event issueNumber", issueNumber);
    console.log("New Branch Created. Href : ", branchName)

    // move issue to 'in progress' pipeline
    moveIssue(issueNumber, "In Progress").then(res => {
      response.send(JSON.stringify(res));
      return;
    })
  } else if (isPullRequestOpen(request.body)) {
    // someone is opening a new PR against an issue
    var branchName = request.body.pull_request.head.ref || "";
    var issueNumber = parseInt(branchName.match(/[0-9 , \.]+/g), 10);

    console.log("New PR Create. Ref : ", branchName)
    console.log("PR created against issueNumber", issueNumber);

    // move issue to "Review/QA" pipeline
    moveIssue(issueNumber, "Review/QA").then(res => {
      return response.send(JSON.stringify(res));
    })
  }

  response.send("{Success : true, info : 'no action taken'}")
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

//////////////
// requests //
//////////////

/**
 * move issue between pipelines
 * 
 * // uri params
 * @param {int} issue_number
 * @param {int} pipelineName
 **/
function moveIssue(issue_number, pipelineName) {
  // first get board
  var endpoint = `https://api.zenhub.io/p1/repositories/${process.env.ZENHUB_REPO_ID}/board?access_token=${process.env.ZENHUB_ACCESS_TOKEN}`
  console.log("GET " + endpoint)
  return axios.get(endpoint).then(res => {
    if (res.data && res.data.pipelines) {
      // check to see if pipeline name is in board
      var pipline_id = ""
      res.data.pipelines.forEach(p => {
        if (p.name === pipelineName) {
          pipline_id = p.id
        }
      })
      console.log(JSON.stringify(res.data.pipelines))
      // return error if pipeline not found
      if (pipline_id === "")
        return Promise.resolve({success : false, error : "could not find pipeline " + pipelineName})
      // make request to move issue
      endpoint = `https://api.zenhub.io/p1/repositories/${process.env.ZENHUB_REPO_ID}/issues/${issue_number}/moves?access_token=${process.env.ZENHUB_ACCESS_TOKEN}`
      var body = {
        pipeline_id : pipline_id,
        position : process.env.ZENHUB_POSITION
      }
      console.log("POST " + JSON.stringify(body, null, 2) + endpoint)
      return axios.post(endpoint, body)
      .then(res => Promise.resolve({success : true}))
      .catch(err => Promise.resolve({success : false, error : err}))
    }
    return Promise.resolve({success : false, error : "Could not get board information"})
  }).catch(res => Promise.resolve({success : false, err : res}))
}

/////////////////////////////////
// validate github action type //
/////////////////////////////////

function isPushEvent(data) {
  // see https://developer.github.com/v3/activity/events/types/#pushevent 
  // for parsing info
  return data.pusher && data.sender;
}

function isPullRequestOpen(data) {
  // https://developer.github.com/v3/activity/events/types/#pullrequestevent
  // returns true when data is someone opening a pr against an issue
  return data.pull_request && data.action === "opened"
}

function isNewIssue(data) {
  return _isObject(data) && data.action === "opened";
}

function _isObject(obj) {
  return obj === Object(obj);
}
