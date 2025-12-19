import React from 'react';
import { Dropdown, Button, Modal, Input } from 'antd';
import { RiAddLine } from 'react-icons/ri';
import { useAppSelector, useAppDispatch } from '@/utils/hooks';
import { addCodeToStockGroupAction, addStockGroupAction } from '@/store/features/customGroup';

interface GroupMenuProps {
  stockCode: string;
  onSuccess?: () => void;
}

const GroupMenu: React.FC<GroupMenuProps> = ({ stockCode, onSuccess }) => {
  const dispatch = useAppDispatch();
  const stockGroups = useAppSelector((state) => state.customGroup.stockGroups);
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [newGroupName, setNewGroupName] = React.useState('');

  // 获取代码已在的分组
  const groupsWithCode = stockGroups.filter((g) => g.codes.includes(stockCode));

  const handleAddToGroup = (groupId: string) => {
    dispatch(addCodeToStockGroupAction({ groupId, code: stockCode }));
    onSuccess?.();
  };

  const handleCreateAndAdd = () => {
    if (!newGroupName.trim()) return;
    dispatch(
      addStockGroupAction({
        name: newGroupName,
        codes: [stockCode],
      })
    );
    setNewGroupName('');
    setIsAddingNew(false);
    onSuccess?.();
  };

  const items = [
    ...stockGroups.map((group) => ({
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
