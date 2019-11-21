import React, { Component } from "react";
import * as d3 from "d3";

const width = "100%";
const height = 700;
class BubbleChart extends Component {
  constructor(props) {
    super(props);
    const { technologies } = this.props;
    const categoryDataList = [];
    const legendList = {};

    for (let value of technologies) {
      if (!(value.category in categoryDataList))
        categoryDataList[value.category] = [value];
      else categoryDataList[value.category].push(value);
    }

    for (let catValue of technologies) {
      legendList[catValue.category] = catValue.color;
    }

    let firstCategory = Object.keys(legendList)[0];

    this.state = {
      showData: [],
      legend: legendList,
      currentCategory: firstCategory,
      categoryDataList: categoryDataList
    };
  }

  componentDidMount() {
    this.drawBubble(this.state.currentCategory);
  }

  onClicked = currentCategory => {
    this.setState({ currentCategory: currentCategory });
    this.drawBubble(currentCategory);
  };

  drawBubble = currentCategory => {
    let data =  currentCategory === 'All' ? 
    this.props.technologies : this.state.categoryDataList[currentCategory];

    data = data.filter(value =>{
      return value.category !== 'All'
    })

    const countCat = data.length;
    let svg = d3.select(".bubble");
    let width = document.body.clientWidth; // get width in pixels
    let height = +svg.attr("height");
    let centerX = width * 0.5;
    let centerY = height * 0.5;
    let strength = 0.04;
    let focusedNode;
    // use pack to calculate radius of the circle
    let pack = d3
      .pack()
      .size([width, height])
      .padding(1.6);
    let forceCollide = d3.forceCollide(d => d.r);
    // use the force
    let simulation = d3
      .forceSimulation()
      .force("charge", d3.forceManyBody())
      .force("collide", forceCollide)
      .force("center", d3.forceCenter(centerX, centerY))
      .force("x", d3.forceX(centerX).strength(strength))
      .force("y", d3.forceY(centerY).strength(strength));

    let root = d3.hierarchy({ children: data }).sum(d => d.value);

    // use pack() to automatically calculate radius conveniently only
    // and get only the leaves
    let nodes = pack(root)
      .leaves()
      .map(node => {
        // console.log("node:", node.x, (node.x - centerX) * 2);
        const data = node.data;
      
        return {
          x: centerX + (node.x - centerX) * 2, // magnify start position to have transition to center movement
          y: centerY + (node.y - centerY) * 2,
          r: 0, // for tweening
          R: data.color.R,
          G: data.color.G,
          B: data.color.B,
          radius:  countCat > 70 ? 30 : countCat > 50 ? 40 : 50, //original radius
          id: data.category + "." + data.name.replace(/\s/g, "-"),
          cat: data.category,
          name: data.name,
          icon: data.icon
        };
      });
      
      console.log(data.category)
    simulation.nodes(nodes).on("tick", ticked);

    d3.selectAll(".node").remove();


    let node = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(
        d3
          .drag()
          .on("start", d => {
            if (!d3.event.active) simulation.alphaTarget(0.2).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", d => {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          })
          .on("end", d => {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    
    node
      .append("circle")
      .attr("id", d => d.id)
      .attr("r", 0)
      .style("fill", d => `rgb(${d.R},${d.G},${d.B})`)
      .transition()
      .duration(2000)
      .ease(d3.easeElasticOut)
      .tween("circleIn", d => {
        let i = d3.interpolateNumber(0, d.radius);
        return t => {
          d.r = i(t);
          simulation.force("collide", forceCollide);
        };
      });

    node
      .append("text")
      .selectAll("tspan")
      .data(d => d.name.split(" "))
      .enter()
      .append("tspan")
      .style("fill", "#fff")
      .style("font-size", countCat > 70 ? "0.8em" : countCat > 50 ? "1em" : "1.2em")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => 13 + (i - nodes.length / 2 - 0.5) * 12)
      .text(name => name);

    node
      .filter(d => String(d.icon).includes("img/"))
      .append("image")
      .classed("node-icon hidden", true)
      .attr("xlink:href", d => d.icon)
      .attr("x", d => -d.radius * 0.6)
      .attr("y", d => -d.radius * 0.1)
      .attr("height", d => d.radius * 2 * 0.6)
      .attr("width", d => d.radius * 2 * 0.6);

    node
      .append("title")
      .selectAll("circle-overlay_title")
      .data(d => d.name.split(" "))
      .style("fill", "#fff")
      .style("font-size", "1.9em")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => 13 + (i - nodes.length / 2 - 0.5) * 12)
      .text(d => d.name);

    node.on("click", currentNode => {
      d3.event.stopPropagation();
      let newColorR = currentNode.R - 50;
      let newColorG = currentNode.G - 50;
      let newColorB = currentNode.B - 50;
      console.log("currentNode", currentNode);
      let currentTarget = d3.event.currentTarget; // the <g> el
      if (currentNode === focusedNode) {
        // no focusedNode or same focused node is clicked
        return;
      }

      d3.select(currentTarget)
        .select("circle")
        .style("fill", `rgb(${newColorR},${newColorG},${newColorB})`);
      d3.selectAll(".node-icon").classed("hidden", true);

      let lastNode = focusedNode;
      console.log(lastNode);
      focusedNode = currentNode;
      simulation.alphaTarget(0.2).restart();
      // hide all circle-overlay
      console.log(currentTarget);
      // d3.select("tspan").classed("circle-overlay", true);
      // d3.selectAll(".node-icon").classed("node-icon--faded", false);

      if (lastNode) {
        lastNode.fx = null;
        lastNode.fy = null;
        node
          .filter((d, i) => i === lastNode.index)
          .transition()
          .duration(2000)
          .ease(d3.easePolyOut)
          .tween("circleOut", () => {
            let irl = d3.interpolateNumber(lastNode.r, lastNode.radius);
            return t => {
              lastNode.r = irl(t);
            };
          })
          .on("interrupt", () => {
            console.log("interrupt");
            lastNode.r = lastNode.radius;
          })
          .select("circle")
          .style(
            "fill",
            `rgb(${lastNode.R},${lastNode.G},${lastNode.B})`
          );
      }
      // if (!d3.event.active) simulation.alphaTarget(0.5).restart();
      d3.transition()
        .duration(2000)
        .ease(d3.easePolyOut)
        .tween("moveIn", () => {
          console.log("tweenMoveIn", currentNode);
          let ix = d3.interpolateNumber(currentNode.x, centerX);
          let iy = d3.interpolateNumber(currentNode.y, centerY);
          let ir = d3.interpolateNumber(currentNode.r, centerY * 0.2);
          return function(t) {
            // console.log('i', ix(t), iy(t));
            currentNode.fx = ix(t);
            currentNode.fy = iy(t);
            currentNode.r = ir(t);
            simulation.force("collide", forceCollide);
          };
        })
        .on("end", () => {
          simulation.alphaTarget(0);
          d3.select(currentTarget)
            .select(".node-icon")
            .classed("hidden", false);
        })
        .on("interrupt", () => {
          console.log("move interrupt", currentNode);
          currentNode.fx = null;
          currentNode.fy = null;
          simulation.alphaTarget(0);
          d3.select(currentTarget)
            .select("circle")
            .style(
              "fill",
              `rgb(${currentNode.R},${currentNode.G},${currentNode.B})`
            );
        });
    });
   
  

    // d3.select(".bubble").on("click", () => {
    //   let target = d3.event.target;
    //   // check if click on document but not on the circle overlay
    //   if (!target.closest("#circle-overlay") && focusedNode) {
    //     console.log(focusedNode);
    //     console.log("out");
    //     focusedNode.fx = null;
    //     focusedNode.fy = null;
    //     simulation.alphaTarget(0.2).restart();

    //     d3.select("circle").style(
    //       "fill",
    //       `rgb(${focusedNode.R},${focusedNode.G},${focusedNode.B})`
    //     );

    //     d3.transition()
    //       .duration(2000)
    //       .ease(d3.easePolyOut)
    //       .tween("moveOut", function() {
    //         console.log("tweenMoveOut", focusedNode);
    //         let ir = d3.interpolateNumber(focusedNode.r, focusedNode.radius);
    //         return function(t) {
    //           focusedNode.r = ir(t);
    //           simulation.force("collide", forceCollide);
    //         };
    //       })
    //       .on("end", () => {
    //         console.log("end");
    //         focusedNode = null;
    //         simulation.alphaTarget(0);
    //       })
    //       .on("interrupt", () => {
    //         console.log("interrupt");
    //         simulation.alphaTarget(0);
    //       });

    //     // hide all circle-overlay
    //     // d3.selectAll(".circle-overlay").classed("hidden", true);
    //     // d3.selectAll(".node-icon").classed("node-icon--faded", false);
    //   }
    //   console.log('out side')
    //   d3.select("circle").style(
    //     "fill",
    //     `rgb(${focusedNode.R},${focusedNode.G},${focusedNode.B})`
    //   );
    // });

    function ticked() {
      node
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .select("circle")
        .attr("r", d => d.r);
    }
  };

  render() {
    const categoryBtn = Object.keys(this.state.legend).map((cat, i) => {
      let rgbColor = this.state.legend[cat];
      return (
        <button
          className={`${
            this.state.currentCategory === cat
              ? "underline"
              : "underline hidden"
          } btn secondary`}
          key={i}
          id={cat}
          onClick={() => this.onClicked(cat)}
          style={{
            backgroundColor: `rgb(${rgbColor.R},${rgbColor.G},${rgbColor.B})`
          }}
        >
          {cat}
        </button>
      );
    });

    console.log(categoryBtn);

    return (
      <div>
        <div className="bubbleLegend">{categoryBtn}</div>
        <svg
          className="bubble"
          width={width}
          height={height}
          textAnchor="middle"
        ></svg>
      </div>
    );
  }
}

export default BubbleChart;
