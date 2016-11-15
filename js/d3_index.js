var socket = io("http://uos-mediahub.azurewebsites.net/", {forceNew: true});
var roomId;
var drawn = false;
var fullRoomId;
var availableScenes = [];
//RGB values for the city  colors
var nodeEnter;
var linkEnter;
var cityColors = [
    [255, 0, 0],
    [253, 95, 0],
    [255, 129, 0],
    [255, 231, 64],
    [13, 59, 108],
    [0, 77, 170],
    [0, 135, 253],
    [36, 203, 254],
    [143, 196, 31],
    [198, 235, 116]
];
//This function initializes the whole graph.
function d3graphv2(rootData, redraw) {
    if (redraw) {
        d3.selectAll('svg').remove();
    }
    var randomColor = (function () {
        var golden_ratio_conjugate = 0.618033988749895;
        var h = Math.random();

        var hslToRgb = function (h, s, l) {
            var r, g, b;

            if (s == 0) {
                r = g = b = l; // achromatic
            } else {
                function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                }

                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            return '#' + Math.round(r * 255).toString(16) + Math.round(g * 255).toString(16) + Math.round(b * 255).toString(16);
        };

        return function () {
            h += golden_ratio_conjugate;
            h %= 1;
            return hslToRgb(h, 0.8, 0.5);
        };
    })();

//--------------------Global Variables----------------//

    var timeout;
    var hoverTimeout;

    var height, width, svg, root, nodeCollection, edgeCollection, duration, zoom;

    //This is a variable containing an object that is used for testing the framerate of the graph
    var fps = {
        startTime: 0, frameNumber: 0, getFPS: function () {
            this.frameNumber++;
            var d = new Date().getTime(), currentTime = ( d - this.startTime ) / 1000, result = Math.floor(( this.frameNumber / currentTime ));
            if (currentTime > 1) {
                this.startTime = new Date().getTime();
                this.frameNumber = 0;
            }
            return result;
        }
    };

    //This is an extension to the d3 selection code giving it the ability to call the touch handler.
    // THe touch handler will be able to distinguish the touch event that is being triggered on the graph based on time between events happening
    d3.selection.prototype.touchHandler = function (callback) {
        var last = 0;
        return this.each(function (d) {
            var currentEL = this;
            d3.select(this)
                .on("touchstart", function (e) {
                    last = d3.event.timeStamp;
                })
                .on('touchend', function (e) {
                    if (d3.event.timeStamp - last > 500) {
                        return callback(currentEL, e, 'longtouch');
                    } else if ((d3.event.timeStamp - last) < 500) {
                        return callback(currentEL, e, 'tap');
                    }
                })
        });
    };
    //This is the structure of the root object containing the nodes and relationships of the graph needed to draw it out.
    root = {
        nodes: [],
        edges: []
    };
    //Default value of transitions 0.5 secs, giving it a nice smooth transition time baking it pleasant to the human eye
    duration = 5000;
    height = window.innerHeight;
    width = window.innerWidth;
    //Margins from the side of the screen that are used to position the city nodes in a way that prevent nodes getting outside of the screen space
    var margin = {top: height * 0.2, bot: height * 0.2, left: width * 0.1, right: width * 0.1};
    var innerH = height - margin.top - margin.bot;
    var innerW = width - margin.left - margin.right;
    //This is a variable containing any zoom and pan behaviour that might be needed for the graph.
    //Currently unused
    zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);

    //This variable contains a reference to the svg element that will be building the graph.
    svg = d3.select('#graph')
        .append('svg')
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMin")
        .append('g')
        .attr("fill", "#333");

    //This function is called if a zoom or pan occurs moving or scaling the svg based on the events initial coordinates
    function zoomed() {
        nodeContainer.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

//Append a defs (for definition) element to your SVG, in order to use them later as special backgrounds for specific elements
    var defs = svg.append("defs");

//Append a radialGradient element to the defs and give it a unique id
    // This is used for the root nodes.
    var radialGradient = defs.append("radialGradient")
        .attr("id", "radial-gradient")
        .attr("cx", "50%")    //The x-center of the gradient, same as a typical SVG circle
        .attr("cy", "50%")    //The y-center of the gradient
        .attr("r", "50%");   //The radius of the gradient, an offset of 100% ends where you've set this radius

    defs.append('pattern')
        .attr('id', 'diagonalHatch')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 4)
        .attr('height', 4)
        .append('path')
        .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
        .attr('stroke', '#000000')
        .attr('stroke-width', 1);

    radialGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#8f8f8f");
    radialGradient.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", "#bdbdbd");
    radialGradient.append("stop")
        .attr("offset", "90%")
        .attr("stop-color", "#ebebeb");
    radialGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#FFFFFF");


    var longClickTitle;
    var shortClickTitle;
    var longClickedLink;
    var longClicked;

    //This variable is a reference to the svg element that will contain all nodes
    //the transform here, has the purpose of making sure that the nodes are centered in the screen.
    //This is the case due to the svg starting position is the top left corner.
    var nodeContainer = svg.append('g')
        .attr("class", "node-container").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //This variable is a reference to the svg element that will contain all relationships/paths/edges
    var pathContainer = nodeContainer.append('g')
        .attr("class", "path-container");


//--------------------Layout--------------------------//
    //This function is used to process the data received by the server/graph editor and turn it into the graph structure for drawing
    function initialize(data) {
        function processNodes(data) {
            //for each node in the data received, add these properties in it and push it to the root structure.
            data.forEach(function (obj) {
                obj.x = obj.y = 0;
                obj.cx = innerW / 2;
                obj.cy = innerH / 2;
                obj.r = 2;
                obj.children = [];
                obj.parents = [];
                obj.related = [];
                obj.color = 'white';
                root.nodes.push(obj)
            })
        }

        function processsEdges() {
            //This function creates the relationships between the different nodes based on the data received.
            //For each node's parent relationship id's find th e parent object, and then push and object containing the source and target for that relationship.
            //
            root.nodes.forEach(function (node) {

                node.parentRelationshipIds.forEach(function (parent) {
                    var parentObj = _.find(root.nodes, function (obj) {
                        return obj._id == parent;
                    });
                    //if there is a parent push the edge/relationship
                    if (parentObj != undefined)
                        root.edges.push({source: parentObj, target: node})

                    // add the references to those object for later usage to the objects themselves.
                    parentObj.children.push(node);
                    node.parents.push(parentObj);

                })

            })
        }

        processNodes(data);
        processsEdges();

        //Uncomment to trigger the fps checker.
        //function gameLoop() {
        //    setTimeout(gameLoop, 1000 / 60);
        //    d3.select('h1').html(fps.getFPS());
        //}
        //
        //gameLoop();
    }

    initialize(rootData);

    if (!redraw) {
        //Draws the graph
        draw(root, false);
    } else {
        //Redraws the graph and removes the previous graph to avoid duplication.
        draw(root, true);
    }

    var cleanTitle = function (title) {
        return title.replace(/([a-z])([A-Z0-9])(?=[a-z])/g, '$1 $2').replace('GUIscene', 'scene').replace(/(scene|chicago|beijing)?\s(.*)?/i, '<sup>$1</sup><span class="$1">$2</span>');
    };
    //This is the hover over teaser functionality, it receives an array of nodes and with a set intervall will go through them unless it was changed.
    function hover(arraySelection) {
        var i = 0;
        clearInterval(hoverTimeout)
        hoverTimeout = setInterval(function () {
            if (i == arraySelection.length) {
                i = 0;
            }
            var d = arraySelection[i];
            longClickTitle.attr('y', function (data) {
                    return d.cy < innerH / 2 ? d.cy - d.r * 2 : d.cy + d.r * 2
                })
                .attr('x', function (data) {
                    return d.cx < innerW / 2 ? d.cx - d.r * 2 : d.cx + d.r * 2
                })
                .attr("dy", ".35em")
                .attr('text-anchor', 'middle')
                .style("opacity", "1")
                .text(function () {
                    return d.name
                });
            i++;
        }, 2500);
    }

    //This is a recursive function used to send the scenes to the scene viwer, it gatheres all scenes that are children of the initially selected node
    function nodes(list, sceneList) {

        for (var listIndex in list) {
            var thisItem = list[listIndex];

            if (thisItem.type !== 'scene') {
                nodes(thisItem.children, sceneList);
            } else {
                sceneList.push(thisItem._id);
            }
        }

        return sceneList;
    }

    //Removes duplicates from the list of nodes.
    function dedupeNodeList(list) {
        var dedupeList = [];

        for (var listIndex in list) {
            var item = list[listIndex];

            if (dedupeList.indexOf(item) === -1) {
                dedupeList.push(item);
            }
        }
        return dedupeList;
    }

    //This function represents one of the interaction events - double click/ long touch
    //This function at its current version is meant to highlight a set of nodes in order to make them more visible in relation to the element clicked
    function transitionGraphElements(focusedNode) {
        console.log(focusedNode)
        var ratio = 1 - Math.pow(1 / duration, 5);
        nodeEnter.transition().delay(function (d) {
                if (focusedNode.type == "subgraphtheme") {
                    return 3000;
                }
                if (focusedNode.type == "theme") {
                    return 1500;
                }
                if (focusedNode.type == "scene") {
                    return 1000;
                } else {
                    return 0;
                }
            })
            .duration(duration)
            .attr('cx', function (d) {
                if (d.name == focusedNode.name) {
                    return d.cx
                } else {
                    if (ratio >= 1) {
                        d.cx = d._x;
                    } else {
                        d.cx = ratio * (d._x - d.cx) + cx;

                    }
                    return d.cx;
                }

            })
            .attr('cy', function (d) {
                if (d.name == focusedNode.name) {
                    return d.cy
                } else {
                    if (ratio >= 1) {
                        d.cy = d._y;
                    } else {
                        d.cy = ratio * (d._y - d.cy) + cy;
                    }
                    return d.cy;
                }

            }).attr('r', function (d) {
            //console.log(d3.select(this).classed('longHL'))
            if (d.name == focusedNode.name) {
                return 10;
            } else {
                return d.r;
            }


        });

        linkEnter.transition().delay(function (d) {
                if (focusedNode.type == "subgraphtheme") {
                    return 3000;
                }
                if (focusedNode.type == "theme") {
                    return 1500;
                }
                if (focusedNode.type == "scene") {
                    return 1000;
                } else {
                    return 0;
                }
            })
            .duration(duration)
            .attr('d', function (d) {
                var diagonal = [
                    "M", d.source.cx, d.source.cy,
                    "A", innerH, innerH, 0, 0, 1, d.target.cx, d.target.cy
                ].join(" ");
                return diagonal;
            })
            .each(function (d) {
                var source, target;
                source = d.source._id;
                target = d.target._id;
                var test = this;
                d3.select(test).classed(source, true);
                d3.select(test).classed(target, true);
                d3.select(test).classed('opaque', false);
            })


    }

    function contextualize(el, d) {
        //console.log('long touch')
        //Resets the graph to its initial state before proceeding with the clustering and highlighting.

        var clean_name = cleanTitle(d.name);
        var scale = 1;
        var radius = 0;
        radius = innerH / 5;
        transitionGraphElements(d)
        //Triggers the position clustering
        cluster(el, radius, true);
        //Triggers the highlighting based on the clicked element.
        clusterHighlight(el, d);
        //Sets the name at the top of the screen to the clustered node.
        d3.select('h1').html(clean_name);
        var list = [];
        if (d.type === "root") {
            //FOR ROOT NODES ONLY SEARCH GTHEMES FOR STHEME + SCENES
            var children = _.filter(d.children, function (child) {
                return child.type === "subgraphtheme";
            });

            list = nodes(children, list);
        } else if (d.type !== "scene") {
            list = nodes(d.children, list);
        } else {
            list.push(d._id);
        }

        list = dedupeNodeList(list);
        //To finalize this method it sends the list of scenes to the graph viewer
        socket.emit('sendCommand', fullRoomId, 'showScenes', list);
    }

    //This is a utility function for getting a random int used for picking out the random twelve nodes for clustering
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //This function will take an item out of an array and remove it from the array so it cannot be picked twice
    function pluckArray(array) {
        //console.log('arr size ' + array.length)
        var index = getRandomInt(0, array.length);
        //console.log('Rand index ' + index)
        var obj = array[index];
        //console.log(obj)
        array = array.splice(index, 1);
        return obj;
    }

    /*
     This function takes in the element that triggered the contextualize method,
     a radius value that can be used to space out the circles from the focused node
     and a boolean value recurse, which is unused for this version of the function
     it's reason being: recursively cluster children nodes if requested.
     */
    function cluster(el, radius, recurse) {
        d3.select(el).attr('r', function (d) {
            // d.r * 1.5
            return 10;
        }).each(function (d) {
            //the related property contains both the children and the parents of the current element

            d.related = _.union(d.children, d.parents)
            var cx = d.cx;
            var cy = d.cy;
            var clusterArray = [];
            var filteredEdges = [];

            //Based on the rules identified as current behaviour requirements which is defined by these if else statements
            //This based on the type will filter in or out specific nodes based on type, and that will produce a filtered list of nodes for the relationship
            if (d.type == 'root') {
                //console.log('root')
                filteredEdges = _.filter(d.related, function (item) {
                    return item.type == 'subgraphtheme';
                })
            } else if (d.type == 'city') {
                //console.log('city')
                filteredEdges = _.filter(d.related, function (item) {
                    return item.type != 'root' && item.type != 'city';
                })
            } else {
                //console.log('Type: ' + d.type)
                filteredEdges = _.filter(d.related, function (item) {
                    return item.type != 'root' && item.type != 'city';
                })
            }

            //This part of the method builds up the random array of twelve nodes that will b e clustered
            while (clusterArray.length < 12) {
                var node = pluckArray(filteredEdges);
                if (node == undefined && filteredEdges.length == 0) {
                    break;
                } else if (node == undefined && filteredEdges.length > 0) {
                    //console.log('node not found')
                } else {
                    clusterArray.push(node)
                }
            }
            //console.log(testArr.length);
            //Triggering the hover teaser
            hover(clusterArray);
            //console.log(testArr)
            var total = clusterArray.length;
            //This part of the funcion defines the related  x and y positions for each node based on some geometrically calculated values

            clusterArray.forEach(function (child, index) {
                //The radian is the angle that each node will be position on based on the amount of nodes in the cluster array.
                var radian = (2 * Math.PI) * (index / total);
                var x = (Math.cos(radian) * radius) + cx;
                var y = (Math.sin(radian) * radius) + cy;
                moveNode(child, x, y);
            });
        })

    }

    //This function takes in the node and the x and y positions that it needs to be moved to.
    function moveNode(node, positionX, positionY) {
        var ratio = 1 - Math.pow(1 / duration, 5);
        //console.log(nodeCollection)
        var data = _.find(nodeCollection[0], function (obj) {
            return obj.__data__ == node;
        });

        d3.select(data).transition().style("fill", "black").transition()
            .duration(1000)
            .attr('r', function (d) {
                //d.r * 1.5
                return d.r;
            })
            .attr('cx', function (d) {
                var cx = d.cx;
                if (ratio >= 1) {
                    d.cx = positionX;
                    d.x = d.cx;
                    return d.cx;
                } else {
                    d.cx = ratio * (positionX - cx) + cx;
                    d.x = d.cx;
                    return d.cx;
                }
            })
            .attr('cy', function (d) {
                var cy = this.cy;
                if (ratio >= 1) {
                    d.cy = positionY;
                    d.y = d.cy;
                    return d.cy;
                } else {
                    d.cy = ratio * (positionY - cy) + cy;
                    d.y = d.cy;
                    return d.cy;
                }
            });

        //Find all relationships/edges/paths based on the current node be it source or target.
        var edges = edgeCollection.filter(function (item) {
            return item.source == node || item.target == node;
        });
        //Updating the position and arc of the line's
        edges.transition()
            .duration(duration)
            .attr('d', function (d) {
                //This functions builds up an arc based on some values.
                var diagonal = [
                    "M", d.source.cx, d.source.cy,
                    "A", innerH, innerH, 0, 0, 1, d.target.cx, d.target.cy
                ].join(" ");
                return diagonal;
            });
    }

    //This function applies a highlighting class to edges leading to related nodes based on the behaviour requirements
    //defined by the if else statements

    function clusterHighlight(el, d) {
        d3.select('.longHL').classed('longHL', false);
        d3.selectAll('.longLinkHL').classed('longLinkHL', false);
        var filteredEdges;
        if (d.type == 'root') {
            filteredEdges = _.filter(edgeCollection[0], function (item) {
                return item.__data__.source.type == 'subgraphtheme' || item.__data__.target.type == 'subgraphtheme';
            })
        } else if (d.type == 'city') {
            filteredEdges = _.filter(edgeCollection[0], function (item) {
                return item.__data__.source.type != 'root';
            })
        } else {
            filteredEdges = edgeCollection[0]
        }
        d3.select(el).classed('longHL', true);
        var edges = _.filter(filteredEdges, function (item) {
            return item.__data__.source == d || item.__data__.target == d;
        });
        d3.selectAll(edges).classed('longLinkHL', true);
    }


    //This function highlights elements based on a normal click or single tap of a node.

    function highlight(el, d) {

        d3.select('.highlight').classed('highlight', false);

        d3.selectAll('.highlightedLink').classed('highlightedLink', false);


        var filteredEdges;
        if (d.type == 'root') {
            filteredEdges = _.filter(edgeCollection[0], function (item) {
                return item.__data__.source.type == 'city' || item.__data__.target.type == 'city';
            })
        } else if (d.type == 'city') {
            filteredEdges = _.filter(edgeCollection[0], function (item) {
                return item.__data__.source.type != 'root';
            })
        } else {
            filteredEdges = edgeCollection[0]
        }

        d3.select(el).classed('highlight', true);
        var edges = _.filter(filteredEdges, function (item) {
            return item.__data__.source == d || item.__data__.target == d;
        });

        d3.selectAll(edges).classed('highlightedLink', true);
    }

    //This function is the single click / tap  behaviour
    // It is meant to: highlight the current node, and its relationships
    // and show the name of the clicked element.
    // the highlighting will fade away in half a second after selection
    function tap(el, d) {
        //console.log('tap')
        longClicked = d3.select('.longHL');
        longClickedLink = d3.selectAll('.longLinkHL');

        longClicked.classed('longHL', false);
        longClickedLink.classed('longLinkHL', false);

        shortClickTitle
            .attr('y', function (data) {
                return d.cy < innerH / 2 ? d.cy - d.r * 2 : d.cy + d.r * 2
            })
            .attr('x', function (data) {
                return d.cx < innerW / 2 ? d.cx - d.r * 2 : d.cx + d.r * 2
            })
            .attr("dy", ".35em")
            .attr('text-anchor', 'middle')
            .style("opacity", "1")
            .text(function () {
                return d.name
            });

        clearTimeout(timeout);
        //This timeout will temporarily, remove any long click highlights  and then re-add them after a delay
        timeout = setTimeout(function () {
            d3.select(el).classed('highlight', false);
            d3.selectAll('.highlightedLink').classed('highlightedLink', false);
            d3.select('h2').style("opacity", "0");
            longClicked.classed('longHL', true);
            longClickedLink.classed('longLinkHL', true);
            shortClickTitle.style("opacity", "0");
        }, 5000);

        highlight(el, d)


    }

//--------------------Drawing--------------------------//
    /*
     * This function contains all the drawing variables and functions that are purely drawing related.
     * Encompassing drawing rules for specific nodes, drawing initialization , collections for the different elements
     * graph resetting and the autocomplete scene node search
     * This part of the script is based stronly on d3 logic which you can lookup the documentation on their website
     * */
    function draw(processedData, redraw) {

        nodeCollection = nodeContainer.selectAll('circle').data(processedData.nodes);
        edgeCollection = pathContainer.selectAll('path').data(processedData.edges);


        nodeEnter = nodeCollection.enter().append('circle')
            .attr('cy', function (d) {
                return d.cy
            })
            .attr('cx', function (d) {
                return d.cx
            })
            .attr('r', function (d) {
                return d.r
            })
            .attr('id', function (d) {
                return d._id
            })
            .attr('class', function (d) {
                if (d._id == undefined) {
                    //console.log(d)
                    return 'error'
                } else {
                    return d.name;
                }
            })
            .call(circle)
            .touchHandler(function (el, d, type) {
                if (type == 'tap') {
                    return tap(el, d);
                } else if (type == 'longtouch') {
                    return contextualize(el, d);
                }
            }).on('click', function (d) {
                return tap(this, d);
            }).on('dblclick', function (d) {
                return contextualize(this, d);
            });

        longClickTitle = nodeContainer.append('text').attr('fill', 'white');
        shortClickTitle = nodeContainer.append('text').attr('fill', 'white');

        linkEnter = edgeCollection.enter().append('path')
            .attr('d', function (d) {
                var diagonal = [
                    "M", d.source.cx, d.source.cy,
                    "A", innerH, innerH, 0, 0, 1, d.target.cx, d.target.cy
                ].join(" ");
                return diagonal;
            })
            .attr('class', function (d) {
                return 'opaque';
            });


        function circle(nodeArr) {
            nodeArr
                .attr('x', function (d) {
                    //d.x = width / 2 + (Math.random() * width / 2) * ((Math.random() > 0.5) ? -1 : 1);
                    d.x = Math.random() * width
                    return d.x
                })
                .attr('y', function (d) {
                    //d.y = height / 2 + (height / 2 * Math.random() * ((Math.random() > 0.5) ? -1 : 1));
                    d.y = Math.random() * height
                    return d.y
                })
                .attr('r', function (d) {
                    d.r = 2;
                    return d.r
                })
                .attr('fill', 'white');
        }

        var rootNodes = nodeEnter.filter(function (d) {
            return d.type == 'root'
        });

        rootNodes.attr('x', function (d, i) {
                d.x = ((innerW / rootNodes[0].length) / 2) * i + innerW / rootNodes[0].length;
                d._x = d.x;
                return d.x
            })
            .attr('y', function (d) {
                d.y = innerH - innerH / 2;
                d._y = d.y;
                return d.y;
            })
            .attr('r', function (d) {
                d.r = 18;
                return d.r;
            }).style('fill', 'url(#radial-gradient)');

        var cityNodes = nodeEnter.filter(function (d) {
            return d.type == "city";
        });

        var angle = (2 * Math.PI) / cityNodes[0].length;
        cityNodes
            .attr('r', function (d) {
                d.r = 16;
                return d.r;
            })
            .attr('y', function (d, i) {
                d.y = (Math.sin(angle * i) * innerH / 2) + d.cy;
                if (d.y == 0) {
                    d.y = d.y + d.r * 2;
                }
                if (d.y == innerH) {
                    d.y = d.y - d.r * 2;
                }
                d._y = d.y;
                return d.y;
            })
            .attr('x', function (d, i) {
                d.x = (Math.cos(angle * i) * innerW / 2) + d.cx;
                if (d.x == 0) {
                    d.x = d.x + d.r * 2;
                }
                if (d.x == innerW) {
                    d.x = d.x - d.r * 2;
                }
                d._x = d.x;
                return d.x;
            }).style('fill', function (d, i) {
            d.color = cityColors[i];
            return d3.rgb(d.color[0], d.color[1], d.color[2]);
        });

        var nonStaticNodes = nodeEnter.filter(function (d) {
            return d.type != "city" && d.type != "root";
        });

        nonStaticNodes.attr('x', function (d) {
            d.x = d.x - margin.left;
            d._x = d.x;
            return d.x
        }).attr('y', function (d) {
            d.y = d.y - margin.top;
            //d.y = innerH - innerH / 2;
            d._y = d.y;

            return d.y;
        });


        //This function will check the distance between both nodes
        function distance(a, b) {

            var dx = a.x - b.x,
                dy = a.y - b.y;

            var math = Math.sqrt(dx * dx + dy * dy) - (a.r + b.r)
            var angleDegA = Math.atan2(a.y - b.y, a.x - b.x);
            var angleDegB = Math.atan2(b.y - a.y, b.x - a.x);
            //console.log(Math.floor(math),dx,dy);
            if (math < 0) {
                if (a.type == 'city' || a.type == 'root') {
                    console.log("A:type", a.type)
                    var x = (Math.cos(angleDegB) * a.r + 2) + b.cx;
                    var y = (Math.sin(angleDegB) * a.r + 2) + b.cy;
                    //An alternative function to move node will be added this is a placeholder
                    moveNode(b, x, y);
                } else if (b.type == 'city' || b.type == 'root') {
                    console.log("B:type", b.type)
                    var x = (Math.cos(angleDegA) * b.r + 2) + a.cx;
                    var y = (Math.sin(angleDegA) * b.r + 2) + a.cy;
                    moveNode(a, x, y);
                }else{
                    var bx = (Math.cos(angleDegB) * b.r + 2)/2 + b.cx;
                    var by = (Math.sin(angleDegB) * b.r + 2)/2 + b.cy;
                    var ax = (Math.cos(angleDegA) * a.r + 2)/2 + a.cx;
                    var ay = (Math.sin(angleDegA) * a.r + 2)/2 + a.cy;
                    moveNode(a, ax, ay);
                    moveNode(b, bx, by);
                    console.log("A:type", a.type, a.name, "B:type", b.name, b.type, angleDegA, angleDegB, "distance", math)
                }
            }

            return math;
        }



        //Merge sort function
        function mergeSort(array) {
            if (array.length < 2) {
                return array
            }

            var mid = Math.floor(array.length / 2);
            var subLeft = mergeSort(array.slice(0, mid));
            var subRight = mergeSort(array.slice(mid));
            var res = merge(subLeft, subRight)

            return res;
        }
        //Merge for merge sort
        function merge(a, b) {
            var result = [];
            while (a.length > 0 && b.length > 0) {
                var dist = distance(a[0].__data__, b[0].__data__);
                result.push(a[0].__data__.x < b[0].__data__.x ? a.shift() : b.shift());
            }
            return result.concat(a.length ? a : b);
        }


        var gThemeNodes = nodeEnter.filter(function (d) {
            return d.type == "subgraphtheme";
        });
        gThemeNodes.style('fill', d3.rgb(111, 115, 125)).attr('r', function (d) {
            d.r = getRandomInt(4, 6);
            return d.r;
        });


        var sThemeNodes = nodeEnter.filter(function (d) {
            return d.type == "theme";
        });

        sThemeNodes.style('fill', function (d) {
                var cityParent = _.find(d.parents, function (item) {
                    return item.type == 'city';
                });
                if (cityParent != undefined) {
                    return d3.rgb(cityParent.color[0], cityParent.color[1], cityParent.color[2]);
                } else {
                    return d3.rgb('white');
                }
            })
            .attr('r', function (d) {
                d.r = getRandomInt(4, 6);
                return d.r;
            });


        var sceneNodes = nodeEnter.filter(function (d) {
            return d.type == 'scene'
        });
        sceneNodes.style('fill', 'yellow').attr('r', function (d) {
            d.r = getRandomInt(4, 6);
            return d.r;
        }).each(function (d) {
            availableScenes.push(d.name);
        });


        d3.select('#openViewer').on('click', function () {
            window.open('http://uos-sceneeditor.azurewebsites.net/manifest2015.html?room=' + roomId);
        });

        d3.select('#reset-new2').on('click', function (e) {
            resetGraphToOrigin();
        }); d3.select('#clearOverlap').on('click', function (e) {
            clearOverlap();
        });
        d3.select('#reset-origin').on('click', function () {
            resetGraphToOrigin();
        });

        //This function resets the graph to its default state
        function resetGraph() {
            d3.select('h1').html = '';
            zoom.scale(1);
            zoom.translate([margin.left, margin.top]);
            nodeContainer.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");
            transitionGraphElements();
        }

        function resetGraphToOrigin() {
            d3.select('h1').html = '';
            zoom.scale(1);
            zoom.translate([margin.left, margin.top]);
            nodeContainer.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");
            transitionGraphElementsToOrigin();
        }
        function clearOverlap(){
            mergeSort(nodeEnter[0])
        }
        //This function transitions the elements to their initial positions


        function transitionGraphElementsToOrigin() {

            var ratio = 1 - Math.pow(1 / duration, 5);
            nodeEnter.transition()
                .duration(duration)
                .attr('cx', function (d) {
                    if (ratio >= 1) {
                        d.cx = d._x;
                    } else {
                        d.cx = ratio * (d._x - d.cx) + cx;
                    }
                    return d.cx;
                })
                .attr('cy', function (d) {
                    if (ratio >= 1) {

                        d.cy = d._y;
                    } else {
                        d.cy = ratio * (d._y - d.cy) + cy;
                    }
                    return d.cy;
                })
                .attr('r', function (d) {
                    return d.r
                });

            linkEnter.transition()
                .duration(duration)
                .attr('d', function (d) {
                    var diagonal = [
                        "M", d.source.cx, d.source.cy,
                        "A", innerH, innerH, 0, 0, 1, d.target.cx, d.target.cy
                    ].join(" ");
                    return diagonal;
                })
                .each(function (d) {
                    var source, target;
                    source = d.source._id;
                    target = d.target._id;
                    var test = this;
                    d3.select(test).classed(source, true);
                    d3.select(test).classed(target, true);
                    d3.select(test).classed('opaque', false);
                });
           // var test = mergeSort(nodeEnter[0]);

        }

        nodeEnter.order();
        //console.log(availableScenes)
        //This function initializes the autocomplete input with autocompletion
        $("#tags").autocomplete({
            source: [availableScenes],
            limit: 5
        });

        //On the key 'Enter' send a double click event for the selected scene node.
        $("#tags").keyup(function (key) {
            if (key.which === 13) {
                var element = _.find(nodeEnter[0], function (obj) {

                    return obj.__data__.name == $("#tags").val();
                });
                //console.log(element)
                element.dispatchEvent(new Event('dblclick'));
            }
        });
        transitionGraphElementsToOrigin()

    }

//
}

//This is the initialization function that loads in the data from the server
//it can take a url parameter for a specific scene group or it will load the default mega graph.
function loadData() {
    //console.log('load data')

    var sceneId = '579a2186792e8b3c827d2b15';
    //This functions gets any urls parameters that are passed in
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }


    //This socket connects and authenticates the graph receiving the room id needed for the viewer that is connected to the graph
    socket.on('connect', function (thing) {
        socket.emit('auth', {password: 'kittens'}, function (err, token, serverRoomId) {
            if (err) {
                //console.log(err)
            } else {
                //console.log(token)
                fullRoomId = serverRoomId;
                roomId = serverRoomId.substr(2);
            }
            sceneId = getQueryVariable("id") || sceneId;
            socket.emit('loadSceneGraph', sceneId, function (err, sceneGraph) {
                if (err || !sceneGraph) {
                    //console.log(err)
                    //console.log('Couldn\'t load requested scene graph, reload the page and try again');
                } else {
                    //console.log(sceneGraph);
                    if (drawn) {
                        d3graphv2(sceneGraph.nodeList, true);
                    } else {
                        d3graphv2(sceneGraph.nodeList, false);
                        drawn = true
                    }
                }
                function search_keyUp(e) {

                    // this would test for whichever key is 40 and the ctrl key at the same time
                    console.log('search')
                    if (e.altKey && e.keyCode == 83) {
                        // call your function to do the thing
                        var search = $('.xdsoft_autocomplete');
                        if (search.is(":visible")) {
                            search.hide()
                            $('#tags').hide()
                        } else {
                            search.show()
                            $('#tags').show()
                        }
                    }
                }

// register the handler
                document.addEventListener('keyup', search_keyUp, false);
                function viewer_keyUp(e) {
                    console.log('viewer')
                    // this would test for whichever key is 40 and the ctrl key at the same time
                    if (e.altKey && e.keyCode == 86) {
                        // call your function to do the thing
                        window.open('http://uos-sceneeditor.azurewebsites.net/manifest2015.html?room=' + roomId);
                    }
                }

// register the handler
                document.addEventListener('keyup', viewer_keyUp, false);
            });
        });
    });
}
loadData();

