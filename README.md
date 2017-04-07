# ember-arbolista

This README outlines the details of collaborating on this Ember addon.

## Installation

* `git clone <repository-url>` this repository
* `cd ember-arbolista`
* `npm install`
* `bower install`

## Assumptions

Model passed to the component has the following attributes:

* name (required; overridable)
* parentId (required)
* children (optional; array of ids or model objects)



## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
