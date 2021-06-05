const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const len = characters.length;

function generateHash(length=30) {
  let hash = '';
  for ( let i = 0; i < length; i++ ) {
    hash += characters.charAt(Math.floor(Math.random() * len));
  }
  return hash;
}

function timeStamp() {
  return '' + new Date(Date.now())
}

function format(response) {
  r = JSON.parse(response)
  if (r.setup) return `<li>${r.setup}</li><hr>`
  return `
  <li><div>${r.timestamp}</div><br>
      <div>HEADERS: ${JSON.stringify(r.headers)}</div><br>
      <div>BODY: ${JSON.stringify(r.body)}</div>
  </li>
  <hr>
  `
}

module.exports = {generateHash, timeStamp, format}