# Typescript Service Template

Template project for creating a http server using NodeJS and Typescript.

NodeJS and Typescript are a good choice for creating a http server. Strong type-checking, fast development, great environment, strong community, and good performance all make for a very pleasant and powerful technology for web services.

This template includes:

-   Real-time Typescript compilation using TS-Node
-   Debugging setup for VSCode
-   Unit Tests using Jest
-   Linting using ESLint
-   Formatting using Prettier
-   Security Audits using NPM
-   Support for building a Docker Image

## Prerequisites

-   [NodeJS](https://nodejs.org/en/) 10.0+

## Install dependencies

Using npm ci installs the exact versions of dependencies listed in the package-lock.json into the node_modules directory.
NodeJS will be able to find the dependencies when running the server.

```
npm ci
```

## Start the server

The server is written in Typescript, but using TS-Node we can run the code with real-time compilation and not need a pre-compilation step. This makes developing with Typescript a breeze. The server also starts in watch mode where it will restart when any changes to the code are made.

```
npm start
```

The server starts up listening to port 3000 and serves up "Hello World".

View the [Hello World](http://localhost:3000).

```
open http://localhost:3000
```

## Running tests

The tests for the project include

-   Unit Tests using Jest
-   Linting using ESLint
-   Formatting using Prettier
-   Security Audits using NPM

```
npm test
```

### Unit Tests

Jest is a test runner. It will run each test file in parallel speeding up testing. It support mocks, expectations, assertions, and code coverage.

Jest is configured in the jest section of the package.json. It is setup to use TS-Node for real-time compilation and running of tests.

VSCode Plugin: ESJest

Using VSCode, install the Jest plugin and tests will run real-time in VSCode with failure feedback. This makes writing and maintaining tests a breeze. The project is also already setup for debugging tests using VSCode if needed.

```
npm run jest
```

### Linting

Linting checks rules to create cleaner more maintainable code.

ESLint is used in favor of TSLint as TSLint has been deprecated in favor of enhancing ESLint long-term.

ESLint is configured in the eslint section of the package.json.

VSCode Plugin: ESLint

```
npm run eslint
```

### Formatting

Prettier is a code formatter that formats the code with strict formatting guidelines.
Using prettier removes arguments about code formatting and keeps code commits consistent making for easier code reviews.

Prettier is configured in the prettier section of the package.json.

VSCode Plugin: Prettier

```
npm run prettier
```

### Security Auditing

Security vulnerabilities are sometimes found in NPM packages and if your project is using those version of the package as dependencies, then your project has a security vulnerability. Running 'npm audit' checks your dependencies for known vulnerabilities.

```
npm audit
```

## Build

Typescript is compiled using the typescript compiler (tsc).

Tsc is configured in tsconfig.json.

The output of the compilation will be in the 'lib' directory.

```
npm run build
```

## Docker

The project is also setup to support docker.

You need to have a docker environment installed locally to build and run the docker image.

### Docker Build

To build the docker image

```
npm run docker:build
```

### Docker Run

To run the docker image as a docker container

```
npm run docker:run
```
