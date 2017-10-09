var fabric = fabric || {
    version: "1.7.19"
};

if (typeof exports !== "undefined") {
    exports.fabric = fabric;
}

if (typeof document !== "undefined" && typeof window !== "undefined") {
    fabric.document = document;
    fabric.window = window;
    window.fabric = fabric;
} else {
    fabric.document = require("jsdom").jsdom(decodeURIComponent("%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E"));
    if (fabric.document.createWindow) {
        fabric.window = fabric.document.createWindow();
    } else {
        fabric.window = fabric.document.parentWindow;
    }
}

fabric.isTouchSupported = "ontouchstart" in fabric.window;

fabric.isLikelyNode = typeof Buffer !== "undefined" && typeof window === "undefined";

fabric.DPI = 96;

fabric.reNum = "(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)";

fabric.fontPaths = {};

fabric.iMatrix = [ 1, 0, 0, 1, 0, 0 ];

fabric.canvasModule = "canvas";

fabric.perfLimitSizeTotal = 2097152;

fabric.maxCacheSideLimit = 4096;

fabric.minCacheSideLimit = 256;

fabric.charWidthsCache = {};

fabric.devicePixelRatio = fabric.window.devicePixelRatio || fabric.window.webkitDevicePixelRatio || fabric.window.mozDevicePixelRatio || 1;

if (typeof JSON !== "object") {
    JSON = {};
}

(function() {
    "use strict";
    function f(n) {
        return n < 10 ? "0" + n : n;
    }
    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
            return this.valueOf();
        };
    }
    var cx, escapable, gap, indent, meta, rep;
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }
    function str(key, holder) {
        var i, k, v, length, mind = gap, partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
          case "string":
            return quote(value);

          case "number":
            return isFinite(value) ? String(value) : "null";

          case "boolean":
          case "null":
            return String(value);

          case "object":
            if (!value) {
                return "null";
            }
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === "[object Array]") {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null";
                }
                v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }
            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === "string") {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": " : ":") + v);
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": " : ":") + v);
                        }
                    }
                }
            }
            v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }
    if (typeof JSON.stringify !== "function") {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        };
        JSON.stringify = function(value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }
            } else if (typeof space === "string") {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }
            return str("", {
                "": value
            });
        };
    }
    if (typeof JSON.parse !== "function") {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function(text, reviver) {
            var j;
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({
                    "": j
                }, "") : j;
            }
            throw new SyntaxError("JSON.parse");
        };
    }
})();

if (typeof eventjs === "undefined") var eventjs = {};

(function(root) {
    "use strict";
    root.modifyEventListener = false;
    root.modifySelectors = false;
    root.configure = function(conf) {
        if (isFinite(conf.modifyEventListener)) root.modifyEventListener = conf.modifyEventListener;
        if (isFinite(conf.modifySelectors)) root.modifySelectors = conf.modifySelectors;
        if (eventListenersAgumented === false && root.modifyEventListener) {
            augmentEventListeners();
        }
        if (selectorsAugmented === false && root.modifySelectors) {
            augmentSelectors();
        }
    };
    root.add = function(target, type, listener, configure) {
        return eventManager(target, type, listener, configure, "add");
    };
    root.remove = function(target, type, listener, configure) {
        return eventManager(target, type, listener, configure, "remove");
    };
    root.returnFalse = function(event) {
        return false;
    };
    root.stop = function(event) {
        if (!event) return;
        if (event.stopPropagation) event.stopPropagation();
        event.cancelBubble = true;
        event.cancelBubbleCount = 0;
    };
    root.prevent = function(event) {
        if (!event) return;
        if (event.preventDefault) {
            event.preventDefault();
        } else if (event.preventManipulation) {
            event.preventManipulation();
        } else {
            event.returnValue = false;
        }
    };
    root.cancel = function(event) {
        root.stop(event);
        root.prevent(event);
    };
    root.blur = function() {
        var node = document.activeElement;
        if (!node) return;
        var nodeName = document.activeElement.nodeName;
        if (nodeName === "INPUT" || nodeName === "TEXTAREA" || node.contentEditable === "true") {
            if (node.blur) node.blur();
        }
    };
    root.getEventSupport = function(target, type) {
        if (typeof target === "string") {
            type = target;
            target = window;
        }
        type = "on" + type;
        if (type in target) return true;
        if (!target.setAttribute) target = document.createElement("div");
        if (target.setAttribute && target.removeAttribute) {
            target.setAttribute(type, "");
            var isSupported = typeof target[type] === "function";
            if (typeof target[type] !== "undefined") target[type] = null;
            target.removeAttribute(type);
            return isSupported;
        }
    };
    var clone = function(obj) {
        if (!obj || typeof obj !== "object") return obj;
        var temp = new obj.constructor();
        for (var key in obj) {
            if (!obj[key] || typeof obj[key] !== "object") {
                temp[key] = obj[key];
            } else {
                temp[key] = clone(obj[key]);
            }
        }
        return temp;
    };
    var eventManager = function(target, type, listener, configure, trigger, fromOverwrite) {
        configure = configure || {};
        if (String(target) === "[object Object]") {
            var data = target;
            target = data.target;
            delete data.target;
            if (data.type && data.listener) {
                type = data.type;
                delete data.type;
                listener = data.listener;
                delete data.listener;
                for (var key in data) {
                    configure[key] = data[key];
                }
            } else {
                for (var param in data) {
                    var value = data[param];
                    if (typeof value === "function") continue;
                    configure[param] = value;
                }
                var ret = {};
                for (var key in data) {
                    var param = key.split(",");
                    var o = data[key];
                    var conf = {};
                    for (var k in configure) {
                        conf[k] = configure[k];
                    }
                    if (typeof o === "function") {
                        var listener = o;
                    } else if (typeof o.listener === "function") {
                        var listener = o.listener;
                        for (var k in o) {
                            if (typeof o[k] === "function") continue;
                            conf[k] = o[k];
                        }
                    } else {
                        continue;
                    }
                    for (var n = 0; n < param.length; n++) {
                        ret[key] = eventjs.add(target, param[n], listener, conf, trigger);
                    }
                }
                return ret;
            }
        }
        if (!target || !type || !listener) return;
        if (typeof target === "string" && type === "ready") {
            if (window.eventjs_stallOnReady) {
                type = "load";
                target = window;
            } else {
                var time = new Date().getTime();
                var timeout = configure.timeout;
                var ms = configure.interval || 1e3 / 60;
                var interval = window.setInterval(function() {
                    if (new Date().getTime() - time > timeout) {
                        window.clearInterval(interval);
                    }
                    if (document.querySelector(target)) {
                        window.clearInterval(interval);
                        setTimeout(listener, 1);
                    }
                }, ms);
                return;
            }
        }
        if (typeof target === "string") {
            target = document.querySelectorAll(target);
            if (target.length === 0) return createError("Missing target on listener!", arguments);
            if (target.length === 1) {
                target = target[0];
            }
        }
        var event;
        var events = {};
        if (target.length > 0 && target !== window) {
            for (var n0 = 0, length0 = target.length; n0 < length0; n0++) {
                event = eventManager(target[n0], type, listener, clone(configure), trigger);
                if (event) events[n0] = event;
            }
            return createBatchCommands(events);
        }
        if (typeof type === "string") {
            type = type.toLowerCase();
            if (type.indexOf(" ") !== -1) {
                type = type.split(" ");
            } else if (type.indexOf(",") !== -1) {
                type = type.split(",");
            }
        }
        if (typeof type !== "string") {
            if (typeof type.length === "number") {
                for (var n1 = 0, length1 = type.length; n1 < length1; n1++) {
                    event = eventManager(target, type[n1], listener, clone(configure), trigger);
                    if (event) events[type[n1]] = event;
                }
            } else {
                for (var key in type) {
                    if (typeof type[key] === "function") {
                        event = eventManager(target, key, type[key], clone(configure), trigger);
                    } else {
                        event = eventManager(target, key, type[key].listener, clone(type[key]), trigger);
                    }
                    if (event) events[key] = event;
                }
            }
            return createBatchCommands(events);
        } else if (type.indexOf("on") === 0) {
            type = type.substr(2);
        }
        if (typeof target !== "object") return createError("Target is not defined!", arguments);
        if (typeof listener !== "function") return createError("Listener is not a function!", arguments);
        var useCapture = configure.useCapture || false;
        var id = getID(target) + "." + getID(listener) + "." + (useCapture ? 1 : 0);
        if (root.Gesture && root.Gesture._gestureHandlers[type]) {
            id = type + id;
            if (trigger === "remove") {
                if (!wrappers[id]) return;
                wrappers[id].remove();
                delete wrappers[id];
            } else if (trigger === "add") {
                if (wrappers[id]) {
                    wrappers[id].add();
                    return wrappers[id];
                }
                if (configure.useCall && !root.modifyEventListener) {
                    var tmp = listener;
                    listener = function(event, self) {
                        for (var key in self) event[key] = self[key];
                        return tmp.call(target, event);
                    };
                }
                configure.gesture = type;
                configure.target = target;
                configure.listener = listener;
                configure.fromOverwrite = fromOverwrite;
                wrappers[id] = root.proxy[type](configure);
            }
            return wrappers[id];
        } else {
            var eventList = getEventList(type);
            for (var n = 0, eventId; n < eventList.length; n++) {
                type = eventList[n];
                eventId = type + "." + id;
                if (trigger === "remove") {
                    if (!wrappers[eventId]) continue;
                    target[remove](type, listener, useCapture);
                    delete wrappers[eventId];
                } else if (trigger === "add") {
                    if (wrappers[eventId]) return wrappers[eventId];
                    target[add](type, listener, useCapture);
                    wrappers[eventId] = {
                        id: eventId,
                        type: type,
                        target: target,
                        listener: listener,
                        remove: function() {
                            for (var n = 0; n < eventList.length; n++) {
                                root.remove(target, eventList[n], listener, configure);
                            }
                        }
                    };
                }
            }
            return wrappers[eventId];
        }
    };
    var createBatchCommands = function(events) {
        return {
            remove: function() {
                for (var key in events) {
                    events[key].remove();
                }
            },
            add: function() {
                for (var key in events) {
                    events[key].add();
                }
            }
        };
    };
    var createError = function(message, data) {
        if (typeof console === "undefined") return;
        if (typeof console.error === "undefined") return;
        console.error(message, data);
    };
    var pointerDefs = {
        msPointer: [ "MSPointerDown", "MSPointerMove", "MSPointerUp" ],
        touch: [ "touchstart", "touchmove", "touchend" ],
        mouse: [ "mousedown", "mousemove", "mouseup" ]
    };
    var pointerDetect = {
        MSPointerDown: 0,
        MSPointerMove: 1,
        MSPointerUp: 2,
        touchstart: 0,
        touchmove: 1,
        touchend: 2,
        mousedown: 0,
        mousemove: 1,
        mouseup: 2
    };
    var getEventSupport = function() {
        root.supports = {};
        if (window.navigator.msPointerEnabled) {
            root.supports.msPointer = true;
        }
        if (root.getEventSupport("touchstart")) {
            root.supports.touch = true;
        }
        if (root.getEventSupport("mousedown")) {
            root.supports.mouse = true;
        }
    }();
    var getEventList = function() {
        return function(type) {
            var prefix = document.addEventListener ? "" : "on";
            var idx = pointerDetect[type];
            if (isFinite(idx)) {
                var types = [];
                for (var key in root.supports) {
                    types.push(prefix + pointerDefs[key][idx]);
                }
                return types;
            } else {
                return [ prefix + type ];
            }
        };
    }();
    var wrappers = {};
    var counter = 0;
    var getID = function(object) {
        if (object === window) return "#window";
        if (object === document) return "#document";
        if (!object.uniqueID) object.uniqueID = "e" + counter++;
        return object.uniqueID;
    };
    var add = document.addEventListener ? "addEventListener" : "attachEvent";
    var remove = document.removeEventListener ? "removeEventListener" : "detachEvent";
    root.createPointerEvent = function(event, self, preventRecord) {
        var eventName = self.gesture;
        var target = self.target;
        var pts = event.changedTouches || root.proxy.getCoords(event);
        if (pts.length) {
            var pt = pts[0];
            self.pointers = preventRecord ? [] : pts;
            self.pageX = pt.pageX;
            self.pageY = pt.pageY;
            self.x = self.pageX;
            self.y = self.pageY;
        }
        var newEvent = document.createEvent("Event");
        newEvent.initEvent(eventName, true, true);
        newEvent.originalEvent = event;
        for (var k in self) {
            if (k === "target") continue;
            newEvent[k] = self[k];
        }
        var type = newEvent.type;
        if (root.Gesture && root.Gesture._gestureHandlers[type]) {
            self.oldListener.call(target, newEvent, self, false);
        }
    };
    var eventListenersAgumented = false;
    var augmentEventListeners = function() {
        if (!window.HTMLElement) return;
        var augmentEventListener = function(proto) {
            var recall = function(trigger) {
                var handle = trigger + "EventListener";
                var handler = proto[handle];
                proto[handle] = function(type, listener, useCapture) {
                    if (root.Gesture && root.Gesture._gestureHandlers[type]) {
                        var configure = useCapture;
                        if (typeof useCapture === "object") {
                            configure.useCall = true;
                        } else {
                            configure = {
                                useCall: true,
                                useCapture: useCapture
                            };
                        }
                        eventManager(this, type, listener, configure, trigger, true);
                    } else {
                        var types = getEventList(type);
                        for (var n = 0; n < types.length; n++) {
                            handler.call(this, types[n], listener, useCapture);
                        }
                    }
                };
            };
            recall("add");
            recall("remove");
        };
        if (navigator.userAgent.match(/Firefox/)) {
            augmentEventListener(HTMLDivElement.prototype);
            augmentEventListener(HTMLCanvasElement.prototype);
        } else {
            augmentEventListener(HTMLElement.prototype);
        }
        augmentEventListener(document);
        augmentEventListener(window);
    };
    var selectorsAugmented = false;
    var augmentSelectors = function() {
        var proto = NodeList.prototype;
        proto.removeEventListener = function(type, listener, useCapture) {
            for (var n = 0, length = this.length; n < length; n++) {
                this[n].removeEventListener(type, listener, useCapture);
            }
        };
        proto.addEventListener = function(type, listener, useCapture) {
            for (var n = 0, length = this.length; n < length; n++) {
                this[n].addEventListener(type, listener, useCapture);
            }
        };
    };
    return root;
})(eventjs);

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    root.pointerSetup = function(conf, self) {
        conf.target = conf.target || window;
        conf.doc = conf.target.ownerDocument || conf.target;
        conf.minFingers = conf.minFingers || conf.fingers || 1;
        conf.maxFingers = conf.maxFingers || conf.fingers || Infinity;
        conf.position = conf.position || "relative";
        delete conf.fingers;
        self = self || {};
        self.enabled = true;
        self.gesture = conf.gesture;
        self.target = conf.target;
        self.env = conf.env;
        if (eventjs.modifyEventListener && conf.fromOverwrite) {
            conf.oldListener = conf.listener;
            conf.listener = eventjs.createPointerEvent;
        }
        var fingers = 0;
        var type = self.gesture.indexOf("pointer") === 0 && eventjs.modifyEventListener ? "pointer" : "mouse";
        if (conf.oldListener) self.oldListener = conf.oldListener;
        self.listener = conf.listener;
        self.proxy = function(listener) {
            self.defaultListener = conf.listener;
            conf.listener = listener;
            listener(conf.event, self);
        };
        self.add = function() {
            if (self.enabled === true) return;
            if (conf.onPointerDown) eventjs.add(conf.target, type + "down", conf.onPointerDown);
            if (conf.onPointerMove) eventjs.add(conf.doc, type + "move", conf.onPointerMove);
            if (conf.onPointerUp) eventjs.add(conf.doc, type + "up", conf.onPointerUp);
            self.enabled = true;
        };
        self.remove = function() {
            if (self.enabled === false) return;
            if (conf.onPointerDown) eventjs.remove(conf.target, type + "down", conf.onPointerDown);
            if (conf.onPointerMove) eventjs.remove(conf.doc, type + "move", conf.onPointerMove);
            if (conf.onPointerUp) eventjs.remove(conf.doc, type + "up", conf.onPointerUp);
            self.reset();
            self.enabled = false;
        };
        self.pause = function(opt) {
            if (conf.onPointerMove && (!opt || opt.move)) eventjs.remove(conf.doc, type + "move", conf.onPointerMove);
            if (conf.onPointerUp && (!opt || opt.up)) eventjs.remove(conf.doc, type + "up", conf.onPointerUp);
            fingers = conf.fingers;
            conf.fingers = 0;
        };
        self.resume = function(opt) {
            if (conf.onPointerMove && (!opt || opt.move)) eventjs.add(conf.doc, type + "move", conf.onPointerMove);
            if (conf.onPointerUp && (!opt || opt.up)) eventjs.add(conf.doc, type + "up", conf.onPointerUp);
            conf.fingers = fingers;
        };
        self.reset = function() {
            conf.tracker = {};
            conf.fingers = 0;
        };
        return self;
    };
    var sp = eventjs.supports;
    eventjs.isMouse = !!sp.mouse;
    eventjs.isMSPointer = !!sp.touch;
    eventjs.isTouch = !!sp.msPointer;
    root.pointerStart = function(event, self, conf) {
        var type = (event.type || "mousedown").toUpperCase();
        if (type.indexOf("MOUSE") === 0) {
            eventjs.isMouse = true;
            eventjs.isTouch = false;
            eventjs.isMSPointer = false;
        } else if (type.indexOf("TOUCH") === 0) {
            eventjs.isMouse = false;
            eventjs.isTouch = true;
            eventjs.isMSPointer = false;
        } else if (type.indexOf("MSPOINTER") === 0) {
            eventjs.isMouse = false;
            eventjs.isTouch = false;
            eventjs.isMSPointer = true;
        }
        var addTouchStart = function(touch, sid) {
            var bbox = conf.bbox;
            var pt = track[sid] = {};
            switch (conf.position) {
              case "absolute":
                pt.offsetX = 0;
                pt.offsetY = 0;
                break;

              case "differenceFromLast":
                pt.offsetX = touch.pageX;
                pt.offsetY = touch.pageY;
                break;

              case "difference":
                pt.offsetX = touch.pageX;
                pt.offsetY = touch.pageY;
                break;

              case "move":
                pt.offsetX = touch.pageX - bbox.x1;
                pt.offsetY = touch.pageY - bbox.y1;
                break;

              default:
                pt.offsetX = bbox.x1 - bbox.scrollLeft;
                pt.offsetY = bbox.y1 - bbox.scrollTop;
                break;
            }
            var x = touch.pageX - pt.offsetX;
            var y = touch.pageY - pt.offsetY;
            pt.rotation = 0;
            pt.scale = 1;
            pt.startTime = pt.moveTime = new Date().getTime();
            pt.move = {
                x: x,
                y: y
            };
            pt.start = {
                x: x,
                y: y
            };
            conf.fingers++;
        };
        conf.event = event;
        if (self.defaultListener) {
            conf.listener = self.defaultListener;
            delete self.defaultListener;
        }
        var isTouchStart = !conf.fingers;
        var track = conf.tracker;
        var touches = event.changedTouches || root.getCoords(event);
        var length = touches.length;
        for (var i = 0; i < length; i++) {
            var touch = touches[i];
            var sid = touch.identifier || Infinity;
            if (conf.fingers) {
                if (conf.fingers >= conf.maxFingers) {
                    var ids = [];
                    for (var sid in conf.tracker) ids.push(sid);
                    self.identifier = ids.join(",");
                    return isTouchStart;
                }
                var fingers = 0;
                for (var rid in track) {
                    if (track[rid].up) {
                        delete track[rid];
                        addTouchStart(touch, sid);
                        conf.cancel = true;
                        break;
                    }
                    fingers++;
                }
                if (track[sid]) continue;
                addTouchStart(touch, sid);
            } else {
                track = conf.tracker = {};
                self.bbox = conf.bbox = root.getBoundingBox(conf.target);
                conf.fingers = 0;
                conf.cancel = false;
                addTouchStart(touch, sid);
            }
        }
        var ids = [];
        for (var sid in conf.tracker) ids.push(sid);
        self.identifier = ids.join(",");
        return isTouchStart;
    };
    root.pointerEnd = function(event, self, conf, onPointerUp) {
        var touches = event.touches || [];
        var length = touches.length;
        var exists = {};
        for (var i = 0; i < length; i++) {
            var touch = touches[i];
            var sid = touch.identifier;
            exists[sid || Infinity] = true;
        }
        for (var sid in conf.tracker) {
            var track = conf.tracker[sid];
            if (exists[sid] || track.up) continue;
            if (onPointerUp) {
                onPointerUp({
                    pageX: track.pageX,
                    pageY: track.pageY,
                    changedTouches: [ {
                        pageX: track.pageX,
                        pageY: track.pageY,
                        identifier: sid === "Infinity" ? Infinity : sid
                    } ]
                }, "up");
            }
            track.up = true;
            conf.fingers--;
        }
        if (conf.fingers !== 0) return false;
        var ids = [];
        conf.gestureFingers = 0;
        for (var sid in conf.tracker) {
            conf.gestureFingers++;
            ids.push(sid);
        }
        self.identifier = ids.join(",");
        return true;
    };
    root.getCoords = function(event) {
        if (typeof event.pageX !== "undefined") {
            root.getCoords = function(event) {
                return Array({
                    type: "mouse",
                    x: event.pageX,
                    y: event.pageY,
                    pageX: event.pageX,
                    pageY: event.pageY,
                    identifier: event.pointerId || Infinity
                });
            };
        } else {
            root.getCoords = function(event) {
                var doc = document.documentElement;
                event = event || window.event;
                return Array({
                    type: "mouse",
                    x: event.clientX + doc.scrollLeft,
                    y: event.clientY + doc.scrollTop,
                    pageX: event.clientX + doc.scrollLeft,
                    pageY: event.clientY + doc.scrollTop,
                    identifier: Infinity
                });
            };
        }
        return root.getCoords(event);
    };
    root.getCoord = function(event) {
        if ("ontouchstart" in window) {
            var pX = 0;
            var pY = 0;
            root.getCoord = function(event) {
                var touches = event.changedTouches;
                if (touches && touches.length) {
                    return {
                        x: pX = touches[0].pageX,
                        y: pY = touches[0].pageY
                    };
                } else {
                    return {
                        x: pX,
                        y: pY
                    };
                }
            };
        } else if (typeof event.pageX !== "undefined" && typeof event.pageY !== "undefined") {
            root.getCoord = function(event) {
                return {
                    x: event.pageX,
                    y: event.pageY
                };
            };
        } else {
            root.getCoord = function(event) {
                var doc = document.documentElement;
                event = event || window.event;
                return {
                    x: event.clientX + doc.scrollLeft,
                    y: event.clientY + doc.scrollTop
                };
            };
        }
        return root.getCoord(event);
    };
    var getPropertyAsFloat = function(o, type) {
        var n = parseFloat(o.getPropertyValue(type), 10);
        return isFinite(n) ? n : 0;
    };
    root.getBoundingBox = function(o) {
        if (o === window || o === document) o = document.body;
        var bbox = {};
        var bcr = o.getBoundingClientRect();
        bbox.width = bcr.width;
        bbox.height = bcr.height;
        bbox.x1 = bcr.left;
        bbox.y1 = bcr.top;
        bbox.scaleX = bcr.width / o.offsetWidth || 1;
        bbox.scaleY = bcr.height / o.offsetHeight || 1;
        bbox.scrollLeft = 0;
        bbox.scrollTop = 0;
        var style = window.getComputedStyle(o);
        var borderBox = style.getPropertyValue("box-sizing") === "border-box";
        if (borderBox === false) {
            var left = getPropertyAsFloat(style, "border-left-width");
            var right = getPropertyAsFloat(style, "border-right-width");
            var bottom = getPropertyAsFloat(style, "border-bottom-width");
            var top = getPropertyAsFloat(style, "border-top-width");
            bbox.border = [ left, right, top, bottom ];
            bbox.x1 += left;
            bbox.y1 += top;
            bbox.width -= right + left;
            bbox.height -= bottom + top;
        }
        bbox.x2 = bbox.x1 + bbox.width;
        bbox.y2 = bbox.y1 + bbox.height;
        var position = style.getPropertyValue("position");
        var tmp = position === "fixed" ? o : o.parentNode;
        while (tmp !== null) {
            if (tmp === document.body) break;
            if (tmp.scrollTop === undefined) break;
            var style = window.getComputedStyle(tmp);
            var position = style.getPropertyValue("position");
            if (position === "absolute") {} else if (position === "fixed") {
                bbox.scrollTop -= tmp.parentNode.scrollTop;
                bbox.scrollLeft -= tmp.parentNode.scrollLeft;
                break;
            } else {
                bbox.scrollLeft += tmp.scrollLeft;
                bbox.scrollTop += tmp.scrollTop;
            }
            tmp = tmp.parentNode;
        }
        bbox.scrollBodyLeft = window.pageXOffset !== undefined ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
        bbox.scrollBodyTop = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        bbox.scrollLeft -= bbox.scrollBodyLeft;
        bbox.scrollTop -= bbox.scrollBodyTop;
        return bbox;
    };
    (function() {
        var agent = navigator.userAgent.toLowerCase();
        var mac = agent.indexOf("macintosh") !== -1;
        var metaKeys;
        if (mac && agent.indexOf("khtml") !== -1) {
            metaKeys = {
                91: true,
                93: true
            };
        } else if (mac && agent.indexOf("firefox") !== -1) {
            metaKeys = {
                224: true
            };
        } else {
            metaKeys = {
                17: true
            };
        }
        (root.metaTrackerReset = function() {
            eventjs.fnKey = root.fnKey = false;
            eventjs.metaKey = root.metaKey = false;
            eventjs.escKey = root.escKey = false;
            eventjs.ctrlKey = root.ctrlKey = false;
            eventjs.shiftKey = root.shiftKey = false;
            eventjs.altKey = root.altKey = false;
        })();
        root.metaTracker = function(event) {
            var isKeyDown = event.type === "keydown";
            if (event.keyCode === 27) eventjs.escKey = root.escKey = isKeyDown;
            if (metaKeys[event.keyCode]) eventjs.metaKey = root.metaKey = isKeyDown;
            eventjs.ctrlKey = root.ctrlKey = event.ctrlKey;
            eventjs.shiftKey = root.shiftKey = event.shiftKey;
            eventjs.altKey = root.altKey = event.altKey;
        };
    })();
    return root;
}(eventjs.proxy);

if (typeof eventjs === "undefined") var eventjs = {};

eventjs.MutationObserver = function() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var DOMAttrModifiedSupported = !MutationObserver && function() {
        var p = document.createElement("p");
        var flag = false;
        var fn = function() {
            flag = true;
        };
        if (p.addEventListener) {
            p.addEventListener("DOMAttrModified", fn, false);
        } else if (p.attachEvent) {
            p.attachEvent("onDOMAttrModified", fn);
        } else {
            return false;
        }
        p.setAttribute("id", "target");
        return flag;
    }();
    return function(container, callback) {
        if (MutationObserver) {
            var options = {
                subtree: false,
                attributes: true
            };
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(e) {
                    callback.call(e.target, e.attributeName);
                });
            });
            observer.observe(container, options);
        } else if (DOMAttrModifiedSupported) {
            eventjs.add(container, "DOMAttrModified", function(e) {
                callback.call(container, e.attrName);
            });
        } else if ("onpropertychange" in document.body) {
            eventjs.add(container, "propertychange", function(e) {
                callback.call(container, window.event.propertyName);
            });
        }
    };
}();

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    root.click = function(conf) {
        conf.gesture = conf.gesture || "click";
        conf.maxFingers = conf.maxFingers || conf.fingers || 1;
        conf.onPointerDown = function(event) {
            if (root.pointerStart(event, self, conf)) {
                eventjs.add(conf.target, "mouseup", conf.onPointerUp);
            }
        };
        conf.onPointerUp = function(event) {
            if (root.pointerEnd(event, self, conf)) {
                eventjs.remove(conf.target, "mouseup", conf.onPointerUp);
                var pointers = event.changedTouches || root.getCoords(event);
                var pointer = pointers[0];
                var bbox = conf.bbox;
                var newbbox = root.getBoundingBox(conf.target);
                var y = pointer.pageY - newbbox.scrollBodyTop;
                var x = pointer.pageX - newbbox.scrollBodyLeft;
                if (x > bbox.x1 && y > bbox.y1 && x < bbox.x2 && y < bbox.y2 && bbox.scrollTop === newbbox.scrollTop) {
                    for (var key in conf.tracker) break;
                    var point = conf.tracker[key];
                    self.x = point.start.x;
                    self.y = point.start.y;
                    conf.listener(event, self);
                }
            }
        };
        var self = root.pointerSetup(conf);
        self.state = "click";
        eventjs.add(conf.target, "mousedown", conf.onPointerDown);
        return self;
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.click = root.click;
    return root;
}(eventjs.proxy);

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    root.dbltap = root.dblclick = function(conf) {
        conf.gesture = conf.gesture || "dbltap";
        conf.maxFingers = conf.maxFingers || conf.fingers || 1;
        var delay = 700;
        var time0, time1, timeout;
        var pointer0, pointer1;
        conf.onPointerDown = function(event) {
            var pointers = event.changedTouches || root.getCoords(event);
            if (time0 && !time1) {
                pointer1 = pointers[0];
                time1 = new Date().getTime() - time0;
            } else {
                pointer0 = pointers[0];
                time0 = new Date().getTime();
                time1 = 0;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    time0 = 0;
                }, delay);
            }
            if (root.pointerStart(event, self, conf)) {
                eventjs.add(conf.target, "mousemove", conf.onPointerMove).listener(event);
                eventjs.add(conf.target, "mouseup", conf.onPointerUp);
            }
        };
        conf.onPointerMove = function(event) {
            if (time0 && !time1) {
                var pointers = event.changedTouches || root.getCoords(event);
                pointer1 = pointers[0];
            }
            var bbox = conf.bbox;
            var ax = pointer1.pageX - bbox.x1;
            var ay = pointer1.pageY - bbox.y1;
            if (!(ax > 0 && ax < bbox.width && ay > 0 && ay < bbox.height && Math.abs(pointer1.pageX - pointer0.pageX) <= 25 && Math.abs(pointer1.pageY - pointer0.pageY) <= 25)) {
                eventjs.remove(conf.target, "mousemove", conf.onPointerMove);
                clearTimeout(timeout);
                time0 = time1 = 0;
            }
        };
        conf.onPointerUp = function(event) {
            if (root.pointerEnd(event, self, conf)) {
                eventjs.remove(conf.target, "mousemove", conf.onPointerMove);
                eventjs.remove(conf.target, "mouseup", conf.onPointerUp);
            }
            if (time0 && time1) {
                if (time1 <= delay) {
                    self.state = conf.gesture;
                    for (var key in conf.tracker) break;
                    var point = conf.tracker[key];
                    self.x = point.start.x;
                    self.y = point.start.y;
                    conf.listener(event, self);
                }
                clearTimeout(timeout);
                time0 = time1 = 0;
            }
        };
        var self = root.pointerSetup(conf);
        self.state = "dblclick";
        eventjs.add(conf.target, "mousedown", conf.onPointerDown);
        return self;
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.dbltap = root.dbltap;
    eventjs.Gesture._gestureHandlers.dblclick = root.dblclick;
    return root;
}(eventjs.proxy);

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    root.dragElement = function(that, event) {
        root.drag({
            event: event,
            target: that,
            position: "move",
            listener: function(event, self) {
                that.style.left = self.x + "px";
                that.style.top = self.y + "px";
                eventjs.prevent(event);
            }
        });
    };
    root.drag = function(conf) {
        conf.gesture = "drag";
        conf.onPointerDown = function(event) {
            if (root.pointerStart(event, self, conf)) {
                if (!conf.monitor) {
                    eventjs.add(conf.doc, "mousemove", conf.onPointerMove);
                    eventjs.add(conf.doc, "mouseup", conf.onPointerUp);
                }
            }
            conf.onPointerMove(event, "down");
        };
        conf.onPointerMove = function(event, state) {
            if (!conf.tracker) return conf.onPointerDown(event);
            var bbox = conf.bbox;
            var touches = event.changedTouches || root.getCoords(event);
            var length = touches.length;
            for (var i = 0; i < length; i++) {
                var touch = touches[i];
                var identifier = touch.identifier || Infinity;
                var pt = conf.tracker[identifier];
                if (!pt) continue;
                pt.pageX = touch.pageX;
                pt.pageY = touch.pageY;
                self.state = state || "move";
                self.identifier = identifier;
                self.start = pt.start;
                self.fingers = conf.fingers;
                if (conf.position === "differenceFromLast") {
                    self.x = pt.pageX - pt.offsetX;
                    self.y = pt.pageY - pt.offsetY;
                    pt.offsetX = pt.pageX;
                    pt.offsetY = pt.pageY;
                } else {
                    self.x = pt.pageX - pt.offsetX;
                    self.y = pt.pageY - pt.offsetY;
                }
                conf.listener(event, self);
            }
        };
        conf.onPointerUp = function(event) {
            if (root.pointerEnd(event, self, conf, conf.onPointerMove)) {
                if (!conf.monitor) {
                    eventjs.remove(conf.doc, "mousemove", conf.onPointerMove);
                    eventjs.remove(conf.doc, "mouseup", conf.onPointerUp);
                }
            }
        };
        var self = root.pointerSetup(conf);
        if (conf.event) {
            conf.onPointerDown(conf.event);
        } else {
            eventjs.add(conf.target, "mousedown", conf.onPointerDown);
            if (conf.monitor) {
                eventjs.add(conf.doc, "mousemove", conf.onPointerMove);
                eventjs.add(conf.doc, "mouseup", conf.onPointerUp);
            }
        }
        return self;
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.drag = root.drag;
    return root;
}(eventjs.proxy);

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    var RAD_DEG = Math.PI / 180;
    var getCentroid = function(self, points) {
        var centroidx = 0;
        var centroidy = 0;
        var length = 0;
        for (var sid in points) {
            var touch = points[sid];
            if (touch.up) continue;
            centroidx += touch.move.x;
            centroidy += touch.move.y;
            length++;
        }
        self.x = centroidx /= length;
        self.y = centroidy /= length;
        return self;
    };
    root.gesture = function(conf) {
        conf.gesture = conf.gesture || "gesture";
        conf.minFingers = conf.minFingers || conf.fingers || 2;
        conf.onPointerDown = function(event) {
            var fingers = conf.fingers;
            if (root.pointerStart(event, self, conf)) {
                eventjs.add(conf.doc, "mousemove", conf.onPointerMove);
                eventjs.add(conf.doc, "mouseup", conf.onPointerUp);
            }
            if (conf.fingers === conf.minFingers && fingers !== conf.fingers) {
                self.fingers = conf.minFingers;
                self.scale = 1;
                self.rotation = 0;
                self.state = "start";
                var sids = "";
                for (var key in conf.tracker) sids += key;
                self.identifier = parseInt(sids);
                getCentroid(self, conf.tracker);
                conf.listener(event, self);
            }
        };
        conf.onPointerMove = function(event, state) {
            var bbox = conf.bbox;
            var points = conf.tracker;
            var touches = event.changedTouches || root.getCoords(event);
            var length = touches.length;
            for (var i = 0; i < length; i++) {
                var touch = touches[i];
                var sid = touch.identifier || Infinity;
                var pt = points[sid];
                if (!pt) continue;
                pt.move.x = touch.pageX - bbox.x1;
                pt.move.y = touch.pageY - bbox.y1;
            }
            if (conf.fingers < conf.minFingers) return;
            var touches = [];
            var scale = 0;
            var rotation = 0;
            getCentroid(self, points);
            for (var sid in points) {
                var touch = points[sid];
                if (touch.up) continue;
                var start = touch.start;
                if (!start.distance) {
                    var dx = start.x - self.x;
                    var dy = start.y - self.y;
                    start.distance = Math.sqrt(dx * dx + dy * dy);
                    start.angle = Math.atan2(dx, dy) / RAD_DEG;
                }
                var dx = touch.move.x - self.x;
                var dy = touch.move.y - self.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                scale += distance / start.distance;
                var angle = Math.atan2(dx, dy) / RAD_DEG;
                var rotate = (start.angle - angle + 360) % 360 - 180;
                touch.DEG2 = touch.DEG1;
                touch.DEG1 = rotate > 0 ? rotate : -rotate;
                if (typeof touch.DEG2 !== "undefined") {
                    if (rotate > 0) {
                        touch.rotation += touch.DEG1 - touch.DEG2;
                    } else {
                        touch.rotation -= touch.DEG1 - touch.DEG2;
                    }
                    rotation += touch.rotation;
                }
                touches.push(touch.move);
            }
            self.touches = touches;
            self.fingers = conf.fingers;
            self.scale = scale / conf.fingers;
            self.rotation = rotation / conf.fingers;
            self.state = "change";
            conf.listener(event, self);
        };
        conf.onPointerUp = function(event) {
            var fingers = conf.fingers;
            if (root.pointerEnd(event, self, conf)) {
                eventjs.remove(conf.doc, "mousemove", conf.onPointerMove);
                eventjs.remove(conf.doc, "mouseup", conf.onPointerUp);
            }
            if (fingers === conf.minFingers && conf.fingers < conf.minFingers) {
                self.fingers = conf.fingers;
                self.state = "end";
                conf.listener(event, self);
            }
        };
        var self = root.pointerSetup(conf);
        eventjs.add(conf.target, "mousedown", conf.onPointerDown);
        return self;
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.gesture = root.gesture;
    return root;
}(eventjs.proxy);

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    root.pointerdown = root.pointermove = root.pointerup = function(conf) {
        conf.gesture = conf.gesture || "pointer";
        if (conf.target.isPointerEmitter) return;
        var isDown = true;
        conf.onPointerDown = function(event) {
            isDown = false;
            self.gesture = "pointerdown";
            conf.listener(event, self);
        };
        conf.onPointerMove = function(event) {
            self.gesture = "pointermove";
            conf.listener(event, self, isDown);
        };
        conf.onPointerUp = function(event) {
            isDown = true;
            self.gesture = "pointerup";
            conf.listener(event, self, true);
        };
        var self = root.pointerSetup(conf);
        eventjs.add(conf.target, "mousedown", conf.onPointerDown);
        eventjs.add(conf.target, "mousemove", conf.onPointerMove);
        eventjs.add(conf.doc, "mouseup", conf.onPointerUp);
        conf.target.isPointerEmitter = true;
        return self;
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.pointerdown = root.pointerdown;
    eventjs.Gesture._gestureHandlers.pointermove = root.pointermove;
    eventjs.Gesture._gestureHandlers.pointerup = root.pointerup;
    return root;
}(eventjs.proxy);

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    root.shake = function(conf) {
        var self = {
            gesture: "devicemotion",
            acceleration: {},
            accelerationIncludingGravity: {},
            target: conf.target,
            listener: conf.listener,
            remove: function() {
                window.removeEventListener("devicemotion", onDeviceMotion, false);
            }
        };
        var threshold = 4;
        var timeout = 1e3;
        var timeframe = 200;
        var shakes = 3;
        var lastShake = new Date().getTime();
        var gravity = {
            x: 0,
            y: 0,
            z: 0
        };
        var delta = {
            x: {
                count: 0,
                value: 0
            },
            y: {
                count: 0,
                value: 0
            },
            z: {
                count: 0,
                value: 0
            }
        };
        var onDeviceMotion = function(e) {
            var alpha = .8;
            var o = e.accelerationIncludingGravity;
            gravity.x = alpha * gravity.x + (1 - alpha) * o.x;
            gravity.y = alpha * gravity.y + (1 - alpha) * o.y;
            gravity.z = alpha * gravity.z + (1 - alpha) * o.z;
            self.accelerationIncludingGravity = gravity;
            self.acceleration.x = o.x - gravity.x;
            self.acceleration.y = o.y - gravity.y;
            self.acceleration.z = o.z - gravity.z;
            if (conf.gesture === "devicemotion") {
                conf.listener(e, self);
                return;
            }
            var data = "xyz";
            var now = new Date().getTime();
            for (var n = 0, length = data.length; n < length; n++) {
                var letter = data[n];
                var ACCELERATION = self.acceleration[letter];
                var DELTA = delta[letter];
                var abs = Math.abs(ACCELERATION);
                if (now - lastShake < timeout) continue;
                if (abs > threshold) {
                    var idx = now * ACCELERATION / abs;
                    var span = Math.abs(idx + DELTA.value);
                    if (DELTA.value && span < timeframe) {
                        DELTA.value = idx;
                        DELTA.count++;
                        if (DELTA.count === shakes) {
                            conf.listener(e, self);
                            lastShake = now;
                            DELTA.value = 0;
                            DELTA.count = 0;
                        }
                    } else {
                        DELTA.value = idx;
                        DELTA.count = 1;
                    }
                }
            }
        };
        if (!window.addEventListener) return;
        window.addEventListener("devicemotion", onDeviceMotion, false);
        return self;
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.shake = root.shake;
    return root;
}(eventjs.proxy);

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    var RAD_DEG = Math.PI / 180;
    root.swipe = function(conf) {
        conf.snap = conf.snap || 90;
        conf.threshold = conf.threshold || 1;
        conf.gesture = conf.gesture || "swipe";
        conf.onPointerDown = function(event) {
            if (root.pointerStart(event, self, conf)) {
                eventjs.add(conf.doc, "mousemove", conf.onPointerMove).listener(event);
                eventjs.add(conf.doc, "mouseup", conf.onPointerUp);
            }
        };
        conf.onPointerMove = function(event) {
            var touches = event.changedTouches || root.getCoords(event);
            var length = touches.length;
            for (var i = 0; i < length; i++) {
                var touch = touches[i];
                var sid = touch.identifier || Infinity;
                var o = conf.tracker[sid];
                if (!o) continue;
                o.move.x = touch.pageX;
                o.move.y = touch.pageY;
                o.moveTime = new Date().getTime();
            }
        };
        conf.onPointerUp = function(event) {
            if (root.pointerEnd(event, self, conf)) {
                eventjs.remove(conf.doc, "mousemove", conf.onPointerMove);
                eventjs.remove(conf.doc, "mouseup", conf.onPointerUp);
                var velocity1;
                var velocity2;
                var degree1;
                var degree2;
                var start = {
                    x: 0,
                    y: 0
                };
                var endx = 0;
                var endy = 0;
                var length = 0;
                for (var sid in conf.tracker) {
                    var touch = conf.tracker[sid];
                    var xdist = touch.move.x - touch.start.x;
                    var ydist = touch.move.y - touch.start.y;
                    endx += touch.move.x;
                    endy += touch.move.y;
                    start.x += touch.start.x;
                    start.y += touch.start.y;
                    length++;
                    var distance = Math.sqrt(xdist * xdist + ydist * ydist);
                    var ms = touch.moveTime - touch.startTime;
                    var degree2 = Math.atan2(xdist, ydist) / RAD_DEG + 180;
                    var velocity2 = ms ? distance / ms : 0;
                    if (typeof degree1 === "undefined") {
                        degree1 = degree2;
                        velocity1 = velocity2;
                    } else if (Math.abs(degree2 - degree1) <= 20) {
                        degree1 = (degree1 + degree2) / 2;
                        velocity1 = (velocity1 + velocity2) / 2;
                    } else {
                        return;
                    }
                }
                var fingers = conf.gestureFingers;
                if (conf.minFingers <= fingers && conf.maxFingers >= fingers) {
                    if (velocity1 > conf.threshold) {
                        start.x /= length;
                        start.y /= length;
                        self.start = start;
                        self.x = endx / length;
                        self.y = endy / length;
                        self.angle = -(((degree1 / conf.snap + .5 >> 0) * conf.snap || 360) - 360);
                        self.velocity = velocity1;
                        self.fingers = fingers;
                        self.state = "swipe";
                        conf.listener(event, self);
                    }
                }
            }
        };
        var self = root.pointerSetup(conf);
        eventjs.add(conf.target, "mousedown", conf.onPointerDown);
        return self;
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.swipe = root.swipe;
    return root;
}(eventjs.proxy);

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    root.longpress = function(conf) {
        conf.gesture = "longpress";
        return root.tap(conf);
    };
    root.tap = function(conf) {
        conf.delay = conf.delay || 500;
        conf.timeout = conf.timeout || 250;
        conf.driftDeviance = conf.driftDeviance || 10;
        conf.gesture = conf.gesture || "tap";
        var timestamp, timeout;
        conf.onPointerDown = function(event) {
            if (root.pointerStart(event, self, conf)) {
                timestamp = new Date().getTime();
                eventjs.add(conf.doc, "mousemove", conf.onPointerMove).listener(event);
                eventjs.add(conf.doc, "mouseup", conf.onPointerUp);
                if (conf.gesture !== "longpress") return;
                timeout = setTimeout(function() {
                    if (event.cancelBubble && ++event.cancelBubbleCount > 1) return;
                    var fingers = 0;
                    for (var key in conf.tracker) {
                        var point = conf.tracker[key];
                        if (point.end === true) return;
                        if (conf.cancel) return;
                        fingers++;
                    }
                    if (conf.minFingers <= fingers && conf.maxFingers >= fingers) {
                        self.state = "start";
                        self.fingers = fingers;
                        self.x = point.start.x;
                        self.y = point.start.y;
                        conf.listener(event, self);
                    }
                }, conf.delay);
            }
        };
        conf.onPointerMove = function(event) {
            var bbox = conf.bbox;
            var touches = event.changedTouches || root.getCoords(event);
            var length = touches.length;
            for (var i = 0; i < length; i++) {
                var touch = touches[i];
                var identifier = touch.identifier || Infinity;
                var pt = conf.tracker[identifier];
                if (!pt) continue;
                var x = touch.pageX - bbox.x1;
                var y = touch.pageY - bbox.y1;
                var dx = x - pt.start.x;
                var dy = y - pt.start.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (!(x > 0 && x < bbox.width && y > 0 && y < bbox.height && distance <= conf.driftDeviance)) {
                    eventjs.remove(conf.doc, "mousemove", conf.onPointerMove);
                    conf.cancel = true;
                    return;
                }
            }
        };
        conf.onPointerUp = function(event) {
            if (root.pointerEnd(event, self, conf)) {
                clearTimeout(timeout);
                eventjs.remove(conf.doc, "mousemove", conf.onPointerMove);
                eventjs.remove(conf.doc, "mouseup", conf.onPointerUp);
                if (event.cancelBubble && ++event.cancelBubbleCount > 1) return;
                if (conf.gesture === "longpress") {
                    if (self.state === "start") {
                        self.state = "end";
                        conf.listener(event, self);
                    }
                    return;
                }
                if (conf.cancel) return;
                if (new Date().getTime() - timestamp > conf.timeout) return;
                var fingers = conf.gestureFingers;
                if (conf.minFingers <= fingers && conf.maxFingers >= fingers) {
                    self.state = "tap";
                    self.fingers = conf.gestureFingers;
                    conf.listener(event, self);
                }
            }
        };
        var self = root.pointerSetup(conf);
        eventjs.add(conf.target, "mousedown", conf.onPointerDown);
        return self;
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.tap = root.tap;
    eventjs.Gesture._gestureHandlers.longpress = root.longpress;
    return root;
}(eventjs.proxy);

if (typeof eventjs === "undefined") var eventjs = {};

if (typeof eventjs.proxy === "undefined") eventjs.proxy = {};

eventjs.proxy = function(root) {
    "use strict";
    root.wheelPreventElasticBounce = function(el) {
        if (!el) return;
        if (typeof el === "string") el = document.querySelector(el);
        eventjs.add(el, "wheel", function(event, self) {
            self.preventElasticBounce();
            eventjs.stop(event);
        });
    };
    root.wheel = function(conf) {
        var interval;
        var timeout = conf.timeout || 150;
        var count = 0;
        var self = {
            gesture: "wheel",
            state: "start",
            wheelDelta: 0,
            target: conf.target,
            listener: conf.listener,
            preventElasticBounce: function(event) {
                var target = this.target;
                var scrollTop = target.scrollTop;
                var top = scrollTop + target.offsetHeight;
                var height = target.scrollHeight;
                if (top === height && this.wheelDelta <= 0) eventjs.cancel(event); else if (scrollTop === 0 && this.wheelDelta >= 0) eventjs.cancel(event);
                eventjs.stop(event);
            },
            add: function() {
                conf.target[add](type, onMouseWheel, false);
            },
            remove: function() {
                conf.target[remove](type, onMouseWheel, false);
            }
        };
        var onMouseWheel = function(event) {
            event = event || window.event;
            self.state = count++ ? "change" : "start";
            self.wheelDelta = event.detail ? event.detail * -20 : event.wheelDelta;
            conf.listener(event, self);
            clearTimeout(interval);
            interval = setTimeout(function() {
                count = 0;
                self.state = "end";
                self.wheelDelta = 0;
                conf.listener(event, self);
            }, timeout);
        };
        var add = document.addEventListener ? "addEventListener" : "attachEvent";
        var remove = document.removeEventListener ? "removeEventListener" : "detachEvent";
        var type = eventjs.getEventSupport("mousewheel") ? "mousewheel" : "DOMMouseScroll";
        conf.target[add](type, onMouseWheel, false);
        return self;
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.wheel = root.wheel;
    return root;
}(eventjs.proxy);

if (typeof Event === "undefined") var Event = {};

if (typeof Event.proxy === "undefined") Event.proxy = {};

Event.proxy = function(root) {
    "use strict";
    root.orientation = function(conf) {
        var self = {
            gesture: "orientationchange",
            previous: null,
            current: window.orientation,
            target: conf.target,
            listener: conf.listener,
            remove: function() {
                window.removeEventListener("orientationchange", onOrientationChange, false);
            }
        };
        var onOrientationChange = function(e) {
            self.previous = self.current;
            self.current = window.orientation;
            if (self.previous !== null && self.previous != self.current) {
                conf.listener(e, self);
                return;
            }
        };
        if (window.DeviceOrientationEvent) {
            window.addEventListener("orientationchange", onOrientationChange, false);
        }
        return self;
    };
    Event.Gesture = Event.Gesture || {};
    Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
    Event.Gesture._gestureHandlers.orientation = root.orientation;
    return root;
}(Event.proxy);

(function() {
    function _removeEventListener(eventName, handler) {
        if (!this.__eventListeners[eventName]) {
            return;
        }
        var eventListener = this.__eventListeners[eventName];
        if (handler) {
            eventListener[eventListener.indexOf(handler)] = false;
        } else {
            fabric.util.array.fill(eventListener, false);
        }
    }
    function observe(eventName, handler) {
        if (!this.__eventListeners) {
            this.__eventListeners = {};
        }
        if (arguments.length === 1) {
            for (var prop in eventName) {
                this.on(prop, eventName[prop]);
            }
        } else {
            if (!this.__eventListeners[eventName]) {
                this.__eventListeners[eventName] = [];
            }
            this.__eventListeners[eventName].push(handler);
        }
        return this;
    }
    function stopObserving(eventName, handler) {
        if (!this.__eventListeners) {
            return;
        }
        if (arguments.length === 0) {
            for (eventName in this.__eventListeners) {
                _removeEventListener.call(this, eventName);
            }
        } else if (arguments.length === 1 && typeof arguments[0] === "object") {
            for (var prop in eventName) {
                _removeEventListener.call(this, prop, eventName[prop]);
            }
        } else {
            _removeEventListener.call(this, eventName, handler);
        }
        return this;
    }
    function fire(eventName, options) {
        if (!this.__eventListeners) {
            return;
        }
        var listenersForEvent = this.__eventListeners[eventName];
        if (!listenersForEvent) {
            return;
        }
        for (var i = 0, len = listenersForEvent.length; i < len; i++) {
            listenersForEvent[i] && listenersForEvent[i].call(this, options || {});
        }
        this.__eventListeners[eventName] = listenersForEvent.filter(function(value) {
            return value !== false;
        });
        return this;
    }
    fabric.Observable = {
        observe: observe,
        stopObserving: stopObserving,
        fire: fire,
        on: observe,
        off: stopObserving,
        trigger: fire
    };
})();

fabric.Collection = {
    _objects: [],
    add: function() {
        this._objects.push.apply(this._objects, arguments);
        if (this._onObjectAdded) {
            for (var i = 0, length = arguments.length; i < length; i++) {
                this._onObjectAdded(arguments[i]);
            }
        }
        this.renderOnAddRemove && this.renderAll();
        return this;
    },
    insertAt: function(object, index, nonSplicing) {
        var objects = this.getObjects();
        if (nonSplicing) {
            objects[index] = object;
        } else {
            objects.splice(index, 0, object);
        }
        this._onObjectAdded && this._onObjectAdded(object);
        this.renderOnAddRemove && this.renderAll();
        return this;
    },
    remove: function() {
        var objects = this.getObjects(), index, somethingRemoved = false;
        for (var i = 0, length = arguments.length; i < length; i++) {
            index = objects.indexOf(arguments[i]);
            if (index !== -1) {
                somethingRemoved = true;
                objects.splice(index, 1);
                this._onObjectRemoved && this._onObjectRemoved(arguments[i]);
            }
        }
        this.renderOnAddRemove && somethingRemoved && this.renderAll();
        return this;
    },
    forEachObject: function(callback, context) {
        var objects = this.getObjects();
        for (var i = 0, len = objects.length; i < len; i++) {
            callback.call(context, objects[i], i, objects);
        }
        return this;
    },
    getObjects: function(type) {
        if (typeof type === "undefined") {
            return this._objects;
        }
        return this._objects.filter(function(o) {
            return o.type === type;
        });
    },
    item: function(index) {
        return this.getObjects()[index];
    },
    isEmpty: function() {
        return this.getObjects().length === 0;
    },
    size: function() {
        return this.getObjects().length;
    },
    contains: function(object) {
        return this.getObjects().indexOf(object) > -1;
    },
    complexity: function() {
        return this.getObjects().reduce(function(memo, current) {
            memo += current.complexity ? current.complexity() : 0;
            return memo;
        }, 0);
    }
};

fabric.CommonMethods = {
    _setOptions: function(options) {
        for (var prop in options) {
            this.set(prop, options[prop]);
        }
    },
    _initGradient: function(filler, property) {
        if (filler && filler.colorStops && !(filler instanceof fabric.Gradient)) {
            this.set(property, new fabric.Gradient(filler));
        }
    },
    _initPattern: function(filler, property, callback) {
        if (filler && filler.source && !(filler instanceof fabric.Pattern)) {
            this.set(property, new fabric.Pattern(filler, callback));
        } else {
            callback && callback();
        }
    },
    _initClipping: function(options) {
        if (!options.clipTo || typeof options.clipTo !== "string") {
            return;
        }
        var functionBody = fabric.util.getFunctionBody(options.clipTo);
        if (typeof functionBody !== "undefined") {
            this.clipTo = new Function("ctx", functionBody);
        }
    },
    _setObject: function(obj) {
        for (var prop in obj) {
            this._set(prop, obj[prop]);
        }
    },
    set: function(key, value) {
        if (typeof key === "object") {
            this._setObject(key);
        } else {
            if (typeof value === "function" && key !== "clipTo") {
                this._set(key, value(this.get(key)));
            } else {
                this._set(key, value);
            }
        }
        return this;
    },
    _set: function(key, value) {
        this[key] = value;
    },
    toggle: function(property) {
        var value = this.get(property);
        if (typeof value === "boolean") {
            this.set(property, !value);
        }
        return this;
    },
    get: function(property) {
        return this[property];
    }
};

(function(global) {
    var sqrt = Math.sqrt, atan2 = Math.atan2, pow = Math.pow, abs = Math.abs, PiBy180 = Math.PI / 180;
    fabric.util = {
        removeFromArray: function(array, value) {
            var idx = array.indexOf(value);
            if (idx !== -1) {
                array.splice(idx, 1);
            }
            return array;
        },
        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        degreesToRadians: function(degrees) {
            return degrees * PiBy180;
        },
        radiansToDegrees: function(radians) {
            return radians / PiBy180;
        },
        rotatePoint: function(point, origin, radians) {
            point.subtractEquals(origin);
            var v = fabric.util.rotateVector(point, radians);
            return new fabric.Point(v.x, v.y).addEquals(origin);
        },
        rotateVector: function(vector, radians) {
            var sin = Math.sin(radians), cos = Math.cos(radians), rx = vector.x * cos - vector.y * sin, ry = vector.x * sin + vector.y * cos;
            return {
                x: rx,
                y: ry
            };
        },
        transformPoint: function(p, t, ignoreOffset) {
            if (ignoreOffset) {
                return new fabric.Point(t[0] * p.x + t[2] * p.y, t[1] * p.x + t[3] * p.y);
            }
            return new fabric.Point(t[0] * p.x + t[2] * p.y + t[4], t[1] * p.x + t[3] * p.y + t[5]);
        },
        makeBoundingBoxFromPoints: function(points) {
            var xPoints = [ points[0].x, points[1].x, points[2].x, points[3].x ], minX = fabric.util.array.min(xPoints), maxX = fabric.util.array.max(xPoints), width = Math.abs(minX - maxX), yPoints = [ points[0].y, points[1].y, points[2].y, points[3].y ], minY = fabric.util.array.min(yPoints), maxY = fabric.util.array.max(yPoints), height = Math.abs(minY - maxY);
            return {
                left: minX,
                top: minY,
                width: width,
                height: height
            };
        },
        invertTransform: function(t) {
            var a = 1 / (t[0] * t[3] - t[1] * t[2]), r = [ a * t[3], -a * t[1], -a * t[2], a * t[0] ], o = fabric.util.transformPoint({
                x: t[4],
                y: t[5]
            }, r, true);
            r[4] = -o.x;
            r[5] = -o.y;
            return r;
        },
        toFixed: function(number, fractionDigits) {
            return parseFloat(Number(number).toFixed(fractionDigits));
        },
        parseUnit: function(value, fontSize) {
            var unit = /\D{0,2}$/.exec(value), number = parseFloat(value);
            if (!fontSize) {
                fontSize = fabric.Text.DEFAULT_SVG_FONT_SIZE;
            }
            switch (unit[0]) {
              case "mm":
                return number * fabric.DPI / 25.4;

              case "cm":
                return number * fabric.DPI / 2.54;

              case "in":
                return number * fabric.DPI;

              case "pt":
                return number * fabric.DPI / 72;

              case "pc":
                return number * fabric.DPI / 72 * 12;

              case "em":
                return number * fontSize;

              default:
                return number;
            }
        },
        falseFunction: function() {
            return false;
        },
        getKlass: function(type, namespace) {
            type = fabric.util.string.camelize(type.charAt(0).toUpperCase() + type.slice(1));
            return fabric.util.resolveNamespace(namespace)[type];
        },
        resolveNamespace: function(namespace) {
            if (!namespace) {
                return fabric;
            }
            var parts = namespace.split("."), len = parts.length, i, obj = global || fabric.window;
            for (i = 0; i < len; ++i) {
                obj = obj[parts[i]];
            }
            return obj;
        },
        loadImage: function(url, callback, context, crossOrigin) {
            if (!url) {
                callback && callback.call(context, url);
                return;
            }
            var img = fabric.util.createImage();
            img.onload = function() {
                callback && callback.call(context, img);
                img = img.onload = img.onerror = null;
            };
            img.onerror = function() {
                fabric.log("Error loading " + img.src);
                callback && callback.call(context, null, true);
                img = img.onload = img.onerror = null;
            };
            if (url.indexOf("data") !== 0 && crossOrigin) {
                img.crossOrigin = crossOrigin;
            }
            img.src = url;
        },
        enlivenObjects: function(objects, callback, namespace, reviver) {
            objects = objects || [];
            function onLoaded() {
                if (++numLoadedObjects === numTotalObjects) {
                    callback && callback(enlivenedObjects);
                }
            }
            var enlivenedObjects = [], numLoadedObjects = 0, numTotalObjects = objects.length, forceAsync = true;
            if (!numTotalObjects) {
                callback && callback(enlivenedObjects);
                return;
            }
            objects.forEach(function(o, index) {
                if (!o || !o.type) {
                    onLoaded();
                    return;
                }
                var klass = fabric.util.getKlass(o.type, namespace);
                klass.fromObject(o, function(obj, error) {
                    error || (enlivenedObjects[index] = obj);
                    reviver && reviver(o, obj, error);
                    onLoaded();
                }, forceAsync);
            });
        },
        enlivenPatterns: function(patterns, callback) {
            patterns = patterns || [];
            function onLoaded() {
                if (++numLoadedPatterns === numPatterns) {
                    callback && callback(enlivenedPatterns);
                }
            }
            var enlivenedPatterns = [], numLoadedPatterns = 0, numPatterns = patterns.length;
            if (!numPatterns) {
                callback && callback(enlivenedPatterns);
                return;
            }
            patterns.forEach(function(p, index) {
                if (p && p.source) {
                    new fabric.Pattern(p, function(pattern) {
                        enlivenedPatterns[index] = pattern;
                        onLoaded();
                    });
                } else {
                    enlivenedPatterns[index] = p;
                    onLoaded();
                }
            });
        },
        groupSVGElements: function(elements, options, path) {
            var object;
            object = new fabric.PathGroup(elements, options);
            if (typeof path !== "undefined") {
                object.sourcePath = path;
            }
            return object;
        },
        populateWithProperties: function(source, destination, properties) {
            if (properties && Object.prototype.toString.call(properties) === "[object Array]") {
                for (var i = 0, len = properties.length; i < len; i++) {
                    if (properties[i] in source) {
                        destination[properties[i]] = source[properties[i]];
                    }
                }
            }
        },
        drawDashedLine: function(ctx, x, y, x2, y2, da) {
            var dx = x2 - x, dy = y2 - y, len = sqrt(dx * dx + dy * dy), rot = atan2(dy, dx), dc = da.length, di = 0, draw = true;
            ctx.save();
            ctx.translate(x, y);
            ctx.moveTo(0, 0);
            ctx.rotate(rot);
            x = 0;
            while (len > x) {
                x += da[di++ % dc];
                if (x > len) {
                    x = len;
                }
                ctx[draw ? "lineTo" : "moveTo"](x, 0);
                draw = !draw;
            }
            ctx.restore();
        },
        createCanvasElement: function(canvasEl) {
            canvasEl || (canvasEl = fabric.document.createElement("canvas"));
            if (!canvasEl.getContext && typeof G_vmlCanvasManager !== "undefined") {
                G_vmlCanvasManager.initElement(canvasEl);
            }
            return canvasEl;
        },
        createImage: function() {
            return fabric.isLikelyNode ? new (require("canvas").Image)() : fabric.document.createElement("img");
        },
        createAccessors: function(klass) {
            var proto = klass.prototype, i, propName, capitalizedPropName, setterName, getterName;
            for (i = proto.stateProperties.length; i--; ) {
                propName = proto.stateProperties[i];
                capitalizedPropName = propName.charAt(0).toUpperCase() + propName.slice(1);
                setterName = "set" + capitalizedPropName;
                getterName = "get" + capitalizedPropName;
                if (!proto[getterName]) {
                    proto[getterName] = function(property) {
                        return new Function('return this.get("' + property + '")');
                    }(propName);
                }
                if (!proto[setterName]) {
                    proto[setterName] = function(property) {
                        return new Function("value", 'return this.set("' + property + '", value)');
                    }(propName);
                }
            }
        },
        clipContext: function(receiver, ctx) {
            ctx.save();
            ctx.beginPath();
            receiver.clipTo(ctx);
            ctx.clip();
        },
        multiplyTransformMatrices: function(a, b, is2x2) {
            return [ a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], is2x2 ? 0 : a[0] * b[4] + a[2] * b[5] + a[4], is2x2 ? 0 : a[1] * b[4] + a[3] * b[5] + a[5] ];
        },
        qrDecompose: function(a) {
            var angle = atan2(a[1], a[0]), denom = pow(a[0], 2) + pow(a[1], 2), scaleX = sqrt(denom), scaleY = (a[0] * a[3] - a[2] * a[1]) / scaleX, skewX = atan2(a[0] * a[2] + a[1] * a[3], denom);
            return {
                angle: angle / PiBy180,
                scaleX: scaleX,
                scaleY: scaleY,
                skewX: skewX / PiBy180,
                skewY: 0,
                translateX: a[4],
                translateY: a[5]
            };
        },
        customTransformMatrix: function(scaleX, scaleY, skewX) {
            var skewMatrixX = [ 1, 0, abs(Math.tan(skewX * PiBy180)), 1 ], scaleMatrix = [ abs(scaleX), 0, 0, abs(scaleY) ];
            return fabric.util.multiplyTransformMatrices(scaleMatrix, skewMatrixX, true);
        },
        resetObjectTransform: function(target) {
            target.scaleX = 1;
            target.scaleY = 1;
            target.skewX = 0;
            target.skewY = 0;
            target.flipX = false;
            target.flipY = false;
            target.setAngle(0);
        },
        getFunctionBody: function(fn) {
            return (String(fn).match(/function[^{]*\{([\s\S]*)\}/) || {})[1];
        },
        isTransparent: function(ctx, x, y, tolerance) {
            if (tolerance > 0) {
                if (x > tolerance) {
                    x -= tolerance;
                } else {
                    x = 0;
                }
                if (y > tolerance) {
                    y -= tolerance;
                } else {
                    y = 0;
                }
            }
            var _isTransparent = true, i, temp, imageData = ctx.getImageData(x, y, tolerance * 2 || 1, tolerance * 2 || 1), l = imageData.data.length;
            for (i = 3; i < l; i += 4) {
                temp = imageData.data[i];
                _isTransparent = temp <= 0;
                if (_isTransparent === false) {
                    break;
                }
            }
            imageData = null;
            return _isTransparent;
        },
        parsePreserveAspectRatioAttribute: function(attribute) {
            var meetOrSlice = "meet", alignX = "Mid", alignY = "Mid", aspectRatioAttrs = attribute.split(" "), align;
            if (aspectRatioAttrs && aspectRatioAttrs.length) {
                meetOrSlice = aspectRatioAttrs.pop();
                if (meetOrSlice !== "meet" && meetOrSlice !== "slice") {
                    align = meetOrSlice;
                    meetOrSlice = "meet";
                } else if (aspectRatioAttrs.length) {
                    align = aspectRatioAttrs.pop();
                }
            }
            alignX = align !== "none" ? align.slice(1, 4) : "none";
            alignY = align !== "none" ? align.slice(5, 8) : "none";
            return {
                meetOrSlice: meetOrSlice,
                alignX: alignX,
                alignY: alignY
            };
        },
        clearFabricFontCache: function(fontFamily) {
            if (!fontFamily) {
                fabric.charWidthsCache = {};
            } else if (fabric.charWidthsCache[fontFamily]) {
                delete fabric.charWidthsCache[fontFamily];
            }
        },
        limitDimsByArea: function(ar, maximumArea) {
            var roughWidth = Math.sqrt(maximumArea * ar), perfLimitSizeY = Math.floor(maximumArea / roughWidth);
            return {
                x: Math.floor(roughWidth),
                y: perfLimitSizeY
            };
        },
        capValue: function(min, value, max) {
            return Math.max(min, Math.min(value, max));
        }
    };
})(typeof exports !== "undefined" ? exports : this);

(function() {
    var arcToSegmentsCache = {}, segmentToBezierCache = {}, boundsOfCurveCache = {}, _join = Array.prototype.join;
    function arcToSegments(toX, toY, rx, ry, large, sweep, rotateX) {
        var argsString = _join.call(arguments);
        if (arcToSegmentsCache[argsString]) {
            return arcToSegmentsCache[argsString];
        }
        var PI = Math.PI, th = rotateX * PI / 180, sinTh = Math.sin(th), cosTh = Math.cos(th), fromX = 0, fromY = 0;
        rx = Math.abs(rx);
        ry = Math.abs(ry);
        var px = -cosTh * toX * .5 - sinTh * toY * .5, py = -cosTh * toY * .5 + sinTh * toX * .5, rx2 = rx * rx, ry2 = ry * ry, py2 = py * py, px2 = px * px, pl = rx2 * ry2 - rx2 * py2 - ry2 * px2, root = 0;
        if (pl < 0) {
            var s = Math.sqrt(1 - pl / (rx2 * ry2));
            rx *= s;
            ry *= s;
        } else {
            root = (large === sweep ? -1 : 1) * Math.sqrt(pl / (rx2 * py2 + ry2 * px2));
        }
        var cx = root * rx * py / ry, cy = -root * ry * px / rx, cx1 = cosTh * cx - sinTh * cy + toX * .5, cy1 = sinTh * cx + cosTh * cy + toY * .5, mTheta = calcVectorAngle(1, 0, (px - cx) / rx, (py - cy) / ry), dtheta = calcVectorAngle((px - cx) / rx, (py - cy) / ry, (-px - cx) / rx, (-py - cy) / ry);
        if (sweep === 0 && dtheta > 0) {
            dtheta -= 2 * PI;
        } else if (sweep === 1 && dtheta < 0) {
            dtheta += 2 * PI;
        }
        var segments = Math.ceil(Math.abs(dtheta / PI * 2)), result = [], mDelta = dtheta / segments, mT = 8 / 3 * Math.sin(mDelta / 4) * Math.sin(mDelta / 4) / Math.sin(mDelta / 2), th3 = mTheta + mDelta;
        for (var i = 0; i < segments; i++) {
            result[i] = segmentToBezier(mTheta, th3, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY);
            fromX = result[i][4];
            fromY = result[i][5];
            mTheta = th3;
            th3 += mDelta;
        }
        arcToSegmentsCache[argsString] = result;
        return result;
    }
    function segmentToBezier(th2, th3, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY) {
        var argsString2 = _join.call(arguments);
        if (segmentToBezierCache[argsString2]) {
            return segmentToBezierCache[argsString2];
        }
        var costh2 = Math.cos(th2), sinth2 = Math.sin(th2), costh3 = Math.cos(th3), sinth3 = Math.sin(th3), toX = cosTh * rx * costh3 - sinTh * ry * sinth3 + cx1, toY = sinTh * rx * costh3 + cosTh * ry * sinth3 + cy1, cp1X = fromX + mT * (-cosTh * rx * sinth2 - sinTh * ry * costh2), cp1Y = fromY + mT * (-sinTh * rx * sinth2 + cosTh * ry * costh2), cp2X = toX + mT * (cosTh * rx * sinth3 + sinTh * ry * costh3), cp2Y = toY + mT * (sinTh * rx * sinth3 - cosTh * ry * costh3);
        segmentToBezierCache[argsString2] = [ cp1X, cp1Y, cp2X, cp2Y, toX, toY ];
        return segmentToBezierCache[argsString2];
    }
    function calcVectorAngle(ux, uy, vx, vy) {
        var ta = Math.atan2(uy, ux), tb = Math.atan2(vy, vx);
        if (tb >= ta) {
            return tb - ta;
        } else {
            return 2 * Math.PI - (ta - tb);
        }
    }
    fabric.util.drawArc = function(ctx, fx, fy, coords) {
        var rx = coords[0], ry = coords[1], rot = coords[2], large = coords[3], sweep = coords[4], tx = coords[5], ty = coords[6], segs = [ [], [], [], [] ], segsNorm = arcToSegments(tx - fx, ty - fy, rx, ry, large, sweep, rot);
        for (var i = 0, len = segsNorm.length; i < len; i++) {
            segs[i][0] = segsNorm[i][0] + fx;
            segs[i][1] = segsNorm[i][1] + fy;
            segs[i][2] = segsNorm[i][2] + fx;
            segs[i][3] = segsNorm[i][3] + fy;
            segs[i][4] = segsNorm[i][4] + fx;
            segs[i][5] = segsNorm[i][5] + fy;
            ctx.bezierCurveTo.apply(ctx, segs[i]);
        }
    };
    fabric.util.getBoundsOfArc = function(fx, fy, rx, ry, rot, large, sweep, tx, ty) {
        var fromX = 0, fromY = 0, bound, bounds = [], segs = arcToSegments(tx - fx, ty - fy, rx, ry, large, sweep, rot);
        for (var i = 0, len = segs.length; i < len; i++) {
            bound = getBoundsOfCurve(fromX, fromY, segs[i][0], segs[i][1], segs[i][2], segs[i][3], segs[i][4], segs[i][5]);
            bounds.push({
                x: bound[0].x + fx,
                y: bound[0].y + fy
            });
            bounds.push({
                x: bound[1].x + fx,
                y: bound[1].y + fy
            });
            fromX = segs[i][4];
            fromY = segs[i][5];
        }
        return bounds;
    };
    function getBoundsOfCurve(x0, y0, x1, y1, x2, y2, x3, y3) {
        var argsString = _join.call(arguments);
        if (boundsOfCurveCache[argsString]) {
            return boundsOfCurveCache[argsString];
        }
        var sqrt = Math.sqrt, min = Math.min, max = Math.max, abs = Math.abs, tvalues = [], bounds = [ [], [] ], a, b, c, t, t1, t2, b2ac, sqrtb2ac;
        b = 6 * x0 - 12 * x1 + 6 * x2;
        a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
        c = 3 * x1 - 3 * x0;
        for (var i = 0; i < 2; ++i) {
            if (i > 0) {
                b = 6 * y0 - 12 * y1 + 6 * y2;
                a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
                c = 3 * y1 - 3 * y0;
            }
            if (abs(a) < 1e-12) {
                if (abs(b) < 1e-12) {
                    continue;
                }
                t = -c / b;
                if (0 < t && t < 1) {
                    tvalues.push(t);
                }
                continue;
            }
            b2ac = b * b - 4 * c * a;
            if (b2ac < 0) {
                continue;
            }
            sqrtb2ac = sqrt(b2ac);
            t1 = (-b + sqrtb2ac) / (2 * a);
            if (0 < t1 && t1 < 1) {
                tvalues.push(t1);
            }
            t2 = (-b - sqrtb2ac) / (2 * a);
            if (0 < t2 && t2 < 1) {
                tvalues.push(t2);
            }
        }
        var x, y, j = tvalues.length, jlen = j, mt;
        while (j--) {
            t = tvalues[j];
            mt = 1 - t;
            x = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
            bounds[0][j] = x;
            y = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
            bounds[1][j] = y;
        }
        bounds[0][jlen] = x0;
        bounds[1][jlen] = y0;
        bounds[0][jlen + 1] = x3;
        bounds[1][jlen + 1] = y3;
        var result = [ {
            x: min.apply(null, bounds[0]),
            y: min.apply(null, bounds[1])
        }, {
            x: max.apply(null, bounds[0]),
            y: max.apply(null, bounds[1])
        } ];
        boundsOfCurveCache[argsString] = result;
        return result;
    }
    fabric.util.getBoundsOfCurve = getBoundsOfCurve;
})();

(function() {
    var slice = Array.prototype.slice;
    function invoke(array, method) {
        var args = slice.call(arguments, 2), result = [];
        for (var i = 0, len = array.length; i < len; i++) {
            result[i] = args.length ? array[i][method].apply(array[i], args) : array[i][method].call(array[i]);
        }
        return result;
    }
    function max(array, byProperty) {
        return find(array, byProperty, function(value1, value2) {
            return value1 >= value2;
        });
    }
    function min(array, byProperty) {
        return find(array, byProperty, function(value1, value2) {
            return value1 < value2;
        });
    }
    function fill(array, value) {
        var k = array.length;
        while (k--) {
            array[k] = value;
        }
        return array;
    }
    function find(array, byProperty, condition) {
        if (!array || array.length === 0) {
            return;
        }
        var i = array.length - 1, result = byProperty ? array[i][byProperty] : array[i];
        if (byProperty) {
            while (i--) {
                if (condition(array[i][byProperty], result)) {
                    result = array[i][byProperty];
                }
            }
        } else {
            while (i--) {
                if (condition(array[i], result)) {
                    result = array[i];
                }
            }
        }
        return result;
    }
    fabric.util.array = {
        fill: fill,
        invoke: invoke,
        min: min,
        max: max
    };
})();

(function() {
    function extend(destination, source, deep) {
        if (deep) {
            if (!fabric.isLikelyNode && source instanceof Element) {
                destination = source;
            } else if (source instanceof Array) {
                destination = [];
                for (var i = 0, len = source.length; i < len; i++) {
                    destination[i] = extend({}, source[i], deep);
                }
            } else if (source && typeof source === "object") {
                for (var property in source) {
                    if (source.hasOwnProperty(property)) {
                        destination[property] = extend({}, source[property], deep);
                    }
                }
            } else {
                destination = source;
            }
        } else {
            for (var property in source) {
                destination[property] = source[property];
            }
        }
        return destination;
    }
    function clone(object, deep) {
        return extend({}, object, deep);
    }
    fabric.util.object = {
        extend: extend,
        clone: clone
    };
})();

(function() {
    function camelize(string) {
        return string.replace(/-+(.)?/g, function(match, character) {
            return character ? character.toUpperCase() : "";
        });
    }
    function capitalize(string, firstLetterOnly) {
        return string.charAt(0).toUpperCase() + (firstLetterOnly ? string.slice(1) : string.slice(1).toLowerCase());
    }
    function escapeXml(string) {
        return string.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    fabric.util.string = {
        camelize: camelize,
        capitalize: capitalize,
        escapeXml: escapeXml
    };
})();

(function() {
    var slice = Array.prototype.slice, emptyFunction = function() {}, IS_DONTENUM_BUGGY = function() {
        for (var p in {
            toString: 1
        }) {
            if (p === "toString") {
                return false;
            }
        }
        return true;
    }(), addMethods = function(klass, source, parent) {
        for (var property in source) {
            if (property in klass.prototype && typeof klass.prototype[property] === "function" && (source[property] + "").indexOf("callSuper") > -1) {
                klass.prototype[property] = function(property) {
                    return function() {
                        var superclass = this.constructor.superclass;
                        this.constructor.superclass = parent;
                        var returnValue = source[property].apply(this, arguments);
                        this.constructor.superclass = superclass;
                        if (property !== "initialize") {
                            return returnValue;
                        }
                    };
                }(property);
            } else {
                klass.prototype[property] = source[property];
            }
            if (IS_DONTENUM_BUGGY) {
                if (source.toString !== Object.prototype.toString) {
                    klass.prototype.toString = source.toString;
                }
                if (source.valueOf !== Object.prototype.valueOf) {
                    klass.prototype.valueOf = source.valueOf;
                }
            }
        }
    };
    function Subclass() {}
    function callSuper(methodName) {
        var parentMethod = null, _this = this;
        while (_this.constructor.superclass) {
            var superClassMethod = _this.constructor.superclass.prototype[methodName];
            if (_this[methodName] !== superClassMethod) {
                parentMethod = superClassMethod;
                break;
            }
            _this = _this.constructor.superclass.prototype;
        }
        if (!parentMethod) {
            return console.log("tried to callSuper " + methodName + ", method not found in prototype chain", this);
        }
        return arguments.length > 1 ? parentMethod.apply(this, slice.call(arguments, 1)) : parentMethod.call(this);
    }
    function createClass() {
        var parent = null, properties = slice.call(arguments, 0);
        if (typeof properties[0] === "function") {
            parent = properties.shift();
        }
        function klass() {
            this.initialize.apply(this, arguments);
        }
        klass.superclass = parent;
        klass.subclasses = [];
        if (parent) {
            Subclass.prototype = parent.prototype;
            klass.prototype = new Subclass();
            parent.subclasses.push(klass);
        }
        for (var i = 0, length = properties.length; i < length; i++) {
            addMethods(klass, properties[i], parent);
        }
        if (!klass.prototype.initialize) {
            klass.prototype.initialize = emptyFunction;
        }
        klass.prototype.constructor = klass;
        klass.prototype.callSuper = callSuper;
        return klass;
    }
    fabric.util.createClass = createClass;
})();

(function() {
    var unknown = "unknown";
    function areHostMethods(object) {
        var methodNames = Array.prototype.slice.call(arguments, 1), t, i, len = methodNames.length;
        for (i = 0; i < len; i++) {
            t = typeof object[methodNames[i]];
            if (!/^(?:function|object|unknown)$/.test(t)) {
                return false;
            }
        }
        return true;
    }
    var getElement, setElement, getUniqueId = function() {
        var uid = 0;
        return function(element) {
            return element.__uniqueID || (element.__uniqueID = "uniqueID__" + uid++);
        };
    }();
    (function() {
        var elements = {};
        getElement = function(uid) {
            return elements[uid];
        };
        setElement = function(uid, element) {
            elements[uid] = element;
        };
    })();
    function createListener(uid, handler) {
        return {
            handler: handler,
            wrappedHandler: createWrappedHandler(uid, handler)
        };
    }
    function createWrappedHandler(uid, handler) {
        return function(e) {
            handler.call(getElement(uid), e || fabric.window.event);
        };
    }
    function createDispatcher(uid, eventName) {
        return function(e) {
            if (handlers[uid] && handlers[uid][eventName]) {
                var handlersForEvent = handlers[uid][eventName];
                for (var i = 0, len = handlersForEvent.length; i < len; i++) {
                    handlersForEvent[i].call(this, e || fabric.window.event);
                }
            }
        };
    }
    var shouldUseAddListenerRemoveListener = areHostMethods(fabric.document.documentElement, "addEventListener", "removeEventListener") && areHostMethods(fabric.window, "addEventListener", "removeEventListener"), shouldUseAttachEventDetachEvent = areHostMethods(fabric.document.documentElement, "attachEvent", "detachEvent") && areHostMethods(fabric.window, "attachEvent", "detachEvent"), listeners = {}, handlers = {}, addListener, removeListener;
    if (shouldUseAddListenerRemoveListener) {
        addListener = function(element, eventName, handler, options) {
            element && element.addEventListener(eventName, handler, shouldUseAttachEventDetachEvent ? false : options);
        };
        removeListener = function(element, eventName, handler, options) {
            element && element.removeEventListener(eventName, handler, shouldUseAttachEventDetachEvent ? false : options);
        };
    } else if (shouldUseAttachEventDetachEvent) {
        addListener = function(element, eventName, handler) {
            if (!element) {
                return;
            }
            var uid = getUniqueId(element);
            setElement(uid, element);
            if (!listeners[uid]) {
                listeners[uid] = {};
            }
            if (!listeners[uid][eventName]) {
                listeners[uid][eventName] = [];
            }
            var listener = createListener(uid, handler);
            listeners[uid][eventName].push(listener);
            element.attachEvent("on" + eventName, listener.wrappedHandler);
        };
        removeListener = function(element, eventName, handler) {
            if (!element) {
                return;
            }
            var uid = getUniqueId(element), listener;
            if (listeners[uid] && listeners[uid][eventName]) {
                for (var i = 0, len = listeners[uid][eventName].length; i < len; i++) {
                    listener = listeners[uid][eventName][i];
                    if (listener && listener.handler === handler) {
                        element.detachEvent("on" + eventName, listener.wrappedHandler);
                        listeners[uid][eventName][i] = null;
                    }
                }
            }
        };
    } else {
        addListener = function(element, eventName, handler) {
            if (!element) {
                return;
            }
            var uid = getUniqueId(element);
            if (!handlers[uid]) {
                handlers[uid] = {};
            }
            if (!handlers[uid][eventName]) {
                handlers[uid][eventName] = [];
                var existingHandler = element["on" + eventName];
                if (existingHandler) {
                    handlers[uid][eventName].push(existingHandler);
                }
                element["on" + eventName] = createDispatcher(uid, eventName);
            }
            handlers[uid][eventName].push(handler);
        };
        removeListener = function(element, eventName, handler) {
            if (!element) {
                return;
            }
            var uid = getUniqueId(element);
            if (handlers[uid] && handlers[uid][eventName]) {
                var handlersForEvent = handlers[uid][eventName];
                for (var i = 0, len = handlersForEvent.length; i < len; i++) {
                    if (handlersForEvent[i] === handler) {
                        handlersForEvent.splice(i, 1);
                    }
                }
            }
        };
    }
    fabric.util.addListener = addListener;
    fabric.util.removeListener = removeListener;
    function getPointer(event) {
        event || (event = fabric.window.event);
        var element = event.target || (typeof event.srcElement !== unknown ? event.srcElement : null), scroll = fabric.util.getScrollLeftTop(element);
        return {
            x: pointerX(event) + scroll.left,
            y: pointerY(event) + scroll.top
        };
    }
    var pointerX = function(event) {
        return typeof event.clientX !== unknown ? event.clientX : 0;
    }, pointerY = function(event) {
        return typeof event.clientY !== unknown ? event.clientY : 0;
    };
    function _getPointer(event, pageProp, clientProp) {
        var touchProp = event.type === "touchend" ? "changedTouches" : "touches";
        return event[touchProp] && event[touchProp][0] ? event[touchProp][0][pageProp] - (event[touchProp][0][pageProp] - event[touchProp][0][clientProp]) || event[clientProp] : event[clientProp];
    }
    if (fabric.isTouchSupported) {
        pointerX = function(event) {
            return _getPointer(event, "pageX", "clientX");
        };
        pointerY = function(event) {
            return _getPointer(event, "pageY", "clientY");
        };
    }
    fabric.util.getPointer = getPointer;
    fabric.util.object.extend(fabric.util, fabric.Observable);
})();

(function() {
    function setStyle(element, styles) {
        var elementStyle = element.style;
        if (!elementStyle) {
            return element;
        }
        if (typeof styles === "string") {
            element.style.cssText += ";" + styles;
            return styles.indexOf("opacity") > -1 ? setOpacity(element, styles.match(/opacity:\s*(\d?\.?\d*)/)[1]) : element;
        }
        for (var property in styles) {
            if (property === "opacity") {
                setOpacity(element, styles[property]);
            } else {
                var normalizedProperty = property === "float" || property === "cssFloat" ? typeof elementStyle.styleFloat === "undefined" ? "cssFloat" : "styleFloat" : property;
                elementStyle[normalizedProperty] = styles[property];
            }
        }
        return element;
    }
    var parseEl = fabric.document.createElement("div"), supportsOpacity = typeof parseEl.style.opacity === "string", supportsFilters = typeof parseEl.style.filter === "string", reOpacity = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/, setOpacity = function(element) {
        return element;
    };
    if (supportsOpacity) {
        setOpacity = function(element, value) {
            element.style.opacity = value;
            return element;
        };
    } else if (supportsFilters) {
        setOpacity = function(element, value) {
            var es = element.style;
            if (element.currentStyle && !element.currentStyle.hasLayout) {
                es.zoom = 1;
            }
            if (reOpacity.test(es.filter)) {
                value = value >= .9999 ? "" : "alpha(opacity=" + value * 100 + ")";
                es.filter = es.filter.replace(reOpacity, value);
            } else {
                es.filter += " alpha(opacity=" + value * 100 + ")";
            }
            return element;
        };
    }
    fabric.util.setStyle = setStyle;
})();

(function() {
    var _slice = Array.prototype.slice;
    function getById(id) {
        return typeof id === "string" ? fabric.document.getElementById(id) : id;
    }
    var sliceCanConvertNodelists, toArray = function(arrayLike) {
        return _slice.call(arrayLike, 0);
    };
    try {
        sliceCanConvertNodelists = toArray(fabric.document.childNodes) instanceof Array;
    } catch (err) {}
    if (!sliceCanConvertNodelists) {
        toArray = function(arrayLike) {
            var arr = new Array(arrayLike.length), i = arrayLike.length;
            while (i--) {
                arr[i] = arrayLike[i];
            }
            return arr;
        };
    }
    function makeElement(tagName, attributes) {
        var el = fabric.document.createElement(tagName);
        for (var prop in attributes) {
            if (prop === "class") {
                el.className = attributes[prop];
            } else if (prop === "for") {
                el.htmlFor = attributes[prop];
            } else {
                el.setAttribute(prop, attributes[prop]);
            }
        }
        return el;
    }
    function addClass(element, className) {
        if (element && (" " + element.className + " ").indexOf(" " + className + " ") === -1) {
            element.className += (element.className ? " " : "") + className;
        }
    }
    function wrapElement(element, wrapper, attributes) {
        if (typeof wrapper === "string") {
            wrapper = makeElement(wrapper, attributes);
        }
        if (element.parentNode) {
            element.parentNode.replaceChild(wrapper, element);
        }
        wrapper.appendChild(element);
        return wrapper;
    }
    function getScrollLeftTop(element) {
        var left = 0, top = 0, docElement = fabric.document.documentElement, body = fabric.document.body || {
            scrollLeft: 0,
            scrollTop: 0
        };
        while (element && (element.parentNode || element.host)) {
            element = element.parentNode || element.host;
            if (element === fabric.document) {
                left = body.scrollLeft || docElement.scrollLeft || 0;
                top = body.scrollTop || docElement.scrollTop || 0;
            } else {
                left += element.scrollLeft || 0;
                top += element.scrollTop || 0;
            }
            if (element.nodeType === 1 && fabric.util.getElementStyle(element, "position") === "fixed") {
                break;
            }
        }
        return {
            left: left,
            top: top
        };
    }
    function getElementOffset(element) {
        var docElem, doc = element && element.ownerDocument, box = {
            left: 0,
            top: 0
        }, offset = {
            left: 0,
            top: 0
        }, scrollLeftTop, offsetAttributes = {
            borderLeftWidth: "left",
            borderTopWidth: "top",
            paddingLeft: "left",
            paddingTop: "top"
        };
        if (!doc) {
            return offset;
        }
        for (var attr in offsetAttributes) {
            offset[offsetAttributes[attr]] += parseInt(getElementStyle(element, attr), 10) || 0;
        }
        docElem = doc.documentElement;
        if (typeof element.getBoundingClientRect !== "undefined") {
            box = element.getBoundingClientRect();
        }
        scrollLeftTop = getScrollLeftTop(element);
        return {
            left: box.left + scrollLeftTop.left - (docElem.clientLeft || 0) + offset.left,
            top: box.top + scrollLeftTop.top - (docElem.clientTop || 0) + offset.top
        };
    }
    var getElementStyle;
    if (fabric.document.defaultView && fabric.document.defaultView.getComputedStyle) {
        getElementStyle = function(element, attr) {
            var style = fabric.document.defaultView.getComputedStyle(element, null);
            return style ? style[attr] : undefined;
        };
    } else {
        getElementStyle = function(element, attr) {
            var value = element.style[attr];
            if (!value && element.currentStyle) {
                value = element.currentStyle[attr];
            }
            return value;
        };
    }
    (function() {
        var style = fabric.document.documentElement.style, selectProp = "userSelect" in style ? "userSelect" : "MozUserSelect" in style ? "MozUserSelect" : "WebkitUserSelect" in style ? "WebkitUserSelect" : "KhtmlUserSelect" in style ? "KhtmlUserSelect" : "";
        function makeElementUnselectable(element) {
            if (typeof element.onselectstart !== "undefined") {
                element.onselectstart = fabric.util.falseFunction;
            }
            if (selectProp) {
                element.style[selectProp] = "none";
            } else if (typeof element.unselectable === "string") {
                element.unselectable = "on";
            }
            return element;
        }
        function makeElementSelectable(element) {
            if (typeof element.onselectstart !== "undefined") {
                element.onselectstart = null;
            }
            if (selectProp) {
                element.style[selectProp] = "";
            } else if (typeof element.unselectable === "string") {
                element.unselectable = "";
            }
            return element;
        }
        fabric.util.makeElementUnselectable = makeElementUnselectable;
        fabric.util.makeElementSelectable = makeElementSelectable;
    })();
    (function() {
        function getScript(url, callback) {
            var headEl = fabric.document.getElementsByTagName("head")[0], scriptEl = fabric.document.createElement("script"), loading = true;
            scriptEl.onload = scriptEl.onreadystatechange = function(e) {
                if (loading) {
                    if (typeof this.readyState === "string" && this.readyState !== "loaded" && this.readyState !== "complete") {
                        return;
                    }
                    loading = false;
                    callback(e || fabric.window.event);
                    scriptEl = scriptEl.onload = scriptEl.onreadystatechange = null;
                }
            };
            scriptEl.src = url;
            headEl.appendChild(scriptEl);
        }
        fabric.util.getScript = getScript;
    })();
    fabric.util.getById = getById;
    fabric.util.toArray = toArray;
    fabric.util.makeElement = makeElement;
    fabric.util.addClass = addClass;
    fabric.util.wrapElement = wrapElement;
    fabric.util.getScrollLeftTop = getScrollLeftTop;
    fabric.util.getElementOffset = getElementOffset;
    fabric.util.getElementStyle = getElementStyle;
})();

(function() {
    function addParamToUrl(url, param) {
        return url + (/\?/.test(url) ? "&" : "?") + param;
    }
    var makeXHR = function() {
        var factories = [ function() {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }, function() {
            return new ActiveXObject("Msxml2.XMLHTTP");
        }, function() {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        }, function() {
            return new XMLHttpRequest();
        } ];
        for (var i = factories.length; i--; ) {
            try {
                var req = factories[i]();
                if (req) {
                    return factories[i];
                }
            } catch (err) {}
        }
    }();
    function emptyFn() {}
    function request(url, options) {
        options || (options = {});
        var method = options.method ? options.method.toUpperCase() : "GET", onComplete = options.onComplete || function() {}, xhr = makeXHR(), body = options.body || options.parameters;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                onComplete(xhr);
                xhr.onreadystatechange = emptyFn;
            }
        };
        if (method === "GET") {
            body = null;
            if (typeof options.parameters === "string") {
                url = addParamToUrl(url, options.parameters);
            }
        }
        xhr.open(method, url, true);
        if (method === "POST" || method === "PUT") {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        xhr.send(body);
        return xhr;
    }
    fabric.util.request = request;
})();

fabric.log = function() {};

fabric.warn = function() {};

if (typeof console !== "undefined") {
    [ "log", "warn" ].forEach(function(methodName) {
        if (typeof console[methodName] !== "undefined" && typeof console[methodName].apply === "function") {
            fabric[methodName] = function() {
                return console[methodName].apply(console, arguments);
            };
        }
    });
}

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});
    if (fabric.Point) {
        fabric.warn("fabric.Point is already defined");
        return;
    }
    fabric.Point = Point;
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype = {
        type: "point",
        constructor: Point,
        add: function(that) {
            return new Point(this.x + that.x, this.y + that.y);
        },
        addEquals: function(that) {
            this.x += that.x;
            this.y += that.y;
            return this;
        },
        scalarAdd: function(scalar) {
            return new Point(this.x + scalar, this.y + scalar);
        },
        scalarAddEquals: function(scalar) {
            this.x += scalar;
            this.y += scalar;
            return this;
        },
        subtract: function(that) {
            return new Point(this.x - that.x, this.y - that.y);
        },
        subtractEquals: function(that) {
            this.x -= that.x;
            this.y -= that.y;
            return this;
        },
        scalarSubtract: function(scalar) {
            return new Point(this.x - scalar, this.y - scalar);
        },
        scalarSubtractEquals: function(scalar) {
            this.x -= scalar;
            this.y -= scalar;
            return this;
        },
        multiply: function(scalar) {
            return new Point(this.x * scalar, this.y * scalar);
        },
        multiplyEquals: function(scalar) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        },
        divide: function(scalar) {
            return new Point(this.x / scalar, this.y / scalar);
        },
        divideEquals: function(scalar) {
            this.x /= scalar;
            this.y /= scalar;
            return this;
        },
        eq: function(that) {
            return this.x === that.x && this.y === that.y;
        },
        lt: function(that) {
            return this.x < that.x && this.y < that.y;
        },
        lte: function(that) {
            return this.x <= that.x && this.y <= that.y;
        },
        gt: function(that) {
            return this.x > that.x && this.y > that.y;
        },
        gte: function(that) {
            return this.x >= that.x && this.y >= that.y;
        },
        lerp: function(that, t) {
            if (typeof t === "undefined") {
                t = .5;
            }
            t = Math.max(Math.min(1, t), 0);
            return new Point(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
        },
        distanceFrom: function(that) {
            var dx = this.x - that.x, dy = this.y - that.y;
            return Math.sqrt(dx * dx + dy * dy);
        },
        midPointFrom: function(that) {
            return this.lerp(that);
        },
        min: function(that) {
            return new Point(Math.min(this.x, that.x), Math.min(this.y, that.y));
        },
        max: function(that) {
            return new Point(Math.max(this.x, that.x), Math.max(this.y, that.y));
        },
        toString: function() {
            return this.x + "," + this.y;
        },
        setXY: function(x, y) {
            this.x = x;
            this.y = y;
            return this;
        },
        setX: function(x) {
            this.x = x;
            return this;
        },
        setY: function(y) {
            this.y = y;
            return this;
        },
        setFromPoint: function(that) {
            this.x = that.x;
            this.y = that.y;
            return this;
        },
        swap: function(that) {
            var x = this.x, y = this.y;
            this.x = that.x;
            this.y = that.y;
            that.x = x;
            that.y = y;
        },
        clone: function() {
            return new Point(this.x, this.y);
        }
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});
    if (fabric.Intersection) {
        fabric.warn("fabric.Intersection is already defined");
        return;
    }
    function Intersection(status) {
        this.status = status;
        this.points = [];
    }
    fabric.Intersection = Intersection;
    fabric.Intersection.prototype = {
        constructor: Intersection,
        appendPoint: function(point) {
            this.points.push(point);
            return this;
        },
        appendPoints: function(points) {
            this.points = this.points.concat(points);
            return this;
        }
    };
    fabric.Intersection.intersectLineLine = function(a1, a2, b1, b2) {
        var result, uaT = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x), ubT = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x), uB = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
        if (uB !== 0) {
            var ua = uaT / uB, ub = ubT / uB;
            if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
                result = new Intersection("Intersection");
                result.appendPoint(new fabric.Point(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)));
            } else {
                result = new Intersection();
            }
        } else {
            if (uaT === 0 || ubT === 0) {
                result = new Intersection("Coincident");
            } else {
                result = new Intersection("Parallel");
            }
        }
        return result;
    };
    fabric.Intersection.intersectLinePolygon = function(a1, a2, points) {
        var result = new Intersection(), length = points.length, b1, b2, inter;
        for (var i = 0; i < length; i++) {
            b1 = points[i];
            b2 = points[(i + 1) % length];
            inter = Intersection.intersectLineLine(a1, a2, b1, b2);
            result.appendPoints(inter.points);
        }
        if (result.points.length > 0) {
            result.status = "Intersection";
        }
        return result;
    };
    fabric.Intersection.intersectPolygonPolygon = function(points1, points2) {
        var result = new Intersection(), length = points1.length;
        for (var i = 0; i < length; i++) {
            var a1 = points1[i], a2 = points1[(i + 1) % length], inter = Intersection.intersectLinePolygon(a1, a2, points2);
            result.appendPoints(inter.points);
        }
        if (result.points.length > 0) {
            result.status = "Intersection";
        }
        return result;
    };
    fabric.Intersection.intersectPolygonRectangle = function(points, r1, r2) {
        var min = r1.min(r2), max = r1.max(r2), topRight = new fabric.Point(max.x, min.y), bottomLeft = new fabric.Point(min.x, max.y), inter1 = Intersection.intersectLinePolygon(min, topRight, points), inter2 = Intersection.intersectLinePolygon(topRight, max, points), inter3 = Intersection.intersectLinePolygon(max, bottomLeft, points), inter4 = Intersection.intersectLinePolygon(bottomLeft, min, points), result = new Intersection();
        result.appendPoints(inter1.points);
        result.appendPoints(inter2.points);
        result.appendPoints(inter3.points);
        result.appendPoints(inter4.points);
        if (result.points.length > 0) {
            result.status = "Intersection";
        }
        return result;
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});
    if (fabric.Color) {
        fabric.warn("fabric.Color is already defined.");
        return;
    }
    function Color(color) {
        if (!color) {
            this.setSource([ 0, 0, 0, 1 ]);
        } else {
            this._tryParsingColor(color);
        }
    }
    fabric.Color = Color;
    fabric.Color.prototype = {
        _tryParsingColor: function(color) {
            var source;
            if (color in Color.colorNameMap) {
                color = Color.colorNameMap[color];
            }
            if (color === "transparent") {
                source = [ 255, 255, 255, 0 ];
            }
            if (!source) {
                source = Color.sourceFromHex(color);
            }
            if (!source) {
                source = Color.sourceFromRgb(color);
            }
            if (!source) {
                source = Color.sourceFromHsl(color);
            }
            if (!source) {
                source = [ 0, 0, 0, 1 ];
            }
            if (source) {
                this.setSource(source);
            }
        },
        _rgbToHsl: function(r, g, b) {
            r /= 255;
            g /= 255;
            b /= 255;
            var h, s, l, max = fabric.util.array.max([ r, g, b ]), min = fabric.util.array.min([ r, g, b ]);
            l = (max + min) / 2;
            if (max === min) {
                h = s = 0;
            } else {
                var d = max - min;
                s = l > .5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                  case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;

                  case g:
                    h = (b - r) / d + 2;
                    break;

                  case b:
                    h = (r - g) / d + 4;
                    break;
                }
                h /= 6;
            }
            return [ Math.round(h * 360), Math.round(s * 100), Math.round(l * 100) ];
        },
        getSource: function() {
            return this._source;
        },
        setSource: function(source) {
            this._source = source;
        },
        toRgb: function() {
            var source = this.getSource();
            return "rgb(" + source[0] + "," + source[1] + "," + source[2] + ")";
        },
        toRgba: function() {
            var source = this.getSource();
            return "rgba(" + source[0] + "," + source[1] + "," + source[2] + "," + source[3] + ")";
        },
        toHsl: function() {
            var source = this.getSource(), hsl = this._rgbToHsl(source[0], source[1], source[2]);
            return "hsl(" + hsl[0] + "," + hsl[1] + "%," + hsl[2] + "%)";
        },
        toHsla: function() {
            var source = this.getSource(), hsl = this._rgbToHsl(source[0], source[1], source[2]);
            return "hsla(" + hsl[0] + "," + hsl[1] + "%," + hsl[2] + "%," + source[3] + ")";
        },
        toHex: function() {
            var source = this.getSource(), r, g, b;
            r = source[0].toString(16);
            r = r.length === 1 ? "0" + r : r;
            g = source[1].toString(16);
            g = g.length === 1 ? "0" + g : g;
            b = source[2].toString(16);
            b = b.length === 1 ? "0" + b : b;
            return r.toUpperCase() + g.toUpperCase() + b.toUpperCase();
        },
        toHexa: function() {
            var source = this.getSource(), a;
            a = source[3] * 255;
            a = a.toString(16);
            a = a.length === 1 ? "0" + a : a;
            return this.toHex() + a.toUpperCase();
        },
        getAlpha: function() {
            return this.getSource()[3];
        },
        setAlpha: function(alpha) {
            var source = this.getSource();
            source[3] = alpha;
            this.setSource(source);
            return this;
        },
        toGrayscale: function() {
            var source = this.getSource(), average = parseInt((source[0] * .3 + source[1] * .59 + source[2] * .11).toFixed(0), 10), currentAlpha = source[3];
            this.setSource([ average, average, average, currentAlpha ]);
            return this;
        },
        toBlackWhite: function(threshold) {
            var source = this.getSource(), average = (source[0] * .3 + source[1] * .59 + source[2] * .11).toFixed(0), currentAlpha = source[3];
            threshold = threshold || 127;
            average = Number(average) < Number(threshold) ? 0 : 255;
            this.setSource([ average, average, average, currentAlpha ]);
            return this;
        },
        overlayWith: function(otherColor) {
            if (!(otherColor instanceof Color)) {
                otherColor = new Color(otherColor);
            }
            var result = [], alpha = this.getAlpha(), otherAlpha = .5, source = this.getSource(), otherSource = otherColor.getSource();
            for (var i = 0; i < 3; i++) {
                result.push(Math.round(source[i] * (1 - otherAlpha) + otherSource[i] * otherAlpha));
            }
            result[3] = alpha;
            this.setSource(result);
            return this;
        }
    };
    fabric.Color.reRGBa = /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*((?:\d*\.?\d+)?)\s*)?\)$/;
    fabric.Color.reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/;
    fabric.Color.reHex = /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i;
    fabric.Color.colorNameMap = {
        aqua: "#00FFFF",
        black: "#000000",
        blue: "#0000FF",
        fuchsia: "#FF00FF",
        gray: "#808080",
        grey: "#808080",
        green: "#008000",
        lime: "#00FF00",
        maroon: "#800000",
        navy: "#000080",
        olive: "#808000",
        orange: "#FFA500",
        purple: "#800080",
        red: "#FF0000",
        silver: "#C0C0C0",
        teal: "#008080",
        white: "#FFFFFF",
        yellow: "#FFFF00"
    };
    function hue2rgb(p, q, t) {
        if (t < 0) {
            t += 1;
        }
        if (t > 1) {
            t -= 1;
        }
        if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
            return q;
        }
        if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
    }
    fabric.Color.fromRgb = function(color) {
        return Color.fromSource(Color.sourceFromRgb(color));
    };
    fabric.Color.sourceFromRgb = function(color) {
        var match = color.match(Color.reRGBa);
        if (match) {
            var r = parseInt(match[1], 10) / (/%$/.test(match[1]) ? 100 : 1) * (/%$/.test(match[1]) ? 255 : 1), g = parseInt(match[2], 10) / (/%$/.test(match[2]) ? 100 : 1) * (/%$/.test(match[2]) ? 255 : 1), b = parseInt(match[3], 10) / (/%$/.test(match[3]) ? 100 : 1) * (/%$/.test(match[3]) ? 255 : 1);
            return [ parseInt(r, 10), parseInt(g, 10), parseInt(b, 10), match[4] ? parseFloat(match[4]) : 1 ];
        }
    };
    fabric.Color.fromRgba = Color.fromRgb;
    fabric.Color.fromHsl = function(color) {
        return Color.fromSource(Color.sourceFromHsl(color));
    };
    fabric.Color.sourceFromHsl = function(color) {
        var match = color.match(Color.reHSLa);
        if (!match) {
            return;
        }
        var h = (parseFloat(match[1]) % 360 + 360) % 360 / 360, s = parseFloat(match[2]) / (/%$/.test(match[2]) ? 100 : 1), l = parseFloat(match[3]) / (/%$/.test(match[3]) ? 100 : 1), r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            var q = l <= .5 ? l * (s + 1) : l + s - l * s, p = l * 2 - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), match[4] ? parseFloat(match[4]) : 1 ];
    };
    fabric.Color.fromHsla = Color.fromHsl;
    fabric.Color.fromHex = function(color) {
        return Color.fromSource(Color.sourceFromHex(color));
    };
    fabric.Color.sourceFromHex = function(color) {
        if (color.match(Color.reHex)) {
            var value = color.slice(color.indexOf("#") + 1), isShortNotation = value.length === 3 || value.length === 4, isRGBa = value.length === 8 || value.length === 4, r = isShortNotation ? value.charAt(0) + value.charAt(0) : value.substring(0, 2), g = isShortNotation ? value.charAt(1) + value.charAt(1) : value.substring(2, 4), b = isShortNotation ? value.charAt(2) + value.charAt(2) : value.substring(4, 6), a = isRGBa ? isShortNotation ? value.charAt(3) + value.charAt(3) : value.substring(6, 8) : "FF";
            return [ parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), parseFloat((parseInt(a, 16) / 255).toFixed(2)) ];
        }
    };
    fabric.Color.fromSource = function(source) {
        var oColor = new Color();
        oColor.setSource(source);
        return oColor;
    };
})(typeof exports !== "undefined" ? exports : this);

(function() {
    "use strict";
    if (fabric.StaticCanvas) {
        fabric.warn("fabric.StaticCanvas is already defined.");
        return;
    }
    var extend = fabric.util.object.extend, getElementOffset = fabric.util.getElementOffset, removeFromArray = fabric.util.removeFromArray, toFixed = fabric.util.toFixed, transformPoint = fabric.util.transformPoint, invertTransform = fabric.util.invertTransform, CANVAS_INIT_ERROR = new Error("Could not initialize `canvas` element");
    fabric.StaticCanvas = fabric.util.createClass(fabric.CommonMethods, {
        initialize: function(el, options) {
            options || (options = {});
            this._initStatic(el, options);
        },
        backgroundColor: "",
        backgroundImage: null,
        overlayColor: "",
        overlayImage: null,
        includeDefaultValues: true,
        stateful: false,
        renderOnAddRemove: true,
        clipTo: null,
        controlsAboveOverlay: false,
        allowTouchScrolling: false,
        imageSmoothingEnabled: true,
        viewportTransform: fabric.iMatrix.concat(),
        backgroundVpt: true,
        overlayVpt: true,
        onBeforeScaleRotate: function() {},
        enableRetinaScaling: true,
        vptCoords: {},
        skipOffscreen: false,
        _initStatic: function(el, options) {
            var cb = fabric.StaticCanvas.prototype.renderAll.bind(this);
            this._objects = [];
            this._createLowerCanvas(el);
            this._initOptions(options);
            this._setImageSmoothing();
            if (!this.interactive) {
                this._initRetinaScaling();
            }
            if (options.overlayImage) {
                this.setOverlayImage(options.overlayImage, cb);
            }
            if (options.backgroundImage) {
                this.setBackgroundImage(options.backgroundImage, cb);
            }
            if (options.backgroundColor) {
                this.setBackgroundColor(options.backgroundColor, cb);
            }
            if (options.overlayColor) {
                this.setOverlayColor(options.overlayColor, cb);
            }
            this.calcOffset();
        },
        _isRetinaScaling: function() {
            return fabric.devicePixelRatio !== 1 && this.enableRetinaScaling;
        },
        getRetinaScaling: function() {
            return this._isRetinaScaling() ? fabric.devicePixelRatio : 1;
        },
        _initRetinaScaling: function() {
            if (!this._isRetinaScaling()) {
                return;
            }
            this.lowerCanvasEl.setAttribute("width", this.width * fabric.devicePixelRatio);
            this.lowerCanvasEl.setAttribute("height", this.height * fabric.devicePixelRatio);
            this.contextContainer.scale(fabric.devicePixelRatio, fabric.devicePixelRatio);
        },
        calcOffset: function() {
            this._offset = getElementOffset(this.lowerCanvasEl);
            return this;
        },
        setOverlayImage: function(image, callback, options) {
            return this.__setBgOverlayImage("overlayImage", image, callback, options);
        },
        setBackgroundImage: function(image, callback, options) {
            return this.__setBgOverlayImage("backgroundImage", image, callback, options);
        },
        setOverlayColor: function(overlayColor, callback) {
            return this.__setBgOverlayColor("overlayColor", overlayColor, callback);
        },
        setBackgroundColor: function(backgroundColor, callback) {
            return this.__setBgOverlayColor("backgroundColor", backgroundColor, callback);
        },
        _setImageSmoothing: function() {
            var ctx = this.getContext();
            ctx.imageSmoothingEnabled = ctx.imageSmoothingEnabled || ctx.webkitImageSmoothingEnabled || ctx.mozImageSmoothingEnabled || ctx.msImageSmoothingEnabled || ctx.oImageSmoothingEnabled;
            ctx.imageSmoothingEnabled = this.imageSmoothingEnabled;
        },
        __setBgOverlayImage: function(property, image, callback, options) {
            if (typeof image === "string") {
                fabric.util.loadImage(image, function(img) {
                    img && (this[property] = new fabric.Image(img, options));
                    callback && callback(img);
                }, this, options && options.crossOrigin);
            } else {
                options && image.setOptions(options);
                this[property] = image;
                callback && callback(image);
            }
            return this;
        },
        __setBgOverlayColor: function(property, color, callback) {
            this[property] = color;
            this._initGradient(color, property);
            this._initPattern(color, property, callback);
            return this;
        },
        _createCanvasElement: function(canvasEl) {
            var element = fabric.util.createCanvasElement(canvasEl);
            if (!element.style) {
                element.style = {};
            }
            if (!element) {
                throw CANVAS_INIT_ERROR;
            }
            if (typeof element.getContext === "undefined") {
                throw CANVAS_INIT_ERROR;
            }
            return element;
        },
        _initOptions: function(options) {
            this._setOptions(options);
            this.width = this.width || parseInt(this.lowerCanvasEl.width, 10) || 0;
            this.height = this.height || parseInt(this.lowerCanvasEl.height, 10) || 0;
            if (!this.lowerCanvasEl.style) {
                return;
            }
            this.lowerCanvasEl.width = this.width;
            this.lowerCanvasEl.height = this.height;
            this.lowerCanvasEl.style.width = this.width + "px";
            this.lowerCanvasEl.style.height = this.height + "px";
            this.viewportTransform = this.viewportTransform.slice();
        },
        _createLowerCanvas: function(canvasEl) {
            this.lowerCanvasEl = fabric.util.getById(canvasEl) || this._createCanvasElement(canvasEl);
            fabric.util.addClass(this.lowerCanvasEl, "lower-canvas");
            if (this.interactive) {
                this._applyCanvasStyle(this.lowerCanvasEl);
            }
            this.contextContainer = this.lowerCanvasEl.getContext("2d");
        },
        getWidth: function() {
            return this.width;
        },
        getHeight: function() {
            return this.height;
        },
        setWidth: function(value, options) {
            return this.setDimensions({
                width: value
            }, options);
        },
        setHeight: function(value, options) {
            return this.setDimensions({
                height: value
            }, options);
        },
        setDimensions: function(dimensions, options) {
            var cssValue;
            options = options || {};
            for (var prop in dimensions) {
                cssValue = dimensions[prop];
                if (!options.cssOnly) {
                    this._setBackstoreDimension(prop, dimensions[prop]);
                    cssValue += "px";
                }
                if (!options.backstoreOnly) {
                    this._setCssDimension(prop, cssValue);
                }
            }
            this._initRetinaScaling();
            this._setImageSmoothing();
            this.calcOffset();
            if (!options.cssOnly) {
                this.renderAll();
            }
            return this;
        },
        _setBackstoreDimension: function(prop, value) {
            this.lowerCanvasEl[prop] = value;
            if (this.upperCanvasEl) {
                this.upperCanvasEl[prop] = value;
            }
            if (this.cacheCanvasEl) {
                this.cacheCanvasEl[prop] = value;
            }
            this[prop] = value;
            return this;
        },
        _setCssDimension: function(prop, value) {
            this.lowerCanvasEl.style[prop] = value;
            if (this.upperCanvasEl) {
                this.upperCanvasEl.style[prop] = value;
            }
            if (this.wrapperEl) {
                this.wrapperEl.style[prop] = value;
            }
            return this;
        },
        getZoom: function() {
            return this.viewportTransform[0];
        },
        setViewportTransform: function(vpt) {
            var activeGroup = this._activeGroup, object, ignoreVpt = false, skipAbsolute = true;
            this.viewportTransform = vpt;
            for (var i = 0, len = this._objects.length; i < len; i++) {
                object = this._objects[i];
                object.group || object.setCoords(ignoreVpt, skipAbsolute);
            }
            if (activeGroup) {
                activeGroup.setCoords(ignoreVpt, skipAbsolute);
            }
            this.calcViewportBoundaries();
            this.renderAll();
            return this;
        },
        zoomToPoint: function(point, value) {
            var before = point, vpt = this.viewportTransform.slice(0);
            point = transformPoint(point, invertTransform(this.viewportTransform));
            vpt[0] = value;
            vpt[3] = value;
            var after = transformPoint(point, vpt);
            vpt[4] += before.x - after.x;
            vpt[5] += before.y - after.y;
            return this.setViewportTransform(vpt);
        },
        setZoom: function(value) {
            this.zoomToPoint(new fabric.Point(0, 0), value);
            return this;
        },
        absolutePan: function(point) {
            var vpt = this.viewportTransform.slice(0);
            vpt[4] = -point.x;
            vpt[5] = -point.y;
            return this.setViewportTransform(vpt);
        },
        relativePan: function(point) {
            return this.absolutePan(new fabric.Point(-point.x - this.viewportTransform[4], -point.y - this.viewportTransform[5]));
        },
        getElement: function() {
            return this.lowerCanvasEl;
        },
        _onObjectAdded: function(obj) {
            this.stateful && obj.setupState();
            obj._set("canvas", this);
            obj.setCoords();
            this.fire("object:added", {
                target: obj
            });
            obj.fire("added");
        },
        _onObjectRemoved: function(obj) {
            this.fire("object:removed", {
                target: obj
            });
            obj.fire("removed");
            delete obj.canvas;
        },
        clearContext: function(ctx) {
            ctx.clearRect(0, 0, this.width, this.height);
            return this;
        },
        getContext: function() {
            return this.contextContainer;
        },
        clear: function() {
            this._objects.length = 0;
            this.backgroundImage = null;
            this.overlayImage = null;
            this.backgroundColor = "";
            this.overlayColor = "";
            if (this._hasITextHandlers) {
                this.off("mouse:up", this._mouseUpITextHandler);
                this._iTextInstances = null;
                this._hasITextHandlers = false;
            }
            this.clearContext(this.contextContainer);
            this.fire("canvas:cleared");
            this.renderAll();
            return this;
        },
        renderAll: function() {
            var canvasToDrawOn = this.contextContainer;
            this.renderCanvas(canvasToDrawOn, this._objects);
            return this;
        },
        calcViewportBoundaries: function() {
            var points = {}, width = this.getWidth(), height = this.getHeight(), iVpt = invertTransform(this.viewportTransform);
            points.tl = transformPoint({
                x: 0,
                y: 0
            }, iVpt);
            points.br = transformPoint({
                x: width,
                y: height
            }, iVpt);
            points.tr = new fabric.Point(points.br.x, points.tl.y);
            points.bl = new fabric.Point(points.tl.x, points.br.y);
            this.vptCoords = points;
            return points;
        },
        renderCanvas: function(ctx, objects) {
            this.calcViewportBoundaries();
            this.clearContext(ctx);
            this.fire("before:render");
            if (this.clipTo) {
                fabric.util.clipContext(this, ctx);
            }
            this._renderBackground(ctx);
            ctx.save();
            ctx.transform.apply(ctx, this.viewportTransform);
            this._renderObjects(ctx, objects);
            ctx.restore();
            if (!this.controlsAboveOverlay && this.interactive) {
                this.drawControls(ctx);
            }
            if (this.clipTo) {
                ctx.restore();
            }
            this._renderOverlay(ctx);
            if (this.controlsAboveOverlay && this.interactive) {
                this.drawControls(ctx);
            }
            this.fire("after:render");
        },
        _renderObjects: function(ctx, objects) {
            for (var i = 0, length = objects.length; i < length; ++i) {
                objects[i] && objects[i].render(ctx);
            }
        },
        _renderBackgroundOrOverlay: function(ctx, property) {
            var object = this[property + "Color"];
            if (object) {
                ctx.fillStyle = object.toLive ? object.toLive(ctx, this) : object;
                ctx.fillRect(object.offsetX || 0, object.offsetY || 0, this.width, this.height);
            }
            object = this[property + "Image"];
            if (object) {
                if (this[property + "Vpt"]) {
                    ctx.save();
                    ctx.transform.apply(ctx, this.viewportTransform);
                }
                object.render(ctx);
                this[property + "Vpt"] && ctx.restore();
            }
        },
        _renderBackground: function(ctx) {
            this._renderBackgroundOrOverlay(ctx, "background");
        },
        _renderOverlay: function(ctx) {
            this._renderBackgroundOrOverlay(ctx, "overlay");
        },
        getCenter: function() {
            return {
                top: this.getHeight() / 2,
                left: this.getWidth() / 2
            };
        },
        centerObjectH: function(object) {
            return this._centerObject(object, new fabric.Point(this.getCenter().left, object.getCenterPoint().y));
        },
        centerObjectV: function(object) {
            return this._centerObject(object, new fabric.Point(object.getCenterPoint().x, this.getCenter().top));
        },
        centerObject: function(object) {
            var center = this.getCenter();
            return this._centerObject(object, new fabric.Point(center.left, center.top));
        },
        viewportCenterObject: function(object) {
            var vpCenter = this.getVpCenter();
            return this._centerObject(object, vpCenter);
        },
        viewportCenterObjectH: function(object) {
            var vpCenter = this.getVpCenter();
            this._centerObject(object, new fabric.Point(vpCenter.x, object.getCenterPoint().y));
            return this;
        },
        viewportCenterObjectV: function(object) {
            var vpCenter = this.getVpCenter();
            return this._centerObject(object, new fabric.Point(object.getCenterPoint().x, vpCenter.y));
        },
        getVpCenter: function() {
            var center = this.getCenter(), iVpt = invertTransform(this.viewportTransform);
            return transformPoint({
                x: center.left,
                y: center.top
            }, iVpt);
        },
        _centerObject: function(object, center) {
            object.setPositionByOrigin(center, "center", "center");
            this.renderAll();
            return this;
        },
        toDatalessJSON: function(propertiesToInclude) {
            return this.toDatalessObject(propertiesToInclude);
        },
        toObject: function(propertiesToInclude) {
            return this._toObjectMethod("toObject", propertiesToInclude);
        },
        toDatalessObject: function(propertiesToInclude) {
            return this._toObjectMethod("toDatalessObject", propertiesToInclude);
        },
        _toObjectMethod: function(methodName, propertiesToInclude) {
            var data = {
                objects: this._toObjects(methodName, propertiesToInclude)
            };
            extend(data, this.__serializeBgOverlay(methodName, propertiesToInclude));
            fabric.util.populateWithProperties(this, data, propertiesToInclude);
            return data;
        },
        _toObjects: function(methodName, propertiesToInclude) {
            return this.getObjects().filter(function(object) {
                return !object.excludeFromExport;
            }).map(function(instance) {
                return this._toObject(instance, methodName, propertiesToInclude);
            }, this);
        },
        _toObject: function(instance, methodName, propertiesToInclude) {
            var originalValue;
            if (!this.includeDefaultValues) {
                originalValue = instance.includeDefaultValues;
                instance.includeDefaultValues = false;
            }
            var object = instance[methodName](propertiesToInclude);
            if (!this.includeDefaultValues) {
                instance.includeDefaultValues = originalValue;
            }
            return object;
        },
        __serializeBgOverlay: function(methodName, propertiesToInclude) {
            var data = {}, bgImage = this.backgroundImage, overlay = this.overlayImage;
            if (this.backgroundColor) {
                data.background = this.backgroundColor.toObject ? this.backgroundColor.toObject(propertiesToInclude) : this.backgroundColor;
            }
            if (this.overlayColor) {
                data.overlay = this.overlayColor.toObject ? this.overlayColor.toObject(propertiesToInclude) : this.overlayColor;
            }
            if (bgImage && !bgImage.excludeFromExport) {
                data.backgroundImage = this._toObject(bgImage, methodName, propertiesToInclude);
            }
            if (overlay && !overlay.excludeFromExport) {
                data.overlayImage = this._toObject(overlay, methodName, propertiesToInclude);
            }
            return data;
        },
        sendToBack: function(object) {
            if (!object) {
                return this;
            }
            var activeGroup = this._activeGroup, i, obj, objs;
            if (object === activeGroup) {
                objs = activeGroup._objects;
                for (i = objs.length; i--; ) {
                    obj = objs[i];
                    removeFromArray(this._objects, obj);
                    this._objects.unshift(obj);
                }
            } else {
                removeFromArray(this._objects, object);
                this._objects.unshift(object);
            }
            return this.renderAll && this.renderAll();
        },
        bringToFront: function(object) {
            if (!object) {
                return this;
            }
            var activeGroup = this._activeGroup, i, obj, objs;
            if (object === activeGroup) {
                objs = activeGroup._objects;
                for (i = 0; i < objs.length; i++) {
                    obj = objs[i];
                    removeFromArray(this._objects, obj);
                    this._objects.push(obj);
                }
            } else {
                removeFromArray(this._objects, object);
                this._objects.push(object);
            }
            return this.renderAll && this.renderAll();
        },
        sendBackwards: function(object, intersecting) {
            if (!object) {
                return this;
            }
            var activeGroup = this._activeGroup, i, obj, idx, newIdx, objs, objsMoved = 0;
            if (object === activeGroup) {
                objs = activeGroup._objects;
                for (i = 0; i < objs.length; i++) {
                    obj = objs[i];
                    idx = this._objects.indexOf(obj);
                    if (idx > 0 + objsMoved) {
                        newIdx = idx - 1;
                        removeFromArray(this._objects, obj);
                        this._objects.splice(newIdx, 0, obj);
                    }
                    objsMoved++;
                }
            } else {
                idx = this._objects.indexOf(object);
                if (idx !== 0) {
                    newIdx = this._findNewLowerIndex(object, idx, intersecting);
                    removeFromArray(this._objects, object);
                    this._objects.splice(newIdx, 0, object);
                }
            }
            this.renderAll && this.renderAll();
            return this;
        },
        _findNewLowerIndex: function(object, idx, intersecting) {
            var newIdx;
            if (intersecting) {
                newIdx = idx;
                for (var i = idx - 1; i >= 0; --i) {
                    var isIntersecting = object.intersectsWithObject(this._objects[i]) || object.isContainedWithinObject(this._objects[i]) || this._objects[i].isContainedWithinObject(object);
                    if (isIntersecting) {
                        newIdx = i;
                        break;
                    }
                }
            } else {
                newIdx = idx - 1;
            }
            return newIdx;
        },
        bringForward: function(object, intersecting) {
            if (!object) {
                return this;
            }
            var activeGroup = this._activeGroup, i, obj, idx, newIdx, objs, objsMoved = 0;
            if (object === activeGroup) {
                objs = activeGroup._objects;
                for (i = objs.length; i--; ) {
                    obj = objs[i];
                    idx = this._objects.indexOf(obj);
                    if (idx < this._objects.length - 1 - objsMoved) {
                        newIdx = idx + 1;
                        removeFromArray(this._objects, obj);
                        this._objects.splice(newIdx, 0, obj);
                    }
                    objsMoved++;
                }
            } else {
                idx = this._objects.indexOf(object);
                if (idx !== this._objects.length - 1) {
                    newIdx = this._findNewUpperIndex(object, idx, intersecting);
                    removeFromArray(this._objects, object);
                    this._objects.splice(newIdx, 0, object);
                }
            }
            this.renderAll && this.renderAll();
            return this;
        },
        _findNewUpperIndex: function(object, idx, intersecting) {
            var newIdx;
            if (intersecting) {
                newIdx = idx;
                for (var i = idx + 1; i < this._objects.length; ++i) {
                    var isIntersecting = object.intersectsWithObject(this._objects[i]) || object.isContainedWithinObject(this._objects[i]) || this._objects[i].isContainedWithinObject(object);
                    if (isIntersecting) {
                        newIdx = i;
                        break;
                    }
                }
            } else {
                newIdx = idx + 1;
            }
            return newIdx;
        },
        moveTo: function(object, index) {
            removeFromArray(this._objects, object);
            this._objects.splice(index, 0, object);
            return this.renderAll && this.renderAll();
        },
        dispose: function() {
            this.clear();
            return this;
        },
        toString: function() {
            return "#<fabric.Canvas (" + this.complexity() + "): " + "{ objects: " + this.getObjects().length + " }>";
        }
    });
    extend(fabric.StaticCanvas.prototype, fabric.Observable);
    extend(fabric.StaticCanvas.prototype, fabric.Collection);
    extend(fabric.StaticCanvas.prototype, fabric.DataURLExporter);
    extend(fabric.StaticCanvas, {
        EMPTY_JSON: '{"objects": [], "background": "white"}',
        supports: function(methodName) {
            var el = fabric.util.createCanvasElement();
            if (!el || !el.getContext) {
                return null;
            }
            var ctx = el.getContext("2d");
            if (!ctx) {
                return null;
            }
            switch (methodName) {
              case "getImageData":
                return typeof ctx.getImageData !== "undefined";

              case "setLineDash":
                return typeof ctx.setLineDash !== "undefined";

              case "toDataURL":
                return typeof el.toDataURL !== "undefined";

              case "toDataURLWithQuality":
                try {
                    el.toDataURL("image/jpeg", 0);
                    return true;
                } catch (e) {}
                return false;

              default:
                return null;
            }
        }
    });
    fabric.StaticCanvas.prototype.toJSON = fabric.StaticCanvas.prototype.toObject;
})();

(function() {
    var getPointer = fabric.util.getPointer, degreesToRadians = fabric.util.degreesToRadians, radiansToDegrees = fabric.util.radiansToDegrees, atan2 = Math.atan2, abs = Math.abs, supportLineDash = fabric.StaticCanvas.supports("setLineDash"), STROKE_OFFSET = .5;
    fabric.Canvas = fabric.util.createClass(fabric.StaticCanvas, {
        initialize: function(el, options) {
            options || (options = {});
            this._initStatic(el, options);
            this._initInteractive();
            this._createCacheCanvas();
        },
        uniScaleTransform: false,
        uniScaleKey: "shiftKey",
        centeredScaling: false,
        centeredRotation: false,
        centeredKey: "altKey",
        altActionKey: "shiftKey",
        interactive: true,
        selection: true,
        selectionKey: "shiftKey",
        altSelectionKey: null,
        selectionColor: "rgba(100, 100, 255, 0.3)",
        selectionDashArray: [],
        selectionBorderColor: "rgba(255, 255, 255, 0.3)",
        selectionLineWidth: 1,
        hoverCursor: "move",
        moveCursor: "move",
        defaultCursor: "default",
        freeDrawingCursor: "crosshair",
        rotationCursor: "crosshair",
        containerClass: "canvas-container",
        perPixelTargetFind: false,
        targetFindTolerance: 0,
        skipTargetFind: false,
        isDrawingMode: false,
        preserveObjectStacking: false,
        snapAngle: 0,
        snapThreshold: null,
        stopContextMenu: false,
        fireRightClick: false,
        fireMiddleClick: false,
        _initInteractive: function() {
            this._currentTransform = null;
            this._groupSelector = null;
            this._initWrapperElement();
            this._createUpperCanvas();
            this._initEventListeners();
            this._initRetinaScaling();
            this.freeDrawingBrush = fabric.PencilBrush && new fabric.PencilBrush(this);
            this.calcOffset();
        },
        _chooseObjectsToRender: function() {
            var activeGroup = this.getActiveGroup(), activeObject = this.getActiveObject(), object, objsToRender = [], activeGroupObjects = [];
            if ((activeGroup || activeObject) && !this.preserveObjectStacking) {
                for (var i = 0, length = this._objects.length; i < length; i++) {
                    object = this._objects[i];
                    if ((!activeGroup || !activeGroup.contains(object)) && object !== activeObject) {
                        objsToRender.push(object);
                    } else {
                        activeGroupObjects.push(object);
                    }
                }
                if (activeGroup) {
                    activeGroup._set("_objects", activeGroupObjects);
                    objsToRender.push(activeGroup);
                }
                activeObject && objsToRender.push(activeObject);
            } else {
                objsToRender = this._objects;
            }
            return objsToRender;
        },
        renderAll: function() {
            if (this.contextTopDirty && !this._groupSelector && !this.isDrawingMode) {
                this.clearContext(this.contextTop);
                this.contextTopDirty = false;
            }
            var canvasToDrawOn = this.contextContainer;
            this.renderCanvas(canvasToDrawOn, this._chooseObjectsToRender());
            return this;
        },
        renderTop: function() {
            var ctx = this.contextTop;
            this.clearContext(ctx);
            if (this.selection && this._groupSelector) {
                this._drawSelection(ctx);
            }
            this.fire("after:render");
            this.contextTopDirty = true;
            return this;
        },
        _resetCurrentTransform: function() {
            var t = this._currentTransform;
            t.target.set({
                scaleX: t.original.scaleX,
                scaleY: t.original.scaleY,
                skewX: t.original.skewX,
                skewY: t.original.skewY,
                left: t.original.left,
                top: t.original.top
            });
            if (this._shouldCenterTransform(t.target)) {
                if (t.action === "rotate") {
                    this._setOriginToCenter(t.target);
                } else {
                    if (t.originX !== "center") {
                        if (t.originX === "right") {
                            t.mouseXSign = -1;
                        } else {
                            t.mouseXSign = 1;
                        }
                    }
                    if (t.originY !== "center") {
                        if (t.originY === "bottom") {
                            t.mouseYSign = -1;
                        } else {
                            t.mouseYSign = 1;
                        }
                    }
                    t.originX = "center";
                    t.originY = "center";
                }
            } else {
                t.originX = t.original.originX;
                t.originY = t.original.originY;
            }
        },
        containsPoint: function(e, target, point) {
            var ignoreZoom = true, pointer = point || this.getPointer(e, ignoreZoom), xy;
            if (target.group && target.group === this.getActiveGroup()) {
                xy = this._normalizePointer(target.group, pointer);
            } else {
                xy = {
                    x: pointer.x,
                    y: pointer.y
                };
            }
            return target.containsPoint(xy) || target._findTargetCorner(pointer);
        },
        _normalizePointer: function(object, pointer) {
            var m = object.calcTransformMatrix(), invertedM = fabric.util.invertTransform(m), vptPointer = this.restorePointerVpt(pointer);
            return fabric.util.transformPoint(vptPointer, invertedM);
        },
        isTargetTransparent: function(target, x, y) {
            var hasBorders = target.hasBorders, transparentCorners = target.transparentCorners, ctx = this.contextCache, originalColor = target.selectionBackgroundColor;
            target.hasBorders = target.transparentCorners = false;
            target.selectionBackgroundColor = "";
            ctx.save();
            ctx.transform.apply(ctx, this.viewportTransform);
            target.render(ctx);
            ctx.restore();
            target.active && target._renderControls(ctx);
            target.hasBorders = hasBorders;
            target.transparentCorners = transparentCorners;
            target.selectionBackgroundColor = originalColor;
            var isTransparent = fabric.util.isTransparent(ctx, x, y, this.targetFindTolerance);
            this.clearContext(ctx);
            return isTransparent;
        },
        _shouldClearSelection: function(e, target) {
            var activeGroup = this.getActiveGroup(), activeObject = this.getActiveObject();
            return !target || target && activeGroup && !activeGroup.contains(target) && activeGroup !== target && !e[this.selectionKey] || target && !target.evented || target && !target.selectable && activeObject && activeObject !== target;
        },
        _shouldCenterTransform: function(target) {
            if (!target) {
                return;
            }
            var t = this._currentTransform, centerTransform;
            if (t.action === "scale" || t.action === "scaleX" || t.action === "scaleY") {
                centerTransform = this.centeredScaling || target.centeredScaling;
            } else if (t.action === "rotate") {
                centerTransform = this.centeredRotation || target.centeredRotation;
            }
            return centerTransform ? !t.altKey : t.altKey;
        },
        _getOriginFromCorner: function(target, corner) {
            var origin = {
                x: target.originX,
                y: target.originY
            };
            if (corner === "ml" || corner === "tl" || corner === "bl") {
                origin.x = "right";
            } else if (corner === "mr" || corner === "tr" || corner === "br") {
                origin.x = "left";
            }
            if (corner === "tl" || corner === "mt" || corner === "tr") {
                origin.y = "bottom";
            } else if (corner === "bl" || corner === "mb" || corner === "br") {
                origin.y = "top";
            }
            return origin;
        },
        _getActionFromCorner: function(target, corner, e) {
            if (!corner) {
                return "drag";
            }
            switch (corner) {
              case "mtr":
                return "rotate";

              case "ml":
              case "mr":
                return e[this.altActionKey] ? "skewY" : "scaleX";

              case "mt":
              case "mb":
                return e[this.altActionKey] ? "skewX" : "scaleY";

              default:
                return "scale";
            }
        },
        _setupCurrentTransform: function(e, target) {
            if (!target) {
                return;
            }
            var pointer = this.getPointer(e), corner = target._findTargetCorner(this.getPointer(e, true)), action = this._getActionFromCorner(target, corner, e), origin = this._getOriginFromCorner(target, corner);
            this._currentTransform = {
                target: target,
                action: action,
                corner: corner,
                scaleX: target.scaleX,
                scaleY: target.scaleY,
                skewX: target.skewX,
                skewY: target.skewY,
                offsetX: pointer.x - target.left,
                offsetY: pointer.y - target.top,
                originX: origin.x,
                originY: origin.y,
                ex: pointer.x,
                ey: pointer.y,
                lastX: pointer.x,
                lastY: pointer.y,
                left: target.left,
                top: target.top,
                theta: degreesToRadians(target.angle),
                width: target.width * target.scaleX,
                mouseXSign: 1,
                mouseYSign: 1,
                shiftKey: e.shiftKey,
                altKey: e[this.centeredKey]
            };
            this._currentTransform.original = {
                left: target.left,
                top: target.top,
                scaleX: target.scaleX,
                scaleY: target.scaleY,
                skewX: target.skewX,
                skewY: target.skewY,
                originX: origin.x,
                originY: origin.y
            };
            this._resetCurrentTransform();
        },
        _translateObject: function(x, y) {
            var transform = this._currentTransform, target = transform.target, newLeft = x - transform.offsetX, newTop = y - transform.offsetY, moveX = !target.get("lockMovementX") && target.left !== newLeft, moveY = !target.get("lockMovementY") && target.top !== newTop;
            moveX && target.set("left", newLeft);
            moveY && target.set("top", newTop);
            return moveX || moveY;
        },
        _changeSkewTransformOrigin: function(mouseMove, t, by) {
            var property = "originX", origins = {
                0: "center"
            }, skew = t.target.skewX, originA = "left", originB = "right", corner = t.corner === "mt" || t.corner === "ml" ? 1 : -1, flipSign = 1;
            mouseMove = mouseMove > 0 ? 1 : -1;
            if (by === "y") {
                skew = t.target.skewY;
                originA = "top";
                originB = "bottom";
                property = "originY";
            }
            origins[-1] = originA;
            origins[1] = originB;
            t.target.flipX && (flipSign *= -1);
            t.target.flipY && (flipSign *= -1);
            if (skew === 0) {
                t.skewSign = -corner * mouseMove * flipSign;
                t[property] = origins[-mouseMove];
            } else {
                skew = skew > 0 ? 1 : -1;
                t.skewSign = skew;
                t[property] = origins[skew * corner * flipSign];
            }
        },
        _skewObject: function(x, y, by) {
            var t = this._currentTransform, target = t.target, skewed = false, lockSkewingX = target.get("lockSkewingX"), lockSkewingY = target.get("lockSkewingY");
            if (lockSkewingX && by === "x" || lockSkewingY && by === "y") {
                return false;
            }
            var center = target.getCenterPoint(), actualMouseByCenter = target.toLocalPoint(new fabric.Point(x, y), "center", "center")[by], lastMouseByCenter = target.toLocalPoint(new fabric.Point(t.lastX, t.lastY), "center", "center")[by], actualMouseByOrigin, constraintPosition, dim = target._getTransformedDimensions();
            this._changeSkewTransformOrigin(actualMouseByCenter - lastMouseByCenter, t, by);
            actualMouseByOrigin = target.toLocalPoint(new fabric.Point(x, y), t.originX, t.originY)[by];
            constraintPosition = target.translateToOriginPoint(center, t.originX, t.originY);
            skewed = this._setObjectSkew(actualMouseByOrigin, t, by, dim);
            t.lastX = x;
            t.lastY = y;
            target.setPositionByOrigin(constraintPosition, t.originX, t.originY);
            return skewed;
        },
        _setObjectSkew: function(localMouse, transform, by, _dim) {
            var target = transform.target, newValue, skewed = false, skewSign = transform.skewSign, newDim, dimNoSkew, otherBy, _otherBy, _by, newDimMouse, skewX, skewY;
            if (by === "x") {
                otherBy = "y";
                _otherBy = "Y";
                _by = "X";
                skewX = 0;
                skewY = target.skewY;
            } else {
                otherBy = "x";
                _otherBy = "X";
                _by = "Y";
                skewX = target.skewX;
                skewY = 0;
            }
            dimNoSkew = target._getTransformedDimensions(skewX, skewY);
            newDimMouse = 2 * Math.abs(localMouse) - dimNoSkew[by];
            if (newDimMouse <= 2) {
                newValue = 0;
            } else {
                newValue = skewSign * Math.atan(newDimMouse / target["scale" + _by] / (dimNoSkew[otherBy] / target["scale" + _otherBy]));
                newValue = fabric.util.radiansToDegrees(newValue);
            }
            skewed = target["skew" + _by] !== newValue;
            target.set("skew" + _by, newValue);
            if (target["skew" + _otherBy] !== 0) {
                newDim = target._getTransformedDimensions();
                newValue = _dim[otherBy] / newDim[otherBy] * target["scale" + _otherBy];
                target.set("scale" + _otherBy, newValue);
            }
            return skewed;
        },
        _scaleObject: function(x, y, by) {
            var t = this._currentTransform, target = t.target, lockScalingX = target.get("lockScalingX"), lockScalingY = target.get("lockScalingY"), lockScalingFlip = target.get("lockScalingFlip");
            if (lockScalingX && lockScalingY) {
                return false;
            }
            var constraintPosition = target.translateToOriginPoint(target.getCenterPoint(), t.originX, t.originY), localMouse = target.toLocalPoint(new fabric.Point(x, y), t.originX, t.originY), dim = target._getTransformedDimensions(), scaled = false;
            this._setLocalMouse(localMouse, t);
            scaled = this._setObjectScale(localMouse, t, lockScalingX, lockScalingY, by, lockScalingFlip, dim);
            target.setPositionByOrigin(constraintPosition, t.originX, t.originY);
            return scaled;
        },
        _setObjectScale: function(localMouse, transform, lockScalingX, lockScalingY, by, lockScalingFlip, _dim) {
            var target = transform.target, forbidScalingX = false, forbidScalingY = false, scaled = false, changeX, changeY, scaleX, scaleY;
            scaleX = localMouse.x * target.scaleX / _dim.x;
            scaleY = localMouse.y * target.scaleY / _dim.y;
            changeX = target.scaleX !== scaleX;
            changeY = target.scaleY !== scaleY;
            if (lockScalingFlip && scaleX <= 0 && scaleX < target.scaleX) {
                forbidScalingX = true;
            }
            if (lockScalingFlip && scaleY <= 0 && scaleY < target.scaleY) {
                forbidScalingY = true;
            }
            if (by === "equally" && !lockScalingX && !lockScalingY) {
                forbidScalingX || forbidScalingY || (scaled = this._scaleObjectEqually(localMouse, target, transform, _dim));
            } else if (!by) {
                forbidScalingX || lockScalingX || target.set("scaleX", scaleX) && (scaled = scaled || changeX);
                forbidScalingY || lockScalingY || target.set("scaleY", scaleY) && (scaled = scaled || changeY);
            } else if (by === "x" && !target.get("lockUniScaling")) {
                forbidScalingX || lockScalingX || target.set("scaleX", scaleX) && (scaled = scaled || changeX);
            } else if (by === "y" && !target.get("lockUniScaling")) {
                forbidScalingY || lockScalingY || target.set("scaleY", scaleY) && (scaled = scaled || changeY);
            }
            transform.newScaleX = scaleX;
            transform.newScaleY = scaleY;
            forbidScalingX || forbidScalingY || this._flipObject(transform, by);
            return scaled;
        },
        _scaleObjectEqually: function(localMouse, target, transform, _dim) {
            var dist = localMouse.y + localMouse.x, lastDist = _dim.y * transform.original.scaleY / target.scaleY + _dim.x * transform.original.scaleX / target.scaleX, scaled, signX = localMouse.x / Math.abs(localMouse.x), signY = localMouse.y / Math.abs(localMouse.y);
            transform.newScaleX = signX * Math.abs(transform.original.scaleX * dist / lastDist);
            transform.newScaleY = signY * Math.abs(transform.original.scaleY * dist / lastDist);
            scaled = transform.newScaleX !== target.scaleX || transform.newScaleY !== target.scaleY;
            target.set("scaleX", transform.newScaleX);
            target.set("scaleY", transform.newScaleY);
            return scaled;
        },
        _flipObject: function(transform, by) {
            if (transform.newScaleX < 0 && by !== "y") {
                if (transform.originX === "left") {
                    transform.originX = "right";
                } else if (transform.originX === "right") {
                    transform.originX = "left";
                }
            }
            if (transform.newScaleY < 0 && by !== "x") {
                if (transform.originY === "top") {
                    transform.originY = "bottom";
                } else if (transform.originY === "bottom") {
                    transform.originY = "top";
                }
            }
        },
        _setLocalMouse: function(localMouse, t) {
            var target = t.target, zoom = this.getZoom(), padding = target.padding / zoom;
            if (t.originX === "right") {
                localMouse.x *= -1;
            } else if (t.originX === "center") {
                localMouse.x *= t.mouseXSign * 2;
                if (localMouse.x < 0) {
                    t.mouseXSign = -t.mouseXSign;
                }
            }
            if (t.originY === "bottom") {
                localMouse.y *= -1;
            } else if (t.originY === "center") {
                localMouse.y *= t.mouseYSign * 2;
                if (localMouse.y < 0) {
                    t.mouseYSign = -t.mouseYSign;
                }
            }
            if (abs(localMouse.x) > padding) {
                if (localMouse.x < 0) {
                    localMouse.x += padding;
                } else {
                    localMouse.x -= padding;
                }
            } else {
                localMouse.x = 0;
            }
            if (abs(localMouse.y) > padding) {
                if (localMouse.y < 0) {
                    localMouse.y += padding;
                } else {
                    localMouse.y -= padding;
                }
            } else {
                localMouse.y = 0;
            }
        },
        _rotateObject: function(x, y) {
            var t = this._currentTransform;
            if (t.target.get("lockRotation")) {
                return false;
            }
            var lastAngle = atan2(t.ey - t.top, t.ex - t.left), curAngle = atan2(y - t.top, x - t.left), angle = radiansToDegrees(curAngle - lastAngle + t.theta), hasRoated = true;
            if (t.target.snapAngle > 0) {
                var snapAngle = t.target.snapAngle, snapThreshold = t.target.snapThreshold || snapAngle, rightAngleLocked = Math.ceil(angle / snapAngle) * snapAngle, leftAngleLocked = Math.floor(angle / snapAngle) * snapAngle;
                if (Math.abs(angle - leftAngleLocked) < snapThreshold) {
                    angle = leftAngleLocked;
                } else if (Math.abs(angle - rightAngleLocked) < snapThreshold) {
                    angle = rightAngleLocked;
                }
            }
            if (angle < 0) {
                angle = 360 + angle;
            }
            angle %= 360;
            if (t.target.angle === angle) {
                hasRoated = false;
            } else {
                t.target.angle = angle;
            }
            return hasRoated;
        },
        setCursor: function(value) {
            this.upperCanvasEl.style.cursor = value;
        },
        _resetObjectTransform: function(target) {
            target.scaleX = 1;
            target.scaleY = 1;
            target.skewX = 0;
            target.skewY = 0;
            target.setAngle(0);
        },
        _drawSelection: function(ctx) {
            var groupSelector = this._groupSelector, left = groupSelector.left, top = groupSelector.top, aleft = abs(left), atop = abs(top);
            if (this.selectionColor) {
                ctx.fillStyle = this.selectionColor;
                ctx.fillRect(groupSelector.ex - (left > 0 ? 0 : -left), groupSelector.ey - (top > 0 ? 0 : -top), aleft, atop);
            }
            if (!this.selectionLineWidth || !this.selectionBorderColor) {
                return;
            }
            ctx.lineWidth = this.selectionLineWidth;
            ctx.strokeStyle = this.selectionBorderColor;
            if (this.selectionDashArray.length > 1 && !supportLineDash) {
                var px = groupSelector.ex + STROKE_OFFSET - (left > 0 ? 0 : aleft), py = groupSelector.ey + STROKE_OFFSET - (top > 0 ? 0 : atop);
                ctx.beginPath();
                fabric.util.drawDashedLine(ctx, px, py, px + aleft, py, this.selectionDashArray);
                fabric.util.drawDashedLine(ctx, px, py + atop - 1, px + aleft, py + atop - 1, this.selectionDashArray);
                fabric.util.drawDashedLine(ctx, px, py, px, py + atop, this.selectionDashArray);
                fabric.util.drawDashedLine(ctx, px + aleft - 1, py, px + aleft - 1, py + atop, this.selectionDashArray);
                ctx.closePath();
                ctx.stroke();
            } else {
                fabric.Object.prototype._setLineDash.call(this, ctx, this.selectionDashArray);
                ctx.strokeRect(groupSelector.ex + STROKE_OFFSET - (left > 0 ? 0 : aleft), groupSelector.ey + STROKE_OFFSET - (top > 0 ? 0 : atop), aleft, atop);
            }
        },
        findTarget: function(e, skipGroup) {
            if (this.skipTargetFind) {
                return;
            }
            var ignoreZoom = true, pointer = this.getPointer(e, ignoreZoom), activeGroup = this.getActiveGroup(), activeObject = this.getActiveObject(), activeTarget, activeTargetSubs;
            this.targets = [];
            if (activeGroup && !skipGroup && activeGroup === this._searchPossibleTargets([ activeGroup ], pointer)) {
                this._fireOverOutEvents(activeGroup, e);
                return activeGroup;
            }
            if (activeObject && activeObject._findTargetCorner(pointer)) {
                this._fireOverOutEvents(activeObject, e);
                return activeObject;
            }
            if (activeObject && activeObject === this._searchPossibleTargets([ activeObject ], pointer)) {
                if (!this.preserveObjectStacking) {
                    this._fireOverOutEvents(activeObject, e);
                    return activeObject;
                } else {
                    activeTarget = activeObject;
                    activeTargetSubs = this.targets;
                    this.targets = [];
                }
            }
            var target = this._searchPossibleTargets(this._objects, pointer);
            if (e[this.altSelectionKey] && target && activeTarget && target !== activeTarget) {
                target = activeTarget;
                this.targets = activeTargetSubs;
            }
            this._fireOverOutEvents(target, e);
            return target;
        },
        _fireOverOutEvents: function(target, e) {
            var overOpt, outOpt, hoveredTarget = this._hoveredTarget;
            if (hoveredTarget !== target) {
                overOpt = {
                    e: e,
                    target: target,
                    previousTarget: this._hoveredTarget
                };
                outOpt = {
                    e: e,
                    target: this._hoveredTarget,
                    nextTarget: target
                };
                this._hoveredTarget = target;
            }
            if (target) {
                if (hoveredTarget !== target) {
                    if (hoveredTarget) {
                        this.fire("mouse:out", outOpt);
                        hoveredTarget.fire("mouseout", outOpt);
                    }
                    this.fire("mouse:over", overOpt);
                    target.fire("mouseover", overOpt);
                }
            } else if (hoveredTarget) {
                this.fire("mouse:out", outOpt);
                hoveredTarget.fire("mouseout", outOpt);
            }
        },
        _checkTarget: function(pointer, obj) {
            if (obj && obj.visible && obj.evented && this.containsPoint(null, obj, pointer)) {
                if ((this.perPixelTargetFind || obj.perPixelTargetFind) && !obj.isEditing) {
                    var isTransparent = this.isTargetTransparent(obj, pointer.x, pointer.y);
                    if (!isTransparent) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        },
        _searchPossibleTargets: function(objects, pointer) {
            var target, i = objects.length, normalizedPointer, subTarget;
            while (i--) {
                if (this._checkTarget(pointer, objects[i])) {
                    target = objects[i];
                    if (target.type === "group" && target.subTargetCheck) {
                        normalizedPointer = this._normalizePointer(target, pointer);
                        subTarget = this._searchPossibleTargets(target._objects, normalizedPointer);
                        subTarget && this.targets.push(subTarget);
                    }
                    break;
                }
            }
            return target;
        },
        restorePointerVpt: function(pointer) {
            return fabric.util.transformPoint(pointer, fabric.util.invertTransform(this.viewportTransform));
        },
        getPointer: function(e, ignoreZoom, upperCanvasEl) {
            if (!upperCanvasEl) {
                upperCanvasEl = this.upperCanvasEl;
            }
            var pointer = getPointer(e), bounds = upperCanvasEl.getBoundingClientRect(), boundsWidth = bounds.width || 0, boundsHeight = bounds.height || 0, cssScale;
            if (!boundsWidth || !boundsHeight) {
                if ("top" in bounds && "bottom" in bounds) {
                    boundsHeight = Math.abs(bounds.top - bounds.bottom);
                }
                if ("right" in bounds && "left" in bounds) {
                    boundsWidth = Math.abs(bounds.right - bounds.left);
                }
            }
            this.calcOffset();
            pointer.x = pointer.x - this._offset.left;
            pointer.y = pointer.y - this._offset.top;
            if (!ignoreZoom) {
                pointer = this.restorePointerVpt(pointer);
            }
            if (boundsWidth === 0 || boundsHeight === 0) {
                cssScale = {
                    width: 1,
                    height: 1
                };
            } else {
                cssScale = {
                    width: upperCanvasEl.width / boundsWidth,
                    height: upperCanvasEl.height / boundsHeight
                };
            }
            return {
                x: pointer.x * cssScale.width,
                y: pointer.y * cssScale.height
            };
        },
        _createUpperCanvas: function() {
            var lowerCanvasClass = this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/, "");
            if (this.upperCanvasEl) {
                this.upperCanvasEl.className = "";
            } else {
                this.upperCanvasEl = this._createCanvasElement();
            }
            fabric.util.addClass(this.upperCanvasEl, "upper-canvas " + lowerCanvasClass);
            this.wrapperEl.appendChild(this.upperCanvasEl);
            this._copyCanvasStyle(this.lowerCanvasEl, this.upperCanvasEl);
            this._applyCanvasStyle(this.upperCanvasEl);
            this.contextTop = this.upperCanvasEl.getContext("2d");
        },
        _createCacheCanvas: function() {
            this.cacheCanvasEl = this._createCanvasElement();
            this.cacheCanvasEl.setAttribute("width", this.width);
            this.cacheCanvasEl.setAttribute("height", this.height);
            this.contextCache = this.cacheCanvasEl.getContext("2d");
        },
        _initWrapperElement: function() {
            this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, "div", {
                class: this.containerClass
            });
            fabric.util.setStyle(this.wrapperEl, {
                width: this.getWidth() + "px",
                height: this.getHeight() + "px",
                position: "relative"
            });
            fabric.util.makeElementUnselectable(this.wrapperEl);
        },
        _applyCanvasStyle: function(element) {
            var width = this.getWidth() || element.width, height = this.getHeight() || element.height;
            fabric.util.setStyle(element, {
                position: "absolute",
                width: width + "px",
                height: height + "px",
                left: 0,
                top: 0,
                "touch-action": "none"
            });
            element.width = width;
            element.height = height;
            fabric.util.makeElementUnselectable(element);
        },
        _copyCanvasStyle: function(fromEl, toEl) {
            toEl.style.cssText = fromEl.style.cssText;
        },
        getSelectionContext: function() {
            return this.contextTop;
        },
        getSelectionElement: function() {
            return this.upperCanvasEl;
        },
        _setActiveObject: function(object) {
            var obj = this._activeObject;
            if (obj) {
                obj.set("active", false);
                if (object !== obj && obj.onDeselect && typeof obj.onDeselect === "function") {
                    obj.onDeselect();
                }
            }
            this._activeObject = object;
            object.set("active", true);
        },
        setActiveObject: function(object, e) {
            var currentActiveObject = this.getActiveObject();
            if (currentActiveObject && currentActiveObject !== object) {
                currentActiveObject.fire("deselected", {
                    e: e
                });
            }
            this._setActiveObject(object);
            this.fire("object:selected", {
                target: object,
                e: e
            });
            object.fire("selected", {
                e: e
            });
            this.renderAll();
            return this;
        },
        getActiveObject: function() {
            return this._activeObject;
        },
        _onObjectRemoved: function(obj) {
            if (this.getActiveObject() === obj) {
                this.fire("before:selection:cleared", {
                    target: obj
                });
                this._discardActiveObject();
                this.fire("selection:cleared", {
                    target: obj
                });
                obj.fire("deselected");
            }
            if (this._hoveredTarget === obj) {
                this._hoveredTarget = null;
            }
            this.callSuper("_onObjectRemoved", obj);
        },
        _discardActiveObject: function() {
            var obj = this._activeObject;
            if (obj) {
                obj.set("active", false);
                if (obj.onDeselect && typeof obj.onDeselect === "function") {
                    obj.onDeselect();
                }
            }
            this._activeObject = null;
        },
        discardActiveObject: function(e) {
            var activeObject = this._activeObject;
            if (activeObject) {
                this.fire("before:selection:cleared", {
                    target: activeObject,
                    e: e
                });
                this._discardActiveObject();
                this.fire("selection:cleared", {
                    e: e
                });
                activeObject.fire("deselected", {
                    e: e
                });
            }
            return this;
        },
        _setActiveGroup: function(group) {
            this._activeGroup = group;
            if (group) {
                group.set("active", true);
            }
        },
        setActiveGroup: function(group, e) {
            this._setActiveGroup(group);
            if (group) {
                this.fire("object:selected", {
                    target: group,
                    e: e
                });
                group.fire("selected", {
                    e: e
                });
            }
            return this;
        },
        getActiveGroup: function() {
            return this._activeGroup;
        },
        _discardActiveGroup: function() {
            var g = this.getActiveGroup();
            if (g) {
                g.destroy();
            }
            this.setActiveGroup(null);
        },
        discardActiveGroup: function(e) {
            var g = this.getActiveGroup();
            if (g) {
                this.fire("before:selection:cleared", {
                    e: e,
                    target: g
                });
                this._discardActiveGroup();
                this.fire("selection:cleared", {
                    e: e
                });
            }
            return this;
        },
        deactivateAll: function() {
            var allObjects = this.getObjects(), i = 0, len = allObjects.length, obj;
            for (;i < len; i++) {
                obj = allObjects[i];
                obj && obj.set("active", false);
            }
            this._discardActiveGroup();
            this._discardActiveObject();
            return this;
        },
        deactivateAllWithDispatch: function(e) {
            var allObjects = this.getObjects(), i = 0, len = allObjects.length, obj;
            for (;i < len; i++) {
                obj = allObjects[i];
                obj && obj.set("active", false);
            }
            this.discardActiveGroup(e);
            this.discardActiveObject(e);
            return this;
        },
        dispose: function() {
            fabric.StaticCanvas.prototype.dispose.call(this);
            var wrapper = this.wrapperEl;
            this.removeListeners();
            wrapper.removeChild(this.upperCanvasEl);
            wrapper.removeChild(this.lowerCanvasEl);
            delete this.upperCanvasEl;
            if (wrapper.parentNode) {
                wrapper.parentNode.replaceChild(this.lowerCanvasEl, this.wrapperEl);
            }
            delete this.wrapperEl;
            return this;
        },
        clear: function() {
            this.discardActiveGroup();
            this.discardActiveObject();
            this.clearContext(this.contextTop);
            return this.callSuper("clear");
        },
        drawControls: function(ctx) {
            var activeGroup = this.getActiveGroup();
            if (activeGroup) {
                activeGroup._renderControls(ctx);
            } else {
                this._drawObjectsControls(ctx);
            }
        },
        _drawObjectsControls: function(ctx) {
            for (var i = 0, len = this._objects.length; i < len; ++i) {
                if (!this._objects[i] || !this._objects[i].active) {
                    continue;
                }
                this._objects[i]._renderControls(ctx);
            }
        },
        _toObject: function(instance, methodName, propertiesToInclude) {
            var originalProperties = this._realizeGroupTransformOnObject(instance), object = this.callSuper("_toObject", instance, methodName, propertiesToInclude);
            this._unwindGroupTransformOnObject(instance, originalProperties);
            return object;
        },
        _realizeGroupTransformOnObject: function(instance) {
            if (instance.group && instance.group === this.getActiveGroup()) {
                var originalValues = {}, layoutProps = [ "angle", "flipX", "flipY", "left", "scaleX", "scaleY", "skewX", "skewY", "top" ];
                layoutProps.forEach(function(prop) {
                    originalValues[prop] = instance[prop];
                });
                this.getActiveGroup().realizeTransform(instance);
                return originalValues;
            } else {
                return null;
            }
        },
        _unwindGroupTransformOnObject: function(instance, originalValues) {
            if (originalValues) {
                instance.set(originalValues);
            }
        },
        _setSVGObject: function(markup, instance, reviver) {
            var originalProperties;
            originalProperties = this._realizeGroupTransformOnObject(instance);
            this.callSuper("_setSVGObject", markup, instance, reviver);
            this._unwindGroupTransformOnObject(instance, originalProperties);
        }
    });
    for (var prop in fabric.StaticCanvas) {
        if (prop !== "prototype") {
            fabric.Canvas[prop] = fabric.StaticCanvas[prop];
        }
    }
    if (fabric.isTouchSupported) {
        fabric.Canvas.prototype._setCursorFromEvent = function() {};
    }
    fabric.Element = fabric.Canvas;
})();

(function() {
    var cursorOffset = {
        mt: 0,
        tr: 1,
        mr: 2,
        br: 3,
        mb: 4,
        bl: 5,
        ml: 6,
        tl: 7
    }, addListener = fabric.util.addListener, removeListener = fabric.util.removeListener, RIGHT_CLICK = 3, MIDDLE_CLICK = 2, LEFT_CLICK = 1;
    function checkClick(e, value) {
        return "which" in e ? e.which === value : e.button === value - 1;
    }
    fabric.util.object.extend(fabric.Canvas.prototype, {
        cursorMap: [ "n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize", "nw-resize" ],
        _initEventListeners: function() {
            this.removeListeners();
            this._bindEvents();
            addListener(fabric.window, "resize", this._onResize);
            addListener(this.upperCanvasEl, "mousedown", this._onMouseDown);
            addListener(this.upperCanvasEl, "mousemove", this._onMouseMove);
            addListener(this.upperCanvasEl, "mouseout", this._onMouseOut);
            addListener(this.upperCanvasEl, "mouseenter", this._onMouseEnter);
            addListener(this.upperCanvasEl, "wheel", this._onMouseWheel);
            addListener(this.upperCanvasEl, "contextmenu", this._onContextMenu);
            addListener(this.upperCanvasEl, "touchstart", this._onMouseDown, {
                passive: false
            });
            addListener(this.upperCanvasEl, "touchmove", this._onMouseMove, {
                passive: false
            });
            if (typeof eventjs !== "undefined" && "add" in eventjs) {
                eventjs.add(this.upperCanvasEl, "gesture", this._onGesture);
                eventjs.add(this.upperCanvasEl, "drag", this._onDrag);
                eventjs.add(this.upperCanvasEl, "orientation", this._onOrientationChange);
                eventjs.add(this.upperCanvasEl, "shake", this._onShake);
                eventjs.add(this.upperCanvasEl, "longpress", this._onLongPress);
            }
        },
        _bindEvents: function() {
            if (this.eventsBinded) {
                return;
            }
            this._onMouseDown = this._onMouseDown.bind(this);
            this._onMouseMove = this._onMouseMove.bind(this);
            this._onMouseUp = this._onMouseUp.bind(this);
            this._onResize = this._onResize.bind(this);
            this._onGesture = this._onGesture.bind(this);
            this._onDrag = this._onDrag.bind(this);
            this._onShake = this._onShake.bind(this);
            this._onLongPress = this._onLongPress.bind(this);
            this._onOrientationChange = this._onOrientationChange.bind(this);
            this._onMouseWheel = this._onMouseWheel.bind(this);
            this._onMouseOut = this._onMouseOut.bind(this);
            this._onMouseEnter = this._onMouseEnter.bind(this);
            this._onContextMenu = this._onContextMenu.bind(this);
            this.eventsBinded = true;
        },
        removeListeners: function() {
            removeListener(fabric.window, "resize", this._onResize);
            removeListener(this.upperCanvasEl, "mousedown", this._onMouseDown);
            removeListener(this.upperCanvasEl, "mousemove", this._onMouseMove);
            removeListener(this.upperCanvasEl, "mouseout", this._onMouseOut);
            removeListener(this.upperCanvasEl, "mouseenter", this._onMouseEnter);
            removeListener(this.upperCanvasEl, "wheel", this._onMouseWheel);
            removeListener(this.upperCanvasEl, "contextmenu", this._onContextMenu);
            removeListener(this.upperCanvasEl, "touchstart", this._onMouseDown);
            removeListener(this.upperCanvasEl, "touchmove", this._onMouseMove);
            if (typeof eventjs !== "undefined" && "remove" in eventjs) {
                eventjs.remove(this.upperCanvasEl, "gesture", this._onGesture);
                eventjs.remove(this.upperCanvasEl, "drag", this._onDrag);
                eventjs.remove(this.upperCanvasEl, "orientation", this._onOrientationChange);
                eventjs.remove(this.upperCanvasEl, "shake", this._onShake);
                eventjs.remove(this.upperCanvasEl, "longpress", this._onLongPress);
            }
        },
        _onGesture: function(e, self) {
            this.__onTransformGesture && this.__onTransformGesture(e, self);
        },
        _onDrag: function(e, self) {
            this.__onDrag && this.__onDrag(e, self);
        },
        _onMouseWheel: function(e) {
            this.__onMouseWheel(e);
        },
        _onMouseOut: function(e) {
            var target = this._hoveredTarget;
            this.fire("mouse:out", {
                target: target,
                e: e
            });
            this._hoveredTarget = null;
            target && target.fire("mouseout", {
                e: e
            });
            if (this._iTextInstances) {
                this._iTextInstances.forEach(function(obj) {
                    if (obj.isEditing) {
                        obj.hiddenTextarea.focus();
                    }
                });
            }
        },
        _onMouseEnter: function(e) {
            if (!this.findTarget(e)) {
                this.fire("mouse:over", {
                    target: null,
                    e: e
                });
                this._hoveredTarget = null;
            }
        },
        _onOrientationChange: function(e, self) {
            this.__onOrientationChange && this.__onOrientationChange(e, self);
        },
        _onShake: function(e, self) {
            this.__onShake && this.__onShake(e, self);
        },
        _onLongPress: function(e, self) {
            this.__onLongPress && this.__onLongPress(e, self);
        },
        _onContextMenu: function(e) {
            if (this.stopContextMenu) {
                e.stopPropagation();
                e.preventDefault();
            }
            return false;
        },
        _onMouseDown: function(e) {
            this.__onMouseDown(e);
            addListener(fabric.document, "touchend", this._onMouseUp, {
                passive: false
            });
            addListener(fabric.document, "touchmove", this._onMouseMove, {
                passive: false
            });
            removeListener(this.upperCanvasEl, "mousemove", this._onMouseMove);
            removeListener(this.upperCanvasEl, "touchmove", this._onMouseMove);
            if (e.type === "touchstart") {
                removeListener(this.upperCanvasEl, "mousedown", this._onMouseDown);
            } else {
                addListener(fabric.document, "mouseup", this._onMouseUp);
                addListener(fabric.document, "mousemove", this._onMouseMove);
            }
        },
        _onMouseUp: function(e) {
            this.__onMouseUp(e);
            removeListener(fabric.document, "mouseup", this._onMouseUp);
            removeListener(fabric.document, "touchend", this._onMouseUp);
            removeListener(fabric.document, "mousemove", this._onMouseMove);
            removeListener(fabric.document, "touchmove", this._onMouseMove);
            addListener(this.upperCanvasEl, "mousemove", this._onMouseMove);
            addListener(this.upperCanvasEl, "touchmove", this._onMouseMove, {
                passive: false
            });
            if (e.type === "touchend") {
                var _this = this;
                setTimeout(function() {
                    addListener(_this.upperCanvasEl, "mousedown", _this._onMouseDown);
                }, 400);
            }
        },
        _onMouseMove: function(e) {
            !this.allowTouchScrolling && e.preventDefault && e.preventDefault();
            this.__onMouseMove(e);
        },
        _onResize: function() {
            this.calcOffset();
        },
        _shouldRender: function(target, pointer) {
            var activeObject = this.getActiveGroup() || this.getActiveObject();
            if (activeObject && activeObject.isEditing && target === activeObject) {
                return false;
            }
            return !!(target && (target.isMoving || target !== activeObject) || !target && !!activeObject || !target && !activeObject && !this._groupSelector || pointer && this._previousPointer && this.selection && (pointer.x !== this._previousPointer.x || pointer.y !== this._previousPointer.y));
        },
        __onMouseUp: function(e) {
            var target;
            if (checkClick(e, RIGHT_CLICK)) {
                if (this.fireRightClick) {
                    this._handleEvent(e, "up", target, RIGHT_CLICK);
                }
                return;
            }
            if (checkClick(e, MIDDLE_CLICK)) {
                if (this.fireMiddleClick) {
                    this._handleEvent(e, "up", target, MIDDLE_CLICK);
                }
                return;
            }
            if (this.isDrawingMode && this._isCurrentlyDrawing) {
                this._onMouseUpInDrawingMode(e);
                return;
            }
            var searchTarget = true, transform = this._currentTransform, groupSelector = this._groupSelector, isClick = !groupSelector || groupSelector.left === 0 && groupSelector.top === 0;
            if (transform) {
                this._finalizeCurrentTransform(e);
                searchTarget = !transform.actionPerformed;
            }
            target = searchTarget ? this.findTarget(e, true) : transform.target;
            var shouldRender = this._shouldRender(target, this.getPointer(e));
            if (target || !isClick) {
                this._maybeGroupObjects(e);
            } else {
                this._groupSelector = null;
                this._currentTransform = null;
            }
            if (target) {
                target.isMoving = false;
            }
            this._setCursorFromEvent(e, target);
            this._handleEvent(e, "up", target ? target : null, LEFT_CLICK, isClick);
            target && (target.__corner = 0);
            shouldRender && this.renderAll();
        },
        _handleEvent: function(e, eventType, targetObj, button, isClick) {
            var target = typeof targetObj === "undefined" ? this.findTarget(e) : targetObj, targets = this.targets || [], options = {
                e: e,
                target: target,
                subTargets: targets,
                button: button || LEFT_CLICK,
                isClick: isClick || false
            };
            this.fire("mouse:" + eventType, options);
            target && target.fire("mouse" + eventType, options);
            for (var i = 0; i < targets.length; i++) {
                targets[i].fire("mouse" + eventType, options);
            }
        },
        _finalizeCurrentTransform: function(e) {
            var transform = this._currentTransform, target = transform.target;
            if (target._scaling) {
                target._scaling = false;
            }
            target.setCoords();
            this._restoreOriginXY(target);
            if (transform.actionPerformed || this.stateful && target.hasStateChanged()) {
                this.fire("object:modified", {
                    target: target,
                    e: e
                });
                target.fire("modified", {
                    e: e
                });
            }
        },
        _restoreOriginXY: function(target) {
            if (this._previousOriginX && this._previousOriginY) {
                var originPoint = target.translateToOriginPoint(target.getCenterPoint(), this._previousOriginX, this._previousOriginY);
                target.originX = this._previousOriginX;
                target.originY = this._previousOriginY;
                target.left = originPoint.x;
                target.top = originPoint.y;
                this._previousOriginX = null;
                this._previousOriginY = null;
            }
        },
        _onMouseDownInDrawingMode: function(e) {
            this._isCurrentlyDrawing = true;
            this.discardActiveObject(e).renderAll();
            if (this.clipTo) {
                fabric.util.clipContext(this, this.contextTop);
            }
            var pointer = this.getPointer(e);
            this.freeDrawingBrush.onMouseDown(pointer);
            this._handleEvent(e, "down");
        },
        _onMouseMoveInDrawingMode: function(e) {
            if (this._isCurrentlyDrawing) {
                var pointer = this.getPointer(e);
                this.freeDrawingBrush.onMouseMove(pointer);
            }
            this.setCursor(this.freeDrawingCursor);
            this._handleEvent(e, "move");
        },
        _onMouseUpInDrawingMode: function(e) {
            this._isCurrentlyDrawing = false;
            if (this.clipTo) {
                this.contextTop.restore();
            }
            this.freeDrawingBrush.onMouseUp();
            this._handleEvent(e, "up");
        },
        __onMouseDown: function(e) {
            var target = this.findTarget(e);
            if (checkClick(e, RIGHT_CLICK)) {
                if (this.fireRightClick) {
                    this._handleEvent(e, "down", target ? target : null, RIGHT_CLICK);
                }
                return;
            }
            if (checkClick(e, MIDDLE_CLICK)) {
                if (this.fireMiddleClick) {
                    this._handleEvent(e, "down", target ? target : null, MIDDLE_CLICK);
                }
                return;
            }
            if (this.isDrawingMode) {
                this._onMouseDownInDrawingMode(e);
                return;
            }
            if (this._currentTransform) {
                return;
            }
            var pointer = this.getPointer(e, true);
            this._previousPointer = pointer;
            var shouldRender = this._shouldRender(target, pointer), shouldGroup = this._shouldGroup(e, target);
            if (this._shouldClearSelection(e, target)) {
                this.deactivateAllWithDispatch(e);
            } else if (shouldGroup) {
                this._handleGrouping(e, target);
                target = this.getActiveGroup();
            }
            if (this.selection && (!target || !target.selectable && !target.isEditing)) {
                this._groupSelector = {
                    ex: pointer.x,
                    ey: pointer.y,
                    top: 0,
                    left: 0
                };
            }
            if (target) {
                if (target.selectable && (target.__corner || !shouldGroup)) {
                    this._beforeTransform(e, target);
                    this._setupCurrentTransform(e, target);
                }
                var activeObject = this.getActiveObject();
                if (target !== this.getActiveGroup() && target !== activeObject) {
                    this.deactivateAll();
                    if (target.selectable) {
                        activeObject && activeObject.fire("deselected", {
                            e: e
                        });
                        this.setActiveObject(target, e);
                    }
                }
            }
            this._handleEvent(e, "down", target ? target : null);
            shouldRender && this.renderAll();
        },
        _beforeTransform: function(e, target) {
            this.stateful && target.saveState();
            if (target._findTargetCorner(this.getPointer(e))) {
                this.onBeforeScaleRotate(target);
            }
        },
        _setOriginToCenter: function(target) {
            this._previousOriginX = this._currentTransform.target.originX;
            this._previousOriginY = this._currentTransform.target.originY;
            var center = target.getCenterPoint();
            target.originX = "center";
            target.originY = "center";
            target.left = center.x;
            target.top = center.y;
            this._currentTransform.left = target.left;
            this._currentTransform.top = target.top;
        },
        _setCenterToOrigin: function(target) {
            var originPoint = target.translateToOriginPoint(target.getCenterPoint(), this._previousOriginX, this._previousOriginY);
            target.originX = this._previousOriginX;
            target.originY = this._previousOriginY;
            target.left = originPoint.x;
            target.top = originPoint.y;
            this._previousOriginX = null;
            this._previousOriginY = null;
        },
        __onMouseMove: function(e) {
            var target, pointer;
            if (this.isDrawingMode) {
                this._onMouseMoveInDrawingMode(e);
                return;
            }
            if (typeof e.touches !== "undefined" && e.touches.length > 1) {
                return;
            }
            var groupSelector = this._groupSelector;
            if (groupSelector) {
                pointer = this.getPointer(e, true);
                groupSelector.left = pointer.x - groupSelector.ex;
                groupSelector.top = pointer.y - groupSelector.ey;
                this.renderTop();
            } else if (!this._currentTransform) {
                target = this.findTarget(e);
                this._setCursorFromEvent(e, target);
            } else {
                this._transformObject(e);
            }
            this._handleEvent(e, "move", target ? target : null);
        },
        __onMouseWheel: function(e) {
            this._handleEvent(e, "wheel");
        },
        _transformObject: function(e) {
            var pointer = this.getPointer(e), transform = this._currentTransform;
            transform.reset = false;
            transform.target.isMoving = true;
            transform.shiftKey = e.shiftKey;
            transform.altKey = e[this.centeredKey];
            this._beforeScaleTransform(e, transform);
            this._performTransformAction(e, transform, pointer);
            transform.actionPerformed && this.renderAll();
        },
        _performTransformAction: function(e, transform, pointer) {
            var x = pointer.x, y = pointer.y, target = transform.target, action = transform.action, actionPerformed = false;
            if (action === "rotate") {
                (actionPerformed = this._rotateObject(x, y)) && this._fire("rotating", target, e);
            } else if (action === "scale") {
                (actionPerformed = this._onScale(e, transform, x, y)) && this._fire("scaling", target, e);
            } else if (action === "scaleX") {
                (actionPerformed = this._scaleObject(x, y, "x")) && this._fire("scaling", target, e);
            } else if (action === "scaleY") {
                (actionPerformed = this._scaleObject(x, y, "y")) && this._fire("scaling", target, e);
            } else if (action === "skewX") {
                (actionPerformed = this._skewObject(x, y, "x")) && this._fire("skewing", target, e);
            } else if (action === "skewY") {
                (actionPerformed = this._skewObject(x, y, "y")) && this._fire("skewing", target, e);
            } else {
                actionPerformed = this._translateObject(x, y);
                if (actionPerformed) {
                    this._fire("moving", target, e);
                    this.setCursor(target.moveCursor || this.moveCursor);
                }
            }
            transform.actionPerformed = transform.actionPerformed || actionPerformed;
        },
        _fire: function(eventName, target, e) {
            this.fire("object:" + eventName, {
                target: target,
                e: e
            });
            target.fire(eventName, {
                e: e
            });
        },
        _beforeScaleTransform: function(e, transform) {
            if (transform.action === "scale" || transform.action === "scaleX" || transform.action === "scaleY") {
                var centerTransform = this._shouldCenterTransform(transform.target);
                if (centerTransform && (transform.originX !== "center" || transform.originY !== "center") || !centerTransform && transform.originX === "center" && transform.originY === "center") {
                    this._resetCurrentTransform();
                    transform.reset = true;
                }
            }
        },
        _onScale: function(e, transform, x, y) {
            if ((e[this.uniScaleKey] || this.uniScaleTransform) && !transform.target.get("lockUniScaling")) {
                transform.currentAction = "scale";
                return this._scaleObject(x, y);
            } else {
                if (!transform.reset && transform.currentAction === "scale") {
                    this._resetCurrentTransform();
                }
                transform.currentAction = "scaleEqually";
                return this._scaleObject(x, y, "equally");
            }
        },
        _setCursorFromEvent: function(e, target) {
            if (!target) {
                this.setCursor(this.defaultCursor);
                return false;
            }
            var hoverCursor = target.hoverCursor || this.hoverCursor, activeGroup = this.getActiveGroup(), corner = target._findTargetCorner && (!activeGroup || !activeGroup.contains(target)) && target._findTargetCorner(this.getPointer(e, true));
            if (!corner) {
                this.setCursor(hoverCursor);
            } else {
                this._setCornerCursor(corner, target, e);
            }
            return true;
        },
        _setCornerCursor: function(corner, target, e) {
            if (corner in cursorOffset) {
                this.setCursor(this._getRotatedCornerCursor(corner, target, e));
            } else if (corner === "mtr" && target.hasRotatingPoint) {
                this.setCursor(this.rotationCursor);
            } else {
                this.setCursor(this.defaultCursor);
                return false;
            }
        },
        _getRotatedCornerCursor: function(corner, target, e) {
            var n = Math.round(target.getAngle() % 360 / 45);
            if (n < 0) {
                n += 8;
            }
            n += cursorOffset[corner];
            if (e[this.altActionKey] && cursorOffset[corner] % 2 === 0) {
                n += 2;
            }
            n %= 8;
            return this.cursorMap[n];
        }
    });
})();

(function() {
    var min = Math.min, max = Math.max;
    fabric.util.object.extend(fabric.Canvas.prototype, {
        _shouldGroup: function(e, target) {
            var activeObject = this.getActiveObject();
            return e[this.selectionKey] && target && target.selectable && (this.getActiveGroup() || activeObject && activeObject !== target) && this.selection;
        },
        _handleGrouping: function(e, target) {
            var activeGroup = this.getActiveGroup();
            if (target === activeGroup) {
                target = this.findTarget(e, true);
                if (!target) {
                    return;
                }
            }
            if (activeGroup) {
                this._updateActiveGroup(target, e);
            } else {
                this._createActiveGroup(target, e);
            }
            if (this._activeGroup) {
                this._activeGroup.saveCoords();
            }
        },
        _updateActiveGroup: function(target, e) {
            var activeGroup = this.getActiveGroup();
            if (activeGroup.contains(target)) {
                activeGroup.removeWithUpdate(target);
                target.set("active", false);
                if (activeGroup.size() === 1) {
                    this.discardActiveGroup(e);
                    this.setActiveObject(activeGroup.item(0), e);
                    return;
                }
            } else {
                activeGroup.addWithUpdate(target);
            }
            this.fire("selection:created", {
                target: activeGroup,
                e: e
            });
            activeGroup.set("active", true);
        },
        _createActiveGroup: function(target, e) {
            if (this._activeObject && target !== this._activeObject) {
                var group = this._createGroup(target);
                group.addWithUpdate();
                this.setActiveGroup(group, e);
                this._activeObject = null;
                this.fire("selection:created", {
                    target: group,
                    e: e
                });
            }
            target.set("active", true);
        },
        _createGroup: function(target) {
            var objects = this.getObjects(), isActiveLower = objects.indexOf(this._activeObject) < objects.indexOf(target), groupObjects = isActiveLower ? [ this._activeObject, target ] : [ target, this._activeObject ];
            this._activeObject.isEditing && this._activeObject.exitEditing();
            return new fabric.Group(groupObjects, {
                canvas: this
            });
        },
        _groupSelectedObjects: function(e) {
            var group = this._collectObjects();
            if (group.length === 1) {
                this.setActiveObject(group[0], e);
            } else if (group.length > 1) {
                group = new fabric.Group(group.reverse(), {
                    canvas: this
                });
                group.addWithUpdate();
                this.setActiveGroup(group, e);
                group.saveCoords();
                this.fire("selection:created", {
                    target: group,
                    e: e
                });
                this.renderAll();
            }
        },
        _collectObjects: function() {
            var group = [], currentObject, x1 = this._groupSelector.ex, y1 = this._groupSelector.ey, x2 = x1 + this._groupSelector.left, y2 = y1 + this._groupSelector.top, selectionX1Y1 = new fabric.Point(min(x1, x2), min(y1, y2)), selectionX2Y2 = new fabric.Point(max(x1, x2), max(y1, y2)), isClick = x1 === x2 && y1 === y2;
            for (var i = this._objects.length; i--; ) {
                currentObject = this._objects[i];
                if (!currentObject || !currentObject.selectable || !currentObject.visible) {
                    continue;
                }
                if (currentObject.intersectsWithRect(selectionX1Y1, selectionX2Y2) || currentObject.isContainedWithinRect(selectionX1Y1, selectionX2Y2) || currentObject.containsPoint(selectionX1Y1) || currentObject.containsPoint(selectionX2Y2)) {
                    currentObject.set("active", true);
                    group.push(currentObject);
                    if (isClick) {
                        break;
                    }
                }
            }
            return group;
        },
        _maybeGroupObjects: function(e) {
            if (this.selection && this._groupSelector) {
                this._groupSelectedObjects(e);
            }
            var activeGroup = this.getActiveGroup();
            if (activeGroup) {
                activeGroup.setObjectsCoords().setCoords();
                activeGroup.isMoving = false;
                this.setCursor(this.defaultCursor);
            }
            this._groupSelector = null;
            this._currentTransform = null;
        }
    });
})();

(function() {
    var supportQuality = fabric.StaticCanvas.supports("toDataURLWithQuality");
    fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        toDataURL: function(options) {
            options || (options = {});
            var format = options.format || "png", quality = options.quality || 1, multiplier = options.multiplier || 1, cropping = {
                left: options.left || 0,
                top: options.top || 0,
                width: options.width || 0,
                height: options.height || 0
            };
            return this.__toDataURLWithMultiplier(format, quality, cropping, multiplier);
        },
        __toDataURLWithMultiplier: function(format, quality, cropping, multiplier) {
            var origWidth = this.getWidth(), origHeight = this.getHeight(), scaledWidth = (cropping.width || this.getWidth()) * multiplier, scaledHeight = (cropping.height || this.getHeight()) * multiplier, zoom = this.getZoom(), newZoom = zoom * multiplier, vp = this.viewportTransform, translateX = (vp[4] - cropping.left) * multiplier, translateY = (vp[5] - cropping.top) * multiplier, newVp = [ newZoom, 0, 0, newZoom, translateX, translateY ], originalInteractive = this.interactive;
            this.viewportTransform = newVp;
            this.interactive && (this.interactive = false);
            if (origWidth !== scaledWidth || origHeight !== scaledHeight) {
                this.setDimensions({
                    width: scaledWidth,
                    height: scaledHeight
                });
            } else {
                this.renderAll();
            }
            var data = this.__toDataURL(format, quality, cropping);
            originalInteractive && (this.interactive = originalInteractive);
            this.viewportTransform = vp;
            this.setDimensions({
                width: origWidth,
                height: origHeight
            });
            return data;
        },
        __toDataURL: function(format, quality) {
            var canvasEl = this.contextContainer.canvas;
            if (format === "jpg") {
                format = "jpeg";
            }
            var data = supportQuality ? canvasEl.toDataURL("image/" + format, quality) : canvasEl.toDataURL("image/" + format);
            return data;
        },
        toDataURLWithMultiplier: function(format, multiplier, quality) {
            return this.toDataURL({
                format: format,
                multiplier: multiplier,
                quality: quality
            });
        }
    });
})();

fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    loadFromDatalessJSON: function(json, callback, reviver) {
        return this.loadFromJSON(json, callback, reviver);
    },
    loadFromJSON: function(json, callback, reviver) {
        if (!json) {
            return;
        }
        var serialized = typeof json === "string" ? JSON.parse(json) : fabric.util.object.clone(json);
        var _this = this, renderOnAddRemove = this.renderOnAddRemove;
        this.renderOnAddRemove = false;
        this._enlivenObjects(serialized.objects, function(enlivenedObjects) {
            _this.clear();
            _this._setBgOverlay(serialized, function() {
                enlivenedObjects.forEach(function(obj, index) {
                    _this.insertAt(obj, index);
                });
                _this.renderOnAddRemove = renderOnAddRemove;
                delete serialized.objects;
                delete serialized.backgroundImage;
                delete serialized.overlayImage;
                delete serialized.background;
                delete serialized.overlay;
                _this._setOptions(serialized);
                _this.renderAll();
                callback && callback();
            });
        }, reviver);
        return this;
    },
    _setBgOverlay: function(serialized, callback) {
        var loaded = {
            backgroundColor: false,
            overlayColor: false,
            backgroundImage: false,
            overlayImage: false
        };
        if (!serialized.backgroundImage && !serialized.overlayImage && !serialized.background && !serialized.overlay) {
            callback && callback();
            return;
        }
        var cbIfLoaded = function() {
            if (loaded.backgroundImage && loaded.overlayImage && loaded.backgroundColor && loaded.overlayColor) {
                callback && callback();
            }
        };
        this.__setBgOverlay("backgroundImage", serialized.backgroundImage, loaded, cbIfLoaded);
        this.__setBgOverlay("overlayImage", serialized.overlayImage, loaded, cbIfLoaded);
        this.__setBgOverlay("backgroundColor", serialized.background, loaded, cbIfLoaded);
        this.__setBgOverlay("overlayColor", serialized.overlay, loaded, cbIfLoaded);
    },
    __setBgOverlay: function(property, value, loaded, callback) {
        var _this = this;
        if (!value) {
            loaded[property] = true;
            callback && callback();
            return;
        }
        if (property === "backgroundImage" || property === "overlayImage") {
            fabric.util.enlivenObjects([ value ], function(enlivedObject) {
                _this[property] = enlivedObject[0];
                loaded[property] = true;
                callback && callback();
            });
        } else {
            this["set" + fabric.util.string.capitalize(property, true)](value, function() {
                loaded[property] = true;
                callback && callback();
            });
        }
    },
    _enlivenObjects: function(objects, callback, reviver) {
        if (!objects || objects.length === 0) {
            callback && callback([]);
            return;
        }
        fabric.util.enlivenObjects(objects, function(enlivenedObjects) {
            callback && callback(enlivenedObjects);
        }, null, reviver);
    },
    _toDataURL: function(format, callback) {
        this.clone(function(clone) {
            callback(clone.toDataURL(format));
        });
    },
    _toDataURLWithMultiplier: function(format, multiplier, callback) {
        this.clone(function(clone) {
            callback(clone.toDataURLWithMultiplier(format, multiplier));
        });
    },
    clone: function(callback, properties) {
        var data = JSON.stringify(this.toJSON(properties));
        this.cloneWithoutData(function(clone) {
            clone.loadFromJSON(data, function() {
                callback && callback(clone);
            });
        });
    },
    cloneWithoutData: function(callback) {
        var el = fabric.document.createElement("canvas");
        el.width = this.getWidth();
        el.height = this.getHeight();
        var clone = new fabric.Canvas(el);
        clone.clipTo = this.clipTo;
        if (this.backgroundImage) {
            clone.setBackgroundImage(this.backgroundImage.src, function() {
                clone.renderAll();
                callback && callback(clone);
            });
            clone.backgroundImageOpacity = this.backgroundImageOpacity;
            clone.backgroundImageStretch = this.backgroundImageStretch;
        } else {
            callback && callback(clone);
        }
    }
});

(function() {
    var degreesToRadians = fabric.util.degreesToRadians, radiansToDegrees = fabric.util.radiansToDegrees;
    fabric.util.object.extend(fabric.Canvas.prototype, {
        __onTransformGesture: function(e, self) {
            if (this.isDrawingMode || !e.touches || e.touches.length !== 2 || "gesture" !== self.gesture) {
                return;
            }
            var target = this.findTarget(e);
            if ("undefined" !== typeof target) {
                this.__gesturesParams = {
                    e: e,
                    self: self,
                    target: target
                };
                this.__gesturesRenderer();
            }
            this.fire("touch:gesture", {
                target: target,
                e: e,
                self: self
            });
        },
        __gesturesParams: null,
        __gesturesRenderer: function() {
            if (this.__gesturesParams === null || this._currentTransform === null) {
                return;
            }
            var self = this.__gesturesParams.self, t = this._currentTransform, e = this.__gesturesParams.e;
            t.action = "scale";
            t.originX = t.originY = "center";
            this._setOriginToCenter(t.target);
            this._scaleObjectBy(self.scale, e);
            if (self.rotation !== 0) {
                t.action = "rotate";
                this._rotateObjectByAngle(self.rotation, e);
            }
            this._setCenterToOrigin(t.target);
            this.renderAll();
            t.action = "drag";
        },
        __onDrag: function(e, self) {
            this.fire("touch:drag", {
                e: e,
                self: self
            });
        },
        __onOrientationChange: function(e, self) {
            this.fire("touch:orientation", {
                e: e,
                self: self
            });
        },
        __onShake: function(e, self) {
            this.fire("touch:shake", {
                e: e,
                self: self
            });
        },
        __onLongPress: function(e, self) {
            this.fire("touch:longpress", {
                e: e,
                self: self
            });
        },
        _scaleObjectBy: function(s, e, by) {
            var t = this._currentTransform, target = t.target, lockScalingX = target.get("lockScalingX"), lockScalingY = target.get("lockScalingY");
            if (lockScalingX && lockScalingY) {
                return;
            }
            target._scaling = true;
            var constraintPosition = target.translateToOriginPoint(target.getCenterPoint(), t.originX, t.originY), dim = target._getTransformedDimensions();
            s *= fabric.devicePixelRatio;
            this._setObjectScale(new fabric.Point(t.scaleX * dim.x * s / target.scaleX, t.scaleY * dim.y * s / target.scaleY), t, lockScalingX, lockScalingY, by, target.get("lockScalingFlip"), dim);
            target.setPositionByOrigin(constraintPosition, t.originX, t.originY);
            this._fire("scaling", target, e);
        },
        _rotateObjectByAngle: function(curAngle, e) {
            var t = this._currentTransform;
            if (t.target.get("lockRotation")) {
                return;
            }
            t.target.angle = radiansToDegrees(degreesToRadians(curAngle) + t.theta);
            this._fire("rotating", t.target, e);
        }
    });
})();

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, clone = fabric.util.object.clone, toFixed = fabric.util.toFixed, capitalize = fabric.util.string.capitalize, degreesToRadians = fabric.util.degreesToRadians, supportsLineDash = fabric.StaticCanvas.supports("setLineDash"), objectCaching = !fabric.isLikelyNode, ALIASING_LIMIT = 2;
    if (fabric.Object) {
        return;
    }
    fabric.Object = fabric.util.createClass(fabric.CommonMethods, {
        type: "object",
        originX: "left",
        originY: "top",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        flipX: false,
        flipY: false,
        opacity: 1,
        angle: 0,
        skewX: 0,
        skewY: 0,
        cornerSize: 13,
        transparentCorners: true,
        hoverCursor: null,
        moveCursor: null,
        padding: 0,
        borderColor: "rgba(102,153,255,0.75)",
        borderDashArray: null,
        cornerColor: "rgba(102,153,255,0.5)",
        cornerStrokeColor: null,
        cornerStyle: "rect",
        cornerDashArray: null,
        centeredScaling: false,
        centeredRotation: true,
        fill: "rgb(0,0,0)",
        fillRule: "nonzero",
        globalCompositeOperation: "source-over",
        backgroundColor: "",
        selectionBackgroundColor: "",
        stroke: null,
        strokeWidth: 1,
        strokeDashArray: null,
        strokeLineCap: "butt",
        strokeLineJoin: "miter",
        strokeMiterLimit: 10,
        shadow: null,
        borderOpacityWhenMoving: .4,
        borderScaleFactor: 1,
        transformMatrix: null,
        minScaleLimit: .01,
        selectable: true,
        evented: true,
        visible: true,
        hasControls: true,
        hasBorders: true,
        hasRotatingPoint: true,
        rotatingPointOffset: 40,
        perPixelTargetFind: false,
        includeDefaultValues: true,
        clipTo: null,
        lockMovementX: false,
        lockMovementY: false,
        lockRotation: false,
        lockScalingX: false,
        lockScalingY: false,
        lockUniScaling: false,
        lockSkewingX: false,
        lockSkewingY: false,
        lockScalingFlip: false,
        excludeFromExport: false,
        objectCaching: objectCaching,
        statefullCache: false,
        noScaleCache: true,
        dirty: true,
        stateProperties: ("top left width height scaleX scaleY flipX flipY originX originY transformMatrix " + "stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin strokeMiterLimit " + "angle opacity fill globalCompositeOperation shadow clipTo visible backgroundColor " + "skewX skewY fillRule").split(" "),
        cacheProperties: ("fill stroke strokeWidth strokeDashArray width height" + " strokeLineCap strokeLineJoin strokeMiterLimit backgroundColor").split(" "),
        initialize: function(options) {
            options = options || {};
            if (options) {
                this.setOptions(options);
            }
        },
        _createCacheCanvas: function() {
            this._cacheProperties = {};
            this._cacheCanvas = fabric.document.createElement("canvas");
            this._cacheContext = this._cacheCanvas.getContext("2d");
            this._updateCacheCanvas();
        },
        _limitCacheSize: function(dims) {
            var perfLimitSizeTotal = fabric.perfLimitSizeTotal, maximumSide = fabric.cacheSideLimit, width = dims.width, height = dims.height, ar = width / height, limitedDims = fabric.util.limitDimsByArea(ar, perfLimitSizeTotal, maximumSide), capValue = fabric.util.capValue, max = fabric.maxCacheSideLimit, min = fabric.minCacheSideLimit, x = capValue(min, limitedDims.x, max), y = capValue(min, limitedDims.y, max);
            if (width > x) {
                dims.zoomX /= width / x;
                dims.width = x;
            } else if (width < min) {
                dims.width = min;
            }
            if (height > y) {
                dims.zoomY /= height / y;
                dims.height = y;
            } else if (height < min) {
                dims.height = min;
            }
            return dims;
        },
        _getCacheCanvasDimensions: function() {
            var zoom = this.canvas && this.canvas.getZoom() || 1, objectScale = this.getObjectScaling(), dim = this._getNonTransformedDimensions(), retina = this.canvas && this.canvas._isRetinaScaling() ? fabric.devicePixelRatio : 1, zoomX = objectScale.scaleX * zoom * retina, zoomY = objectScale.scaleY * zoom * retina, width = dim.x * zoomX, height = dim.y * zoomY;
            return {
                width: width + ALIASING_LIMIT,
                height: height + ALIASING_LIMIT,
                zoomX: zoomX,
                zoomY: zoomY
            };
        },
        _updateCacheCanvas: function() {
            if (this.noScaleCache && this.canvas && this.canvas._currentTransform) {
                var action = this.canvas._currentTransform.action;
                if (action.slice && action.slice(0, 5) === "scale") {
                    return false;
                }
            }
            var dims = this._limitCacheSize(this._getCacheCanvasDimensions()), minCacheSize = fabric.minCacheSideLimit, width = dims.width, height = dims.height, zoomX = dims.zoomX, zoomY = dims.zoomY, dimensionsChanged = width !== this.cacheWidth || height !== this.cacheHeight, zoomChanged = this.zoomX !== zoomX || this.zoomY !== zoomY, shouldRedraw = dimensionsChanged || zoomChanged, additionalWidth = 0, additionalHeight = 0, shouldResizeCanvas = false;
            if (dimensionsChanged) {
                var canvasWidth = this._cacheCanvas.width, canvasHeight = this._cacheCanvas.height, sizeGrowing = width > canvasWidth || height > canvasHeight, sizeShrinking = (width < canvasWidth * .9 || height < canvasHeight * .9) && canvasWidth > minCacheSize && canvasHeight > minCacheSize;
                shouldResizeCanvas = sizeGrowing || sizeShrinking;
                if (sizeGrowing) {
                    additionalWidth = width * .1 & ~1;
                    additionalHeight = height * .1 & ~1;
                }
            }
            if (shouldRedraw) {
                if (shouldResizeCanvas) {
                    this._cacheCanvas.width = Math.max(Math.ceil(width) + additionalWidth, minCacheSize);
                    this._cacheCanvas.height = Math.max(Math.ceil(height) + additionalHeight, minCacheSize);
                    this.cacheTranslationX = (width + additionalWidth) / 2;
                    this.cacheTranslationY = (height + additionalHeight) / 2;
                } else {
                    this._cacheContext.setTransform(1, 0, 0, 1, 0, 0);
                    this._cacheContext.clearRect(0, 0, this._cacheCanvas.width, this._cacheCanvas.height);
                }
                this.cacheWidth = width;
                this.cacheHeight = height;
                this._cacheContext.translate(this.cacheTranslationX, this.cacheTranslationY);
                this._cacheContext.scale(zoomX, zoomY);
                this.zoomX = zoomX;
                this.zoomY = zoomY;
                return true;
            }
            return false;
        },
        setOptions: function(options) {
            this._setOptions(options);
            this._initGradient(options.fill, "fill");
            this._initGradient(options.stroke, "stroke");
            this._initClipping(options);
            this._initPattern(options.fill, "fill");
            this._initPattern(options.stroke, "stroke");
        },
        transform: function(ctx, fromLeft) {
            if (this.group && !this.group._transformDone && this.group === this.canvas._activeGroup) {
                this.group.transform(ctx);
            }
            var center = fromLeft ? this._getLeftTopCoords() : this.getCenterPoint();
            ctx.translate(center.x, center.y);
            this.angle && ctx.rotate(degreesToRadians(this.angle));
            ctx.scale(this.scaleX * (this.flipX ? -1 : 1), this.scaleY * (this.flipY ? -1 : 1));
            this.skewX && ctx.transform(1, 0, Math.tan(degreesToRadians(this.skewX)), 1, 0, 0);
            this.skewY && ctx.transform(1, Math.tan(degreesToRadians(this.skewY)), 0, 1, 0, 0);
        },
        toObject: function(propertiesToInclude) {
            var NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS, object = {
                type: this.type,
                originX: this.originX,
                originY: this.originY,
                left: toFixed(this.left, NUM_FRACTION_DIGITS),
                top: toFixed(this.top, NUM_FRACTION_DIGITS),
                width: toFixed(this.width, NUM_FRACTION_DIGITS),
                height: toFixed(this.height, NUM_FRACTION_DIGITS),
                fill: this.fill && this.fill.toObject ? this.fill.toObject() : this.fill,
                stroke: this.stroke && this.stroke.toObject ? this.stroke.toObject() : this.stroke,
                strokeWidth: toFixed(this.strokeWidth, NUM_FRACTION_DIGITS),
                strokeDashArray: this.strokeDashArray ? this.strokeDashArray.concat() : this.strokeDashArray,
                strokeLineCap: this.strokeLineCap,
                strokeLineJoin: this.strokeLineJoin,
                strokeMiterLimit: toFixed(this.strokeMiterLimit, NUM_FRACTION_DIGITS),
                scaleX: toFixed(this.scaleX, NUM_FRACTION_DIGITS),
                scaleY: toFixed(this.scaleY, NUM_FRACTION_DIGITS),
                angle: toFixed(this.getAngle(), NUM_FRACTION_DIGITS),
                flipX: this.flipX,
                flipY: this.flipY,
                opacity: toFixed(this.opacity, NUM_FRACTION_DIGITS),
                shadow: this.shadow && this.shadow.toObject ? this.shadow.toObject() : this.shadow,
                visible: this.visible,
                clipTo: this.clipTo && String(this.clipTo),
                backgroundColor: this.backgroundColor,
                fillRule: this.fillRule,
                globalCompositeOperation: this.globalCompositeOperation,
                transformMatrix: this.transformMatrix ? this.transformMatrix.concat() : null,
                skewX: toFixed(this.skewX, NUM_FRACTION_DIGITS),
                skewY: toFixed(this.skewY, NUM_FRACTION_DIGITS)
            };
            fabric.util.populateWithProperties(this, object, propertiesToInclude);
            if (!this.includeDefaultValues) {
                object = this._removeDefaultValues(object);
            }
            return object;
        },
        toDatalessObject: function(propertiesToInclude) {
            return this.toObject(propertiesToInclude);
        },
        _removeDefaultValues: function(object) {
            var prototype = fabric.util.getKlass(object.type).prototype, stateProperties = prototype.stateProperties;
            stateProperties.forEach(function(prop) {
                if (object[prop] === prototype[prop]) {
                    delete object[prop];
                }
                var isArray = Object.prototype.toString.call(object[prop]) === "[object Array]" && Object.prototype.toString.call(prototype[prop]) === "[object Array]";
                if (isArray && object[prop].length === 0 && prototype[prop].length === 0) {
                    delete object[prop];
                }
            });
            return object;
        },
        toString: function() {
            return "#<fabric." + capitalize(this.type) + ">";
        },
        getObjectScaling: function() {
            var scaleX = this.scaleX, scaleY = this.scaleY;
            if (this.group) {
                var scaling = this.group.getObjectScaling();
                scaleX *= scaling.scaleX;
                scaleY *= scaling.scaleY;
            }
            return {
                scaleX: scaleX,
                scaleY: scaleY
            };
        },
        _set: function(key, value) {
            var shouldConstrainValue = key === "scaleX" || key === "scaleY";
            if (shouldConstrainValue) {
                value = this._constrainScale(value);
            }
            if (key === "scaleX" && value < 0) {
                this.flipX = !this.flipX;
                value *= -1;
            } else if (key === "scaleY" && value < 0) {
                this.flipY = !this.flipY;
                value *= -1;
            } else if (key === "shadow" && value && !(value instanceof fabric.Shadow)) {
                value = new fabric.Shadow(value);
            } else if (key === "dirty" && this.group) {
                this.group.set("dirty", value);
            }
            this[key] = value;
            if (this.cacheProperties.indexOf(key) > -1) {
                if (this.group) {
                    this.group.set("dirty", true);
                }
                this.dirty = true;
            }
            if (this.group && this.stateProperties.indexOf(key) > -1) {
                this.group.set("dirty", true);
            }
            if (key === "width" || key === "height") {
                this.minScaleLimit = Math.min(.1, 1 / Math.max(this.width, this.height));
            }
            return this;
        },
        setOnGroup: function() {},
        setSourcePath: function(value) {
            this.sourcePath = value;
            return this;
        },
        getViewportTransform: function() {
            if (this.canvas && this.canvas.viewportTransform) {
                return this.canvas.viewportTransform;
            }
            return fabric.iMatrix.concat();
        },
        isNotVisible: function() {
            return this.opacity === 0 || this.width === 0 && this.height === 0 || !this.visible;
        },
        render: function(ctx, noTransform) {
            if (this.isNotVisible()) {
                return;
            }
            if (this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen()) {
                return;
            }
            ctx.save();
            this._setupCompositeOperation(ctx);
            this.drawSelectionBackground(ctx);
            if (!noTransform) {
                this.transform(ctx);
            }
            this._setOpacity(ctx);
            this._setShadow(ctx);
            if (this.transformMatrix) {
                ctx.transform.apply(ctx, this.transformMatrix);
            }
            this.clipTo && fabric.util.clipContext(this, ctx);
            if (this.shouldCache(noTransform)) {
                if (!this._cacheCanvas) {
                    this._createCacheCanvas();
                }
                if (this.isCacheDirty(noTransform)) {
                    this.statefullCache && this.saveState({
                        propertySet: "cacheProperties"
                    });
                    this.drawObject(this._cacheContext, noTransform);
                    this.dirty = false;
                }
                this.drawCacheOnCanvas(ctx);
            } else {
                this.dirty = false;
                this.drawObject(ctx, noTransform);
                if (noTransform && this.objectCaching && this.statefullCache) {
                    this.saveState({
                        propertySet: "cacheProperties"
                    });
                }
            }
            this.clipTo && ctx.restore();
            ctx.restore();
        },
        needsItsOwnCache: function() {
            return false;
        },
        shouldCache: function(noTransform) {
            return !noTransform && this.objectCaching && (!this.group || this.needsItsOwnCache() || !this.group.isCaching());
        },
        willDrawShadow: function() {
            return !!this.shadow && (this.shadow.offsetX !== 0 || this.shadow.offsetY !== 0);
        },
        drawObject: function(ctx, noTransform) {
            this._renderBackground(ctx);
            this._setStrokeStyles(ctx);
            this._setFillStyles(ctx);
            this._render(ctx, noTransform);
        },
        drawCacheOnCanvas: function(ctx) {
            ctx.scale(1 / this.zoomX, 1 / this.zoomY);
            ctx.drawImage(this._cacheCanvas, -this.cacheTranslationX, -this.cacheTranslationY);
        },
        isCacheDirty: function(skipCanvas) {
            if (this.isNotVisible()) {
                return false;
            }
            if (this._cacheCanvas && !skipCanvas && this._updateCacheCanvas()) {
                return true;
            } else {
                if (this.dirty || this.statefullCache && this.hasStateChanged("cacheProperties")) {
                    if (this._cacheCanvas && !skipCanvas) {
                        var width = this.cacheWidth / this.zoomX;
                        var height = this.cacheHeight / this.zoomY;
                        this._cacheContext.clearRect(-width / 2, -height / 2, width, height);
                    }
                    return true;
                }
            }
            return false;
        },
        _renderBackground: function(ctx) {
            if (!this.backgroundColor) {
                return;
            }
            var dim = this._getNonTransformedDimensions();
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(-dim.x / 2, -dim.y / 2, dim.x, dim.y);
            this._removeShadow(ctx);
        },
        _setOpacity: function(ctx) {
            ctx.globalAlpha *= this.opacity;
        },
        _setStrokeStyles: function(ctx) {
            if (this.stroke) {
                ctx.lineWidth = this.strokeWidth;
                ctx.lineCap = this.strokeLineCap;
                ctx.lineJoin = this.strokeLineJoin;
                ctx.miterLimit = this.strokeMiterLimit;
                ctx.strokeStyle = this.stroke.toLive ? this.stroke.toLive(ctx, this) : this.stroke;
            }
        },
        _setFillStyles: function(ctx) {
            if (this.fill) {
                ctx.fillStyle = this.fill.toLive ? this.fill.toLive(ctx, this) : this.fill;
            }
        },
        _setLineDash: function(ctx, dashArray, alternative) {
            if (!dashArray) {
                return;
            }
            if (1 & dashArray.length) {
                dashArray.push.apply(dashArray, dashArray);
            }
            if (supportsLineDash) {
                ctx.setLineDash(dashArray);
            } else {
                alternative && alternative(ctx);
            }
        },
        _renderControls: function(ctx) {
            if (!this.active || this.group && this.group !== this.canvas.getActiveGroup()) {
                return;
            }
            var vpt = this.getViewportTransform(), matrix = this.calcTransformMatrix(), options;
            matrix = fabric.util.multiplyTransformMatrices(vpt, matrix);
            options = fabric.util.qrDecompose(matrix);
            ctx.save();
            ctx.translate(options.translateX, options.translateY);
            ctx.lineWidth = 1 * this.borderScaleFactor;
            if (!this.group) {
                ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
            }
            if (this.group && this.group === this.canvas.getActiveGroup()) {
                ctx.rotate(degreesToRadians(options.angle));
                this.drawBordersInGroup(ctx, options);
            } else {
                ctx.rotate(degreesToRadians(this.angle));
                this.drawBorders(ctx);
            }
            this.drawControls(ctx);
            ctx.restore();
        },
        _setShadow: function(ctx) {
            if (!this.shadow) {
                return;
            }
            var multX = this.canvas && this.canvas.viewportTransform[0] || 1, multY = this.canvas && this.canvas.viewportTransform[3] || 1, scaling = this.getObjectScaling();
            if (this.canvas && this.canvas._isRetinaScaling()) {
                multX *= fabric.devicePixelRatio;
                multY *= fabric.devicePixelRatio;
            }
            ctx.shadowColor = this.shadow.color;
            ctx.shadowBlur = this.shadow.blur * (multX + multY) * (scaling.scaleX + scaling.scaleY) / 4;
            ctx.shadowOffsetX = this.shadow.offsetX * multX * scaling.scaleX;
            ctx.shadowOffsetY = this.shadow.offsetY * multY * scaling.scaleY;
        },
        _removeShadow: function(ctx) {
            if (!this.shadow) {
                return;
            }
            ctx.shadowColor = "";
            ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
        },
        _applyPatternGradientTransform: function(ctx, filler) {
            if (!filler.toLive) {
                return;
            }
            var transform = filler.gradientTransform || filler.patternTransform;
            if (transform) {
                ctx.transform.apply(ctx, transform);
            }
            var offsetX = -this.width / 2 + filler.offsetX || 0, offsetY = -this.height / 2 + filler.offsetY || 0;
            ctx.translate(offsetX, offsetY);
        },
        _renderFill: function(ctx) {
            if (!this.fill) {
                return;
            }
            ctx.save();
            this._applyPatternGradientTransform(ctx, this.fill);
            if (this.fillRule === "evenodd") {
                ctx.fill("evenodd");
            } else {
                ctx.fill();
            }
            ctx.restore();
        },
        _renderStroke: function(ctx) {
            if (!this.stroke || this.strokeWidth === 0) {
                return;
            }
            if (this.shadow && !this.shadow.affectStroke) {
                this._removeShadow(ctx);
            }
            ctx.save();
            this._setLineDash(ctx, this.strokeDashArray, this._renderDashedStroke);
            this._applyPatternGradientTransform(ctx, this.stroke);
            ctx.stroke();
            ctx.restore();
        },
        clone: function(callback, propertiesToInclude) {
            if (this.constructor.fromObject) {
                return this.constructor.fromObject(this.toObject(propertiesToInclude), callback);
            }
            return new fabric.Object(this.toObject(propertiesToInclude));
        },
        cloneAsImage: function(callback, options) {
            var dataUrl = this.toDataURL(options);
            fabric.util.loadImage(dataUrl, function(img) {
                if (callback) {
                    callback(new fabric.Image(img));
                }
            });
            return this;
        },
        toDataURL: function(options) {
            options || (options = {});
            var el = fabric.util.createCanvasElement(), boundingRect = this.getBoundingRect();
            el.width = boundingRect.width;
            el.height = boundingRect.height;
            fabric.util.wrapElement(el, "div");
            var canvas = new fabric.StaticCanvas(el, {
                enableRetinaScaling: options.enableRetinaScaling
            });
            if (options.format === "jpg") {
                options.format = "jpeg";
            }
            if (options.format === "jpeg") {
                canvas.backgroundColor = "#fff";
            }
            var origParams = {
                active: this.get("active"),
                left: this.getLeft(),
                top: this.getTop()
            };
            this.set("active", false);
            this.setPositionByOrigin(new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2), "center", "center");
            var originalCanvas = this.canvas;
            canvas.add(this);
            var data = canvas.toDataURL(options);
            this.set(origParams).setCoords();
            this.canvas = originalCanvas;
            canvas.dispose();
            canvas = null;
            return data;
        },
        isType: function(type) {
            return this.type === type;
        },
        complexity: function() {
            return 1;
        },
        toJSON: function(propertiesToInclude) {
            return this.toObject(propertiesToInclude);
        },
        setGradient: function(property, options) {
            options || (options = {});
            var gradient = {
                colorStops: []
            };
            gradient.type = options.type || (options.r1 || options.r2 ? "radial" : "linear");
            gradient.coords = {
                x1: options.x1,
                y1: options.y1,
                x2: options.x2,
                y2: options.y2
            };
            if (options.r1 || options.r2) {
                gradient.coords.r1 = options.r1;
                gradient.coords.r2 = options.r2;
            }
            gradient.gradientTransform = options.gradientTransform;
            fabric.Gradient.prototype.addColorStop.call(gradient, options.colorStops);
            return this.set(property, fabric.Gradient.forObject(this, gradient));
        },
        setPatternFill: function(options) {
            return this.set("fill", new fabric.Pattern(options));
        },
        setShadow: function(options) {
            return this.set("shadow", options ? new fabric.Shadow(options) : null);
        },
        setColor: function(color) {
            this.set("fill", color);
            return this;
        },
        setAngle: function(angle) {
            var shouldCenterOrigin = (this.originX !== "center" || this.originY !== "center") && this.centeredRotation;
            if (shouldCenterOrigin) {
                this._setOriginToCenter();
            }
            this.set("angle", angle);
            if (shouldCenterOrigin) {
                this._resetOrigin();
            }
            return this;
        },
        centerH: function() {
            this.canvas && this.canvas.centerObjectH(this);
            return this;
        },
        viewportCenterH: function() {
            this.canvas && this.canvas.viewportCenterObjectH(this);
            return this;
        },
        centerV: function() {
            this.canvas && this.canvas.centerObjectV(this);
            return this;
        },
        viewportCenterV: function() {
            this.canvas && this.canvas.viewportCenterObjectV(this);
            return this;
        },
        center: function() {
            this.canvas && this.canvas.centerObject(this);
            return this;
        },
        viewportCenter: function() {
            this.canvas && this.canvas.viewportCenterObject(this);
            return this;
        },
        remove: function() {
            if (this.canvas) {
                if (this.group && this.group === this.canvas._activeGroup) {
                    this.group.remove(this);
                }
                this.canvas.remove(this);
            }
            return this;
        },
        getLocalPointer: function(e, pointer) {
            pointer = pointer || this.canvas.getPointer(e);
            var pClicked = new fabric.Point(pointer.x, pointer.y), objectLeftTop = this._getLeftTopCoords();
            if (this.angle) {
                pClicked = fabric.util.rotatePoint(pClicked, objectLeftTop, degreesToRadians(-this.angle));
            }
            return {
                x: pClicked.x - objectLeftTop.x,
                y: pClicked.y - objectLeftTop.y
            };
        },
        _setupCompositeOperation: function(ctx) {
            if (this.globalCompositeOperation) {
                ctx.globalCompositeOperation = this.globalCompositeOperation;
            }
        }
    });
    fabric.util.createAccessors(fabric.Object);
    fabric.Object.prototype.rotate = fabric.Object.prototype.setAngle;
    extend(fabric.Object.prototype, fabric.Observable);
    fabric.Object.NUM_FRACTION_DIGITS = 2;
    fabric.Object._fromObject = function(className, object, callback, forceAsync, extraParam) {
        var klass = fabric[className];
        object = clone(object, true);
        if (forceAsync) {
            fabric.util.enlivenPatterns([ object.fill, object.stroke ], function(patterns) {
                if (typeof patterns[0] !== "undefined") {
                    object.fill = patterns[0];
                }
                if (typeof patterns[1] !== "undefined") {
                    object.stroke = patterns[1];
                }
                var instance = extraParam ? new klass(object[extraParam], object) : new klass(object);
                callback && callback(instance);
            });
        } else {
            var instance = extraParam ? new klass(object[extraParam], object) : new klass(object);
            callback && callback(instance);
            return instance;
        }
    };
    fabric.Object.__uid = 0;
})(typeof exports !== "undefined" ? exports : this);

(function() {
    var degreesToRadians = fabric.util.degreesToRadians, originXOffset = {
        left: -.5,
        center: 0,
        right: .5
    }, originYOffset = {
        top: -.5,
        center: 0,
        bottom: .5
    };
    fabric.util.object.extend(fabric.Object.prototype, {
        translateToGivenOrigin: function(point, fromOriginX, fromOriginY, toOriginX, toOriginY) {
            var x = point.x, y = point.y, offsetX, offsetY, dim;
            if (typeof fromOriginX === "string") {
                fromOriginX = originXOffset[fromOriginX];
            } else {
                fromOriginX -= .5;
            }
            if (typeof toOriginX === "string") {
                toOriginX = originXOffset[toOriginX];
            } else {
                toOriginX -= .5;
            }
            offsetX = toOriginX - fromOriginX;
            if (typeof fromOriginY === "string") {
                fromOriginY = originYOffset[fromOriginY];
            } else {
                fromOriginY -= .5;
            }
            if (typeof toOriginY === "string") {
                toOriginY = originYOffset[toOriginY];
            } else {
                toOriginY -= .5;
            }
            offsetY = toOriginY - fromOriginY;
            if (offsetX || offsetY) {
                dim = this._getTransformedDimensions();
                x = point.x + offsetX * dim.x;
                y = point.y + offsetY * dim.y;
            }
            return new fabric.Point(x, y);
        },
        translateToCenterPoint: function(point, originX, originY) {
            var p = this.translateToGivenOrigin(point, originX, originY, "center", "center");
            if (this.angle) {
                return fabric.util.rotatePoint(p, point, degreesToRadians(this.angle));
            }
            return p;
        },
        translateToOriginPoint: function(center, originX, originY) {
            var p = this.translateToGivenOrigin(center, "center", "center", originX, originY);
            if (this.angle) {
                return fabric.util.rotatePoint(p, center, degreesToRadians(this.angle));
            }
            return p;
        },
        getCenterPoint: function() {
            var leftTop = new fabric.Point(this.left, this.top);
            return this.translateToCenterPoint(leftTop, this.originX, this.originY);
        },
        getPointByOrigin: function(originX, originY) {
            var center = this.getCenterPoint();
            return this.translateToOriginPoint(center, originX, originY);
        },
        toLocalPoint: function(point, originX, originY) {
            var center = this.getCenterPoint(), p, p2;
            if (typeof originX !== "undefined" && typeof originY !== "undefined") {
                p = this.translateToGivenOrigin(center, "center", "center", originX, originY);
            } else {
                p = new fabric.Point(this.left, this.top);
            }
            p2 = new fabric.Point(point.x, point.y);
            if (this.angle) {
                p2 = fabric.util.rotatePoint(p2, center, -degreesToRadians(this.angle));
            }
            return p2.subtractEquals(p);
        },
        setPositionByOrigin: function(pos, originX, originY) {
            var center = this.translateToCenterPoint(pos, originX, originY), position = this.translateToOriginPoint(center, this.originX, this.originY);
            this.set("left", position.x);
            this.set("top", position.y);
        },
        adjustPosition: function(to) {
            var angle = degreesToRadians(this.angle), hypotFull = this.getWidth(), xFull = Math.cos(angle) * hypotFull, yFull = Math.sin(angle) * hypotFull, offsetFrom, offsetTo;
            if (typeof this.originX === "string") {
                offsetFrom = originXOffset[this.originX];
            } else {
                offsetFrom = this.originX - .5;
            }
            if (typeof to === "string") {
                offsetTo = originXOffset[to];
            } else {
                offsetTo = to - .5;
            }
            this.left += xFull * (offsetTo - offsetFrom);
            this.top += yFull * (offsetTo - offsetFrom);
            this.setCoords();
            this.originX = to;
        },
        _setOriginToCenter: function() {
            this._originalOriginX = this.originX;
            this._originalOriginY = this.originY;
            var center = this.getCenterPoint();
            this.originX = "center";
            this.originY = "center";
            this.left = center.x;
            this.top = center.y;
        },
        _resetOrigin: function() {
            var originPoint = this.translateToOriginPoint(this.getCenterPoint(), this._originalOriginX, this._originalOriginY);
            this.originX = this._originalOriginX;
            this.originY = this._originalOriginY;
            this.left = originPoint.x;
            this.top = originPoint.y;
            this._originalOriginX = null;
            this._originalOriginY = null;
        },
        _getLeftTopCoords: function() {
            return this.translateToOriginPoint(this.getCenterPoint(), "left", "top");
        },
        onDeselect: function() {}
    });
})();

(function() {
    function getCoords(coords) {
        return [ new fabric.Point(coords.tl.x, coords.tl.y), new fabric.Point(coords.tr.x, coords.tr.y), new fabric.Point(coords.br.x, coords.br.y), new fabric.Point(coords.bl.x, coords.bl.y) ];
    }
    var degreesToRadians = fabric.util.degreesToRadians, multiplyMatrices = fabric.util.multiplyTransformMatrices;
    fabric.util.object.extend(fabric.Object.prototype, {
        oCoords: null,
        aCoords: null,
        getCoords: function(absolute, calculate) {
            if (!this.oCoords) {
                this.setCoords();
            }
            var coords = absolute ? this.aCoords : this.oCoords;
            return getCoords(calculate ? this.calcCoords(absolute) : coords);
        },
        intersectsWithRect: function(pointTL, pointBR, absolute, calculate) {
            var coords = this.getCoords(absolute, calculate), intersection = fabric.Intersection.intersectPolygonRectangle(coords, pointTL, pointBR);
            return intersection.status === "Intersection";
        },
        intersectsWithObject: function(other, absolute, calculate) {
            var intersection = fabric.Intersection.intersectPolygonPolygon(this.getCoords(absolute, calculate), other.getCoords(absolute, calculate));
            return intersection.status === "Intersection" || other.isContainedWithinObject(this, absolute, calculate) || this.isContainedWithinObject(other, absolute, calculate);
        },
        isContainedWithinObject: function(other, absolute, calculate) {
            var points = this.getCoords(absolute, calculate), i = 0, lines = other._getImageLines(calculate ? other.calcCoords(absolute) : absolute ? other.aCoords : other.oCoords);
            for (;i < 4; i++) {
                if (!other.containsPoint(points[i], lines)) {
                    return false;
                }
            }
            return true;
        },
        isContainedWithinRect: function(pointTL, pointBR, absolute, calculate) {
            var boundingRect = this.getBoundingRect(absolute, calculate);
            return boundingRect.left >= pointTL.x && boundingRect.left + boundingRect.width <= pointBR.x && boundingRect.top >= pointTL.y && boundingRect.top + boundingRect.height <= pointBR.y;
        },
        containsPoint: function(point, lines, absolute, calculate) {
            var lines = lines || this._getImageLines(calculate ? this.calcCoords(absolute) : absolute ? this.aCoords : this.oCoords), xPoints = this._findCrossPoints(point, lines);
            return xPoints !== 0 && xPoints % 2 === 1;
        },
        isOnScreen: function(calculate) {
            if (!this.canvas) {
                return false;
            }
            var pointTL = this.canvas.vptCoords.tl, pointBR = this.canvas.vptCoords.br;
            var points = this.getCoords(true, calculate), point;
            for (var i = 0; i < 4; i++) {
                point = points[i];
                if (point.x <= pointBR.x && point.x >= pointTL.x && point.y <= pointBR.y && point.y >= pointTL.y) {
                    return true;
                }
            }
            if (this.intersectsWithRect(pointTL, pointBR, true)) {
                return true;
            }
            var centerPoint = {
                x: (pointTL.x + pointBR.x) / 2,
                y: (pointTL.y + pointBR.y) / 2
            };
            if (this.containsPoint(centerPoint, null, true)) {
                return true;
            }
            return false;
        },
        _getImageLines: function(oCoords) {
            return {
                topline: {
                    o: oCoords.tl,
                    d: oCoords.tr
                },
                rightline: {
                    o: oCoords.tr,
                    d: oCoords.br
                },
                bottomline: {
                    o: oCoords.br,
                    d: oCoords.bl
                },
                leftline: {
                    o: oCoords.bl,
                    d: oCoords.tl
                }
            };
        },
        _findCrossPoints: function(point, lines) {
            var b1, b2, a1, a2, xi, xcount = 0, iLine;
            for (var lineKey in lines) {
                iLine = lines[lineKey];
                if (iLine.o.y < point.y && iLine.d.y < point.y) {
                    continue;
                }
                if (iLine.o.y >= point.y && iLine.d.y >= point.y) {
                    continue;
                }
                if (iLine.o.x === iLine.d.x && iLine.o.x >= point.x) {
                    xi = iLine.o.x;
                } else {
                    b1 = 0;
                    b2 = (iLine.d.y - iLine.o.y) / (iLine.d.x - iLine.o.x);
                    a1 = point.y - b1 * point.x;
                    a2 = iLine.o.y - b2 * iLine.o.x;
                    xi = -(a1 - a2) / (b1 - b2);
                }
                if (xi >= point.x) {
                    xcount += 1;
                }
                if (xcount === 2) {
                    break;
                }
            }
            return xcount;
        },
        getBoundingRectWidth: function() {
            return this.getBoundingRect().width;
        },
        getBoundingRectHeight: function() {
            return this.getBoundingRect().height;
        },
        getBoundingRect: function(absolute, calculate) {
            var coords = this.getCoords(absolute, calculate);
            return fabric.util.makeBoundingBoxFromPoints(coords);
        },
        getWidth: function() {
            return this._getTransformedDimensions().x;
        },
        getHeight: function() {
            return this._getTransformedDimensions().y;
        },
        _constrainScale: function(value) {
            if (Math.abs(value) < this.minScaleLimit) {
                if (value < 0) {
                    return -this.minScaleLimit;
                } else {
                    return this.minScaleLimit;
                }
            }
            return value;
        },
        scale: function(value) {
            value = this._constrainScale(value);
            if (value < 0) {
                this.flipX = !this.flipX;
                this.flipY = !this.flipY;
                value *= -1;
            }
            this.scaleX = value;
            this.scaleY = value;
            return this.setCoords();
        },
        scaleToWidth: function(value) {
            var boundingRectFactor = this.getBoundingRect().width / this.getWidth();
            return this.scale(value / this.width / boundingRectFactor);
        },
        scaleToHeight: function(value) {
            var boundingRectFactor = this.getBoundingRect().height / this.getHeight();
            return this.scale(value / this.height / boundingRectFactor);
        },
        calcCoords: function(absolute) {
            var theta = degreesToRadians(this.angle), vpt = this.getViewportTransform(), dim = absolute ? this._getTransformedDimensions() : this._calculateCurrentDimensions(), currentWidth = dim.x, currentHeight = dim.y, sinTh = Math.sin(theta), cosTh = Math.cos(theta), _angle = currentWidth > 0 ? Math.atan(currentHeight / currentWidth) : 0, _hypotenuse = currentWidth / Math.cos(_angle) / 2, offsetX = Math.cos(_angle + theta) * _hypotenuse, offsetY = Math.sin(_angle + theta) * _hypotenuse, center = this.getCenterPoint(), coords = absolute ? center : fabric.util.transformPoint(center, vpt), tl = new fabric.Point(coords.x - offsetX, coords.y - offsetY), tr = new fabric.Point(tl.x + currentWidth * cosTh, tl.y + currentWidth * sinTh), bl = new fabric.Point(tl.x - currentHeight * sinTh, tl.y + currentHeight * cosTh), br = new fabric.Point(coords.x + offsetX, coords.y + offsetY);
            if (!absolute) {
                var ml = new fabric.Point((tl.x + bl.x) / 2, (tl.y + bl.y) / 2), mt = new fabric.Point((tr.x + tl.x) / 2, (tr.y + tl.y) / 2), mr = new fabric.Point((br.x + tr.x) / 2, (br.y + tr.y) / 2), mb = new fabric.Point((br.x + bl.x) / 2, (br.y + bl.y) / 2), mtr = new fabric.Point(mt.x + sinTh * this.rotatingPointOffset, mt.y - cosTh * this.rotatingPointOffset);
            }
            var coords = {
                tl: tl,
                tr: tr,
                br: br,
                bl: bl
            };
            if (!absolute) {
                coords.ml = ml;
                coords.mt = mt;
                coords.mr = mr;
                coords.mb = mb;
                coords.mtr = mtr;
            }
            return coords;
        },
        setCoords: function(ignoreZoom, skipAbsolute) {
            this.oCoords = this.calcCoords(ignoreZoom);
            if (!skipAbsolute) {
                this.aCoords = this.calcCoords(true);
            }
            ignoreZoom || this._setCornerCoords && this._setCornerCoords();
            return this;
        },
        _calcRotateMatrix: function() {
            if (this.angle) {
                var theta = degreesToRadians(this.angle), cos = Math.cos(theta), sin = Math.sin(theta);
                if (cos === 6.123233995736766e-17 || cos === -1.8369701987210297e-16) {
                    cos = 0;
                }
                return [ cos, sin, -sin, cos, 0, 0 ];
            }
            return fabric.iMatrix.concat();
        },
        calcTransformMatrix: function(skipGroup) {
            var center = this.getCenterPoint(), translateMatrix = [ 1, 0, 0, 1, center.x, center.y ], rotateMatrix, dimensionMatrix = this._calcDimensionsTransformMatrix(this.skewX, this.skewY, true), matrix;
            if (this.group && !skipGroup) {
                matrix = multiplyMatrices(this.group.calcTransformMatrix(), translateMatrix);
            } else {
                matrix = translateMatrix;
            }
            if (this.angle) {
                rotateMatrix = this._calcRotateMatrix();
                matrix = multiplyMatrices(matrix, rotateMatrix);
            }
            matrix = multiplyMatrices(matrix, dimensionMatrix);
            return matrix;
        },
        _calcDimensionsTransformMatrix: function(skewX, skewY, flipping) {
            var skewMatrix, scaleX = this.scaleX * (flipping && this.flipX ? -1 : 1), scaleY = this.scaleY * (flipping && this.flipY ? -1 : 1), scaleMatrix = [ scaleX, 0, 0, scaleY, 0, 0 ];
            if (skewX) {
                skewMatrix = [ 1, 0, Math.tan(degreesToRadians(skewX)), 1 ];
                scaleMatrix = multiplyMatrices(scaleMatrix, skewMatrix, true);
            }
            if (skewY) {
                skewMatrix = [ 1, Math.tan(degreesToRadians(skewY)), 0, 1 ];
                scaleMatrix = multiplyMatrices(scaleMatrix, skewMatrix, true);
            }
            return scaleMatrix;
        },
        _getNonTransformedDimensions: function() {
            var strokeWidth = this.strokeWidth, w = this.width + strokeWidth, h = this.height + strokeWidth;
            return {
                x: w,
                y: h
            };
        },
        _getTransformedDimensions: function(skewX, skewY) {
            if (typeof skewX === "undefined") {
                skewX = this.skewX;
            }
            if (typeof skewY === "undefined") {
                skewY = this.skewY;
            }
            var dimensions = this._getNonTransformedDimensions(), dimX = dimensions.x / 2, dimY = dimensions.y / 2, points = [ {
                x: -dimX,
                y: -dimY
            }, {
                x: dimX,
                y: -dimY
            }, {
                x: -dimX,
                y: dimY
            }, {
                x: dimX,
                y: dimY
            } ], i, transformMatrix = this._calcDimensionsTransformMatrix(skewX, skewY, false), bbox;
            for (i = 0; i < points.length; i++) {
                points[i] = fabric.util.transformPoint(points[i], transformMatrix);
            }
            bbox = fabric.util.makeBoundingBoxFromPoints(points);
            return {
                x: bbox.width,
                y: bbox.height
            };
        },
        _calculateCurrentDimensions: function() {
            var vpt = this.getViewportTransform(), dim = this._getTransformedDimensions(), p = fabric.util.transformPoint(dim, vpt, true);
            return p.scalarAdd(2 * this.padding);
        }
    });
})();

fabric.util.object.extend(fabric.Object.prototype, {
    sendToBack: function() {
        if (this.group) {
            fabric.StaticCanvas.prototype.sendToBack.call(this.group, this);
        } else {
            this.canvas.sendToBack(this);
        }
        return this;
    },
    bringToFront: function() {
        if (this.group) {
            fabric.StaticCanvas.prototype.bringToFront.call(this.group, this);
        } else {
            this.canvas.bringToFront(this);
        }
        return this;
    },
    sendBackwards: function(intersecting) {
        if (this.group) {
            fabric.StaticCanvas.prototype.sendBackwards.call(this.group, this, intersecting);
        } else {
            this.canvas.sendBackwards(this, intersecting);
        }
        return this;
    },
    bringForward: function(intersecting) {
        if (this.group) {
            fabric.StaticCanvas.prototype.bringForward.call(this.group, this, intersecting);
        } else {
            this.canvas.bringForward(this, intersecting);
        }
        return this;
    },
    moveTo: function(index) {
        if (this.group) {
            fabric.StaticCanvas.prototype.moveTo.call(this.group, this, index);
        } else {
            this.canvas.moveTo(this, index);
        }
        return this;
    }
});

(function() {
    var extend = fabric.util.object.extend, originalSet = "stateProperties";
    function saveProps(origin, destination, props) {
        var tmpObj = {}, deep = true;
        props.forEach(function(prop) {
            tmpObj[prop] = origin[prop];
        });
        extend(origin[destination], tmpObj, deep);
    }
    function _isEqual(origValue, currentValue, firstPass) {
        if (origValue === currentValue) {
            return true;
        } else if (Array.isArray(origValue)) {
            if (origValue.length !== currentValue.length) {
                return false;
            }
            for (var i = 0, len = origValue.length; i < len; i++) {
                if (!_isEqual(origValue[i], currentValue[i])) {
                    return false;
                }
            }
            return true;
        } else if (origValue && typeof origValue === "object") {
            var keys = Object.keys(origValue), key;
            if (!firstPass && keys.length !== Object.keys(currentValue).length) {
                return false;
            }
            for (var i = 0, len = keys.length; i < len; i++) {
                key = keys[i];
                if (!_isEqual(origValue[key], currentValue[key])) {
                    return false;
                }
            }
            return true;
        }
    }
    fabric.util.object.extend(fabric.Object.prototype, {
        hasStateChanged: function(propertySet) {
            propertySet = propertySet || originalSet;
            var dashedPropertySet = "_" + propertySet;
            if (Object.keys(this[dashedPropertySet]).length < this[propertySet].length) {
                return true;
            }
            return !_isEqual(this[dashedPropertySet], this, true);
        },
        saveState: function(options) {
            var propertySet = options && options.propertySet || originalSet, destination = "_" + propertySet;
            if (!this[destination]) {
                return this.setupState(options);
            }
            saveProps(this, destination, this[propertySet]);
            if (options && options.stateProperties) {
                saveProps(this, destination, options.stateProperties);
            }
            return this;
        },
        setupState: function(options) {
            options = options || {};
            var propertySet = options.propertySet || originalSet;
            options.propertySet = propertySet;
            this["_" + propertySet] = {};
            this.saveState(options);
            return this;
        }
    });
})();

(function() {
    var degreesToRadians = fabric.util.degreesToRadians, isVML = function() {
        return typeof G_vmlCanvasManager !== "undefined";
    };
    fabric.util.object.extend(fabric.Object.prototype, {
        _controlsVisibility: null,
        _findTargetCorner: function(pointer) {
            if (!this.hasControls || !this.active) {
                return false;
            }
            var ex = pointer.x, ey = pointer.y, xPoints, lines;
            this.__corner = 0;
            for (var i in this.oCoords) {
                if (!this.isControlVisible(i)) {
                    continue;
                }
                if (i === "mtr" && !this.hasRotatingPoint) {
                    continue;
                }
                if (this.get("lockUniScaling") && (i === "mt" || i === "mr" || i === "mb" || i === "ml")) {
                    continue;
                }
                lines = this._getImageLines(this.oCoords[i].corner);
                xPoints = this._findCrossPoints({
                    x: ex,
                    y: ey
                }, lines);
                if (xPoints !== 0 && xPoints % 2 === 1) {
                    this.__corner = i;
                    return i;
                }
            }
            return false;
        },
        _setCornerCoords: function() {
            var coords = this.oCoords, newTheta = degreesToRadians(45 - this.angle), cornerHypotenuse = this.cornerSize * .707106, cosHalfOffset = cornerHypotenuse * Math.cos(newTheta), sinHalfOffset = cornerHypotenuse * Math.sin(newTheta), x, y;
            for (var point in coords) {
                x = coords[point].x;
                y = coords[point].y;
                coords[point].corner = {
                    tl: {
                        x: x - sinHalfOffset,
                        y: y - cosHalfOffset
                    },
                    tr: {
                        x: x + cosHalfOffset,
                        y: y - sinHalfOffset
                    },
                    bl: {
                        x: x - cosHalfOffset,
                        y: y + sinHalfOffset
                    },
                    br: {
                        x: x + sinHalfOffset,
                        y: y + cosHalfOffset
                    }
                };
            }
        },
        drawSelectionBackground: function(ctx) {
            if (!this.selectionBackgroundColor || this.group || !this.active || this.canvas && !this.canvas.interactive) {
                return this;
            }
            ctx.save();
            var center = this.getCenterPoint(), wh = this._calculateCurrentDimensions(), vpt = this.canvas.viewportTransform;
            ctx.translate(center.x, center.y);
            ctx.scale(1 / vpt[0], 1 / vpt[3]);
            ctx.rotate(degreesToRadians(this.angle));
            ctx.fillStyle = this.selectionBackgroundColor;
            ctx.fillRect(-wh.x / 2, -wh.y / 2, wh.x, wh.y);
            ctx.restore();
            return this;
        },
        drawBorders: function(ctx) {
            if (!this.hasBorders) {
                return this;
            }
            var wh = this._calculateCurrentDimensions(), strokeWidth = 1 / this.borderScaleFactor, width = wh.x + strokeWidth, height = wh.y + strokeWidth;
            ctx.save();
            ctx.strokeStyle = this.borderColor;
            this._setLineDash(ctx, this.borderDashArray, null);
            ctx.strokeRect(-width / 2, -height / 2, width, height);
            if (this.hasRotatingPoint && this.isControlVisible("mtr") && !this.get("lockRotation") && this.hasControls) {
                var rotateHeight = -height / 2;
                ctx.beginPath();
                ctx.moveTo(0, rotateHeight);
                ctx.lineTo(0, rotateHeight - this.rotatingPointOffset);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.restore();
            return this;
        },
        drawBordersInGroup: function(ctx, options) {
            if (!this.hasBorders) {
                return this;
            }
            var p = this._getNonTransformedDimensions(), matrix = fabric.util.customTransformMatrix(options.scaleX, options.scaleY, options.skewX), wh = fabric.util.transformPoint(p, matrix), strokeWidth = 1 / this.borderScaleFactor, width = wh.x + strokeWidth, height = wh.y + strokeWidth;
            ctx.save();
            this._setLineDash(ctx, this.borderDashArray, null);
            ctx.strokeStyle = this.borderColor;
            ctx.strokeRect(-width / 2, -height / 2, width, height);
            ctx.restore();
            return this;
        },
        drawControls: function(ctx) {
            if (!this.hasControls) {
                return this;
            }
            var wh = this._calculateCurrentDimensions(), width = wh.x, height = wh.y, scaleOffset = this.cornerSize, left = -(width + scaleOffset) / 2, top = -(height + scaleOffset) / 2, methodName = this.transparentCorners ? "stroke" : "fill";
            ctx.save();
            ctx.strokeStyle = ctx.fillStyle = this.cornerColor;
            if (!this.transparentCorners) {
                ctx.strokeStyle = this.cornerStrokeColor;
            }
            this._setLineDash(ctx, this.cornerDashArray, null);
            this._drawControl("tl", ctx, methodName, left, top);
            this._drawControl("tr", ctx, methodName, left + width, top);
            this._drawControl("bl", ctx, methodName, left, top + height);
            this._drawControl("br", ctx, methodName, left + width, top + height);
            if (!this.get("lockUniScaling")) {
                this._drawControl("mt", ctx, methodName, left + width / 2, top);
                this._drawControl("mb", ctx, methodName, left + width / 2, top + height);
                this._drawControl("mr", ctx, methodName, left + width, top + height / 2);
                this._drawControl("ml", ctx, methodName, left, top + height / 2);
            }
            if (this.hasRotatingPoint) {
                this._drawControl("mtr", ctx, methodName, left + width / 2, top - this.rotatingPointOffset);
            }
            ctx.restore();
            return this;
        },
        _drawControl: function(control, ctx, methodName, left, top) {
            if (!this.isControlVisible(control)) {
                return;
            }
            var size = this.cornerSize, stroke = !this.transparentCorners && this.cornerStrokeColor;
            switch (this.cornerStyle) {
              case "circle":
                ctx.beginPath();
                ctx.arc(left + size / 2, top + size / 2, size / 2, 0, 2 * Math.PI, false);
                ctx[methodName]();
                if (stroke) {
                    ctx.stroke();
                }
                break;

              default:
                isVML() || this.transparentCorners || ctx.clearRect(left, top, size, size);
                ctx[methodName + "Rect"](left, top, size, size);
                if (stroke) {
                    ctx.strokeRect(left, top, size, size);
                }
            }
        },
        isControlVisible: function(controlName) {
            return this._getControlsVisibility()[controlName];
        },
        setControlVisible: function(controlName, visible) {
            this._getControlsVisibility()[controlName] = visible;
            return this;
        },
        setControlsVisibility: function(options) {
            options || (options = {});
            for (var p in options) {
                this.setControlVisible(p, options[p]);
            }
            return this;
        },
        _getControlsVisibility: function() {
            if (!this._controlsVisibility) {
                this._controlsVisibility = {
                    tl: true,
                    tr: true,
                    br: true,
                    bl: true,
                    ml: true,
                    mt: true,
                    mr: true,
                    mb: true,
                    mtr: true
                };
            }
            return this._controlsVisibility;
        }
    });
})();

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, clone = fabric.util.object.clone, coordProps = {
        x1: 1,
        x2: 1,
        y1: 1,
        y2: 1
    }, supportsLineDash = fabric.StaticCanvas.supports("setLineDash");
    if (fabric.Line) {
        fabric.warn("fabric.Line is already defined");
        return;
    }
    var cacheProperties = fabric.Object.prototype.cacheProperties.concat();
    cacheProperties.push("x1", "x2", "y1", "y2");
    fabric.Line = fabric.util.createClass(fabric.Object, {
        type: "line",
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        cacheProperties: cacheProperties,
        initialize: function(points, options) {
            if (!points) {
                points = [ 0, 0, 0, 0 ];
            }
            this.callSuper("initialize", options);
            this.set("x1", points[0]);
            this.set("y1", points[1]);
            this.set("x2", points[2]);
            this.set("y2", points[3]);
            this._setWidthHeight(options);
        },
        _setWidthHeight: function(options) {
            options || (options = {});
            this.width = Math.abs(this.x2 - this.x1);
            this.height = Math.abs(this.y2 - this.y1);
            this.left = "left" in options ? options.left : this._getLeftToOriginX();
            this.top = "top" in options ? options.top : this._getTopToOriginY();
        },
        _set: function(key, value) {
            this.callSuper("_set", key, value);
            if (typeof coordProps[key] !== "undefined") {
                this._setWidthHeight();
            }
            return this;
        },
        _getLeftToOriginX: makeEdgeToOriginGetter({
            origin: "originX",
            axis1: "x1",
            axis2: "x2",
            dimension: "width"
        }, {
            nearest: "left",
            center: "center",
            farthest: "right"
        }),
        _getTopToOriginY: makeEdgeToOriginGetter({
            origin: "originY",
            axis1: "y1",
            axis2: "y2",
            dimension: "height"
        }, {
            nearest: "top",
            center: "center",
            farthest: "bottom"
        }),
        _render: function(ctx, noTransform) {
            ctx.beginPath();
            if (noTransform) {
                var cp = this.getCenterPoint(), offset = this.strokeWidth / 2;
                ctx.translate(cp.x - (this.strokeLineCap === "butt" && this.height === 0 ? 0 : offset), cp.y - (this.strokeLineCap === "butt" && this.width === 0 ? 0 : offset));
            }
            if (!this.strokeDashArray || this.strokeDashArray && supportsLineDash) {
                var p = this.calcLinePoints();
                ctx.moveTo(p.x1, p.y1);
                ctx.lineTo(p.x2, p.y2);
            }
            ctx.lineWidth = this.strokeWidth;
            var origStrokeStyle = ctx.strokeStyle;
            ctx.strokeStyle = this.stroke || ctx.fillStyle;
            this.stroke && this._renderStroke(ctx);
            ctx.strokeStyle = origStrokeStyle;
        },
        _renderDashedStroke: function(ctx) {
            var p = this.calcLinePoints();
            ctx.beginPath();
            fabric.util.drawDashedLine(ctx, p.x1, p.y1, p.x2, p.y2, this.strokeDashArray);
            ctx.closePath();
        },
        toObject: function(propertiesToInclude) {
            return extend(this.callSuper("toObject", propertiesToInclude), this.calcLinePoints());
        },
        _getNonTransformedDimensions: function() {
            var dim = this.callSuper("_getNonTransformedDimensions");
            if (this.strokeLineCap === "butt") {
                if (this.width === 0) {
                    dim.y -= this.strokeWidth;
                }
                if (this.height === 0) {
                    dim.x -= this.strokeWidth;
                }
            }
            return dim;
        },
        calcLinePoints: function() {
            var xMult = this.x1 <= this.x2 ? -1 : 1, yMult = this.y1 <= this.y2 ? -1 : 1, x1 = xMult * this.width * .5, y1 = yMult * this.height * .5, x2 = xMult * this.width * -.5, y2 = yMult * this.height * -.5;
            return {
                x1: x1,
                x2: x2,
                y1: y1,
                y2: y2
            };
        }
    });
    fabric.Line.fromObject = function(object, callback, forceAsync) {
        function _callback(instance) {
            delete instance.points;
            callback && callback(instance);
        }
        var options = clone(object, true);
        options.points = [ object.x1, object.y1, object.x2, object.y2 ];
        var line = fabric.Object._fromObject("Line", options, _callback, forceAsync, "points");
        if (line) {
            delete line.points;
        }
        return line;
    };
    function makeEdgeToOriginGetter(propertyNames, originValues) {
        var origin = propertyNames.origin, axis1 = propertyNames.axis1, axis2 = propertyNames.axis2, dimension = propertyNames.dimension, nearest = originValues.nearest, center = originValues.center, farthest = originValues.farthest;
        return function() {
            switch (this.get(origin)) {
              case nearest:
                return Math.min(this.get(axis1), this.get(axis2));

              case center:
                return Math.min(this.get(axis1), this.get(axis2)) + .5 * this.get(dimension);

              case farthest:
                return Math.max(this.get(axis1), this.get(axis2));
            }
        };
    }
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), pi = Math.PI, extend = fabric.util.object.extend;
    if (fabric.Circle) {
        fabric.warn("fabric.Circle is already defined.");
        return;
    }
    var cacheProperties = fabric.Object.prototype.cacheProperties.concat();
    cacheProperties.push("radius");
    fabric.Circle = fabric.util.createClass(fabric.Object, {
        type: "circle",
        radius: 0,
        startAngle: 0,
        endAngle: pi * 2,
        cacheProperties: cacheProperties,
        initialize: function(options) {
            this.callSuper("initialize", options);
            this.set("radius", options && options.radius || 0);
        },
        _set: function(key, value) {
            this.callSuper("_set", key, value);
            if (key === "radius") {
                this.setRadius(value);
            }
            return this;
        },
        toObject: function(propertiesToInclude) {
            return this.callSuper("toObject", [ "radius", "startAngle", "endAngle" ].concat(propertiesToInclude));
        },
        _render: function(ctx, noTransform) {
            ctx.beginPath();
            ctx.arc(noTransform ? this.left + this.radius : 0, noTransform ? this.top + this.radius : 0, this.radius, this.startAngle, this.endAngle, false);
            this._renderFill(ctx);
            this._renderStroke(ctx);
        },
        getRadiusX: function() {
            return this.get("radius") * this.get("scaleX");
        },
        getRadiusY: function() {
            return this.get("radius") * this.get("scaleY");
        },
        setRadius: function(value) {
            this.radius = value;
            return this.set("width", value * 2).set("height", value * 2);
        }
    });
    fabric.Circle.fromObject = function(object, callback, forceAsync) {
        return fabric.Object._fromObject("Circle", object, callback, forceAsync);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {});
    if (fabric.Triangle) {
        fabric.warn("fabric.Triangle is already defined");
        return;
    }
    fabric.Triangle = fabric.util.createClass(fabric.Object, {
        type: "triangle",
        initialize: function(options) {
            this.callSuper("initialize", options);
            this.set("width", options && options.width || 100).set("height", options && options.height || 100);
        },
        _render: function(ctx) {
            var widthBy2 = this.width / 2, heightBy2 = this.height / 2;
            ctx.beginPath();
            ctx.moveTo(-widthBy2, heightBy2);
            ctx.lineTo(0, -heightBy2);
            ctx.lineTo(widthBy2, heightBy2);
            ctx.closePath();
            this._renderFill(ctx);
            this._renderStroke(ctx);
        },
        _renderDashedStroke: function(ctx) {
            var widthBy2 = this.width / 2, heightBy2 = this.height / 2;
            ctx.beginPath();
            fabric.util.drawDashedLine(ctx, -widthBy2, heightBy2, 0, -heightBy2, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, 0, -heightBy2, widthBy2, heightBy2, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, widthBy2, heightBy2, -widthBy2, heightBy2, this.strokeDashArray);
            ctx.closePath();
        }
    });
    fabric.Triangle.fromObject = function(object, callback, forceAsync) {
        return fabric.Object._fromObject("Triangle", object, callback, forceAsync);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), piBy2 = Math.PI * 2, extend = fabric.util.object.extend;
    if (fabric.Ellipse) {
        fabric.warn("fabric.Ellipse is already defined.");
        return;
    }
    var cacheProperties = fabric.Object.prototype.cacheProperties.concat();
    cacheProperties.push("rx", "ry");
    fabric.Ellipse = fabric.util.createClass(fabric.Object, {
        type: "ellipse",
        rx: 0,
        ry: 0,
        cacheProperties: cacheProperties,
        initialize: function(options) {
            this.callSuper("initialize", options);
            this.set("rx", options && options.rx || 0);
            this.set("ry", options && options.ry || 0);
        },
        _set: function(key, value) {
            this.callSuper("_set", key, value);
            switch (key) {
              case "rx":
                this.rx = value;
                this.set("width", value * 2);
                break;

              case "ry":
                this.ry = value;
                this.set("height", value * 2);
                break;
            }
            return this;
        },
        getRx: function() {
            return this.get("rx") * this.get("scaleX");
        },
        getRy: function() {
            return this.get("ry") * this.get("scaleY");
        },
        toObject: function(propertiesToInclude) {
            return this.callSuper("toObject", [ "rx", "ry" ].concat(propertiesToInclude));
        },
        _render: function(ctx, noTransform) {
            ctx.beginPath();
            ctx.save();
            ctx.transform(1, 0, 0, this.ry / this.rx, 0, 0);
            ctx.arc(noTransform ? this.left + this.rx : 0, noTransform ? (this.top + this.ry) * this.rx / this.ry : 0, this.rx, 0, piBy2, false);
            ctx.restore();
            this._renderFill(ctx);
            this._renderStroke(ctx);
        }
    });
    fabric.Ellipse.fromObject = function(object, callback, forceAsync) {
        return fabric.Object._fromObject("Ellipse", object, callback, forceAsync);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
    if (fabric.Rect) {
        fabric.warn("fabric.Rect is already defined");
        return;
    }
    var stateProperties = fabric.Object.prototype.stateProperties.concat();
    stateProperties.push("rx", "ry");
    var cacheProperties = fabric.Object.prototype.cacheProperties.concat();
    cacheProperties.push("rx", "ry");
    fabric.Rect = fabric.util.createClass(fabric.Object, {
        stateProperties: stateProperties,
        type: "rect",
        rx: 0,
        ry: 0,
        cacheProperties: cacheProperties,
        initialize: function(options) {
            this.callSuper("initialize", options);
            this._initRxRy();
        },
        _initRxRy: function() {
            if (this.rx && !this.ry) {
                this.ry = this.rx;
            } else if (this.ry && !this.rx) {
                this.rx = this.ry;
            }
        },
        _render: function(ctx, noTransform) {
            if (this.width === 1 && this.height === 1) {
                ctx.fillRect(-.5, -.5, 1, 1);
                return;
            }
            var rx = this.rx ? Math.min(this.rx, this.width / 2) : 0, ry = this.ry ? Math.min(this.ry, this.height / 2) : 0, w = this.width, h = this.height, x = noTransform ? this.left : -this.width / 2, y = noTransform ? this.top : -this.height / 2, isRounded = rx !== 0 || ry !== 0, k = 1 - .5522847498;
            ctx.beginPath();
            ctx.moveTo(x + rx, y);
            ctx.lineTo(x + w - rx, y);
            isRounded && ctx.bezierCurveTo(x + w - k * rx, y, x + w, y + k * ry, x + w, y + ry);
            ctx.lineTo(x + w, y + h - ry);
            isRounded && ctx.bezierCurveTo(x + w, y + h - k * ry, x + w - k * rx, y + h, x + w - rx, y + h);
            ctx.lineTo(x + rx, y + h);
            isRounded && ctx.bezierCurveTo(x + k * rx, y + h, x, y + h - k * ry, x, y + h - ry);
            ctx.lineTo(x, y + ry);
            isRounded && ctx.bezierCurveTo(x, y + k * ry, x + k * rx, y, x + rx, y);
            ctx.closePath();
            this._renderFill(ctx);
            this._renderStroke(ctx);
        },
        _renderDashedStroke: function(ctx) {
            var x = -this.width / 2, y = -this.height / 2, w = this.width, h = this.height;
            ctx.beginPath();
            fabric.util.drawDashedLine(ctx, x, y, x + w, y, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x + w, y, x + w, y + h, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x + w, y + h, x, y + h, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x, y + h, x, y, this.strokeDashArray);
            ctx.closePath();
        },
        toObject: function(propertiesToInclude) {
            return this.callSuper("toObject", [ "rx", "ry" ].concat(propertiesToInclude));
        }
    });
    fabric.Rect.fromObject = function(object, callback, forceAsync) {
        return fabric.Object._fromObject("Rect", object, callback, forceAsync);
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, min = fabric.util.array.min, max = fabric.util.array.max, toFixed = fabric.util.toFixed, NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS;
    if (fabric.Polyline) {
        fabric.warn("fabric.Polyline is already defined");
        return;
    }
    var cacheProperties = fabric.Object.prototype.cacheProperties.concat();
    cacheProperties.push("points");
    fabric.Polyline = fabric.util.createClass(fabric.Object, {
        type: "polyline",
        points: null,
        minX: 0,
        minY: 0,
        cacheProperties: cacheProperties,
        initialize: function(points, options) {
            options = options || {};
            this.points = points || [];
            this.callSuper("initialize", options);
            this._calcDimensions();
            if (!("top" in options)) {
                this.top = this.minY;
            }
            if (!("left" in options)) {
                this.left = this.minX;
            }
            this.pathOffset = {
                x: this.minX + this.width / 2,
                y: this.minY + this.height / 2
            };
        },
        _calcDimensions: function() {
            var points = this.points, minX = min(points, "x"), minY = min(points, "y"), maxX = max(points, "x"), maxY = max(points, "y");
            this.width = maxX - minX || 0;
            this.height = maxY - minY || 0;
            this.minX = minX || 0;
            this.minY = minY || 0;
        },
        toObject: function(propertiesToInclude) {
            return extend(this.callSuper("toObject", propertiesToInclude), {
                points: this.points.concat()
            });
        },
        commonRender: function(ctx, noTransform) {
            var point, len = this.points.length, x = noTransform ? 0 : this.pathOffset.x, y = noTransform ? 0 : this.pathOffset.y;
            if (!len || isNaN(this.points[len - 1].y)) {
                return false;
            }
            ctx.beginPath();
            ctx.moveTo(this.points[0].x - x, this.points[0].y - y);
            for (var i = 0; i < len; i++) {
                point = this.points[i];
                ctx.lineTo(point.x - x, point.y - y);
            }
            return true;
        },
        _render: function(ctx, noTransform) {
            if (!this.commonRender(ctx, noTransform)) {
                return;
            }
            this._renderFill(ctx);
            this._renderStroke(ctx);
        },
        _renderDashedStroke: function(ctx) {
            var p1, p2;
            ctx.beginPath();
            for (var i = 0, len = this.points.length; i < len; i++) {
                p1 = this.points[i];
                p2 = this.points[i + 1] || p1;
                fabric.util.drawDashedLine(ctx, p1.x, p1.y, p2.x, p2.y, this.strokeDashArray);
            }
        },
        complexity: function() {
            return this.get("points").length;
        }
    });
    fabric.Polyline.fromObject = function(object, callback, forceAsync) {
        return fabric.Object._fromObject("Polyline", object, callback, forceAsync, "points");
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
    if (fabric.Polygon) {
        fabric.warn("fabric.Polygon is already defined");
        return;
    }
    fabric.Polygon = fabric.util.createClass(fabric.Polyline, {
        type: "polygon",
        _render: function(ctx, noTransform) {
            if (!this.commonRender(ctx, noTransform)) {
                return;
            }
            ctx.closePath();
            this._renderFill(ctx);
            this._renderStroke(ctx);
        },
        _renderDashedStroke: function(ctx) {
            this.callSuper("_renderDashedStroke", ctx);
            ctx.closePath();
        }
    });
    fabric.Polygon.fromObject = function(object, callback, forceAsync) {
        return fabric.Object._fromObject("Polygon", object, callback, forceAsync, "points");
    };
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), min = fabric.util.array.min, max = fabric.util.array.max, extend = fabric.util.object.extend, _toString = Object.prototype.toString, drawArc = fabric.util.drawArc, commandLengths = {
        m: 2,
        l: 2,
        h: 1,
        v: 1,
        c: 6,
        s: 4,
        q: 4,
        t: 2,
        a: 7
    }, repeatedCommands = {
        m: "l",
        M: "L"
    };
    if (fabric.Path) {
        fabric.warn("fabric.Path is already defined");
        return;
    }
    var stateProperties = fabric.Object.prototype.stateProperties.concat();
    stateProperties.push("path");
    var cacheProperties = fabric.Object.prototype.cacheProperties.concat();
    cacheProperties.push("path", "fillRule");
    fabric.Path = fabric.util.createClass(fabric.Object, {
        type: "path",
        path: null,
        minX: 0,
        minY: 0,
        cacheProperties: cacheProperties,
        stateProperties: stateProperties,
        initialize: function(path, options) {
            options = options || {};
            this.callSuper("initialize", options);
            if (!path) {
                path = [];
            }
            var fromArray = _toString.call(path) === "[object Array]";
            this.path = fromArray ? path : path.match && path.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi);
            if (!this.path) {
                return;
            }
            if (!fromArray) {
                this.path = this._parsePath();
            }
            this._setPositionDimensions(options);
        },
        _setPositionDimensions: function(options) {
            var calcDim = this._parseDimensions();
            this.minX = calcDim.left;
            this.minY = calcDim.top;
            this.width = calcDim.width;
            this.height = calcDim.height;
            if (typeof options.left === "undefined") {
                this.left = calcDim.left + (this.originX === "center" ? this.width / 2 : this.originX === "right" ? this.width : 0);
            }
            if (typeof options.top === "undefined") {
                this.top = calcDim.top + (this.originY === "center" ? this.height / 2 : this.originY === "bottom" ? this.height : 0);
            }
            this.pathOffset = this.pathOffset || {
                x: this.minX + this.width / 2,
                y: this.minY + this.height / 2
            };
        },
        _renderPathCommands: function(ctx) {
            var current, previous = null, subpathStartX = 0, subpathStartY = 0, x = 0, y = 0, controlX = 0, controlY = 0, tempX, tempY, l = -this.pathOffset.x, t = -this.pathOffset.y;
            if (this.group && this.group.type === "path-group") {
                l = 0;
                t = 0;
            }
            ctx.beginPath();
            for (var i = 0, len = this.path.length; i < len; ++i) {
                current = this.path[i];
                switch (current[0]) {
                  case "l":
                    x += current[1];
                    y += current[2];
                    ctx.lineTo(x + l, y + t);
                    break;

                  case "L":
                    x = current[1];
                    y = current[2];
                    ctx.lineTo(x + l, y + t);
                    break;

                  case "h":
                    x += current[1];
                    ctx.lineTo(x + l, y + t);
                    break;

                  case "H":
                    x = current[1];
                    ctx.lineTo(x + l, y + t);
                    break;

                  case "v":
                    y += current[1];
                    ctx.lineTo(x + l, y + t);
                    break;

                  case "V":
                    y = current[1];
                    ctx.lineTo(x + l, y + t);
                    break;

                  case "m":
                    x += current[1];
                    y += current[2];
                    subpathStartX = x;
                    subpathStartY = y;
                    ctx.moveTo(x + l, y + t);
                    break;

                  case "M":
                    x = current[1];
                    y = current[2];
                    subpathStartX = x;
                    subpathStartY = y;
                    ctx.moveTo(x + l, y + t);
                    break;

                  case "c":
                    tempX = x + current[5];
                    tempY = y + current[6];
                    controlX = x + current[3];
                    controlY = y + current[4];
                    ctx.bezierCurveTo(x + current[1] + l, y + current[2] + t, controlX + l, controlY + t, tempX + l, tempY + t);
                    x = tempX;
                    y = tempY;
                    break;

                  case "C":
                    x = current[5];
                    y = current[6];
                    controlX = current[3];
                    controlY = current[4];
                    ctx.bezierCurveTo(current[1] + l, current[2] + t, controlX + l, controlY + t, x + l, y + t);
                    break;

                  case "s":
                    tempX = x + current[3];
                    tempY = y + current[4];
                    if (previous[0].match(/[CcSs]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    ctx.bezierCurveTo(controlX + l, controlY + t, x + current[1] + l, y + current[2] + t, tempX + l, tempY + t);
                    controlX = x + current[1];
                    controlY = y + current[2];
                    x = tempX;
                    y = tempY;
                    break;

                  case "S":
                    tempX = current[3];
                    tempY = current[4];
                    if (previous[0].match(/[CcSs]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    ctx.bezierCurveTo(controlX + l, controlY + t, current[1] + l, current[2] + t, tempX + l, tempY + t);
                    x = tempX;
                    y = tempY;
                    controlX = current[1];
                    controlY = current[2];
                    break;

                  case "q":
                    tempX = x + current[3];
                    tempY = y + current[4];
                    controlX = x + current[1];
                    controlY = y + current[2];
                    ctx.quadraticCurveTo(controlX + l, controlY + t, tempX + l, tempY + t);
                    x = tempX;
                    y = tempY;
                    break;

                  case "Q":
                    tempX = current[3];
                    tempY = current[4];
                    ctx.quadraticCurveTo(current[1] + l, current[2] + t, tempX + l, tempY + t);
                    x = tempX;
                    y = tempY;
                    controlX = current[1];
                    controlY = current[2];
                    break;

                  case "t":
                    tempX = x + current[1];
                    tempY = y + current[2];
                    if (previous[0].match(/[QqTt]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    ctx.quadraticCurveTo(controlX + l, controlY + t, tempX + l, tempY + t);
                    x = tempX;
                    y = tempY;
                    break;

                  case "T":
                    tempX = current[1];
                    tempY = current[2];
                    if (previous[0].match(/[QqTt]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    ctx.quadraticCurveTo(controlX + l, controlY + t, tempX + l, tempY + t);
                    x = tempX;
                    y = tempY;
                    break;

                  case "a":
                    drawArc(ctx, x + l, y + t, [ current[1], current[2], current[3], current[4], current[5], current[6] + x + l, current[7] + y + t ]);
                    x += current[6];
                    y += current[7];
                    break;

                  case "A":
                    drawArc(ctx, x + l, y + t, [ current[1], current[2], current[3], current[4], current[5], current[6] + l, current[7] + t ]);
                    x = current[6];
                    y = current[7];
                    break;

                  case "z":
                  case "Z":
                    x = subpathStartX;
                    y = subpathStartY;
                    ctx.closePath();
                    break;
                }
                previous = current;
            }
        },
        _render: function(ctx) {
            this._renderPathCommands(ctx);
            this._renderFill(ctx);
            this._renderStroke(ctx);
        },
        toString: function() {
            return "#<fabric.Path (" + this.complexity() + '): { "top": ' + this.top + ', "left": ' + this.left + " }>";
        },
        toObject: function(propertiesToInclude) {
            var o = extend(this.callSuper("toObject", [ "sourcePath", "pathOffset" ].concat(propertiesToInclude)), {
                path: this.path.map(function(item) {
                    return item.slice();
                }),
                top: this.top,
                left: this.left
            });
            return o;
        },
        toDatalessObject: function(propertiesToInclude) {
            var o = this.toObject(propertiesToInclude);
            if (this.sourcePath) {
                o.path = this.sourcePath;
            }
            delete o.sourcePath;
            return o;
        },
        complexity: function() {
            return this.path.length;
        },
        _parsePath: function() {
            var result = [], coords = [], currentPath, parsed, re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi, match, coordsStr;
            for (var i = 0, coordsParsed, len = this.path.length; i < len; i++) {
                currentPath = this.path[i];
                coordsStr = currentPath.slice(1).trim();
                coords.length = 0;
                while (match = re.exec(coordsStr)) {
                    coords.push(match[0]);
                }
                coordsParsed = [ currentPath.charAt(0) ];
                for (var j = 0, jlen = coords.length; j < jlen; j++) {
                    parsed = parseFloat(coords[j]);
                    if (!isNaN(parsed)) {
                        coordsParsed.push(parsed);
                    }
                }
                var command = coordsParsed[0], commandLength = commandLengths[command.toLowerCase()], repeatedCommand = repeatedCommands[command] || command;
                if (coordsParsed.length - 1 > commandLength) {
                    for (var k = 1, klen = coordsParsed.length; k < klen; k += commandLength) {
                        result.push([ command ].concat(coordsParsed.slice(k, k + commandLength)));
                        command = repeatedCommand;
                    }
                } else {
                    result.push(coordsParsed);
                }
            }
            return result;
        },
        _parseDimensions: function() {
            var aX = [], aY = [], current, previous = null, subpathStartX = 0, subpathStartY = 0, x = 0, y = 0, controlX = 0, controlY = 0, tempX, tempY, bounds;
            for (var i = 0, len = this.path.length; i < len; ++i) {
                current = this.path[i];
                switch (current[0]) {
                  case "l":
                    x += current[1];
                    y += current[2];
                    bounds = [];
                    break;

                  case "L":
                    x = current[1];
                    y = current[2];
                    bounds = [];
                    break;

                  case "h":
                    x += current[1];
                    bounds = [];
                    break;

                  case "H":
                    x = current[1];
                    bounds = [];
                    break;

                  case "v":
                    y += current[1];
                    bounds = [];
                    break;

                  case "V":
                    y = current[1];
                    bounds = [];
                    break;

                  case "m":
                    x += current[1];
                    y += current[2];
                    subpathStartX = x;
                    subpathStartY = y;
                    bounds = [];
                    break;

                  case "M":
                    x = current[1];
                    y = current[2];
                    subpathStartX = x;
                    subpathStartY = y;
                    bounds = [];
                    break;

                  case "c":
                    tempX = x + current[5];
                    tempY = y + current[6];
                    controlX = x + current[3];
                    controlY = y + current[4];
                    bounds = fabric.util.getBoundsOfCurve(x, y, x + current[1], y + current[2], controlX, controlY, tempX, tempY);
                    x = tempX;
                    y = tempY;
                    break;

                  case "C":
                    controlX = current[3];
                    controlY = current[4];
                    bounds = fabric.util.getBoundsOfCurve(x, y, current[1], current[2], controlX, controlY, current[5], current[6]);
                    x = current[5];
                    y = current[6];
                    break;

                  case "s":
                    tempX = x + current[3];
                    tempY = y + current[4];
                    if (previous[0].match(/[CcSs]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    bounds = fabric.util.getBoundsOfCurve(x, y, controlX, controlY, x + current[1], y + current[2], tempX, tempY);
                    controlX = x + current[1];
                    controlY = y + current[2];
                    x = tempX;
                    y = tempY;
                    break;

                  case "S":
                    tempX = current[3];
                    tempY = current[4];
                    if (previous[0].match(/[CcSs]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    bounds = fabric.util.getBoundsOfCurve(x, y, controlX, controlY, current[1], current[2], tempX, tempY);
                    x = tempX;
                    y = tempY;
                    controlX = current[1];
                    controlY = current[2];
                    break;

                  case "q":
                    tempX = x + current[3];
                    tempY = y + current[4];
                    controlX = x + current[1];
                    controlY = y + current[2];
                    bounds = fabric.util.getBoundsOfCurve(x, y, controlX, controlY, controlX, controlY, tempX, tempY);
                    x = tempX;
                    y = tempY;
                    break;

                  case "Q":
                    controlX = current[1];
                    controlY = current[2];
                    bounds = fabric.util.getBoundsOfCurve(x, y, controlX, controlY, controlX, controlY, current[3], current[4]);
                    x = current[3];
                    y = current[4];
                    break;

                  case "t":
                    tempX = x + current[1];
                    tempY = y + current[2];
                    if (previous[0].match(/[QqTt]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    bounds = fabric.util.getBoundsOfCurve(x, y, controlX, controlY, controlX, controlY, tempX, tempY);
                    x = tempX;
                    y = tempY;
                    break;

                  case "T":
                    tempX = current[1];
                    tempY = current[2];
                    if (previous[0].match(/[QqTt]/) === null) {
                        controlX = x;
                        controlY = y;
                    } else {
                        controlX = 2 * x - controlX;
                        controlY = 2 * y - controlY;
                    }
                    bounds = fabric.util.getBoundsOfCurve(x, y, controlX, controlY, controlX, controlY, tempX, tempY);
                    x = tempX;
                    y = tempY;
                    break;

                  case "a":
                    bounds = fabric.util.getBoundsOfArc(x, y, current[1], current[2], current[3], current[4], current[5], current[6] + x, current[7] + y);
                    x += current[6];
                    y += current[7];
                    break;

                  case "A":
                    bounds = fabric.util.getBoundsOfArc(x, y, current[1], current[2], current[3], current[4], current[5], current[6], current[7]);
                    x = current[6];
                    y = current[7];
                    break;

                  case "z":
                  case "Z":
                    x = subpathStartX;
                    y = subpathStartY;
                    break;
                }
                previous = current;
                bounds.forEach(function(point) {
                    aX.push(point.x);
                    aY.push(point.y);
                });
                aX.push(x);
                aY.push(y);
            }
            var minX = min(aX) || 0, minY = min(aY) || 0, maxX = max(aX) || 0, maxY = max(aY) || 0, deltaX = maxX - minX, deltaY = maxY - minY, o = {
                left: minX,
                top: minY,
                width: deltaX,
                height: deltaY
            };
            return o;
        }
    });
    fabric.Path.fromObject = function(object, callback, forceAsync) {
        var path;
        if (typeof object.path === "string") {
            fabric.loadSVGFromURL(object.path, function(elements) {
                var pathUrl = object.path;
                path = elements[0];
                delete object.path;
                path.setOptions(object);
                path.setSourcePath(pathUrl);
                callback && callback(path);
            });
        } else {
            return fabric.Object._fromObject("Path", object, callback, forceAsync, "path");
        }
    };
    fabric.Path.async = true;
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend;
    if (fabric.PathGroup) {
        fabric.warn("fabric.PathGroup is already defined");
        return;
    }
    fabric.PathGroup = fabric.util.createClass(fabric.Object, {
        type: "path-group",
        fill: "",
        cacheProperties: [],
        initialize: function(paths, options) {
            options = options || {};
            this.paths = paths || [];
            for (var i = this.paths.length; i--; ) {
                this.paths[i].group = this;
            }
            if (options.toBeParsed) {
                this.parseDimensionsFromPaths(options);
                delete options.toBeParsed;
            }
            this.setOptions(options);
            this.setCoords();
        },
        parseDimensionsFromPaths: function(options) {
            var points, p, xC = [], yC = [], path, height, width, m;
            for (var j = this.paths.length; j--; ) {
                path = this.paths[j];
                height = path.height + path.strokeWidth;
                width = path.width + path.strokeWidth;
                points = [ {
                    x: path.left,
                    y: path.top
                }, {
                    x: path.left + width,
                    y: path.top
                }, {
                    x: path.left,
                    y: path.top + height
                }, {
                    x: path.left + width,
                    y: path.top + height
                } ];
                m = this.paths[j].transformMatrix;
                for (var i = 0; i < points.length; i++) {
                    p = points[i];
                    if (m) {
                        p = fabric.util.transformPoint(p, m, false);
                    }
                    xC.push(p.x);
                    yC.push(p.y);
                }
            }
            options.width = Math.max.apply(null, xC);
            options.height = Math.max.apply(null, yC);
        },
        drawObject: function(ctx) {
            ctx.save();
            ctx.translate(-this.width / 2, -this.height / 2);
            for (var i = 0, l = this.paths.length; i < l; ++i) {
                this.paths[i].render(ctx, true);
            }
            ctx.restore();
        },
        shouldCache: function() {
            var parentCache = this.objectCaching && (!this.group || this.needsItsOwnCache() || !this.group.isCaching());
            this.caching = parentCache;
            if (parentCache) {
                for (var i = 0, len = this.paths.length; i < len; i++) {
                    if (this.paths[i].willDrawShadow()) {
                        this.caching = false;
                        return false;
                    }
                }
            }
            return parentCache;
        },
        willDrawShadow: function() {
            if (this.shadow) {
                return true;
            }
            for (var i = 0, len = this.paths.length; i < len; i++) {
                if (this.paths[i].willDrawShadow()) {
                    return true;
                }
            }
            return false;
        },
        isCaching: function() {
            return this.caching || this.group && this.group.isCaching();
        },
        isCacheDirty: function() {
            if (this.callSuper("isCacheDirty")) {
                return true;
            }
            if (!this.statefullCache) {
                return false;
            }
            for (var i = 0, len = this.paths.length; i < len; i++) {
                if (this.paths[i].isCacheDirty(true)) {
                    if (this._cacheCanvas) {
                        var x = this.cacheWidth / this.zoomX, y = this.cacheHeight / this.zoomY;
                        this._cacheContext.clearRect(-x / 2, -y / 2, x, y);
                    }
                    return true;
                }
            }
            return false;
        },
        _set: function(prop, value) {
            if (prop === "fill" && value && this.isSameColor()) {
                var i = this.paths.length;
                while (i--) {
                    this.paths[i]._set(prop, value);
                }
            }
            return this.callSuper("_set", prop, value);
        },
        toObject: function(propertiesToInclude) {
            var pathsToObject = this.paths.map(function(path) {
                var originalDefaults = path.includeDefaultValues;
                path.includeDefaultValues = path.group.includeDefaultValues;
                var obj = path.toObject(propertiesToInclude);
                path.includeDefaultValues = originalDefaults;
                return obj;
            });
            var o = extend(this.callSuper("toObject", [ "sourcePath" ].concat(propertiesToInclude)), {
                paths: pathsToObject
            });
            return o;
        },
        toDatalessObject: function(propertiesToInclude) {
            var o = this.toObject(propertiesToInclude);
            if (this.sourcePath) {
                o.paths = this.sourcePath;
            }
            return o;
        },
        toString: function() {
            return "#<fabric.PathGroup (" + this.complexity() + "): { top: " + this.top + ", left: " + this.left + " }>";
        },
        isSameColor: function() {
            var firstPathFill = this.getObjects()[0].get("fill") || "";
            if (typeof firstPathFill !== "string") {
                return false;
            }
            firstPathFill = firstPathFill.toLowerCase();
            return this.getObjects().every(function(path) {
                var pathFill = path.get("fill") || "";
                return typeof pathFill === "string" && pathFill.toLowerCase() === firstPathFill;
            });
        },
        complexity: function() {
            return this.paths.reduce(function(total, path) {
                return total + (path && path.complexity ? path.complexity() : 0);
            }, 0);
        },
        getObjects: function() {
            return this.paths;
        }
    });
    fabric.PathGroup.fromObject = function(object, callback) {
        var originalPaths = object.paths;
        delete object.paths;
        if (typeof originalPaths === "string") {
            fabric.loadSVGFromURL(originalPaths, function(elements) {
                var pathUrl = originalPaths;
                var pathGroup = fabric.util.groupSVGElements(elements, object, pathUrl);
                object.paths = originalPaths;
                callback(pathGroup);
            });
        } else {
            fabric.util.enlivenObjects(originalPaths, function(enlivenedObjects) {
                var pathGroup = new fabric.PathGroup(enlivenedObjects, object);
                object.paths = originalPaths;
                callback(pathGroup);
            });
        }
    };
    fabric.PathGroup.async = true;
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var fabric = global.fabric || (global.fabric = {}), extend = fabric.util.object.extend, min = fabric.util.array.min, max = fabric.util.array.max;
    if (fabric.Group) {
        return;
    }
    var _lockProperties = {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true
    };
    fabric.Group = fabric.util.createClass(fabric.Object, fabric.Collection, {
        type: "group",
        strokeWidth: 0,
        subTargetCheck: false,
        cacheProperties: [],
        initialize: function(objects, options, isAlreadyGrouped) {
            options = options || {};
            this._objects = [];
            isAlreadyGrouped && this.callSuper("initialize", options);
            this._objects = objects || [];
            for (var i = this._objects.length; i--; ) {
                this._objects[i].group = this;
            }
            if (options.originX) {
                this.originX = options.originX;
            }
            if (options.originY) {
                this.originY = options.originY;
            }
            if (isAlreadyGrouped) {
                this._updateObjectsCoords(true);
            } else {
                this._calcBounds();
                this._updateObjectsCoords();
                this.callSuper("initialize", options);
            }
            this.setCoords();
            this.saveCoords();
        },
        _updateObjectsCoords: function(skipCoordsChange) {
            var center = this.getCenterPoint();
            for (var i = this._objects.length; i--; ) {
                this._updateObjectCoords(this._objects[i], center, skipCoordsChange);
            }
        },
        _updateObjectCoords: function(object, center, skipCoordsChange) {
            object.__origHasControls = object.hasControls;
            object.hasControls = false;
            if (skipCoordsChange) {
                return;
            }
            var objectLeft = object.getLeft(), objectTop = object.getTop(), ignoreZoom = true, skipAbsolute = true;
            object.set({
                left: objectLeft - center.x,
                top: objectTop - center.y
            });
            object.setCoords(ignoreZoom, skipAbsolute);
        },
        toString: function() {
            return "#<fabric.Group: (" + this.complexity() + ")>";
        },
        addWithUpdate: function(object) {
            this._restoreObjectsState();
            fabric.util.resetObjectTransform(this);
            if (object) {
                this._objects.push(object);
                object.group = this;
                object._set("canvas", this.canvas);
            }
            this.forEachObject(this._setObjectActive, this);
            this._calcBounds();
            this._updateObjectsCoords();
            this.setCoords();
            this.dirty = true;
            return this;
        },
        _setObjectActive: function(object) {
            object.set("active", true);
            object.group = this;
        },
        removeWithUpdate: function(object) {
            this._restoreObjectsState();
            fabric.util.resetObjectTransform(this);
            this.forEachObject(this._setObjectActive, this);
            this.remove(object);
            this._calcBounds();
            this._updateObjectsCoords();
            this.setCoords();
            this.dirty = true;
            return this;
        },
        _onObjectAdded: function(object) {
            this.dirty = true;
            object.group = this;
            object._set("canvas", this.canvas);
        },
        _onObjectRemoved: function(object) {
            this.dirty = true;
            delete object.group;
            object.set("active", false);
        },
        delegatedProperties: {
            fill: true,
            stroke: true,
            strokeWidth: true,
            fontFamily: true,
            fontWeight: true,
            fontSize: true,
            fontStyle: true,
            lineHeight: true,
            textDecoration: true,
            textAlign: true,
            backgroundColor: true
        },
        _set: function(key, value) {
            var i = this._objects.length;
            if (this.delegatedProperties[key] || key === "canvas") {
                while (i--) {
                    this._objects[i].set(key, value);
                }
            } else {
                while (i--) {
                    this._objects[i].setOnGroup(key, value);
                }
            }
            this.callSuper("_set", key, value);
        },
        toObject: function(propertiesToInclude) {
            var objsToObject = this.getObjects().map(function(obj) {
                var originalDefaults = obj.includeDefaultValues;
                obj.includeDefaultValues = obj.group.includeDefaultValues;
                var _obj = obj.toObject(propertiesToInclude);
                obj.includeDefaultValues = originalDefaults;
                return _obj;
            });
            return extend(this.callSuper("toObject", propertiesToInclude), {
                objects: objsToObject
            });
        },
        toDatalessObject: function(propertiesToInclude) {
            var objsToObject = this.getObjects().map(function(obj) {
                var originalDefaults = obj.includeDefaultValues;
                obj.includeDefaultValues = obj.group.includeDefaultValues;
                var _obj = obj.toDatalessObject(propertiesToInclude);
                obj.includeDefaultValues = originalDefaults;
                return _obj;
            });
            return extend(this.callSuper("toDatalessObject", propertiesToInclude), {
                objects: objsToObject
            });
        },
        render: function(ctx) {
            this._transformDone = true;
            this.callSuper("render", ctx);
            this._transformDone = false;
        },
        shouldCache: function() {
            var parentCache = this.objectCaching && (!this.group || this.needsItsOwnCache() || !this.group.isCaching());
            this.caching = parentCache;
            if (parentCache) {
                for (var i = 0, len = this._objects.length; i < len; i++) {
                    if (this._objects[i].willDrawShadow()) {
                        this.caching = false;
                        return false;
                    }
                }
            }
            return parentCache;
        },
        willDrawShadow: function() {
            if (this.callSuper("willDrawShadow")) {
                return true;
            }
            for (var i = 0, len = this._objects.length; i < len; i++) {
                if (this._objects[i].willDrawShadow()) {
                    return true;
                }
            }
            return false;
        },
        isCaching: function() {
            return this.caching || this.group && this.group.isCaching();
        },
        drawObject: function(ctx) {
            for (var i = 0, len = this._objects.length; i < len; i++) {
                this._renderObject(this._objects[i], ctx);
            }
        },
        isCacheDirty: function() {
            if (this.callSuper("isCacheDirty")) {
                return true;
            }
            if (!this.statefullCache) {
                return false;
            }
            for (var i = 0, len = this._objects.length; i < len; i++) {
                if (this._objects[i].isCacheDirty(true)) {
                    if (this._cacheCanvas) {
                        var x = this.cacheWidth / this.zoomX, y = this.cacheHeight / this.zoomY;
                        this._cacheContext.clearRect(-x / 2, -y / 2, x, y);
                    }
                    return true;
                }
            }
            return false;
        },
        _renderControls: function(ctx, noTransform) {
            ctx.save();
            ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
            this.callSuper("_renderControls", ctx, noTransform);
            for (var i = 0, len = this._objects.length; i < len; i++) {
                this._objects[i]._renderControls(ctx);
            }
            ctx.restore();
        },
        _renderObject: function(object, ctx) {
            if (!object.visible) {
                return;
            }
            var originalHasRotatingPoint = object.hasRotatingPoint;
            object.hasRotatingPoint = false;
            object.render(ctx);
            object.hasRotatingPoint = originalHasRotatingPoint;
        },
        _restoreObjectsState: function() {
            this._objects.forEach(this._restoreObjectState, this);
            return this;
        },
        realizeTransform: function(object) {
            var matrix = object.calcTransformMatrix(), options = fabric.util.qrDecompose(matrix), center = new fabric.Point(options.translateX, options.translateY);
            object.flipX = false;
            object.flipY = false;
            object.set("scaleX", options.scaleX);
            object.set("scaleY", options.scaleY);
            object.skewX = options.skewX;
            object.skewY = options.skewY;
            object.angle = options.angle;
            object.setPositionByOrigin(center, "center", "center");
            return object;
        },
        _restoreObjectState: function(object) {
            this.realizeTransform(object);
            object.setCoords();
            object.hasControls = object.__origHasControls;
            delete object.__origHasControls;
            object.set("active", false);
            delete object.group;
            return this;
        },
        destroy: function() {
            this._objects.forEach(function(object) {
                object.set("dirty", true);
            });
            return this._restoreObjectsState();
        },
        saveCoords: function() {
            this._originalLeft = this.get("left");
            this._originalTop = this.get("top");
            return this;
        },
        hasMoved: function() {
            return this._originalLeft !== this.get("left") || this._originalTop !== this.get("top");
        },
        setObjectsCoords: function() {
            var ignoreZoom = true, skipAbsolute = true;
            this.forEachObject(function(object) {
                object.setCoords(ignoreZoom, skipAbsolute);
            });
            return this;
        },
        _calcBounds: function(onlyWidthHeight) {
            var aX = [], aY = [], o, prop, props = [ "tr", "br", "bl", "tl" ], i = 0, iLen = this._objects.length, j, jLen = props.length, ignoreZoom = true;
            for (;i < iLen; ++i) {
                o = this._objects[i];
                o.setCoords(ignoreZoom);
                for (j = 0; j < jLen; j++) {
                    prop = props[j];
                    aX.push(o.oCoords[prop].x);
                    aY.push(o.oCoords[prop].y);
                }
            }
            this.set(this._getBounds(aX, aY, onlyWidthHeight));
        },
        _getBounds: function(aX, aY, onlyWidthHeight) {
            var minXY = new fabric.Point(min(aX), min(aY)), maxXY = new fabric.Point(max(aX), max(aY)), obj = {
                width: maxXY.x - minXY.x || 0,
                height: maxXY.y - minXY.y || 0
            };
            if (!onlyWidthHeight) {
                obj.left = minXY.x || 0;
                obj.top = minXY.y || 0;
                if (this.originX === "center") {
                    obj.left += obj.width / 2;
                }
                if (this.originX === "right") {
                    obj.left += obj.width;
                }
                if (this.originY === "center") {
                    obj.top += obj.height / 2;
                }
                if (this.originY === "bottom") {
                    obj.top += obj.height;
                }
            }
            return obj;
        },
        get: function(prop) {
            if (prop in _lockProperties) {
                if (this[prop]) {
                    return this[prop];
                } else {
                    for (var i = 0, len = this._objects.length; i < len; i++) {
                        if (this._objects[i][prop]) {
                            return true;
                        }
                    }
                    return false;
                }
            } else {
                if (prop in this.delegatedProperties) {
                    return this._objects[0] && this._objects[0].get(prop);
                }
                return this[prop];
            }
        }
    });
    fabric.Group.fromObject = function(object, callback) {
        fabric.util.enlivenObjects(object.objects, function(enlivenedObjects) {
            var options = fabric.util.object.clone(object, true);
            delete options.objects;
            callback && callback(new fabric.Group(enlivenedObjects, options, true));
        });
    };
    fabric.Group.async = true;
})(typeof exports !== "undefined" ? exports : this);

(function(global) {
    "use strict";
    var extend = fabric.util.object.extend;
    if (!global.fabric) {
        global.fabric = {};
    }
    if (global.fabric.Image) {
        fabric.warn("fabric.Image is already defined.");
        return;
    }
    var stateProperties = fabric.Object.prototype.stateProperties.concat();
    stateProperties.push("alignX", "alignY", "meetOrSlice");
    fabric.Image = fabric.util.createClass(fabric.Object, {
        type: "image",
        crossOrigin: "",
        alignX: "none",
        alignY: "none",
        meetOrSlice: "meet",
        strokeWidth: 0,
        _lastScaleX: 1,
        _lastScaleY: 1,
        minimumScaleTrigger: .5,
        stateProperties: stateProperties,
        objectCaching: false,
        initialize: function(element, options, callback) {
            options || (options = {});
            this.filters = [];
            this.resizeFilters = [];
            this.callSuper("initialize", options);
            this._initElement(element, options, callback);
        },
        getElement: function() {
            return this._element;
        },
        setElement: function(element, callback, options) {
            var _callback, _this;
            this._element = element;
            this._originalElement = element;
            this._initConfig(options);
            if (this.resizeFilters.length === 0) {
                _callback = callback;
            } else {
                _this = this;
                _callback = function() {
                    _this.applyFilters(callback, _this.resizeFilters, _this._filteredEl || _this._originalElement, true);
                };
            }
            if (this.filters.length !== 0) {
                this.applyFilters(_callback);
            } else if (_callback) {
                _callback(this);
            }
            return this;
        },
        setCrossOrigin: function(value) {
            this.crossOrigin = value;
            this._element.crossOrigin = value;
            return this;
        },
        getOriginalSize: function() {
            var element = this.getElement();
            return {
                width: element.width,
                height: element.height
            };
        },
        _stroke: function(ctx) {
            if (!this.stroke || this.strokeWidth === 0) {
                return;
            }
            var w = this.width / 2, h = this.height / 2;
            ctx.beginPath();
            ctx.moveTo(-w, -h);
            ctx.lineTo(w, -h);
            ctx.lineTo(w, h);
            ctx.lineTo(-w, h);
            ctx.lineTo(-w, -h);
            ctx.closePath();
        },
        _renderDashedStroke: function(ctx) {
            var x = -this.width / 2, y = -this.height / 2, w = this.width, h = this.height;
            ctx.save();
            this._setStrokeStyles(ctx);
            ctx.beginPath();
            fabric.util.drawDashedLine(ctx, x, y, x + w, y, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x + w, y, x + w, y + h, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x + w, y + h, x, y + h, this.strokeDashArray);
            fabric.util.drawDashedLine(ctx, x, y + h, x, y, this.strokeDashArray);
            ctx.closePath();
            ctx.restore();
        },
        toObject: function(propertiesToInclude) {
            var filters = [], resizeFilters = [], scaleX = 1, scaleY = 1;
            this.filters.forEach(function(filterObj) {
                if (filterObj) {
                    if (filterObj.type === "Resize") {
                        scaleX *= filterObj.scaleX;
                        scaleY *= filterObj.scaleY;
                    }
                    filters.push(filterObj.toObject());
                }
            });
            this.resizeFilters.forEach(function(filterObj) {
                filterObj && resizeFilters.push(filterObj.toObject());
            });
            var object = extend(this.callSuper("toObject", [ "crossOrigin", "alignX", "alignY", "meetOrSlice" ].concat(propertiesToInclude)), {
                src: this.getSrc(),
                filters: filters,
                resizeFilters: resizeFilters
            });
            object.width /= scaleX;
            object.height /= scaleY;
            return object;
        },
        getSrc: function(filtered) {
            var element = filtered ? this._element : this._originalElement;
            if (element) {
                return fabric.isLikelyNode ? element._src : element.src;
            } else {
                return this.src || "";
            }
        },
        setSrc: function(src, callback, options) {
            fabric.util.loadImage(src, function(img) {
                return this.setElement(img, callback, options);
            }, this, options && options.crossOrigin);
        },
        toString: function() {
            return '#<fabric.Image: { src: "' + this.getSrc() + '" }>';
        },
        applyFilters: function(callback, filters, imgElement, forResizing) {
            filters = filters || this.filters;
            imgElement = imgElement || this._originalElement;
            if (!imgElement) {
                return;
            }
            var replacement = fabric.util.createImage(), retinaScaling = this.canvas ? this.canvas.getRetinaScaling() : fabric.devicePixelRatio, minimumScale = this.minimumScaleTrigger / retinaScaling, _this = this, scaleX, scaleY;
            if (filters.length === 0) {
                this._element = imgElement;
                callback && callback(this);
                return imgElement;
            }
            var canvasEl = fabric.util.createCanvasElement();
            canvasEl.width = imgElement.width;
            canvasEl.height = imgElement.height;
            canvasEl.getContext("2d").drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);
            filters.forEach(function(filter) {
                if (!filter) {
                    return;
                }
                if (forResizing) {
                    scaleX = _this.scaleX < minimumScale ? _this.scaleX : 1;
                    scaleY = _this.scaleY < minimumScale ? _this.scaleY : 1;
                    if (scaleX * retinaScaling < 1) {
                        scaleX *= retinaScaling;
                    }
                    if (scaleY * retinaScaling < 1) {
                        scaleY *= retinaScaling;
                    }
                } else {
                    scaleX = filter.scaleX;
                    scaleY = filter.scaleY;
                }
                filter.applyTo(canvasEl, scaleX, scaleY);
                if (!forResizing && filter.type === "Resize") {
                    _this.width *= filter.scaleX;
                    _this.height *= filter.scaleY;
                }
            });
            replacement.width = canvasEl.width;
            replacement.height = canvasEl.height;
            if (fabric.isLikelyNode) {
                replacement.src = canvasEl.toBuffer(undefined, fabric.Image.pngCompression);
                _this._element = replacement;
                !forResizing && (_this._filteredEl = replacement);
                callback && callback(_this);
            } else {
                replacement.onload = function() {
                    _this._element = replacement;
                    !forResizing && (_this._filteredEl = replacement);
                    callback && callback(_this);
                    replacement.onload = canvasEl = null;
                };
                replacement.src = canvasEl.toDataURL("image/png");
            }
            return canvasEl;
        },
        _render: function(ctx, noTransform) {
            var x, y, imageMargins = this._findMargins(), elementToDraw;
            x = noTransform ? this.left : -this.width / 2;
            y = noTransform ? this.top : -this.height / 2;
            if (this.meetOrSlice === "slice") {
                ctx.beginPath();
                ctx.rect(x, y, this.width, this.height);
                ctx.clip();
            }
            if (this.isMoving === false && this.resizeFilters.length && this._needsResize()) {
                this._lastScaleX = this.scaleX;
                this._lastScaleY = this.scaleY;
                elementToDraw = this.applyFilters(null, this.resizeFilters, this._filteredEl || this._originalElement, true);
            } else {
                elementToDraw = this._element;
            }
            elementToDraw && ctx.drawImage(elementToDraw, x + imageMargins.marginX, y + imageMargins.marginY, imageMargins.width, imageMargins.height);
            this._stroke(ctx);
            this._renderStroke(ctx);
        },
        _needsResize: function() {
            return this.scaleX !== this._lastScaleX || this.scaleY !== this._lastScaleY;
        },
        _findMargins: function() {
            var width = this.width, height = this.height, scales, scale, marginX = 0, marginY = 0;
            if (this.alignX !== "none" || this.alignY !== "none") {
                scales = [ this.width / this._element.width, this.height / this._element.height ];
                scale = this.meetOrSlice === "meet" ? Math.min.apply(null, scales) : Math.max.apply(null, scales);
                width = this._element.width * scale;
                height = this._element.height * scale;
                if (this.alignX === "Mid") {
                    marginX = (this.width - width) / 2;
                }
                if (this.alignX === "Max") {
                    marginX = this.width - width;
                }
                if (this.alignY === "Mid") {
                    marginY = (this.height - height) / 2;
                }
                if (this.alignY === "Max") {
                    marginY = this.height - height;
                }
            }
            return {
                width: width,
                height: height,
                marginX: marginX,
                marginY: marginY
            };
        },
        _resetWidthHeight: function() {
            var element = this.getElement();
            this.set("width", element.width);
            this.set("height", element.height);
        },
        _initElement: function(element, options, callback) {
            this.setElement(fabric.util.getById(element), callback, options);
            fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS);
        },
        _initConfig: function(options) {
            options || (options = {});
            this.setOptions(options);
            this._setWidthHeight(options);
            if (this._element && this.crossOrigin) {
                this._element.crossOrigin = this.crossOrigin;
            }
        },
        _initFilters: function(filters, callback) {
            if (filters && filters.length) {
                fabric.util.enlivenObjects(filters, function(enlivenedObjects) {
                    callback && callback(enlivenedObjects);
                }, "fabric.Image.filters");
            } else {
                callback && callback();
            }
        },
        _setWidthHeight: function(options) {
            this.width = "width" in options ? options.width : this.getElement() ? this.getElement().width || 0 : 0;
            this.height = "height" in options ? options.height : this.getElement() ? this.getElement().height || 0 : 0;
        }
    });
    fabric.Image.CSS_CANVAS = "canvas-img";
    fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc;
    fabric.Image.fromObject = function(object, callback) {
        fabric.util.loadImage(object.src, function(img, error) {
            if (error) {
                callback && callback(null, error);
                return;
            }
            fabric.Image.prototype._initFilters.call(object, object.filters, function(filters) {
                object.filters = filters || [];
                fabric.Image.prototype._initFilters.call(object, object.resizeFilters, function(resizeFilters) {
                    object.resizeFilters = resizeFilters || [];
                    return new fabric.Image(img, object, callback);
                });
            });
        }, null, object.crossOrigin);
    };
    fabric.Image.fromURL = function(url, callback, imgOptions) {
        fabric.util.loadImage(url, function(img) {
            callback && callback(new fabric.Image(img, imgOptions));
        }, null, imgOptions && imgOptions.crossOrigin);
    };
    fabric.Image.async = true;
    fabric.Image.pngCompression = 1;
})(typeof exports !== "undefined" ? exports : this);

window.fabric = fabric;

if (typeof define === "function" && define.amd) {
    define([], function() {
        return fabric;
    });
}