// Fetch the JSON data from the provided URL
fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")
  .then((response) => response.json()) // Parse the response as JSON
  .then((data) => {
    const w = 960; // Set the width of the SVG container
    const h = 570; // Set the height of the SVG container

    // Define a function to map categories to color codes
    function colorMap(category) {
      if (category === "Wii") {
        return "rgb(76, 146, 195)";
      } else if (category === "GB") {
        return "rgb(255, 201, 147)";
      } else if (category === "PS2") {
        return "rgb(222, 82, 83)";
      } else if (category === "SNES") {
        return "rgb(209, 192, 221)";
      } else if (category === "GBA") {
        return "rgb(233, 146, 206)";
      } else if (category === "2600") {
        return "rgb(210, 210, 210)";
      } else if (category === "DS") {
        return "rgb(190, 210, 237)";
      } else if (category === "PS3") {
        return "rgb(86, 179, 86)";
      } else if (category === "3DS") {
        return "rgb(255, 173, 171)";
      } else if (category === "PS") {
        return "rgb(163, 120, 111)";
      } else if (category === "XB") {
        return "rgb(249, 197, 219)";
      } else if (category === "PSP") {
        return "rgb(201, 202, 78)";
      } else if (category === "X360") {
        return "rgb(255, 153, 62)";
      } else if (category === "NES") {
        return "rgb(173, 229, 161)";
      } else if (category === "PS4") {
        return "rgb(169, 133, 202)";
      } else if (category === "N64") {
        return "rgb(208, 176, 169)";
      } else if (category === "PC") {
        return "rgb(153, 153, 153)";
      } else if (category === "XOne") {
        return "rgb(226, 226, 164)";
      }
    }

    // Select the container with id "diagramContainer" and append an SVG element to it
    const svg = d3
      .select("#diagramContainer")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    // Create a tooltip element and set its initial opacity to 0
    const tooltip = d3
      .select("#diagramContainer")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    // Generate a hierarchical representation of the data using d3.hierarchy
    const root = d3
      .hierarchy(data, (node) => {
        return node["children"];
      })
      .sum((node) => {
        return node["value"];
      })
      .sort((node1, node2) => {
        return node2["value"] - node1["value"];
      });

    // Generate a treemap layout and compute the positions of the tree map cells
    d3.treemap().size([w, h])(root);

    // Select all the "g" elements and bind the data from the leaves of the tree map hierarchy
    const tile = svg.selectAll("g").data(root.leaves()).enter().append("g");

    // Append rectangles to represent the tree map cells
    tile
      .append("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .style("stroke", "white")
      .style("fill", (d) => colorMap(d.data.category))
      .attr("class", "tile")
      .attr("data-name", (d) => d.data.name)
      .attr("data-category", (d) => d.data.category)
      .attr("data-value", (d) => d.data.value);

    // Append foreignObject elements to allow HTML content inside the tree map cells
    tile
      .append("foreignObject")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .append("xhtml:div")
      .style("width", "100%")
      .style("height", "100%")
      .style("padding", "3px")
      .style("font-size", "10px")
      .text((d) => d.data.name.replace(/\//g, "/ "));

    // Attach event handlers to show/hide the tooltip
    tile
      .on("mousemove", function (event, d) {
        tooltip.style("opacity", 0.9);
        tooltip
          .html(
            "Name: " +
              d.data.name +
              "<br>" +
              "Category: " +
              d.data.category +
              "<br>" +
              "Value: " +
              d.data.value
          )
          .style("left", `${event.pageX + 20}px`)
          .style("top", `${event.pageY - 100}px`)
          .attr("data-value", d.data.value);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    // Define the legend data with labels and corresponding colors
    const legendData = [
      { label: "Wii", color: colorMap("Wii") },
      { label: "GB", color: colorMap("GB") },
      { label: "PS2", color: colorMap("PS2") },
      { label: "SNES", color: colorMap("SNES") },
      { label: "GBA", color: colorMap("GBA") },
      { label: "2600", color: colorMap("2600") },
      { label: "DS", color: colorMap("DS") },
      { label: "PS3", color: colorMap("PS3") },
      { label: "3DS", color: colorMap("3DS") },
      { label: "PS", color: colorMap("PS") },
      { label: "XB", color: colorMap("XB") },
      { label: "PSP", color: colorMap("PSP") },
      { label: "X360", color: colorMap("X360") },
      { label: "NES", color: colorMap("NES") },
      { label: "PS4", color: colorMap("PS4") },
      { label: "N64", color: colorMap("N64") },
      { label: "PC", color: colorMap("PC") },
      { label: "XOne", color: colorMap("XOne") }
    ];

    // Create the legend SVG container
    const legendSvg = d3
      .select("#legendContainer")
      .append("svg")
      .attr("width", 390)
      .attr("height", "auto");

    // Create a group element within the legend SVG
    const legend = legendSvg
      .append("g")
      .attr("id", "legend")
      .attr("transform", "translate(20, 20)");

    // Define the number of columns in the legend
    const numColumns = 3;

    // Append legend items (rectangles and labels) based on the legend data
    const legendItems = legend
      .selectAll(".legend-items")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-items")
      .attr("transform", (d, i) => {
        const row = Math.floor(i / numColumns);
        const column = i % numColumns;
        const x = column * 150;
        const y = row * 20;
        return `translate(${x}, ${y})`;
      });

    // Append rectangles to represent the legend items
    legendItems
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", (d) => d.color)
      .attr("class", "legend-item");

    // Append labels to represent the legend item labels
    legendItems
      .append("text")
      .attr("x", 15)
      .attr("y", 12)
      .text((d) => d.label);
  });
