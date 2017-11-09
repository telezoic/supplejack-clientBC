
## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Bower](https://bower.io/)
* [Ember CLI](https://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* `cd supplejack-client`
* `npm install`
* `bower install`

Before running it, edit `config/environment.js` and include the IP for
your Supplejack API and your API key.

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running / Development via fastboot

* `ember build`
* `npm run fastboot`
*  visit your app at http://localhost:8001

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

## Further Reading / Useful Links
* [Live site!](http://eln-sj4.is.sfu.ca:8001/search)
* https://github.com/OurDigitalWorld/supplejack-ember/wiki/Ember-Client-in-the-cloud
* https://github.com/OurDigitalWorld/supplejack-ember/wiki/Ember-client
* [ember.js](http://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)