function d3graphv2() {
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

    var rootData = [{
        _id: 'city',
        name: 'city',
        type: 'root',
        parentRelationshipIds: [],
        childrenRelationshIds: []
    },
        {
            _id: 'ThemeWaterFlow',
            name: 'ThemeWaterFlow',
            type: 'theme',
            parentRelationshipIds: ['Waterways'],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemeRain',
            name: 'ThemeRain',
            type: 'theme',
            parentRelationshipIds: ['Waterways'],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemeFresh',
            name: 'ThemeFresh',
            type: 'theme',
            parentRelationshipIds: ['Waterways'],
            childrenRelationshIds: []
        },
        {
            _id: 'Waterways',
            name: 'Waterways',
            type: 'subgraphtheme',
            parentRelationshipIds: ['city', 'Chicago', 'Manchester'],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemePainting',
            name: 'ThemePainting',
            type: 'theme',
            parentRelationshipIds: ['ThemeArt'],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemeGallery',
            name: 'ThemeGallery',
            type: 'theme',
            parentRelationshipIds: ['ThemePublicAttractions'],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemePublicAttractions',
            name: 'ThemePublicAttractions',
            type: 'theme',
            parentRelationshipIds: ['ThemeArt'],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemeArt',
            name: 'ThemeArt',
            type: 'subgraphtheme',
            parentRelationshipIds: ['Chicago', 'Manchester'],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemeGreat',
            name: 'ThemeGreat',
            type: 'subgraphtheme',
            parentRelationshipIds: ['Chicago'],
            childrenRelationshIds: []
        },
        {
            _id: 'Chicago',
            name: 'Chicago',
            type: 'city',
            parentRelationshipIds: ['city', 'people', 'movement'],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemeMuseam',
            name: 'ThemeMuseam',
            type: 'theme',
            parentRelationshipIds: ['ThemeArt'],
            childrenRelationshIds: []
        },
        {
            _id: 'Manchester',
            name: 'Manchester',
            type: 'city',
            parentRelationshipIds: ['city', 'people', 'movement'],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemeSmog',
            name: 'ThemeSmog',
            type: 'subgraphtheme',
            parentRelationshipIds: ['Beijing'],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemeDanger',
            name: 'ThemeDanger',
            type: 'theme',
            parentRelationshipIds: ['ThemeIndustry'],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemeBusy',
            name: 'ThemeBusy',
            type: 'theme',
            parentRelationshipIds: ['ThemeIndustry'],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemeIndustry',
            name: 'ThemeIndustry',
            type: 'subgraphtheme',
            parentRelationshipIds: ['Beijing'],
            childrenRelationshIds: []
        },
        {
            _id: 'Beijing',
            name: 'Beijing',
            type: 'city',
            parentRelationshipIds: ['city', 'people', 'movement'],
            childrenRelationshIds: []
        },
        {
            _id: 'Dalian',
            name: 'Dalian',
            type: 'city',
            parentRelationshipIds: ['city', 'people', 'movement'],
            childrenRelationshIds: []
        },
        {
            _id: 'KualaLumpur',
            name: 'KualaLumpur',
            type: 'city',
            parentRelationshipIds: ['city', 'people', 'movement'],
            childrenRelationshIds: []
        },
        {
            _id: 'Seoul',
            name: 'Seoul',
            type: 'city',
            parentRelationshipIds: ['city', 'people', 'movement'],
            childrenRelationshIds: []
        },
        {
            _id: 't1',
            name: 't1',
            type: 'city',
            parentRelationshipIds: ['city', 'people', 'movement'],
            childrenRelationshIds: []
        },
        {
            _id: 't2',
            name: 't2',
            type: 'city',
            parentRelationshipIds: ['city', 'people', 'movement'],
            childrenRelationshIds: []
        },
        {
            _id: 't3',
            name: 't3',
            type: 'city',
            parentRelationshipIds: ['city', 'people', 'movement'],
            childrenRelationshIds: []
        },
        {
            _id: 'Chengdu',
            name: 'Chengdu',
            type: 'city',
            parentRelationshipIds: ['city', 'people', 'movement'],
            childrenRelationshIds: []
        },
        {
            _id: 'HongKong',
            name: 'HongKong',
            type: 'city',
            parentRelationshipIds: ['city', 'people', 'movement'],
            childrenRelationshIds: []
        },
        {
            _id: 'Shenyang',
            name: 'Shenyang',
            type: 'city',
            parentRelationshipIds: ['city', 'people', 'movement'],
            childrenRelationshIds: []
        },
        {
            _id: 'Panjin',
            name: 'Panjin',
            type: 'city',
            parentRelationshipIds: ['city', 'people', 'movement'],
            childrenRelationshIds: []
        },
        {
            _id: 'people',
            name: 'people',
            type: 'root',
            parentRelationshipIds: [],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemeHunger',
            name: 'ThemeHunger',
            type: 'theme',
            parentRelationshipIds: ['Poverty'],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemeFastfood',
            name: 'ThemeFastfood',
            type: 'theme',
            parentRelationshipIds: ['Poverty'],
            childrenRelationshIds: []
        },
        {
            _id: 'Poverty',
            name: 'Poverty',
            type: 'subgraphtheme',
            parentRelationshipIds: ['people'],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemetFastfood',
            name: 'ThemetFastfood',
            type: 'subgraphtheme',
            parentRelationshipIds: ['Chicago'],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemeTakeaways',
            name: 'ThemeTakeaways',
            type: 'subgraphtheme',
            parentRelationshipIds: ['Manchester'],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemeStreetFood',
            name: 'ThemeStreetFood',
            type: 'subgraphtheme',
            parentRelationshipIds: ['Beijing'],
            childrenRelationshIds: []
        },
        {
            _id: 'movement',
            name: 'movement',
            type: 'root',
            parentRelationshipIds: [],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemeCars',
            name: 'ThemeCars',
            type: 'theme',
            parentRelationshipIds: ['ThemeRoads'],
            childrenRelationshIds: []
        },
        {
            _id: 'ThemeRoads',
            name: 'ThemeRoads',
            type: 'theme',
            parentRelationshipIds: ['Transport'],
            childrenRelationshIds: []
        },
        {
            _id: 'Transport',
            name: 'Transport',
            type: 'subgraphtheme',
            parentRelationshipIds: ['movement', 'Chicago', 'Manchester', 'Beijing'],
            childrenRelationshIds: []
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
                    if (d3.event.timeStamp - last > 500) {
                        return callback(currentEL, e, 'longtouch');
                    } else if ((d3.event.timeStamp - last) < 500) {
                        return callback(currentEL, e, 'tap');
                    }
            })
        });
    };

    root = {
        nodes: [],
        edges: []
    };

    duration = 5000;
    height = window.innerHeight;
    width = window.innerWidth;
    var margin = {top: height * 0.1, bot: height * 0.1, left: width * 0.1, right: width * 0.1};
    var innerH = height - margin.top - margin.bot;
    var innerW = width - margin.left - margin.right;
    zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);


    svg = d3.select('#graph')
        .append('svg')
        .attr("height", height)
        .attr("width", width)
        .append('g')
        .attr("fill", "#333");


    function zoomed() {
        nodeContainer.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

//Append a defs (for definition) element to your SVG
    var defs = svg.append("defs");

//Append a radialGradient element to the defs and give it a unique id
    var radialGradient = defs.append("radialGradient")
        .attr("id", "radial-gradient")
        .attr("cx", "50%")    //The x-center of the gradient, same as a typical SVG circle
        .attr("cy", "50%")    //The y-center of the gradient
        .attr("r", "50%");   //The radius of the gradient, an offset of 100% ends where you've set this radius

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

    var nodeContainer = svg.append('g')
        .attr("class", "node-container").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var hoverh2 = nodeContainer.append('text').attr('fill','white');

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
                if (node.childrenRelationshIds.length > 0) {
                    node.childrenRelationshIds.forEach(function (child) {
                        root.nodes.push({
                            id: child,
                            type: 'Scene',
                            name: child,
                            parentRelationshipIds: [node._id],
                            parents: [],
                            related: [],
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
                        return obj._id == parent;
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
    draw(root);
    var cleanTitle = function (title) {
        return title.replace(/([a-z])([A-Z0-9])(?=[a-z])/g, '$1 $2').replace('GUIscene', 'scene').replace(/(scene|chicago|beijing)?\s(.*)?/i, '<sup>$1</sup><span class="$1">$2</span>');
    };
    function hover(arraySelection,cancel){
        var i = 0;

        arraySelection.transition().duration(duration).delay(500).each(function(d){
            hoverh2
                .html(cleanTitle(d._id))
                .style('top', function () {
                    return d.cy + "px";
                })
                .style('left', function () {
                    return d.cx + "px";
                })
                .style("opacity", "1");
        })
    }
    function contextualize(el, d) {
        console.log('long touch')
        var clean_name = cleanTitle(d._id);
        var scale = 1;
        var radius = 0;


        radius = innerH /5;
        $("#reset-new2").click();

        cluster(el, radius, true);
        clusterHighlight(el, d);
        d3.select('h1').html(clean_name);
    }
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    function pluckArray(array) {
        //console.log('arr size ' + array.length)
        var index = getRandomInt(0, array.length);
        //console.log('Rand index ' + index)
        var obj = array[index];
        //console.log(obj)
        array =  array.splice(index, 1);
        return obj;
    }

    function cluster(el, radius, recurse) {
        d3.select(el).attr('r',function(d){
            return d.r * 1.5;
        }).each(function (d) {
            d.related = _.union(d.children, d.parents);
            var cx = d.cx;
            var cy = d.cy;
            var testArr = [];
            var filteredEdges=[];
            if (d.type == 'root') {
                //console.log('root')
                filteredEdges = _.filter(d.related, function (item) {
                    return item.type == 'city';
                })
            } else if (d.type == 'city') {
                //console.log('city')
                filteredEdges = _.filter(d.related, function (item) {
                    return item.type != 'root';
                })
            } else {
                //console.log('other')
                filteredEdges = _.filter(d.related, function (item) {
                    return item.type != 'root';
                })
            }

            while (testArr.length < 12) {
                var node = pluckArray(filteredEdges);
                if(node == undefined){
                    break;
                }else{
                    testArr.push(node)
                }
            }
            //console.log(testArr)
            var total = testArr.length;
            testArr.forEach(function (child, index) {
                var radian = (2 * Math.PI) * (index / total);
                var x = (Math.cos(radian) * radius) + cx;
                var y = (Math.sin(radian) * radius) + cy;
                moveNode(child, x, y);
            });
        })

    }

    function moveNode(node, positionX, positionY) {
        var ratio = 1 - Math.pow(1 / duration, 5);
        d3.select('#' + node._id).transition()
            .duration(duration)
            .attr('r',function(d){
                return d.r * 1.5;
            })
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

        var edges = edgeCollection.filter(function (item) {
            return item.source == node || item.target == node;
        });

        edges.transition()
            .duration(duration)
            .attr('d', function (d) {
                var diagonal = [
                    "M", d.source.cx, d.source.cy,
                    "A", innerH, innerH, 0, 0, 1, d.target.cx, d.target.cy
                ].join(" ");
                return diagonal;
            });
    }

    function clusterHighlight(el,d){
        d3.select('.longHL').classed('longHL',false);
        d3.selectAll('.longLinkHL').classed('longLinkHL', false);
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
        d3.select(el).classed('longHL', true);
        var edges = _.filter(filteredEdges, function (item) {
            return item.__data__.source == d || item.__data__.target == d;
        });
        d3.selectAll(edges).classed('longLinkHL', true);
    }

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

    function tap(el, d) {
        console.log('tap')
        var longClicked = d3.select('.longHL');
        var lonkClickedLink = d3.selectAll('.longLinkHL');

        longClicked.classed('longHL',false);
        lonkClickedLink.classed('longLinkHL', false);

        hoverh2
            .attr('y',function(data) {
                return d.cy < innerH/2 ? d.cy - d.r * 2 :  d.cy + d.r * 2 })
            .attr('x', d.cx)
            .attr("dy", ".35em")
            .attr('text-anchor','middle')
            .style("opacity", "1")
            .text(function () {return d.name});

        clearTimeout(timeout);
        timeout = setTimeout(function () {
            d3.select(el).classed('highlight', false);
            d3.selectAll('.highlightedLink').classed('highlightedLink', false);
            d3.select('h2').style("opacity", "0");
            longClicked.classed('longHL',true);
            lonkClickedLink.classed('longLinkHL', true);
        }, 5000);

        highlight(el, d)


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
                return d._id
            })
            .attr('class', function (d) {
                return createClassName(d._id);
            })
            .call(circle)
            .touchHandler(function (el, d, type) {
                if (type == 'tap') {
                    return tap(el, d);
                } else if (type == 'longtouch') {
                    return contextualize(el, d);
                }
            }).on('click',function(d){
               return tap(this,d);
            }).on('dblclick',function(d){
               return contextualize(this,d);
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
                    d.r = 6;
                    return d.r
                });
        }

        var sceneNodes = nodeEnter.filter(function (d) {
            return d.type == "scene";
        });

        if (root.nodes.length > 200) {
            sceneNodes.attr('visible', false);
        }
        else {
            ////console.log(root.nodes.length)
        }

        var cityNodes = nodeEnter.filter(function (d) {
            return d.type == "city";
        });
        var angle = (2 * Math.PI) / cityNodes[0].length;
        cityNodes
            .attr('r', function (d) {
                d.r = 14;
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
            }).style({fill: randomColor});



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
            }).style('fill', 'url(#radial-gradient)');

        var sceneNodes = nodeEnter.filter(function (d) {
            return d.type == 'scene'
        });
        sceneNodes.style('fill', 'yellow');

        d3.select('#reset-new2').on('click', function () {
            resetGraph();
        });
        function resetGraph() {
            d3.select('h1').html = '';
            zoom.scale(1);
            zoom.translate([margin.left, margin.top]);
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
                })
                .attr('r', function(d){return d.r});

            linkEnter.transition()
                .duration(duration)
                .attr('d', function (d) {
                    var diagonal = [
                        "M", d.source.cx, d.source.cy,
                        "A", innerH, innerH, 0, 0, 1, d.target.cx, d.target.cy
                    ].join(" ");
                    return diagonal;
                })
                .each(function(d){
                    var source,target;
                    source = d.source._id;
                    target = d.target._id;
                    var test = this;
                        d3.select(test).classed(source, true);
                        d3.select(test).classed(target, true);
                        d3.select(test).classed('opaque', false);
                })




        }

        transitionGraphElements()

    }

//
}
d3graphv2();

