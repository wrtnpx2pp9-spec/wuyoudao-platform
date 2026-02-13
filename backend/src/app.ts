import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import requirementRoutes from './routes/requirement';
import orderRoutes from './routes/order';
import userRoutes from './routes/user';
import announcementRoutes from './routes/announcement';
import homeConfigRoutes from './routes/homeConfig';
import dataSwitchRoutes from './routes/dataSwitch';
import paymentRoutes from './routes/payment';
import withdrawalRoutes from './routes/withdrawal';
import advertisementRoutes from './routes/advertisement';
import securityDashboardRoutes from './routes/securityDashboard';
import alipayRoutes from './routes/alipay';
import wechatPayRoutes from './routes/wechatPay';
import path from 'path';

dotenv.config();

const app: Application = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/home-config', homeConfigRoutes);
app.use('/api/data-switch', dataSwitchRoutes);
app.use('/api/data-switches', dataSwitchRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/advertisements', advertisementRoutes);
app.use('/api/security-dashboard', securityDashboardRoutes);
app.use('/api/alipay', alipayRoutes);
app.use('/api/wechat-pay', wechatPayRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = Number(process.env.PORT) || 3001;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`服务器运行在端口 ${PORT}`);
  });
}

export default app;