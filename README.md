# IdneoExercise - Temperature dashboard

This project features a dashboard with simulated real-time temperatures.

It includes:
- Display of the current temperature.

- Graph of the last 20 values.

- Statistics header (min, max, average) with color changes based on thresholds.

- Automatic reconnection in case of simulated shutdown.
## Folder structure

```
src/
  app/
    features/
      dashboards/
        dashboard-temperature/
          services/
          components/
            chart/
            header/
            current-temperature/
          temperature-dashboard.page.ts
    shared/
      models/
      utils/
      services/
      workers/
    core/
      theme.service

```

- It contains the temperature dashboard page and its components. It also includes a service that consumes the simulated temperature from the SSE.
- It contains shared resources and features, such as event types, utilities, services, and workers, that could be used by other components.
- It contains core services and functionalities that are typically instantiated only once and are available to the entire application. The theme is a singleton.

## Tecnologies

- Angular 20 (Standalone Components, Signals, Computed)
- RxJS
- Chart.js, ng2-charts
- Vitest

## Install dependencies

run:

```bash
pnpm i
```

## Development server

To start a local development server, run:

```bash
pnpm run start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.


## Running unit tests

Run tests using vitest, 100% coverage was not required.

```bash
pnpm run test
```


## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.
