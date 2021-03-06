# Zenhub-Integration

While zenhub registers automatically with github issue tracking, there are some missing features. Zenhub-Integration bridges that gap. Available features are:

- Moving issues between zenhub "in progress" pipeline when a new merge request is created against a preexisting issue
- Moving issue to "Review Q/A" when a merge request is created for a branch created against an issue
- Passing of secure keys through environment variables


Planned features:

- notifications in slack. E.g. 'Jane Smith has created' merge request "35-update-readme" ready for review for Amanda Doe'
- support for moving multiple issues for branches with the pattern "35-36-update-readme".

## Getting Started

This app is a barebones Node.js app using [Express 4](http://expressjs.com/). Using heroku, it runs as a middle-ware or proxy  server, transforming requests from [github webhooks](https://developer.github.com/webhooks/) <-> [zenhub api](https://github.com/ZenHubIO/API).

### Prerequisites

You will need 

- [Node JS](https://nodejs.org/en/)
- [Heroku](https://dashboard.heroku.com/) with free account
- [Zenhub](http://zenhub.com) with free account and integration with github


### Installing

Install npm packages. This should create a folder "node_modules" at the root directory of the project.
```
npm install
```

Set the required environment variables for local testing. If you don't want to set this up right now, you can set the environment, just fill in the required fields with "NONE".

```sh
touch .env
echo "
ZENHUB_REPO_ID=NONE
ZENHUB_ACCESS_TOKEN=NONE
ZENHUB_POSITION=NONE
" >> .env
```

Serve up the app locally. It should run on `http://localhost:5000`.
```
heroku local
```

If you open your browser `http://localhost:5000/docs.html` you should see this documentation:

![docs](https://github.com/dgoldstein1/zenhub-integration/blob/master/public/images/documentation.png)

You should also be able to see the rest API at `http://localhost:5000/docs/rest.html`

![rest](https://github.com/dgoldstein1/zenhub-integration/blob/master/public/images/rest.png)


## Deployment

Deployment is done through your individual heroku account. If you haven't done so already, create an account and add this project.

### Create New Heroku Project

```sh
$ heroku create
...
$ heroku open
```
For more information heroku setup, see the [Heroku Documentation on Node JS apps](https://devcenter.heroku.com/articles/getting-started-with-nodejs)

### Configure Zenhub

Then go to `https://dashboard.heroku.com/apps` and click on the name of the you just created. It should be something like "quiet-brushlands-209234". Here you will need to set the required access tokens. You should set three environment variables.

- "ZENHUB_ACCESS_TOKEN" - go to https://app.zenhub.com/dashboard/tokens and generate a token for the project you would like to use. This should be an 80 character long token of numbers and digits.
- "ZENHUB_REPO_ID" - go to https://app.zenhub.com/ and select the board you want. See that the URL becomes something like "https://app.zenhub.com/workspace/o/dgoldstein1/zenhub-integration/boards?repos=142593524". Copy and paste the last number after "repos="
- "ZENHUB_POSITION" - This is where you would like the issues to go on each pipeline, choices are "top" or "botton". Most people do "top".

Enter these into the settings page under "Config Vars".

### Push And Build You Code

To deploy the app with these settings:

```sh
# make commit
$ git push heroku master
$ heroku logs -t
...
2018-07-27T18:42:24.099177+00:00 app[web.1]: Node app is running at localhost:15663
2018-07-27T18:42:17.000000+00:00 app[api]: Build succeeded
2018-07-27T18:42:26.302425+00:00 heroku[web.1]: State changed from starting to up
```

### Configure Github

The server should now be running. Now we need to configure your github project to send calls to your server.

- Go to https://github.com/${your-github-name}/${your-project-name}/settings/hooks/new
- Under "payload URL" enter in the url of the heroku app you just created with an additional "/updateZenhub" (e.g. 'https://warm-lowlands-25366.herokuapp.com/updateZenhub')
- Content-type should be "application/json"
- Select "Issues, PRs, and Pushes"
- Select "submit"

You should see some new activity in the heroku logs and github should confirm the webhook with a green check mark.



## Authors

* **Karina Yang**  - [Decipher Technology Studios](http://deciphernow.com/)
* **David Goldstein** - [DavidCharlesGoldstein.com](http://www.davidcharlesgoldstein.com/?github-zenhub-integration) - [Decipher Technology Studios](http://deciphernow.com/)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the Apache License - see the [license.md](license.md) file for details
