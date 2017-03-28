/**
 * Created by Angel.P on 28/11/2016.
 */

if (location.hostname === "dev-uos-mediahubgraph.azurewebsites.net") {
    var socket = io("http://dev-uos-mediahub.azurewebsites.net/", {forceNew: true});
} else {
    var socket = io("http://uos-mediahub.azurewebsites.net/", {forceNew: true});
}
var sceneId;
// window.addEventListener("contextmenu", function (e) {
//     e.preventDefault();
// });
var nodeListNARM = [
    {
        "_id" : "root",
        "name" : "root",
        "type" : "root",
        "parentRelationshipIds" : [],
        "childrenRelationshipIds" : []
    },
    {
        "_id" : "586f95a7b8678acc10b15980",
        "name" : "dalian-apep",
        "type" : "scene",
        "parentRelationshipIds" : [
            "Programming",
            "CG Cameras"
        ],
        "childrenRelationshipIds" : []
    },
    {
        "_id" : "Programming",
        "name" : "Programming",
        "type" : "theme",
        "parentRelationshipIds" : [
            "root"
        ],
        "childrenRelationshipIds" : []
    },
    {
        "_id" : "CG Cameras",
        "name" : "CG Cameras",
        "type" : "theme",
        "parentRelationshipIds" : [
            "root"
        ],
        "childrenRelationshipIds" : []
    },
    {
        "_id" : "57fd49f532cc1ca00b58180a",
        "name" : "chicago-test",
        "type" : "scene",
        "parentRelationshipIds" : [
            "theme",
            "theme2",
            "theme3"
        ],
        "childrenRelationshipIds" : []
    },
    {
        "_id" : "theme",
        "name" : "theme",
        "type" : "theme",
        "parentRelationshipIds" : [
            "root"
        ],
        "childrenRelationshipIds" : []
    },
    {
        "_id" : "theme2",
        "name" : "theme2",
        "type" : "theme",
        "parentRelationshipIds" : [
            "root"
        ],
        "childrenRelationshipIds" : []
    },
    {
        "_id" : "theme3",
        "name" : "theme3",
        "type" : "theme",
        "parentRelationshipIds" : [
            "root"
        ],
        "childrenRelationshipIds" : []
    },
    {
        "_id" : "587eb363809e4614a9930b78",
        "name" : "apep-2",
        "type" : "scene",
        "parentRelationshipIds" : [
            "oneaudio"
        ],
        "childrenRelationshipIds" : []
    },
    {
        "_id" : "oneaudio",
        "name" : "oneaudio",
        "type" : "theme",
        "parentRelationshipIds" : [
            "root"
        ],
        "childrenRelationshipIds" : []
    },
    {
        "_id" : "57963aeaea09c8f426aaa924",
        "name" : "dalian-wave",
        "type" : "scene",
        "parentRelationshipIds" : [
            "natural environment",
            "extensive"
        ],
        "childrenRelationshipIds" : []
    },
    {
        "_id" : "natural environment",
        "name" : "natural environment",
        "type" : "theme",
        "parentRelationshipIds" : [
            "root"
        ],
        "childrenRelationshipIds" : []
    },
    {
        "_id" : "extensive",
        "name" : "extensive",
        "type" : "theme",
        "parentRelationshipIds" : [
            "root"
        ],
        "childrenRelationshipIds" : []
    }
];
function initializeGraph(rootData, type,exploration) {
    //console.log(type)
//--------------------Global Variables----------------//

    var height, width, svg, root, duration, zoom;
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
    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        });
    };
    //This is the structure of the root object containing the nodes and relationships of the graph needed to draw it out.
    root = {
        nodes: [],
        links: []
    };
    //Default value of transitions 5 secs, giving it a nice smooth transition time baking it pleasant to the human eye
    duration = 5000;
    height = window.innerHeight;
    width = window.innerWidth;
    //Margins from the side of the screen that are used to position the city nodes in a way that prevent nodes getting outside of the screen space
    var margin = {top: height * 0.2, bot: height * 0.2, left: width * 0.1, right: width * 0.1};
    var innerH = height - margin.top - margin.bot;
    var innerW = width - margin.left - margin.right;

    var circularRef = [];
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
        .attr("id","background-container")
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


    //This variable is a reference to the svg element that will contain all nodes
    //the transform here, has the purpose of making sure that the nodes are centered in the screen.
    //This is the case due to the svg starting position is the top left corner.
    var nodeContainer = svg.append('g')
        .attr("class", "node-container").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //This variable is a reference to the svg element that will contain all relationships/paths/edges
    var linkContainer = nodeContainer.append('g')
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
                obj.height = innerH * 0.05;
                obj.weight =  innerW * 0.05;
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
                    if (node != parentObj) {
                        if (parentObj != undefined) {
                            root.links.push({source: parentObj, target: node});
                        }
                        // add the references to those object for later usage to the objects themselves.
                        parentObj.children.push(node);
                        node.parents.push(parentObj);
                    }


                })

            })
        }

        processNodes(data);
        processsEdges();
        removeBadRelationships();


        /*
         Angel Petrov: This hack will check for direct circular refs for each node, and based on how the processNodes function
         build the relationships in the node objects, they are removed preventing the circular refference from being an issue for
         the individual graph's recursive function for gathering scenes.

         Currently the visual link of the recursive relationship is visible and I have put in the code to clear that off in
         the function.
         */

        function removeBadRelationships() {
            _.each(root.nodes, function (node) {
                _.each(node.children, function (child) {
                    var gat = _.include(child.children, node)
                    if (gat) {
                        circularRef.push({
                            duplicate: node,
                            node: child
                        })
                    }
                })
            });
            //console.log(circularRef)
            _.each(circularRef, function (o) {
                var _children = _.reject(o.node.children, function (child) {
                    return child._id == o.duplicate._id;
                });
                var _parents = _.reject(o.duplicate.parents, function (parent) {
                    return parent._id == o.node._id;
                });
                if (!(o.node.type == "root")) {
                    root.links = _.reject(root.links, function (link) {
                        return (link.source == o.node && link.target == o.duplicate);
                    });
                }


                o.duplicate.parents = _parents;
                o.node.children = _children;


            });
        }
    }


    initialize(rootData);

//Properties object contain references to all object data that is needed by the graph types
    var properties = {
        nodeContainer: nodeContainer,
        linkContainer: linkContainer,
        innerW: innerW,
        innerH: innerH,
        duration: duration,
        width: width,
        height: height,
        margin: margin,
        zoom: zoom,
        sceneId: sceneId,
        roomId:fullRoomId,
        defs:defs,
        svgContainer:svg
    };

    /*
     07/12/2016 Angel Petrov: Based on the type, of graph it will use an object containing
     the drawing instruction for each individual type and its methods.
     can be expanded further.
     */
    switch(type){
        case "MEMOIR_SCENE_GRAPH":
            var graphMemoir = new MemoirGraph(properties);
            graphMemoir.draw(root);
            break;

        case "GDC_SCENE_GRAPH":
            if (exploration == "true") {
                var graphGDC = new GlobalDigitalCityGraphExploration(properties);
            } else {
                var graphGDC = new GlobalDigitalCityGraph(properties);
            }
            graphGDC.draw(root);
            break;
        case "NARM_SCENE_GRAPH":
            var graphNARM = new NARMGraph(properties);
            graphNARM.draw(root);
            break;
    }
}

//This function will initialize the graphLoader
function loadData() {
    //Default graph id to be loaded
    sceneId = "579a2186792e8b3c827d2b15"; //GDC graph
//5834ac6e2ccf84d814e6e1e5 - memoir graph

    //This function will return the value of a url query for the graph
    //based on the variable name passed
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
    };

    //This function will connect to the MediaHub and authenticate via a password/ currently hardcoded
    //Upon successful authentication it will provide a roomId which will be used for opening a sceneViewer communication line

    socket.on("connect", function () {
            socket.emit('auth', {password: 'kittens'}, function (err, token, roomID) {
                if (err) {
                    console.log(err)
                } else {
                    //APEP: global javascript id stored for other graph scripts
                    // We allow an optional query variable to provide the roomId that will be used for:
                    // 1. Emitting websocket commands
                    // 2. Opening viewer url connected to same namespace
                    fullRoomId = getQueryVariable("roomId") || roomID;
                    roomId = socket.id;
                }
                // this will be where the scene id will
                // load up to query to hub for a graph but
                // that will be replaced with a hardcoded one
                sceneId = getQueryVariable("id") || sceneId;
                var exploration = getQueryVariable("isExploration") || false;
                socket.emit('loadSceneGraph', sceneId, function (err, sceneGraph) {
                    if (err || !sceneGraph) {
                        console.log(err, sceneGraph)
                    } else {
                        // console.log(sceneGraph)
                        //We initialize the scene settup and root buildup, combined with passing a type
                        //for the drawing instruction
                        initializeGraph(sceneGraph.nodeList, sceneGraph.type, exploration);
                    }
                });

                //We use the jqeury QR library to build up a link to the scene viewer for users to be able to scan
                if (location.hostname === "dev-uos-mediahubgraph.azurewebsites.net") {
                    var qrcode = new QRCode("qrcode", {
                        text: 'http://dev-uos-sceneeditor.azurewebsites.net/graph-viewer.html#/?room=' + fullRoomId,
                        width: 128,
                        height: 128,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                } else {
                    var qrcode = new QRCode("qrcode", {
                        text: 'http://uos-sceneeditor.azurewebsites.net/graph-viewer.html#/?room=' + fullRoomId,
                        width: 128,
                        height: 128,
                        colorDark: "black",
                        colorLight: "white",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                }

                d3.select('#node-searcher').on('click', function () {
                    var search = $('.xdsoft_autocomplete');
                    if (search.is(":visible")) {
                        search.hide()
                        $('#tags').hide()
                    } else {
                        search.show()
                        $('#tags').show()
                    }
                });
                d3.select('#scene-viewer').on('click', function () {
                    var href;
                    if (location.hostname === "dev-uos-mediahubgraph.azurewebsites.net") {
                        href = 'http://dev-uos-sceneeditor.azurewebsites.net/graph-viewer.html#/?room=' + fullRoomId;
                    } else {
                        href = 'http://uos-sceneeditor.azurewebsites.net/graph-viewer.html#/?room=' + fullRoomId;
                    }
                    window.open(href, "_blank");
                });
                d3.select('#qr').on('click', function () {
                    var qr = $('#qrcode');
                    if (qr.is(":visible")) {
                        qr.hide()
                    } else {
                        qr.show()
                    }
                });

                d3.select('#autowalk-toggle').on('click', function () {
                    var walk = $('#autowalk-menu');
                    if (walk.is(":visible")) {
                        walk.hide()
                    } else {
                        walk.show()
                    }
                });
                //Key Up event handlers for the different keyboard shortscuts
                function menu_keyUp(e) {
                    /*
                     Alt + O to open the menu

                     */
                    if (e.altKey && e.keyCode == 79) {
                        var options = $('#options-menu')
                        var qr = $('#qrcode');
                        var walk = $('#autowalk-menu');
                        var search = $('.xdsoft_autocomplete');
                        var breadcrumbs = $('#crumbs-container');
                        ;

                        if (options.is(":visible")) {
                            options.hide()
                            qr.hide();
                            walk.hide();
                            search.hide();
                            breadcrumbs.hide();
                        } else {
                            options.show()
                        }
                    }
                }

                // register the event listener and comeback
                document.addEventListener('keyup', menu_keyUp, false);
            });
        }
    );

}
loadData();