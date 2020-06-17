![screenshot](/docs/screenshot.png)

# Github Issue Manager

## Description

A issue and task management app for github issues.

Login with a Github token then you get redirected to a dashboard with the latest issues assigned to you (only OPEN issues).

These can be resolved, closed or dragged into a Work Log.

The Work Log is similar to a trello board and the items can be moved around freely.

Note: The position is not persisted for ease of Demoing but a persistent state could easliy be added (localStorage, firebase, mondgoDB etc..)

When an issue is Resolved or Closed the following happens:

- A comment is made on the specific Github issue (Resolved/Closed)
- The issue is closed.


## Stack

- Frontend framework: <i>Angular 9.1</i>
- Component library: <i>Angular Material</i>
- State Management: <i>NgRx</i>
- API Client: <i>Apollo (GraphQl)</i>
- Deployment: <i>Netlify</i>

## Development

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
