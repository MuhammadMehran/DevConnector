const express = require('express');

const app = express();
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;

connectDB();

app.get('/', (req, res) => {
    res.send('Connected to API');
})

app.use(express.json({extended: false}));


app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profiles', require('./routes/api/profiles'));
app.use('/api/posts', require('./routes/api/posts'));



app.listen(PORT, () => {
    console.log(`Server start on Port ${PORT}`);
});