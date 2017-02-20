/**
 * Created by Angel.P on 28/11/2016.
 */
function MemoirGraph(properties) {
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
    this.graphId = properties.sceneId;
    this.hoverTimeout = null;
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
    var self = this;
   // console.log(this)
    d3.select('#reset-new2').on('click', function (e) {
        resetGraphToOrigin();
    });


    this.draw = function (processedData) {
        var before;
        var replaying = false;
        //console.log(processedData);
        var nodeCollection = self.nodeContainer.selectAll('circle').data(processedData.nodes);
        var linkCollection = self.linkContainer.selectAll('path').data(processedData.links);
        self.shortClickTitle = self.nodeContainer.append('text').attr('fill', 'white');

        self.breadcrumbsList = Lockr.get(self.graphId + " breadcrumbsList") || [];
        self.breadcrumbsList.push({breadcrumbs: []});

        this.nodeEnter = nodeCollection.enter().append('circle')
            .attr('cy', function (d) {
                console.log(d)
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
            }).classed("shown-circle", true);


        this.linkEnter = linkCollection.enter().append('path')
            .attr('d', function (d) {
                var diagonal = [
                    "M", d.source.cx, d.source.cy,
                    "A", self.innerH, self.innerH, 0, 0, 1, d.target.cx, d.target.cy
                ].join(" ");
                //console.log(diagonal)
                return diagonal;
            })
            .attr('class', function (d) {
                return 'opaque';
            }).classed("visible-path", true);;

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
                    d.r = 2;
                    return d.r
                })
                .attr('fill', 'white');
        }

        var rootNodes = this.nodeEnter.filter(function (d) {
            return d.type == 'root'
        });

        rootNodes.attr('x', function (d, i) {
                d.x = self.innerW / 2;
                d._x = d.x;
                return d.x
            })
            .attr('y', function (d) {
                d.y = self.innerH / 2;
                d._y = d.y;
                return d.y;
            })
            .attr('r', function (d) {
                d.r = 18;
                return d.r;
            });

        var chapterNodes = this.nodeEnter.filter(function (d) {
            return d.type == "chapter";
        });

        chapterNodes
            .attr('r', function (d) {
                d.r = 16;
                return d.r;
            })
            .attr("x", function (d, i) {
                var radian = ((2 * Math.PI) * i / chapterNodes[0].length) - 1.5708;
                d.x = (Math.cos(radian) * self.innerH / 2) + self.innerW / 2;
                d._x = d.x;
                return d.x;
            })
            .attr("y", function (d, i) {
                var radian = ((2 * Math.PI) * i / chapterNodes[0].length) - 1.5708;
                d.y = (Math.sin(radian) * self.innerH / 2) + self.innerH / 2;
                d._y = d.y;
                return d.y;
            });
        var sceneNodes = self.nodeEnter.filter(function (d) {
            return d.type == 'scene'
        });
        sceneNodes.each(function (d) {
            self.availableScenes.push(d.name);
        });
        sceneNodes.attr("opacity","0");
        var otherNodes = this.nodeEnter.filter(function (d) {
            return d.type != "chapter" && d.type != "root";
        });

        otherNodes.attr('r', function (d) {
                d.r = 6;
                return d.r;
            })
            .attr('x', function (d, index) {
                d.x = self.innerW / otherNodes[0].length * index;
                d._x = d.x;
            })
            .attr('y', function (d, index) {

                d.y = self.innerH / otherNodes[0].length * index;

                d._y = d.y;
            });


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

        };
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
        function getTimeDifference() {
            // console.log(before)
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
            // console.log("before", before)
            // /console.log("diff", diff)
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
                //console.log(self.breadcrumbsList, self.breadcrumbsList.length);
                Lockr.set(self.graphId + " breadcrumbsList", self.breadcrumbsList);

            }
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

            highlight(el, d)
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

        //This function transitions the elements to their initial positions
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
                    //console.log(d)
                    var diagonal = [
                        "M", d.source.cx, d.source.cy,
                        "A", self.innerH, self.innerH, 0, 0, 1, d.target.cx, d.target.cy
                    ].join(" ");
                    //console.log(diagonal)
                    return diagonal;
                })
                .each(function (d) {
                    var source, target;
                    source = d.source._id;
                    target = d.target._id;
                    var link = this;
                    d3.select(link).classed(source, true);
                    d3.select(link).classed(target, true);
                    d3.select(link).classed('opaque', false);
                });
        }

        self.nodeEnter.order();
        function randomHover(timeAdjustment) {
            console.log("1", self.internalHoverTimeout)
            clearInterval(self.internalHoverTimeout);
            console.log("2", self.internalHoverTimeout)
            toastr.info("Autowalk has started")
            self.internalHoverTimeout = setInterval(function () {

                var nodes = self.nodeEnter[0];
                var i = getRandomInt(0, nodes.length);
                var el = nodes[i];
                var d = el.__data__;
                tap(el, d);
                self.shortClickTitle
                    .attr('y', function () {
                        return d.cy < self.innerH / 2 ? d.cy - d.r * 2 : d.cy + d.r * 2;
                    })
                    .attr('x', function () {
                        return d.cx < self.innerW / 2 ? d.cx - d.r * 2 : d.cx + d.r * 2;
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
                document.onmousemove = insideSelf.resetTimer;
                document.onkeypress = insideSelf.resetTimer;
            };

            insideSelf.resetTimer = function () {
                clearTimeout(self.hoverTimeout);
                clearTimeout(self.internalHoverTimeout);
                var enabled = $('#autowalk-enabled');
                if (enabled[0].checked) {
                    randomHover(self.switchTime);
                    self.hoverTimeout = setTimeout(function () {
                        randomHover(self.switchTime)
                    }, self.waitTime)
                }

            };

        };

        var initiateAutowalk = function () {
            $('#autowalk-enabled').attr('checked', false);

            $('#autowalk-node-switch').val(self.switchTime/1000);

            $('#autowalk-duration').val(self.waitTime/1000);

            $('#set-settings').on("click", function () {

                var duration = $('#autowalk-duration');
                var enabled = $('#autowalk-enabled');
                var node_switch = $('#autowalk-node-switch');
                self.switchTime = node_switch.val()*1000;
                self.waitTime = duration.val()*1000;


                var value;
                if (enabled[0].checked) {
                    value = true;
                    self.inactivityTimer.inactivityTime();
                } else {
                    value = false;
                    clearTimeout(self.hoverTimeout);
                    clearTimeout(self.internalHoverTimeout);
                    resetGraphToOrigin()
                }
                ;
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


        function playoutBreadcrumbs(breadcrumbs) {
            replaying=true;
            var time = 1000;
            _.forEach(breadcrumbs, function (value,i) {
                // console.log(time)
                time += value.difference
                setTimeout(function () {
                    var data = _.find(nodeCollection[0], function (obj) {
                        return obj.id == value.node;
                    });
                    if (value.event == "tap") {
                        tap(data, data.__data__);
                    }
                    if(breadcrumbs.length-1 == i){
                        replaying = false;
                    }
                }, time);

            });
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
        //This function initializes the autocomplete input with autocompletion
        transitionGraphElementsToOrigin()

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
};