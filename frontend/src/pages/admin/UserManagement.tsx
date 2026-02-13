import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Modal, Form, Input, App, Space, Popconfirm, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import type { User } from '../../types';
import { eventBus, EVENTS } from '../../utils/eventBus';
import { useAuth } from '../../context/AuthContext';

const { Option } = Select;

const SUPER_ADMIN_USERNAME = '013';

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  const { message: appMessage } = App.useApp();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await authService.getUsers({ page, limit: 10 });
      setUsers(response.users);
      setTotal(response.pagination.total);
    } catch (error) {
      appMessage.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (user: User) => {
    if (user.username === SUPER_ADMIN_USERNAME) {
      appMessage.error('不能编辑超级管理员账号');
      return;
    }
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    const user = users.find(u => u.id === id);
    
    if (!user) return;
    
    if (user.username === SUPER_ADMIN_USERNAME) {
      appMessage.error('不能删除超级管理员账号');
      return;
    }
    
    if (user.role === 'admin') {
      appMessage.error('不能删除管理员账号');
      return;
    }
    
    try {
      await authService.deleteUser(id);
      appMessage.success('删除成功');
      eventBus.emit(EVENTS.USER_DELETED);
      eventBus.emit(EVENTS.STATS_UPDATED);
      fetchUsers();
    } catch (error) {
      appMessage.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        await authService.updateUser(editingUser.id, values);
        appMessage.success('更新成功');
        eventBus.emit(EVENTS.USER_UPDATED);
      } else {
        await authService.createUser(values);
        appMessage.success('创建成功');
        eventBus.emit(EVENTS.USER_CREATED);
      }
      
      eventBus.emit(EVENTS.STATS_UPDATED);
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      appMessage.error(editingUser ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: '用户名', dataIndex: 'username', key: 'username', width: 150 },
    { title: '邮箱', dataIndex: 'email', key: 'email', width: 250, ellipsis: true },
    {
      title: '角色', dataIndex: 'role', key: 'role', width: 120,
      render: (role: string) => {
        if (role === 'superadmin') return <Tag color="purple">超级管理员</Tag>;
        return <Tag color={role === 'admin' ? 'red' : 'blue'}>{role === 'admin' ? '管理员' : '普通用户'}</Tag>;
      }
    },
    { title: '创建时间', dataIndex: 'created_at', key: 'created_at', width: 200, render: (date: string) => new Date(date).toLocaleString('zh-CN') },
    {
      title: '操作', key: 'action', width: 180, fixed: 'right' as const,
      render: (_: any, record: User) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          {isSuperAdmin && (
            <Popconfirm
              title="删除用户"
              description={<div><div style={{ marginBottom: '8px' }}>确定要删除用户 <strong>{record.username}</strong> 吗？</div><div style={{ color: '#ff4d4f', fontSize: '13px' }}>此操作不可恢复，请谨慎操作！</div></div>}
              onConfirm={() => handleDelete(record.id)}
              okText="确定删除" cancelText="取消" okButtonProps={{ danger: true }}
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '16px' }}><Button onClick={() => navigate('/admin')} type="default">返回管理后台</Button></div>
      <Card title="用户管理" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加用户</Button>}>
        <Table columns={columns} dataSource={users} rowKey="id" loading={loading}
          pagination={{ current: page, total, pageSize: 10, onChange: (newPage) => setPage(newPage), showSizeChanger: false, showTotal: (total) => `共 ${total} 条` }}
        />
      </Card>
      <Modal title={editingUser ? '编辑用户' : '添加用户'} open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={500} okText="确定" cancelText="取消">
        <Form form={form} layout="vertical">
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }, { min: 3, message: '用户名长度至少为3个字符' }, { max: 50, message: '用户名长度不能超过50个字符' }, { validator: (_, value) => value === '013' ? Promise.reject(new Error('用户名"013"为系统保留，不能使用')) : Promise.resolve() }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '请输入邮箱' }]}>
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          {!editingUser && (
            <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }, { min: 8, message: '密码至少8个字符' }, { max: 50, message: '密码最多50个字符' }, { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, message: '密码必须包含大小写字母和数字' }]}>
              <Input.Password placeholder="请输入密码（至少8位，含大小写字母和数字）" />
            </Form.Item>
          )}
          <Form.Item label="角色" name="role" rules={[{ required: true, message: '请选择角色' }]}>
            <Select>
              <Option value="user">普通用户</Option>
              <Option value="admin">管理员</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;