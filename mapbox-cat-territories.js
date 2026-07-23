(() => {
  const mapContainer = document.querySelector("#cat-territory-map");
  const status = document.querySelector("#map-status");
  const inspector = document.querySelector("#geo-inspector");
  const token = document
    .querySelector('meta[name="mapbox-token"]')
    ?.getAttribute("content")
    ?.trim();

  if (!mapContainer || !status || !inspector) return;

  if (!window.mapboxgl) {
    showStatus("MAP LIBRARY UNAVAILABLE", "Mapbox GL JS could not be loaded.", true);
    return;
  }

  if (!token || token === "YOUR_MAPBOX_ACCESS_TOKEN" || !token.startsWith("pk.")) {
    showStatus(
      "MAP CONNECTION PENDING",
      "Replace YOUR_MAPBOX_ACCESS_TOKEN in index.html with your public pk... token."
    );
    return;
  }

  const colonies = {
    type: "FeatureCollection",
    features: [
      colony("astoria", "Astoria Alley", [-73.9182, 40.7674], 3, "31st Avenue", "Fire escapes, boiler rooms, and a late-night food route behind the corner laundromat.", "#d77c9c"),
      colony("jackson", "Jackson Courtyard", [-73.8846, 40.7557], 3, "82nd Street", "A protected courtyard territory shared with a community garden and its winter shelters.", "#bbc67c"),
      colony("redhook", "Red Hook Wharf", [-74.0092, 40.6757], 3, "Pier 44", "A waterfront colony tracing fish-market deliveries between Van Brunt Street and the pier.", "#7db8ce"),
      colony("les", "Lower East Side Bodega", [-73.9881, 40.7184], 3, "Orchard Street", "Awning shade, warm stockrooms, and a caretaker route along Orchard Street after closing.", "#a990d0")
    ]
  };

  const nightRoutes = {
    type: "FeatureCollection",
    features: [
      route("Queens night route", colonies.features[0], colonies.features[1]),
      route("East River route", colonies.features[1], colonies.features[3]),
      route("Ferry window route", colonies.features[2], colonies.features[3])
    ]
  };

  window.mapboxgl.accessToken = token;
  let mapLoaded = false;

  const map = new window.mapboxgl.Map({
    container: mapContainer,
    style: "mapbox://styles/mapbox/dark-v11",
    center: [-73.95, 40.72],
    zoom: 10.4,
    minZoom: 9,
    maxZoom: 16,
    pitch: 18,
    bearing: -8,
    attributionControl: false
  });

  map.addControl(new window.mapboxgl.NavigationControl({ showCompass: true }), "top-right");
  map.addControl(new window.mapboxgl.AttributionControl({ compact: true }), "bottom-right");

  map.on("load", () => {
    mapLoaded = true;
    addTerritoryLayers(map);
    addRouteLayers(map);
    addColonyLayers(map);
    bindInteractions(map);

    map.fitBounds(
      colonies.features.reduce(
        (bounds, feature) => bounds.extend(feature.geometry.coordinates),
        new window.mapboxgl.LngLatBounds()
      ),
      { padding: { top: 70, right: 275, bottom: 70, left: 70 }, duration: 1400, maxZoom: 11.2 }
    );

    status.classList.add("is-hidden");
  });

  map.on("error", (event) => {
    if (!event.error) return;
    console.error("Mapbox map error:", event.error);
    if (!mapLoaded) {
      showStatus("MAP ERROR", "Check your access token and run the site through a local server.", true);
    }
  });

  function addTerritoryLayers(mapInstance) {
    mapInstance.addSource("cat-territories", {
      type: "geojson",
      data: "assets/nyc-cat-territories.geojson",
      generateId: true
    });

    mapInstance.addLayer({
      id: "territory-fill",
      type: "fill",
      source: "cat-territories",
      paint: {
        "fill-color": territoryColorExpression(),
        "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.42, 0.22]
      }
    });

    mapInstance.addLayer({
      id: "territory-outline",
      type: "line",
      source: "cat-territories",
      paint: {
        "line-color": territoryColorExpression(),
        "line-width": ["interpolate", ["linear"], ["zoom"], 9, 1.2, 14, 3],
        "line-opacity": 0.9
      }
    });

    mapInstance.addLayer({
      id: "territory-labels",
      type: "symbol",
      source: "cat-territories",
      minzoom: 10,
      layout: {
        "text-field": ["get", "ntaname"],
        "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 10, 10, 14, 13],
        "text-letter-spacing": 0.08,
        "text-transform": "uppercase"
      },
      paint: {
        "text-color": "#f4edf0",
        "text-halo-color": "#17161b",
        "text-halo-width": 1.5
      }
    });
  }

  function addRouteLayers(mapInstance) {
    mapInstance.addSource("night-routes", { type: "geojson", data: nightRoutes });

    mapInstance.addLayer({
      id: "night-route-glow",
      type: "line",
      source: "night-routes",
      paint: {
        "line-color": "#d5cad0",
        "line-width": 6,
        "line-opacity": 0.08,
        "line-blur": 4
      }
    });

    mapInstance.addLayer({
      id: "night-routes",
      type: "line",
      source: "night-routes",
      paint: {
        "line-color": "#d5cad0",
        "line-width": 1.2,
        "line-opacity": 0.58,
        "line-dasharray": [2, 3]
      }
    });
  }

  function addColonyLayers(mapInstance) {
    mapInstance.addSource("cat-colonies", { type: "geojson", data: colonies, generateId: true });

    mapInstance.addLayer({
      id: "colony-halo",
      type: "circle",
      source: "cat-colonies",
      paint: {
        "circle-radius": ["case", ["boolean", ["feature-state", "selected"], false], 25, 18],
        "circle-color": ["get", "color"],
        "circle-opacity": 0.16,
        "circle-blur": 0.55
      }
    });

    mapInstance.addLayer({
      id: "colony-points",
      type: "circle",
      source: "cat-colonies",
      paint: {
        "circle-radius": ["case", ["boolean", ["feature-state", "selected"], false], 10, 7],
        "circle-color": ["get", "color"],
        "circle-stroke-color": "#f4edf0",
        "circle-stroke-width": 2
      }
    });

    mapInstance.addLayer({
      id: "colony-labels",
      type: "symbol",
      source: "cat-colonies",
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
        "text-size": 12,
        "text-offset": [0, 1.4],
        "text-anchor": "top",
        "text-letter-spacing": 0.05
      },
      paint: {
        "text-color": "#ffffff",
        "text-halo-color": "#17161b",
        "text-halo-width": 2
      }
    });
  }

  function bindInteractions(mapInstance) {
    let hoveredTerritoryId = null;
    let selectedColonyId = null;

    mapInstance.on("mousemove", "territory-fill", (event) => {
      if (!event.features?.length) return;
      if (hoveredTerritoryId !== null) {
        mapInstance.setFeatureState({ source: "cat-territories", id: hoveredTerritoryId }, { hover: false });
      }
      hoveredTerritoryId = event.features[0].id;
      mapInstance.setFeatureState({ source: "cat-territories", id: hoveredTerritoryId }, { hover: true });
    });

    mapInstance.on("mouseleave", "territory-fill", () => {
      if (hoveredTerritoryId !== null) {
        mapInstance.setFeatureState({ source: "cat-territories", id: hoveredTerritoryId }, { hover: false });
      }
      hoveredTerritoryId = null;
    });

    mapInstance.on("mouseenter", "colony-points", () => {
      mapInstance.getCanvas().style.cursor = "pointer";
    });

    mapInstance.on("mouseleave", "colony-points", () => {
      mapInstance.getCanvas().style.cursor = "";
    });

    mapInstance.on("click", "colony-points", (event) => {
      const feature = event.features?.[0];
      if (!feature) return;

      if (selectedColonyId !== null) {
        mapInstance.setFeatureState({ source: "cat-colonies", id: selectedColonyId }, { selected: false });
      }

      selectedColonyId = feature.id;
      mapInstance.setFeatureState({ source: "cat-colonies", id: selectedColonyId }, { selected: true });
      updateInspector(feature.properties);
    });
  }

  function updateInspector(properties) {
    inspector.replaceChildren();

    const index = document.createElement("p");
    index.className = "geo-inspector__index";
    index.textContent = `FIELD NOTE / ${properties.id.toUpperCase()}`;

    const title = document.createElement("h3");
    title.textContent = properties.name;

    const note = document.createElement("p");
    note.textContent = properties.note;

    const details = document.createElement("dl");
    details.append(
      detail("Home range", properties.anchor),
      detail("Residents", `${properties.residents} cats`)
    );

    inspector.append(index, title, note, details);
    inspector.style.setProperty("--active-colony", properties.color);
  }

  function detail(label, value) {
    const wrapper = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = value;
    wrapper.append(term, description);
    return wrapper;
  }

  function showStatus(title, message, isError = false) {
    status.classList.toggle("is-error", isError);
    status.classList.remove("is-hidden");
    status.replaceChildren();

    const heading = document.createElement("strong");
    const copy = document.createElement("span");
    heading.textContent = title;
    copy.textContent = message;
    status.append(heading, copy);
  }

  function territoryColorExpression() {
    return [
      "match",
      ["get", "ntaname"],
      "Astoria (Central)", "#d77c9c",
      "Jackson Heights", "#bbc67c",
      "Carroll Gardens-Cobble Hill-Gowanus-Red Hook", "#7db8ce",
      "Lower East Side", "#a990d0",
      "#8d8790"
    ];
  }

  function colony(id, name, coordinates, residents, anchor, note, color) {
    return {
      type: "Feature",
      properties: { id, name, residents, anchor, note, color },
      geometry: { type: "Point", coordinates }
    };
  }

  function route(name, start, end) {
    return {
      type: "Feature",
      properties: { name },
      geometry: {
        type: "LineString",
        coordinates: [start.geometry.coordinates, end.geometry.coordinates]
      }
    };
  }
})();
