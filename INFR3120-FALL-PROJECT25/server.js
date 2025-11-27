// server.js
const app = require('./server/config/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
