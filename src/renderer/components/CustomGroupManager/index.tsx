import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  List,
  Popconfirm,
  Tooltip,
  Empty,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import {
  addFundGroupAction,
  addStockGroupAction,
  updateFundGroupAction,
  updateStockGroupAction,
  deleteFundGroupAction,
  deleteStockGroupAction,
} from '@/store/features/customGroup';
import styles from './index.module.css';

interface CustomGroupManagerProps {
  visible: boolean;
  type: 'fund' | 'stock';
  onClose: () => void;
}

const CustomGroupManager: React.FC<CustomGroupManagerProps> = ({ visible, type, onClose }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  const groups = useAppSelector((state) =>
    type === 'fund' ? state.customGroup.fundGroups : state.customGroup.stockGroups
  );

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const action = type === 'fund' ? addFundGroupAction : addStockGroupAction;
      dispatch(action({ name: values.groupName }));
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleEdit = (group: Wallet.CustomGroup) => {
    setEditingId(group.id);
    form.setFieldValue('groupName', group.name);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const action = type === 'fund' ? updateFundGroupAction : updateStockGroupAction;
      dispatch(action({ id: editingId!, name: values.groupName }));
      setEditingId(null);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleDelete = (id: string) => {
    const action = type === 'fund' ? deleteFundGroupAction : deleteStockGroupAction;
    dispatch(action(id));
  };

  const handleCancel = () => {
    setEditingId(null);
    form.resetFields();
  };

  return (
    <Modal
      title={`${type === 'fund' ? '基金' : '股票'}自定义分组`}
      open={visible}
      onCancel={onClose}
      width={500}
      footer={null}
    >
      <div className={styles.container}>
        <div className={styles.formSection}>
          <h3>{editingId ? '编辑分组' : '创建新分组'}</h3>
          <Form form={form} layout="vertical">
            <Form.Item
              name="groupName"
              label="分组名称"
              rules={[
                { required: true, message: '请输入分组名称' },
                { max: 20, message: '分组名称最多20个字符' },
              ]}
            >
              <Input placeholder="输入分组名称" />
            </Form.Item>

            <Form.Item>
              <Space>
                {editingId ? (
                  <>
                    <Button type="primary" onClick={handleUpdate}>
                      更新分组
                    </Button>
                    <Button onClick={handleCancel}>取消</Button>
                  </>
                ) : (
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    创建分组
                  </Button>
                )}
              </Space>
            </Form.Item>
          </Form>
        </div>

        <div className={styles.listSection}>
          <h3>分组列表 ({groups.length})</h3>
          {groups.length === 0 ? (
            <Empty description="暂无分组" />
          ) : (
            <List
              dataSource={groups}
              renderItem={(group) => (
                <List.Item
                  key={group.id}
                  extra={
                    <Space>
                      <Tooltip title="编辑">
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(group)}
                        />
                      </Tooltip>
                      <Popconfirm
                        title="删除分组"
                        description="删除此分组？其中的项目不会被删除。"
                        onConfirm={() => handleDelete(group.id)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  }
                >
                  <List.Item.Meta
                    title={group.name}
                    description={`包含 ${group.codes.length} 项`}
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CustomGroupManager;
