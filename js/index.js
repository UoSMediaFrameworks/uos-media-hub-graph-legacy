
'use strict';

String.prototype.format = function() {
var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
return this.replace(/{((?:\d+)|(?:[a-z]+))}/g, function(match, key) {
  return typeof args[key] != 'undefined' ? args[key] : match;
});
};

var socket  = null;
var graph   = null;
var layout  = null;
var request = new XMLHttpRequest();
var teaser  = 0; // represents the teaser timeout variable
var viewer = document.getElementById('viewer');
var roomId = null; // the unique id to pass to viewers for listening for events
var hoverer = function (index) {
var elem = graph.nodes[this[index]].element;
var h2 = document.querySelector('h2');

h2.style.top  = layout.coords.y + elem.cy.baseVal.value * layout.coords.z - 75 + 'px';
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

// Parses the different between how browsers can store a cookie that is just a key with no value
var getPasswordFromCookie = function(cookieVal) {
  if(cookieVal && cookieVal.indexOf("=") !== -1) {
    cookieVal = cookieVal.replace('=', '');
  }

  return cookieVal;
};

var password =  input.value || getPasswordFromCookie(document.cookie);

input.value = '';
input.placeholder = 'connecting';
var timeout = setInterval(function () {
  input.placeholder += '.';
}, 250);

socket = io(this.action, { forceNew: true });
socket.on('connect', function(thing) {
  socket.emit('auth', {password: password}, function (err, token, serverRoomId) {
    clearTimeout(timeout);
    if (err) {
      input.setAttribute('placeholder', err);
    } else {
      // In the event of a constant refresh scenario..
      if (this.querySelector('input[name=store]').checked) {
        document.cookie = password;
      }
      // Remove Form
      this.parentNode.removeChild(this);
      // Get the Graph XML
      request.send();
      // display the button to open the Viewer
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

var browser = function() {
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

if(browser() == 'Chrome')
{
   var head = document.getElementsByTagName('head')[0];

   var script = document.createElement('script');
   script.src = 'js/pathseg.js';
   script.type = 'text/javascript';

   head.appendChild(script)
}
var cleanTitle = function (title) {
return title.replace(/([a-z])([A-Z0-9])(?=[a-z])/g, '$1 $2').replace('GUIscene', 'scene').replace(/(scene|chicago|beijing)?\s(.*)?/i, '<sup>$1</sup><span class="$1">$2</span>');
};

var form = document.querySelector('form');
  form.addEventListener('submit', connect);
  form.querySelector('input[type=checkbox]').addEventListener('change', connect.bind(form));



request.open('GET', 'GDC_installation_GUI_Final_5.13.15.xml');
request.setRequestHeader("Content-Type", "text/xml");

request.onreadystatechange = function () {
if (request.readyState === 4) {
  if (request.status === 200) {


    graph  = new Graph(request.responseXML, document.getElementById('graph'));
    layout = new Layout(graph);

    layout.prefix.push('Chicago');
    layout.prefix.push('Beijing');

    layout.splits.push('City');
    layout.splits.push('Movement');
    layout.splits.push('People');

    layout.setup();
  } else {
    console.error(response);
  }
}
};

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
}



var SVG = function (node, options) {
options['xmlns:xlink'] = 'http://www.w3.org/1999/xlink';
options.xmlns = 'http://www.w3.org/2000/svg';
options.version = 1.1;
this.element = this.createElement('svg', options, node);
};

SVG.prototype.createElement = function(name, opt, parent) {
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
coords: {x: 0, y:0, z: 1 },
setup: function () {
  var width = this.graph.options.width, height = this.graph.options.height;

  for (var id in this.graph.nodes) {
    var node =  this.graph.nodes[id];
    var elem = node.element;
    var idx  = -1;

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
        return [
          ((width / this.splits.length) / 2) * idx + width / this.splits.length,
          height - height / 2
        ];
      }.bind(this, idx);

      elem.setAttribute('r', 16);
      continue;
    }


    if (! node.hasOwnProperty('getPlacement')) {
      node.getPlacement = function () {
        return [
           (width / 2) + (Math.random() * width / 2 ) * ((Math.random() > 0.5) ? -1 : 1),
          height / 2 + (height / 2 * Math.random() * ((Math.random() > 0.5) ? -1 : 1))
        ];
      }
    }
  }
  this.arrange(5000);
},
arrange: function (duration) {
  for (var id in this.graph.nodes) {
      this.moveNode(this.graph.nodes[id], this.graph.nodes[id].getPlacement(), Math.max(100, Math.random() * duration));
  }
},
cluster: function (node, key, radius, recurse, start) {
  var total = node[key].length;
  var cx = node.element.cx.baseVal.value;
  var cy = node.element.cy.baseVal.value;

  node[key].forEach(function (child, idx) {
    var node = this.graph.nodes[child];
    var elem = node.element;

    var radian = (2 * Math.PI) * (idx/total + (start || 0.5));
    var to = [(Math.cos(radian) * radius) + cx, (Math.sin(radian) * radius) + cy];
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

    var ratio = 1 - Math.pow(1 - (Date.now() - begin) / duration, 5); // float % animation complete
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
  document.querySelector('h1').innerHTML = message || '';
  this.panAndZoom({x: 0 , y: 0, z: 1});
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
drawEdgeConnections:  function (from) {
  from.children.forEach(function (id) {
    var to = this.nodes[id];

    var edge = this.viewBox.createElement('path', {
      'd': 'M0,0A{0},{0},0,0,1,100,100'.format(this.options.height),
      'class': 'opaque'
    }, this.edgeGroup);

    setTimeout(function () {
      edge.setAttribute('class', from.element.id + ' ' + to.element.id);
    }, Math.random() * 2000);

    if(browser() =='Chrome'){
        from.edges.push(edge.pathSegList._list[0]);
        to.edges.push(edge.pathSegList._list[1]);
    }else{
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
      zoom = Math.min(Math.pow(2,  Math.sqrt(64 / elem.r.baseVal.value)), 16);
      layout.cluster(node, 'children', Math.max(5, Math.min(Math.pow(node.element.r.baseVal.value, 1.5), (graph.options.height / 2.5) / zoom)), true);
    } else if (node.scenes.length > 0) {
      layout.cluster(node, 'scenes', 10, false);
      watch = node.scenes;
    } else if (node.wormholes.length > 0) {
      watch = node.wormholes;
      layout.cluster(node, 'wormholes', 15, false, 0);
      zoom = Math.min(Math.pow(2,  Math.sqrt(64 / elem.r.baseVal.value)), 16);
    } else if (node.parents.length > 0) {
      watch = node.parents;
      layout.cluster(node, 'parents', 64, false);
      zoom = 3;
    } else if (elem.classList.contains('guiscene')) {
      layout.reset(clean_name);
      socket.emit('sendCommand', roomId, 'showScenes', [{name: elem.id}]);

      return;
    } else {
      zoom = 1;
      watch = ['Chicago', 'Beijing', 'Movement', 'City', 'People'];
    }


    var panx = zoom == 1 ? 0 : (graph.options.width / 2) - elem.cx.baseVal.value * zoom;
    var pany = zoom == 1 ? 0 : (graph.options.height / 2) - elem.cy.baseVal.value * zoom + 50;

    this.clock.configure(watch.length, true);
    this.clock.subscribe('hoverer', hoverer.bind(watch));


    layout.panAndZoom({x: panx , y: pany, z: zoom});

    document.querySelector('h1').innerHTML = clean_name;


    // scenes mapped to this format [{name:'scene'}, {name:'otherscene}...]
    socket.emit('sendCommand', roomId, 'showScenes', scenes.map(function (scene) {
      return {'name': scene};
    }));

  } else if (evt.target.nodeName == 'path') {
    var connection = evt.target.classList;
    var from = graph.nodes[connection[0]].element;
    var to   = graph.nodes[connection[1]].element
    var dist = Math.sqrt(Math.pow(from.cx.baseVal.value - to.cx.baseVal.value, 2) + Math.pow(from.cy.baseVal.value - to.cy.baseVal.value, 2));
    console.log('distance between nodes', dist);
  } else {
    var zoom = layout.coords.z;

    var x = ((graph.options.width / 2 ) - evt.clientX) + layout.coords.x;
    var y = ((graph.options.height / 2) - evt.clientY) + layout.coords.y;
    layout.panAndZoom({x: x , y: y, z: zoom});
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

    var child   = nodes.item(0).getAttribute('IRI').substring(1);
    var parent  = nodes.item(1).getAttribute('IRI').substring(1);

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



if (document.cookie) {
// document.cookie;
form.querySelector('label').style.display = 'none';
var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("submit", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
form.dispatchEvent(evt);
}

