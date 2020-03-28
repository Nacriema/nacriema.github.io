(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
"use strict";

// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var global = getGlobal();

module.exports = exports = global.fetch;

// Needed for TypeScript and Webpack.
exports.default = global.fetch.bind(global);

exports.Headers = global.Headers;
exports.Request = global.Request;
exports.Response = global.Response;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
const fetch = require('node-fetch');

module.exports = async function() {
    try { 
        return await fetch(`https://corona.lmao.ninja/all`).then(r=>r.json()); 
    } catch (e) { 
        throw new TypeError("Something went wrong, please try again later.");
    }
 }
},{"node-fetch":1}],3:[function(require,module,exports){
const fetch = require('node-fetch');

module.exports = async function(params) {
    if (!params.country && !params.sort) {
        let countries = await fetch(`https://corona.lmao.ninja/countries`).then(r=>r.json());
        if (countries.length == 0 || !countries) throw new Error("States could not be fetched, please try again later.")
        else return countries
    } else if (!params.country && params.sort) {
        let countries = await fetch(`https://corona.lmao.ninja/countries?sort=${params.sort}`).then(r=>r.json());
        if (countries.length == 0 || !countries) throw new Error("States could not be fetched, please try again later.")
        return countries;
    } else if (params.country) {
        try { return await fetch(`https://corona.lmao.ninja/countries/${params.country}`).then(r=>r.json()); } catch (e) { throw new Error("Country could not be found.") };
    }
}
},{"node-fetch":1}],4:[function(require,module,exports){
const fetch = require('node-fetch');

module.exports = async function(params) {
    if (!params.state && !params.sort) {
        let fiftystates = await fetch(`https://corona.lmao.ninja/states`).then(r=>r.json());
        if (fiftystates.length == 0 || !fiftystates) throw new Error("States could not be fetched, please try again later.");
        else return fiftystates;
    } else if (!params.state && params.sort) {
        let filteredStates = await fetch(`https://corona.lmao.ninja/states`).then(r=>r.json());
        if (filteredStates.length == 0 || filteredStates) throw new Error("States could not be fetched, please try again later. ");
        else {
            filteredStates = filteredStates.sort((a, b) => a[params.sort] + b[params.sort])
            return filteredStates;
        }
    } else if (params.state) {
        let filteredState = await fetch(`https://corona.lmao.ninja/states`).then(r=>r.json());
        if (filteredState.length == 0 || !filteredState) throw new Error("States could not be fetched, please try again later.")
        else {
            filteredState = await filteredState.filter(x=>x.state.toLowerCase() === params.state.toLowerCase());
            if (filteredState.length == 0) throw new Error("State could not be found, please make sure that the state you are looking for is in the United States.");
            else return filteredState[0];
        }
    }
}
},{"node-fetch":1}],5:[function(require,module,exports){
const methods = {
    getAll: require('./funcs/getAll.js'),
    getCountry: require('./funcs/getCountry.js'),
    getState: require('./funcs/getState.js'),
}

module.exports = {
    version: "1.0.7-b3",
    getAll: function() {
        // You gotta dig deeper if you want the source code..
        // You cant .toString ;)
        return execute({ method: 'getAll' });
    },
    getCountry: function(params) {
        // You gotta dig deeper if you want the source code..
        // You cant .toString ;)
        if (!params || params == {}) return execute({ method: 'getCountry', country: null, sort: null });
        if (params.country || params.sort) return execute({ method: 'getCountry', country: params.country ? params.country : null, sort: params.sort ? params.sort : null });
    },
    getState: function(params) {
        // You gotta dig deeper if you want the source code..
        // You cant .toString ;)
        if (!params || params == {}) return execute({ method: 'getState', state: null, sort: null });
        if (params.state || params.sort) return execute({ method: 'getState', state: params.state ? params.state : null, sort: params.sort ? params.sort : null });
    }
}

function execute(params) {
 
    if (!params.sort) params.sort = null;
    if (!params.country) params.country = null;
    if (!params.state) params.state = null;

    return methods[params.method](params)
};
},{"./funcs/getAll.js":2,"./funcs/getCountry.js":3,"./funcs/getState.js":4}],6:[function(require,module,exports){
console.log('Da vao duoc');
// Declare the package
const covid = require('novelcovid');

// Now we create a async/await
(async () => {

    // Now we await it.
    let all = await covid.getAll();

    // Make sure you return it, this usually implies if you are using this inside a function.
    // Use \n to break lines.
    return console.log(`Cases: ${all.cases}\nDeaths: ${all.deaths}\nRecovered: ${all.recovered}`)
})();



// (async () => {
//     let sortedCountries = await covid.getCountry({sort: 'recovered'});
//     return console.log(sortedCountries);

//     let sortedStates = await covid.getState({sort: 'deaths'});
//     return console.log(sortedStates);
// })();



(async () => {
   // Specific Country
   let specificCountry = await covid.getCountry({country: 'Vietnam'});

   var output = document.getElementById('outputVN');
   output.innerHTML = "Cases: " + specificCountry.cases + " Recovered: " + specificCountry.recovered;
   return console.log(specificCountry);
   
   // // Specific State
   // let specificState = await covid.getState({state: 'New York'});
   // return console.log(specificCountry);
})();
},{"novelcovid":5}]},{},[6]);
