# Typescript Service Template

Project template for a web service using [TypeScript](https://www.typescriptlang.org/) and [Node.js](https://nodejs.org/en/).

- [Introduction](#introduction)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Clone Repository](#clone-repository)
  - [Install Dependencies](#install-dependencies)
  - [Start the Service](#start-the-service)
  - [Debugging the Service](#debugging-the-service)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [Code Linting](#code-linting)
  - [Code Formatting](#code-formatting)
- [Security](#security)
  - [Dependency Auditing](#dependency-auditing)
  - [Dependency Upgrades](#dependency-upgrades)
- [Performance](#performance)
  - [Stress Testing](#stress-testing)
  - [Profiling](#profiling)
- [DevOps Pipeline](#devops-pipeline)
  - [Continuous Integration](#continuous-integration)
  - [Docker Containerization](#docker-containerization)

## Introduction

Developing a production level web service takes a lot of work. There are many great technologies that can be used to make web services. This repository focuses on setting up a project for using [TypeScript](https://www.typescriptlang.org/) and [Node.js](https://nodejs.org/en/).

[Check out the StackOverflow developer survey on most loved technologies.](https://insights.stackoverflow.com/survey/2019#most-loved-dreaded-and-wanted)

What is a web service? An application running in the cloud which can be connect to and used to perform a service.

Node.js is a JavaScript engine made by Google is well-suited for making web services. TypeScript adds strong type checking to JavaScript and combined with linting rules to enforce good code, we end up with a very clean and pleasant development environment.

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/en/about/) is an asynchronous event-driven JavaScript runtime designed to build scalable network applications.

- [Visual Studio Code]() is a code editor for building and debugging modern web and cloud applications.

  [Check out the StackOverflow developer survey on most loved development environments.](https://insights.stackoverflow.com/survey/2019#development-environments-and-tools)

  Required Plugins:

  - The **ESLint** plugin runs the linting rules in the editor.

  - The **Jest** plugin runs the tests in the editor.

  - The **Prettier** plugin formats the code in the editor.

- [Git](https://git-scm.com/) is a free and open source distributed version control system.

### Clone Repository

[Clone](https://git-scm.com/docs/git-clone) the repository to a local directory.

```
git clone https://github.com/jamestalton/typescript-service.git
```

### Install Dependencies

[npm](https://www.npmjs.com/) is the package manager for the Node JavaScript platform.

Using [npm ci](https://docs.npmjs.com/cli/ci.html) installs the exact versions of dependencies listed in the package-lock.json into the node_modules directory.

```
npm ci
```

### Start the Service

The server is written in Typescript, but using [ts-node](https://github.com/TypeStrong/ts-node) we can run the code with real-time transpilation and not need a pre-compilation step.

For development, the server is started with [npm start](https://docs.npmjs.com/cli/start.html) which runs the "*start*" script from the package.json.

```
npm start
```

The application starts a HTTP server listening to port 3000 and serves a json "Hello World" response.

View the [Hello World](http://localhost:3000) in a web browser.

```json
{
  "message": "Hello World"
}
```

The application is running in a "watch" mode, watching for file changes and will restart when any source file changes.

### Debugging the Service

Visual Studio Code is setup to debug the service using [launch.json](./.vscode/launch.json).

Debugging works as expected with breakpoints, variable watches, and call stacks.

## Testing

The default command for testing node projects is [npm test](https://docs.npmjs.com/cli/test) which runs the test script from [package.json](./package.json).

```
npm test
```

The test script is setup to run:

- [Unit Tests](#unit-tests)
- [Code Linting Rules](#code-linting)
- [Code Formatting Checks](#code-formatting)
- [Dependency Security Audits](#dependency-auditing)

### Unit Tests

Unit tests are run using the "*jest*" script defined in [package.json](./package.json).

```
npm run jest
```

[Jest](https://jestjs.io/) is a JavaScript Testing Framework with a focus on simplicity. Using [ts-jest](https://github.com/kulshekhar/ts-jest), jest is configured in the "*jest*" section of [package.json](./package.json). Jest is configured to enforce 100% code coverage. This is a best practice to ensure either code is tested or explicitly marked as not tested.

Install the [jest plugin](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest) for Visual Studio Code which runs the tests in the editor, giving real-time feedback. The plugin also adds a debug link for debugging tests in Visual Studio Code.

### Code Linting

Code linting checks are run using the "*eslint*" script defined in [package.json](./package.json).

```
npm run eslint
```

[ESLint](https://eslint.org/) statically analyzes your code to quickly find problems. ESLint is configured in the eslint section of the [package.json](./package.json). Linting rules are setup make cleaner code, reduce errors, and create a maintainable code base.

Install the [ESLint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for Visual Studio Code.

### Code Formatting

Code formatting checks are run using the "*prettier*" script defined in [package.json](./package.json).

```
npm run prettier
```

The code formatting is enforced using [Prettier](https://prettier.io/) - an opinionated code formatter.

> By far the biggest reason for adopting Prettier is to stop all the on-going debates over styles. It is generally accepted that having a common style guide is valuable for a project and team but getting there is a very painful and unrewarding process. People get very emotional around particular ways of writing code and nobody likes spending time writing and receiving nits.
> 

Prettier is configured in the prettier section of the [package.json](./package.json).

Install the [Prettier plugin](https://github.com/prettier/prettier-vscode) for Visual Studio Code.

## Security

### Dependency Auditing

Security vulnerabilities are sometimes found in NPM packages. [npm audit](https://docs.npmjs.com/cli/audit) scans your project for vulnerabilities and can automatically install any compatible updates to vulnerable dependencies.

```
npm audit
```

### Dependency Upgrades

Dependency upgrades can be run using the "*update*" script defined in [package.json](./package.json).

```
npm run update
```

This will update dependencies, run audits, and run tests.

## Performance

### Stress Testing

Stress testing can be run using the "*stress*" script defined in [package.json](./package.json). You must first start the service before running the stress test.

```
npm run stress
```

The hardware the test runs on affects the performance. Running on a 2019 MacBook Pro shows an average greater than 50,000 requests per second for the hello world response.

### Profiling

Profiling the service can show where the bottlenecks are in performance.
Profiling can be run using the "*profile*" script defined in [package.json](./package.json).
Once the profiling is done, a flame graph of the results will be generated and opened in a web browser.

```
npm run profile
```

## DevOps Pipeline

### Continuous Integration

A CI pipeline is a must have for any project.
The CI pipeline builds branches and pull requests and ensures that all tests and checks pass. This project is setup to use TravisCI. The builds are defined in [.travis.yml](./.travis.yml).

[![Build Status](https://travis-ci.com/jamestalton/typescript-service.svg?branch=master)](https://travis-ci.com/jamestalton/typescript-service)

### Docker Containerization

[Docker](https://www.docker.com/get-started) is a tool designed to make it easier to create, deploy, and run applications by using containers. Containers allow a developer to package up an application with all of the parts it needs, such as libraries and other dependencies, and ship it all out as one package.

Docker can build images automatically by reading the instructions from a Dockerfile. A Dockerfile is a text document that contains all the commands a user could call on the command line to assemble an image.

This project contains a [Dockerfile](./Dockerfile) that builds off the public [DockerHub official node](https://hub.docker.com/_/node/) docker image to create a docker image for this application.

The docker image is built using the "*docker:build*" script defined in [package.json](./package.json).

```
npm run docker:build
```

The docker container is run using the "*docker:run*" script defined in [package.json](./package.json).

```
npm run docker:run
```

Memory, cpu, and I/O of running containers can be monitored using docker.

```
docker stats
```

| NAME | CPU % | MEM USAGE |
| ---- | ----- | --------- |
| app  | 0.00% | 9 MiB     |
