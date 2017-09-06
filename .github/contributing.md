# Contributing

Thank you for contributing :heart: :tada:

This repo is the main core and where most issues are reported. Feathers embraces modularity and is broken up across many repos. To make this easier to manage we currently use [Zenhub](https://www.zenhub.com/) for issue triage and visibility. They have a free browser plugin you can install so that you can see what is in flight at any time, but of course you also always see current issues in Github.

## Report a bug

 **it helps us immensely if you can link to a simple example that reproduces your issue**.

## Report a Security Concern


## Pull Requests

We :heart: pull requests and we're continually working to make it as easy as possible for people to contribute, including a [Plugin Generator]

We prefer small pull requests with minimal code changes. The smaller they are the easier they are to review and merge. A core team member will pick up your PR and review it as soon as they can. They may ask for changes or reject your pull request. This is not a reflection of you as an engineer or a person. Please accept feedback graciously as we will also try to be sensitive when providing it.

Although we generally accept many PRs they can be rejected for many reasons. We will be as transparent as possible but it may simply be that you do not have the same context or information regarding the roadmap that the core team members have. We value the time you take to put together any contributions so we pledge to always be respectful of that time and will try to be as open as possible so that you don't waste it. :smile:

**All PRs (except documentation) should be accompanied with tests and pass the linting rules.**

### Code style

Before running the tests from the `test/` folder `npm test` will run ESlint. You can check your code changes individually by running `npm run lint`.

### ES6 compilation

Feathers uses [Babel](https://babeljs.io/) to leverage the latest developments of the JavaScript language. All code and samples are currently written in ES2015. To transpile the code in this repository run

> npm run compile

__Note:__ `npm test` will run the compilation automatically before the tests.

### Tests

[Mocha](http://mochajs.org/) tests are located in the `test/` folder and can be run using the `npm run mocha` or `npm test` (with ESLint and code coverage) command.

### Documentation


## External Modules
