import React from 'react';
import { Dropdown, Button, Modal, Input, Space, Spin } from 'antd';
import { RiAddLine } from 'react-icons/ri';
import { useAppSelector, useAppDispatch } from '@/utils/hooks';
import { addCodeToFundGroupAction, addFundGroupAction } from '@/store/features/customGroup';
import styles from './index.module.css';

interface GroupMenuProps {
  fundCode: string;
  onSuccess?: () => void;
}

const GroupMenu: React.FC<GroupMenuProps> = ({ fundCode, onSuccess }) => {
  const dispatch = useAppDispatch();
  const fundGroups = useAppSelector((state) => state.customGroup.fundGroups);
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [newGroupName, setNewGroupName] = React.useState('');

  // 获取代码已在的分组
  const groupsWithCode = fundGroups.filter((g) => g.codes.includes(fundCode));

  const handleAddToGroup = (groupId: string) => {
    dispatch(addCodeToFundGroupAction({ groupId, code: fundCode }));
    onSuccess?.();
  };

  const handleCreateAndAdd = () => {
    if (!newGroupName.trim()) return;
    dispatch(
      addFundGroupAction({
        name: newGroupName,
        codes: [fundCode],
      })
    );
    setNewGroupName('');
    setIsAddingNew(false);
    onSuccess?.();
  };

  const items = [
    ...fundGroups.map((group) => ({
      key: group.id,
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{group.name}</span>
          {groupsWithCode.some((g) => g.id === group.id) && <span style={{ color: 'green' }}>✓</span>}
        </div>
      ),
      onClick: () => handleAddToGroup(group.id),
    })),
    { type: 'divider' as const },
    {
      key: 'add-new',
      label: '创建新分组',
      onClick: () => setIsAddingNew(true),
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} trigger={['click']}>
        <Button
          type="text"
          size="small"
          icon={<RiAddLine />}
          title="添加到分组"
          onClick={(e) => e.stopPropagation()}
        />
      </Dropdown>

      <Modal
        title="创建新分组"
        open={isAddingNew}
        onOk={handleCreateAndAdd}
        onCancel={() => {
          setIsAddingNew(false);
          setNewGroupName('');
        }}
        width={400}
      >
        <Input
          placeholder="输入分组名称"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          maxLength={20}
          autoFocus
          onPressEnter={handleCreateAndAdd}
        />
      </Modal>
    </>
  );
};

export default GroupMenu;
