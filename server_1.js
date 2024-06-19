const userRoutes = require('./routes/user');
const noteRoutes = require('./routes/note');

app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

