"inert" in HTMLElement.prototype || (Object.defineProperty(HTMLElement.prototype, "inert", {
  enumerable: !0,
  get: function get() {
    return this.hasAttribute("inert");
  },
  set: function set(h) {
    h ? this.setAttribute("inert", "") : this.removeAttribute("inert");
  }
}), window.addEventListener("load", function () {
  function h(a) {
    var b = null;

    try {
      b = new KeyboardEvent("keydown", {
        keyCode: 9,
        which: 9,
        key: "Tab",
        code: "Tab",
        keyIdentifier: "U+0009",
        shiftKey: !!a,
        bubbles: !0
      });
    } catch (g) {
      try {
        b = document.createEvent("KeyboardEvent"), b.initKeyboardEvent("keydown", !0, !0, window, "Tab", 0, a ? "Shift" : "", !1, "en");
      } catch (d) {}
    }

    if (b) {
      try {
        Object.defineProperty(b, "keyCode", {
          value: 9
        });
      } catch (g) {}

      document.dispatchEvent(b);
    }
  }

  function k(a) {
    for (; a && a !== document.documentElement;) {
      if (a.hasAttribute("inert")) return a;
      a = a.parentElement;
    }

    return null;
  }

  function e(a) {
    var b = a.path;
    return b && b[0] || a.target;
  }

  function l(a) {
    a.path[a.path.length - 1] !== window && (m(e(a)), a.preventDefault(), a.stopPropagation());
  }

  function m(a) {
    var b = k(a);

    if (b) {
      if (document.hasFocus() && 0 !== f) {
        var g = (c || document).activeElement;
        h(0 > f ? !0 : !1);
        if (g != (c || document).activeElement) return;
        var d = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
          acceptNode: function acceptNode(a) {
            return !a || !a.focus || 0 > a.tabIndex ? NodeFilter.FILTER_SKIP : b.contains(a) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
          }
        });
        d.currentNode = b;
        d = (-1 === Math.sign(f) ? d.previousNode : d.nextNode).bind(d);

        for (var e; e = d();) {
          if (e.focus(), (c || document).activeElement !== g) return;
        }
      }

      a.blur();
    }
  }

  (function (a) {
    var b = document.createElement("style");
    b.type = "text/css";
    b.styleSheet ? b.styleSheet.cssText = a : b.appendChild(document.createTextNode(a));
    document.body.appendChild(b);
  })("/*[inert]*/*[inert]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}");

  var n = function n(a) {
    return null;
  };

  window.ShadowRoot && (n = function n(a) {
    for (; a && a !== document.documentElement;) {
      if (a instanceof window.ShadowRoot) return a;
      a = a.parentNode;
    }

    return null;
  });
  var f = 0;
  document.addEventListener("keydown", function (a) {
    f = 9 === a.keyCode ? a.shiftKey ? -1 : 1 : 0;
  });
  document.addEventListener("mousedown", function (a) {
    f = 0;
  });
  var c = null;
  document.body.addEventListener("focus", function (a) {
    var b = e(a);
    a = b == a.target ? null : n(b);

    if (a != c) {
      if (c) {
        if (!(c instanceof window.ShadowRoot)) throw Error("not shadow root: " + c);
        c.removeEventListener("focusin", l, !0);
      }

      a && a.addEventListener("focusin", l, !0);
      c = a;
    }

    m(b);
  }, !0);
  document.addEventListener("click", function (a) {
    var b = e(a);
    k(b) && (a.preventDefault(), a.stopPropagation());
  }, !0);
}));
