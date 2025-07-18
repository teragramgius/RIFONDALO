import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

const NetworkGraph = ({ 
  data, 
  onNodeClick, 
  interactive = true, 
  showLabels = true, 
  width = 800, 
  height = 600,
  showLegend = true 
}) => {
  const svgRef = useRef()
  const [simulation, setSimulation] = useState(null)

  useEffect(() => {
    if (!data.nodes || !data.edges) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // Set up SVG
    const container = svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform)
      })

    if (interactive) {
      svg.call(zoom)
    }

    const g = container.append("g")

    // Color schemes for different node types
    const colors = {
      center: '#1B365D', // Navy
      category: '#D4A574', // Orange
      project: {
        'PM_Policy': '#1B365D', // Navy
        'UX_Design': '#D4A574' // Orange
      },
      person: '#718096', // Cool gray
      default: '#E8DDD4' // Sand
    }

    // Create simulation
    const sim = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.edges).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30))

    setSimulation(sim)

    // Create links
    const link = g.append("g")
      .selectAll("line")
      .data(data.edges)
      .enter().append("line")
      .attr("class", "network-link")
      .attr("stroke-width", d => Math.sqrt(d.strength || 1) * 2)

    // Create nodes
    const node = g.append("g")
      .selectAll("circle")
      .data(data.nodes)
      .enter().append("circle")
      .attr("r", d => {
        if (d.type === 'center') return 25
        if (d.type === 'category') return 20
        if (d.type === 'project') return 15
        if (d.type === 'person') return 12
        return 10
      })
      .attr("fill", d => {
        if (d.type === 'center') return colors.center
        if (d.type === 'category') return colors.category
        if (d.type === 'project') return colors.project[d.category] || colors.default
        if (d.type === 'person') return colors.person
        return colors.default
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("class", d => `network-node-${d.type}`)

    // Add labels if enabled
    if (showLabels) {
      const labels = g.append("g")
        .selectAll("text")
        .data(data.nodes)
        .enter().append("text")
        .text(d => d.label)
        .attr("font-size", d => {
          if (d.type === 'center') return "14px"
          if (d.type === 'category') return "12px"
          return "10px"
        })
        .attr("font-weight", d => d.type === 'center' ? "bold" : "normal")
        .attr("text-anchor", "middle")
        .attr("dy", d => {
          if (d.type === 'center') return 35
          if (d.type === 'category') return 30
          return 25
        })
        .attr("fill", "#2D3748")
        .attr("pointer-events", "none")
        .style("user-select", "none")

      sim.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y)

        node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)

        labels
          .attr("x", d => d.x)
          .attr("y", d => d.y)
      })
    } else {
      sim.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y)

        node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
      })
    }

    // Add interactivity
    if (interactive) {
      node
        .call(d3.drag()
          .on("start", (event, d) => {
            if (!event.active) sim.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on("drag", (event, d) => {
            d.fx = event.x
            d.fy = event.y
          })
          .on("end", (event, d) => {
            if (!event.active) sim.alphaTarget(0)
            d.fx = null
            d.fy = null
          }))
        .on("click", (event, d) => {
          if (onNodeClick) {
            onNodeClick(d)
          }
        })
        .style("cursor", "pointer")

      // Add hover effects
      node
        .on("mouseover", function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", d => {
              if (d.type === 'center') return 30
              if (d.type === 'category') return 25
              if (d.type === 'project') return 18
              if (d.type === 'person') return 15
              return 12
            })
            .attr("stroke-width", 3)

          // Highlight connected links
          link
            .style("opacity", l => 
              l.source.id === d.id || l.target.id === d.id ? 1 : 0.3
            )
        })
        .on("mouseout", function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", d => {
              if (d.type === 'center') return 25
              if (d.type === 'category') return 20
              if (d.type === 'project') return 15
              if (d.type === 'person') return 12
              return 10
            })
            .attr("stroke-width", 2)

          // Reset link opacity
          link.style("opacity", 1)
        })
    }

    // Add legend if enabled
    if (showLegend) {
      const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(20, 20)`)

      const legendData = [
        { type: 'center', label: 'Portfolio Center', color: colors.center },
        { type: 'category', label: 'Expertise Areas', color: colors.category },
        { type: 'project-pm', label: 'PM & Policy Projects', color: colors.project['PM_Policy'] },
        { type: 'project-ux', label: 'UX Design Projects', color: colors.project['UX_Design'] },
        { type: 'person', label: 'Collaborators', color: colors.person }
      ]

      const legendItems = legend.selectAll(".legend-item")
        .data(legendData)
        .enter().append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 25})`)

      legendItems.append("circle")
        .attr("r", 8)
        .attr("fill", d => d.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)

      legendItems.append("text")
        .attr("x", 20)
        .attr("y", 0)
        .attr("dy", "0.35em")
        .attr("font-size", "12px")
        .attr("fill", "#2D3748")
        .text(d => d.label)

      // Add legend background
      const legendBBox = legend.node().getBBox()
      legend.insert("rect", ":first-child")
        .attr("x", legendBBox.x - 10)
        .attr("y", legendBBox.y - 10)
        .attr("width", legendBBox.width + 20)
        .attr("height", legendBBox.height + 20)
        .attr("fill", "rgba(255, 255, 255, 0.9)")
        .attr("stroke", "#D4C7B8")
        .attr("stroke-width", 1)
        .attr("rx", 5)
    }

    return () => {
      if (sim) {
        sim.stop()
      }
    }
  }, [data, width, height, interactive, showLabels, showLegend, onNodeClick])

  return (
    <div className="network-graph-container">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  )
}

export default NetworkGraph

