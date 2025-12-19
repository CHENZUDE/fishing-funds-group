import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Empty } from 'antd';
import { RiDragDropLine } from 'react-icons/ri';
import { useAppSelector, useAppDispatch } from '@/utils/hooks';
import {
  updateFundAllGroupOrderAction,
  updateStockAllGroupOrderAction,
} from '@/store/features/customGroup';
import styles from './index.module.css';

interface GroupSortManagerProps {
  visible: boolean;
  type: 'fund' | 'stock';
  onClose: () => void;
}

interface GroupItem {
  key: string;
  label: string;
  isFixed: boolean;
}

const GroupSortManager: React.FC<GroupSortManagerProps> = ({ visible, type, onClose }) => {
  const dispatch = useAppDispatch();
  const fundGroups = useAppSelector((state) => state.customGroup.fundGroups);
  const fundAllGroupOrder = useAppSelector((state) => state.customGroup.fundAllGroupOrder);
  const stockGroups = useAppSelector((state) => state.customGroup.stockGroups);
  const stockAllGroupOrder = useAppSelector((state) => state.customGroup.stockAllGroupOrder);

  // 定义固定分组
  const fixedFundGroups: GroupItem[] = [
    { key: '0', label: '全部', isFixed: true },
    { key: '1', label: '持有', isFixed: true },
    { key: '2', label: '自选', isFixed: true },
    { key: '3', label: '含成本价', isFixed: true },
    { key: '4', label: '净值更新', isFixed: true },
  ];

  const fixedStockGroups: GroupItem[] = [
    { key: String(-1), label: '全部', isFixed: true },
    { key: String(-2), label: '持有', isFixed: true },
    // 股票类型会从 stockTypesConfig 动态添加
  ];

  // 使用 useMemo 构建所有分组列表，响应式更新
  const allGroups = useMemo(() => {
    if (type === 'fund') {
      return [
        ...fixedFundGroups,
        { key: 'fund-ungrouped', label: '未分组', isFixed: true },
        ...fundGroups.map((g) => ({ key: `fund-group-${g.id}`, label: g.name, isFixed: false })),
      ];
    } else {
      return [
        ...fixedStockGroups,
        { key: 'stock-ungrouped', label: '未分组', isFixed: true },
        ...stockGroups.map((g) => ({ key: `stock-group-${g.id}`, label: g.name, isFixed: false })),
      ];
    }
  }, [type, fundGroups, stockGroups]);

  const savedOrder = type === 'fund' ? fundAllGroupOrder : stockAllGroupOrder;

  // 使用 useMemo 计算排序后的分组列表
  const orderedGroups = useMemo(() => {
    if (savedOrder.length > 0) {
      const ordered = savedOrder
        .map((key) => allGroups.find((g) => g.key === key))
        .filter((g) => g !== undefined) as GroupItem[];
      // 添加不在排序列表中的新分组
      const orderedKeys = new Set(ordered.map(g => g.key));
      const newGroups = allGroups.filter(g => !orderedKeys.has(g.key));
      return [...ordered, ...newGroups];
    }
    return allGroups;
  }, [allGroups, savedOrder]);

  const [localOrder, setLocalOrder] = useState<GroupItem[]>(orderedGroups);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // 当 modal 打开或分组列表变化时，更新本地状态
  useEffect(() => {
    if (visible) {
      setLocalOrder(orderedGroups);
      setDraggedIndex(null);
    }
  }, [visible, orderedGroups]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newOrder = [...localOrder];
    const draggedItem = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setLocalOrder(newOrder);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = () => {
    const newOrder = localOrder.map((g) => g.key);
    if (type === 'fund') {
      dispatch(updateFundAllGroupOrderAction(newOrder));
    } else {
      dispatch(updateStockAllGroupOrderAction(newOrder));
    }
    onClose();
  };

  const handleReset = () => {
    // 重置为默认顺序（不考虑保存的排序）
    setLocalOrder(allGroups);
    setDraggedIndex(null);
  };

  return (
    <Modal
      title={`排序${type === 'fund' ? '基金' : '股票'}分组`}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="reset" onClick={handleReset}>
          重置
        </Button>,
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave}>
          保存
        </Button>,
      ]}
      width={500}
    >
      {localOrder.length === 0 ? (
        <Empty description="暂无分组" />
      ) : (
        <div className={styles.sortList}>
          {localOrder.map((group, index) => (
            <div
              key={group.key}
              className={`${styles.sortItem} ${draggedIndex === index ? styles.dragging : ''}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <RiDragDropLine size={16} className={styles.dragHandle} />
              <span>{group.label}</span>
              {group.isFixed && <span className={styles.badge}>固定</span>}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default GroupSortManager;
