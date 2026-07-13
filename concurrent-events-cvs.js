(function () {
  "use strict";

  const container = d3.select("#d3-container-3");
  if (container.empty()) return;

  const palette = new Map([
    ["Capture", "#f2eee8"],
    ["Motion", "#ff8dcf"],
    ["Remote", "#74d7ff"],
    ["Transmission", "#ffd166"],
    ["Spatial", "#b9ff66"],
    ["Synthetic", "#b89cff"]
  ]);

  const margin = { top: 78, right: 32, bottom: 48, left: 196 };
  const innerWidth = 960 - margin.left - margin.right;
  const rowHeight = 29;

  const tooltip = container
    .append("div")
    .attr("class", "temporal-tooltip")
    .attr("aria-hidden", "true");

  d3.csv("events.csv", (row) => ({
    name: row.name.trim(),
    start: Number(row.start),
    end: Number(row.end),
    category: row.category.trim()
  }))
    .then((data) => {
      const validData = data
        .filter((item) => item.name && Number.isFinite(item.start) && Number.isFinite(item.end))
        .sort((a, b) => d3.ascending(a.start, b.start) || d3.ascending(a.end, b.end));

      if (!validData.length) throw new Error("The CSV contains no valid temporal records.");

      const innerHeight = validData.length * rowHeight;
      const svg = container
        .append("svg")
        .attr("viewBox", [0, 0, 960, innerHeight + margin.top + margin.bottom])
        .attr("aria-hidden", "true")
        .attr("preserveAspectRatio", "xMinYMin meet");

      const plot = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const domain = d3.extent(validData.flatMap((item) => [item.start, item.end]));
      const x = d3.scaleLinear().domain(domain).nice().range([0, innerWidth]);
      const y = d3
        .scaleBand()
        .domain(validData.map((item) => item.name))
        .range([0, innerHeight])
        .paddingInner(0.34);

      const ticks = x.ticks(9);

      plot
        .append("g")
        .attr("class", "temporal-grid")
        .selectAll("line")
        .data(ticks)
        .join("line")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", -24)
        .attr("y2", innerHeight);

      plot
        .append("g")
        .attr("class", "temporal-axis")
        .attr("transform", "translate(0,-24)")
        .call(d3.axisTop(x).tickValues(ticks).tickFormat(d3.format("d")).tickSize(0))
        .call((axis) => axis.select(".domain").remove());

      const categories = Array.from(new Set(validData.map((item) => item.category)));
      const legend = svg
        .append("g")
        .attr("class", "temporal-legend")
        .attr("transform", `translate(${margin.left},25)`);

      const legendItems = legend
        .selectAll("g")
        .data(categories)
        .join("g")
        .attr("transform", (_, index) => `translate(${index * 112},0)`);

      legendItems
        .append("line")
        .attr("x1", 0)
        .attr("x2", 14)
        .attr("stroke", (category) => palette.get(category) || "#fff");

      legendItems
        .append("text")
        .attr("x", 20)
        .attr("y", 3)
        .text((category) => category);

      const signals = plot
        .selectAll("g.temporal-signal")
        .data(validData)
        .join("g")
        .attr("class", "temporal-signal")
        .attr("transform", (item) => `translate(0,${y(item.name)})`)
        .attr("tabindex", 0)
        .attr("role", "button")
        .attr("aria-label", (item) => `${item.name}, ${item.start} to ${item.end}, ${item.category}`);

      signals
        .append("text")
        .attr("class", "signal-name")
        .attr("x", -16)
        .attr("y", y.bandwidth() / 2)
        .attr("dy", "0.34em")
        .attr("text-anchor", "end")
        .text((item) => item.name);

      signals
        .append("line")
        .attr("class", "signal-line")
        .attr("x1", (item) => x(item.start))
        .attr("x2", (item) => x(item.end))
        .attr("y1", y.bandwidth() / 2)
        .attr("y2", y.bandwidth() / 2)
        .attr("stroke", (item) => palette.get(item.category) || "#fff");

      signals
        .append("rect")
        .attr("class", "signal-origin")
        .attr("x", (item) => x(item.start) - 3)
        .attr("y", y.bandwidth() / 2 - 3)
        .attr("width", 6)
        .attr("height", 6)
        .attr("fill", (item) => palette.get(item.category) || "#fff");

      signals
        .append("circle")
        .attr("class", "signal-end")
        .attr("cx", (item) => x(item.end))
        .attr("cy", y.bandwidth() / 2)
        .attr("r", 2.5)
        .attr("fill", (item) => palette.get(item.category) || "#fff");

      const showDetail = (event, item) => {
        signals.classed("is-muted", (candidate) => candidate.category !== item.category);
        d3.select(event.currentTarget).classed("is-active", true);
        tooltip
          .attr("aria-hidden", "false")
          .html(
            `<span>${item.category}</span><strong>${item.name}</strong>` +
            `<p>${item.start}—${item.end} / ${item.end - item.start} years</p>`
          )
          .style("left", `${Math.min(event.offsetX + 18, container.node().clientWidth - 230)}px`)
          .style("top", `${event.offsetY + 18}px`)
          .classed("is-visible", true);
      };

      const hideDetail = () => {
        signals.classed("is-muted", false).classed("is-active", false);
        tooltip.attr("aria-hidden", "true").classed("is-visible", false);
      };

      signals
        .on("pointerenter", showDetail)
        .on("pointermove", showDetail)
        .on("pointerleave", hideDetail)
        .on("focus", showDetail)
        .on("blur", hideDetail);
    })
    .catch((error) => {
      console.error("Temporal visualization failed to load:", error);
      container
        .append("p")
        .attr("class", "temporal-error")
        .text("The timeline could not load. Run the site through a local server and check events.csv.");
    });
})();
