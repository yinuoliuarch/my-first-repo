# my-first-repo

An experimental Y2K-style cat blog featuring an interactive D3.js relational
map and a Mapbox GL JS geospatial canvas.

The **NYC Street Cats Relational Map** loads `nodes.csv`, `edges.csv`, and a
project-local set of generated cat portraits, so view the project
through a local web server rather than opening `index.html` directly. For
example, use the VS Code Live Server extension or run `python -m http.server`.

## Mapbox setup

1. Copy a public token beginning with `pk.` from your Mapbox account.
2. In `index.html`, replace `YOUR_MAPBOX_ACCESS_TOKEN` in the
   `mapbox-token` meta tag.
3. Start a local server and open the site through `http://localhost...`.

The map loads the project-local `assets/nyc-cat-territories.geojson`, a filtered
subset of the official NYC Department of City Planning 2020 Neighborhood
Tabulation Areas dataset. The four colony points and connecting night routes
are an imagined dataset created for this project.
