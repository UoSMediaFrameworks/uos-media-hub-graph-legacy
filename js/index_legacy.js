'use strict';

String.prototype.format = function () {
    var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
    return this.replace(/{((?:\d+)|(?:[a-z]+))}/g, function (match, key) {
        return typeof args[key] != 'undefined' ? args[key] : match;
    });
};
var doubleTapEvent = new Event('doubletap');
//var socket = null;
//
//d3.selection.prototype.doubleTap = function(callback) {
//    var last = 0;
//    console.log('checking for a doubletap')
//    return this.each(function() {
//        d3.select(this).on("touchstart", function(e) {
//            console.log('someone is tapping')
//            if ((d3.event.timeStamp - last) < 500) {
//                return callback(e);
//            }
//            last = d3.event.timeStamp;
//        });
//    });
//}

//d3.select(".node-container").doubleTap(function() {
//    console.log("I dunno")
//    elem.dispatchEvent(doubleTapEvent);
//});




d3.select('#build-new').on('click', function () {
    d3.selectAll('svg').remove();
    d3.xml('GDC_installation_GUI_Final_5.13.15.xml')
        .header("Content-Type", "text/xml")
        .get(function (err, data) {
            if (err) {
                console.log(err)
            } else {
                var graphEl = $('#graph');
                d3Graph(data, graphEl);
            }
        });

});
d3.select("#build-new2").on('click',function(){
    d3.selectAll('svg').remove();
    d3graphv2();
})

if (document.cookie) {
// document.cookie;
    form.querySelector('label').style.display = 'none';
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("submit", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    form.dispatchEvent(evt);
}


function d3graphv2() {

//--------------------Event based functions-----------------//
    function mousein() {

    }

    function mouseover() {

    }

    function mouseout() {

    }

    function touchstart() {

    }

    function touchend() {

    }

    function doubletap() {

    }

    function longclick() {

    }

//--------------------Global Variables----------------//

    var rootData = [
        {
            type: "Theme",
            id: "ThemeBusy",
            name: "ThemeBusy",
            parentRelationshipIds: [
                "ManchesterCity"
            ],
            childRelationshipIds: []
        },
        {
            type: "Theme",
            id: "ThemeHappy",
            name: "ThemeHappy",
            parentRelationshipIds: [
                "ChicagoCity"
            ],
            childRelationshipIds: []
        },
        {
            type: "Theme",
            id: "ThemeDisruption",
            name: "ThemeDisruption",
            parentRelationshipIds: [
                "ManchesterCity"
            ],
            childRelationshipIds: []
        },
        {
            type: "Theme",
            id: "ThemeTrams",
            name: "ThemeTrams",
            parentRelationshipIds: [
                "ManchesterCity"
            ],
            childRelationshipIds: []
        },
        {
            type: "Theme",
            id: "ThemeElectricBus",
            name: "ThemeElectricBus",
            parentRelationshipIds: [
                "ThemeGreen"
            ],
            childRelationshipIds: []
        },
        {
            type: "Theme",
            id: "ThemeGreen",
            name: "ThemeGreen",
            parentRelationshipIds: [
                "ChicagoCity"
            ],
            childRelationshipIds: [
                "ThemeElectricBus"
            ]
        },
        {
            type: "Theme",
            id: "ThemeBikes",
            name: "ThemeBikes",
            parentRelationshipIds: [
                "ChicagoCity"
            ],
            childRelationshipIds: []
        },
        {
            type: "Theme",
            id: "ThemeRainy",
            name: "ThemeRainy",
            parentRelationshipIds: [
                "ManchesterCity"
            ],
            childRelationshipIds: []
        },
        {
            type: "Theme",
            id: "ThemeGallery",
            name: "ThemeGallery",
            parentRelationshipIds: [
                "ThemePublicAttractions"
            ],
            childRelationshipIds: []
        },
        {
            type: "Theme",
            id: "ThemePublicAttractions",
            name: "ThemePublicAttractions",
            parentRelationshipIds: [
                "ThemeArt"
            ],
            childRelationshipIds: [
                "ThemeGallery"
            ]
        },
        {
            type: "Theme",
            id: "ThemePainting",
            name: "ThemePainting",
            parentRelationshipIds: [
                "ThemeArt"
            ],
            childRelationshipIds: []
        },
        {
            type: "Theme",
            id: "ThemeArt",
            name: "ThemeArt",
            parentRelationshipIds: [
                "ChicagoCity", "ManchesterCity"
            ],
            childRelationshipIds: [
                "ThemePainting", "ThemePublicAttractions"
            ]
        },
        {
            type: "City",
            id: "ManchesterCity",
            name: "Manchester",
            parentRelationshipIds: [
                "GraphThemeCity", "GraphThemePeople", "GraphThemeMovement"
            ],
            childRelationshipIds: []
        },
        {
            type: "City",
            id: "ChicagoCity",
            name: "Chicago",
            parentRelationshipIds: [
                "GraphThemeCity", "GraphThemePeople", "GraphThemeMovement"
            ],
            childRelationshipIds: []
        },
        {
            type: "City",
            id: "SingapoorCity",
            name: "Singapoor",
            parentRelationshipIds: [
                "GraphThemeCity", "GraphThemePeople", "GraphThemeMovement"
            ],
            childRelationshipIds: []
        },
        {
            type: "City",
            id: "BeijingCity",
            name: "Beijing",
            parentRelationshipIds: [
                "GraphThemeCity", "GraphThemePeople", "GraphThemeMovement"
            ],
            childRelationshipIds: []
        },
        {
            type: "City",
            id: "BulgariaCity",
            name: "Bulgaria",
            parentRelationshipIds: [
                "GraphThemeCity", "GraphThemePeople", "GraphThemeMovement"
            ],
            childRelationshipIds: []
        },
        {
            type: "City",
            id: "RandomCity",
            name: "Random",
            parentRelationshipIds: [
                "GraphThemeCity", "GraphThemePeople", "GraphThemeMovement"
            ],
            childRelationshipIds: []
        },
        {
            type: "root", //could also be called GraphTheme
            id: "GraphThemeCity",
            name: "City",
            parentRelationshipIds: [],
            childRelationshipIds: []
        },
        {
            type: "root", //could also be called GraphTheme
            id: "GraphThemePeople",
            name: "People",
            parentRelationshipIds: [],
            childRelationshipIds: []
        },
        {
            type: "root", //could also be called GraphTheme
            id: "GraphThemeMovement",
            name: "Movement",
            parentRelationshipIds: [],
            childRelationshipIds: []
        }
    ];

    var height, width, svg, root, diagonal, nodeCollection, linkCollection, duration, zoom;

    root = {
        nodes: [],
        edges: []
    };

    duration = 5000;
    height = window.innerHeight;
    width = window.innerWidth;
    zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);

    svg = d3.select('#graph')
        .append('svg')
        .attr("height", height)
        .attr("width", width)
        .append('g')
        .attr("fill", "#333")
        .call(zoom);


    function zoomed() {
        nodeContainer.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }


    var nodeContainer = svg.append('g')
        .attr("class", "node-container");

    var pathContainer = nodeContainer.append('g')
        .attr("class", "path-container");


//--------------------Layout--------------------------//

    function initialize(data) {
        function processNodes(data) {
            data.forEach(function (obj) {
                obj.x = obj.y = 0;
                obj.cx = width / 2;
                obj.cy = height / 2;
                obj.r = 2;
                root.nodes.push(obj)
            })
        }

        function processScenes() {
            root.nodes.forEach(function (node) {
                if (node.childRelationshipIds.length > 0) {
                    node.childRelationshipIds.forEach(function (child) {
                        root.nodes.push({
                            id: child,
                            type: 'Scene',
                            name: child,
                            parentRelationshipIds: [node.id],
                            x: 0,
                            y: 0,
                            cx: width / 2,
                            cy: height / 2,
                            r: 2
                        })
                    })
                }
            })
        }

        function processsEdges() {
            root.nodes.forEach(function (node) {
                node.parentRelationshipIds.forEach(function (parent) {
                    var parentObj = _.find(root.nodes, function (obj) {
                        return obj.id == parent;
                    })
                    if (parentObj != undefined)
                        root.edges.push({source: parentObj, target: node})
                })

            })
        }

        processNodes(data);
        processScenes();
        processsEdges();
        console.log(root)
    }


    initialize(rootData);
    draw(root)

    function findElement(collection, element) {
        return _.find(collection, function (obj) {
            console.log(obj.__data__ == element)
            return obj.__data__ == element;
        })
    }

//--------------------Drawing--------------------------//
    function draw(processedData) {

        nodeCollection = nodeContainer.selectAll('circle').data(processedData.nodes);
        linkCollection = pathContainer.selectAll('path').data(processedData.edges);


        var nodeEnter = nodeCollection.enter().append('circle')
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
                return d.id
            })
            .attr('class', function (d) {
                return createClassName(d.id);
            })
            .call(circle);

        var linkEnter = linkCollection.enter().append('path')
            .attr('d', function (d) {
                var diagonal = [
                    "M", d.source.cx, d.source.cy,
                    "A", height, height, 0, 0, 1, d.target.cx, d.target.cy
                ].join(" ");
                return diagonal;
            })
            .attr('class', function (d) {
                return 'opaque';
            });

        function createClassName(nodeId) {
            return nodeId.replace(/([a-z])([A-Z0-9])(?=[a-z])/g, '$1 $2').toLowerCase()
        }

        function circle(nodeArr) {
            nodeArr
                .attr('x', function (d) {
                    d.x = width / 2 + (Math.random() * width / 2) * ((Math.random() > 0.5) ? -1 : 1)
                    return d.x
                })
                .attr('y', function (d) {
                    d.y = height / 2 + (height / 2 * Math.random() * ((Math.random() > 0.5) ? -1 : 1))
                    return d.y
                })
                .attr('r', function (d) {
                    d.r = 4;
                    return d.r
                });
        }

        var cityNodes = nodeEnter.filter(function (d) {
            return d.type == "City";
        });
        var angle = (2 * Math.PI) / cityNodes[0].length;
        cityNodes
            .attr('r', function (d) {
                d.r = 16;
                return d.r;
            })
            .attr('y', function (d, i) {
                d.y = (Math.sin(angle * i) * height / 2) + d.cy;
                return d.y;
            })
            .attr('x', function (d, i) {
                d.x = (Math.cos(angle * i) * width / 2) + d.cx;
                if (d.x == 0) {
                    d.x = d.x + d.r * 2;
                }
                if (d.x == width) {
                    d.x = d.x - d.r * 2;
                }
                console.log(d.x)
                return d.x;
            });


        var rootNodes = nodeEnter.filter(function (d) {
            return d.type == 'root'
        });
        rootNodes.attr('x', function (d, i) {
                d.x = ((width / rootNodes[0].length) / 2) * i + width / rootNodes[0].length;
                return d.x
            })
            .attr('y', function (d) {
                d.y = height - height / 2;
                return d.y;
            })
            .attr('r', function (d) {
                d.r = 8;
                return d.r;
            });
        var sceneNodes = nodeEnter.filter(function (d) {
            return d.type == 'Scene'
        });
        sceneNodes.style('fill', 'yellow');

        d3.select('#reset-new2').on('click', function () {
            resetGraph();
        });
        function resetGraph() {
            d3.select('h1').html = '';
            zoom.scale(1);
            zoom.translate([0, 0])
            nodeContainer.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");
            transitionGraphElements();
        }

        function cluster(node, key, radius, recurse, start) {
            //todo rewrite to use thresholds
            var total = node[key].length;
            node[key].forEach(function (child, index) {
                var radian = (2 * Math.PI) * (index / total);
                var x = (Math.cos(radian) * radius) + cx;
                var y = (Math.sin(radian) * radius) + cy;
                var to = [x, y];
                var duration = initDuration;
                moveNode(child, x, y, duration);
                if (recurse) {
                    var elm = getDomElementById(nodeEnter[0], child);
                    cluster(child, elm, key, radius / 2, false);
                }
            });
        }

        function transitionGraphElements() {

            var ratio = 1 - Math.pow(1 / duration, 5);
            nodeEnter.transition()
                .duration(duration)
                .attr('cx', function (d) {
                    if (ratio >= 1) {
                        d.cx = d.x;
                    } else {
                        d.cx = ratio * (d.x - d.cx) + cx;
                    }
                    return d.cx;
                })
                .attr('cy', function (d) {
                    if (ratio >= 1) {
                        d.cy = d.y;
                    } else {
                        d.cy = ratio * (d.y - d.cy) + cy;
                    }
                    return d.cy;
                });

            linkEnter.transition()
                .duration(duration)
                .attr('d', function (d) {
                    var diagonal = [
                        "M", d.source.cx, d.source.cy,
                        "A", height, height, 0, 0, 1, d.target.cx, d.target.cy
                    ].join(" ");
                    return diagonal;
                })
                .transition()
                .duration(Math.random() * 200)
                .attr('class', function (d) {
                    //return createClassName(d.source.id)+ ' ' + createClassName(d.target.id);
                    return d.source.id + ' ' + d.target.id
                });


        }

        transitionGraphElements()

    }

//
}
var d3Graph = function (data, container) {

    var graphData = {
        nodes: [],
        links: [],
        scenes: []
    };

    var height, width;
    height = window.innerHeight;
    width = window.innerWidth;
    var nodeCollection, linkCollection;
    var initDuration = 5000;

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);

    var svg = d3.select('#graph')
        .append('svg')
        .attr("height", height)
        .attr("width", width)
        .append('g')
        .attr("fill", "#333")
        .call(zoom);

    var parseNodes = function (data) {
        data.forEach(function (d) {
            d.id = d.getAttribute('IRI').substring(1);
            graphData.nodes.push(
                {
                    element: d,
                    children: [],
                    parents: [],
                    scenes: [],
                    links: [],
                    wormholes: []
                }
            );

        });
    };
    var parseEdgeConnections = function (node) {
        node.children.forEach(function (target) {
            graphData.links.push({source: node, target: target});
        });
    };
    var parseHierarchy = function (subclasses) {
        subclasses.forEach(function (d) {
            var edge = d.querySelector('ObjectSomeValuesFrom') || null;

            var nodesFrom = d.querySelectorAll('Class');
            var child = _.find(graphData.nodes, function (obj) {

                return obj.element.id == nodesFrom[0].getAttribute('IRI').substring(1);
            });
            var parent = _.find(graphData.nodes, function (obj) {
                return obj.element.id == nodesFrom[1].getAttribute('IRI').substring(1);
            });

            if (edge) {
                var predicate = edge.querySelector('ObjectProperty').getAttribute('IRI');
                if (predicate == '#isSceneOf') {
                    graphData.scenes.push(child);
                    parent.scenes.push(child)
                } else {
                    parent.wormholes.push(child);
                }
            } else {
                parent.children.push(child);
                child.parents.push(parent);
            }
        })
    }

    var processData = function (data) {
        parseNodes(data.querySelectorAll('Declaration > Class'));
        parseHierarchy(data.querySelectorAll('SubClassOf'));
        graphData.nodes.forEach(function (d) {
            parseEdgeConnections(d)
        });
    };
    var nodeContainer = svg.append('g')
        .attr("class", "node-container");

    var pathContainer = nodeContainer.append('g')
        .attr("class", "path-container");



    function zoomed() {
        nodeContainer.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    function mouseout(d) {
        d3.select('h2').style("opacity", "0");
        d3.select(this).classed('highlight', false);
        //graphData.links.forEach(function (test) {
        //    var link = getDomElementByObj(linkCollection[0], test)
        //    d3.select(link).classed('highlightedLink', false);
        //});
    }

    function singletap(d) {
        var t2 = d3.event.timeStamp,
            t1 = $(this).data('lastTouch') || t2,
            dt = t2 - t1,
            fingers = d3.event.originalEvent.touches.length;
            console.log(fingers)
        $(this).data('lastTouch', t2);

        if (!dt || dt > 500 || fingers > 1) {
            console.log('touch');
            var test = _.filter(graphData.links, function (item) {
                return item.source == d;
            });
            test.forEach(function (item) {
                var link = getDomElementByObj(linkCollection[0], item)
                d3.select(link).classed('highlightedLink', true);
            })
        } else {
            console.log('dispatch event')
            elem.dispatchEvent(doubleTapEvent);
        }
    }

    function doubletap(d) {
        console.log('double tapped');
        console.log(d);
    }

    function mouseover(d) {
        console.log('mouseover');
        var node = this;
        d3.select('h2')
            .html(cleanTitle(this.id))
            .style('top', function (d) {
                return node.getAttribute('cy') - 75 + 'px';
            })
            .style('left', function (d) {
                return node.getAttribute('cx') - 50 + 'px';
            })
            .style("opacity", "1");
        d3.select(this).classed('highlight', true);


    }


    function filter(data, field, values) {
        _.filter(data, function (item) {
            return _.contains(values, item[field]);
        })
    }


    function getDomElementById(collection, object) {
        return _.find(collection, function (obj) {
            return obj.id == object.element.id;
        })
    }

    function getDomElementByObj(collection, object) {
        return _.find(collection, function (obj) {
            return obj.__data__ == object;
        })
    }


    var drawGraph = function (data) {
        var prefix = [];
        var splits = [];

        prefix.push('Chicago');
        prefix.push('Beijing');

        splits.push('City');
        splits.push('Movement');
        splits.push('People');

        nodeCollection = nodeContainer.selectAll('circle').data(data.nodes);

        linkCollection = pathContainer.selectAll('path').data(data.links);

        var nodeEnter = nodeCollection.enter().append('circle')
            .attr('cy', function () {
                return height / 2
            })
            .attr('cx', function () {
                return width / 2
            })
            .attr('r', 2)
            .attr('id', function (d) {
                return d.element.getAttribute('IRI').substring(1) || 'Error';
            })
            .attr('class', function (d) {
                return d.element.getAttribute('IRI').substring(1).replace(/([a-z])([A-Z0-9])(?=[a-z])/g, '$1 $2').toLowerCase();
            })
            .call(circle)
            .on('mouseover', mouseover)
            .on('mouseout',mouseout)
            .on('click',contextualize)
            .on('touchend', contextualize);

            //.on('touchstart', singletap);

        var linkEnter = linkCollection.enter().append('path')
            .attr('d', function (d) {
                var source = getDomElementById(nodeEnter[0], d.source)
                var target = getDomElementById(nodeEnter[0], d.target)
                var diagonal = [
                    "M", source.getAttribute('cx'), source.getAttribute('cy'),
                    "A", height, height, 0, 0, 1, target.getAttribute('cx'), target.getAttribute('cy')
                ].join(" ");
                return diagonal;
            })
            .attr('class', function (d) {
                return 'opaque';
            });

        function cluster(node, element, key, radius, recurse, start) {
            var total = node[key].length;
            var cx = parseFloat(d3.select(element).attr('cx'));
            var cy = parseFloat(d3.select(element).attr('cy'));
            node[key].forEach(function (child, index) {
                var radian = (2 * Math.PI) * (index / total);
                var x = (Math.cos(radian) * radius) + cx;
                var y = (Math.sin(radian) * radius) + cy;
                var to = [x, y];
                var duration = initDuration;
                moveNode(child, x, y, duration);
                if (recurse) {
                    var elm = getDomElementById(nodeEnter[0], child);
                    cluster(child, elm, key, radius / 2, false);
                }
            });
        }

        d3.select('#reset-new').on('click', function () {
            resetGraph();
        });
        function resetGraph() {
            d3.select('h1').html = '';
            zoom.scale(1);
            zoom.translate([0, 0])
            nodeContainer.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");
            transitionGraphElements();
        }

        function moveNode(node, positionX, positionY, duration) {
            var ratio = 1 - Math.pow(1 / duration, 5);
            d3.select(getDomElementById(nodeEnter[0], node)).transition()
                .duration(duration)
                .attr('cx', function (d) {
                    var cx = this.getAttribute('cx');
                    if (ratio >= 1) {
                        return positionX;
                    } else {
                        return ratio * (positionX - cx) + cx;
                    }
                })
                .attr('cy', function (d) {
                    var cy = this.getAttribute('cy');
                    if (ratio >= 1) {
                        return positionY;
                    } else {
                        return ratio * (positionY - cy) + cy;
                    }
                });
        }

        function moveLinks() {
            linkEnter.transition()
                .duration(initDuration)
                .attr('d', function (d) {
                    var source = getDomElementById(nodeEnter[0], d.source)
                    var target = getDomElementById(nodeEnter[0], d.target)
                    var diagonal = [
                        "M", source.getAttribute('cx'), source.getAttribute('cy'),
                        "A", height, height, 0, 0, 1, target.getAttribute('cx'), target.getAttribute('cy')
                    ].join(" ");
                    return diagonal;
                });
        }

        function contextualize(d) {
            var scenes = getScenes(d);
            var clean_name = cleanTitle(d.element.id);
            var scale = 1;
            var radius = 0;
            if (d.children.length > 0) {
                scale = Math.min(Math.pow(2, Math.sqrt(64 / this.getAttribute('r'))), 16);
                radius = Math.max(5, Math.min(Math.pow(this.getAttribute('r'), 1.5), (height / 2.5) / scale));
                cluster(d, this, 'children', radius, true);
            } else if (d.scenes.length > 0) {
                cluster(d, this, 'scenes', 10, false);
            } else if (d.wormholes.length > 0) {
                cluster(d, this, 'wormholes', 15, false, 0);
                scale = Math.min(Math.pow(2, Math.sqrt(64 / this.getAttribute('r'))), 16);
            } else if (d.parents.length > 0) {
                cluster(d, this, 'parents', 64, false);
                scale = 3;
            } else if (d3.select(d).classed('guiscene')) {
                socket.emit('sendCommand', roomId, 'showScenes', [{name: d.element.id}]);
                return;
            }
            console.log(scale)
            var panx = scale == 1 ? 0 : (width / 2) - this.getAttribute('cx') * scale;
            var pany = scale == 1 ? 0 : (height / 2) - this.getAttribute('cy') * scale + 50;
            nodeContainer.attr("transform", "translate(" + panx + "," + pany + ")scale(" + scale + ")");
            d3.select('h1').html(clean_name);
            //socket.emit('sendCommand', roomId, 'showScenes', scenes.map(function (scene) {
            //    return {'name': scene};
            //}));
            moveLinks();
        }

        function circle(nodeArr) {
            nodeArr.each(function (node, i) {
                var indexInPrefix = prefix.indexOf(node.element.id);
                var indexInSplits = splits.indexOf(node.element.id);
                var parentInPrefix = checkIfParentIsInPrefix(node);

                if (indexInPrefix < 0 && indexInSplits < 0 && !parentInPrefix) {
                    d3.select(this).attr('x', function (d) {
                            return (width / 2) + (Math.random() * width / 2 ) * ((Math.random() > 0.5) ? -1 : 1)
                        })
                        .attr('y', function (d) {
                            return height / 2 + (height / 2 * Math.random() * ((Math.random() > 0.5) ? -1 : 1));
                        })
                        .attr('r', 2);
                }

                if (indexInPrefix >= 0) {
                    d3.select(this).attr('x', function (d, index) {
                            return ((width - 200) * indexInPrefix + 100);
                        })
                        .attr('y', function (d) {
                            return height / 2;
                        })
                        .attr('r', 32);
                    if (node.children.length > 0) {
                        node.children.forEach(function (child, idx) {
                            var child = getDomElementById(nodeCollection[0], child);
                            d3.select(child).attr('x', function (d) {
                                    var spacing = (width / splits.length);
                                    return spacing * idx + (spacing / 2);
                                })
                                .attr('y', function (d) {
                                    return ( height - height / 2 ) * indexInPrefix + ( height / 4 );
                                })
                                .attr('r', 8);
                        });
                    }
                }
                if (indexInSplits >= 0) {
                    d3.select(this).attr('x', function (d, index) {
                            return ((width / splits.length) / 2) * indexInSplits + width / splits.length;
                        })
                        .attr('y', function (d) {
                            return height - height / 2
                        })
                        .attr('r', 16);
                }
            });
        };

        function transitionGraphElements() {
            var duration = initDuration;
            var ratio = 1 - Math.pow(1 / duration, 5);
            nodeEnter.transition()
                .duration(duration)
                .attr('cx', function (d) {
                    var x = this.getAttribute('x')
                    var cx = this.getAttribute('cx')
                    if (ratio >= 1) {
                        return x;
                    } else {
                        return ratio * (x - cx) + cx;
                    }
                })
                .attr('cy', function (d) {
                    var y = this.getAttribute('y')
                    var cy = this.getAttribute('cy')
                    if (ratio >= 1) {
                        return y;
                    } else {
                        return ratio * (y - cy) + cy;
                    }

                });

            linkEnter.transition()
                .duration(duration)
                .attr('d', function (d) {
                    var source = getDomElementById(nodeEnter[0], d.source)
                    var target = getDomElementById(nodeEnter[0], d.target)
                    var diagonal = [
                        "M", source.getAttribute('x'), source.getAttribute('y'),
                        "A", height, height, 0, 0, 1, target.getAttribute('x'), target.getAttribute('y')
                    ].join(" ");
                    return diagonal;
                })
                .transition()
                .duration(Math.random() * 200)
                .attr('class', function (d) {
                    return d.source.element.id + ' ' + d.target.element.id;
                });
        }

        function getScenes(node) {
            var scenes = node.scenes;
            node.children.forEach(function (childNode) {
                scenes = scenes.concat(getScenes(childNode));
            }, this);
            return scenes.reduce(function (principle, current) {
                if (principle.indexOf(current) < 0) principle.push(current);
                return principle;
            }, []);
        }


        function checkIfParentIsInPrefix(object) {
            if (object.parents) {
                var test;
                object.parents.forEach(function (parent) {
                    if (prefix.indexOf(parent.element.id) >= 0) {
                        test = true;
                    }
                });
                return test == undefined ? false : true;
            }
            return false;
        }

        transitionGraphElements();
    };

    processData(data);
    drawGraph(graphData);


};

var socket = null;
var graph = null;
var layout = null;
var request = new XMLHttpRequest();
var teaser = 0; // represents the teaser timeout variable
var viewer = document.getElementById('viewer');
var roomId = null; // the unique id to pass to viewers for listening for events
var hoverer = function (index) {
    var elem = graph.nodes[this[index]].element;
    var h2 = document.querySelector('h2');

    h2.style.top = layout.coords.y + elem.cy.baseVal.value * layout.coords.z - 75 + 'px';
    h2.style.left = layout.coords.x + elem.cx.baseVal.value * layout.coords.z - 50 + 'px'


    h2.innerHTML = cleanTitle(elem.id);
    elem.classList.add('highlight');

    setTimeout(function () {
        elem.classList.remove('highlight');
        h2.innerHTML = '';
    }, graph.clock.timeout - 250);
};

var connect = function (evt) {
    evt.preventDefault();
    var input = this.querySelector('input[name=password]');

    var password = input.value || document.cookie;

    input.value = '';
    input.placeholder = 'connecting';
    var timeout = setInterval(function () {
        input.placeholder += '.';
    }, 250);

    socket = io(this.action, {forceNew: true});
    socket.on('connect', function (thing) {
        socket.emit('auth', {password: password}, function (err, token, serverRoomId) {
            clearTimeout(timeout);
            if (err) {
                input.setAttribute('placeholder', err);
            } else {
                // In the event of a constant refresh scenario..
                if (this.querySelector('input[name=store]').checked) {
                    document.cookie = password;
                }

                // Get the Graph XML
                viewer.classList.remove('hidden');
                roomId = serverRoomId;
            }
        }.bind(this));
    }.bind(this));
};

var transition = function (begin, callback) {
    if (callback.call(this, begin)) {
        requestAnimationFrame(transition.bind(this, begin, callback));
    }
};

var browser = function () {
    // Return cached result if avalible, else get result then cache it.
    if (browser.prototype._cachedResult)
        return browser.prototype._cachedResult;

    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';

    // At least Safari 3+: "[object HTMLElementConstructor]"
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;

    // Chrome 1+
    var isChrome = !!window.chrome && !isOpera;

    // At least IE6
    var isIE = /*@cc_on!@*/false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    return browser.prototype._cachedResult =
        isOpera ? 'Opera' :
            isFirefox ? 'Firefox' :
                isSafari ? 'Safari' :
                    isChrome ? 'Chrome' :
                        isIE ? 'IE' :
                            isEdge ? 'Edge' :
                                "Don't know";
};

if (browser() == 'Chrome') {
    var head = document.getElementsByTagName('head')[0];

    var script = document.createElement('script');
    script.src = 'js/pathseg.js';
    script.type = 'text/javascript';

    head.appendChild(script)
}
request.open('GET', 'GDC_installation_GUI_Final_5.13.15.xml');
request.setRequestHeader("Content-Type", "text/xml");

request.onreadystatechange = function () {
    if (request.readyState === 4) {
        if (request.status === 200) {
            graph = new Graph(request.responseXML, document.getElementById('graph'));
            layout = new Layout(graph);

            layout.prefix.push('Chicago');
            layout.prefix.push('Beijing');

            layout.splits.push('City');
            layout.splits.push('Movement');
            layout.splits.push('People');


            layout.setup();
        }
    }
}
d3.select('#build-old').on('click',function(){
    d3.selectAll('svg').remove();
    request.send();
});
var Clock = function (timeout) {
    this.timeout = timeout;
    this.configure(1);
}

Clock.prototype = {
    timer: 0,
    observers: {},
    configure: function (length, start) {
        this.index = 0;
        this.length = length;
        this.freeze();
        if (start) {
            this.run();
        }
    },
    run: function () {
        this.timer = setInterval(this.tick.bind(this), this.timeout);
    },
    freeze: function () {
        clearInterval(this.timer);
    },
    tick: function () {
        this.index = (this.index + 1) % this.length;
        for (var callback in this.observers) {
            this.observers[callback](this.index);
        }
    },
    subscribe: function (name, callback) {
        this.observers[name.toLowerCase()] = callback;
    },
    unsubscribe: function (name) {
        delete this.observers[name];
    }
};


var SVG = function (node, options) {
    options['xmlns:xlink'] = 'http://www.w3.org/1999/xlink';
    options.xmlns = 'http://www.w3.org/2000/svg';
    options.version = 1.1;
    this.element = this.createElement('svg', options, node);
};

SVG.prototype.createElement = function (name, opt, parent) {
    var node = document.createElementNS('http://www.w3.org/2000/svg', name);
    for (var key in opt) {
        node.setAttribute(key, opt[key]);
    }
    if (parent === null) {
        return node;
    }
    return (parent || this.element).appendChild(node);
};

function Layout(graph) {
    this.graph = graph;
}

Layout.prototype = {
    prefix: [],
    splits: [],
    coords: {x: 0, y: 0, z: 1},
    setup: function () {
        var width = this.graph.options.width, height = this.graph.options.height;
        for (var id in this.graph.nodes) {
            var node = this.graph.nodes[id];
            var elem = node.element;
            var idx = -1;
            var n = node;
            idx = this.prefix.indexOf(id);
            if (idx >= 0) {
                node.getPlacement = function (idx) {
                    return [
                        (width - 200) * idx + 100,
                        height / 2
                    ];
                }.bind(this, idx);
                elem.setAttribute('r', 32);
                // Represents upper tier (chicago|beijing)(people|movement|city)
                node.children.forEach(function (child, jdx) {

                    var node = this.graph.nodes[child];
                    var elem = node.element;

                    node.getPlacement = function (idx, jdx) {
                        var spacing = ( width / this.splits.length );
                        return [
                            spacing * jdx + (spacing / 2),
                            ( height - height / 2 ) * idx + ( height / 4 )
                        ]
                    }.bind(this, idx, jdx)

                    elem.setAttribute('r', 8);
                }, this);

                continue;
            }

            idx = this.splits.indexOf(id);

            // Represents middle row (people/movement/city)
            if (idx >= 0) {

                node.getPlacement = function (idx) {
                    console.log('Split node id:' + idx)
                    return [
                        ((width / this.splits.length) / 2) * idx + width / this.splits.length,
                        height - height / 2
                    ];
                }.bind(this, idx);

                elem.setAttribute('r', 16);
                continue;
            }


            if (!node.hasOwnProperty('getPlacement')) {
                node.getPlacement = function () {
                    return [
                        (width / 2) + (Math.random() * width / 2 ) * ((Math.random() > 0.5) ? -1 : 1),
                        height / 2 + (height / 2 * Math.random() * ((Math.random() > 0.5) ? -1 : 1))
                    ];
                }
            }
        }
        this.arrange(50000);
    },
    arrange: function (duration) {
        for (var id in this.graph.nodes) {
            this.moveNode(this.graph.nodes[id], this.graph.nodes[id].getPlacement(), Math.max(100, Math.random() * duration));
        }
    },
    cluster: function (node, key, radius, recurse, start) {
        console.log(node)
        var total = node[key].length;
        var cx = node.element.cx.baseVal.value;
        var cy = node.element.cy.baseVal.value;
        console.log('CX:' + cx + '\n CY:'+ cy )
        node[key].forEach(function (child, idx) {
            var node = this.graph.nodes[child];
            var elem = node.element;

            var radian = (2 * Math.PI) * (idx / total);
            var to = [(Math.cos(radian) * radius) + cx, (Math.sin(radian) * radius) + cy];
            console.log(child)
            console.log('----------------------------\n' +
                'Total '+ total + '\n'+
                'Radian: ' + radian + '\n' +
                'Radius: ' + radius + '\n' +
                'Index: ' + idx + '\n' +
                'Total Key Size: ' + total + '\n'+
                'Math cos of radian: ' + Math.cos(radian) + '\n'+
                'Math sin of radian: ' + Math.sin(radian) + '\n'+
                'cx '+ cx + '\n'+
                'cy '+ cy + '\n'+
                'To '+ to + '\n'+
                'x: ' + to[0] + '\n'+
                'y: ' + to[1] + '\n'+
                to[0] + ' = Math.cos(' + radian+') * '+ radius + ' + ' + cx + '\n'+
                to[1] + ' = Math.sin(' + radian+') * '+ radius + ' + ' + cy + '\n'+
                '----------------------------\n');
            var duration = Math.max(1250 * Math.random(), 50 * idx);

            this.moveNode(node, to, duration);

            if (recurse) {
                setTimeout(this.cluster.bind(this, node, key, radius / 2, false), duration);
            }


        }, this);
    },
    moveNode: function (node, to, duration) {
        var from = [node.element.cx.baseVal.value, node.element.cy.baseVal.value];
        requestAnimationFrame(transition.bind(node, Date.now(), function (begin) {

            var ratio = 1 - Math.pow(1/ duration, 5); // float % animation complete
            var x = ratio >= 1 ? to[0] : ( ratio * ( to[0] - from[0] ) ) + from[0];
            var y = ratio >= 1 ? to[1] : ( ratio * ( to[1] - from[1] ) ) + from[1];

            node.element.setAttribute('cx', x);
            node.element.setAttribute('cy', y);
            node.edges.forEach(function (coords) {
                coords.x = x;
                coords.y = y;
            });
            return (ratio < 1);
        }));

    },
    reset: function (message) {
        console.log('Reset triggered')
        document.querySelector('h1').innerHTML = message || '';
        this.panAndZoom({x: 0, y: 0, z: 1});
        setTimeout(this.arrange.bind(this, 2000), 100);
        var edges = graph.edgeGroup.querySelectorAll('path');
        for (var i = edges.length - 1; i >= 0; i--) {
            edges[i].classList.add('opaque');
            setTimeout(function (i) {
                edges[i].classList.remove('opaque');
            }.bind(this, i), Math.random() * 1000);
        }
        graph.clock.freeze();
        graph.clock.configure(5, true);
        graph.clock.subscribe('hoverer', hoverer.bind(['Chicago', 'Beijing', 'People', 'Movement', 'City']));
    },
    panAndZoom: function (to) {
        var duration = 1250;
        var from = this.coords;
        requestAnimationFrame(transition.bind(this, Date.now(), function (begin) {
            var ratio = 1 - Math.pow(1 - (Date.now() - begin) / duration, 5); // float % animation complete

            var z = ratio >= 1 ? to.z : (ratio * (to.z - from.z)) + from.z;

            var x = ratio >= 1 ? to.x : (ratio * (to.x - from.x)) + from.x;
            var y = ratio >= 1 ? to.y : (ratio * (to.y - from.y)) + from.y;

            this.graph.container.setAttribute('transform', 'matrix({0}, 0 0 {0}, {1}, {2})'.format(z, x, y));
            return (ratio < 1);
        }));
        this.coords = to;
    }
};


function Graph(xml, graph_container) {
    this.clock = new Clock(1500);

    this.options = {
        height: window.innerHeight,
        width: window.innerWidth
    };
    this.viewBox = new SVG(graph_container, this.options);
    this.container = this.viewBox.createElement('g');
    this.edgeGroup = this.viewBox.createElement('g', {}, this.container);

    this.drawNodes(xml.querySelectorAll('Declaration > Class'));
    this.parseHierarchy(xml.querySelectorAll('SubClassOf'));


    for (var id in this.nodes) {
        this.drawEdgeConnections(this.nodes[id]);
    }

    this.clock.configure(5, true);
    this.clock.subscribe('hoverer', hoverer.bind(['Chicago', 'Beijing', 'People', 'Movement', 'City']));

    graph_container.addEventListener('click', this.contextualize.bind(this), false);
    graph_container.addEventListener('touchend', this.contextualize.bind(this), false)

}

Graph.prototype = {
    viewBox: null,
    nodes: {},

    scenes: [],
    drawEdgeConnections: function (from) {
        from.children.forEach(function (id) {
            var to = this.nodes[id];

            var edge = this.viewBox.createElement('path', {
                'd': 'M0,0A{0},{0},0,0,1,100,100'.format(this.options.height),
                'class': 'opaque'
            }, this.edgeGroup);

            setTimeout(function () {
                edge.setAttribute('class', from.element.id + ' ' + to.element.id);
            }, Math.random() * 2000);

            if (browser() == 'Chrome') {
                from.edges.push(edge.pathSegList._list[0]);
                to.edges.push(edge.pathSegList._list[1]);
            } else {
                from.edges.push(edge.pathSegList[0]);
                to.edges.push(edge.pathSegList[1]);
            }

        }, this);
    },
    contextualize: function (evt) {
        clearTimeout(teaser);

        if (evt.target.nodeName == 'circle') {
            var node = graph.nodes[evt.target.id];
            var elem = node.element;
            var scenes = graph.getScenes(node);
            var clean_name = cleanTitle(node.element.id);

            var zoom = layout.coords.z;
            var watch = node.children;
            if (node.children.length > 0) {
                zoom = Math.min(Math.pow(2, Math.sqrt(64 / elem.r.baseVal.value)), 16);
                var radius =Math.max(5, Math.min(Math.pow(node.element.r.baseVal.value, 1.5), (graph.options.height / 2.5) / zoom));
                layout.cluster(node, 'children', radius, true);
            } else if (node.scenes.length > 0) {
                layout.cluster(node, 'scenes', 10, false);
                watch = node.scenes;
            } else if (node.wormholes.length > 0) {
                watch = node.wormholes;
                layout.cluster(node, 'wormholes', 15, false, 0);
                zoom = Math.min(Math.pow(2, Math.sqrt(64 / elem.r.baseVal.value)), 16);
            } else if (node.parents.length > 0) {
                watch = node.parents;
                layout.cluster(node, 'parents', 64, false);
                zoom = 3;
            } else if (elem.classList.contains('guiscene')) {
                layout.reset(clean_name);
                //socket.emit('sendCommand', roomId, 'showScenes', [{name: elem.id}]);

                return;
            } else {
                zoom = 1;
                watch = ['Chicago', 'Beijing', 'Movement', 'City', 'People'];
            }


            var panx = zoom == 1 ? 0 : (graph.options.width / 2) - elem.cx.baseVal.value * zoom;
            var pany = zoom == 1 ? 0 : (graph.options.height / 2) - elem.cy.baseVal.value * zoom + 50;

            this.clock.configure(watch.length, true);
            this.clock.subscribe('hoverer', hoverer.bind(watch));


            layout.panAndZoom({x: panx, y: pany, z: zoom});

            document.querySelector('h1').innerHTML = clean_name;


            // scenes mapped to this format [{name:'scene'}, {name:'otherscene}...]
            //socket.emit('sendCommand', roomId, 'showScenes', scenes.map(function (scene) {
            //    return {'name': scene};
            //}));

        } else if (evt.target.nodeName == 'path') {
            var connection = evt.target.classList;
            var from = graph.nodes[connection[0]].element;
            var to = graph.nodes[connection[1]].element
            var dist = Math.sqrt(Math.pow(from.cx.baseVal.value - to.cx.baseVal.value, 2) + Math.pow(from.cy.baseVal.value - to.cy.baseVal.value, 2));
            console.log('distance between nodes', dist);
        } else {
            var zoom = layout.coords.z;

            var x = ((graph.options.width / 2 ) - evt.clientX) + layout.coords.x;
            var y = ((graph.options.height / 2) - evt.clientY) + layout.coords.y;
            layout.panAndZoom({x: x, y: y, z: zoom});
        }

        teaser = setInterval(function () {
            layout.reset();
            socket.emit('sendCommand', roomId, 'showScenes', [{name: 'GUIsceneTeaser'}]);
        }, 2e5);
    },
    drawNodes: function (list) {
        var len = list.length;
        for (var i = 0; i < len; i++) {
            var id = list.item(i).getAttribute('IRI').substring(1);
            this.nodes[id] = {
                element: this.viewBox.createElement('circle', {
                    cx: this.options.width / 2,
                    cy: this.options.height / 2,
                    r: 2,
                    id: id,
                    'class': id.replace(/([a-z])([A-Z0-9])(?=[a-z])/g, '$1 $2').toLowerCase()
                }, this.container),
                children: [],
                parents: [],
                scenes: [],
                edges: [],
                wormholes: []
            }
        }
    },
    parseHierarchy: function (subclasses) {
        for (var i = 0; i < subclasses.length; i++) {
            var edge = subclasses.item(i).querySelector('ObjectSomeValuesFrom');
            var nodes = subclasses.item(i).querySelectorAll('Class');

            var child = nodes.item(0).getAttribute('IRI').substring(1);
            var parent = nodes.item(1).getAttribute('IRI').substring(1);

            if (edge) {
                var predicate = edge.querySelector('ObjectProperty').getAttribute('IRI');
                if (predicate == '#isSceneOf') {
                    this.scenes.push(child);
                    this.nodes[parent].scenes.push(child)
                } else {
                    this.nodes[parent].wormholes.push(child);
                }

            } else {
                this.nodes[parent].children.push(child);
                this.nodes[child].parents.push(parent);
            }
        }
        // this.removeOrphans();
    },
    removeOrphans: function () {
        for (var node in this.nodes) {
            var obj = this.nodes[node];
            // an orphan will not have children, parents, or scenes after parsing (these are essentially scenes)
            if ((obj.scenes.length + obj.parents.length + obj.children.length) < 1) {
                obj.element.parentNode.removeChild(obj.element);
                delete this.nodes[node];
            }
        }
    },
    getScenes: function (node) {
        var scenes = node.scenes;
        node.children.forEach(function (childnode) {
            scenes = scenes.concat(this.getScenes(this.nodes[childnode]));
        }, this);
        return scenes.reduce(function (principle, current) {
            if (principle.indexOf(current) < 0) principle.push(current);
            return principle;
        }, []);
    }
};



