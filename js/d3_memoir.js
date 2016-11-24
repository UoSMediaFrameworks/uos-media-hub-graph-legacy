/**
 * Created by Angel.P on 24/11/2016.
 */
var socket = io("http://uos-mediahub.azurewebsites.net/", {forceNew: true});
var rootData = [{
    _id: "memoir",
    name: "Memoir",
    parentRelationshipIds: [],
    type: "root"
}, {
    _id: "chapter1",
    name: "Chapter 1",
    parentRelationshipIds: [
        "memoir"
    ],
    type: "chapter"
}, {
    _id: "chapter2",

    name: "Chapter 2",
    parentRelationshipIds: [
        "memoir"
    ],
    type: "chapter"
}, {
    _id: "chapter3",
    name: "Chapter 3",
    parentRelationshipIds: [
        "memoir"
    ],
    type: "chapter"
}, {
    _id: "chapter4",
    name: "Chapter 4",
    parentRelationshipIds: [
        "memoir"
    ],
    type: "chapter"
}, {
    _id: "chapter5",
    name: "Chapter 5",
    parentRelationshipIds: [
        "memoir"
    ],
    type: "chapter"
}, {
    _id: "chapter6",
    name: "Chapter 6",
    parentRelationshipIds: [
        "memoir"
    ],
    type: "chapter"
},
    {
        _id: "chapter7",
        name: "Chapter 7",
        parentRelationshipIds: [
            "memoir"
        ],
        type: "chapter"
    },
    {
        _id: "chapter8",
        name: "Chapter 8",
        parentRelationshipIds: [
            "memoir"
        ],
        type: "chapter"
    },
    {
        _id: "chapter9",
        name: "Chapter 9",
        parentRelationshipIds: [
            "memoir"
        ],
        type: "chapter"
    },
    {
        _id: "chapter10",
        name: "Chapter 10",
        parentRelationshipIds: [
            "memoir"
        ],
        type: "chapter"
    },
    {
        _id: "chapter11",
        name: "Chapter 11",
        parentRelationshipIds: [
            "memoir"
        ],
        type: "chapter"
    },
    {
        _id: "chapter12",
        name: "Chapter 12",
        parentRelationshipIds: [
            "memoir"
        ],
        type: "chapter"
    }
];
function graphLayout(rootData) {
    //remove all existing svg
    d3.selectAll('svg').remove();

    //Variables
    var shortClickTitle;
    var nodeEnter;
    var linkEnter;
    var height,
        width,
        svg,
        root,
        nodeCollection,
        linkCollection,
        duration, innerH, innerW, margin, zoom;


    //This is the structure of the root object containing the nodes and relationships of the graph needed to draw it out.
    root = {
        nodes: [],
        links: []
    };

    //Default value of transitions 0.5 secs, giving it a nice smooth transition time baking it pleasant to the human eye
    duration = 5000;
    height = window.innerHeight;
    width = window.innerWidth;

    //Margins from the side of the screen that are used to position the city nodes in a way that prevent nodes getting outside of the screen space
    margin = {top: height * 0.2, bot: height * 0.2, left: width * 0.1, right: width * 0.1};
    innerH = height - margin.top - margin.bot;
    innerW = width - margin.left - margin.right;

    console.log(innerH, innerW);
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

    //Touch handler, this will extend the d3 selection code
    // to be able to call this function
    //The touch handler will be able to distiguish between interaction events like
    //Touch,long touch, click and double click
    d3.selection.prototype.touchHandler = function (callback) {
        var last = 0;
        return this.each(function (d) {
            var element = this;
            d3.select(this)
                .on("touchstart", function (e) {
                    last = d3.event.timeStamp;
                })
                .on('touchend', function (e) {
                    if (d3.event.timeStamp - last > 500) {
                        return callback(elemement, e, 'longtouch');
                    } else if ((d3.event.timeStamp - last) < 500) {
                        return callback(elemement, e, 'tap');
                    }
                })
        });
    };
    //This variable is a reference to the svg element that will contain all nodes
    //the transform here, has the purpose of making sure that the nodes are centered in the screen.
    //This is the case due to the svg starting position is the top left corner.
    var nodeContainer = svg.append('g')
        .attr("class", "node-container").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //This variable is a reference to the svg element that will contain all relationships/paths/edges
    var linkContainer = nodeContainer.append('g')
        .attr("class", "link-container");

    //--------------------Layout--------------------------//
    //This function is used to process the data received by the server/graph editor and turn it into the graph structure for drawing
    function initialize(data) {
        function processNodes(data) {
            //for each node in the data received, add these properties in it and push it to the root structure.
            data.forEach(function (obj) {
                console.log("Kwo", obj);
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

        function processsLinks() {
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
                        root.links.push({source: parentObj, target: node});

                    // add the references to those object for later usage to the objects themselves.
                    parentObj.children.push(node);
                    node.parents.push(parentObj);

                })

            })
        }

        processNodes(data);
        processsLinks();
    }

    //Starting the initialization process after defining it
    initialize(rootData);
    draw(root)

    //This function highlights elements based on a normal click or single tap of a node.

    function highlight(el, d) {

        d3.select('.highlight').classed('highlight', false);
        d3.select(el).classed('highlight', true);

    }

    //This function is the single click / tap  behaviour
    // It is meant to: highlight the current node, and its relationships
    // and show the name of the clicked element.
    // the highlighting will fade away in half a second after selection
    function tap(el, d) {

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

        highlight(el, d)


    }

//--------------------Drawing--------------------------//
    /*
     * This function contains all the drawing variables and functions that are purely drawing related.
     * Encompassing drawing rules for specific nodes, drawing initialization , collections for the different elements
     * graph resetting and the autocomplete scene node search
     * This part of the script is based stronly on d3 logic which you can lookup the documentation on their website
     * */
    function draw(processedData) {

        nodeCollection = nodeContainer.selectAll('circle').data(processedData.nodes);
        //linkCollection = linkContainer.selectAll('path').data(processedData.links);
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
                    return 'error'
                } else {
                    return d.name;
                }
            })
            .call(circle)
            .touchHandler(function (el, d, type) {
                if (type == 'tap') {
                    return tap(el, d);
                }
            }).on('click', function (d) {
                return tap(this, d);
            });

        shortClickTitle = nodeContainer.append('text').attr('fill', 'white');

        function circle(nodeArr) {
            nodeArr
                .attr('x', function (d) {
                    //d.x = width / 2 + (Math.random() * width / 2) * ((Math.random() > 0.5) ? -1 : 1);
                    d.x = Math.random() * width;
                    return d.x
                })
                .attr('y', function (d) {
                    //d.y = height / 2 + (height / 2 * Math.random() * ((Math.random() > 0.5) ? -1 : 1));
                    d.y = Math.random() * height;
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
                d.x = innerW / 2;
                d._x = d.x;
                return d.x
            })
            .attr('y', function (d) {
                d.y = innerH / 2;
                d._y = d.y;
                return d.y;
            })
            .attr('r', function (d) {
                d.r = 18;
                return d.r;
            });

        var chapterNodes = nodeEnter.filter(function (d) {
            return d.type == "chapter";
        });

        chapterNodes
            .attr('r', function (d) {
                d.r = 16;
                return d.r;
            })
            .attr("x", function (d, i) {
                var radian = (2 * Math.PI) * i / chapterNodes[0].length;
                d.x = (Math.cos(radian) * innerH / 2) + innerW / 2;
                d._x = d.x;
                return d.x;
            })
            .attr("y", function (d, i) {
                var radian = (2 * Math.PI) * i / chapterNodes[0].length;
                d.y = (Math.sin(radian) * innerH / 2) + innerH / 2;
                d._y = d.y;
                return d.y;
            });

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

            //linkEnter.transition()
            //    .duration(duration)
            //    .attr('d', function (d) {
            //        var diagonal = [
            //            "M", d.source.cx, d.source.cy,
            //            "A", innerH, innerH, 0, 0, 1, d.target.cx, d.target.cy
            //        ].join(" ");
            //        return diagonal;
            //    })
            //    .each(function (d) {
            //        var source, target;
            //        source = d.source._id;
            //        target = d.target._id;
            //        var link = this;
            //        d3.select(link).classed(source, true);
            //        d3.select(link).classed(target, true);
            //        d3.select(link).classed('opaque', false);
            //    });
        }

        nodeEnter.order();
        //This function initializes the autocomplete input with autocompletion
        transitionGraphElementsToOrigin()

    }

//


}

//Function to get the default data for the graph upon load
function loadData() {
    //Default graph id to be loaded
    var sceneId = "";
    socket.on("connect", function () {
        socket.emit('auth', {password: 'kittens'}, function (err, token, roomID) {
            if (err) {
                console.log(err)
            } else {
                fullRoomId = roomID;
                roomId = roomID.substr(2);
            }
            // this will be where the scene id will
            // load up to query to hub for a graph but
            // that will be replaced with a hardcoded one
            // sceneId = getQueryVariable("id") || sceneId;

            //We initialize the graph layout processing and drawing here.
            graphLayout(rootData);

            //This function will open up the media frameworks viewer
            function viewer_keyUp(e) {
                console.log('viewer')
                // this would test for whichever key is 40 and the ctrl key at the same time
                if (e.altKey && e.keyCode == 86) {
                    // call your function to do the thing
                    window.open('http://uos-sceneeditor.azurewebsites.net/manifest2015.html?room=' + roomId);
                }
            }

            document.addEventListener('keyup', viewer_keyUp, false);
        })
    })

}
loadData();