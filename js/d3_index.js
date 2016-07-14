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
        //{
        //    type: "City",
        //    id: "ManchesterCity",
        //    name: "Manchester",
        //    parentRelationshipIds: [
        //        "GraphThemeCity", "GraphThemePeople", "GraphThemeMovement"
        //    ],
        //    childRelationshipIds: []
        //},
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

    var height, width, svg, root, diagonal, nodeCollection, edgeCollection, duration, zoom;

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
            .call(circle);

        var linkEnter = edgeCollection.enter().append('path')
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

        d3.select('#reset').on('click', function () {
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