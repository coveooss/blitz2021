# Blitz 2020 - The Crew UI

## Build, test and debug

1. Install all the dependencies
   `> yarn install`

2. Start local dev. server
   `> yarn dev`

3. Run the tests
   `> yarn test`
   or
   `> yarn test-watch`

## Publish a version for the dashboard

1. Make sure you are a [collaborator of the project](https://www.npmjs.com/package/@germainbergeron/blitz-ui) 
1. Make sure the tests are green: `yarn test`
1. Build the project: `yarn build`
1. Bump a patch: `yarn version --patch`
1. Deploy the version: `yarn publish`, press `enter` to skip the version prompt
1. Push the modification that yarn made to the package.json file 
1. Trigger a build of the dashboard [here](https://gitlab.com/coveo/blitz/maitre-b/-/pipelines/new)
