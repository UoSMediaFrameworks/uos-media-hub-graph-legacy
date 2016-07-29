var socket = io("http://uos-mediahub.azurewebsites.net/", {forceNew: true});
var roomId;
var drawn = false;
var cityColors = [
    [239, 92, 84],
    [149, 110, 173],
    [232, 138, 46],
    [153, 160, 144],
    [255, 198, 48],
    [24, 152, 211],
    [165, 206, 94],
    [29, 182, 180],
    [110, 193, 127],
    [147, 47, 92]
]
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


    var height, width, svg, root, diagonal, nodeCollection, edgeCollection, duration, zoom;
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

    var longClickTitle;
    var shortClickTitle;
    var longClickedLink;
    var longClicked;
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
                obj.color = 'white';
                root.nodes.push(obj)
            })
        }


        function processsEdges() {
            root.nodes.forEach(function (node) {
                node.parentRelationshipIds.forEach(function (parent) {
                    var parentObj = _.find(root.nodes, function (obj) {
                        return obj._id == parent;
                    });
                    if (parentObj != undefined)
                        root.edges.push({source: parentObj, target: node})
                    parentObj.children.push(node);
                    node.parents.push(parentObj);
                })

            })
        }

        processNodes(data);
        //processScenes();
        processsEdges();
    }


    initialize(rootData);
    if (!redraw) {
        draw(root, false);
    } else {
        draw(root, true);
    }

    var cleanTitle = function (title) {
        return title.replace(/([a-z])([A-Z0-9])(?=[a-z])/g, '$1 $2').replace('GUIscene', 'scene').replace(/(scene|chicago|beijing)?\s(.*)?/i, '<sup>$1</sup><span class="$1">$2</span>');
    };

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

    function contextualize(el, d,type) {
        ga('send', 'event', {
            eventCategory: 'node',
            eventAction: type,
            eventLabel: null,
            eventValue:null,
            fieldsObject:{name:d.name,type: d.type}
        });
        console.log('long touch')
        var clean_name = cleanTitle(d._id);
        var scale = 1;
        var radius = 0;


        radius = innerH / 5;
        $("#reset-new2").click();

        //cluster(el, radius, true);
        d.related = _.union(d.children, d.parents);
        hover(d.related);
        clusterHighlight(el, d);
        d3.select('h1').html(clean_name);

        var list = [];
        if (d.type !== "scene") {
            list = nodes(d.children, list);
        } else {
            list.push(d._id);
        }

        list = dedupeNodeList(list);

        socket.emit('sendCommand', roomId, 'showScenes', list);
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
        array = array.splice(index, 1);
        return obj;
    }

    function cluster(el, radius, recurse) {
        d3.select(el).attr('r', function (d) {
            return d.r * 1.5;
        }).each(function (d) {

            var cx = d.cx;
            var cy = d.cy;
            var testArr = [];
            var filteredEdges = [];
            if (d.type == 'root') {
                //console.log('root')
                filteredEdges = _.filter(d.related, function (item) {
                    return item.type == 'subgraphtheme';
                })
            } else if (d.type == 'city') {
                //console.log('city')
                filteredEdges = _.filter(d.related, function (item) {
                    return item.type != 'root';
                })
            } else {
                console.log('Type: ' + d.type)
                filteredEdges = _.filter(d.related, function (item) {
                    return item.type != 'root';
                })
            }

            console.log(d.related);
            console.log(filteredEdges);
            while (testArr.length < 12) {
                var node = pluckArray(filteredEdges);
                if (node == undefined && filteredEdges.length == 0) {
                    break;
                } else if (node == undefined && filteredEdges.length > 0) {
                    console.log('node not found')
                } else {
                    testArr.push(node)
                }
            }
            console.log(testArr.length);

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
        console.log(nodeCollection)
        var test = _.find(nodeCollection[0], function (obj) {
            return obj.__data__ == node;
        })
        d3.select(test).transition()
            .duration(duration)
            .attr('r', function (d) {
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

    function tap(el, d,type) {
        ga('send', 'event', {
            eventCategory: 'node',
            eventAction: type,
            eventLabel: null,
            eventValue:null,
            fieldsObject:{name:d.name,type: d.type}
        });
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
    function draw(processedData, redraw) {

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
                    return tap(el, d,'touch');
                } else if (type == 'longtouch') {
                    return contextualize(el, d,'long-touch');
                }
            }).on('click', function (d) {
                return tap(this, d,'click');
            }).on('dblclick', function (d) {
                return contextualize(this, d,'double-click');
            });

        longClickTitle = nodeContainer.append('text').attr('fill', 'white');
        shortClickTitle = nodeContainer.append('text').attr('fill', 'white');

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

        //function gameLoop() {
        //    setTimeout(gameLoop, 1000 / 60);
        //    d3.select('h1').html(fps.getFPS());
        //}

        //gameLoop();
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
                    d.r = 8;
                    return d.r
                })
                .attr('fill', 'white');
        }


        //sceneNodes.attr("hidden", true);

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
            }).style('fill', function (d, i) {
            d.color = cityColors[i];
            return d3.rgb(d.color[0], d.color[1], d.color[2]);
        });

        var gThemeNodes = nodeEnter.filter(function (d) {
            return d.type == "subgraphtheme";
        });
        gThemeNodes.style('fill', d3.rgb(111, 115, 125))
            .attr('x',function(d){
            d.x = d.x - margin.left;
            return d.x
        }).attr('y',function(d){
            d.y = d.y - margin.top;
            return d.y
        });

        var sThemeNodes = nodeEnter.filter(function (d) {
            return d.type == "theme";
        });

        sThemeNodes.style('fill', function (d) {
            var cityParent = _.find(d.parents, function (item) {
                return item.type == 'city';
            });
            return d3.rgb(cityParent.color[0], cityParent.color[1], cityParent.color[2]);
        }).attr('x',function(d){
            d.x = d.x - margin.left;
            return d.x
        }).attr('y',function(d){
            d.y = d.y - margin.top;
            return d.y
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
                d.r = 18;
                return d.r;
            }).style('fill', 'url(#radial-gradient)');

        var sceneNodes = nodeEnter.filter(function (d) {
            return d.type == 'scene'
        });
        sceneNodes.style('fill', 'yellow').attr('x',function(d){
            d.x = d.x - margin.left;
            return d.x
        }).attr('y',function(d){
            d.y = d.y - margin.top;
            return d.y
        });

        d3.select('#openViewer').on('click', function () {
            window.open('http://uos-sceneeditor.azurewebsites.net/manifest2015.html?room=' + roomId);
        });

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
                })


        }

        transitionGraphElements()

    }

//
}
function loadData() {
    var sceneId = '579a2186792e8b3c827d2b15';

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

    socket.on('connect', function (thing) {

        socket.emit('auth', {password: 'kittens'}, function (err, token, serverRoomId) {
            if (err) {
                console.log(err)
            } else {
                console.log(token)
                fullRoomId = serverRoomId;
                roomId = serverRoomId.substr(2);
            }
            sceneId = getQueryVariable("id") || sceneId;
            socket.emit('loadSceneGraph', sceneId, function (err, sceneGraph) {
                if (err || !sceneGraph) {
                    console.log(err)
                    console.log('Couldn\'t load requested scene graph, reload the page and try again');
                } else {
                    console.log(sceneGraph);
                    if (drawn) {
                        d3graphv2(sceneGraph.nodeList, true);
                    } else {
                        d3graphv2(sceneGraph.nodeList, false);
                        drawn = true
                    }
                }
            });
        });
    });
}
loadData();

