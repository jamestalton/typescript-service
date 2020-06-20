# Typescript Service

[![Actions Status](https://github.com/jamestalton/typescript-service/workflows/build/badge.svg)](https://github.com/jamestalton/typescript-service/actions)

Project template for a web service using [TypeScript](https://www.typescriptlang.org/) and [Node.js](https://nodejs.org/en/).

## Prerequisites

-   [Node.js](https://nodejs.org) Version 12.x

## Install dependencies

[npm](https://www.npmjs.com/) is the package manager for the Node JavaScript platform.

Using [npm ci](https://docs.npmjs.com/cli/ci.html) installs the exact versions of dependencies listed in the package-lock.json into the node_modules directory.

```
npm ci
```

## Start the server

The server is written in Typescript, but using [ts-node](https://github.com/TypeStrong/ts-node) the server can be run with realtime transpilation and not need a pre-compilation step.

For development, the server is started with [npm start](https://docs.npmjs.com/cli/start.html) which runs the "_start_" script from the package.json.

```
npm start
```

This starts a HTTP server listening to port 3000 and serves a json "Hello World" response.

View the [Hello World](http://localhost:3000) in a web browser.

```json
{
    "message": "Hello World"
}
```

The application is running in a "watch" mode, watching for file changes and will restart when any source file changes.

## Debugging the service

Visual Studio Code is setup to debug the service using [launch.json](./.vscode/launch.json).

## Testing

The default command for running tests in node projects is [npm test](https://docs.npmjs.com/cli/test) which runs the test script from [package.json](./package.json).

```
npm test
```

[Jest](https://jestjs.io/) is a JavaScript Testing Framework with a focus on simplicity. Using [ts-jest](https://github.com/kulshekhar/ts-jest), jest is configured in the "_jest_" section of [package.json](./package.json). Jest is configured to enforce 100% code coverage. This is a best practice to ensure either code is tested or explicitly marked as not tested.

Install the [jest plugin](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest) for Visual Studio Code which runs the tests in the editor, giving real-time feedback. The plugin also adds a debug link for debugging tests in Visual Studio Code.

## Code Linting

Code linting checks are run using the "_lint_" script defined in [package.json](./package.json).

```
npm run lint
```

[ESLint](https://eslint.org/) statically analyzes your code to quickly find problems. ESLint is configured in the eslint section of the [package.json](./package.json). Linting rules are setup make cleaner code, reduce errors, and create a maintainable code base.

Install the [ESLint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for Visual Studio Code.

## Code Formatting

Code formatting checks are run using the "_check_" script defined in [package.json](./package.json).

```
npm run check
```

The code formatting is enforced using [Prettier](https://prettier.io/) - an opinionated code formatter.

> By far the biggest reason for adopting Prettier is to stop all the on-going debates over styles. It is generally accepted that having a common style guide is valuable for a project and team but getting there is a very painful and unrewarding process. People get very emotional around particular ways of writing code and nobody likes spending time writing and receiving nits.

Prettier is configured in the prettier section of the [package.json](./package.json).

Install the [Prettier plugin](https://github.com/prettier/prettier-vscode) for Visual Studio Code.

## Dependency Auditing

Security vulnerabilities are sometimes found in NPM packages. [npm audit](https://docs.npmjs.com/cli/audit) scans your project for vulnerabilities and can automatically install any compatible updates to vulnerable dependencies.

```
npm audit
```

## Dependency Upgrades

Dependency upgrades can be run using the "_update_" script defined in [package.json](./package.json).

```
npm run update
```

This will update dependencies, run audits, and run tests.

## Docker Containerization

[Docker](https://www.docker.com/get-started) is a tool designed to make it easier to create, deploy, and run applications by using containers. Containers allow a developer to package up an application with all of the parts it needs, such as libraries and other dependencies, and ship it all out as one package.

Docker can build images automatically by reading the instructions from a Dockerfile. A Dockerfile is a text document that contains all the commands a user could call on the command line to assemble an image.

This project contains a [Dockerfile](./Dockerfile) that builds off the public [DockerHub official node](https://hub.docker.com/_/node/) docker image to create a docker image for this application.

The docker image is built using the "_docker:build_" script defined in [package.json](./package.json).

```
npm run docker:build
```

The docker container can be run using the "_docker:run_" script defined in [package.json](./package.json).

```
npm run docker:run
```
