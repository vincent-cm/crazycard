crazycard - Demo angular app for gettting a quote for your credit
==========================================

Building crazycard
-----------------
Install [Node.js](https://nodejs.org/en/) on your system. - `currently tested with v10.4.0`
Clone this repository on your system
```
$ git clone git@github.com:vincent-cm/crazycard.git
```
Open a console and go to the project directory.
```
$ cd crazycard/
```
Install all package dependencies.
```
$ npm install
```
Now, build crazycard by using `npm`.
```
$ npm run start:aot
```

Build tasks
------------
`npm run build:aot`
Lints, minifies, unit tests and creates release packages for crazycard.

`npm run test`
Runs all unit tests on Krama.

`npm --help`
Displays the various build tasks.

Deploy tasks
------------
`npm run deploy`
Now you need to configure the deploy command with your own google clould credentials.
