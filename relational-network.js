(function () {
  const container = document.querySelector("#relational-network");
  const inspector = document.querySelector("#network-inspector");
  const tooltip = document.querySelector("#network-tooltip");
  const resetButton = document.querySelector("#network-reset");

  if (!container || typeof d3 === "undefined") return;

  const roleLabels = {
    astoria: "Astoria Alley family",
    jackson: "Jackson Courtyard family",
    redhook: "Red Hook Wharf family",
    les: "Lower East Side Bodega family"
  };

  const roleColors = {
    astoria: "#a96982",
    jackson: "#98a276",
    redhook: "#7193a3",
    les: "#88759e"
  };

  let resetView = () => {};

  Promise.all([d3.csv("nodes.csv"), d3.csv("edges.csv")])
    .then(([nodeRows, edgeRows]) => {
      const nodes = nodeRows.map((d, index) => ({
        ...d,
        portrait: `assets/cats/cat-${String(index + 1).padStart(2, "0")}.png`,
        age: +d.age,
        friends: +d.friends,
        size: +d.size,
        color: d.color || roleColors[d.role]
      }));

      const links = edgeRows.map((d) => ({
        ...d,
        since: d.since ? +d.since : null,
        strength: +d.strength
      }));

      document.querySelector("#node-count").textContent = nodes.length;
      document.querySelector("#edge-count").textContent = links.length;
      createNetwork(nodes, links);
    })
    .catch((error) => {
      console.error("Relational network data could not be loaded:", error);
      container.innerHTML =
        '<p class="network-error">The network needs a local web server to load its CSV files. Run this site through Live Server or another local server.</p>';
    });

  function createNetwork(nodes, links) {
    const width = 1100;
    const height = 700;
    const adjacency = new Map(nodes.map((node) => [node.id, []]));

    links.forEach((link) => {
      adjacency.get(link.source)?.push({ id: link.target, link });
      adjacency.get(link.target)?.push({ id: link.source, link });
    });

    const svg = d3
      .select(container)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("aria-hidden", "true");

    const definitions = svg.append("defs");

    definitions
      .selectAll("clipPath")
      .data(nodes)
      .join("clipPath")
      .attr("id", (d) => `portrait-${d.id}`)
      .append("circle")
      .attr("r", (d) => d.size - 2);

    definitions
      .append("filter")
      .attr("id", "node-glow")
      .append("feGaussianBlur")
      .attr("stdDeviation", 5)
      .attr("result", "blur");

    definitions
      .append("marker")
      .attr("id", "network-arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 30)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-4L9,0L0,4")
      .attr("fill", "#77736f");

    const viewport = svg.append("g").attr("class", "network-viewport");

    const link = viewport
      .append("g")
      .attr("class", "network-links")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => 0.75 + d.strength * 2.8)
      .attr("marker-end", (d) =>
        d.type === "directed" ? "url(#network-arrow)" : null
      );

    const node = viewport
      .append("g")
      .attr("class", "network-nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "network-node")
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr("aria-label", (d) => `${d.name}, ${roleLabels[d.role]}`);

    node
      .append("circle")
      .attr("class", "node-halo")
      .attr("r", (d) => d.size + 9)
      .attr("fill", (d) => d.color);

    node
      .append("image")
      .attr("class", "node-portrait")
      .attr("href", (d) => d.portrait)
      .attr("x", (d) => -d.size)
      .attr("y", (d) => -d.size)
      .attr("width", (d) => d.size * 2)
      .attr("height", (d) => d.size * 2)
      .attr("preserveAspectRatio", "xMidYMid slice")
      .attr("clip-path", (d) => `url(#portrait-${d.id})`);

    node
      .append("circle")
      .attr("class", "node-core")
      .attr("r", (d) => d.size)
      .attr("fill", "none")
      .attr("stroke", (d) => d.color);

    node
      .append("text")
      .attr("class", "node-label")
      .attr("y", (d) => d.size + 18)
      .attr("text-anchor", "middle")
      .text((d) => d.name);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance((d) => 105 + (1 - d.strength) * 90)
          .strength((d) => 0.28 + d.strength * 0.45)
      )
      .force("charge", d3.forceManyBody().strength(-520))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.035))
      .force("y", d3.forceY(height / 2).strength(0.045))
      .force("collision", d3.forceCollide().radius((d) => d.size + 42));

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    const zoom = d3
      .zoom()
      .scaleExtent([0.55, 3.5])
      .on("zoom", (event) => viewport.attr("transform", event.transform));

    svg.call(zoom).on("dblclick.zoom", null);

    resetView = () => {
      svg.transition().duration(650).call(zoom.transform, d3.zoomIdentity);
      nodes.forEach((d) => {
        d.fx = null;
        d.fy = null;
      });
      simulation.alpha(0.5).restart();
      clearSelection();
    };

    node.call(
      d3
        .drag()
        .on("start", (event, d) => {
          event.sourceEvent.stopPropagation();
          if (!event.active) simulation.alphaTarget(0.25).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event) => {
          if (!event.active) simulation.alphaTarget(0);
        })
    );

    node
      .on("pointerenter", function (event, d) {
        highlight(d);
        showTooltip(event, d);
      })
      .on("pointermove", (event) => positionTooltip(event))
      .on("pointerleave", () => {
        clearHighlight();
        tooltip.classList.remove("is-visible");
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        selectNode(d);
      })
      .on("keydown", (event, d) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectNode(d);
        }
      });

    svg.on("click", clearSelection);

    function highlight(selected) {
      const relatedIds = new Set([
        selected.id,
        ...adjacency.get(selected.id).map((item) => item.id)
      ]);

      node.classed("is-muted", (d) => !relatedIds.has(d.id));
      link.classed(
        "is-muted",
        (d) => d.source.id !== selected.id && d.target.id !== selected.id
      );
    }

    function clearHighlight() {
      node.classed("is-muted", false);
      link.classed("is-muted", false);
    }

    function showTooltip(event, d) {
      const connectionCount = adjacency.get(d.id).length;
      tooltip.innerHTML = `<strong>${d.name}</strong><span>${roleLabels[d.role]} · ${connectionCount} connection${connectionCount === 1 ? "" : "s"}</span>`;
      tooltip.classList.add("is-visible");
      positionTooltip(event);
    }

    function positionTooltip(event) {
      const frame = container.closest(".network-frame");
      const frameBounds = frame.getBoundingClientRect();
      const left = Math.min(event.clientX - frameBounds.left + 16, frameBounds.width - 230);
      const top = Math.max(event.clientY - frameBounds.top - 62, 12);
      tooltip.style.transform = `translate(${left}px, ${top}px)`;
    }

    function selectNode(d) {
      node.classed("is-selected", (item) => item.id === d.id);
      const connections = adjacency
        .get(d.id)
        .map(({ id, link: relation }) => {
          const other = nodes.find((item) => item.id === id);
          return `<li><span>${relation.relationship}</span>${other.name}</li>`;
        })
        .join("");

      inspector.innerHTML = `
        <img class="inspector-portrait" src="${d.portrait}" alt="Portrait of ${d.name}">
        <p class="inspector-index">${roleLabels[d.role]}</p>
        <h3>${d.name}</h3>
        <p>${d.age} year${d.age === 1 ? "" : "s"} old · territory: ${d.department}</p>
        <h4>Family relations / ${adjacency.get(d.id).length}</h4>
        <ul>${connections}</ul>
      `;
    }

    function clearSelection() {
      node.classed("is-selected", false);
      inspector.innerHTML = `
        <p class="inspector-index">SELECT A CAT</p>
        <h3>Meet the families</h3>
        <p>Hover to trace immediate family ties. Select a portrait to meet a cat and see their closest relations.</p>
      `;
    }
  }

  resetButton?.addEventListener("click", () => resetView());
})();
