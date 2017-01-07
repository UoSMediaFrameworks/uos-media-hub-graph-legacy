/**
 * Created by Angel.P on 28/11/2016.
 */

if (location.hostname === "dev-uos-mediahubgraph.azurewebsites.net") {
    var socket = io("http://dev-uos-mediahub.azurewebsites.net/", {forceNew: true});
} else {
    var socket = io("http://uos-mediahub.azurewebsites.net/", {forceNew: true});
}
var sceneId;
window.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});

function initializeGraph(rootData, type) {
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
                if(!(o.node.type == "root")){
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
        sceneId: sceneId
    };

    /*
     07/12/2016 Angel Petrov: Based on the type, of graph it will use an object containing
     the drawing instruction for each individual type and its methods.
     can be expanded further.
     */
    if (type == "MEMOIR_SCENE_GRAPH") {
        //Initializes a new object of the graph type by passing along the properties object.
        var graphMemoir = new MemoirGraph(properties);
        graphMemoir.draw(root);
    } else {
        var graphGDC = new GlobalDigitalCityGraph(properties);
        graphGDC.draw(root)
    }


}
function initializeAutoWalk() {

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
                    fullRoomId = roomID;
                    roomId = socket.id;
                }
                // this will be where the scene id will
                // load up to query to hub for a graph but
                // that will be replaced with a hardcoded one
                sceneId = getQueryVariable("id") || sceneId;
                socket.emit('loadSceneGraph', sceneId, function (err, sceneGraph) {
                    if (err || !sceneGraph) {
                        console.log(err, sceneGraph)
                    } else {
                       // console.log(sceneGraph)
                        //We initialize the scene settup and root buildup, combined with passing a type
                        //for the drawing instruction
                        initializeGraph(sceneGraph.nodeList, sceneGraph.type);
                    }
                });

                //We use the jqeury QR library to build up a link to the scene viewer for users to be able to scan
                if (location.hostname === "dev-uos-mediahubgraph.azurewebsites.net") {
                    jQuery('#qrcode').qrcode('http://dev-uos-sceneeditor.azurewebsites.net/manifest2015.html?room=' + roomId);
                } else {
                    jQuery('#qrcode').qrcode('http://uos-sceneeditor.azurewebsites.net/manifest2015.html?room=' + roomId);
                }


                //Key Up event handlers for the different keyboard shortscuts
                function viewer_keyUp(e) {
                    /*
                     Alt + V to open up the scene viewer
                     Alt + Q to show/hide QR Code
                     ALT + S to show/hide search input for scene nodes in the graph
                     ALT + B to show/hide Breadcrumbs menu
                     */
                    if (e.altKey && e.keyCode == 86) {
                        var href;
                        if (location.hostname === "dev-uos-mediahubgraph.azurewebsites.net") {
                            href = 'http://dev-uos-sceneeditor.azurewebsites.net/manifest2015.html?room=' + roomId;
                        } else {
                            href = 'http://uos-sceneeditor.azurewebsites.net/manifest2015.html?room=' + roomId;
                        }
                        window.open(href, "_blank");

                    } else if (e.altKey && e.keyCode == 81) {
                        // call your function to do the thing
                        var qr = $('#qrcode');
                        if (qr.is(":visible")) {
                            qr.hide()
                        } else {
                            qr.show()
                        }
                    } else if (e.altKey && e.keyCode == 83) {
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

                // register the event listener and comeback
                document.addEventListener('keyup', viewer_keyUp, false);
            });
        }
    )
    ;

}
loadData();