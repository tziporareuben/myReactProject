// // server.js
// const express = require('express');
// const axios = require('axios');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');
// const jsonServer = require('json-server');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // JWT Secret
// const JWT_SECRET = 'your_jwt_secret';

// // טוען את המשתמשים מ־db.json
// const dbPath = path.join(__dirname, 'db.json');
// const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
// const users = dbData.users || [];

// // ----------------------
// // לוגין רגיל
// // ----------------------
// app.post('/users/login', (req, res) => {
//   const { email, password } = req.body;
//   const user = users.find(u => u.email === email);

//   if (!user) return res.status(404).json({ message: 'User not found' });
//   if (user.password !== password) return res.status(401).json({ message: 'Invalid password' });

//   const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
//   res.json({ token, user });
// });

// // ----------------------
// // לוגין דרך Google
// // ----------------------
// app.post('/auth/google-login', async (req, res) => {
//   const { accessToken } = req.body;

//   try {
//     const googleRes = await axios.get(
//       `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
//       {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       }
//     );

//     const { email } = googleRes.data;

//     if (!email) return res.status(400).json({ message: 'Invalid Google token' });

//     const user = users.find(u => u.email === email);
//     if (!user) return res.status(404).json({ message: 'User with this Google account not found' });

//     const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token, user });
//   } catch (error) {
//     console.error('Google login failed:', error.message);
//     res.status(401).json({ message: 'Google login failed' });
//   }
// });

// // ----------------------
// // json-server API
// // ----------------------
// const router = jsonServer.router(dbPath);
// const middlewares = jsonServer.defaults();

// // שימי לב! הגישה תהיה ל־ /users /articles וכו'
// app.use(middlewares);
// app.use(router);

// // ----------------------
// app.listen(3001, () => {
//   console.log('✅ Server running at: http://localhost:3001');
// });
