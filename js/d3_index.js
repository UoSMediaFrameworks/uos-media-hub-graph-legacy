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
            type: "City",
            id: "Test1City",
            name: "Test",
            parentRelationshipIds: [
                "GraphThemeCity", "GraphThemePeople", "GraphThemeMovement"
            ],
            childRelationshipIds: []
        },
        {
            type: "City",
            id: "Test2City",
            name: "Test2",
            parentRelationshipIds: [
                "GraphThemeCity", "GraphThemePeople", "GraphThemeMovement"
            ],
            childRelationshipIds: []
        },
        //{
        //    type: "City",
        //    id: "Test4City",
        //    name: "Test4",
        //    parentRelationshipIds: [
        //        "GraphThemeCity", "GraphThemePeople", "GraphThemeMovement"
        //    ],
        //    childRelationshipIds: []
        //},
        {
            type: "City",
            id: "Test3City",
            name: "Test3",
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

    var height, width, svg, root, diagonal, nodeCollection, edgeCollection, duration, zoom;


    d3.selection.prototype.touchHandler = function (callback) {
        var last = 0;
        return this.each(function (d) {
            var currentEL = this;
            d3.select(this)
                .on("touchstart", function (e) {
                    last = d3.event.timeStamp;
                })
                .on('touchend', function (e) {
                    if (d3.event.timeStamp - last > 1000) {
                        return callback(currentEL, e, 'longclick');
                    } else if ((d3.event.timeStamp - last) < 500) {
                        return callback(currentEL, e, 'tap');
                    }
                }).on('touchmove', function (e) {
                    console.log("moving")
            });
        });
    };

    root = {
        nodes: [],
        edges: []
    };

    duration = 5000;
    height = window.innerHeight;
    width = window.innerWidth;
    var margin = {top:20,bot:20,left:20,right:20};
    var innerH = height - margin.top + margin.bot;
    var innerW = width - margin.left + margin.right;
    zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed)

    var fisheye = d3.fisheye.circular().radius(120);

    svg = d3.select('#graph')
        .append('svg')
        .attr("height", height)
        .attr("width", width)
        .append('g')
        .attr("fill", "#333");


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
                obj.cx = innerW / 2;
                obj.cy = innerH / 2;
                obj.r = 2;
                obj.children = [];
                obj.parents = [];
                obj.related = [];
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
                            parents : [],
                            related : [],
                            x: 0,
                            y: 0,
                            cx: innerW / 2,
                            cy: innerH / 2,
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
                    parentObj.children.push(node);
                    node.parents.push(parentObj);
                })

            })
        }

        processNodes(data);
        processScenes();
        processsEdges();
    }


    initialize(rootData);
    draw(root)
    var cleanTitle = function (title) {
        return title.replace(/([a-z])([A-Z0-9])(?=[a-z])/g, '$1 $2').replace('GUIscene', 'scene').replace(/(scene|chicago|beijing)?\s(.*)?/i, '<sup>$1</sup><span class="$1">$2</span>');
    };

    function contextualize(el, d) {
        var clean_name = cleanTitle(d.id);
        var scale = 1;
        var radius = 0;

        d3.select('.highlight').classed('highlight', false);
        d3.selectAll('.highlightedLink').classed('highlightedLink', false);
        d3.select(el).classed('highlight', true);
        var test = _.filter(edgeCollection[0], function (item) {
            return item.__data__.source == d || item.__data__.target == d;
        });
        d3.selectAll(test).classed('highlightedLink', true);

        scale = Math.min(Math.pow(2, Math.sqrt(64 / d.r), 16));
        radius = Math.max(5, Math.min(Math.pow(16, 1.5), (innerH / 2.5) / scale));
        $("#reset-new2").click();
        cluster(el, radius, true);
        d3.select('h1').html(clean_name);
    }

    function cluster(el, radius, recurse) {
        console.log(radius)
        d3.select(el).each(function (d) {
            d.related = _.union(d.children, d.parents);
            var total = d.related.length;
            var cx = d.cx;
            var cy = d.cy;
            d.related.forEach(function (child, index) {
                var radian = (2 * Math.PI) * (index / total);
                var x = (Math.cos(radian) * radius) + cx;
                var y = (Math.sin(radian) * radius) + cy;
                moveNode(child, x, y);
            });
        })

    }

    function moveNode(node, positionX, positionY) {
        var ratio = 1 - Math.pow(1 / duration, 5);
        d3.select('#' + node.id).transition()
            .duration(duration)
            .attr('cx', function (d) {
                var cx = d.cx;
                if (ratio >= 1) {
                    d.cx = positionX
                    return d.cx;
                } else {
                    d.cx = ratio * (positionX - cx) + cx;
                    return d.cx;
                }
            })
            .attr('cy', function (d) {
                var cy = this.cy;
                if (ratio >= 1) {
                    d.cy = positionY;
                    return d.cy;
                } else {
                    d.cy = ratio * (positionY - cy) + cy;
                    return d.cy;
                }
            });
        var test = _.filter(edgeCollection[0], function (item) {
            return item.__data__.source == node || item.__data__.target == node;
        });

        var test2 = edgeCollection.filter(function (item) {
            return item.source == node || item.target == node;
        });

        test2.transition()
            .duration(duration)
            .attr('d', function (d) {
                var diagonal = [
                    "M", d.source.cx, d.source.cy,
                    "A", innerH, innerH, 0, 0, 1, d.target.cx, d.target.cy
                ].join(" ");
                return diagonal;
            });
    }

    function highlight(el, d) {

        if (d3.select(el).classed('highlight')) {

            d3.select(el).classed('highlight', false);
            d3.selectAll('.highlightedLink').classed('highlightedLink', false);
            d3.select('h2').style("opacity", "0");
        } else {

            d3.select('h2')
                .html(cleanTitle(d.id))
                .style('top', function () {
                    return d.cy - (d.r * 2 + 2) + 'px';
                })
                .style('left', function () {
                    return d.cx - 50 + 'px';
                })
                .style("opacity", "1");

            d3.select('.highlight').classed('highlight', false);


            d3.selectAll('.highlightedLink').classed('highlightedLink', false);
            d3.select(el).classed('highlight', true);
            var test = _.filter(edgeCollection[0], function (item) {
                return item.__data__.source == d || item.__data__.target == d;
            });

            d3.selectAll(test).classed('highlightedLink', true);

        }

    }

//--------------------Drawing--------------------------//
    function draw(processedData) {

        nodeCollection = nodeContainer.selectAll('circle').data(processedData.nodes);
        edgeCollection = pathContainer.selectAll('path').data(processedData.edges);


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
            .call(circle)
            .touchHandler(function (el, d, type) {
                if (type == 'tap') {
                    return highlight(el, d);
                } else if (type == 'longclick') {
                    return contextualize(el, d);
                } else if (type == 'doubletap') {
                    return contextualize(el, d);
                }
            });

        var linkEnter = edgeCollection.enter().append('path')
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

        function createClassName(nodeId) {
            return nodeId.replace(/([a-z])([A-Z0-9])(?=[a-z])/g, '$1 $2').toLowerCase()
        }

        function circle(nodeArr) {
            nodeArr
                .attr('x', function (d) {
                    d.x = innerW / 2 + (Math.random() * innerW / 2) * ((Math.random() > 0.5) ? -1 : 1)
                    return d.x
                })
                .attr('y', function (d) {
                    d.y = innerH / 2 + (innerH / 2 * Math.random() * ((Math.random() > 0.5) ? -1 : 1))
                    return d.y
                })
                .attr('r', function (d) {
                    d.r = 4;
                    return d.r
                });
        }

        var sceneNodes = nodeEnter.filter(function (d) {
            return d.type == "Scene";
        });

        if (root.nodes.length > 200) {
            sceneNodes.attr('visible', false);
        }
        else {
            console.log(root.nodes.length)
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
                d.y = (Math.sin(angle * i) * innerH / 2) + d.cy;
                if (d.y == 0) {
                    d.y = d.y + d.r * 2;
                }
                if (d.y == innerH) {
                    d.y = d.y - d.r * 2;
                }
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

                return d.x;
            });


        var rootNodes = nodeEnter.filter(function (d) {
            return d.type == 'root'
        });
        rootNodes.attr('x', function (d, i) {
                d.x = ((innerW / rootNodes[0].length) / 2) * i + innerW / rootNodes[0].length;
                return d.x
            })
            .attr('y', function (d) {
                d.y = innerH - innerH / 2;
                return d.y;
            })
            .attr('r', function (d) {
                d.r = 16;
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
                        "A", innerH, innerH, 0, 0, 1, d.target.cx, d.target.cy
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
d3graphv2()