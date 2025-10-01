var si = { exports: {} }, le = {}, ii = { exports: {} }, S = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ot = Symbol.for("react.element"), Zr = Symbol.for("react.portal"), qr = Symbol.for("react.fragment"), _r = Symbol.for("react.strict_mode"), $r = Symbol.for("react.profiler"), to = Symbol.for("react.provider"), eo = Symbol.for("react.context"), no = Symbol.for("react.forward_ref"), so = Symbol.for("react.suspense"), io = Symbol.for("react.memo"), ro = Symbol.for("react.lazy"), On = Symbol.iterator;
function oo(t) {
  return t === null || typeof t != "object" ? null : (t = On && t[On] || t["@@iterator"], typeof t == "function" ? t : null);
}
var ri = { isMounted: function() {
  return !1;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, oi = Object.assign, ai = {};
function Ct(t, e, n) {
  this.props = t, this.context = e, this.refs = ai, this.updater = n || ri;
}
Ct.prototype.isReactComponent = {};
Ct.prototype.setState = function(t, e) {
  if (typeof t != "object" && typeof t != "function" && t != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, t, e, "setState");
};
Ct.prototype.forceUpdate = function(t) {
  this.updater.enqueueForceUpdate(this, t, "forceUpdate");
};
function ci() {
}
ci.prototype = Ct.prototype;
function qe(t, e, n) {
  this.props = t, this.context = e, this.refs = ai, this.updater = n || ri;
}
var _e = qe.prototype = new ci();
_e.constructor = qe;
oi(_e, Ct.prototype);
_e.isPureReactComponent = !0;
var Nn = Array.isArray, li = Object.prototype.hasOwnProperty, $e = { current: null }, ui = { key: !0, ref: !0, __self: !0, __source: !0 };
function hi(t, e, n) {
  var s, i = {}, o = null, r = null;
  if (e != null) for (s in e.ref !== void 0 && (r = e.ref), e.key !== void 0 && (o = "" + e.key), e) li.call(e, s) && !ui.hasOwnProperty(s) && (i[s] = e[s]);
  var a = arguments.length - 2;
  if (a === 1) i.children = n;
  else if (1 < a) {
    for (var c = Array(a), u = 0; u < a; u++) c[u] = arguments[u + 2];
    i.children = c;
  }
  if (t && t.defaultProps) for (s in a = t.defaultProps, a) i[s] === void 0 && (i[s] = a[s]);
  return { $$typeof: Ot, type: t, key: o, ref: r, props: i, _owner: $e.current };
}
function ao(t, e) {
  return { $$typeof: Ot, type: t.type, key: e, ref: t.ref, props: t.props, _owner: t._owner };
}
function tn(t) {
  return typeof t == "object" && t !== null && t.$$typeof === Ot;
}
function co(t) {
  var e = { "=": "=0", ":": "=2" };
  return "$" + t.replace(/[=:]/g, function(n) {
    return e[n];
  });
}
var zn = /\/+/g;
function me(t, e) {
  return typeof t == "object" && t !== null && t.key != null ? co("" + t.key) : e.toString(36);
}
function Zt(t, e, n, s, i) {
  var o = typeof t;
  (o === "undefined" || o === "boolean") && (t = null);
  var r = !1;
  if (t === null) r = !0;
  else switch (o) {
    case "string":
    case "number":
      r = !0;
      break;
    case "object":
      switch (t.$$typeof) {
        case Ot:
        case Zr:
          r = !0;
      }
  }
  if (r) return r = t, i = i(r), t = s === "" ? "." + me(r, 0) : s, Nn(i) ? (n = "", t != null && (n = t.replace(zn, "$&/") + "/"), Zt(i, e, n, "", function(u) {
    return u;
  })) : i != null && (tn(i) && (i = ao(i, n + (!i.key || r && r.key === i.key ? "" : ("" + i.key).replace(zn, "$&/") + "/") + t)), e.push(i)), 1;
  if (r = 0, s = s === "" ? "." : s + ":", Nn(t)) for (var a = 0; a < t.length; a++) {
    o = t[a];
    var c = s + me(o, a);
    r += Zt(o, e, n, c, i);
  }
  else if (c = oo(t), typeof c == "function") for (t = c.call(t), a = 0; !(o = t.next()).done; ) o = o.value, c = s + me(o, a++), r += Zt(o, e, n, c, i);
  else if (o === "object") throw e = String(t), Error("Objects are not valid as a React child (found: " + (e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e) + "). If you meant to render a collection of children, use an array instead.");
  return r;
}
function Ut(t, e, n) {
  if (t == null) return t;
  var s = [], i = 0;
  return Zt(t, s, "", "", function(o) {
    return e.call(n, o, i++);
  }), s;
}
function lo(t) {
  if (t._status === -1) {
    var e = t._result;
    e = e(), e.then(function(n) {
      (t._status === 0 || t._status === -1) && (t._status = 1, t._result = n);
    }, function(n) {
      (t._status === 0 || t._status === -1) && (t._status = 2, t._result = n);
    }), t._status === -1 && (t._status = 0, t._result = e);
  }
  if (t._status === 1) return t._result.default;
  throw t._result;
}
var O = { current: null }, qt = { transition: null }, uo = { ReactCurrentDispatcher: O, ReactCurrentBatchConfig: qt, ReactCurrentOwner: $e };
function fi() {
  throw Error("act(...) is not supported in production builds of React.");
}
S.Children = { map: Ut, forEach: function(t, e, n) {
  Ut(t, function() {
    e.apply(this, arguments);
  }, n);
}, count: function(t) {
  var e = 0;
  return Ut(t, function() {
    e++;
  }), e;
}, toArray: function(t) {
  return Ut(t, function(e) {
    return e;
  }) || [];
}, only: function(t) {
  if (!tn(t)) throw Error("React.Children.only expected to receive a single React element child.");
  return t;
} };
S.Component = Ct;
S.Fragment = qr;
S.Profiler = $r;
S.PureComponent = qe;
S.StrictMode = _r;
S.Suspense = so;
S.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = uo;
S.act = fi;
S.cloneElement = function(t, e, n) {
  if (t == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + t + ".");
  var s = oi({}, t.props), i = t.key, o = t.ref, r = t._owner;
  if (e != null) {
    if (e.ref !== void 0 && (o = e.ref, r = $e.current), e.key !== void 0 && (i = "" + e.key), t.type && t.type.defaultProps) var a = t.type.defaultProps;
    for (c in e) li.call(e, c) && !ui.hasOwnProperty(c) && (s[c] = e[c] === void 0 && a !== void 0 ? a[c] : e[c]);
  }
  var c = arguments.length - 2;
  if (c === 1) s.children = n;
  else if (1 < c) {
    a = Array(c);
    for (var u = 0; u < c; u++) a[u] = arguments[u + 2];
    s.children = a;
  }
  return { $$typeof: Ot, type: t.type, key: i, ref: o, props: s, _owner: r };
};
S.createContext = function(t) {
  return t = { $$typeof: eo, _currentValue: t, _currentValue2: t, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, t.Provider = { $$typeof: to, _context: t }, t.Consumer = t;
};
S.createElement = hi;
S.createFactory = function(t) {
  var e = hi.bind(null, t);
  return e.type = t, e;
};
S.createRef = function() {
  return { current: null };
};
S.forwardRef = function(t) {
  return { $$typeof: no, render: t };
};
S.isValidElement = tn;
S.lazy = function(t) {
  return { $$typeof: ro, _payload: { _status: -1, _result: t }, _init: lo };
};
S.memo = function(t, e) {
  return { $$typeof: io, type: t, compare: e === void 0 ? null : e };
};
S.startTransition = function(t) {
  var e = qt.transition;
  qt.transition = {};
  try {
    t();
  } finally {
    qt.transition = e;
  }
};
S.unstable_act = fi;
S.useCallback = function(t, e) {
  return O.current.useCallback(t, e);
};
S.useContext = function(t) {
  return O.current.useContext(t);
};
S.useDebugValue = function() {
};
S.useDeferredValue = function(t) {
  return O.current.useDeferredValue(t);
};
S.useEffect = function(t, e) {
  return O.current.useEffect(t, e);
};
S.useId = function() {
  return O.current.useId();
};
S.useImperativeHandle = function(t, e, n) {
  return O.current.useImperativeHandle(t, e, n);
};
S.useInsertionEffect = function(t, e) {
  return O.current.useInsertionEffect(t, e);
};
S.useLayoutEffect = function(t, e) {
  return O.current.useLayoutEffect(t, e);
};
S.useMemo = function(t, e) {
  return O.current.useMemo(t, e);
};
S.useReducer = function(t, e, n) {
  return O.current.useReducer(t, e, n);
};
S.useRef = function(t) {
  return O.current.useRef(t);
};
S.useState = function(t) {
  return O.current.useState(t);
};
S.useSyncExternalStore = function(t, e, n) {
  return O.current.useSyncExternalStore(t, e, n);
};
S.useTransition = function() {
  return O.current.useTransition();
};
S.version = "18.3.1";
ii.exports = S;
var y = ii.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ho = y, fo = Symbol.for("react.element"), mo = Symbol.for("react.fragment"), po = Object.prototype.hasOwnProperty, go = ho.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, yo = { key: !0, ref: !0, __self: !0, __source: !0 };
function di(t, e, n) {
  var s, i = {}, o = null, r = null;
  n !== void 0 && (o = "" + n), e.key !== void 0 && (o = "" + e.key), e.ref !== void 0 && (r = e.ref);
  for (s in e) po.call(e, s) && !yo.hasOwnProperty(s) && (i[s] = e[s]);
  if (t && t.defaultProps) for (s in e = t.defaultProps, e) i[s] === void 0 && (i[s] = e[s]);
  return { $$typeof: fo, type: t, key: o, ref: r, props: i, _owner: go.current };
}
le.Fragment = mo;
le.jsx = di;
le.jsxs = di;
si.exports = le;
var m = si.exports;
const en = y.createContext({});
function nn(t) {
  const e = y.useRef(null);
  return e.current === null && (e.current = t()), e.current;
}
const sn = typeof window < "u", mi = sn ? y.useLayoutEffect : y.useEffect, ue = /* @__PURE__ */ y.createContext(null);
function rn(t, e) {
  t.indexOf(e) === -1 && t.push(e);
}
function on(t, e) {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
const _ = (t, e, n) => n > e ? e : n < t ? t : n;
let an = () => {
};
const $ = {}, pi = (t) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t);
function gi(t) {
  return typeof t == "object" && t !== null;
}
const yi = (t) => /^0[^.\s]+$/u.test(t);
// @__NO_SIDE_EFFECTS__
function cn(t) {
  let e;
  return () => (e === void 0 && (e = t()), e);
}
const W = /* @__NO_SIDE_EFFECTS__ */ (t) => t, Ao = (t, e) => (n) => e(t(n)), Nt = (...t) => t.reduce(Ao), kt = /* @__NO_SIDE_EFFECTS__ */ (t, e, n) => {
  const s = e - t;
  return s === 0 ? 1 : (n - t) / s;
};
class ln {
  constructor() {
    this.subscriptions = [];
  }
  add(e) {
    return rn(this.subscriptions, e), () => on(this.subscriptions, e);
  }
  notify(e, n, s) {
    const i = this.subscriptions.length;
    if (i)
      if (i === 1)
        this.subscriptions[0](e, n, s);
      else
        for (let o = 0; o < i; o++) {
          const r = this.subscriptions[o];
          r && r(e, n, s);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const K = /* @__NO_SIDE_EFFECTS__ */ (t) => t * 1e3, U = /* @__NO_SIDE_EFFECTS__ */ (t) => t / 1e3;
function Ai(t, e) {
  return e ? t * (1e3 / e) : 0;
}
const vi = (t, e, n) => (((1 - 3 * n + 3 * e) * t + (3 * n - 6 * e)) * t + 3 * e) * t, vo = 1e-7, Eo = 12;
function Co(t, e, n, s, i) {
  let o, r, a = 0;
  do
    r = e + (n - e) / 2, o = vi(r, s, i) - t, o > 0 ? n = r : e = r;
  while (Math.abs(o) > vo && ++a < Eo);
  return r;
}
function zt(t, e, n, s) {
  if (t === e && n === s)
    return W;
  const i = (o) => Co(o, 0, 1, t, n);
  return (o) => o === 0 || o === 1 ? o : vi(i(o), e, s);
}
const Ei = (t) => (e) => e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2, Ci = (t) => (e) => 1 - t(1 - e), xi = /* @__PURE__ */ zt(0.33, 1.53, 0.69, 0.99), un = /* @__PURE__ */ Ci(xi), wi = /* @__PURE__ */ Ei(un), Ii = (t) => (t *= 2) < 1 ? 0.5 * un(t) : 0.5 * (2 - Math.pow(2, -10 * (t - 1))), hn = (t) => 1 - Math.sin(Math.acos(t)), bi = Ci(hn), Pi = Ei(hn), xo = /* @__PURE__ */ zt(0.42, 0, 1, 1), wo = /* @__PURE__ */ zt(0, 0, 0.58, 1), Si = /* @__PURE__ */ zt(0.42, 0, 0.58, 1), Io = (t) => Array.isArray(t) && typeof t[0] != "number", Bi = (t) => Array.isArray(t) && typeof t[0] == "number", bo = {
  linear: W,
  easeIn: xo,
  easeInOut: Si,
  easeOut: wo,
  circIn: hn,
  circInOut: Pi,
  circOut: bi,
  backIn: un,
  backInOut: wi,
  backOut: xi,
  anticipate: Ii
}, Po = (t) => typeof t == "string", Xn = (t) => {
  if (Bi(t)) {
    an(t.length === 4);
    const [e, n, s, i] = t;
    return zt(e, n, s, i);
  } else if (Po(t))
    return bo[t];
  return t;
}, Wt = [
  "setup",
  // Compute
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "preUpdate",
  // Compute
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
function So(t, e) {
  let n = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), i = !1, o = !1;
  const r = /* @__PURE__ */ new WeakSet();
  let a = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function c(l) {
    r.has(l) && (u.schedule(l), t()), l(a);
  }
  const u = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (l, h = !1, f = !1) => {
      const p = f && i ? n : s;
      return h && r.add(l), p.has(l) || p.add(l), l;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (l) => {
      s.delete(l), r.delete(l);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (l) => {
      if (a = l, i) {
        o = !0;
        return;
      }
      i = !0, [n, s] = [s, n], n.forEach(c), n.clear(), i = !1, o && (o = !1, u.process(l));
    }
  };
  return u;
}
const Bo = 40;
function Di(t, e) {
  let n = !1, s = !0;
  const i = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, o = () => n = !0, r = Wt.reduce((E, I) => (E[I] = So(o), E), {}), { setup: a, read: c, resolveKeyframes: u, preUpdate: l, update: h, preRender: f, render: d, postRender: p } = r, g = () => {
    const E = $.useManualTiming ? i.timestamp : performance.now();
    n = !1, $.useManualTiming || (i.delta = s ? 1e3 / 60 : Math.max(Math.min(E - i.timestamp, Bo), 1)), i.timestamp = E, i.isProcessing = !0, a.process(i), c.process(i), u.process(i), l.process(i), h.process(i), f.process(i), d.process(i), p.process(i), i.isProcessing = !1, n && e && (s = !1, t(g));
  }, v = () => {
    n = !0, s = !0, i.isProcessing || t(g);
  };
  return { schedule: Wt.reduce((E, I) => {
    const x = r[I];
    return E[I] = (P, B = !1, b = !1) => (n || v(), x.schedule(P, B, b)), E;
  }, {}), cancel: (E) => {
    for (let I = 0; I < Wt.length; I++)
      r[Wt[I]].cancel(E);
  }, state: i, steps: r };
}
const { schedule: D, cancel: nt, state: L, steps: pe } = /* @__PURE__ */ Di(typeof requestAnimationFrame < "u" ? requestAnimationFrame : W, !0);
let _t;
function Do() {
  _t = void 0;
}
const N = {
  now: () => (_t === void 0 && N.set(L.isProcessing || $.useManualTiming ? L.timestamp : performance.now()), _t),
  set: (t) => {
    _t = t, queueMicrotask(Do);
  }
}, Ri = (t) => (e) => typeof e == "string" && e.startsWith(t), fn = /* @__PURE__ */ Ri("--"), Ro = /* @__PURE__ */ Ri("var(--"), dn = (t) => Ro(t) ? To.test(t.split("/*")[0].trim()) : !1, To = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, xt = {
  test: (t) => typeof t == "number",
  parse: parseFloat,
  transform: (t) => t
}, jt = {
  ...xt,
  transform: (t) => _(0, 1, t)
}, Gt = {
  ...xt,
  default: 1
}, Dt = (t) => Math.round(t * 1e5) / 1e5, mn = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function Qo(t) {
  return t == null;
}
const Mo = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, pn = (t, e) => (n) => !!(typeof n == "string" && Mo.test(n) && n.startsWith(t) || e && !Qo(n) && Object.prototype.hasOwnProperty.call(n, e)), Ti = (t, e, n) => (s) => {
  if (typeof s != "string")
    return s;
  const [i, o, r, a] = s.match(mn);
  return {
    [t]: parseFloat(i),
    [e]: parseFloat(o),
    [n]: parseFloat(r),
    alpha: a !== void 0 ? parseFloat(a) : 1
  };
}, ko = (t) => _(0, 255, t), ge = {
  ...xt,
  transform: (t) => Math.round(ko(t))
}, ct = {
  test: /* @__PURE__ */ pn("rgb", "red"),
  parse: /* @__PURE__ */ Ti("red", "green", "blue"),
  transform: ({ red: t, green: e, blue: n, alpha: s = 1 }) => "rgba(" + ge.transform(t) + ", " + ge.transform(e) + ", " + ge.transform(n) + ", " + Dt(jt.transform(s)) + ")"
};
function jo(t) {
  let e = "", n = "", s = "", i = "";
  return t.length > 5 ? (e = t.substring(1, 3), n = t.substring(3, 5), s = t.substring(5, 7), i = t.substring(7, 9)) : (e = t.substring(1, 2), n = t.substring(2, 3), s = t.substring(3, 4), i = t.substring(4, 5), e += e, n += n, s += s, i += i), {
    red: parseInt(e, 16),
    green: parseInt(n, 16),
    blue: parseInt(s, 16),
    alpha: i ? parseInt(i, 16) / 255 : 1
  };
}
const Re = {
  test: /* @__PURE__ */ pn("#"),
  parse: jo,
  transform: ct.transform
}, Xt = /* @__NO_SIDE_EFFECTS__ */ (t) => ({
  test: (e) => typeof e == "string" && e.endsWith(t) && e.split(" ").length === 1,
  parse: parseFloat,
  transform: (e) => `${e}${t}`
}), et = /* @__PURE__ */ Xt("deg"), J = /* @__PURE__ */ Xt("%"), w = /* @__PURE__ */ Xt("px"), Lo = /* @__PURE__ */ Xt("vh"), Vo = /* @__PURE__ */ Xt("vw"), Yn = {
  ...J,
  parse: (t) => J.parse(t) / 100,
  transform: (t) => J.transform(t * 100)
}, dt = {
  test: /* @__PURE__ */ pn("hsl", "hue"),
  parse: /* @__PURE__ */ Ti("hue", "saturation", "lightness"),
  transform: ({ hue: t, saturation: e, lightness: n, alpha: s = 1 }) => "hsla(" + Math.round(t) + ", " + J.transform(Dt(e)) + ", " + J.transform(Dt(n)) + ", " + Dt(jt.transform(s)) + ")"
}, M = {
  test: (t) => ct.test(t) || Re.test(t) || dt.test(t),
  parse: (t) => ct.test(t) ? ct.parse(t) : dt.test(t) ? dt.parse(t) : Re.parse(t),
  transform: (t) => typeof t == "string" ? t : t.hasOwnProperty("red") ? ct.transform(t) : dt.transform(t),
  getAnimatableNone: (t) => {
    const e = M.parse(t);
    return e.alpha = 0, M.transform(e);
  }
}, Fo = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function Ho(t) {
  var e, n;
  return isNaN(t) && typeof t == "string" && (((e = t.match(mn)) == null ? void 0 : e.length) || 0) + (((n = t.match(Fo)) == null ? void 0 : n.length) || 0) > 0;
}
const Qi = "number", Mi = "color", Oo = "var", No = "var(", Un = "${}", zo = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function Lt(t) {
  const e = t.toString(), n = [], s = {
    color: [],
    number: [],
    var: []
  }, i = [];
  let o = 0;
  const a = e.replace(zo, (c) => (M.test(c) ? (s.color.push(o), i.push(Mi), n.push(M.parse(c))) : c.startsWith(No) ? (s.var.push(o), i.push(Oo), n.push(c)) : (s.number.push(o), i.push(Qi), n.push(parseFloat(c))), ++o, Un)).split(Un);
  return { values: n, split: a, indexes: s, types: i };
}
function ki(t) {
  return Lt(t).values;
}
function ji(t) {
  const { split: e, types: n } = Lt(t), s = e.length;
  return (i) => {
    let o = "";
    for (let r = 0; r < s; r++)
      if (o += e[r], i[r] !== void 0) {
        const a = n[r];
        a === Qi ? o += Dt(i[r]) : a === Mi ? o += M.transform(i[r]) : o += i[r];
      }
    return o;
  };
}
const Xo = (t) => typeof t == "number" ? 0 : M.test(t) ? M.getAnimatableNone(t) : t;
function Yo(t) {
  const e = ki(t);
  return ji(t)(e.map(Xo));
}
const st = {
  test: Ho,
  parse: ki,
  createTransformer: ji,
  getAnimatableNone: Yo
};
function ye(t, e, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? t + (e - t) * 6 * n : n < 1 / 2 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t;
}
function Uo({ hue: t, saturation: e, lightness: n, alpha: s }) {
  t /= 360, e /= 100, n /= 100;
  let i = 0, o = 0, r = 0;
  if (!e)
    i = o = r = n;
  else {
    const a = n < 0.5 ? n * (1 + e) : n + e - n * e, c = 2 * n - a;
    i = ye(c, a, t + 1 / 3), o = ye(c, a, t), r = ye(c, a, t - 1 / 3);
  }
  return {
    red: Math.round(i * 255),
    green: Math.round(o * 255),
    blue: Math.round(r * 255),
    alpha: s
  };
}
function se(t, e) {
  return (n) => n > 0 ? e : t;
}
const R = (t, e, n) => t + (e - t) * n, Ae = (t, e, n) => {
  const s = t * t, i = n * (e * e - s) + s;
  return i < 0 ? 0 : Math.sqrt(i);
}, Wo = [Re, ct, dt], Go = (t) => Wo.find((e) => e.test(t));
function Wn(t) {
  const e = Go(t);
  if (!e)
    return !1;
  let n = e.parse(t);
  return e === dt && (n = Uo(n)), n;
}
const Gn = (t, e) => {
  const n = Wn(t), s = Wn(e);
  if (!n || !s)
    return se(t, e);
  const i = { ...n };
  return (o) => (i.red = Ae(n.red, s.red, o), i.green = Ae(n.green, s.green, o), i.blue = Ae(n.blue, s.blue, o), i.alpha = R(n.alpha, s.alpha, o), ct.transform(i));
}, Te = /* @__PURE__ */ new Set(["none", "hidden"]);
function Ko(t, e) {
  return Te.has(t) ? (n) => n <= 0 ? t : e : (n) => n >= 1 ? e : t;
}
function Jo(t, e) {
  return (n) => R(t, e, n);
}
function gn(t) {
  return typeof t == "number" ? Jo : typeof t == "string" ? dn(t) ? se : M.test(t) ? Gn : _o : Array.isArray(t) ? Li : typeof t == "object" ? M.test(t) ? Gn : Zo : se;
}
function Li(t, e) {
  const n = [...t], s = n.length, i = t.map((o, r) => gn(o)(o, e[r]));
  return (o) => {
    for (let r = 0; r < s; r++)
      n[r] = i[r](o);
    return n;
  };
}
function Zo(t, e) {
  const n = { ...t, ...e }, s = {};
  for (const i in n)
    t[i] !== void 0 && e[i] !== void 0 && (s[i] = gn(t[i])(t[i], e[i]));
  return (i) => {
    for (const o in s)
      n[o] = s[o](i);
    return n;
  };
}
function qo(t, e) {
  const n = [], s = { color: 0, var: 0, number: 0 };
  for (let i = 0; i < e.values.length; i++) {
    const o = e.types[i], r = t.indexes[o][s[o]], a = t.values[r] ?? 0;
    n[i] = a, s[o]++;
  }
  return n;
}
const _o = (t, e) => {
  const n = st.createTransformer(e), s = Lt(t), i = Lt(e);
  return s.indexes.var.length === i.indexes.var.length && s.indexes.color.length === i.indexes.color.length && s.indexes.number.length >= i.indexes.number.length ? Te.has(t) && !i.values.length || Te.has(e) && !s.values.length ? Ko(t, e) : Nt(Li(qo(s, i), i.values), n) : se(t, e);
};
function Vi(t, e, n) {
  return typeof t == "number" && typeof e == "number" && typeof n == "number" ? R(t, e, n) : gn(t)(t, e);
}
const $o = (t) => {
  const e = ({ timestamp: n }) => t(n);
  return {
    start: (n = !0) => D.update(e, n),
    stop: () => nt(e),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => L.isProcessing ? L.timestamp : N.now()
  };
}, Fi = (t, e, n = 10) => {
  let s = "";
  const i = Math.max(Math.round(e / n), 2);
  for (let o = 0; o < i; o++)
    s += Math.round(t(o / (i - 1)) * 1e4) / 1e4 + ", ";
  return `linear(${s.substring(0, s.length - 2)})`;
}, ie = 2e4;
function yn(t) {
  let e = 0;
  const n = 50;
  let s = t.next(e);
  for (; !s.done && e < ie; )
    e += n, s = t.next(e);
  return e >= ie ? 1 / 0 : e;
}
function ta(t, e = 100, n) {
  const s = n({ ...t, keyframes: [0, e] }), i = Math.min(yn(s), ie);
  return {
    type: "keyframes",
    ease: (o) => s.next(i * o).value / e,
    duration: /* @__PURE__ */ U(i)
  };
}
const ea = 5;
function Hi(t, e, n) {
  const s = Math.max(e - ea, 0);
  return Ai(n - t(s), e - s);
}
const T = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
}, ve = 1e-3;
function na({ duration: t = T.duration, bounce: e = T.bounce, velocity: n = T.velocity, mass: s = T.mass }) {
  let i, o, r = 1 - e;
  r = _(T.minDamping, T.maxDamping, r), t = _(T.minDuration, T.maxDuration, /* @__PURE__ */ U(t)), r < 1 ? (i = (u) => {
    const l = u * r, h = l * t, f = l - n, d = Qe(u, r), p = Math.exp(-h);
    return ve - f / d * p;
  }, o = (u) => {
    const h = u * r * t, f = h * n + n, d = Math.pow(r, 2) * Math.pow(u, 2) * t, p = Math.exp(-h), g = Qe(Math.pow(u, 2), r);
    return (-i(u) + ve > 0 ? -1 : 1) * ((f - d) * p) / g;
  }) : (i = (u) => {
    const l = Math.exp(-u * t), h = (u - n) * t + 1;
    return -ve + l * h;
  }, o = (u) => {
    const l = Math.exp(-u * t), h = (n - u) * (t * t);
    return l * h;
  });
  const a = 5 / t, c = ia(i, o, a);
  if (t = /* @__PURE__ */ K(t), isNaN(c))
    return {
      stiffness: T.stiffness,
      damping: T.damping,
      duration: t
    };
  {
    const u = Math.pow(c, 2) * s;
    return {
      stiffness: u,
      damping: r * 2 * Math.sqrt(s * u),
      duration: t
    };
  }
}
const sa = 12;
function ia(t, e, n) {
  let s = n;
  for (let i = 1; i < sa; i++)
    s = s - t(s) / e(s);
  return s;
}
function Qe(t, e) {
  return t * Math.sqrt(1 - e * e);
}
const ra = ["duration", "bounce"], oa = ["stiffness", "damping", "mass"];
function Kn(t, e) {
  return e.some((n) => t[n] !== void 0);
}
function aa(t) {
  let e = {
    velocity: T.velocity,
    stiffness: T.stiffness,
    damping: T.damping,
    mass: T.mass,
    isResolvedFromDuration: !1,
    ...t
  };
  if (!Kn(t, oa) && Kn(t, ra))
    if (t.visualDuration) {
      const n = t.visualDuration, s = 2 * Math.PI / (n * 1.2), i = s * s, o = 2 * _(0.05, 1, 1 - (t.bounce || 0)) * Math.sqrt(i);
      e = {
        ...e,
        mass: T.mass,
        stiffness: i,
        damping: o
      };
    } else {
      const n = na(t);
      e = {
        ...e,
        ...n,
        mass: T.mass
      }, e.isResolvedFromDuration = !0;
    }
  return e;
}
function re(t = T.visualDuration, e = T.bounce) {
  const n = typeof t != "object" ? {
    visualDuration: t,
    keyframes: [0, 1],
    bounce: e
  } : t;
  let { restSpeed: s, restDelta: i } = n;
  const o = n.keyframes[0], r = n.keyframes[n.keyframes.length - 1], a = { done: !1, value: o }, { stiffness: c, damping: u, mass: l, duration: h, velocity: f, isResolvedFromDuration: d } = aa({
    ...n,
    velocity: -/* @__PURE__ */ U(n.velocity || 0)
  }), p = f || 0, g = u / (2 * Math.sqrt(c * l)), v = r - o, A = /* @__PURE__ */ U(Math.sqrt(c / l)), C = Math.abs(v) < 5;
  s || (s = C ? T.restSpeed.granular : T.restSpeed.default), i || (i = C ? T.restDelta.granular : T.restDelta.default);
  let E;
  if (g < 1) {
    const x = Qe(A, g);
    E = (P) => {
      const B = Math.exp(-g * A * P);
      return r - B * ((p + g * A * v) / x * Math.sin(x * P) + v * Math.cos(x * P));
    };
  } else if (g === 1)
    E = (x) => r - Math.exp(-A * x) * (v + (p + A * v) * x);
  else {
    const x = A * Math.sqrt(g * g - 1);
    E = (P) => {
      const B = Math.exp(-g * A * P), b = Math.min(x * P, 300);
      return r - B * ((p + g * A * v) * Math.sinh(b) + x * v * Math.cosh(b)) / x;
    };
  }
  const I = {
    calculatedDuration: d && h || null,
    next: (x) => {
      const P = E(x);
      if (d)
        a.done = x >= h;
      else {
        let B = x === 0 ? p : 0;
        g < 1 && (B = x === 0 ? /* @__PURE__ */ K(p) : Hi(E, x, P));
        const b = Math.abs(B) <= s, k = Math.abs(r - P) <= i;
        a.done = b && k;
      }
      return a.value = a.done ? r : P, a;
    },
    toString: () => {
      const x = Math.min(yn(I), ie), P = Fi((B) => I.next(x * B).value, x, 30);
      return x + "ms " + P;
    },
    toTransition: () => {
    }
  };
  return I;
}
re.applyToOptions = (t) => {
  const e = ta(t, 100, re);
  return t.ease = e.ease, t.duration = /* @__PURE__ */ K(e.duration), t.type = "keyframes", t;
};
function Me({ keyframes: t, velocity: e = 0, power: n = 0.8, timeConstant: s = 325, bounceDamping: i = 10, bounceStiffness: o = 500, modifyTarget: r, min: a, max: c, restDelta: u = 0.5, restSpeed: l }) {
  const h = t[0], f = {
    done: !1,
    value: h
  }, d = (b) => a !== void 0 && b < a || c !== void 0 && b > c, p = (b) => a === void 0 ? c : c === void 0 || Math.abs(a - b) < Math.abs(c - b) ? a : c;
  let g = n * e;
  const v = h + g, A = r === void 0 ? v : r(v);
  A !== v && (g = A - h);
  const C = (b) => -g * Math.exp(-b / s), E = (b) => A + C(b), I = (b) => {
    const k = C(b), F = E(b);
    f.done = Math.abs(k) <= u, f.value = f.done ? A : F;
  };
  let x, P;
  const B = (b) => {
    d(f.value) && (x = b, P = re({
      keyframes: [f.value, p(f.value)],
      velocity: Hi(E, b, f.value),
      // TODO: This should be passing * 1000
      damping: i,
      stiffness: o,
      restDelta: u,
      restSpeed: l
    }));
  };
  return B(0), {
    calculatedDuration: null,
    next: (b) => {
      let k = !1;
      return !P && x === void 0 && (k = !0, I(b), B(b)), x !== void 0 && b >= x ? P.next(b - x) : (!k && I(b), f);
    }
  };
}
function ca(t, e, n) {
  const s = [], i = n || $.mix || Vi, o = t.length - 1;
  for (let r = 0; r < o; r++) {
    let a = i(t[r], t[r + 1]);
    if (e) {
      const c = Array.isArray(e) ? e[r] || W : e;
      a = Nt(c, a);
    }
    s.push(a);
  }
  return s;
}
function la(t, e, { clamp: n = !0, ease: s, mixer: i } = {}) {
  const o = t.length;
  if (an(o === e.length), o === 1)
    return () => e[0];
  if (o === 2 && e[0] === e[1])
    return () => e[1];
  const r = t[0] === t[1];
  t[0] > t[o - 1] && (t = [...t].reverse(), e = [...e].reverse());
  const a = ca(e, s, i), c = a.length, u = (l) => {
    if (r && l < t[0])
      return e[0];
    let h = 0;
    if (c > 1)
      for (; h < t.length - 2 && !(l < t[h + 1]); h++)
        ;
    const f = /* @__PURE__ */ kt(t[h], t[h + 1], l);
    return a[h](f);
  };
  return n ? (l) => u(_(t[0], t[o - 1], l)) : u;
}
function ua(t, e) {
  const n = t[t.length - 1];
  for (let s = 1; s <= e; s++) {
    const i = /* @__PURE__ */ kt(0, e, s);
    t.push(R(n, 1, i));
  }
}
function ha(t) {
  const e = [0];
  return ua(e, t.length - 1), e;
}
function fa(t, e) {
  return t.map((n) => n * e);
}
function da(t, e) {
  return t.map(() => e || Si).splice(0, t.length - 1);
}
function Rt({ duration: t = 300, keyframes: e, times: n, ease: s = "easeInOut" }) {
  const i = Io(s) ? s.map(Xn) : Xn(s), o = {
    done: !1,
    value: e[0]
  }, r = fa(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    n && n.length === e.length ? n : ha(e),
    t
  ), a = la(r, e, {
    ease: Array.isArray(i) ? i : da(e, i)
  });
  return {
    calculatedDuration: t,
    next: (c) => (o.value = a(c), o.done = c >= t, o)
  };
}
const ma = (t) => t !== null;
function An(t, { repeat: e, repeatType: n = "loop" }, s, i = 1) {
  const o = t.filter(ma), a = i < 0 || e && n !== "loop" && e % 2 === 1 ? 0 : o.length - 1;
  return !a || s === void 0 ? o[a] : s;
}
const pa = {
  decay: Me,
  inertia: Me,
  tween: Rt,
  keyframes: Rt,
  spring: re
};
function Oi(t) {
  typeof t.type == "string" && (t.type = pa[t.type]);
}
class vn {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((e) => {
      this.resolve = e;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  /**
   * Allows the animation to be awaited.
   *
   * @deprecated Use `finished` instead.
   */
  then(e, n) {
    return this.finished.then(e, n);
  }
}
const ga = (t) => t / 100;
class En extends vn {
  constructor(e) {
    super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.stop = () => {
      var s, i;
      const { motionValue: n } = this.options;
      n && n.updatedAt !== N.now() && this.tick(N.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), (i = (s = this.options).onStop) == null || i.call(s));
    }, this.options = e, this.initAnimation(), this.play(), e.autoplay === !1 && this.pause();
  }
  initAnimation() {
    const { options: e } = this;
    Oi(e);
    const { type: n = Rt, repeat: s = 0, repeatDelay: i = 0, repeatType: o, velocity: r = 0 } = e;
    let { keyframes: a } = e;
    const c = n || Rt;
    c !== Rt && typeof a[0] != "number" && (this.mixKeyframes = Nt(ga, Vi(a[0], a[1])), a = [0, 100]);
    const u = c({ ...e, keyframes: a });
    o === "mirror" && (this.mirroredGenerator = c({
      ...e,
      keyframes: [...a].reverse(),
      velocity: -r
    })), u.calculatedDuration === null && (u.calculatedDuration = yn(u));
    const { calculatedDuration: l } = u;
    this.calculatedDuration = l, this.resolvedDuration = l + i, this.totalDuration = this.resolvedDuration * (s + 1) - i, this.generator = u;
  }
  updateTime(e) {
    const n = Math.round(e - this.startTime) * this.playbackSpeed;
    this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = n;
  }
  tick(e, n = !1) {
    const { generator: s, totalDuration: i, mixKeyframes: o, mirroredGenerator: r, resolvedDuration: a, calculatedDuration: c } = this;
    if (this.startTime === null)
      return s.next(0);
    const { delay: u = 0, keyframes: l, repeat: h, repeatType: f, repeatDelay: d, type: p, onUpdate: g, finalKeyframe: v } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - i / this.speed, this.startTime)), n ? this.currentTime = e : this.updateTime(e);
    const A = this.currentTime - u * (this.playbackSpeed >= 0 ? 1 : -1), C = this.playbackSpeed >= 0 ? A < 0 : A > i;
    this.currentTime = Math.max(A, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = i);
    let E = this.currentTime, I = s;
    if (h) {
      const b = Math.min(this.currentTime, i) / a;
      let k = Math.floor(b), F = b % 1;
      !F && b >= 1 && (F = 1), F === 1 && k--, k = Math.min(k, h + 1), !!(k % 2) && (f === "reverse" ? (F = 1 - F, d && (F -= d / a)) : f === "mirror" && (I = r)), E = _(0, 1, F) * a;
    }
    const x = C ? { done: !1, value: l[0] } : I.next(E);
    o && (x.value = o(x.value));
    let { done: P } = x;
    !C && c !== null && (P = this.playbackSpeed >= 0 ? this.currentTime >= i : this.currentTime <= 0);
    const B = this.holdTime === null && (this.state === "finished" || this.state === "running" && P);
    return B && p !== Me && (x.value = An(l, this.options, v, this.speed)), g && g(x.value), B && this.finish(), x;
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(e, n) {
    return this.finished.then(e, n);
  }
  get duration() {
    return /* @__PURE__ */ U(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: e = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ U(e);
  }
  get time() {
    return /* @__PURE__ */ U(this.currentTime);
  }
  set time(e) {
    var n;
    e = /* @__PURE__ */ K(e), this.currentTime = e, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed), (n = this.driver) == null || n.start(!1);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(e) {
    this.updateTime(N.now());
    const n = this.playbackSpeed !== e;
    this.playbackSpeed = e, n && (this.time = /* @__PURE__ */ U(this.currentTime));
  }
  play() {
    var i, o;
    if (this.isStopped)
      return;
    const { driver: e = $o, startTime: n } = this.options;
    this.driver || (this.driver = e((r) => this.tick(r))), (o = (i = this.options).onPlay) == null || o.call(i);
    const s = this.driver.now();
    this.state === "finished" ? (this.updateFinished(), this.startTime = s) : this.holdTime !== null ? this.startTime = s - this.holdTime : this.startTime || (this.startTime = n ?? s), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    this.state = "paused", this.updateTime(N.now()), this.holdTime = this.currentTime;
  }
  complete() {
    this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
  }
  finish() {
    var e, n;
    this.notifyFinished(), this.teardown(), this.state = "finished", (n = (e = this.options).onComplete) == null || n.call(e);
  }
  cancel() {
    var e, n;
    this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), (n = (e = this.options).onCancel) == null || n.call(e);
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(e) {
    return this.startTime = 0, this.tick(e, !0);
  }
  attachTimeline(e) {
    var n;
    return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), (n = this.driver) == null || n.stop(), e.observe(this);
  }
}
function ya(t) {
  for (let e = 1; e < t.length; e++)
    t[e] ?? (t[e] = t[e - 1]);
}
const lt = (t) => t * 180 / Math.PI, ke = (t) => {
  const e = lt(Math.atan2(t[1], t[0]));
  return je(e);
}, Aa = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (t) => (Math.abs(t[0]) + Math.abs(t[3])) / 2,
  rotate: ke,
  rotateZ: ke,
  skewX: (t) => lt(Math.atan(t[1])),
  skewY: (t) => lt(Math.atan(t[2])),
  skew: (t) => (Math.abs(t[1]) + Math.abs(t[2])) / 2
}, je = (t) => (t = t % 360, t < 0 && (t += 360), t), Jn = ke, Zn = (t) => Math.sqrt(t[0] * t[0] + t[1] * t[1]), qn = (t) => Math.sqrt(t[4] * t[4] + t[5] * t[5]), va = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: Zn,
  scaleY: qn,
  scale: (t) => (Zn(t) + qn(t)) / 2,
  rotateX: (t) => je(lt(Math.atan2(t[6], t[5]))),
  rotateY: (t) => je(lt(Math.atan2(-t[2], t[0]))),
  rotateZ: Jn,
  rotate: Jn,
  skewX: (t) => lt(Math.atan(t[4])),
  skewY: (t) => lt(Math.atan(t[1])),
  skew: (t) => (Math.abs(t[1]) + Math.abs(t[4])) / 2
};
function Le(t) {
  return t.includes("scale") ? 1 : 0;
}
function Ve(t, e) {
  if (!t || t === "none")
    return Le(e);
  const n = t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let s, i;
  if (n)
    s = va, i = n;
  else {
    const a = t.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    s = Aa, i = a;
  }
  if (!i)
    return Le(e);
  const o = s[e], r = i[1].split(",").map(Ca);
  return typeof o == "function" ? o(r) : r[o];
}
const Ea = (t, e) => {
  const { transform: n = "none" } = getComputedStyle(t);
  return Ve(n, e);
};
function Ca(t) {
  return parseFloat(t.trim());
}
const wt = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], It = new Set(wt), _n = (t) => t === xt || t === w, xa = /* @__PURE__ */ new Set(["x", "y", "z"]), wa = wt.filter((t) => !xa.has(t));
function Ia(t) {
  const e = [];
  return wa.forEach((n) => {
    const s = t.getValue(n);
    s !== void 0 && (e.push([n, s.get()]), s.set(n.startsWith("scale") ? 1 : 0));
  }), e;
}
const ut = {
  // Dimensions
  width: ({ x: t }, { paddingLeft: e = "0", paddingRight: n = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(n),
  height: ({ y: t }, { paddingTop: e = "0", paddingBottom: n = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(n),
  top: (t, { top: e }) => parseFloat(e),
  left: (t, { left: e }) => parseFloat(e),
  bottom: ({ y: t }, { top: e }) => parseFloat(e) + (t.max - t.min),
  right: ({ x: t }, { left: e }) => parseFloat(e) + (t.max - t.min),
  // Transform
  x: (t, { transform: e }) => Ve(e, "x"),
  y: (t, { transform: e }) => Ve(e, "y")
};
ut.translateX = ut.x;
ut.translateY = ut.y;
const ht = /* @__PURE__ */ new Set();
let Fe = !1, He = !1, Oe = !1;
function Ni() {
  if (He) {
    const t = Array.from(ht).filter((s) => s.needsMeasurement), e = new Set(t.map((s) => s.element)), n = /* @__PURE__ */ new Map();
    e.forEach((s) => {
      const i = Ia(s);
      i.length && (n.set(s, i), s.render());
    }), t.forEach((s) => s.measureInitialState()), e.forEach((s) => {
      s.render();
      const i = n.get(s);
      i && i.forEach(([o, r]) => {
        var a;
        (a = s.getValue(o)) == null || a.set(r);
      });
    }), t.forEach((s) => s.measureEndState()), t.forEach((s) => {
      s.suspendedScrollY !== void 0 && window.scrollTo(0, s.suspendedScrollY);
    });
  }
  He = !1, Fe = !1, ht.forEach((t) => t.complete(Oe)), ht.clear();
}
function zi() {
  ht.forEach((t) => {
    t.readKeyframes(), t.needsMeasurement && (He = !0);
  });
}
function ba() {
  Oe = !0, zi(), Ni(), Oe = !1;
}
class Cn {
  constructor(e, n, s, i, o, r = !1) {
    this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...e], this.onComplete = n, this.name = s, this.motionValue = i, this.element = o, this.isAsync = r;
  }
  scheduleResolve() {
    this.state = "scheduled", this.isAsync ? (ht.add(this), Fe || (Fe = !0, D.read(zi), D.resolveKeyframes(Ni))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: e, name: n, element: s, motionValue: i } = this;
    if (e[0] === null) {
      const o = i == null ? void 0 : i.get(), r = e[e.length - 1];
      if (o !== void 0)
        e[0] = o;
      else if (s && n) {
        const a = s.readValue(n, r);
        a != null && (e[0] = a);
      }
      e[0] === void 0 && (e[0] = r), i && o === void 0 && i.set(e[0]);
    }
    ya(e);
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete(e = !1) {
    this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e), ht.delete(this);
  }
  cancel() {
    this.state === "scheduled" && (ht.delete(this), this.state = "pending");
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const Pa = (t) => t.startsWith("--");
function Sa(t, e, n) {
  Pa(e) ? t.style.setProperty(e, n) : t.style[e] = n;
}
const Ba = /* @__PURE__ */ cn(() => window.ScrollTimeline !== void 0), Da = {};
function Ra(t, e) {
  const n = /* @__PURE__ */ cn(t);
  return () => Da[e] ?? n();
}
const Xi = /* @__PURE__ */ Ra(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), Bt = ([t, e, n, s]) => `cubic-bezier(${t}, ${e}, ${n}, ${s})`, $n = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ Bt([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ Bt([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ Bt([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ Bt([0.33, 1.53, 0.69, 0.99])
};
function Yi(t, e) {
  if (t)
    return typeof t == "function" ? Xi() ? Fi(t, e) : "ease-out" : Bi(t) ? Bt(t) : Array.isArray(t) ? t.map((n) => Yi(n, e) || $n.easeOut) : $n[t];
}
function Ta(t, e, n, { delay: s = 0, duration: i = 300, repeat: o = 0, repeatType: r = "loop", ease: a = "easeOut", times: c } = {}, u = void 0) {
  const l = {
    [e]: n
  };
  c && (l.offset = c);
  const h = Yi(a, i);
  Array.isArray(h) && (l.easing = h);
  const f = {
    delay: s,
    duration: i,
    easing: Array.isArray(h) ? "linear" : h,
    fill: "both",
    iterations: o + 1,
    direction: r === "reverse" ? "alternate" : "normal"
  };
  return u && (f.pseudoElement = u), t.animate(l, f);
}
function Ui(t) {
  return typeof t == "function" && "applyToOptions" in t;
}
function Qa({ type: t, ...e }) {
  return Ui(t) && Xi() ? t.applyToOptions(e) : (e.duration ?? (e.duration = 300), e.ease ?? (e.ease = "easeOut"), e);
}
class Ma extends vn {
  constructor(e) {
    if (super(), this.finishedTime = null, this.isStopped = !1, !e)
      return;
    const { element: n, name: s, keyframes: i, pseudoElement: o, allowFlatten: r = !1, finalKeyframe: a, onComplete: c } = e;
    this.isPseudoElement = !!o, this.allowFlatten = r, this.options = e, an(typeof e.type != "string");
    const u = Qa(e);
    this.animation = Ta(n, s, i, u, o), u.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
      if (this.finishedTime = this.time, !o) {
        const l = An(i, this.options, a, this.speed);
        this.updateMotionValue ? this.updateMotionValue(l) : Sa(n, s, l), this.animation.cancel();
      }
      c == null || c(), this.notifyFinished();
    };
  }
  play() {
    this.isStopped || (this.animation.play(), this.state === "finished" && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    var e, n;
    (n = (e = this.animation).finish) == null || n.call(e);
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch {
    }
  }
  stop() {
    if (this.isStopped)
      return;
    this.isStopped = !0;
    const { state: e } = this;
    e === "idle" || e === "finished" || (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * In this method, we commit styles back to the DOM before cancelling
   * the animation.
   *
   * This is designed to be overridden by NativeAnimationExtended, which
   * will create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to also correctly calculate velocity for any subsequent animation
   * while deferring the commit until the next animation frame.
   */
  commitStyles() {
    var e, n;
    this.isPseudoElement || (n = (e = this.animation).commitStyles) == null || n.call(e);
  }
  get duration() {
    var n, s;
    const e = ((s = (n = this.animation.effect) == null ? void 0 : n.getComputedTiming) == null ? void 0 : s.call(n).duration) || 0;
    return /* @__PURE__ */ U(Number(e));
  }
  get iterationDuration() {
    const { delay: e = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ U(e);
  }
  get time() {
    return /* @__PURE__ */ U(Number(this.animation.currentTime) || 0);
  }
  set time(e) {
    this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ K(e);
  }
  /**
   * The playback speed of the animation.
   * 1 = normal speed, 2 = double speed, 0.5 = half speed.
   */
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(e) {
    e < 0 && (this.finishedTime = null), this.animation.playbackRate = e;
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return Number(this.animation.startTime);
  }
  set startTime(e) {
    this.animation.startTime = e;
  }
  /**
   * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
   */
  attachTimeline({ timeline: e, observe: n }) {
    var s;
    return this.allowFlatten && ((s = this.animation.effect) == null || s.updateTiming({ easing: "linear" })), this.animation.onfinish = null, e && Ba() ? (this.animation.timeline = e, W) : n(this);
  }
}
const Wi = {
  anticipate: Ii,
  backInOut: wi,
  circInOut: Pi
};
function ka(t) {
  return t in Wi;
}
function ja(t) {
  typeof t.ease == "string" && ka(t.ease) && (t.ease = Wi[t.ease]);
}
const ts = 10;
class La extends Ma {
  constructor(e) {
    ja(e), Oi(e), super(e), e.startTime && (this.startTime = e.startTime), this.options = e;
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * Rather than read commited styles back out of the DOM, we can
   * create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to calculate velocity for any subsequent animation.
   */
  updateMotionValue(e) {
    const { motionValue: n, onUpdate: s, onComplete: i, element: o, ...r } = this.options;
    if (!n)
      return;
    if (e !== void 0) {
      n.set(e);
      return;
    }
    const a = new En({
      ...r,
      autoplay: !1
    }), c = /* @__PURE__ */ K(this.finishedTime ?? this.time);
    n.setWithVelocity(a.sample(c - ts).value, a.sample(c).value, ts), a.stop();
  }
}
const es = (t, e) => e === "zIndex" ? !1 : !!(typeof t == "number" || Array.isArray(t) || typeof t == "string" && // It's animatable if we have a string
(st.test(t) || t === "0") && // And it contains numbers and/or colors
!t.startsWith("url("));
function Va(t) {
  const e = t[0];
  if (t.length === 1)
    return !0;
  for (let n = 0; n < t.length; n++)
    if (t[n] !== e)
      return !0;
}
function Fa(t, e, n, s) {
  const i = t[0];
  if (i === null)
    return !1;
  if (e === "display" || e === "visibility")
    return !0;
  const o = t[t.length - 1], r = es(i, e), a = es(o, e);
  return !r || !a ? !1 : Va(t) || (n === "spring" || Ui(n)) && s;
}
function Ne(t) {
  t.duration = 0, t.type = "keyframes";
}
const Ha = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Could be re-enabled now we have support for linear() easing
  // "background-color"
]), Oa = /* @__PURE__ */ cn(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function Na(t) {
  var l;
  const { motionValue: e, name: n, repeatDelay: s, repeatType: i, damping: o, type: r } = t;
  if (!(((l = e == null ? void 0 : e.owner) == null ? void 0 : l.current) instanceof HTMLElement))
    return !1;
  const { onUpdate: c, transformTemplate: u } = e.owner.getProps();
  return Oa() && n && Ha.has(n) && (n !== "transform" || !u) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !c && !s && i !== "mirror" && o !== 0 && r !== "inertia";
}
const za = 40;
class Xa extends vn {
  constructor({ autoplay: e = !0, delay: n = 0, type: s = "keyframes", repeat: i = 0, repeatDelay: o = 0, repeatType: r = "loop", keyframes: a, name: c, motionValue: u, element: l, ...h }) {
    var p;
    super(), this.stop = () => {
      var g, v;
      this._animation && (this._animation.stop(), (g = this.stopTimeline) == null || g.call(this)), (v = this.keyframeResolver) == null || v.cancel();
    }, this.createdAt = N.now();
    const f = {
      autoplay: e,
      delay: n,
      type: s,
      repeat: i,
      repeatDelay: o,
      repeatType: r,
      name: c,
      motionValue: u,
      element: l,
      ...h
    }, d = (l == null ? void 0 : l.KeyframeResolver) || Cn;
    this.keyframeResolver = new d(a, (g, v, A) => this.onKeyframesResolved(g, v, f, !A), c, u, l), (p = this.keyframeResolver) == null || p.scheduleResolve();
  }
  onKeyframesResolved(e, n, s, i) {
    this.keyframeResolver = void 0;
    const { name: o, type: r, velocity: a, delay: c, isHandoff: u, onUpdate: l } = s;
    this.resolvedAt = N.now(), Fa(e, o, r, a) || (($.instantAnimations || !c) && (l == null || l(An(e, s, n))), e[0] = e[e.length - 1], Ne(s), s.repeat = 0);
    const f = {
      startTime: i ? this.resolvedAt ? this.resolvedAt - this.createdAt > za ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
      finalKeyframe: n,
      ...s,
      keyframes: e
    }, d = !u && Na(f) ? new La({
      ...f,
      element: f.motionValue.owner.current
    }) : new En(f);
    d.finished.then(() => this.notifyFinished()).catch(W), this.pendingTimeline && (this.stopTimeline = d.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = d;
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(e, n) {
    return this.finished.finally(e).then(() => {
    });
  }
  get animation() {
    var e;
    return this._animation || ((e = this.keyframeResolver) == null || e.resume(), ba()), this._animation;
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(e) {
    this.animation.time = e;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(e) {
    this.animation.speed = e;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(e) {
    return this._animation ? this.stopTimeline = this.animation.attachTimeline(e) : this.pendingTimeline = e, () => this.stop();
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    var e;
    this._animation && this.animation.cancel(), (e = this.keyframeResolver) == null || e.cancel();
  }
}
const Ya = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function Ua(t) {
  const e = Ya.exec(t);
  if (!e)
    return [,];
  const [, n, s, i] = e;
  return [`--${n ?? s}`, i];
}
function Gi(t, e, n = 1) {
  const [s, i] = Ua(t);
  if (!s)
    return;
  const o = window.getComputedStyle(e).getPropertyValue(s);
  if (o) {
    const r = o.trim();
    return pi(r) ? parseFloat(r) : r;
  }
  return dn(i) ? Gi(i, e, n + 1) : i;
}
function xn(t, e) {
  return (t == null ? void 0 : t[e]) ?? (t == null ? void 0 : t.default) ?? t;
}
const Ki = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...wt
]), Wa = {
  test: (t) => t === "auto",
  parse: (t) => t
}, Ji = (t) => (e) => e.test(t), Zi = [xt, w, J, et, Vo, Lo, Wa], ns = (t) => Zi.find(Ji(t));
function Ga(t) {
  return typeof t == "number" ? t === 0 : t !== null ? t === "none" || t === "0" || yi(t) : !0;
}
const Ka = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function Ja(t) {
  const [e, n] = t.slice(0, -1).split("(");
  if (e === "drop-shadow")
    return t;
  const [s] = n.match(mn) || [];
  if (!s)
    return t;
  const i = n.replace(s, "");
  let o = Ka.has(e) ? 1 : 0;
  return s !== n && (o *= 100), e + "(" + o + i + ")";
}
const Za = /\b([a-z-]*)\(.*?\)/gu, ze = {
  ...st,
  getAnimatableNone: (t) => {
    const e = t.match(Za);
    return e ? e.map(Ja).join(" ") : t;
  }
}, ss = {
  ...xt,
  transform: Math.round
}, qa = {
  rotate: et,
  rotateX: et,
  rotateY: et,
  rotateZ: et,
  scale: Gt,
  scaleX: Gt,
  scaleY: Gt,
  scaleZ: Gt,
  skew: et,
  skewX: et,
  skewY: et,
  distance: w,
  translateX: w,
  translateY: w,
  translateZ: w,
  x: w,
  y: w,
  z: w,
  perspective: w,
  transformPerspective: w,
  opacity: jt,
  originX: Yn,
  originY: Yn,
  originZ: w
}, wn = {
  // Border props
  borderWidth: w,
  borderTopWidth: w,
  borderRightWidth: w,
  borderBottomWidth: w,
  borderLeftWidth: w,
  borderRadius: w,
  radius: w,
  borderTopLeftRadius: w,
  borderTopRightRadius: w,
  borderBottomRightRadius: w,
  borderBottomLeftRadius: w,
  // Positioning props
  width: w,
  maxWidth: w,
  height: w,
  maxHeight: w,
  top: w,
  right: w,
  bottom: w,
  left: w,
  // Spacing props
  padding: w,
  paddingTop: w,
  paddingRight: w,
  paddingBottom: w,
  paddingLeft: w,
  margin: w,
  marginTop: w,
  marginRight: w,
  marginBottom: w,
  marginLeft: w,
  // Misc
  backgroundPositionX: w,
  backgroundPositionY: w,
  ...qa,
  zIndex: ss,
  // SVG
  fillOpacity: jt,
  strokeOpacity: jt,
  numOctaves: ss
}, _a = {
  ...wn,
  // Color props
  color: M,
  backgroundColor: M,
  outlineColor: M,
  fill: M,
  stroke: M,
  // Border props
  borderColor: M,
  borderTopColor: M,
  borderRightColor: M,
  borderBottomColor: M,
  borderLeftColor: M,
  filter: ze,
  WebkitFilter: ze
}, qi = (t) => _a[t];
function _i(t, e) {
  let n = qi(t);
  return n !== ze && (n = st), n.getAnimatableNone ? n.getAnimatableNone(e) : void 0;
}
const $a = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function tc(t, e, n) {
  let s = 0, i;
  for (; s < t.length && !i; ) {
    const o = t[s];
    typeof o == "string" && !$a.has(o) && Lt(o).values.length && (i = t[s]), s++;
  }
  if (i && n)
    for (const o of e)
      t[o] = _i(n, i);
}
class ec extends Cn {
  constructor(e, n, s, i, o) {
    super(e, n, s, i, o, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: e, element: n, name: s } = this;
    if (!n || !n.current)
      return;
    super.readKeyframes();
    for (let c = 0; c < e.length; c++) {
      let u = e[c];
      if (typeof u == "string" && (u = u.trim(), dn(u))) {
        const l = Gi(u, n.current);
        l !== void 0 && (e[c] = l), c === e.length - 1 && (this.finalKeyframe = u);
      }
    }
    if (this.resolveNoneKeyframes(), !Ki.has(s) || e.length !== 2)
      return;
    const [i, o] = e, r = ns(i), a = ns(o);
    if (r !== a)
      if (_n(r) && _n(a))
        for (let c = 0; c < e.length; c++) {
          const u = e[c];
          typeof u == "string" && (e[c] = parseFloat(u));
        }
      else ut[s] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: e, name: n } = this, s = [];
    for (let i = 0; i < e.length; i++)
      (e[i] === null || Ga(e[i])) && s.push(i);
    s.length && tc(e, s, n);
  }
  measureInitialState() {
    const { element: e, unresolvedKeyframes: n, name: s } = this;
    if (!e || !e.current)
      return;
    s === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = ut[s](e.measureViewportBox(), window.getComputedStyle(e.current)), n[0] = this.measuredOrigin;
    const i = n[n.length - 1];
    i !== void 0 && e.getValue(s, i).jump(i, !1);
  }
  measureEndState() {
    var a;
    const { element: e, name: n, unresolvedKeyframes: s } = this;
    if (!e || !e.current)
      return;
    const i = e.getValue(n);
    i && i.jump(this.measuredOrigin, !1);
    const o = s.length - 1, r = s[o];
    s[o] = ut[n](e.measureViewportBox(), window.getComputedStyle(e.current)), r !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = r), (a = this.removedTransforms) != null && a.length && this.removedTransforms.forEach(([c, u]) => {
      e.getValue(c).set(u);
    }), this.resolveNoneKeyframes();
  }
}
function nc(t, e, n) {
  if (t instanceof EventTarget)
    return [t];
  if (typeof t == "string") {
    let s = document;
    const i = (n == null ? void 0 : n[t]) ?? s.querySelectorAll(t);
    return i ? Array.from(i) : [];
  }
  return Array.from(t);
}
const $i = (t, e) => e && typeof t == "number" ? e.transform(t) : t;
function tr(t) {
  return gi(t) && "offsetHeight" in t;
}
const is = 30, sc = (t) => !isNaN(parseFloat(t));
class ic {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(e, n = {}) {
    this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (s) => {
      var o;
      const i = N.now();
      if (this.updatedAt !== i && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(s), this.current !== this.prev && ((o = this.events.change) == null || o.notify(this.current), this.dependents))
        for (const r of this.dependents)
          r.dirty();
    }, this.hasAnimated = !1, this.setCurrent(e), this.owner = n.owner;
  }
  setCurrent(e) {
    this.current = e, this.updatedAt = N.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = sc(this.current));
  }
  setPrevFrameValue(e = this.current) {
    this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(e) {
    return this.on("change", e);
  }
  on(e, n) {
    this.events[e] || (this.events[e] = new ln());
    const s = this.events[e].add(n);
    return e === "change" ? () => {
      s(), D.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : s;
  }
  clearListeners() {
    for (const e in this.events)
      this.events[e].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(e, n) {
    this.passiveEffect = e, this.stopPassiveEffect = n;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(e) {
    this.passiveEffect ? this.passiveEffect(e, this.updateAndNotify) : this.updateAndNotify(e);
  }
  setWithVelocity(e, n, s) {
    this.set(n), this.prev = void 0, this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt - s;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(e, n = !0) {
    this.updateAndNotify(e), this.prev = e, this.prevUpdatedAt = this.prevFrameValue = void 0, n && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  dirty() {
    var e;
    (e = this.events.change) == null || e.notify(this.current);
  }
  addDependent(e) {
    this.dependents || (this.dependents = /* @__PURE__ */ new Set()), this.dependents.add(e);
  }
  removeDependent(e) {
    this.dependents && this.dependents.delete(e);
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const e = N.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > is)
      return 0;
    const n = Math.min(this.updatedAt - this.prevUpdatedAt, is);
    return Ai(parseFloat(this.current) - parseFloat(this.prevFrameValue), n);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   */
  start(e) {
    return this.stop(), new Promise((n) => {
      this.hasAnimated = !0, this.animation = e(n), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    var e, n;
    (e = this.dependents) == null || e.clear(), (n = this.events.destroy) == null || n.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function vt(t, e) {
  return new ic(t, e);
}
const { schedule: In } = /* @__PURE__ */ Di(queueMicrotask, !1), G = {
  x: !1,
  y: !1
};
function er() {
  return G.x || G.y;
}
function rc(t) {
  return t === "x" || t === "y" ? G[t] ? null : (G[t] = !0, () => {
    G[t] = !1;
  }) : G.x || G.y ? null : (G.x = G.y = !0, () => {
    G.x = G.y = !1;
  });
}
function nr(t, e) {
  const n = nc(t), s = new AbortController(), i = {
    passive: !0,
    ...e,
    signal: s.signal
  };
  return [n, i, () => s.abort()];
}
function rs(t) {
  return !(t.pointerType === "touch" || er());
}
function oc(t, e, n = {}) {
  const [s, i, o] = nr(t, n), r = (a) => {
    if (!rs(a))
      return;
    const { target: c } = a, u = e(c, a);
    if (typeof u != "function" || !c)
      return;
    const l = (h) => {
      rs(h) && (u(h), c.removeEventListener("pointerleave", l));
    };
    c.addEventListener("pointerleave", l, i);
  };
  return s.forEach((a) => {
    a.addEventListener("pointerenter", r, i);
  }), o;
}
const sr = (t, e) => e ? t === e ? !0 : sr(t, e.parentElement) : !1, bn = (t) => t.pointerType === "mouse" ? typeof t.button != "number" || t.button <= 0 : t.isPrimary !== !1, ac = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function cc(t) {
  return ac.has(t.tagName) || t.tabIndex !== -1;
}
const $t = /* @__PURE__ */ new WeakSet();
function os(t) {
  return (e) => {
    e.key === "Enter" && t(e);
  };
}
function Ee(t, e) {
  t.dispatchEvent(new PointerEvent("pointer" + e, { isPrimary: !0, bubbles: !0 }));
}
const lc = (t, e) => {
  const n = t.currentTarget;
  if (!n)
    return;
  const s = os(() => {
    if ($t.has(n))
      return;
    Ee(n, "down");
    const i = os(() => {
      Ee(n, "up");
    }), o = () => Ee(n, "cancel");
    n.addEventListener("keyup", i, e), n.addEventListener("blur", o, e);
  });
  n.addEventListener("keydown", s, e), n.addEventListener("blur", () => n.removeEventListener("keydown", s), e);
};
function as(t) {
  return bn(t) && !er();
}
function uc(t, e, n = {}) {
  const [s, i, o] = nr(t, n), r = (a) => {
    const c = a.currentTarget;
    if (!as(a))
      return;
    $t.add(c);
    const u = e(c, a), l = (d, p) => {
      window.removeEventListener("pointerup", h), window.removeEventListener("pointercancel", f), $t.has(c) && $t.delete(c), as(d) && typeof u == "function" && u(d, { success: p });
    }, h = (d) => {
      l(d, c === window || c === document || n.useGlobalTarget || sr(c, d.target));
    }, f = (d) => {
      l(d, !1);
    };
    window.addEventListener("pointerup", h, i), window.addEventListener("pointercancel", f, i);
  };
  return s.forEach((a) => {
    (n.useGlobalTarget ? window : a).addEventListener("pointerdown", r, i), tr(a) && (a.addEventListener("focus", (u) => lc(u, i)), !cc(a) && !a.hasAttribute("tabindex") && (a.tabIndex = 0));
  }), o;
}
function ir(t) {
  return gi(t) && "ownerSVGElement" in t;
}
function hc(t) {
  return ir(t) && t.tagName === "svg";
}
const V = (t) => !!(t && t.getVelocity), fc = [...Zi, M, st], dc = (t) => fc.find(Ji(t)), Pn = y.createContext({
  transformPagePoint: (t) => t,
  isStatic: !1,
  reducedMotion: "never"
});
function cs(t, e) {
  if (typeof t == "function")
    return t(e);
  t != null && (t.current = e);
}
function mc(...t) {
  return (e) => {
    let n = !1;
    const s = t.map((i) => {
      const o = cs(i, e);
      return !n && typeof o == "function" && (n = !0), o;
    });
    if (n)
      return () => {
        for (let i = 0; i < s.length; i++) {
          const o = s[i];
          typeof o == "function" ? o() : cs(t[i], null);
        }
      };
  };
}
function pc(...t) {
  return y.useCallback(mc(...t), t);
}
class gc extends y.Component {
  getSnapshotBeforeUpdate(e) {
    const n = this.props.childRef.current;
    if (n && e.isPresent && !this.props.isPresent) {
      const s = n.offsetParent, i = tr(s) && s.offsetWidth || 0, o = this.props.sizeRef.current;
      o.height = n.offsetHeight || 0, o.width = n.offsetWidth || 0, o.top = n.offsetTop, o.left = n.offsetLeft, o.right = i - o.width - o.left;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function yc({ children: t, isPresent: e, anchorX: n, root: s }) {
  const i = y.useId(), o = y.useRef(null), r = y.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0
  }), { nonce: a } = y.useContext(Pn), c = pc(o, t == null ? void 0 : t.ref);
  return y.useInsertionEffect(() => {
    const { width: u, height: l, top: h, left: f, right: d } = r.current;
    if (e || !o.current || !u || !l)
      return;
    const p = n === "left" ? `left: ${f}` : `right: ${d}`;
    o.current.dataset.motionPopId = i;
    const g = document.createElement("style");
    a && (g.nonce = a);
    const v = s ?? document.head;
    return v.appendChild(g), g.sheet && g.sheet.insertRule(`
          [data-motion-pop-id="${i}"] {
            position: absolute !important;
            width: ${u}px !important;
            height: ${l}px !important;
            ${p}px !important;
            top: ${h}px !important;
          }
        `), () => {
      v.contains(g) && v.removeChild(g);
    };
  }, [e]), m.jsx(gc, { isPresent: e, childRef: o, sizeRef: r, children: y.cloneElement(t, { ref: c }) });
}
const Ac = ({ children: t, initial: e, isPresent: n, onExitComplete: s, custom: i, presenceAffectsLayout: o, mode: r, anchorX: a, root: c }) => {
  const u = nn(vc), l = y.useId();
  let h = !0, f = y.useMemo(() => (h = !1, {
    id: l,
    initial: e,
    isPresent: n,
    custom: i,
    onExitComplete: (d) => {
      u.set(d, !0);
      for (const p of u.values())
        if (!p)
          return;
      s && s();
    },
    register: (d) => (u.set(d, !1), () => u.delete(d))
  }), [n, u, s]);
  return o && h && (f = { ...f }), y.useMemo(() => {
    u.forEach((d, p) => u.set(p, !1));
  }, [n]), y.useEffect(() => {
    !n && !u.size && s && s();
  }, [n]), r === "popLayout" && (t = m.jsx(yc, { isPresent: n, anchorX: a, root: c, children: t })), m.jsx(ue.Provider, { value: f, children: t });
};
function vc() {
  return /* @__PURE__ */ new Map();
}
function rr(t = !0) {
  const e = y.useContext(ue);
  if (e === null)
    return [!0, null];
  const { isPresent: n, onExitComplete: s, register: i } = e, o = y.useId();
  y.useEffect(() => {
    if (t)
      return i(o);
  }, [t]);
  const r = y.useCallback(() => t && s && s(o), [o, s, t]);
  return !n && s ? [!1, r] : [!0];
}
const Kt = (t) => t.key || "";
function ls(t) {
  const e = [];
  return y.Children.forEach(t, (n) => {
    y.isValidElement(n) && e.push(n);
  }), e;
}
const oe = ({ children: t, custom: e, initial: n = !0, onExitComplete: s, presenceAffectsLayout: i = !0, mode: o = "sync", propagate: r = !1, anchorX: a = "left", root: c }) => {
  const [u, l] = rr(r), h = y.useMemo(() => ls(t), [t]), f = r && !u ? [] : h.map(Kt), d = y.useRef(!0), p = y.useRef(h), g = nn(() => /* @__PURE__ */ new Map()), [v, A] = y.useState(h), [C, E] = y.useState(h);
  mi(() => {
    d.current = !1, p.current = h;
    for (let P = 0; P < C.length; P++) {
      const B = Kt(C[P]);
      f.includes(B) ? g.delete(B) : g.get(B) !== !0 && g.set(B, !1);
    }
  }, [C, f.length, f.join("-")]);
  const I = [];
  if (h !== v) {
    let P = [...h];
    for (let B = 0; B < C.length; B++) {
      const b = C[B], k = Kt(b);
      f.includes(k) || (P.splice(B, 0, b), I.push(b));
    }
    return o === "wait" && I.length && (P = I), E(ls(P)), A(h), null;
  }
  const { forceRender: x } = y.useContext(en);
  return m.jsx(m.Fragment, { children: C.map((P) => {
    const B = Kt(P), b = r && !u ? !1 : h === C || f.includes(B), k = () => {
      if (g.has(B))
        g.set(B, !0);
      else
        return;
      let F = !0;
      g.forEach((tt) => {
        tt || (F = !1);
      }), F && (x == null || x(), E(p.current), r && (l == null || l()), s && s());
    };
    return m.jsx(Ac, { isPresent: b, initial: !d.current || n ? void 0 : !1, custom: e, presenceAffectsLayout: i, mode: o, root: c, onExitComplete: b ? void 0 : k, anchorX: a, children: P }, B);
  }) });
}, or = y.createContext({ strict: !1 }), us = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
}, Et = {};
for (const t in us)
  Et[t] = {
    isEnabled: (e) => us[t].some((n) => !!e[n])
  };
function Ec(t) {
  for (const e in t)
    Et[e] = {
      ...Et[e],
      ...t[e]
    };
}
const Cc = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport"
]);
function ae(t) {
  return t.startsWith("while") || t.startsWith("drag") && t !== "draggable" || t.startsWith("layout") || t.startsWith("onTap") || t.startsWith("onPan") || t.startsWith("onLayout") || Cc.has(t);
}
let ar = (t) => !ae(t);
function xc(t) {
  typeof t == "function" && (ar = (e) => e.startsWith("on") ? !ae(e) : t(e));
}
try {
  xc(require("@emotion/is-prop-valid").default);
} catch {
}
function wc(t, e, n) {
  const s = {};
  for (const i in t)
    i === "values" && typeof t.values == "object" || (ar(i) || n === !0 && ae(i) || !e && !ae(i) || // If trying to use native HTML drag events, forward drag listeners
    t.draggable && i.startsWith("onDrag")) && (s[i] = t[i]);
  return s;
}
const he = /* @__PURE__ */ y.createContext({});
function fe(t) {
  return t !== null && typeof t == "object" && typeof t.start == "function";
}
function Vt(t) {
  return typeof t == "string" || Array.isArray(t);
}
const Sn = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], Bn = ["initial", ...Sn];
function de(t) {
  return fe(t.animate) || Bn.some((e) => Vt(t[e]));
}
function cr(t) {
  return !!(de(t) || t.variants);
}
function Ic(t, e) {
  if (de(t)) {
    const { initial: n, animate: s } = t;
    return {
      initial: n === !1 || Vt(n) ? n : void 0,
      animate: Vt(s) ? s : void 0
    };
  }
  return t.inherit !== !1 ? e : {};
}
function bc(t) {
  const { initial: e, animate: n } = Ic(t, y.useContext(he));
  return y.useMemo(() => ({ initial: e, animate: n }), [hs(e), hs(n)]);
}
function hs(t) {
  return Array.isArray(t) ? t.join(" ") : t;
}
const Ft = {};
function Pc(t) {
  for (const e in t)
    Ft[e] = t[e], fn(e) && (Ft[e].isCSSVariable = !0);
}
function lr(t, { layout: e, layoutId: n }) {
  return It.has(t) || t.startsWith("origin") || (e || n !== void 0) && (!!Ft[t] || t === "opacity");
}
const Sc = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, Bc = wt.length;
function Dc(t, e, n) {
  let s = "", i = !0;
  for (let o = 0; o < Bc; o++) {
    const r = wt[o], a = t[r];
    if (a === void 0)
      continue;
    let c = !0;
    if (typeof a == "number" ? c = a === (r.startsWith("scale") ? 1 : 0) : c = parseFloat(a) === 0, !c || n) {
      const u = $i(a, wn[r]);
      if (!c) {
        i = !1;
        const l = Sc[r] || r;
        s += `${l}(${u}) `;
      }
      n && (e[r] = u);
    }
  }
  return s = s.trim(), n ? s = n(e, i ? "" : s) : i && (s = "none"), s;
}
function Dn(t, e, n) {
  const { style: s, vars: i, transformOrigin: o } = t;
  let r = !1, a = !1;
  for (const c in e) {
    const u = e[c];
    if (It.has(c)) {
      r = !0;
      continue;
    } else if (fn(c)) {
      i[c] = u;
      continue;
    } else {
      const l = $i(u, wn[c]);
      c.startsWith("origin") ? (a = !0, o[c] = l) : s[c] = l;
    }
  }
  if (e.transform || (r || n ? s.transform = Dc(e, t.transform, n) : s.transform && (s.transform = "none")), a) {
    const { originX: c = "50%", originY: u = "50%", originZ: l = 0 } = o;
    s.transformOrigin = `${c} ${u} ${l}`;
  }
}
const Rn = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function ur(t, e, n) {
  for (const s in e)
    !V(e[s]) && !lr(s, n) && (t[s] = e[s]);
}
function Rc({ transformTemplate: t }, e) {
  return y.useMemo(() => {
    const n = Rn();
    return Dn(n, e, t), Object.assign({}, n.vars, n.style);
  }, [e]);
}
function Tc(t, e) {
  const n = t.style || {}, s = {};
  return ur(s, n, t), Object.assign(s, Rc(t, e)), s;
}
function Qc(t, e) {
  const n = {}, s = Tc(t, e);
  return t.drag && t.dragListener !== !1 && (n.draggable = !1, s.userSelect = s.WebkitUserSelect = s.WebkitTouchCallout = "none", s.touchAction = t.drag === !0 ? "none" : `pan-${t.drag === "x" ? "y" : "x"}`), t.tabIndex === void 0 && (t.onTap || t.onTapStart || t.whileTap) && (n.tabIndex = 0), n.style = s, n;
}
const Mc = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, kc = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function jc(t, e, n = 1, s = 0, i = !0) {
  t.pathLength = 1;
  const o = i ? Mc : kc;
  t[o.offset] = w.transform(-s);
  const r = w.transform(e), a = w.transform(n);
  t[o.array] = `${r} ${a}`;
}
function hr(t, {
  attrX: e,
  attrY: n,
  attrScale: s,
  pathLength: i,
  pathSpacing: o = 1,
  pathOffset: r = 0,
  // This is object creation, which we try to avoid per-frame.
  ...a
}, c, u, l) {
  if (Dn(t, a, u), c) {
    t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
    return;
  }
  t.attrs = t.style, t.style = {};
  const { attrs: h, style: f } = t;
  h.transform && (f.transform = h.transform, delete h.transform), (f.transform || h.transformOrigin) && (f.transformOrigin = h.transformOrigin ?? "50% 50%", delete h.transformOrigin), f.transform && (f.transformBox = (l == null ? void 0 : l.transformBox) ?? "fill-box", delete h.transformBox), e !== void 0 && (h.x = e), n !== void 0 && (h.y = n), s !== void 0 && (h.scale = s), i !== void 0 && jc(h, i, o, r, !1);
}
const fr = () => ({
  ...Rn(),
  attrs: {}
}), dr = (t) => typeof t == "string" && t.toLowerCase() === "svg";
function Lc(t, e, n, s) {
  const i = y.useMemo(() => {
    const o = fr();
    return hr(o, e, dr(s), t.transformTemplate, t.style), {
      ...o.attrs,
      style: { ...o.style }
    };
  }, [e]);
  if (t.style) {
    const o = {};
    ur(o, t.style, t), i.style = { ...o, ...i.style };
  }
  return i;
}
const Vc = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function Tn(t) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof t != "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    t.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(Vc.indexOf(t) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(t))
    )
  );
}
function Fc(t, e, n, { latestValues: s }, i, o = !1) {
  const a = (Tn(t) ? Lc : Qc)(e, s, i, t), c = wc(e, typeof t == "string", o), u = t !== y.Fragment ? { ...c, ...a, ref: n } : {}, { children: l } = e, h = y.useMemo(() => V(l) ? l.get() : l, [l]);
  return y.createElement(t, {
    ...u,
    children: h
  });
}
function fs(t) {
  const e = [{}, {}];
  return t == null || t.values.forEach((n, s) => {
    e[0][s] = n.get(), e[1][s] = n.getVelocity();
  }), e;
}
function Qn(t, e, n, s) {
  if (typeof e == "function") {
    const [i, o] = fs(s);
    e = e(n !== void 0 ? n : t.custom, i, o);
  }
  if (typeof e == "string" && (e = t.variants && t.variants[e]), typeof e == "function") {
    const [i, o] = fs(s);
    e = e(n !== void 0 ? n : t.custom, i, o);
  }
  return e;
}
function te(t) {
  return V(t) ? t.get() : t;
}
function Hc({ scrapeMotionValuesFromProps: t, createRenderState: e }, n, s, i) {
  return {
    latestValues: Oc(n, s, i, t),
    renderState: e()
  };
}
function Oc(t, e, n, s) {
  const i = {}, o = s(t, {});
  for (const f in o)
    i[f] = te(o[f]);
  let { initial: r, animate: a } = t;
  const c = de(t), u = cr(t);
  e && u && !c && t.inherit !== !1 && (r === void 0 && (r = e.initial), a === void 0 && (a = e.animate));
  let l = n ? n.initial === !1 : !1;
  l = l || r === !1;
  const h = l ? a : r;
  if (h && typeof h != "boolean" && !fe(h)) {
    const f = Array.isArray(h) ? h : [h];
    for (let d = 0; d < f.length; d++) {
      const p = Qn(t, f[d]);
      if (p) {
        const { transitionEnd: g, transition: v, ...A } = p;
        for (const C in A) {
          let E = A[C];
          if (Array.isArray(E)) {
            const I = l ? E.length - 1 : 0;
            E = E[I];
          }
          E !== null && (i[C] = E);
        }
        for (const C in g)
          i[C] = g[C];
      }
    }
  }
  return i;
}
const mr = (t) => (e, n) => {
  const s = y.useContext(he), i = y.useContext(ue), o = () => Hc(t, e, s, i);
  return n ? o() : nn(o);
};
function Mn(t, e, n) {
  var o;
  const { style: s } = t, i = {};
  for (const r in s)
    (V(s[r]) || e.style && V(e.style[r]) || lr(r, t) || ((o = n == null ? void 0 : n.getValue(r)) == null ? void 0 : o.liveStyle) !== void 0) && (i[r] = s[r]);
  return i;
}
const Nc = /* @__PURE__ */ mr({
  scrapeMotionValuesFromProps: Mn,
  createRenderState: Rn
});
function pr(t, e, n) {
  const s = Mn(t, e, n);
  for (const i in t)
    if (V(t[i]) || V(e[i])) {
      const o = wt.indexOf(i) !== -1 ? "attr" + i.charAt(0).toUpperCase() + i.substring(1) : i;
      s[o] = t[i];
    }
  return s;
}
const zc = /* @__PURE__ */ mr({
  scrapeMotionValuesFromProps: pr,
  createRenderState: fr
}), Xc = Symbol.for("motionComponentSymbol");
function mt(t) {
  return t && typeof t == "object" && Object.prototype.hasOwnProperty.call(t, "current");
}
function Yc(t, e, n) {
  return y.useCallback(
    (s) => {
      s && t.onMount && t.onMount(s), e && (s ? e.mount(s) : e.unmount()), n && (typeof n == "function" ? n(s) : mt(n) && (n.current = s));
    },
    /**
     * Include externalRef in dependencies to ensure the callback updates
     * when the ref changes, allowing proper ref forwarding.
     */
    [e]
  );
}
const kn = (t) => t.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), Uc = "framerAppearId", gr = "data-" + kn(Uc), yr = y.createContext({});
function Wc(t, e, n, s, i) {
  var g, v;
  const { visualElement: o } = y.useContext(he), r = y.useContext(or), a = y.useContext(ue), c = y.useContext(Pn).reducedMotion, u = y.useRef(null);
  s = s || r.renderer, !u.current && s && (u.current = s(t, {
    visualState: e,
    parent: o,
    props: n,
    presenceContext: a,
    blockInitialAnimation: a ? a.initial === !1 : !1,
    reducedMotionConfig: c
  }));
  const l = u.current, h = y.useContext(yr);
  l && !l.projection && i && (l.type === "html" || l.type === "svg") && Gc(u.current, n, i, h);
  const f = y.useRef(!1);
  y.useInsertionEffect(() => {
    l && f.current && l.update(n, a);
  });
  const d = n[gr], p = y.useRef(!!d && !((g = window.MotionHandoffIsComplete) != null && g.call(window, d)) && ((v = window.MotionHasOptimisedAnimation) == null ? void 0 : v.call(window, d)));
  return mi(() => {
    l && (f.current = !0, window.MotionIsMounted = !0, l.updateFeatures(), l.scheduleRenderMicrotask(), p.current && l.animationState && l.animationState.animateChanges());
  }), y.useEffect(() => {
    l && (!p.current && l.animationState && l.animationState.animateChanges(), p.current && (queueMicrotask(() => {
      var A;
      (A = window.MotionHandoffMarkAsComplete) == null || A.call(window, d);
    }), p.current = !1), l.enteringChildren = void 0);
  }), l;
}
function Gc(t, e, n, s) {
  const { layoutId: i, layout: o, drag: r, dragConstraints: a, layoutScroll: c, layoutRoot: u, layoutCrossfade: l } = e;
  t.projection = new n(t.latestValues, e["data-framer-portal-id"] ? void 0 : Ar(t.parent)), t.projection.setOptions({
    layoutId: i,
    layout: o,
    alwaysMeasureLayout: !!r || a && mt(a),
    visualElement: t,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof o == "string" ? o : "both",
    initialPromotionConfig: s,
    crossfade: l,
    layoutScroll: c,
    layoutRoot: u
  });
}
function Ar(t) {
  if (t)
    return t.options.allowProjection !== !1 ? t.projection : Ar(t.parent);
}
function Ce(t, { forwardMotionProps: e = !1 } = {}, n, s) {
  n && Ec(n);
  const i = Tn(t) ? zc : Nc;
  function o(a, c) {
    let u;
    const l = {
      ...y.useContext(Pn),
      ...a,
      layoutId: Kc(a)
    }, { isStatic: h } = l, f = bc(a), d = i(a, h);
    if (!h && sn) {
      Jc();
      const p = Zc(l);
      u = p.MeasureLayout, f.visualElement = Wc(t, d, l, s, p.ProjectionNode);
    }
    return m.jsxs(he.Provider, { value: f, children: [u && f.visualElement ? m.jsx(u, { visualElement: f.visualElement, ...l }) : null, Fc(t, a, Yc(d, f.visualElement, c), d, h, e)] });
  }
  o.displayName = `motion.${typeof t == "string" ? t : `create(${t.displayName ?? t.name ?? ""})`}`;
  const r = y.forwardRef(o);
  return r[Xc] = t, r;
}
function Kc({ layoutId: t }) {
  const e = y.useContext(en).id;
  return e && t !== void 0 ? e + "-" + t : t;
}
function Jc(t, e) {
  y.useContext(or).strict;
}
function Zc(t) {
  const { drag: e, layout: n } = Et;
  if (!e && !n)
    return {};
  const s = { ...e, ...n };
  return {
    MeasureLayout: e != null && e.isEnabled(t) || n != null && n.isEnabled(t) ? s.MeasureLayout : void 0,
    ProjectionNode: s.ProjectionNode
  };
}
function qc(t, e) {
  if (typeof Proxy > "u")
    return Ce;
  const n = /* @__PURE__ */ new Map(), s = (o, r) => Ce(o, r, t, e), i = (o, r) => s(o, r);
  return new Proxy(i, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (o, r) => r === "create" ? s : (n.has(r) || n.set(r, Ce(r, void 0, t, e)), n.get(r))
  });
}
function vr({ top: t, left: e, right: n, bottom: s }) {
  return {
    x: { min: e, max: n },
    y: { min: t, max: s }
  };
}
function _c({ x: t, y: e }) {
  return { top: e.min, right: t.max, bottom: e.max, left: t.min };
}
function $c(t, e) {
  if (!e)
    return t;
  const n = e({ x: t.left, y: t.top }), s = e({ x: t.right, y: t.bottom });
  return {
    top: n.y,
    left: n.x,
    bottom: s.y,
    right: s.x
  };
}
function xe(t) {
  return t === void 0 || t === 1;
}
function Xe({ scale: t, scaleX: e, scaleY: n }) {
  return !xe(t) || !xe(e) || !xe(n);
}
function at(t) {
  return Xe(t) || Er(t) || t.z || t.rotate || t.rotateX || t.rotateY || t.skewX || t.skewY;
}
function Er(t) {
  return ds(t.x) || ds(t.y);
}
function ds(t) {
  return t && t !== "0%";
}
function ce(t, e, n) {
  const s = t - n, i = e * s;
  return n + i;
}
function ms(t, e, n, s, i) {
  return i !== void 0 && (t = ce(t, i, s)), ce(t, n, s) + e;
}
function Ye(t, e = 0, n = 1, s, i) {
  t.min = ms(t.min, e, n, s, i), t.max = ms(t.max, e, n, s, i);
}
function Cr(t, { x: e, y: n }) {
  Ye(t.x, e.translate, e.scale, e.originPoint), Ye(t.y, n.translate, n.scale, n.originPoint);
}
const ps = 0.999999999999, gs = 1.0000000000001;
function tl(t, e, n, s = !1) {
  const i = n.length;
  if (!i)
    return;
  e.x = e.y = 1;
  let o, r;
  for (let a = 0; a < i; a++) {
    o = n[a], r = o.projectionDelta;
    const { visualElement: c } = o.options;
    c && c.props.style && c.props.style.display === "contents" || (s && o.options.layoutScroll && o.scroll && o !== o.root && gt(t, {
      x: -o.scroll.offset.x,
      y: -o.scroll.offset.y
    }), r && (e.x *= r.x.scale, e.y *= r.y.scale, Cr(t, r)), s && at(o.latestValues) && gt(t, o.latestValues));
  }
  e.x < gs && e.x > ps && (e.x = 1), e.y < gs && e.y > ps && (e.y = 1);
}
function pt(t, e) {
  t.min = t.min + e, t.max = t.max + e;
}
function ys(t, e, n, s, i = 0.5) {
  const o = R(t.min, t.max, i);
  Ye(t, e, n, o, s);
}
function gt(t, e) {
  ys(t.x, e.x, e.scaleX, e.scale, e.originX), ys(t.y, e.y, e.scaleY, e.scale, e.originY);
}
function xr(t, e) {
  return vr($c(t.getBoundingClientRect(), e));
}
function el(t, e, n) {
  const s = xr(t, n), { scroll: i } = e;
  return i && (pt(s.x, i.offset.x), pt(s.y, i.offset.y)), s;
}
const As = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), yt = () => ({
  x: As(),
  y: As()
}), vs = () => ({ min: 0, max: 0 }), Q = () => ({
  x: vs(),
  y: vs()
}), Ue = { current: null }, wr = { current: !1 };
function nl() {
  if (wr.current = !0, !!sn)
    if (window.matchMedia) {
      const t = window.matchMedia("(prefers-reduced-motion)"), e = () => Ue.current = t.matches;
      t.addEventListener("change", e), e();
    } else
      Ue.current = !1;
}
const sl = /* @__PURE__ */ new WeakMap();
function il(t, e, n) {
  for (const s in e) {
    const i = e[s], o = n[s];
    if (V(i))
      t.addValue(s, i);
    else if (V(o))
      t.addValue(s, vt(i, { owner: t }));
    else if (o !== i)
      if (t.hasValue(s)) {
        const r = t.getValue(s);
        r.liveStyle === !0 ? r.jump(i) : r.hasAnimated || r.set(i);
      } else {
        const r = t.getStaticValue(s);
        t.addValue(s, vt(r !== void 0 ? r : i, { owner: t }));
      }
  }
  for (const s in n)
    e[s] === void 0 && t.removeValue(s);
  return e;
}
const Es = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class rl {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(e, n, s) {
    return {};
  }
  constructor({ parent: e, props: n, presenceContext: s, reducedMotionConfig: i, blockInitialAnimation: o, visualState: r }, a = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = Cn, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const f = N.now();
      this.renderScheduledAt < f && (this.renderScheduledAt = f, D.render(this.render, !1, !0));
    };
    const { latestValues: c, renderState: u } = r;
    this.latestValues = c, this.baseTarget = { ...c }, this.initialValues = n.initial ? { ...c } : {}, this.renderState = u, this.parent = e, this.props = n, this.presenceContext = s, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = i, this.options = a, this.blockInitialAnimation = !!o, this.isControllingVariants = de(n), this.isVariantNode = cr(n), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
    const { willChange: l, ...h } = this.scrapeMotionValuesFromProps(n, {}, this);
    for (const f in h) {
      const d = h[f];
      c[f] !== void 0 && V(d) && d.set(c[f]);
    }
  }
  mount(e) {
    var n;
    this.current = e, sl.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((s, i) => this.bindToMotionValue(i, s)), wr.current || nl(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : Ue.current, (n = this.parent) == null || n.addChild(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    var e;
    this.projection && this.projection.unmount(), nt(this.notifyUpdate), nt(this.render), this.valueSubscriptions.forEach((n) => n()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), (e = this.parent) == null || e.removeChild(this);
    for (const n in this.events)
      this.events[n].clear();
    for (const n in this.features) {
      const s = this.features[n];
      s && (s.unmount(), s.isMounted = !1);
    }
    this.current = null;
  }
  addChild(e) {
    this.children.add(e), this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set()), this.enteringChildren.add(e);
  }
  removeChild(e) {
    this.children.delete(e), this.enteringChildren && this.enteringChildren.delete(e);
  }
  bindToMotionValue(e, n) {
    this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)();
    const s = It.has(e);
    s && this.onBindTransform && this.onBindTransform();
    const i = n.on("change", (r) => {
      this.latestValues[e] = r, this.props.onUpdate && D.preRender(this.notifyUpdate), s && this.projection && (this.projection.isTransformDirty = !0), this.scheduleRender();
    });
    let o;
    window.MotionCheckAppearSync && (o = window.MotionCheckAppearSync(this, e, n)), this.valueSubscriptions.set(e, () => {
      i(), o && o(), n.owner && n.stop();
    });
  }
  sortNodePosition(e) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== e.type ? 0 : this.sortInstanceNodePosition(this.current, e.current);
  }
  updateFeatures() {
    let e = "animation";
    for (e in Et) {
      const n = Et[e];
      if (!n)
        continue;
      const { isEnabled: s, Feature: i } = n;
      if (!this.features[e] && i && s(this.props) && (this.features[e] = new i(this)), this.features[e]) {
        const o = this.features[e];
        o.isMounted ? o.update() : (o.mount(), o.isMounted = !0);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : Q();
  }
  getStaticValue(e) {
    return this.latestValues[e];
  }
  setStaticValue(e, n) {
    this.latestValues[e] = n;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(e, n) {
    (e.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = e, this.prevPresenceContext = this.presenceContext, this.presenceContext = n;
    for (let s = 0; s < Es.length; s++) {
      const i = Es[s];
      this.propEventSubscriptions[i] && (this.propEventSubscriptions[i](), delete this.propEventSubscriptions[i]);
      const o = "on" + i, r = e[o];
      r && (this.propEventSubscriptions[i] = this.on(i, r));
    }
    this.prevMotionValues = il(this, this.scrapeMotionValuesFromProps(e, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(e) {
    return this.props.variants ? this.props.variants[e] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(e) {
    const n = this.getClosestVariantNode();
    if (n)
      return n.variantChildren && n.variantChildren.add(e), () => n.variantChildren.delete(e);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(e, n) {
    const s = this.values.get(e);
    n !== s && (s && this.removeValue(e), this.bindToMotionValue(e, n), this.values.set(e, n), this.latestValues[e] = n.get());
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(e) {
    this.values.delete(e);
    const n = this.valueSubscriptions.get(e);
    n && (n(), this.valueSubscriptions.delete(e)), delete this.latestValues[e], this.removeValueFromRenderState(e, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(e) {
    return this.values.has(e);
  }
  getValue(e, n) {
    if (this.props.values && this.props.values[e])
      return this.props.values[e];
    let s = this.values.get(e);
    return s === void 0 && n !== void 0 && (s = vt(n === null ? void 0 : n, { owner: this }), this.addValue(e, s)), s;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(e, n) {
    let s = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options);
    return s != null && (typeof s == "string" && (pi(s) || yi(s)) ? s = parseFloat(s) : !dc(s) && st.test(n) && (s = _i(e, n)), this.setBaseTarget(e, V(s) ? s.get() : s)), V(s) ? s.get() : s;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(e, n) {
    this.baseTarget[e] = n;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(e) {
    var o;
    const { initial: n } = this.props;
    let s;
    if (typeof n == "string" || typeof n == "object") {
      const r = Qn(this.props, n, (o = this.presenceContext) == null ? void 0 : o.custom);
      r && (s = r[e]);
    }
    if (n && s !== void 0)
      return s;
    const i = this.getBaseTargetFromProps(this.props, e);
    return i !== void 0 && !V(i) ? i : this.initialValues[e] !== void 0 && s === void 0 ? void 0 : this.baseTarget[e];
  }
  on(e, n) {
    return this.events[e] || (this.events[e] = new ln()), this.events[e].add(n);
  }
  notify(e, ...n) {
    this.events[e] && this.events[e].notify(...n);
  }
  scheduleRenderMicrotask() {
    In.render(this.render);
  }
}
class Ir extends rl {
  constructor() {
    super(...arguments), this.KeyframeResolver = ec;
  }
  sortInstanceNodePosition(e, n) {
    return e.compareDocumentPosition(n) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(e, n) {
    return e.style ? e.style[n] : void 0;
  }
  removeValueFromRenderState(e, { vars: n, style: s }) {
    delete n[e], delete s[e];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: e } = this.props;
    V(e) && (this.childSubscription = e.on("change", (n) => {
      this.current && (this.current.textContent = `${n}`);
    }));
  }
}
function br(t, { style: e, vars: n }, s, i) {
  const o = t.style;
  let r;
  for (r in e)
    o[r] = e[r];
  i == null || i.applyProjectionStyles(o, s);
  for (r in n)
    o.setProperty(r, n[r]);
}
function ol(t) {
  return window.getComputedStyle(t);
}
class al extends Ir {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = br;
  }
  readValueFromInstance(e, n) {
    var s;
    if (It.has(n))
      return (s = this.projection) != null && s.isProjecting ? Le(n) : Ea(e, n);
    {
      const i = ol(e), o = (fn(n) ? i.getPropertyValue(n) : i[n]) || 0;
      return typeof o == "string" ? o.trim() : o;
    }
  }
  measureInstanceViewportBox(e, { transformPagePoint: n }) {
    return xr(e, n);
  }
  build(e, n, s) {
    Dn(e, n, s.transformTemplate);
  }
  scrapeMotionValuesFromProps(e, n, s) {
    return Mn(e, n, s);
  }
}
const Pr = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]);
function cl(t, e, n, s) {
  br(t, e, void 0, s);
  for (const i in e.attrs)
    t.setAttribute(Pr.has(i) ? i : kn(i), e.attrs[i]);
}
class ll extends Ir {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = Q;
  }
  getBaseTargetFromProps(e, n) {
    return e[n];
  }
  readValueFromInstance(e, n) {
    if (It.has(n)) {
      const s = qi(n);
      return s && s.default || 0;
    }
    return n = Pr.has(n) ? n : kn(n), e.getAttribute(n);
  }
  scrapeMotionValuesFromProps(e, n, s) {
    return pr(e, n, s);
  }
  build(e, n, s) {
    hr(e, n, this.isSVGTag, s.transformTemplate, s.style);
  }
  renderInstance(e, n, s, i) {
    cl(e, n, s, i);
  }
  mount(e) {
    this.isSVGTag = dr(e.tagName), super.mount(e);
  }
}
const ul = (t, e) => Tn(t) ? new ll(e) : new al(e, {
  allowProjection: t !== y.Fragment
});
function At(t, e, n) {
  const s = t.getProps();
  return Qn(s, e, n !== void 0 ? n : s.custom, t);
}
const We = (t) => Array.isArray(t);
function hl(t, e, n) {
  t.hasValue(e) ? t.getValue(e).set(n) : t.addValue(e, vt(n));
}
function fl(t) {
  return We(t) ? t[t.length - 1] || 0 : t;
}
function dl(t, e) {
  const n = At(t, e);
  let { transitionEnd: s = {}, transition: i = {}, ...o } = n || {};
  o = { ...o, ...s };
  for (const r in o) {
    const a = fl(o[r]);
    hl(t, r, a);
  }
}
function ml(t) {
  return !!(V(t) && t.add);
}
function Ge(t, e) {
  const n = t.getValue("willChange");
  if (ml(n))
    return n.add(e);
  if (!n && $.WillChange) {
    const s = new $.WillChange("auto");
    t.addValue("willChange", s), s.add(e);
  }
}
function Sr(t) {
  return t.props[gr];
}
const pl = (t) => t !== null;
function gl(t, { repeat: e, repeatType: n = "loop" }, s) {
  const i = t.filter(pl), o = e && n !== "loop" && e % 2 === 1 ? 0 : i.length - 1;
  return i[o];
}
const yl = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, Al = (t) => ({
  type: "spring",
  stiffness: 550,
  damping: t === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), vl = {
  type: "keyframes",
  duration: 0.8
}, El = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, Cl = (t, { keyframes: e }) => e.length > 2 ? vl : It.has(t) ? t.startsWith("scale") ? Al(e[1]) : yl : El;
function xl({ when: t, delay: e, delayChildren: n, staggerChildren: s, staggerDirection: i, repeat: o, repeatType: r, repeatDelay: a, from: c, elapsed: u, ...l }) {
  return !!Object.keys(l).length;
}
const jn = (t, e, n, s = {}, i, o) => (r) => {
  const a = xn(s, t) || {}, c = a.delay || s.delay || 0;
  let { elapsed: u = 0 } = s;
  u = u - /* @__PURE__ */ K(c);
  const l = {
    keyframes: Array.isArray(n) ? n : [null, n],
    ease: "easeOut",
    velocity: e.getVelocity(),
    ...a,
    delay: -u,
    onUpdate: (f) => {
      e.set(f), a.onUpdate && a.onUpdate(f);
    },
    onComplete: () => {
      r(), a.onComplete && a.onComplete();
    },
    name: t,
    motionValue: e,
    element: o ? void 0 : i
  };
  xl(a) || Object.assign(l, Cl(t, l)), l.duration && (l.duration = /* @__PURE__ */ K(l.duration)), l.repeatDelay && (l.repeatDelay = /* @__PURE__ */ K(l.repeatDelay)), l.from !== void 0 && (l.keyframes[0] = l.from);
  let h = !1;
  if ((l.type === !1 || l.duration === 0 && !l.repeatDelay) && (Ne(l), l.delay === 0 && (h = !0)), ($.instantAnimations || $.skipAnimations) && (h = !0, Ne(l), l.delay = 0), l.allowFlatten = !a.type && !a.ease, h && !o && e.get() !== void 0) {
    const f = gl(l.keyframes, a);
    if (f !== void 0) {
      D.update(() => {
        l.onUpdate(f), l.onComplete();
      });
      return;
    }
  }
  return a.isSync ? new En(l) : new Xa(l);
};
function wl({ protectedKeys: t, needsAnimating: e }, n) {
  const s = t.hasOwnProperty(n) && e[n] !== !0;
  return e[n] = !1, s;
}
function Br(t, e, { delay: n = 0, transitionOverride: s, type: i } = {}) {
  let { transition: o = t.getDefaultTransition(), transitionEnd: r, ...a } = e;
  s && (o = s);
  const c = [], u = i && t.animationState && t.animationState.getState()[i];
  for (const l in a) {
    const h = t.getValue(l, t.latestValues[l] ?? null), f = a[l];
    if (f === void 0 || u && wl(u, l))
      continue;
    const d = {
      delay: n,
      ...xn(o || {}, l)
    }, p = h.get();
    if (p !== void 0 && !h.isAnimating && !Array.isArray(f) && f === p && !d.velocity)
      continue;
    let g = !1;
    if (window.MotionHandoffAnimation) {
      const A = Sr(t);
      if (A) {
        const C = window.MotionHandoffAnimation(A, l, D);
        C !== null && (d.startTime = C, g = !0);
      }
    }
    Ge(t, l), h.start(jn(l, h, f, t.shouldReduceMotion && Ki.has(l) ? { type: !1 } : d, t, g));
    const v = h.animation;
    v && c.push(v);
  }
  return r && Promise.all(c).then(() => {
    D.update(() => {
      r && dl(t, r);
    });
  }), c;
}
function Dr(t, e, n, s = 0, i = 1) {
  const o = Array.from(t).sort((u, l) => u.sortNodePosition(l)).indexOf(e), r = t.size, a = (r - 1) * s;
  return typeof n == "function" ? n(o, r) : i === 1 ? o * s : a - o * s;
}
function Ke(t, e, n = {}) {
  var c;
  const s = At(t, e, n.type === "exit" ? (c = t.presenceContext) == null ? void 0 : c.custom : void 0);
  let { transition: i = t.getDefaultTransition() || {} } = s || {};
  n.transitionOverride && (i = n.transitionOverride);
  const o = s ? () => Promise.all(Br(t, s, n)) : () => Promise.resolve(), r = t.variantChildren && t.variantChildren.size ? (u = 0) => {
    const { delayChildren: l = 0, staggerChildren: h, staggerDirection: f } = i;
    return Il(t, e, u, l, h, f, n);
  } : () => Promise.resolve(), { when: a } = i;
  if (a) {
    const [u, l] = a === "beforeChildren" ? [o, r] : [r, o];
    return u().then(() => l());
  } else
    return Promise.all([o(), r(n.delay)]);
}
function Il(t, e, n = 0, s = 0, i = 0, o = 1, r) {
  const a = [];
  for (const c of t.variantChildren)
    c.notify("AnimationStart", e), a.push(Ke(c, e, {
      ...r,
      delay: n + (typeof s == "function" ? 0 : s) + Dr(t.variantChildren, c, s, i, o)
    }).then(() => c.notify("AnimationComplete", e)));
  return Promise.all(a);
}
function bl(t, e, n = {}) {
  t.notify("AnimationStart", e);
  let s;
  if (Array.isArray(e)) {
    const i = e.map((o) => Ke(t, o, n));
    s = Promise.all(i);
  } else if (typeof e == "string")
    s = Ke(t, e, n);
  else {
    const i = typeof e == "function" ? At(t, e, n.custom) : e;
    s = Promise.all(Br(t, i, n));
  }
  return s.then(() => {
    t.notify("AnimationComplete", e);
  });
}
function Rr(t, e) {
  if (!Array.isArray(e))
    return !1;
  const n = e.length;
  if (n !== t.length)
    return !1;
  for (let s = 0; s < n; s++)
    if (e[s] !== t[s])
      return !1;
  return !0;
}
const Pl = Bn.length;
function Tr(t) {
  if (!t)
    return;
  if (!t.isControllingVariants) {
    const n = t.parent ? Tr(t.parent) || {} : {};
    return t.props.initial !== void 0 && (n.initial = t.props.initial), n;
  }
  const e = {};
  for (let n = 0; n < Pl; n++) {
    const s = Bn[n], i = t.props[s];
    (Vt(i) || i === !1) && (e[s] = i);
  }
  return e;
}
const Sl = [...Sn].reverse(), Bl = Sn.length;
function Dl(t) {
  return (e) => Promise.all(e.map(({ animation: n, options: s }) => bl(t, n, s)));
}
function Rl(t) {
  let e = Dl(t), n = Cs(), s = !0;
  const i = (c) => (u, l) => {
    var f;
    const h = At(t, l, c === "exit" ? (f = t.presenceContext) == null ? void 0 : f.custom : void 0);
    if (h) {
      const { transition: d, transitionEnd: p, ...g } = h;
      u = { ...u, ...g, ...p };
    }
    return u;
  };
  function o(c) {
    e = c(t);
  }
  function r(c) {
    const { props: u } = t, l = Tr(t.parent) || {}, h = [], f = /* @__PURE__ */ new Set();
    let d = {}, p = 1 / 0;
    for (let v = 0; v < Bl; v++) {
      const A = Sl[v], C = n[A], E = u[A] !== void 0 ? u[A] : l[A], I = Vt(E), x = A === c ? C.isActive : null;
      x === !1 && (p = v);
      let P = E === l[A] && E !== u[A] && I;
      if (P && s && t.manuallyAnimateOnMount && (P = !1), C.protectedKeys = { ...d }, // If it isn't active and hasn't *just* been set as inactive
      !C.isActive && x === null || // If we didn't and don't have any defined prop for this animation type
      !E && !C.prevProp || // Or if the prop doesn't define an animation
      fe(E) || typeof E == "boolean")
        continue;
      const B = Tl(C.prevProp, E);
      let b = B || // If we're making this variant active, we want to always make it active
      A === c && C.isActive && !P && I || // If we removed a higher-priority variant (i is in reverse order)
      v > p && I, k = !1;
      const F = Array.isArray(E) ? E : [E];
      let tt = F.reduce(i(A), {});
      x === !1 && (tt = {});
      const { prevResolvedValues: Vn = {} } = C, Kr = {
        ...Vn,
        ...tt
      }, Fn = (j) => {
        b = !0, f.has(j) && (k = !0, f.delete(j)), C.needsAnimating[j] = !0;
        const z = t.getValue(j);
        z && (z.liveStyle = !1);
      };
      for (const j in Kr) {
        const z = tt[j], rt = Vn[j];
        if (d.hasOwnProperty(j))
          continue;
        let ft = !1;
        We(z) && We(rt) ? ft = !Rr(z, rt) : ft = z !== rt, ft ? z != null ? Fn(j) : f.add(j) : z !== void 0 && f.has(j) ? Fn(j) : C.protectedKeys[j] = !0;
      }
      C.prevProp = E, C.prevResolvedValues = tt, C.isActive && (d = { ...d, ...tt }), s && t.blockInitialAnimation && (b = !1);
      const Hn = P && B;
      b && (!Hn || k) && h.push(...F.map((j) => {
        const z = { type: A };
        if (typeof j == "string" && s && !Hn && t.manuallyAnimateOnMount && t.parent) {
          const { parent: rt } = t, ft = At(rt, j);
          if (rt.enteringChildren && ft) {
            const { delayChildren: Jr } = ft.transition || {};
            z.delay = Dr(rt.enteringChildren, t, Jr);
          }
        }
        return {
          animation: j,
          options: z
        };
      }));
    }
    if (f.size) {
      const v = {};
      if (typeof u.initial != "boolean") {
        const A = At(t, Array.isArray(u.initial) ? u.initial[0] : u.initial);
        A && A.transition && (v.transition = A.transition);
      }
      f.forEach((A) => {
        const C = t.getBaseTarget(A), E = t.getValue(A);
        E && (E.liveStyle = !0), v[A] = C ?? null;
      }), h.push({ animation: v });
    }
    let g = !!h.length;
    return s && (u.initial === !1 || u.initial === u.animate) && !t.manuallyAnimateOnMount && (g = !1), s = !1, g ? e(h) : Promise.resolve();
  }
  function a(c, u) {
    var h;
    if (n[c].isActive === u)
      return Promise.resolve();
    (h = t.variantChildren) == null || h.forEach((f) => {
      var d;
      return (d = f.animationState) == null ? void 0 : d.setActive(c, u);
    }), n[c].isActive = u;
    const l = r(c);
    for (const f in n)
      n[f].protectedKeys = {};
    return l;
  }
  return {
    animateChanges: r,
    setActive: a,
    setAnimateFunction: o,
    getState: () => n,
    reset: () => {
      n = Cs(), s = !0;
    }
  };
}
function Tl(t, e) {
  return typeof e == "string" ? e !== t : Array.isArray(e) ? !Rr(e, t) : !1;
}
function ot(t = !1) {
  return {
    isActive: t,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function Cs() {
  return {
    animate: ot(!0),
    whileInView: ot(),
    whileHover: ot(),
    whileTap: ot(),
    whileDrag: ot(),
    whileFocus: ot(),
    exit: ot()
  };
}
class it {
  constructor(e) {
    this.isMounted = !1, this.node = e;
  }
  update() {
  }
}
class Ql extends it {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(e) {
    super(e), e.animationState || (e.animationState = Rl(e));
  }
  updateAnimationControlsSubscription() {
    const { animate: e } = this.node.getProps();
    fe(e) && (this.unmountControls = e.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: e } = this.node.getProps(), { animate: n } = this.node.prevProps || {};
    e !== n && this.updateAnimationControlsSubscription();
  }
  unmount() {
    var e;
    this.node.animationState.reset(), (e = this.unmountControls) == null || e.call(this);
  }
}
let Ml = 0;
class kl extends it {
  constructor() {
    super(...arguments), this.id = Ml++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent: e, onExitComplete: n } = this.node.presenceContext, { isPresent: s } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || e === s)
      return;
    const i = this.node.animationState.setActive("exit", !e);
    n && !e && i.then(() => {
      n(this.id);
    });
  }
  mount() {
    const { register: e, onExitComplete: n } = this.node.presenceContext || {};
    n && n(this.id), e && (this.unmount = e(this.id));
  }
  unmount() {
  }
}
const jl = {
  animation: {
    Feature: Ql
  },
  exit: {
    Feature: kl
  }
};
function Ht(t, e, n, s = { passive: !0 }) {
  return t.addEventListener(e, n, s), () => t.removeEventListener(e, n);
}
function Yt(t) {
  return {
    point: {
      x: t.pageX,
      y: t.pageY
    }
  };
}
const Ll = (t) => (e) => bn(e) && t(e, Yt(e));
function Tt(t, e, n, s) {
  return Ht(t, e, Ll(n), s);
}
const Qr = 1e-4, Vl = 1 - Qr, Fl = 1 + Qr, Mr = 0.01, Hl = 0 - Mr, Ol = 0 + Mr;
function H(t) {
  return t.max - t.min;
}
function Nl(t, e, n) {
  return Math.abs(t - e) <= n;
}
function xs(t, e, n, s = 0.5) {
  t.origin = s, t.originPoint = R(e.min, e.max, t.origin), t.scale = H(n) / H(e), t.translate = R(n.min, n.max, t.origin) - t.originPoint, (t.scale >= Vl && t.scale <= Fl || isNaN(t.scale)) && (t.scale = 1), (t.translate >= Hl && t.translate <= Ol || isNaN(t.translate)) && (t.translate = 0);
}
function Qt(t, e, n, s) {
  xs(t.x, e.x, n.x, s ? s.originX : void 0), xs(t.y, e.y, n.y, s ? s.originY : void 0);
}
function ws(t, e, n) {
  t.min = n.min + e.min, t.max = t.min + H(e);
}
function zl(t, e, n) {
  ws(t.x, e.x, n.x), ws(t.y, e.y, n.y);
}
function Is(t, e, n) {
  t.min = e.min - n.min, t.max = t.min + H(e);
}
function Mt(t, e, n) {
  Is(t.x, e.x, n.x), Is(t.y, e.y, n.y);
}
function Y(t) {
  return [t("x"), t("y")];
}
const kr = ({ current: t }) => t ? t.ownerDocument.defaultView : null, bs = (t, e) => Math.abs(t - e);
function Xl(t, e) {
  const n = bs(t.x, e.x), s = bs(t.y, e.y);
  return Math.sqrt(n ** 2 + s ** 2);
}
class jr {
  constructor(e, n, { transformPagePoint: s, contextWindow: i = window, dragSnapToOrigin: o = !1, distanceThreshold: r = 3 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const f = Ie(this.lastMoveEventInfo, this.history), d = this.startEvent !== null, p = Xl(f.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!d && !p)
        return;
      const { point: g } = f, { timestamp: v } = L;
      this.history.push({ ...g, timestamp: v });
      const { onStart: A, onMove: C } = this.handlers;
      d || (A && A(this.lastMoveEvent, f), this.startEvent = this.lastMoveEvent), C && C(this.lastMoveEvent, f);
    }, this.handlePointerMove = (f, d) => {
      this.lastMoveEvent = f, this.lastMoveEventInfo = we(d, this.transformPagePoint), D.update(this.updatePoint, !0);
    }, this.handlePointerUp = (f, d) => {
      this.end();
      const { onEnd: p, onSessionEnd: g, resumeAnimation: v } = this.handlers;
      if (this.dragSnapToOrigin && v && v(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const A = Ie(f.type === "pointercancel" ? this.lastMoveEventInfo : we(d, this.transformPagePoint), this.history);
      this.startEvent && p && p(f, A), g && g(f, A);
    }, !bn(e))
      return;
    this.dragSnapToOrigin = o, this.handlers = n, this.transformPagePoint = s, this.distanceThreshold = r, this.contextWindow = i || window;
    const a = Yt(e), c = we(a, this.transformPagePoint), { point: u } = c, { timestamp: l } = L;
    this.history = [{ ...u, timestamp: l }];
    const { onSessionStart: h } = n;
    h && h(e, Ie(c, this.history)), this.removeListeners = Nt(Tt(this.contextWindow, "pointermove", this.handlePointerMove), Tt(this.contextWindow, "pointerup", this.handlePointerUp), Tt(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(e) {
    this.handlers = e;
  }
  end() {
    this.removeListeners && this.removeListeners(), nt(this.updatePoint);
  }
}
function we(t, e) {
  return e ? { point: e(t.point) } : t;
}
function Ps(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function Ie({ point: t }, e) {
  return {
    point: t,
    delta: Ps(t, Lr(e)),
    offset: Ps(t, Yl(e)),
    velocity: Ul(e, 0.1)
  };
}
function Yl(t) {
  return t[0];
}
function Lr(t) {
  return t[t.length - 1];
}
function Ul(t, e) {
  if (t.length < 2)
    return { x: 0, y: 0 };
  let n = t.length - 1, s = null;
  const i = Lr(t);
  for (; n >= 0 && (s = t[n], !(i.timestamp - s.timestamp > /* @__PURE__ */ K(e))); )
    n--;
  if (!s)
    return { x: 0, y: 0 };
  const o = /* @__PURE__ */ U(i.timestamp - s.timestamp);
  if (o === 0)
    return { x: 0, y: 0 };
  const r = {
    x: (i.x - s.x) / o,
    y: (i.y - s.y) / o
  };
  return r.x === 1 / 0 && (r.x = 0), r.y === 1 / 0 && (r.y = 0), r;
}
function Wl(t, { min: e, max: n }, s) {
  return e !== void 0 && t < e ? t = s ? R(e, t, s.min) : Math.max(t, e) : n !== void 0 && t > n && (t = s ? R(n, t, s.max) : Math.min(t, n)), t;
}
function Ss(t, e, n) {
  return {
    min: e !== void 0 ? t.min + e : void 0,
    max: n !== void 0 ? t.max + n - (t.max - t.min) : void 0
  };
}
function Gl(t, { top: e, left: n, bottom: s, right: i }) {
  return {
    x: Ss(t.x, n, i),
    y: Ss(t.y, e, s)
  };
}
function Bs(t, e) {
  let n = e.min - t.min, s = e.max - t.max;
  return e.max - e.min < t.max - t.min && ([n, s] = [s, n]), { min: n, max: s };
}
function Kl(t, e) {
  return {
    x: Bs(t.x, e.x),
    y: Bs(t.y, e.y)
  };
}
function Jl(t, e) {
  let n = 0.5;
  const s = H(t), i = H(e);
  return i > s ? n = /* @__PURE__ */ kt(e.min, e.max - s, t.min) : s > i && (n = /* @__PURE__ */ kt(t.min, t.max - i, e.min)), _(0, 1, n);
}
function Zl(t, e) {
  const n = {};
  return e.min !== void 0 && (n.min = e.min - t.min), e.max !== void 0 && (n.max = e.max - t.min), n;
}
const Je = 0.35;
function ql(t = Je) {
  return t === !1 ? t = 0 : t === !0 && (t = Je), {
    x: Ds(t, "left", "right"),
    y: Ds(t, "top", "bottom")
  };
}
function Ds(t, e, n) {
  return {
    min: Rs(t, e),
    max: Rs(t, n)
  };
}
function Rs(t, e) {
  return typeof t == "number" ? t : t[e] || 0;
}
const _l = /* @__PURE__ */ new WeakMap();
class $l {
  constructor(e) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = Q(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = e;
  }
  start(e, { snapToCursor: n = !1, distanceThreshold: s } = {}) {
    const { presenceContext: i } = this.visualElement;
    if (i && i.isPresent === !1)
      return;
    const o = (h) => {
      const { dragSnapToOrigin: f } = this.getProps();
      f ? this.pauseAnimation() : this.stopAnimation(), n && this.snapToCursor(Yt(h).point);
    }, r = (h, f) => {
      const { drag: d, dragPropagation: p, onDragStart: g } = this.getProps();
      if (d && !p && (this.openDragLock && this.openDragLock(), this.openDragLock = rc(d), !this.openDragLock))
        return;
      this.latestPointerEvent = h, this.latestPanInfo = f, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), Y((A) => {
        let C = this.getAxisMotionValue(A).get() || 0;
        if (J.test(C)) {
          const { projection: E } = this.visualElement;
          if (E && E.layout) {
            const I = E.layout.layoutBox[A];
            I && (C = H(I) * (parseFloat(C) / 100));
          }
        }
        this.originPoint[A] = C;
      }), g && D.postRender(() => g(h, f)), Ge(this.visualElement, "transform");
      const { animationState: v } = this.visualElement;
      v && v.setActive("whileDrag", !0);
    }, a = (h, f) => {
      this.latestPointerEvent = h, this.latestPanInfo = f;
      const { dragPropagation: d, dragDirectionLock: p, onDirectionLock: g, onDrag: v } = this.getProps();
      if (!d && !this.openDragLock)
        return;
      const { offset: A } = f;
      if (p && this.currentDirection === null) {
        this.currentDirection = tu(A), this.currentDirection !== null && g && g(this.currentDirection);
        return;
      }
      this.updateAxis("x", f.point, A), this.updateAxis("y", f.point, A), this.visualElement.render(), v && v(h, f);
    }, c = (h, f) => {
      this.latestPointerEvent = h, this.latestPanInfo = f, this.stop(h, f), this.latestPointerEvent = null, this.latestPanInfo = null;
    }, u = () => Y((h) => {
      var f;
      return this.getAnimationState(h) === "paused" && ((f = this.getAxisMotionValue(h).animation) == null ? void 0 : f.play());
    }), { dragSnapToOrigin: l } = this.getProps();
    this.panSession = new jr(e, {
      onSessionStart: o,
      onStart: r,
      onMove: a,
      onSessionEnd: c,
      resumeAnimation: u
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: l,
      distanceThreshold: s,
      contextWindow: kr(this.visualElement)
    });
  }
  /**
   * @internal
   */
  stop(e, n) {
    const s = e || this.latestPointerEvent, i = n || this.latestPanInfo, o = this.isDragging;
    if (this.cancel(), !o || !i || !s)
      return;
    const { velocity: r } = i;
    this.startAnimation(r);
    const { onDragEnd: a } = this.getProps();
    a && D.postRender(() => a(s, i));
  }
  /**
   * @internal
   */
  cancel() {
    this.isDragging = !1;
    const { projection: e, animationState: n } = this.visualElement;
    e && (e.isAnimationBlocked = !1), this.panSession && this.panSession.end(), this.panSession = void 0;
    const { dragPropagation: s } = this.getProps();
    !s && this.openDragLock && (this.openDragLock(), this.openDragLock = null), n && n.setActive("whileDrag", !1);
  }
  updateAxis(e, n, s) {
    const { drag: i } = this.getProps();
    if (!s || !Jt(e, i, this.currentDirection))
      return;
    const o = this.getAxisMotionValue(e);
    let r = this.originPoint[e] + s[e];
    this.constraints && this.constraints[e] && (r = Wl(r, this.constraints[e], this.elastic[e])), o.set(r);
  }
  resolveConstraints() {
    var o;
    const { dragConstraints: e, dragElastic: n } = this.getProps(), s = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (o = this.visualElement.projection) == null ? void 0 : o.layout, i = this.constraints;
    e && mt(e) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : e && s ? this.constraints = Gl(s.layoutBox, e) : this.constraints = !1, this.elastic = ql(n), i !== this.constraints && s && this.constraints && !this.hasMutatedConstraints && Y((r) => {
      this.constraints !== !1 && this.getAxisMotionValue(r) && (this.constraints[r] = Zl(s.layoutBox[r], this.constraints[r]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: e, onMeasureDragConstraints: n } = this.getProps();
    if (!e || !mt(e))
      return !1;
    const s = e.current, { projection: i } = this.visualElement;
    if (!i || !i.layout)
      return !1;
    const o = el(s, i.root, this.visualElement.getTransformPagePoint());
    let r = Kl(i.layout.layoutBox, o);
    if (n) {
      const a = n(_c(r));
      this.hasMutatedConstraints = !!a, a && (r = vr(a));
    }
    return r;
  }
  startAnimation(e) {
    const { drag: n, dragMomentum: s, dragElastic: i, dragTransition: o, dragSnapToOrigin: r, onDragTransitionEnd: a } = this.getProps(), c = this.constraints || {}, u = Y((l) => {
      if (!Jt(l, n, this.currentDirection))
        return;
      let h = c && c[l] || {};
      r && (h = { min: 0, max: 0 });
      const f = i ? 200 : 1e6, d = i ? 40 : 1e7, p = {
        type: "inertia",
        velocity: s ? e[l] : 0,
        bounceStiffness: f,
        bounceDamping: d,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...o,
        ...h
      };
      return this.startAxisValueAnimation(l, p);
    });
    return Promise.all(u).then(a);
  }
  startAxisValueAnimation(e, n) {
    const s = this.getAxisMotionValue(e);
    return Ge(this.visualElement, e), s.start(jn(e, s, 0, n, this.visualElement, !1));
  }
  stopAnimation() {
    Y((e) => this.getAxisMotionValue(e).stop());
  }
  pauseAnimation() {
    Y((e) => {
      var n;
      return (n = this.getAxisMotionValue(e).animation) == null ? void 0 : n.pause();
    });
  }
  getAnimationState(e) {
    var n;
    return (n = this.getAxisMotionValue(e).animation) == null ? void 0 : n.state;
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(e) {
    const n = `_drag${e.toUpperCase()}`, s = this.visualElement.getProps(), i = s[n];
    return i || this.visualElement.getValue(e, (s.initial ? s.initial[e] : void 0) || 0);
  }
  snapToCursor(e) {
    Y((n) => {
      const { drag: s } = this.getProps();
      if (!Jt(n, s, this.currentDirection))
        return;
      const { projection: i } = this.visualElement, o = this.getAxisMotionValue(n);
      if (i && i.layout) {
        const { min: r, max: a } = i.layout.layoutBox[n];
        o.set(e[n] - R(r, a, 0.5));
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: e, dragConstraints: n } = this.getProps(), { projection: s } = this.visualElement;
    if (!mt(n) || !s || !this.constraints)
      return;
    this.stopAnimation();
    const i = { x: 0, y: 0 };
    Y((r) => {
      const a = this.getAxisMotionValue(r);
      if (a && this.constraints !== !1) {
        const c = a.get();
        i[r] = Jl({ min: c, max: c }, this.constraints[r]);
      }
    });
    const { transformTemplate: o } = this.visualElement.getProps();
    this.visualElement.current.style.transform = o ? o({}, "") : "none", s.root && s.root.updateScroll(), s.updateLayout(), this.resolveConstraints(), Y((r) => {
      if (!Jt(r, e, null))
        return;
      const a = this.getAxisMotionValue(r), { min: c, max: u } = this.constraints[r];
      a.set(R(c, u, i[r]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    _l.set(this.visualElement, this);
    const e = this.visualElement.current, n = Tt(e, "pointerdown", (c) => {
      const { drag: u, dragListener: l = !0 } = this.getProps();
      u && l && this.start(c);
    }), s = () => {
      const { dragConstraints: c } = this.getProps();
      mt(c) && c.current && (this.constraints = this.resolveRefConstraints());
    }, { projection: i } = this.visualElement, o = i.addEventListener("measure", s);
    i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), D.read(s);
    const r = Ht(window, "resize", () => this.scalePositionWithinConstraints()), a = i.addEventListener("didUpdate", ({ delta: c, hasLayoutChanged: u }) => {
      this.isDragging && u && (Y((l) => {
        const h = this.getAxisMotionValue(l);
        h && (this.originPoint[l] += c[l].translate, h.set(h.get() + c[l].translate));
      }), this.visualElement.render());
    });
    return () => {
      r(), n(), o(), a && a();
    };
  }
  getProps() {
    const e = this.visualElement.getProps(), { drag: n = !1, dragDirectionLock: s = !1, dragPropagation: i = !1, dragConstraints: o = !1, dragElastic: r = Je, dragMomentum: a = !0 } = e;
    return {
      ...e,
      drag: n,
      dragDirectionLock: s,
      dragPropagation: i,
      dragConstraints: o,
      dragElastic: r,
      dragMomentum: a
    };
  }
}
function Jt(t, e, n) {
  return (e === !0 || e === t) && (n === null || n === t);
}
function tu(t, e = 10) {
  let n = null;
  return Math.abs(t.y) > e ? n = "y" : Math.abs(t.x) > e && (n = "x"), n;
}
class eu extends it {
  constructor(e) {
    super(e), this.removeGroupControls = W, this.removeListeners = W, this.controls = new $l(e);
  }
  mount() {
    const { dragControls: e } = this.node.getProps();
    e && (this.removeGroupControls = e.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || W;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const Ts = (t) => (e, n) => {
  t && D.postRender(() => t(e, n));
};
class nu extends it {
  constructor() {
    super(...arguments), this.removePointerDownListener = W;
  }
  onPointerDown(e) {
    this.session = new jr(e, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: kr(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: e, onPanStart: n, onPan: s, onPanEnd: i } = this.node.getProps();
    return {
      onSessionStart: Ts(e),
      onStart: Ts(n),
      onMove: s,
      onEnd: (o, r) => {
        delete this.session, i && D.postRender(() => i(o, r));
      }
    };
  }
  mount() {
    this.removePointerDownListener = Tt(this.node.current, "pointerdown", (e) => this.onPointerDown(e));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
const ee = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: !0,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: !1
};
function Qs(t, e) {
  return e.max === e.min ? 0 : t / (e.max - e.min) * 100;
}
const bt = {
  correct: (t, e) => {
    if (!e.target)
      return t;
    if (typeof t == "string")
      if (w.test(t))
        t = parseFloat(t);
      else
        return t;
    const n = Qs(t, e.target.x), s = Qs(t, e.target.y);
    return `${n}% ${s}%`;
  }
}, su = {
  correct: (t, { treeScale: e, projectionDelta: n }) => {
    const s = t, i = st.parse(t);
    if (i.length > 5)
      return s;
    const o = st.createTransformer(t), r = typeof i[0] != "number" ? 1 : 0, a = n.x.scale * e.x, c = n.y.scale * e.y;
    i[0 + r] /= a, i[1 + r] /= c;
    const u = R(a, c, 0.5);
    return typeof i[2 + r] == "number" && (i[2 + r] /= u), typeof i[3 + r] == "number" && (i[3 + r] /= u), o(i);
  }
};
let be = !1;
class iu extends y.Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: e, layoutGroup: n, switchLayoutGroup: s, layoutId: i } = this.props, { projection: o } = e;
    Pc(ru), o && (n.group && n.group.add(o), s && s.register && i && s.register(o), be && o.root.didUpdate(), o.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), o.setOptions({
      ...o.options,
      onExitComplete: () => this.safeToRemove()
    })), ee.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(e) {
    const { layoutDependency: n, visualElement: s, drag: i, isPresent: o } = this.props, { projection: r } = s;
    return r && (r.isPresent = o, be = !0, i || e.layoutDependency !== n || n === void 0 || e.isPresent !== o ? r.willUpdate() : this.safeToRemove(), e.isPresent !== o && (o ? r.promote() : r.relegate() || D.postRender(() => {
      const a = r.getStack();
      (!a || !a.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: e } = this.props.visualElement;
    e && (e.root.didUpdate(), In.postRender(() => {
      !e.currentAnimation && e.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: e, layoutGroup: n, switchLayoutGroup: s } = this.props, { projection: i } = e;
    be = !0, i && (i.scheduleCheckAfterUnmount(), n && n.group && n.group.remove(i), s && s.deregister && s.deregister(i));
  }
  safeToRemove() {
    const { safeToRemove: e } = this.props;
    e && e();
  }
  render() {
    return null;
  }
}
function Vr(t) {
  const [e, n] = rr(), s = y.useContext(en);
  return m.jsx(iu, { ...t, layoutGroup: s, switchLayoutGroup: y.useContext(yr), isPresent: e, safeToRemove: n });
}
const ru = {
  borderRadius: {
    ...bt,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: bt,
  borderTopRightRadius: bt,
  borderBottomLeftRadius: bt,
  borderBottomRightRadius: bt,
  boxShadow: su
};
function ou(t, e, n) {
  const s = V(t) ? t : vt(t);
  return s.start(jn("", s, e, n)), s.animation;
}
const au = (t, e) => t.depth - e.depth;
class cu {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(e) {
    rn(this.children, e), this.isDirty = !0;
  }
  remove(e) {
    on(this.children, e), this.isDirty = !0;
  }
  forEach(e) {
    this.isDirty && this.children.sort(au), this.isDirty = !1, this.children.forEach(e);
  }
}
function lu(t, e) {
  const n = N.now(), s = ({ timestamp: i }) => {
    const o = i - n;
    o >= e && (nt(s), t(o - e));
  };
  return D.setup(s, !0), () => nt(s);
}
const Fr = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], uu = Fr.length, Ms = (t) => typeof t == "string" ? parseFloat(t) : t, ks = (t) => typeof t == "number" || w.test(t);
function hu(t, e, n, s, i, o) {
  i ? (t.opacity = R(0, n.opacity ?? 1, fu(s)), t.opacityExit = R(e.opacity ?? 1, 0, du(s))) : o && (t.opacity = R(e.opacity ?? 1, n.opacity ?? 1, s));
  for (let r = 0; r < uu; r++) {
    const a = `border${Fr[r]}Radius`;
    let c = js(e, a), u = js(n, a);
    if (c === void 0 && u === void 0)
      continue;
    c || (c = 0), u || (u = 0), c === 0 || u === 0 || ks(c) === ks(u) ? (t[a] = Math.max(R(Ms(c), Ms(u), s), 0), (J.test(u) || J.test(c)) && (t[a] += "%")) : t[a] = u;
  }
  (e.rotate || n.rotate) && (t.rotate = R(e.rotate || 0, n.rotate || 0, s));
}
function js(t, e) {
  return t[e] !== void 0 ? t[e] : t.borderRadius;
}
const fu = /* @__PURE__ */ Hr(0, 0.5, bi), du = /* @__PURE__ */ Hr(0.5, 0.95, W);
function Hr(t, e, n) {
  return (s) => s < t ? 0 : s > e ? 1 : n(/* @__PURE__ */ kt(t, e, s));
}
function Ls(t, e) {
  t.min = e.min, t.max = e.max;
}
function X(t, e) {
  Ls(t.x, e.x), Ls(t.y, e.y);
}
function Vs(t, e) {
  t.translate = e.translate, t.scale = e.scale, t.originPoint = e.originPoint, t.origin = e.origin;
}
function Fs(t, e, n, s, i) {
  return t -= e, t = ce(t, 1 / n, s), i !== void 0 && (t = ce(t, 1 / i, s)), t;
}
function mu(t, e = 0, n = 1, s = 0.5, i, o = t, r = t) {
  if (J.test(e) && (e = parseFloat(e), e = R(r.min, r.max, e / 100) - r.min), typeof e != "number")
    return;
  let a = R(o.min, o.max, s);
  t === o && (a -= e), t.min = Fs(t.min, e, n, a, i), t.max = Fs(t.max, e, n, a, i);
}
function Hs(t, e, [n, s, i], o, r) {
  mu(t, e[n], e[s], e[i], e.scale, o, r);
}
const pu = ["x", "scaleX", "originX"], gu = ["y", "scaleY", "originY"];
function Os(t, e, n, s) {
  Hs(t.x, e, pu, n ? n.x : void 0, s ? s.x : void 0), Hs(t.y, e, gu, n ? n.y : void 0, s ? s.y : void 0);
}
function Ns(t) {
  return t.translate === 0 && t.scale === 1;
}
function Or(t) {
  return Ns(t.x) && Ns(t.y);
}
function zs(t, e) {
  return t.min === e.min && t.max === e.max;
}
function yu(t, e) {
  return zs(t.x, e.x) && zs(t.y, e.y);
}
function Xs(t, e) {
  return Math.round(t.min) === Math.round(e.min) && Math.round(t.max) === Math.round(e.max);
}
function Nr(t, e) {
  return Xs(t.x, e.x) && Xs(t.y, e.y);
}
function Ys(t) {
  return H(t.x) / H(t.y);
}
function Us(t, e) {
  return t.translate === e.translate && t.scale === e.scale && t.originPoint === e.originPoint;
}
class Au {
  constructor() {
    this.members = [];
  }
  add(e) {
    rn(this.members, e), e.scheduleRender();
  }
  remove(e) {
    if (on(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead) {
      const n = this.members[this.members.length - 1];
      n && this.promote(n);
    }
  }
  relegate(e) {
    const n = this.members.findIndex((i) => e === i);
    if (n === 0)
      return !1;
    let s;
    for (let i = n; i >= 0; i--) {
      const o = this.members[i];
      if (o.isPresent !== !1) {
        s = o;
        break;
      }
    }
    return s ? (this.promote(s), !0) : !1;
  }
  promote(e, n) {
    const s = this.lead;
    if (e !== s && (this.prevLead = s, this.lead = e, e.show(), s)) {
      s.instance && s.scheduleRender(), e.scheduleRender(), e.resumeFrom = s, n && (e.resumeFrom.preserveOpacity = !0), s.snapshot && (e.snapshot = s.snapshot, e.snapshot.latestValues = s.animationValues || s.latestValues), e.root && e.root.isUpdating && (e.isLayoutDirty = !0);
      const { crossfade: i } = e.options;
      i === !1 && s.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((e) => {
      const { options: n, resumingFrom: s } = e;
      n.onExitComplete && n.onExitComplete(), s && s.options.onExitComplete && s.options.onExitComplete();
    });
  }
  scheduleRender() {
    this.members.forEach((e) => {
      e.instance && e.scheduleRender(!1);
    });
  }
  /**
   * Clear any leads that have been removed this render to prevent them from being
   * used in future animations and to prevent memory leaks
   */
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
function vu(t, e, n) {
  let s = "";
  const i = t.x.translate / e.x, o = t.y.translate / e.y, r = (n == null ? void 0 : n.z) || 0;
  if ((i || o || r) && (s = `translate3d(${i}px, ${o}px, ${r}px) `), (e.x !== 1 || e.y !== 1) && (s += `scale(${1 / e.x}, ${1 / e.y}) `), n) {
    const { transformPerspective: u, rotate: l, rotateX: h, rotateY: f, skewX: d, skewY: p } = n;
    u && (s = `perspective(${u}px) ${s}`), l && (s += `rotate(${l}deg) `), h && (s += `rotateX(${h}deg) `), f && (s += `rotateY(${f}deg) `), d && (s += `skewX(${d}deg) `), p && (s += `skewY(${p}deg) `);
  }
  const a = t.x.scale * e.x, c = t.y.scale * e.y;
  return (a !== 1 || c !== 1) && (s += `scale(${a}, ${c})`), s || "none";
}
const Pe = ["", "X", "Y", "Z"], Eu = 1e3;
let Cu = 0;
function Se(t, e, n, s) {
  const { latestValues: i } = e;
  i[t] && (n[t] = i[t], e.setStaticValue(t, 0), s && (s[t] = 0));
}
function zr(t) {
  if (t.hasCheckedOptimisedAppear = !0, t.root === t)
    return;
  const { visualElement: e } = t.options;
  if (!e)
    return;
  const n = Sr(e);
  if (window.MotionHasOptimisedAnimation(n, "transform")) {
    const { layout: i, layoutId: o } = t.options;
    window.MotionCancelOptimisedAnimation(n, "transform", D, !(i || o));
  }
  const { parent: s } = t;
  s && !s.hasCheckedOptimisedAppear && zr(s);
}
function Xr({ attachResizeListener: t, defaultParent: e, measureScroll: n, checkIsScrollRoot: s, resetTransform: i }) {
  return class {
    constructor(r = {}, a = e == null ? void 0 : e()) {
      this.id = Cu++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(Iu), this.nodes.forEach(Bu), this.nodes.forEach(Du), this.nodes.forEach(bu);
      }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = r, this.root = a ? a.root || a : this, this.path = a ? [...a.path, a] : [], this.parent = a, this.depth = a ? a.depth + 1 : 0;
      for (let c = 0; c < this.path.length; c++)
        this.path[c].shouldResetTransform = !0;
      this.root === this && (this.nodes = new cu());
    }
    addEventListener(r, a) {
      return this.eventHandlers.has(r) || this.eventHandlers.set(r, new ln()), this.eventHandlers.get(r).add(a);
    }
    notifyListeners(r, ...a) {
      const c = this.eventHandlers.get(r);
      c && c.notify(...a);
    }
    hasListeners(r) {
      return this.eventHandlers.has(r);
    }
    /**
     * Lifecycles
     */
    mount(r) {
      if (this.instance)
        return;
      this.isSVG = ir(r) && !hc(r), this.instance = r;
      const { layoutId: a, layout: c, visualElement: u } = this.options;
      if (u && !u.current && u.mount(r), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (c || a) && (this.isLayoutDirty = !0), t) {
        let l, h = 0;
        const f = () => this.root.updateBlockedByResize = !1;
        D.read(() => {
          h = window.innerWidth;
        }), t(r, () => {
          const d = window.innerWidth;
          d !== h && (h = d, this.root.updateBlockedByResize = !0, l && l(), l = lu(f, 250), ee.hasAnimatedSinceResize && (ee.hasAnimatedSinceResize = !1, this.nodes.forEach(Ks)));
        });
      }
      a && this.root.registerSharedNode(a, this), this.options.animate !== !1 && u && (a || c) && this.addEventListener("didUpdate", ({ delta: l, hasLayoutChanged: h, hasRelativeLayoutChanged: f, layout: d }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const p = this.options.transition || u.getDefaultTransition() || ku, { onLayoutAnimationStart: g, onLayoutAnimationComplete: v } = u.getProps(), A = !this.targetLayout || !Nr(this.targetLayout, d), C = !h && f;
        if (this.options.layoutRoot || this.resumeFrom || C || h && (A || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
          const E = {
            ...xn(p, "layout"),
            onPlay: g,
            onComplete: v
          };
          (u.shouldReduceMotion || this.options.layoutRoot) && (E.delay = 0, E.type = !1), this.startAnimation(E), this.setAnimationOrigin(l, C);
        } else
          h || Ks(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = d;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const r = this.getStack();
      r && r.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), nt(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
    }
    // Note: currently only running on root node
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(Ru), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: r } = this.options;
      return r && r.getProps().transformTemplate;
    }
    willUpdate(r = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && zr(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let l = 0; l < this.path.length; l++) {
        const h = this.path[l];
        h.shouldResetTransform = !0, h.updateScroll("snapshot"), h.options.layoutRoot && h.willUpdate(!1);
      }
      const { layoutId: a, layout: c } = this.options;
      if (a === void 0 && !c)
        return;
      const u = this.getTransformTemplate();
      this.prevTransformTemplateValue = u ? u(this.latestValues, "") : void 0, this.updateSnapshot(), r && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(Ws);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(Gs);
        return;
      }
      this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(Su), this.nodes.forEach(xu), this.nodes.forEach(wu)) : this.nodes.forEach(Gs), this.clearAllSnapshots();
      const a = N.now();
      L.delta = _(0, 1e3 / 60, a - L.timestamp), L.timestamp = a, L.isProcessing = !0, pe.update.process(L), pe.preRender.process(L), pe.render.process(L), L.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, In.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(Pu), this.sharedNodes.forEach(Tu);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, D.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      D.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !H(this.snapshot.measuredBox.x) && !H(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let c = 0; c < this.path.length; c++)
          this.path[c].updateScroll();
      const r = this.layout;
      this.layout = this.measure(!1), this.layoutCorrected = Q(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: a } = this.options;
      a && a.notify("LayoutMeasure", this.layout.layoutBox, r ? r.layoutBox : void 0);
    }
    updateScroll(r = "measure") {
      let a = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === r && (a = !1), a && this.instance) {
        const c = s(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: r,
          isRoot: c,
          offset: n(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : c
        };
      }
    }
    resetTransform() {
      if (!i)
        return;
      const r = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, a = this.projectionDelta && !Or(this.projectionDelta), c = this.getTransformTemplate(), u = c ? c(this.latestValues, "") : void 0, l = u !== this.prevTransformTemplateValue;
      r && this.instance && (a || at(this.latestValues) || l) && (i(this.instance, u), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(r = !0) {
      const a = this.measurePageBox();
      let c = this.removeElementScroll(a);
      return r && (c = this.removeTransform(c)), ju(c), {
        animationId: this.root.animationId,
        measuredBox: a,
        layoutBox: c,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      var u;
      const { visualElement: r } = this.options;
      if (!r)
        return Q();
      const a = r.measureViewportBox();
      if (!(((u = this.scroll) == null ? void 0 : u.wasRoot) || this.path.some(Lu))) {
        const { scroll: l } = this.root;
        l && (pt(a.x, l.offset.x), pt(a.y, l.offset.y));
      }
      return a;
    }
    removeElementScroll(r) {
      var c;
      const a = Q();
      if (X(a, r), (c = this.scroll) != null && c.wasRoot)
        return a;
      for (let u = 0; u < this.path.length; u++) {
        const l = this.path[u], { scroll: h, options: f } = l;
        l !== this.root && h && f.layoutScroll && (h.wasRoot && X(a, r), pt(a.x, h.offset.x), pt(a.y, h.offset.y));
      }
      return a;
    }
    applyTransform(r, a = !1) {
      const c = Q();
      X(c, r);
      for (let u = 0; u < this.path.length; u++) {
        const l = this.path[u];
        !a && l.options.layoutScroll && l.scroll && l !== l.root && gt(c, {
          x: -l.scroll.offset.x,
          y: -l.scroll.offset.y
        }), at(l.latestValues) && gt(c, l.latestValues);
      }
      return at(this.latestValues) && gt(c, this.latestValues), c;
    }
    removeTransform(r) {
      const a = Q();
      X(a, r);
      for (let c = 0; c < this.path.length; c++) {
        const u = this.path[c];
        if (!u.instance || !at(u.latestValues))
          continue;
        Xe(u.latestValues) && u.updateSnapshot();
        const l = Q(), h = u.measurePageBox();
        X(l, h), Os(a, u.latestValues, u.snapshot ? u.snapshot.layoutBox : void 0, l);
      }
      return at(this.latestValues) && Os(a, this.latestValues), a;
    }
    setTargetDelta(r) {
      this.targetDelta = r, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(r) {
      this.options = {
        ...this.options,
        ...r,
        crossfade: r.crossfade !== void 0 ? r.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== L.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(r = !1) {
      var f;
      const a = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = a.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = a.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = a.isSharedProjectionDirty);
      const c = !!this.resumingFrom || this !== a;
      if (!(r || c && this.isSharedProjectionDirty || this.isProjectionDirty || (f = this.parent) != null && f.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: l, layoutId: h } = this.options;
      if (!(!this.layout || !(l || h))) {
        if (this.resolvedRelativeTargetAt = L.timestamp, !this.targetDelta && !this.relativeTarget) {
          const d = this.getClosestProjectingParent();
          d && d.layout && this.animationProgress !== 1 ? (this.relativeParent = d, this.forceRelativeParentToResolveTarget(), this.relativeTarget = Q(), this.relativeTargetOrigin = Q(), Mt(this.relativeTargetOrigin, this.layout.layoutBox, d.layout.layoutBox), X(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
        if (!(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = Q(), this.targetWithTransforms = Q()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), zl(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : X(this.target, this.layout.layoutBox), Cr(this.target, this.targetDelta)) : X(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget)) {
          this.attemptToResolveRelativeTarget = !1;
          const d = this.getClosestProjectingParent();
          d && !!d.resumingFrom == !!this.resumingFrom && !d.options.layoutScroll && d.target && this.animationProgress !== 1 ? (this.relativeParent = d, this.forceRelativeParentToResolveTarget(), this.relativeTarget = Q(), this.relativeTargetOrigin = Q(), Mt(this.relativeTargetOrigin, this.target, d.target), X(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || Xe(this.parent.latestValues) || Er(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      var p;
      const r = this.getLead(), a = !!this.resumingFrom || this !== r;
      let c = !0;
      if ((this.isProjectionDirty || (p = this.parent) != null && p.isProjectionDirty) && (c = !1), a && (this.isSharedProjectionDirty || this.isTransformDirty) && (c = !1), this.resolvedRelativeTargetAt === L.timestamp && (c = !1), c)
        return;
      const { layout: u, layoutId: l } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(u || l))
        return;
      X(this.layoutCorrected, this.layout.layoutBox);
      const h = this.treeScale.x, f = this.treeScale.y;
      tl(this.layoutCorrected, this.treeScale, this.path, a), r.layout && !r.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (r.target = r.layout.layoutBox, r.targetWithTransforms = Q());
      const { target: d } = r;
      if (!d) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (Vs(this.prevProjectionDelta.x, this.projectionDelta.x), Vs(this.prevProjectionDelta.y, this.projectionDelta.y)), Qt(this.projectionDelta, this.layoutCorrected, d, this.latestValues), (this.treeScale.x !== h || this.treeScale.y !== f || !Us(this.projectionDelta.x, this.prevProjectionDelta.x) || !Us(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", d));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(r = !0) {
      var a;
      if ((a = this.options.visualElement) == null || a.scheduleRender(), r) {
        const c = this.getStack();
        c && c.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = yt(), this.projectionDelta = yt(), this.projectionDeltaWithTransform = yt();
    }
    setAnimationOrigin(r, a = !1) {
      const c = this.snapshot, u = c ? c.latestValues : {}, l = { ...this.latestValues }, h = yt();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !a;
      const f = Q(), d = c ? c.source : void 0, p = this.layout ? this.layout.source : void 0, g = d !== p, v = this.getStack(), A = !v || v.members.length <= 1, C = !!(g && !A && this.options.crossfade === !0 && !this.path.some(Mu));
      this.animationProgress = 0;
      let E;
      this.mixTargetDelta = (I) => {
        const x = I / 1e3;
        Js(h.x, r.x, x), Js(h.y, r.y, x), this.setTargetDelta(h), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Mt(f, this.layout.layoutBox, this.relativeParent.layout.layoutBox), Qu(this.relativeTarget, this.relativeTargetOrigin, f, x), E && yu(this.relativeTarget, E) && (this.isProjectionDirty = !1), E || (E = Q()), X(E, this.relativeTarget)), g && (this.animationValues = l, hu(l, u, this.latestValues, x, C, A)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = x;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(r) {
      var a, c, u;
      this.notifyListeners("animationStart"), (a = this.currentAnimation) == null || a.stop(), (u = (c = this.resumingFrom) == null ? void 0 : c.currentAnimation) == null || u.stop(), this.pendingAnimation && (nt(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = D.update(() => {
        ee.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = vt(0)), this.currentAnimation = ou(this.motionValue, [0, 1e3], {
          ...r,
          velocity: 0,
          isSync: !0,
          onUpdate: (l) => {
            this.mixTargetDelta(l), r.onUpdate && r.onUpdate(l);
          },
          onStop: () => {
          },
          onComplete: () => {
            r.onComplete && r.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const r = this.getStack();
      r && r.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(Eu), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const r = this.getLead();
      let { targetWithTransforms: a, target: c, layout: u, latestValues: l } = r;
      if (!(!a || !c || !u)) {
        if (this !== r && this.layout && u && Yr(this.options.animationType, this.layout.layoutBox, u.layoutBox)) {
          c = this.target || Q();
          const h = H(this.layout.layoutBox.x);
          c.x.min = r.target.x.min, c.x.max = c.x.min + h;
          const f = H(this.layout.layoutBox.y);
          c.y.min = r.target.y.min, c.y.max = c.y.min + f;
        }
        X(a, c), gt(a, l), Qt(this.projectionDeltaWithTransform, this.layoutCorrected, a, l);
      }
    }
    registerSharedNode(r, a) {
      this.sharedNodes.has(r) || this.sharedNodes.set(r, new Au()), this.sharedNodes.get(r).add(a);
      const u = a.options.initialPromotionConfig;
      a.promote({
        transition: u ? u.transition : void 0,
        preserveFollowOpacity: u && u.shouldPreserveFollowOpacity ? u.shouldPreserveFollowOpacity(a) : void 0
      });
    }
    isLead() {
      const r = this.getStack();
      return r ? r.lead === this : !0;
    }
    getLead() {
      var a;
      const { layoutId: r } = this.options;
      return r ? ((a = this.getStack()) == null ? void 0 : a.lead) || this : this;
    }
    getPrevLead() {
      var a;
      const { layoutId: r } = this.options;
      return r ? (a = this.getStack()) == null ? void 0 : a.prevLead : void 0;
    }
    getStack() {
      const { layoutId: r } = this.options;
      if (r)
        return this.root.sharedNodes.get(r);
    }
    promote({ needsReset: r, transition: a, preserveFollowOpacity: c } = {}) {
      const u = this.getStack();
      u && u.promote(this, c), r && (this.projectionDelta = void 0, this.needsReset = !0), a && this.setOptions({ transition: a });
    }
    relegate() {
      const r = this.getStack();
      return r ? r.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: r } = this.options;
      if (!r)
        return;
      let a = !1;
      const { latestValues: c } = r;
      if ((c.z || c.rotate || c.rotateX || c.rotateY || c.rotateZ || c.skewX || c.skewY) && (a = !0), !a)
        return;
      const u = {};
      c.z && Se("z", r, u, this.animationValues);
      for (let l = 0; l < Pe.length; l++)
        Se(`rotate${Pe[l]}`, r, u, this.animationValues), Se(`skew${Pe[l]}`, r, u, this.animationValues);
      r.render();
      for (const l in u)
        r.setStaticValue(l, u[l]), this.animationValues && (this.animationValues[l] = u[l]);
      r.scheduleRender();
    }
    applyProjectionStyles(r, a) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        r.visibility = "hidden";
        return;
      }
      const c = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = !1, r.visibility = "", r.opacity = "", r.pointerEvents = te(a == null ? void 0 : a.pointerEvents) || "", r.transform = c ? c(this.latestValues, "") : "none";
        return;
      }
      const u = this.getLead();
      if (!this.projectionDelta || !this.layout || !u.target) {
        this.options.layoutId && (r.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, r.pointerEvents = te(a == null ? void 0 : a.pointerEvents) || ""), this.hasProjected && !at(this.latestValues) && (r.transform = c ? c({}, "") : "none", this.hasProjected = !1);
        return;
      }
      r.visibility = "";
      const l = u.animationValues || u.latestValues;
      this.applyTransformsToTarget();
      let h = vu(this.projectionDeltaWithTransform, this.treeScale, l);
      c && (h = c(l, h)), r.transform = h;
      const { x: f, y: d } = this.projectionDelta;
      r.transformOrigin = `${f.origin * 100}% ${d.origin * 100}% 0`, u.animationValues ? r.opacity = u === this ? l.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : l.opacityExit : r.opacity = u === this ? l.opacity !== void 0 ? l.opacity : "" : l.opacityExit !== void 0 ? l.opacityExit : 0;
      for (const p in Ft) {
        if (l[p] === void 0)
          continue;
        const { correct: g, applyTo: v, isCSSVariable: A } = Ft[p], C = h === "none" ? l[p] : g(l[p], u);
        if (v) {
          const E = v.length;
          for (let I = 0; I < E; I++)
            r[v[I]] = C;
        } else
          A ? this.options.visualElement.renderState.vars[p] = C : r[p] = C;
      }
      this.options.layoutId && (r.pointerEvents = u === this ? te(a == null ? void 0 : a.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((r) => {
        var a;
        return (a = r.currentAnimation) == null ? void 0 : a.stop();
      }), this.root.nodes.forEach(Ws), this.root.sharedNodes.clear();
    }
  };
}
function xu(t) {
  t.updateLayout();
}
function wu(t) {
  var n;
  const e = ((n = t.resumeFrom) == null ? void 0 : n.snapshot) || t.snapshot;
  if (t.isLead() && t.layout && e && t.hasListeners("didUpdate")) {
    const { layoutBox: s, measuredBox: i } = t.layout, { animationType: o } = t.options, r = e.source !== t.layout.source;
    o === "size" ? Y((h) => {
      const f = r ? e.measuredBox[h] : e.layoutBox[h], d = H(f);
      f.min = s[h].min, f.max = f.min + d;
    }) : Yr(o, e.layoutBox, s) && Y((h) => {
      const f = r ? e.measuredBox[h] : e.layoutBox[h], d = H(s[h]);
      f.max = f.min + d, t.relativeTarget && !t.currentAnimation && (t.isProjectionDirty = !0, t.relativeTarget[h].max = t.relativeTarget[h].min + d);
    });
    const a = yt();
    Qt(a, s, e.layoutBox);
    const c = yt();
    r ? Qt(c, t.applyTransform(i, !0), e.measuredBox) : Qt(c, s, e.layoutBox);
    const u = !Or(a);
    let l = !1;
    if (!t.resumeFrom) {
      const h = t.getClosestProjectingParent();
      if (h && !h.resumeFrom) {
        const { snapshot: f, layout: d } = h;
        if (f && d) {
          const p = Q();
          Mt(p, e.layoutBox, f.layoutBox);
          const g = Q();
          Mt(g, s, d.layoutBox), Nr(p, g) || (l = !0), h.options.layoutRoot && (t.relativeTarget = g, t.relativeTargetOrigin = p, t.relativeParent = h);
        }
      }
    }
    t.notifyListeners("didUpdate", {
      layout: s,
      snapshot: e,
      delta: c,
      layoutDelta: a,
      hasLayoutChanged: u,
      hasRelativeLayoutChanged: l
    });
  } else if (t.isLead()) {
    const { onExitComplete: s } = t.options;
    s && s();
  }
  t.options.transition = void 0;
}
function Iu(t) {
  t.parent && (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty), t.isSharedProjectionDirty || (t.isSharedProjectionDirty = !!(t.isProjectionDirty || t.parent.isProjectionDirty || t.parent.isSharedProjectionDirty)), t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty));
}
function bu(t) {
  t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = !1;
}
function Pu(t) {
  t.clearSnapshot();
}
function Ws(t) {
  t.clearMeasurements();
}
function Gs(t) {
  t.isLayoutDirty = !1;
}
function Su(t) {
  const { visualElement: e } = t.options;
  e && e.getProps().onBeforeLayoutMeasure && e.notify("BeforeLayoutMeasure"), t.resetTransform();
}
function Ks(t) {
  t.finishAnimation(), t.targetDelta = t.relativeTarget = t.target = void 0, t.isProjectionDirty = !0;
}
function Bu(t) {
  t.resolveTargetDelta();
}
function Du(t) {
  t.calcProjection();
}
function Ru(t) {
  t.resetSkewAndRotation();
}
function Tu(t) {
  t.removeLeadSnapshot();
}
function Js(t, e, n) {
  t.translate = R(e.translate, 0, n), t.scale = R(e.scale, 1, n), t.origin = e.origin, t.originPoint = e.originPoint;
}
function Zs(t, e, n, s) {
  t.min = R(e.min, n.min, s), t.max = R(e.max, n.max, s);
}
function Qu(t, e, n, s) {
  Zs(t.x, e.x, n.x, s), Zs(t.y, e.y, n.y, s);
}
function Mu(t) {
  return t.animationValues && t.animationValues.opacityExit !== void 0;
}
const ku = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, qs = (t) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(t), _s = qs("applewebkit/") && !qs("chrome/") ? Math.round : W;
function $s(t) {
  t.min = _s(t.min), t.max = _s(t.max);
}
function ju(t) {
  $s(t.x), $s(t.y);
}
function Yr(t, e, n) {
  return t === "position" || t === "preserve-aspect" && !Nl(Ys(e), Ys(n), 0.2);
}
function Lu(t) {
  var e;
  return t !== t.root && ((e = t.scroll) == null ? void 0 : e.wasRoot);
}
const Vu = Xr({
  attachResizeListener: (t, e) => Ht(t, "resize", e),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), Be = {
  current: void 0
}, Ur = Xr({
  measureScroll: (t) => ({
    x: t.scrollLeft,
    y: t.scrollTop
  }),
  defaultParent: () => {
    if (!Be.current) {
      const t = new Vu({});
      t.mount(window), t.setOptions({ layoutScroll: !0 }), Be.current = t;
    }
    return Be.current;
  },
  resetTransform: (t, e) => {
    t.style.transform = e !== void 0 ? e : "none";
  },
  checkIsScrollRoot: (t) => window.getComputedStyle(t).position === "fixed"
}), Fu = {
  pan: {
    Feature: nu
  },
  drag: {
    Feature: eu,
    ProjectionNode: Ur,
    MeasureLayout: Vr
  }
};
function ti(t, e, n) {
  const { props: s } = t;
  t.animationState && s.whileHover && t.animationState.setActive("whileHover", n === "Start");
  const i = "onHover" + n, o = s[i];
  o && D.postRender(() => o(e, Yt(e)));
}
class Hu extends it {
  mount() {
    const { current: e } = this.node;
    e && (this.unmount = oc(e, (n, s) => (ti(this.node, s, "Start"), (i) => ti(this.node, i, "End"))));
  }
  unmount() {
  }
}
class Ou extends it {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let e = !1;
    try {
      e = this.node.current.matches(":focus-visible");
    } catch {
      e = !0;
    }
    !e || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = Nt(Ht(this.node.current, "focus", () => this.onFocus()), Ht(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function ei(t, e, n) {
  const { props: s } = t;
  if (t.current instanceof HTMLButtonElement && t.current.disabled)
    return;
  t.animationState && s.whileTap && t.animationState.setActive("whileTap", n === "Start");
  const i = "onTap" + (n === "End" ? "" : n), o = s[i];
  o && D.postRender(() => o(e, Yt(e)));
}
class Nu extends it {
  mount() {
    const { current: e } = this.node;
    e && (this.unmount = uc(e, (n, s) => (ei(this.node, s, "Start"), (i, { success: o }) => ei(this.node, i, o ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {
  }
}
const Ze = /* @__PURE__ */ new WeakMap(), De = /* @__PURE__ */ new WeakMap(), zu = (t) => {
  const e = Ze.get(t.target);
  e && e(t);
}, Xu = (t) => {
  t.forEach(zu);
};
function Yu({ root: t, ...e }) {
  const n = t || document;
  De.has(n) || De.set(n, {});
  const s = De.get(n), i = JSON.stringify(e);
  return s[i] || (s[i] = new IntersectionObserver(Xu, { root: t, ...e })), s[i];
}
function Uu(t, e, n) {
  const s = Yu(e);
  return Ze.set(t, n), s.observe(t), () => {
    Ze.delete(t), s.unobserve(t);
  };
}
const Wu = {
  some: 0,
  all: 1
};
class Gu extends it {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: e = {} } = this.node.getProps(), { root: n, margin: s, amount: i = "some", once: o } = e, r = {
      root: n ? n.current : void 0,
      rootMargin: s,
      threshold: typeof i == "number" ? i : Wu[i]
    }, a = (c) => {
      const { isIntersecting: u } = c;
      if (this.isInView === u || (this.isInView = u, o && !u && this.hasEnteredView))
        return;
      u && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", u);
      const { onViewportEnter: l, onViewportLeave: h } = this.node.getProps(), f = u ? l : h;
      f && f(c);
    };
    return Uu(this.node.current, r, a);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: e, prevProps: n } = this.node;
    ["amount", "margin", "root"].some(Ku(e, n)) && this.startObserver();
  }
  unmount() {
  }
}
function Ku({ viewport: t = {} }, { viewport: e = {} } = {}) {
  return (n) => t[n] !== e[n];
}
const Ju = {
  inView: {
    Feature: Gu
  },
  tap: {
    Feature: Nu
  },
  focus: {
    Feature: Ou
  },
  hover: {
    Feature: Hu
  }
}, Zu = {
  layout: {
    ProjectionNode: Ur,
    MeasureLayout: Vr
  }
}, qu = {
  ...jl,
  ...Ju,
  ...Fu,
  ...Zu
}, Z = /* @__PURE__ */ qc(qu, ul);
function Pt(t, e) {
  const [n, s] = y.useState(() => {
    if (typeof window > "u") return e;
    const i = localStorage.getItem(t);
    return i ? JSON.parse(i) : e;
  });
  return y.useEffect(() => {
    try {
      localStorage.setItem(t, JSON.stringify(n));
    } catch {
    }
  }, [t, n]), [n, s];
}
function _u(t) {
  const e = y.useRef(null);
  y.useEffect(() => {
    if (!t) return;
    const i = () => {
      e.current || (e.current = new (window.AudioContext || window.webkitAudioContext)()), window.removeEventListener("pointerdown", i);
    };
    return window.addEventListener("pointerdown", i, { once: !0 }), () => window.removeEventListener("pointerdown", i);
  }, [t]);
  const n = (i = 660, o = 160) => {
    if (!t) return;
    const r = e.current ?? new (window.AudioContext || window.webkitAudioContext)();
    e.current = r;
    const a = r.createOscillator(), c = r.createGain(), u = r.currentTime;
    a.type = "sine", a.frequency.setValueAtTime(i, u), c.gain.setValueAtTime(1e-4, u), c.gain.exponentialRampToValueAtTime(0.12, u + 0.02), c.gain.exponentialRampToValueAtTime(1e-4, u + o / 1e3), a.connect(c), c.connect(r.destination), a.start(u), a.stop(u + o / 1e3 + 0.02);
  };
  return { play: n, chord: () => {
    n(520, 180), setTimeout(() => n(780, 220), 40);
  } };
}
function ne(...t) {
  return t.filter(Boolean).join(" ");
}
const $u = "https://picsum.photos/seed/aetherbot/80", th = "https://picsum.photos/seed/aetherbanner/800/200";
function eh(t) {
  const e = Math.floor((Date.now() - t) / 1e3);
  if (e < 60) return `${e}s ago`;
  const n = Math.floor(e / 60);
  return n < 60 ? `${n}m ago` : `${Math.floor(n / 60)}h ago`;
}
function nh(t) {
  const e = t.toLowerCase();
  return e.includes("price") || e.includes("cost") ? "Our pricing is usage-based in the MVP. You can tune limits per avatar in Settings → Billing." : e.includes("hello") || e.includes("hi") ? "Hi! 👋 How can I assist you today?" : e.includes("refund") ? "Refunds are processed within 5–7 business days once approved." : e.includes("docs") || e.includes("pdf") ? "You can upload PDFs, Word, CSV and more. We’ll chunk and index them for retrieval." : e.includes("firecrawl") || e.includes("crawl") ? "Firecrawl integration lets you add website content with scheduled re-crawls." : "Got it! I’ll look that up in the knowledge base and get back with a clear answer.";
}
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const sh = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), ih = (t) => t.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, n, s) => s ? s.toUpperCase() : n.toLowerCase()
), ni = (t) => {
  const e = ih(t);
  return e.charAt(0).toUpperCase() + e.slice(1);
}, Wr = (...t) => t.filter((e, n, s) => !!e && e.trim() !== "" && s.indexOf(e) === n).join(" ").trim(), rh = (t) => {
  for (const e in t)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
};
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var oh = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ah = y.forwardRef(
  ({
    color: t = "currentColor",
    size: e = 24,
    strokeWidth: n = 2,
    absoluteStrokeWidth: s,
    className: i = "",
    children: o,
    iconNode: r,
    ...a
  }, c) => y.createElement(
    "svg",
    {
      ref: c,
      ...oh,
      width: e,
      height: e,
      stroke: t,
      strokeWidth: s ? Number(n) * 24 / Number(e) : n,
      className: Wr("lucide", i),
      ...!o && !rh(a) && { "aria-hidden": "true" },
      ...a
    },
    [
      ...r.map(([u, l]) => y.createElement(u, l)),
      ...Array.isArray(o) ? o : [o]
    ]
  )
);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const q = (t, e) => {
  const n = y.forwardRef(
    ({ className: s, ...i }, o) => y.createElement(ah, {
      ref: o,
      iconNode: e,
      className: Wr(
        `lucide-${sh(ni(t))}`,
        `lucide-${t}`,
        s
      ),
      ...i
    })
  );
  return n.displayName = ni(t), n;
};
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ch = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
], lh = q("history", ch);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const uh = [
  [
    "path",
    {
      d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
      key: "1sd12s"
    }
  ]
], hh = q("message-circle", uh);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const fh = [["path", { d: "M5 12h14", key: "1ays0h" }]], dh = q("minus", fh);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const mh = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm"
    }
  ]
], ph = q("moon", mh);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const gh = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
], yh = q("send", gh);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ah = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
], vh = q("sparkles", Ah);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Eh = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
], Ch = q("sun", Eh);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xh = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
  ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
], wh = q("volume-2", xh);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ih = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["line", { x1: "22", x2: "16", y1: "9", y2: "15", key: "1ewh16" }],
  ["line", { x1: "16", x2: "22", y1: "9", y2: "15", key: "5ykzw1" }]
], bh = q("volume-x", Ih);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ph = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], Ln = q("x", Ph);
function Gr({ src: t, alt: e = "Avatar", className: n }) {
  const [s, i] = y.useState(t);
  return /* @__PURE__ */ m.jsx(
    "img",
    {
      src: s,
      alt: e,
      className: n,
      onError: () => i("https://picsum.photos/seed/aetherbot-fallback/80")
    }
  );
}
function Sh({
  open: t,
  onToggle: e,
  avatarImageUrl: n
}) {
  return /* @__PURE__ */ m.jsxs("div", { className: "pointer-events-auto fixed bottom-6 right-6 z-[61]", children: [
    /* @__PURE__ */ m.jsx(oe, { children: !t && /* @__PURE__ */ m.jsx(Bh, { onClick: e, avatarImageUrl: n }) }),
    /* @__PURE__ */ m.jsx(oe, { children: t && /* @__PURE__ */ m.jsx(
      Z.button,
      {
        "aria-label": "Close chat",
        onClick: e,
        className: "h-12 w-12 rounded-full grid place-items-center bg-[var(--aether-primary)] text-white shadow-xl",
        initial: { scale: 0.85, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.85, opacity: 0 },
        whileTap: { scale: 0.96 },
        children: /* @__PURE__ */ m.jsx(Ln, { className: "h-5 w-5" })
      },
      "launcher-close"
    ) })
  ] });
}
function Bh({ onClick: t, avatarImageUrl: e }) {
  return /* @__PURE__ */ m.jsxs(
    Z.button,
    {
      onClick: t,
      className: "relative flex items-center gap-3 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl px-3 pr-14 py-3 text-left border border-zinc-200/70 dark:border-white/10",
      initial: { opacity: 0, y: 8, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 8, scale: 0.98 },
      whileHover: { y: -1 },
      children: [
        /* @__PURE__ */ m.jsx(Gr, { src: e, alt: "Avatar", className: "h-10 w-10 rounded-full" }),
        /* @__PURE__ */ m.jsxs("div", { className: "max-w-[240px]", children: [
          /* @__PURE__ */ m.jsx("p", { className: "text-sm font-semibold text-zinc-900 dark:text-white", children: "Let’s Chat, Your Way" }),
          /* @__PURE__ */ m.jsx("p", { className: "text-xs text-zinc-600 dark:text-zinc-300", children: "This chatbot adapts to your style of conversation." })
        ] }),
        /* @__PURE__ */ m.jsx(
          Z.span,
          {
            className: "absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full grid place-items-center text-white bg-[var(--aether-primary)] shadow",
            animate: { scale: [1, 1.05, 1] },
            transition: { repeat: 1 / 0, duration: 3.2 },
            children: /* @__PURE__ */ m.jsx(hh, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ m.jsx(
          Z.span,
          {
            "aria-hidden": !0,
            className: "pointer-events-none absolute inset-0 rounded-2xl",
            animate: {
              boxShadow: [
                "0 0 0 0 rgba(124,58,237,0.0)",
                "0 0 0 10px rgba(124,58,237,0.10)",
                "0 0 0 0 rgba(124,58,237,0.0)"
              ]
            },
            transition: { duration: 4.5, repeat: 1 / 0, repeatDelay: 6 }
          }
        )
      ]
    },
    "launcher-card"
  );
}
function St({ label: t, onClick: e, children: n }) {
  return /* @__PURE__ */ m.jsx(
    "button",
    {
      "aria-label": t,
      onClick: e,
      className: "inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 transition",
      children: n
    }
  );
}
function Dh({
  avatarImageUrl: t,
  avatarName: e,
  theme: n,
  setTheme: s,
  muted: i,
  setMuted: o,
  onHistory: r,
  onClose: a
}) {
  return /* @__PURE__ */ m.jsxs("div", { className: "flex items-center justify-between px-4 py-3", children: [
    /* @__PURE__ */ m.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ m.jsx(Gr, { src: t, alt: "avatar", className: "h-9 w-9 rounded-full" }),
      /* @__PURE__ */ m.jsxs("div", { children: [
        /* @__PURE__ */ m.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ m.jsx("p", { className: "font-semibold leading-none", children: e }),
          /* @__PURE__ */ m.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" })
        ] }),
        /* @__PURE__ */ m.jsx("p", { className: "text-xs text-zinc-500 dark:text-zinc-400", children: "Adaptable chatbot service" })
      ] })
    ] }),
    /* @__PURE__ */ m.jsxs("div", { className: "flex items-center gap-1.5 text-zinc-500", children: [
      /* @__PURE__ */ m.jsx(
        St,
        {
          label: "Toggle theme",
          onClick: () => s((c) => ({ ...c, mode: c.mode === "dark" ? "light" : "dark" })),
          children: n.mode === "dark" ? /* @__PURE__ */ m.jsx(Ch, { className: "h-4 w-4" }) : /* @__PURE__ */ m.jsx(ph, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ m.jsx(St, { label: i ? "Unmute" : "Mute", onClick: () => o(!i), children: i ? /* @__PURE__ */ m.jsx(bh, { className: "h-4 w-4" }) : /* @__PURE__ */ m.jsx(wh, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ m.jsx(St, { label: "History", onClick: r, children: /* @__PURE__ */ m.jsx(lh, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ m.jsx(St, { label: "Minimize", onClick: a, children: /* @__PURE__ */ m.jsx(dh, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ m.jsx(St, { label: "Close", onClick: a, children: /* @__PURE__ */ m.jsx(Ln, { className: "h-4 w-4" }) })
    ] })
  ] });
}
function Rh({ bannerImageUrl: t, companyName: e }) {
  const n = (s) => {
    s.target.src = "https://picsum.photos/seed/aetherbanner-fallback/800/200";
  };
  return /* @__PURE__ */ m.jsx("div", { className: "px-4", children: /* @__PURE__ */ m.jsxs("div", { className: "relative overflow-hidden rounded-2xl", children: [
    /* @__PURE__ */ m.jsx("img", { src: t, alt: "banner", onError: n, className: "h-28 w-full object-cover" }),
    /* @__PURE__ */ m.jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-[var(--aether-primary)]/70 to-transparent" }),
    /* @__PURE__ */ m.jsxs("div", { className: "absolute left-4 top-4 text-white", children: [
      /* @__PURE__ */ m.jsx("p", { className: "font-semibold", children: e }),
      /* @__PURE__ */ m.jsx("p", { className: "text-xs opacity-90 max-w-[240px]", children: "Every conversation matters, and this chatbot makes it worthwhile." })
    ] })
  ] }) });
}
function Th({
  chat: t,
  onUpdateChat: e,
  onRetitle: n,
  onPlay: s
}) {
  const [i, o] = y.useState(""), r = y.useRef(null), [a, c] = y.useState(!1);
  y.useEffect(() => {
    var l;
    (l = r.current) == null || l.scrollTo({ top: 999999, behavior: "smooth" });
  }, [t.messages.length, a]);
  const u = () => {
    if (!i.trim() || a) return;
    const l = {
      id: crypto.randomUUID(),
      role: "user",
      content: i.trim(),
      createdAt: Date.now()
    }, h = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Thinking…",
      createdAt: Date.now(),
      thinking: !0
    }, f = { ...t, messages: [...t.messages, l, h] };
    e(f), s == null || s(560), o(""), c(!0), t.title === "New chat" && n(l.content.slice(0, 36));
    const d = 1200 + Math.random() * 1e3;
    setTimeout(() => {
      const p = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: nh(l.content) || "Thanks! I’m checking that and will get back to you.",
        createdAt: Date.now()
      }, g = {
        ...f,
        messages: f.messages.map((v) => v.thinking ? p : v)
      };
      e(g), s == null || s(760), c(!1);
    }, d);
  };
  return /* @__PURE__ */ m.jsxs("div", { className: "mt-3 flex flex-col h-[46vh]", children: [
    /* @__PURE__ */ m.jsx("div", { ref: r, className: "flex-1 overflow-y-auto px-4 space-y-3", children: t.messages.map((l) => /* @__PURE__ */ m.jsx(Qh, { msg: l }, l.id)) }),
    /* @__PURE__ */ m.jsx("div", { className: "px-4 pt-2 pb-4", children: /* @__PURE__ */ m.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ m.jsx(
        "input",
        {
          value: i,
          onChange: (l) => o(l.target.value),
          onKeyDown: (l) => {
            l.key === "Enter" && u();
          },
          placeholder: "Type message...",
          className: "w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-[var(--aether-primary)]/30 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
        }
      ),
      /* @__PURE__ */ m.jsx(
        "button",
        {
          onClick: u,
          className: "absolute right-1.5 top-1.5 h-9 w-9 rounded-full bg-[var(--aether-primary)] text-white grid place-items-center hover:opacity-90 active:scale-95 transition",
          "aria-label": "Send",
          children: /* @__PURE__ */ m.jsx(yh, { className: "h-4 w-4" })
        }
      )
    ] }) })
  ] });
}
function Qh({ msg: t }) {
  const e = t.role === "user";
  return /* @__PURE__ */ m.jsx("div", { className: ne("flex", e ? "justify-end" : "justify-start"), children: /* @__PURE__ */ m.jsxs(
    Z.div,
    {
      initial: { opacity: 0, y: 6 },
      animate: { opacity: 1, y: 0 },
      transition: { type: "spring", stiffness: 200, damping: 18 },
      className: ne(
        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
        e ? "bg-[var(--aether-primary)] text-white" : "bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
      ),
      children: [
        t.thinking ? /* @__PURE__ */ m.jsx(Mh, {}) : /* @__PURE__ */ m.jsx("span", { children: t.content }),
        /* @__PURE__ */ m.jsx("div", { className: ne("mt-1 text-[10px] opacity-70", e ? "text-white" : "text-zinc-500 dark:text-zinc-400"), children: eh(t.createdAt) })
      ]
    }
  ) });
}
function Mh() {
  return /* @__PURE__ */ m.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ m.jsx(kh, {}),
    /* @__PURE__ */ m.jsx("span", { className: "text-zinc-500 dark:text-zinc-400", children: "Thinking…" })
  ] });
}
function kh() {
  return /* @__PURE__ */ m.jsxs("div", { className: "flex items-center gap-1", children: [
    [0, 1, 2].map((t) => /* @__PURE__ */ m.jsx(
      "span",
      {
        className: "h-1.5 w-1.5 rounded-full bg-zinc-400/70 inline-block",
        style: { animation: `aether-bounce 1.2s ${t * 0.12}s infinite` }
      },
      t
    )),
    /* @__PURE__ */ m.jsx("style", { children: `
        @keyframes aether-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: .6 }
          40% { transform: translateY(-3px); opacity: 1 }
        }
      ` })
  ] });
}
function jh({
  show: t,
  chats: e,
  activeId: n,
  setActiveId: s,
  onClose: i,
  onStartNew: o
}) {
  return /* @__PURE__ */ m.jsx(oe, { children: t && /* @__PURE__ */ m.jsxs(Z.div, { className: "fixed inset-0 z-[70]", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: [
    /* @__PURE__ */ m.jsx("div", { className: "absolute inset-0 bg-black/40", onClick: i }),
    /* @__PURE__ */ m.jsxs(
      Z.aside,
      {
        className: "absolute right-6 bottom-24 w-[380px] sm:w-[420px] rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden",
        initial: { x: 24, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 24, opacity: 0 },
        transition: { type: "spring", stiffness: 200, damping: 18 },
        children: [
          /* @__PURE__ */ m.jsxs("div", { className: "p-4 flex items-center justify-between border-b border-zinc-200/60 dark:border-white/10", children: [
            /* @__PURE__ */ m.jsx("p", { className: "font-semibold", children: "Past chats" }),
            /* @__PURE__ */ m.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ m.jsx("button", { onClick: o, className: "px-3 py-1.5 text-sm rounded-full bg-[var(--aether-primary)] text-white hover:opacity-90", children: "New chat" }),
              /* @__PURE__ */ m.jsx("button", { onClick: i, className: "h-8 w-8 grid place-items-center rounded-full hover:bg-zinc-100 dark:hover:bg-white/10", "aria-label": "Close history", children: /* @__PURE__ */ m.jsx(Ln, { className: "h-4 w-4" }) })
            ] })
          ] }),
          /* @__PURE__ */ m.jsx("div", { className: "max-h-[56vh] overflow-y-auto p-2", children: e.map((r) => /* @__PURE__ */ m.jsxs(
            "button",
            {
              onClick: () => {
                s(r.id), i();
              },
              className: ne(
                "w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition",
                r.id === n && "bg-zinc-100 dark:bg-white/10"
              ),
              children: [
                /* @__PURE__ */ m.jsx("p", { className: "text-sm font-medium truncate", children: r.title }),
                /* @__PURE__ */ m.jsx("p", { className: "text-xs text-zinc-500 dark:text-zinc-400", children: new Date(r.createdAt).toLocaleString() })
              ]
            },
            r.id
          )) })
        ]
      }
    )
  ] }) });
}
const Lh = "data:image/png;base64,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";
function Vh() {
  return /* @__PURE__ */ m.jsxs(
    Z.div,
    {
      className: "px-6 py-10 text-center select-none",
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -8 },
      children: [
        /* @__PURE__ */ m.jsx("div", { className: "mx-auto h-16 w-16 rounded-2xl grid place-items-center bg-white/80 dark:bg-white/5 shadow", children: /* @__PURE__ */ m.jsx("img", { src: Lh, alt: "Aetherbot", className: "h-12 w-12 object-contain" }) }),
        /* @__PURE__ */ m.jsxs("p", { className: "mt-4 text-sm text-zinc-600 dark:text-zinc-300", children: [
          "Powered by ",
          /* @__PURE__ */ m.jsx("span", { className: "font-medium", children: "aetherbot" })
        ] })
      ]
    },
    "splash"
  );
}
function Fh({
  avatarName: t,
  avatarImageUrl: e,
  bannerImageUrl: n,
  companyName: s,
  theme: i,
  setTheme: o,
  chats: r,
  setChats: a,
  activeChat: c,
  setActiveId: u,
  versionTag: l,
  muted: h,
  setMuted: f,
  onClose: d,
  play: p
}) {
  const [g, v] = y.useState(!1), [A, C] = y.useState("splash");
  return y.useEffect(() => {
    C("splash");
    const E = setTimeout(() => {
      C("chat"), p == null || p(720);
    }, 900);
    return () => clearTimeout(E);
  }, []), /* @__PURE__ */ m.jsxs(
    Z.div,
    {
      className: "pointer-events-auto fixed bottom-24 right-6 w-[380px] max-h-[78vh] sm:w-[420px]",
      initial: { opacity: 0, y: 16, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 16, scale: 0.98 },
      transition: { type: "spring", stiffness: 180, damping: 16 },
      children: [
        /* @__PURE__ */ m.jsxs("div", { className: "relative overflow-hidden rounded-3xl shadow-2xl bg-white dark:bg-black border border-white/60 dark:border-white/10", children: [
          /* @__PURE__ */ m.jsx(
            Dh,
            {
              avatarName: t,
              avatarImageUrl: e,
              theme: i,
              setTheme: o,
              muted: h,
              setMuted: f,
              onHistory: () => v(!0),
              onClose: d
            }
          ),
          /* @__PURE__ */ m.jsx(Hh, { phase: A, companyName: s, bannerImageUrl: n, activeChat: c, setChats: a, onRetitle: (E) => a((I) => I.map((x) => x.id === c.id ? { ...x, title: E } : x)), play: p, versionTag: l }),
          /* @__PURE__ */ m.jsx("div", { className: "absolute -bottom-3 -right-2 h-8 w-8 rounded-full bg-white dark:bg-black shadow-md" })
        ] }),
        /* @__PURE__ */ m.jsx(
          jh,
          {
            show: g,
            chats: r,
            activeId: c.id,
            setActiveId: u,
            onClose: () => v(!1),
            onStartNew: () => {
              const E = crypto.randomUUID(), I = Date.now(), x = {
                id: E,
                createdAt: I,
                title: "New chat",
                messages: [
                  {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: "Welcome! How can I help today?",
                    createdAt: I
                  }
                ]
              };
              a((P) => [x, ...P]), u(E);
            }
          }
        )
      ]
    }
  );
}
function Hh({
  phase: t,
  companyName: e,
  bannerImageUrl: n,
  activeChat: s,
  setChats: i,
  onRetitle: o,
  play: r,
  versionTag: a
}) {
  return /* @__PURE__ */ m.jsx(m.Fragment, { children: t === "splash" ? /* @__PURE__ */ m.jsx(Vh, {}) : /* @__PURE__ */ m.jsxs(Z.div, { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, children: [
    /* @__PURE__ */ m.jsx(Rh, { bannerImageUrl: n, companyName: e }),
    /* @__PURE__ */ m.jsx(
      Th,
      {
        chat: s,
        onUpdateChat: (c) => i((u) => u.map((l) => l.id === c.id ? c : l)),
        onRetitle: o,
        onPlay: r
      }
    ),
    /* @__PURE__ */ m.jsx("div", { className: "px-4 pb-2", children: /* @__PURE__ */ m.jsxs("div", { className: "mt-2 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400", children: [
      /* @__PURE__ */ m.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ m.jsx(vh, { className: "h-3.5 w-3.5" }),
        /* @__PURE__ */ m.jsxs("span", { children: [
          "Powered by ",
          /* @__PURE__ */ m.jsx("span", { className: "font-medium", children: "aetherlink" })
        ] })
      ] }),
      /* @__PURE__ */ m.jsx("span", { className: "opacity-70", children: a })
    ] }) })
  ] }, "chat") });
}
const Oh = {
  primary: "#7c3aed",
  // violet-600
  mode: "light"
};
function Xh({
  avatarName: t = "Aetherbot",
  avatarImageUrl: e = $u,
  bannerImageUrl: n = th,
  companyName: s = "Aetherlink",
  theme: i,
  versionTag: o = "v1.01"
}) {
  const [r, a] = Pt(
    "aether.widget.theme",
    { ...Oh, ...i || {} }
  ), [c, u] = Pt("aether.widget.open", !1), [l, h] = Pt("aether.widget.muted", !1), { chord: f, play: d } = _u(!l), [p, g] = Pt("aether.widget.chats", [
    {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      title: "New chat",
      messages: [
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Hey! I’m here to help. Ask me anything — product info, policies, or troubleshooting.",
          createdAt: Date.now()
        }
      ]
    }
  ]), [v, A] = Pt(
    "aether.widget.active",
    ""
  ), C = p.find((x) => x.id === v) || p[0];
  y.useEffect(() => {
    !C && p.length && A(p[0].id);
  }, [p, C, A]), y.useEffect(() => {
    const x = document.documentElement;
    r.mode === "dark" ? x.classList.add("dark") : x.classList.remove("dark");
  }, [r.mode]);
  const E = y.useMemo(
    () => ({
      // @ts-ignore
      "--aether-primary": r.primary
    }),
    [r.primary]
  ), I = () => {
    u((x) => (x || f(), !x));
  };
  return /* @__PURE__ */ m.jsxs(
    "div",
    {
      style: E,
      className: `fixed inset-0 pointer-events-none z-[60] ${r.mode === "dark" ? "dark" : ""}`,
      children: [
        /* @__PURE__ */ m.jsx(Sh, { open: c, onToggle: I, avatarImageUrl: e }),
        /* @__PURE__ */ m.jsx(oe, { initial: !1, children: c && /* @__PURE__ */ m.jsx(
          Fh,
          {
            avatarName: t,
            avatarImageUrl: e,
            bannerImageUrl: n,
            companyName: s,
            theme: r,
            setTheme: a,
            chats: p,
            setChats: g,
            activeChat: C,
            setActiveId: A,
            versionTag: o,
            muted: l,
            setMuted: h,
            onClose: () => u(!1),
            play: d
          }
        ) })
      ]
    }
  );
}
export {
  Xh as AetherChatWidget
};
//# sourceMappingURL=aetherbot-sdk.mjs.map
