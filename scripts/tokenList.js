const axios = require('axios');
const apiKey = 'EK-q5pSx-5UuiQfq-qudJU';
const url = `https://api.ethplorer.io/getTop?apiKey=${apiKey}&criteria=cap`;
axios.get(url)
.then(response => {
console.log(JSON.stringify(response.data));
})
.catch(error => {
console.error(error);
});