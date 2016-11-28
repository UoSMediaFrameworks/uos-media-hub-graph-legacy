/**
 * Created by Angel.P on 28/11/2016.
 */
function GlobalDigitalCityGraph(properties) {
    console.log(properties)
    this.nodeContainer = properties.nodeContainer;
    this.linkContainer = properties.linkContainer;
    this.innerW = properties.innerW;
    this.innerH = properties.innerH;
    this.duration = properties.duration;
    this.height = properties.height;
    this.width = properties.width;
    this.margin = properties.margin;
    this.zoom = properties.zoom;
    this.shortClickTitle = "";
    this.nodeEnter = [];
    this.linkEnter = [];
    this.availableScenes = [];
    var self = this;
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
        [198, 235, 116],
    ];
    console.log(this)

    this.draw = function (processedData) {
        console.log(processedData);
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
            .attr('class', function (d) {
                return 'opaque';
            });


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
            //d.y = innerH - innerH / 2;
            d._y = d.y;
            return d.y;
        });


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
            //console.log(nodeCollection)
            var data = _.find(nodeCollection[0], function (obj) {
                return obj.__data__ == node;
            });

            d3.select(data).transition()
                .duration(self.duration)
                .attr('r', function (d) {
                    //d.r * 1.5
                    if (type == "cluster") {
                        return 10
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
                });

            //Find all relationships/edges/paths based on the current node be it source or target.
            var links = linkCollection.filter(function (item) {
                return item.source == node || item.target == node;
            });
            //Updating the position and arc of the line's
            links.transition()
                .duration(self.duration)
                .attr('d', function (d) {
                    //This functions builds up an arc based on some values.
                    var diagonal = [
                        "M", d.source.cx, d.source.cy,
                        "A", self.innerH, self.innerH, 0, 0, 1, d.target.cx, d.target.cy
                    ].join(" ");
                    return diagonal;
                });
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
        }

        //This function is the single click / tap  behaviour
        // It is meant to: highlight the current node, and its relationships
        // and show the name of the clicked element.
        // the highlighting will fade away in half a second after selection
        function tap(el, d) {
            //console.log('tap')
            self.longClicked = d3.select('.longHL');
            self.longClickedLink = d3.selectAll('.longLinkHL');

            self.longClicked.classed('longHL', false);
            self.longClickedLink.classed('longLinkHL', false);

            self.shortClickTitle
                .attr('y', function () {
                    return d.cy < self.innerH / 2 ? d.cy - d.r * 2 : d.cy + d.r * 2
                })
                .attr('x', function () {
                    return d.cx < self.innerW / 2 ? d.cx - d.r * 2 : d.cx + d.r * 2
                })
                .attr("dy", ".35em")
                .attr('text-anchor', 'middle')
                .style("opacity", "1")
                .text(function () {
                    return d.name
                });

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


        }var cleanTitle = function (title) {
            return title.replace(/([a-z])([A-Z0-9])(?=[a-z])/g, '$1 $2').replace('GUIscene', 'scene').replace(/(scene|chicago|beijing)?\s(.*)?/i, '<sup>$1</sup><span class="$1">$2</span>');
        };
        //This is the hover over teaser functionality, it receives an array of nodes and with a set intervall will go through them unless it was changed.
        function hover(arraySelection) {
            var i = 0;
            clearInterval(self.hoverTimeout)
            self.hoverTimeout = setInterval(function () {
                if (i == arraySelection.length) {
                    i = 0;
                }
                var d = arraySelection[i];
                self.longClickTitle.attr('y', function () {
                        return d.cy < self.innerH / 2 ? d.cy - d.r * 2 : d.cy + d.r * 2
                    })
                    .attr('x', function (data) {
                        return d.cx < self.innerW / 2 ? d.cx - d.r * 2 : d.cx + d.r * 2
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
        d3.select('#openViewer').on('click', function () {
            window.open('http://uos-sceneeditor.azurewebsites.net/manifest2015.html?room=' + roomId);
        });

        d3.select('#reset-origin').on('click', function () {
            resetGraphToOrigin();
        });
        function resetGraphToOrigin() {
            d3.select('h1').html = '';
            self.zoom.scale(1);
            self.zoom.translate([self.margin.left, self.margin.top]);
            self.nodeContainer.attr("transform", "translate(" + self.zoom.translate() + ")scale(" + self.zoom.scale() + ")");
            transitionGraphElementsToOrigin();
        }
        function transitionGraphElementsToOrigin() {

            var ratio = 1 - Math.pow(1 / self.duration, 5);
            self.nodeEnter.transition()
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
                    return d.r
                });

            self.linkEnter.transition()
                .duration(self.duration)
                .attr('d', function (d) {
                    var diagonal = [
                        "M", d.source.cx, d.source.cy,
                        "A", self.innerH, self.innerH, 0, 0, 1, d.target.cx, d.target.cy
                    ].join(" ");
                    return diagonal;
                })
                .each(function (d) {
                    var source, target;
                    source = d.source._id;
                    target = d.target._id;
                    d3.select(this).classed(source, true);
                    d3.select(this).classed(target, true);
                    d3.select(this).classed('opaque', false);
                });
            clearOverlap();
        }

        function cluster(el, radius) {
            d3.select(el).attr('r', function (d) {
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
                //Triggering the hover teaser
                hover(clusterArray);
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

        function contextualize(el, d) {
            //console.log('long touch')
            //Resets the graph to its initial state before proceeding with the clustering and highlighting.

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

        transitionGraphElementsToOrigin();

    }

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