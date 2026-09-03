const express = require('express');
const cors = require('cors');

const config = require('./config/env');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const clinicRoutes = require('./routes/clinic.routes');

const app = express();

app.use(cors({ origin: config.frontendUrl }));
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', clinicRoutes);

app.listen(config.port, () => {
  console.log(`Backend jalan di http://localhost:${config.port}`);
});