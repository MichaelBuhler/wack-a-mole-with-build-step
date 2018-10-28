// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/styles/index.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

require("./styles/index.scss");

var _this = void 0;

(function () {
  // global variables (scoped within IIFE closure)
  var isGameOver = true;
  var score = 0;
  var numberOfMoles = 0;
  var gameClock;
  var activeTimeout;
  var difficultyLevelMap = {
    0: {
      high: 3500,
      low: 400
    },
    1: {
      high: 2000,
      low: 400
    },
    2: {
      high: 1000,
      low: 400
    },
    3: {
      high: 850,
      low: 100
    }
  }; // general utility functions

  var getDifficultyLevel = function getDifficultyLevel() {
    return document.getElementById('difficulty').value;
  };

  var getDifficultyLevelNumbers = function getDifficultyLevelNumbers() {
    return difficultyLevelMap[getDifficultyLevel()];
  };

  var getRandomTimeoutDurationBasedOnDifficultyLevel = function getRandomTimeoutDurationBasedOnDifficultyLevel() {
    var _getDifficultyLevelNu = getDifficultyLevelNumbers(),
        low = _getDifficultyLevelNu.low,
        high = _getDifficultyLevelNu.high;

    return Math.floor(Math.random() * high) + low;
  };

  var generateRandomNumberBetween1and9 = function generateRandomNumberBetween1and9() {
    return Math.floor(Math.random() * 9) + 1;
  };

  var resetStats = function resetStats() {
    score = 0;
    numberOfMoles = 0;
  }; // sets game duration


  var setGameClock = function setGameClock() {
    gameClock = setTimeout(function () {
      isGameOver = true;
      hideAllMoles();
      displayNotification();
    }, 15000);
  }; // hides all moles


  var hideAllMoles = function hideAllMoles() {
    document.querySelectorAll('.mole').forEach(function (mole) {
      hideMole(mole);
    });
  }; // displays game stats


  var displayStats = function displayStats() {
    document.getElementById('js-score').innerHTML = "You've whacked ".concat(score, " out of ").concat(numberOfMoles, " moles!");
  }; // returns a random mole


  var getRandomMole = function getRandomMole() {
    return document.querySelector(".mole-".concat(generateRandomNumberBetween1and9()));
  }; // shows a mole


  var showMole = function showMole(mole) {
    numberOfMoles++;
    displayStats();
    mole.classList.contains('hide') ? mole.classList.remove('hide') : null;
  }; // hides a mole


  var hideMole = function hideMole(mole) {
    mole.classList.contains('hide') ? null : mole.classList.add('hide');
  }; // Hides current mole and chooses/shows the next


  var hideMoleAndSetNewMole = function hideMoleAndSetNewMole(mole) {
    hideMole(mole);
    showRandomMoleAndSetRandomHideTimeout();
  }; // shows random mole and sets time out to hide it


  var showRandomMoleAndSetRandomHideTimeout = function showRandomMoleAndSetRandomHideTimeout() {
    if (!isGameOver) {
      var mole = getRandomMole();
      showMole(mole);
      activeTimeout = setTimeout(hideMoleAndSetNewMole.bind(_this, mole), getRandomTimeoutDurationBasedOnDifficultyLevel());
    }
  };
  /**
   * @param {message} message the string to display to the user
   * @returns {Promise} promise that resolves when the notification is removed
   */


  var displayNotification = function displayNotification() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Game over!";
    var gameNotification = document.getElementById('js-game-notification');
    gameNotification.classList.add('notification__open');
    gameNotification.innerHTML = message;
    return new Promise(function (resolve) {
      setTimeout(function () {
        gameNotification.classList.remove('notification__open');
        resolve('notification has been removed');
      }, 1500);
    });
  }; // Functions which compose together the functions above


  var startGame = function startGame() {
    if (isGameOver) {
      isGameOver = false;
      setGameClock();
      resetStats();
      displayStats();
      displayNotification("Starting a new game!").then(function () {
        showRandomMoleAndSetRandomHideTimeout();
      });
    }
  };

  var endGame = function endGame() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Game Over!';

    if (!isGameOver) {
      isGameOver = true;
      clearTimeout(activeTimeout);
      clearTimeout(gameClock);
      hideAllMoles();
      displayNotification(message);
      resetStats();
      displayStats();
    }
  };

  var resetGame = function resetGame() {
    clearTimeout(activeTimeout);
    endGame('Resetting game...');
    resetStats();
    displayStats();
    startGame();
  };

  var onMoleWhack = function onMoleWhack(mole) {
    hideMole(mole);
    score++;
    displayStats();
  }; // Event listeners


  document.querySelector('.start').addEventListener('click', startGame);
  document.querySelector('.stop').addEventListener('click', endGame.bind(_this, 'Game has been stopped!'));
  document.querySelector('.reset').addEventListener('click', resetGame);
  document.querySelectorAll('.mole').forEach(function (mole) {
    mole.addEventListener('click', onMoleWhack.bind(_this, mole));
  }); // Show score

  displayStats(); // display footer

  document.getElementById('js-footer').innerHTML = "Maxwell Kendall &#169 ".concat(new Date().getFullYear());
})();
},{"./styles/index.scss":"src/styles/index.scss"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64708" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.map