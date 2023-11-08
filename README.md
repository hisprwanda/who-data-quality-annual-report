This project was bootstrapped with [DHIS2 Application Platform](https://github.com/dhis2/app-platform).

## Designs of the app

Follow this link to view [the proposed designs of the app in Figma](https://www.figma.com/proto/r5H9Zq1dAeJ0PXyKmMCJgG/Data-Quality-App---HISP-Rwanda?type=design&node-id=82-24&scaling=min-zoom&page-id=0%3A1&starting-point-node-id=1%3A3)

## Data store

During development, to avoid making changes that affect other developers, you can use a custom data store key. To do this, set the `REACT_APP_DHIS2_APP_DATASTORE_KEY` environment variable to the key of your choice, for example in an `.env.local` file. The default data store key is `configurations`, which will be used in production.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner and runs all available tests found in `/src`.<br />

See the section about [running tests](https://platform.dhis2.nu/#/scripts/test) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
A deployable `.zip` file can be found in `build/bundle`!

See the section about [building](https://platform.dhis2.nu/#/scripts/build) for more information.

### `yarn deploy`

Deploys the built app in the `build` folder to a running DHIS2 instance.<br />
This command will prompt you to enter a server URL as well as the username and password of a DHIS2 user with the App Management authority.<br/>
You must run `yarn build` before running `yarn deploy`.<br />

See the section about [deploying](https://platform.dhis2.nu/#/scripts/deploy) for more information.

## Learn More

You can learn more about the platform in the [DHIS2 Application Platform Documentation](https://platform.dhis2.nu/).

You can learn more about the runtime in the [DHIS2 Application Runtime Documentation](https://runtime.dhis2.nu/).

To learn React, check out the [React documentation](https://reactjs.org/).
