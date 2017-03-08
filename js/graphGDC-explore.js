/**
 * Created by Angel.P on 28/11/2016.
 */
/*
 GDC graph constructor
 */
function GlobalDigitalCityGraphExploration(properties) {

    this.nodeContainer = properties.nodeContainer;
    this.linkContainer = properties.linkContainer;
    this.innerW = properties.innerW;
    this.innerH = properties.innerH;
    this.duration = properties.duration;
    this.height = properties.height;
    this.width = properties.width;
    this.margin = properties.margin;
    this.zoom = properties.zoom;
    this.graphId = properties.sceneId;
    this.roomId = properties.roomId;
    this.shortClickTitle = "";
    this.nodeEnter = [];
    this.linkEnter = [];
    this.availableScenes = [];
    this.breadcrumbs = [];
    this.breadcrumbsList = [];
    this.waitTime = 300000;
    this.inactivityTimer;
    this.hoverTimeout;
    this.internalHoverTimeout;
    this.switchTime = 7000;

    //Reference to the GDC Graph object's values
    var self = this;
    //Colors for the city nodes RGB-format
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

    //This is the function containing all drawing instructions and internal behaviour
    //
    this.draw = function (processedData) {

        //This is a local value to store the previous time that and event happened
        //for this instance of the graph.
        var before;

        //This variable will stop the graph from recording the click events done by
        //The breadcrumbsPlayout
        var replaying = false;

        //
        self.breadcrumbsList = Lockr.get(self.graphId + " breadcrumbsList") || [];
        self.breadcrumbsList.push({breadcrumbs: []});

        var nodeCollection = self.nodeContainer.selectAll('circle').data(processedData.nodes);
        var linkCollection = self.linkContainer.selectAll('path').data(processedData.links);
        var overlappingElementsCounter = 0;
        self.longClickTitle = self.nodeContainer.append('text').attr('fill', 'white');
        self.shortClickTitle = self.nodeContainer.append('text').attr('fill', 'white');

        self.nodeEnter = nodeCollection.enter().append('circle')
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


        self.linkEnter = linkCollection.enter().append('path')
            .attr('d', function (d) {
                var diagonal = [
                    "M", d.source.cx, d.source.cy,
                    "A", self.innerH, self.innerH, 0, 0, 1, d.target.cx, d.target.cy
                ].join(" ");
                return diagonal;
            })
            .classed("hidden-path", true);


        function circle(nodeArr) {
            nodeArr
                .attr('x', function (d) {
                    //d.x = width / 2 + (Math.random() * width / 2) * ((Math.random() > 0.5) ? -1 : 1);
                    d.x = Math.random() * self.width;
                    return d.x
                })
                .attr('y', function (d) {
                    //d.y = height / 2 + (height / 2 * Math.random() * ((Math.random() > 0.5) ? -1 : 1));
                    d.y = Math.random() * self.height;
                    return d.y
                })
                .attr('r', function (d) {
                    d.r = 12;
                    return d.r
                })
                .attr('fill', 'white');
        }

        var rootNodes = self.nodeEnter.filter(function (d) {
            return d.type == 'root'
        });

        rootNodes.attr('x', function (d, i) {
            d.x = ((self.innerW / rootNodes[0].length) / 2) * i + self.innerW / rootNodes[0].length;
            d._x = d.x;
            return d.x
        })
            .attr('y', function (d) {
                d.y = self.innerH - self.innerH / 2;
                d._y = d.y;
                return d.y;
            })
            .attr('r', function (d) {
                d.r = 18;
                return d.r;
            }).style('fill', 'url(#radial-gradient)');

        var cityNodes = self.nodeEnter.filter(function (d) {
            return d.type == "city";
        });

        var angle = (2 * Math.PI) / cityNodes[0].length;
        cityNodes
            .attr('r', function (d) {
                d.r = 16;
                return d.r;
            })
            .attr('y', function (d, i) {
                d.y = (Math.sin(angle * i) * self.innerH / 2) + d.cy;
                if (d.y == 0) {
                    d.y = d.y + d.r * 2;
                }
                if (d.y == self.innerH) {
                    d.y = d.y - d.r * 2;
                }
                d._y = d.y;
                return d.y;
            })
            .attr('x', function (d, i) {
                d.x = (Math.cos(angle * i) * self.innerW / 2) + d.cx;
                if (d.x == 0) {
                    d.x = d.x + d.r * 2;
                }
                if (d.x == self.innerW) {
                    d.x = d.x - d.r * 2;
                }
                d._x = d.x;
                return d.x;
            }).style('fill', function (d, i) {
            if (i >= cityColors.length) {
                d.color = [
                    0, 0, 0
                ];
                return d3.rgb(0, 0, 0);
            } else {
                d.color = cityColors[i];
                return d3.rgb(d.color[0], d.color[1], d.color[2]);
            }
        });

        var nonStaticNodes = self.nodeEnter.filter(function (d) {
            return d.type != "city" && d.type != "root";
        });

        nonStaticNodes.attr('x', function (d) {
            d.x = d.x - self.margin.left;
            d._x = d.x;
            return d.x
        }).attr('y', function (d) {
            d.y = d.y - self.margin.top;
            d._y = d.y;
            return d.y;
        }).classed('hidden-circle', true);


        var gThemeNodes = self.nodeEnter.filter(function (d) {
            return d.type == "subgraphtheme";
        });
        gThemeNodes.style('fill', d3.rgb(111, 115, 125)).attr('r', function (d) {
            d.r = getRandomInt(4, 6);
            d._r = d.r;
            return d.r;
        });


        var sThemeNodes = self.nodeEnter.filter(function (d) {
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
                d.r = getRandomInt(3, 5);
                d._r = d.r;
                return d.r;
            });


        var sceneNodes = self.nodeEnter.filter(function (d) {
            return d.type == 'scene'
        });
        sceneNodes.style('fill', 'yellow').attr('r', function (d) {
            d.r = getRandomInt(2, 4);
            d._r = d.r;
            return d.r;
        }).each(function (d) {
            self.availableScenes.push(d.name);
        });
        // console.log(self.availableScenes);


        $("#tags").autocomplete({
            source: [self.availableScenes],
            limit: 5
        });
        $("#tags").keyup(function (key) {
            if (key.which === 13) {
                var element = _.find(self.nodeEnter[0], function (obj) {

                    return obj.__data__.name == $("#tags").val();
                });
                //console.log(element)
                element.dispatchEvent(new Event('dblclick'));
            }
        });
        //This function will check the distance between both nodes
        function distance(a, b) {
            var dx, dy;
            //console.log(a.r, b.r)
            if (b.type == 'city' || b.type == 'root') {
                dx = b.x - a.x;
                dy = b.y - a.y;
            } else {
                dx = a.x - b.x;
                dy = a.y - b.y;
            }
            var separation = Math.sqrt(dx * dx + dy * dy) - (a.r + b.r);
            var angleDegA = Math.atan2(a.y - b.y, a.x - b.x);
            var angleDegB = Math.atan2(b.y - a.y, b.x - a.x);
            //console.log(Math.floor(math),dx,dy);
            if (separation < 10) {
                overlappingElementsCounter++;
                if (b.type == 'city' || b.type == 'root') {
                    //console.log("B:type", b.type)
                    var x = (Math.cos(angleDegA) * (b.r + 10)) + a.x;
                    var y = (Math.sin(angleDegA) * (b.r + 10)) + a.y;
                    moveNode(a, x, y, "optimize");
                } else {
                    //console.log("A:type", a.name)
                    var x = (Math.cos(angleDegB) * (a.r + 10)) + b.x;
                    var y = (Math.sin(angleDegB) * (a.r + 10)) + b.y;
                    //An alternative function to move node will be added this is a placeholder
                    moveNode(b, x, y, "optimize");
                }
            }

        }

        function clearOverlap() {
            overlappingElementsCounter++;
            while (overlappingElementsCounter > 0) {
                compareElements(self.nodeEnter[0]);
            }
        }

        function moveNode(node, positionX, positionY, type) {
            var ratio = 1 - Math.pow(1 / self.duration, 5);
            var data = _.find(nodeCollection[0], function (obj) {
                return obj.__data__ == node;
            });
            d3.select(data).attr("pointer-events", "none").transition()
                .duration(self.duration)
                .attr('r', function (d) {
                    if (type == "cluster") {
                        return d.r < 10 ? 10 : d.r * 1.5
                    } else {
                        return d.r;
                    }
                })
                .attr('cx', function (d) {
                    var cx = d.cx;
                    if (ratio >= 1) {
                        d.cx = positionX;
                        d.x = d.cx;
                    } else {
                        d.cx = ratio * (positionX - cx) + cx;
                        d.x = d.cx;
                    }
                    if (type == "optimize") {
                        d._x = d.cx
                    }
                    return d.cx;
                })
                .attr('cy', function (d) {
                    var cy = this.cy;
                    if (ratio >= 1) {
                        d.cy = positionY;
                        d.y = d.cy;
                    } else {
                        d.cy = ratio * (positionY - cy) + cy;
                        d.y = d.cy;
                    }
                    if (type == "optimize") {
                        d._y = d.cy
                    }
                    return d.cy;
                })
                .each("end", function () {
                    d3.select(this).attr("pointer-events", null);
                });
            ;

            //Find all relationships/edges/paths based on the current node be it source or target.
            var links = linkCollection.filter(function (item) {
                return item.source == node || item.target == node;
            });
            //Updating the position and arc of the line's
            links.attr("pointer-events", "none").transition()
                .duration(self.duration)
                .attr('d', function (d) {
                    //This functions builds up an arc based on some values.
                    var diagonal = [
                        "M", d.source.cx, d.source.cy,
                        "A", self.innerH, self.innerH, 0, 0, 1, d.target.cx, d.target.cy
                    ].join(" ");
                    return diagonal;
                })
                .each("end", function () {
                    d3.select(this).attr("pointer-events", null);
                });
            ;
        }

        //This function applies a highlighting class to edges leading to related nodes based on the behaviour requirements
        //defined by the if else statements


        //This function highlights elements based on a normal click or single tap of a node.

        function highlight(el, d) {

            d3.select('.highlight').classed('highlight', false);

            d3.selectAll('.highlightedLink').classed('highlightedLink', false);


            var filteredEdges;
            if (d.type == 'root') {
                filteredEdges = _.filter(linkCollection[0], function (item) {
                    return item.__data__.source.type == 'city' || item.__data__.target.type == 'city';
                })
            } else if (d.type == 'city') {
                filteredEdges = _.filter(linkCollection[0], function (item) {
                    return item.__data__.source.type != 'root';
                })
            } else {
                filteredEdges = linkCollection[0]
            }
            d3.select(el).classed('highlight', true);
            var links = _.filter(filteredEdges, function (item) {
                return item.__data__.source == d || item.__data__.target == d;
            });

            d3.selectAll(links).classed('highlightedLink', true);
            d3.selectAll(links).classed('visible-path', true);
        }

        //This function is the single click / tap  behaviour
        // It is meant to: highlight the current node, and its relationships
        // and show the name of the clicked element.
        // the highlighting will fade away in half a second after selection
        function getTimeDifference() {
            var now, diff;
            now = moment(new Date());

            if (before == undefined) {
                before = now;
                diff = 0;
            }
            if (before != now) {
                diff = now.diff(before, 'milliseconds');
                before = now;
            }
            return diff;
        }

        function tap(el, d) {

            ga('send', 'event', {
                eventCategory: 'node',
                eventAction: "tap",
                eventLabel: 'Type: ' + d.type + ', Name: ' + d.name,
                eventValue: null,
                fieldsObject: {name: d.name, type: d.type}
            });
            if (!replaying) {
                var diff = getTimeDifference();
                self.breadcrumbs.push({
                    node: d._id,
                    event: "tap",
                    difference: diff
                });
                var index = (self.breadcrumbsList.length - 1 >= 0) ? self.breadcrumbsList.length - 1 : 0;
                self.breadcrumbsList[index] = {breadcrumbs: self.breadcrumbs};
                Lockr.set(self.graphId + " breadcrumbsList", self.breadcrumbsList);

            }
            var filteredNodes = [];
            d.related = _.union(d.children, d.parents);
            if (d.type == 'root') {
                //console.log('root')
                filteredNodes = _.filter(d.related, function (item) {
                    return item.type == 'subgraphtheme';
                })
            } else if (d.type == 'city') {
                //console.log('city')
                filteredNodes = _.filter(d.related, function (item) {
                    return item.type != 'root' && item.type != 'city';
                })
            } else {
                //console.log('Type: ' + d.type)
                filteredNodes = _.filter(d.related, function (item) {
                    return item.type != 'root' && item.type != 'city';
                })
            }

            filteredNodes.forEach(function (node) {
                var element = _.find(self.nodeEnter[0], function (obj) {
                    return obj.__data__ == node;
                });
                d3.select(element).classed("hidden-circle", false);
                d3.select(element).classed("shown-circle", true);
            });
            // d3.selectAll(filteredNodes).classed("hidden-circles", false);
            // d3.selectAll(filteredNodes).classed("shown-circles", true);

            self.longClicked = d3.select('.longHL');
            self.longClickedLink = d3.selectAll('.longLinkHL');

            self.longClicked.classed('longHL', false);
            self.longClickedLink.classed('longLinkHL', false);
            self.shortClickTitle
                .attr('y', function () {
                    return d.cy < self.innerH / 2 ? d.cy - (el.r.animVal.value * 2 + 5) : d.cy + (el.r.animVal.value * 2 + 5)
                })
                .attr('x', function () {
                    return d.cx < self.innerW / 2 ? d.cx - (el.r.animVal.value * 2 + 5) : d.cx + (el.r.animVal.value * 2 + 5)
                })
                .attr('text-anchor', 'middle')
                .style("opacity", "1")
                .text(function () {
                    return d.name
                }).moveToFront();

            clearTimeout(self.timeout);
            //This timeout will temporarily, remove any long click highlights  and then re-add them after a delay
            self.timeout = setTimeout(function () {
                d3.select(el).classed('highlight', false);
                d3.selectAll('.highlightedLink').classed('highlightedLink', false);
                d3.select('h2').style("opacity", "0");
                self.longClicked.classed('longHL', true);
                self.longClickedLink.classed('longLinkHL', true);
                self.shortClickTitle.style("opacity", "0");
            }, 5000);
            highlight(el, d)
        }

        var cleanTitle = function (title) {
            return title.replace(/([a-z])([A-Z0-9])(?=[a-z])/g, '$1 $2').replace('GUIscene', 'scene').replace(/(scene|chicago|beijing)?\s(.*)?/i, '<sup>$1</sup><span class="$1">$2</span>');
        };
        //This is the hover over teaser functionality, it receives an array of nodes and with a set intervall will go through them unless it was changed.


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

        //Merge sort function
        function compareElements(array) {
            overlappingElementsCounter = 0;
            for (var i = 0; i < array.length; i++) {
                for (var k = i + 1; k < array.length; k++) {
                    if (array[k] == array[i]) {
                        break;
                    } else {
                        distance(array[i].__data__, array[k].__data__);
                    }
                }
            }

        }


        d3.select('#reset-origin').on('click', function () {
            resetGraphToOrigin();
        });

        function resetGraphToOrigin() {
            d3.select('h1').html = 'Shadow';
            self.zoom.scale(1);
            self.zoom.translate([self.margin.left, self.margin.top]);
            self.nodeContainer.attr("transform", "translate(" + self.zoom.translate() + ")scale(" + self.zoom.scale() + ")");
            transitionGraphElementsToOrigin();
        }

        function transitionGraphElementsToOrigin(node) {
            var ratio = 1 - Math.pow(1 / self.duration, 5);
            self.nodeEnter.attr("pointer-events", "none").transition()
                .duration(self.duration)
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
                    if (node != undefined && d._id == node._id) {
                        return 10;
                    }
                    return d.r;
                })
                .each("end", function () {
                    d3.select(this).attr("pointer-events", null);
                });
            ;

            self.linkEnter.attr("pointer-events", "none").transition()
                .duration(self.duration)
                .attr('d', function (d) {
                    var diagonal = [
                        "M", d.source.cx, d.source.cy,
                        "A", self.innerH, self.innerH, 0, 0, 1, d.target.cx, d.target.cy
                    ].join(" ");
                    return diagonal;
                })
                .attr("opacity", 0)
                .each(function (d) {
                    var source, target;
                    source = d.source._id;
                    target = d.target._id;
                    d3.select(this).classed(source, true);
                    d3.select(this).classed(target, true);
                    d3.select(this).classed('opaque', false);
                })
                .each("end", function () {
                    d3.select(this).attr("pointer-events", null);
                });
            ;


        }

        function cluster(el, radius) {
            d3.select(el).attr('r', function (d) {
                return 10;
            }).each(function (d) {
                //the related property contains both the children and the parents of the current element
                d.related = _.union(d.children, d.parents);

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

                //Triggering the hover teaser
                // hover(clusterArray);
                var total = clusterArray.length;
                //This part of the funcion defines the related  x and y positions for each node based on some geometrically calculated values

                clusterArray.forEach(function (child, index) {
                    //The radian is the angle that each node will be position on based on the amount of nodes in the cluster array.
                    var radian = (2 * Math.PI) * (index / total);
                    var x = (Math.cos(radian) * radius) + cx;
                    var y = (Math.sin(radian) * radius) + cy;
                    moveNode(child, x, y, "cluster");
                });


            })

        }

        function createSceneListList(d) {
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
            if(d.type != "theme"){
                socket.emit('sendCommand', self.roomId, 'showScenes', list);
            }else{
                var scoreList = {"play":{
                    "themes":[],
                    "scenes":[]
                }};
                scoreList.play.themes.push(d.name.toString());
                _.each(list,function(scene){
                    scoreList.play.scenes.push(scene.toString());
                });
                socket.emit('sendCommand', self.roomId, 'showScenesAndThemes', scoreList);
            }
        }

        function contextualize(el, d) {
            //Resets the graph to its initial state before proceeding with the clustering and highlighting.
            try {
                createSceneListList(d);
            } catch (e) {
                console.log("createSceneListList", e)
            }

            ga('send', 'event', {
                eventCategory: 'node',
                eventAction: "contextualize",
                eventLabel: 'Type: ' + d.type + ', Name: ' + d.name,
                eventValue: null,
                fieldsObject: {name: d.name, type: d.type}
            });
            if (!replaying) {
                var diff = getTimeDifference();
                self.breadcrumbs.push({
                    node: d._id,
                    event: "contextualize",
                    difference: diff
                });
                var index = (self.breadcrumbsList.length - 1 >= 0) ? self.breadcrumbsList.length - 1 : 0;
                self.breadcrumbsList[index] = {breadcrumbs: self.breadcrumbs};
                //  console.log(self.breadcrumbsList, self.breadcrumbsList.length);
                Lockr.set(self.graphId + " breadcrumbsList", self.breadcrumbsList);

            }

            var clean_name = cleanTitle(d.name);
            var scale = 1;
            var radius = self.innerH / 5;
            transitionGraphElementsToOrigin(d);
            //Triggers the position clustering
            cluster(el, radius);
            //Triggers the highlighting based on the clicked element.
            clusterHighlight(el, d);
            //Sets the name at the top of the screen to the clustered node.
            d3.select('h1').html(clean_name);


        }

        function clusterHighlight(el, d) {
            d3.select('.longHL').classed('longHL', false);
            d3.selectAll('.longLinkHL').classed('longLinkHL', false);
            var filteredEdges;
            if (d.type == 'root') {
                filteredEdges = _.filter(linkCollection[0], function (item) {
                    return item.__data__.source.type == 'subgraphtheme' || item.__data__.target.type == 'subgraphtheme';
                })
            } else if (d.type == 'city') {
                filteredEdges = _.filter(linkCollection[0], function (item) {
                    return item.__data__.source.type != 'root';
                })
            } else {
                filteredEdges = linkCollection[0]

            }
            d3.select(el).classed('longHL', true);
            var edges = _.filter(filteredEdges, function (item) {
                return item.__data__.source == d || item.__data__.target == d;
            });
            d3.selectAll(edges).classed('longLinkHL', true);
        }


        function playoutBreadcrumbs(breadcrumbs) {
            replaying = true;
            var time = 1000;
            _.forEach(breadcrumbs, function (value, i) {
                //console.log(time, value.difference);
                time += value.difference
                setTimeout(function () {
                    var data = _.find(nodeCollection[0], function (obj) {
                        return obj.id == value.node;
                    });
                    //console.log(value, data)
                    if (value.event == "tap") {
                        tap(data, data.__data__);
                    } else if (value.event == "contextualize") {
                        contextualize(data, data.__data__);
                    }
                    if (breadcrumbs.length - 1 == i) {
                        replaying = false;
                    }
                }, time);


            });
        }

        function hover(arraySelection) {
            var i = 0;
            clearInterval(self.hoverTimeout)
            self.hoverTimeout = setInterval(function () {
                if (i == arraySelection.length) {
                    i = 0;
                }
                var d = arraySelection[i];
                self.shortClickTitle
                    .attr('y', function () {
                        return d.cy < self.innerH / 2 ? d.cy - (d.r * 2 + 5) : d.cy + (d.r * 2 + 5)
                    })
                    .attr('x', function () {
                        return d.cx < self.innerW / 2 ? d.cx - (d.r * 2 + 5) : d.cx + (d.r * 2 + 5)
                    })
                    .attr('text-anchor', 'middle')
                    .style("opacity", "1")
                    .text(function () {
                        return d.name
                    }).moveToFront();
                i++;
            }, 2500);
        };

        /*
         Angel Petrov: This function  is a different take on the hover functionality including a contextualize event.
         It will trigger changes to the new random node and will provide the scenelist to the Scene Viewer
         */
        function randomHover(timeAdjustment) {
            clearInterval(self.internalHoverTimeout);
            self.internalHoverTimeout = setInterval(function () {

                var nodes = self.nodeEnter[0];
                var i = getRandomInt(0, nodes.length);
                var el = nodes[i];
                var d = el.__data__;
                contextualize(el, d);
                self.longClickTitle
                    .attr('y', function () {
                        return d.cy < self.innerH / 2 ? d.cy - el.r.animVal.value * 2 : d.cy + el.r.animVal.value * 2;
                    })
                    .attr('x', function () {
                        return d.cx < self.innerW / 2 ? d.cx - el.r.animVal.value * 2 : d.cx + el.r.animVal.value * 2;
                    })
                    .attr('text-anchor', 'middle')
                    .style("opacity", "1")
                    .text(function () {
                        return d.name
                    }).moveToFront();
            }, timeAdjustment)

        };

        /*
         Angel Petrov: this is an inactivity detector, by binding a reset timer to mose move and keypress any motion in regards
         to the graph will make it reset the timeout. Currently the default value to wait is 5 minutes.
         Which through an interface will be amendable, and the inactivity time will be toggle-able.
         */
        var initInactivityTime = function () {
            var insideSelf = this;
            insideSelf.inactivityTime = function () {
                window.onload = insideSelf.resetTimer;
                document.onclick = insideSelf.resetTimer;
            };

            insideSelf.resetTimer = function () {
                clearTimeout(self.hoverTimeout);
                clearTimeout(self.internalHoverTimeout);
                var enabled = $('#autowalk-enabled');
                if (enabled[0].checked) {
                    self.hoverTimeout = setTimeout(function () {
                        randomHover(self.switchTime)
                    }, self.waitTime)
                }

            };

        };

        var initiateAutowalk = function () {
            $('#autowalk-enabled').attr('checked', false);

            $('#autowalk-node-switch').val(self.switchTime / 1000);

            $('#autowalk-duration').val(self.waitTime / 1000);

            $('#set-settings').on("click", function () {

                var duration = $('#autowalk-duration');
                var enabled = $('#autowalk-enabled');
                var node_switch = $('#autowalk-node-switch');
                self.switchTime = node_switch.val() * 1000;
                self.waitTime = duration.val() * 1000;


                var value;
                console.log(enabled[0].checked)
                if (enabled[0].checked) {
                    value = true;
                    self.inactivityTimer.inactivityTime();
                } else {
                    value = false;
                    clearTimeout(self.hoverTimeout);
                    clearTimeout(self.internalHoverTimeout);
                    resetGraphToOrigin()
                };
                console.log(self.switchTime, self.waitTime, enabled[0].checked, value)
                enabled[0].checked = value;
            });
        };

        function exportBreadcrumbs() {
            console.log("exporting crumbs")
            var element = document.createElement('a');
            var content = self.breadcrumbsList = Lockr.get(self.graphId + " breadcrumbsList");

            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
            element.setAttribute('download', "gdc-graph-id-" + self.graphId + "-crumbs");

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }

        function breadcrumbs() {
            // call your function to do the thing
            var crumbs = Lockr.get(self.graphId + " breadcrumbsList");

            d3.select('#crumbs-container').selectAll("*").remove();
            d3.select('#crumbs-container').append("button").attr("id", "crmbs-clear-all").classed("btn btn-default", true).text("Remove All");
            d3.select('#crumbs-container').append("button").attr("id", "crmbs-export").classed("btn btn-default", true).text("Export");
            d3.select('#crmbs-clear-all').on('click', function () {
                console.log(self.graphId + " breadcrumbsList");
                Lockr.rm(self.graphId + " breadcrumbsList");

            });
            d3.select('#crmbs-export').on('click', function () {
                exportBreadcrumbs();
            });
            if (crumbs) {
                var container = d3.select('#crumbs-container')
                    .selectAll("div")
                    .data(crumbs).enter().append("div").classed("crumbs", true);

                var infoContainer = container.append("div").classed("controls col-sm-2", true);

                infoContainer.append("p").text(function (d, i) {
                    return "breadcrumbs " + i;
                });

                var buttonsContainer = infoContainer.append("div").classed("buttons col-sm-12", true);

                buttonsContainer.append("div").classed("col-sm-6", true)
                    .append("i").classed("fa fa-play", true)
                    .on("click", function (d, i) {
                        playoutBreadcrumbs(crumbs[i].breadcrumbs)
                    });
                buttonsContainer.append("div").classed("col-sm-6", true)
                    .append("i").classed("fa fa-times", true)
                    .on("click", function (d, i) {
                        crumbs.splice(i, 1);
                        Lockr.set(self.graphId + " breadcrumbsList", crumbs);
                        breadcrumbs();
                    });
                var ul = container.append("ul").classed("col-sm-10", true);

                ul.each(function (crumb, index) {
                    var br = d3.select(this).selectAll("li").data(crumb.breadcrumbs).enter()
                        .append("li");

                    br.append("a")
                        .text(function (d) {
                            return d.node + "." + d.event
                        })
                        .append("i").classed("fa fa-times", true).on("click", function (d, i) {
                        crumbs[index].breadcrumbs.splice(i, 1);
                        Lockr.set(self.graphId + " breadcrumbsList", crumbs);
                        breadcrumbs();
                    });
                });
            }
        };

        d3.select('#bc-toggle').on('click', function () {

            var cc = $('#crumbs-container');
            if (cc.is(":visible")) {
                cc.hide();
            } else {
                breadcrumbs();
                cc.show();
            }

        });
        initiateAutowalk();
        self.inactivityTimer = new initInactivityTime();
        self.inactivityTimer.inactivityTime();
        transitionGraphElementsToOrigin();
        clearOverlap();
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    function pluckArray(array) {
        //console.log('arr size ' + array.length)
        var index = getRandomInt(0, array.length);
        //console.log('Rand index ' + index)
        var obj = array[index];
        //console.log(obj)
        array = array.splice(index, 1);
        return obj;
    };


}