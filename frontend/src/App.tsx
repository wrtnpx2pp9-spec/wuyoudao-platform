import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ConfigProvider, theme, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HomeConfigProvider } from './context/HomeConfigContext';
import Layout from './components/Layout';
import HomePage from './pages/public/HomePage';
import LoginPageFlip from './pages/public/LoginPageFlip';
import RegisterPage from './pages/public/RegisterPage';
import RequirementDetailPage from './pages/public/RequirementDetailPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import PublishRequirement from './pages/user/PublishRequirement';
import MyRequirements from './pages/user/MyRequirements';
import EmailManagement from './pages/user/EmailManagement';
import WalletDashboard from './pages/user/WalletDashboard';
import PaymentPage from './pages/user/PaymentPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import RequirementManagement from './pages/admin/RequirementManagement';
import RequirementReview from './pages/admin/RequirementReview';
import UserManagement from './pages/admin/UserManagement';
import OrderManagement from './pages/admin/OrderManagement';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import AnnouncementManagement from './pages/admin/AnnouncementManagement';
import AnnouncementHistory from './pages/public/AnnouncementHistory';
import HomeConfigManagement from './pages/admin/HomeConfigManagement';
import AdvertisementManagement from './pages/admin/AdvertisementManagement';
import WithdrawalManagement from './pages/admin/WithdrawalManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import DataSwitchManagement from './pages/admin/DataSwitchManagement';
import SecurityDashboard from './pages/superadmin/SecurityDashboard';
import ProtectedOrderDetail from './components/ProtectedOrderDetail';

const { defaultAlgorithm } = theme;

const customTheme = {
  algorithm: defaultAlgorithm,
  token: {
    colorPrimary: '#323232',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorText: '#323232',
    fontSize: 14,
    borderRadius: 6,
  },
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean; requireSuperAdmin?: boolean }> = ({ children, requireAdmin = false, requireSuperAdmin = false }) => {
  const { isAuthenticated, isAdmin, isSuperAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/home" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

const HomeRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const hasVisited = sessionStorage.getItem('hasVisited');
  const location = window.location.pathname;

  if (location === '/home' && !isAuthenticated && !hasVisited) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ConfigProvider theme={customTheme} locale={zhCN}>
      <AntApp>
        <HomeConfigProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LoginPageFlip />} />
                <Route path="/login" element={<LoginPageFlip />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                
                <Route element={<Layout><Outlet /></Layout>}>
                  <Route path="home" element={<HomeRoute><HomePage /></HomeRoute>} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="requirements/:id" element={<RequirementDetailPage />} />
                  <Route path="announcements" element={<AnnouncementHistory />} />
                  
                  <Route path="user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                  <Route path="user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                  <Route path="user/my-requirements" element={<ProtectedRoute><MyRequirements /></ProtectedRoute>} />
                  <Route path="user/publish-requirement" element={<ProtectedRoute><PublishRequirement /></ProtectedRoute>} />
                  <Route path="user/email-management" element={<ProtectedRoute><EmailManagement /></ProtectedRoute>} />
                  <Route path="user/wallet" element={<ProtectedRoute><WalletDashboard /></ProtectedRoute>} />
                  <Route path="payment/requirement/:id" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                  <Route path="orders/:id" element={<ProtectedRoute><ProtectedOrderDetail /></ProtectedRoute>} />
                  <Route path="admin/orders/:id" element={<ProtectedRoute requireAdmin><AdminOrderDetail /></ProtectedRoute>} />
                  <Route path="admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
                  <Route path="admin/requirements" element={<ProtectedRoute requireAdmin><RequirementManagement /></ProtectedRoute>} />
                  <Route path="admin/requirements/review" element={<ProtectedRoute requireAdmin><RequirementReview /></ProtectedRoute>} />
                  <Route path="admin/users" element={<ProtectedRoute requireAdmin><UserManagement /></ProtectedRoute>} />
                  <Route path="admin/orders" element={<ProtectedRoute requireAdmin><OrderManagement /></ProtectedRoute>} />
                  <Route path="admin/announcements" element={<ProtectedRoute requireAdmin><AnnouncementManagement /></ProtectedRoute>} />
                  <Route path="admin/home-config" element={<ProtectedRoute requireSuperAdmin><HomeConfigManagement /></ProtectedRoute>} />
                  <Route path="admin/advertisements" element={<ProtectedRoute requireAdmin><AdvertisementManagement /></ProtectedRoute>} />
                  <Route path="admin/withdrawals" element={<ProtectedRoute requireSuperAdmin><WithdrawalManagement /></ProtectedRoute>} />
                  <Route path="admin/payments" element={<ProtectedRoute requireSuperAdmin><PaymentManagement /></ProtectedRoute>} />
                  <Route path="admin/switches" element={<ProtectedRoute requireSuperAdmin><DataSwitchManagement /></ProtectedRoute>} />
                  <Route path="admin/superadmin" element={<ProtectedRoute requireSuperAdmin><SuperAdminDashboard /></ProtectedRoute>} />
                  <Route path="admin/security" element={<ProtectedRoute requireSuperAdmin><SecurityDashboard /></ProtectedRoute>} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </HomeConfigProvider>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;