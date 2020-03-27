// Test thu cai goi npm minh moi cai
const covid = require('novelcovid');

// Create a async/await
(async () => {
	// Now await it
	let all = await covid.getAll();
	return console.log('Cases: ${all.cases}\nDeaths: ${all.deaths}\nRecovered: ${all.recovered}')
})()