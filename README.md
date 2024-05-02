# Publish teacher training courses (prototype)

This prototype is based on the [GOV.UK prototype kit](https://github.com/alphagov/govuk-prototype-kit)

## Requirements

- Node.js - version 20.x.x

## Installation

- Clone this repository to a folder on your computer
- Open Terminal
- In Terminal, change the path to the repository
- Type `npm install` to install the dependencies

## Working locally

- In Terminal, change the path to the repository
- Type `npm start`  and start the application

## Generating data

The prototype uses JSON files to store data and includes a set of seed data.

The seed data is copied to the working data directory when you run `npm install`.

You can also regenerate the data:

- In Terminal, change the path to the repository
- Type `npm run generate-data`

## Environment variables

The prototype includes a number of environment variables:

- NODE_ENV - Values: `development`, `staging` and `production`
- USE_HTTPS - force HTTP to redirect to HTTPS on production. Values: `true` or `false`
- USE_AUTH - enable or disable password protection on production. Values: `true` or `false`
- USE_LOGIN - use to turn on/off username and password login. If set to `false`, the login screen displays a list of test personas. Values: `true` or `false`
- USE_LOGIN_FALLBACK - not implemented. Use to show email magic link flow. Values: `true` or `false`
- PHASE_TAG_TEXT - use to change what text is displayed in the phase tag. Defaults to 'beta'
- IS_ROLLOVER - use to turn on/off roll over functionality. Values: `true` or `false`. Defaults to `false`.
