# Zenhub-Integration

While zenhub registers automatically with github issue tracking, there are some missing features. Zenhub-Integration bridges that gap. Available features are:

- Moving issues between zenhub "in progress" pipeline when a new merge request is created against a preexisting issue
- Moving issue to "Review Q/A" when a merge request is created for a branch created against an issue


Planned features:

- notifications in slack. E.g. 'Jane Smith has created' merge request "35-update-readme" ready for review for Amanda Doe'
- support for moving multiple issues for branches with the pattern "35-36-update-readme".
- Passing of secure keys through environment variables

## Getting Started

This app is a barebones Node.js app using [Express 4](http://expressjs.com/). Using heroku, it runs as a middle-ware or proxy  server, transforming requests from [github webhooks](https://developer.github.com/webhooks/) <-> [zenhub api](https://github.com/ZenHubIO/API).

### Prerequisites

You will need 

- [Node JS](https://nodejs.org/en/)
- [Heroku](https://dashboard.heroku.com/) with free account


### Installing

Install npm packages. This should create a folder "node_modules" at the root directory of the project.
```
npm install
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

```sh
$ heroku create
...
$ heroku open
```

This should open the deployed version of the app. To deploy a preexisting app, the workflow is:

```sh
# make commit
$ git push heroku master
$ heroku logs -t
```

The server should now be running. Now we need to configure your github project to send calls to your server.

TODO!!


For more information on deployment and app setup, see the [Heroku Documentation on Node JS apps](https://devcenter.heroku.com/articles/getting-started-with-nodejs)


## Authors

* **Karina Yang**  - [Decipher Technology Studios](http://deciphernow.com/)
* **David Goldstein** - [DavidCharlesGoldstein.com](http://www.davidcharlesgoldstein.com/) - [Decipher Technology Studios](http://deciphernow.com/)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [license.md](license.md) file for details
