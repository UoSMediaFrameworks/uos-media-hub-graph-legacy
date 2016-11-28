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
    this.shortClickTitle = "";
    this.nodeEnter = [];
    this.linkEnter = [];
    this.availableScenes = [];
    var self = this;
    console.log(this)
    d3.select('#reset-new2').on('click', function (e) {
        resetGraphToOrigin();
    });


    this.draw = function (processedData) {
        console.log(processedData);
        var nodeCollection = self.nodeContainer.selectAll('circle').data(processedData.nodes);
        var linkCollection = self.linkContainer.selectAll('path').data(processedData.links);
        self.shortClickTitle = self.nodeContainer.append('text').attr('fill', 'white');

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
            });


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
        function highlight(el,d) {

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

        function tap(el, d) {
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
        //This function initializes the autocomplete input with autocompletion
        transitionGraphElementsToOrigin()

    };

};