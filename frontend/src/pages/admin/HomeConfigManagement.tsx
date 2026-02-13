import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Switch, Button, App, Spin, Space, Alert, Table, Popconfirm, Tooltip } from 'antd';
import { SaveOutlined, ReloadOutlined, PlusOutlined, DeleteOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { homeConfigService } from '../../services/homeConfigService';
import type { HomeConfig, SearchKeyword } from '../../types';
import { useHomeConfig } from '../../context/HomeConfigContext';
import { useAuth } from '../../context/AuthContext';

const HomeConfigManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [config, setConfig] = useState<HomeConfig | null>(null);
  const [keywords, setKeywords] = useState<SearchKeyword[]>([]);
  const { message: appMessage } = App.useApp();
  const { refreshConfig } = useHomeConfig();
  const { isSuperAdmin } = useAuth();

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await homeConfigService.getHomeConfig();
      if (response && response.config) {
        setConfig(response.config);
        setKeywords(response.config.search_keywords || []);
        form.setFieldsValue({
          site_name: response.config.site_name || '',
          site_name_visible: response.config.site_name_visible ?? true,
          hero_title: response.config.hero_title || '',
          hero_title_visible: response.config.hero_title_visible ?? true,
          hero_subtitle: response.config.hero_subtitle || '',
          hero_subtitle_visible: response.config.hero_subtitle_visible ?? true,
          footer_text: response.config.footer_text || '',
          footer_text_visible: response.config.footer_text_visible ?? true,
          terminal_text: response.config.terminal_text || ''
        });
      }
    } catch (error: any) {
      appMessage.error(`获取首页配置失败: ${error?.message || '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConfig(); }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await homeConfigService.updateHomeConfig({ ...values, search_keywords: keywords });
      appMessage.success('首页配置更新成功');
      await refreshConfig();
      fetchConfig();
    } catch (error: any) {
      appMessage.error(`更新失败: ${error?.message || '未知错误'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddKeyword = () => {
    if (keywords.length >= 8) { appMessage.warning('最多只能添加8个关键词'); return; }
    const newId = keywords.length > 0 ? Math.max(...keywords.map(k => k.id), 0) + 1 : 1;
    const newKeyword: SearchKeyword = {
      id: newId, keyword: '', text: '', icon_type: 'search', color: '#1890ff',
      sort_order: keywords.length + 1, is_active: true,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    };
    setKeywords([...keywords, newKeyword]);
  };

  const handleDeleteKeyword = (id: number) => setKeywords(keywords.filter(k => k.id !== id));

  const handleMoveKeyword = (index: number, direction: 'up' | 'down') => {
    const newKeywords = [...keywords];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newKeywords[index], newKeywords[newIndex]] = [newKeywords[newIndex], newKeywords[index]];
    newKeywords.forEach((k, i) => { k.sort_order = i + 1; });
    setKeywords(newKeywords);
  };

  const removeSymbols = (text: string) => text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');

  const handleUpdateKeyword = (id: number, field: keyof SearchKeyword, value: any) => {
    const processedValue = field === 'text' ? removeSymbols(value) : value;
    setKeywords(keywords.map(k => k.id === id ? { ...k, [field]: processedValue } : k));
  };

  const handleReset = () => {
    if (config) {
      form.setFieldsValue({
        site_name: config.site_name, site_name_visible: config.site_name_visible,
        hero_title: config.hero_title, hero_title_visible: config.hero_title_visible,
        hero_subtitle: config.hero_subtitle, hero_subtitle_visible: config.hero_subtitle_visible,
        footer_text: config.footer_text, footer_text_visible: config.footer_text_visible,
        terminal_text: config.terminal_text
      });
      setKeywords(config.search_keywords || []);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Card title="首页配置管理" extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleReset} disabled={!isSuperAdmin}>重置</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSubmit} loading={submitting} disabled={!isSuperAdmin}>保存配置</Button>
        </Space>
      }>
        {!isSuperAdmin && <Alert message="权限限制" description="只有超级管理员可以修改首页配置" type="warning" showIcon style={{ marginBottom: '16px' }} />}
        {loading ? <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div> : (
          <Form form={form} layout="vertical" disabled={!isSuperAdmin}>
            <Card title="网站名称" size="small" style={{ marginBottom: '16px' }}>
              <Form.Item label="网站名称" name="site_name" rules={[{ required: true, message: '请输入网站名称' }]}><Input placeholder="请输入网站名称" maxLength={50} /></Form.Item>
              <Form.Item label="显示网站名称" name="site_name_visible" valuePropName="checked"><Switch /></Form.Item>
            </Card>
            <Card title="首页标题" size="small" style={{ marginBottom: '16px' }}>
              <Form.Item label="首页标题" name="hero_title" rules={[{ required: true, message: '请输入首页标题' }]}><Input placeholder="请输入首页标题" maxLength={50} /></Form.Item>
              <Form.Item label="显示首页标题" name="hero_title_visible" valuePropName="checked"><Switch /></Form.Item>
            </Card>
            <Card title="首页副标题" size="small" style={{ marginBottom: '16px' }}>
              <Form.Item label="首页副标题" name="hero_subtitle" rules={[{ required: true, message: '请输入首页副标题' }]}><Input placeholder="请输入首页副标题" maxLength={50} /></Form.Item>
              <Form.Item label="显示首页副标题" name="hero_subtitle_visible" valuePropName="checked"><Switch /></Form.Item>
            </Card>
            <Card title="页脚文字" size="small" style={{ marginBottom: '16px' }}>
              <Form.Item label="页脚文字" name="footer_text" rules={[{ required: true, message: '请输入页脚文字' }]} extra="提示：可以使用 {year} 作为年份占位符"><Input.TextArea placeholder="请输入页脚文字" rows={3} maxLength={200} showCount /></Form.Item>
              <Form.Item label="显示页脚文字" name="footer_text_visible" valuePropName="checked"><Switch /></Form.Item>
            </Card>
            <Card title="登录页终端文字" size="small" style={{ marginBottom: '16px' }}>
              <Form.Item label="终端文字内容" name="terminal_text"><Input placeholder="请输入终端文字内容" maxLength={200} /></Form.Item>
            </Card>
            <Card title={`搜索关键词 (${keywords.length}/8)`} size="small" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAddKeyword} disabled={!isSuperAdmin || keywords.length >= 8}>添加关键词</Button>}>
              <Alert message="关键词数量限制：最多8个" type="info" showIcon style={{ marginBottom: '12px' }} />
              <Table dataSource={keywords} rowKey="id" pagination={false} size="small" columns={[
                { title: '排序', key: 'sort', width: 80, render: (_: any, __: any, index: number) => (
                  <Space>
                    <Tooltip title="上移"><Button type="text" icon={<UpOutlined />} size="small" disabled={index === 0 || !isSuperAdmin} onClick={() => handleMoveKeyword(index, 'up')} /></Tooltip>
                    <Tooltip title="下移"><Button type="text" icon={<DownOutlined />} size="small" disabled={index === keywords.length - 1 || !isSuperAdmin} onClick={() => handleMoveKeyword(index, 'down')} /></Tooltip>
                  </Space>
                )},
                { title: '关键词', dataIndex: 'text', key: 'text', render: (text: string, record: SearchKeyword) => <Input value={text} placeholder="请输入关键词（仅支持中文、英文、数字）" disabled={!isSuperAdmin} onChange={(e) => handleUpdateKeyword(record.id, 'text', e.target.value)} /> },
                { title: '操作', key: 'action', width: 80, render: (_: any, record: SearchKeyword) => (
                  <Popconfirm title="确认删除" description="确定要删除这个关键词吗？" onConfirm={() => handleDeleteKeyword(record.id)} okText="确定" cancelText="取消" disabled={!isSuperAdmin}>
                    <Tooltip title="删除"><Button type="text" danger size="small" icon={<DeleteOutlined />} disabled={!isSuperAdmin} /></Tooltip>
                  </Popconfirm>
                )}
              ]} />
            </Card>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default HomeConfigManagement;