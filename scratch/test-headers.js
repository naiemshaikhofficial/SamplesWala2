const http = require('http');

http.get('http://localhost:3000', (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', JSON.stringify(res.headers, null, 2));
  process.exit(0);
}).on('error', (e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
