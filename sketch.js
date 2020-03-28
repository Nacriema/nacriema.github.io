console.log('Da vao duoc');
// Declare the package
const covid = require('novelcovid');

// Now we create a async/await
(async () => {

    // Now we await it.
    let all = await covid.getAll();

    // Make sure you return it, this usually implies if you are using this inside a function.
    // Use \n to break lines.
    var deaths = document.getElementById('death_num');
    deaths.innerHTML = all.deaths;

    var cases = document.getElementById('case_num');
    cases.innerHTML = all.cases;

    var recovers = document.getElementById('recover_num');
    recovers.innerHTML = all.recovered;

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