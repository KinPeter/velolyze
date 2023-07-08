# Velolyze

Web app to sync cycling activities from Strava and analyze their data - hence the name: Velo (French for cycling) + 
*Ana*lyze :)

## Features:

- Google login
- Strava API integration
- Activity summary with calendar and charts
- Several filters for activities
- TBA...

## Technologies used:

- Angular
- TypeScript
- Firebase (Firestore & Auth)
- PrimeNG UI
- Chart.js

## Development

Node version: See in `package.json` under `engines.node`.

### Environment variables

Have a `.env` file with the following variables:
```text
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
```

### Strava API Application credentials

Stored in Firebase Firestore in the `common` collection, the document has to have a field `name: 'stravaClient'`, and 
contain the following properties:
```text
stravaClientId:
stravaClientSecret:
stravaOauthRedirectUrl:
```

---
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4000/`. The application will automatically reload if 
you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
