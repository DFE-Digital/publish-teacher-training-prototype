# Publish teacher training courses (prototype)

This prototype is based on the [GOV.UK prototype kit](https://github.com/alphagov/govuk-prototype-kit)

## Requirements

- Node.js - version 16.x.x

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

- NODE_ENV - `development`, `staging` and `production`
- USE_HTTPS - `true` or `false`
- USE_AUTH - use to turn on/off the browser authentication. Values: `true` or `false`
- USE_LOGIN - `true` or `false`
- USE_LOGIN_FALLBACK - not implemented. Use to show email magic link flow. Values: `true` or `false`
- PHASE_TAG_TEXT - use to change what text is displayed in the phase tag. Defaults to 'beta'
