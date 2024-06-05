# Publish teacher training courses prototype

A service for training providers to publish and manage their courses.

This prototype is based on the:

- [GOV.UK Design System](https://design-system.service.gov.uk/)
- [GOV.UK Prototype Kit](https://prototype-kit.service.gov.uk/docs/)

## Requirements

- Node.js - version 20.x.x

## Installation

- Clone this repository to a folder on your computer
- Open Terminal
- In Terminal, change the path to the repository
- Type `npm install` to install the dependencies

## Working locally

- In Terminal, change the path to the repository
- Type `npm run dev`  and start the application

## Generating data

The prototype uses JSON files to store data and includes a set of seed data.

The seed data is copied to the working data directory (`app/data/dist`) when you run `npm install`.

You can also regenerate the data:

- In Terminal, change the path to the repository
- Type `npm run generate-data`

## Environment variables

The prototype uses environment variables to help configure the application:

| Variable | Type | Description |
| --- | --- | --- |
| `USE_LOGIN` | boolean | Use to turn on/off username and password login. If set to `false`, the login screen displays a list of test personas. Values: `true` or `false` |
| `PHASE_TAG_TEXT` | string | Use to change what text is displayed in the phase tag. Defaults to 'beta' |
| `IS_ROLLOVER` | boolean | Use to turn on/off rollover functionality. Values: `true` or `false` |

## Tools

If you’re using [Visual Studio (VS) Code](https://code.visualstudio.com/) for prototyping, we recommend you install the following extensions:

- [GOV.UK Design System snippets](https://marketplace.visualstudio.com/items?itemName=simonwhatley.govuk-design-system-snippets)
- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [Nunjucks for VS Code](https://marketplace.visualstudio.com/items?itemName=ronnidc.nunjucks)
- [Nunjucks snippets](https://marketplace.visualstudio.com/items?itemName=luwenjiechn.nunjucks-vscode-snippets)

We also recommend you update your VS Code settings to make sure you’re trimming whitespace: `Files: Trim Trailing Whitespace`.
