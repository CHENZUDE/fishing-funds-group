# 自定义分组功能使用指南

## 功能概述

Fishing Funds 现已支持**自定义分组**功能，允许用户按需创建和管理自定义的基金和股票分组，方便对投资组合进行灵活分类和管理。

## 功能特性

✅ **自定义分组创建与管理**
- 创建无限数量的基金/股票分组
- 为分组设置自定义名称和颜色
- 编辑和删除已有分组

✅ **灵活的分组管理**
- 将基金/股票添加到任意分组
- 一个基金/股票可属于多个分组
- 快速添加/移除分组内的项目

✅ **数据持久化**
- 自定义分组配置自动保存到本地存储
- 支持多设备同步（通过 iCloud/OneDrive 等方式）
- 支持备份和导出

## 使用方法

### 1. 打开分组管理面板

在设置或钱包工具栏中，找到"自定义分组"选项，点击打开分组管理对话框。

### 2. 创建新分组

#### 基金分组
```typescript
// 在代码中创建基金分组
dispatch(addFundGroupAction({
  name: '科技基金',
  codes: [],  // 初始为空
  color: '#1890ff'  // 可选：指定分组颜色
}));
```

#### 股票分组
```typescript
// 在代码中创建股票分组
dispatch(addStockGroupAction({
  name: '蓝筹股',
  codes: [],
  color: '#52c41a'
}));
```

### 3. 添加项目到分组

#### 使用 Hook
```typescript
import { useCustomGroups } from '@/utils/hooks';

function MyComponent() {
  const { addFundToGroup, addStockToGroup } = useCustomGroups();

  const handleAddFund = (groupId: string, fundCode: string) => {
    addFundToGroup(groupId, fundCode);  // 将基金添加到分组
  };

  const handleAddStock = (groupId: string, stockCode: string) => {
    addStockToGroup(groupId, stockCode);  // 将股票添加到分组
  };

  return (/* JSX */);
}
```

#### 使用 Redux Action
```typescript
import { addCodeToFundGroupAction, addCodeToStockGroupAction } from '@/store/features/customGroup';

// 添加基金到分组
dispatch(addCodeToFundGroupAction({
  groupId: 'group-id-123',
  code: '320007'  // 基金代码
}));

// 添加股票到分组
dispatch(addCodeToStockGroupAction({
  groupId: 'group-id-456',
  code: 'SH600000'  // 股票代码
}));
```

### 4. 查询分组

```typescript
const { fundGroups, stockGroups, getFundGroups, getStockGroups } = useCustomGroups();

// 获取所有基金分组
const allFundGroups = fundGroups;

// 获取指定基金所属的分组
const groupsForFund = getFundGroups('320007');

// 获取指定股票所属的分组
const groupsForStock = getStockGroups('SH600000');
```

### 5. 编辑分组

```typescript
import {
  updateFundGroupAction,
  updateStockGroupAction
} from '@/store/features/customGroup';

// 编辑基金分组
dispatch(updateFundGroupAction({
  id: 'group-id-123',
  name: '新分组名称',
  color: '#ff7a45'
}));

// 编辑股票分组
dispatch(updateStockGroupAction({
  id: 'group-id-456',
  name: '新分组名称',
  color: '#52c41a'
}));
```

### 6. 删除分组

```typescript
import { deleteFundGroupAction, deleteStockGroupAction } from '@/store/features/customGroup';

// 删除基金分组
dispatch(deleteFundGroupAction('group-id-123'));

// 删除股票分组
dispatch(deleteStockGroupAction('group-id-456'));
```

### 7. 移除项目

```typescript
import {
  removeCodeFromFundGroupAction,
  removeCodeFromStockGroupAction
} from '@/store/features/customGroup';

// 从基金分组移除基金
dispatch(removeCodeFromFundGroupAction({
  groupId: 'group-id-123',
  code: '320007'
}));

// 从股票分组移除股票
dispatch(removeCodeFromStockGroupAction({
  groupId: 'group-id-456',
  code: 'SH600000'
}));
```

## 组件集成

### CustomGroupManager 组件

用于管理分组的 UI 组件：

```tsx
import CustomGroupManager from '@/components/CustomGroupManager';
import { useState } from 'react';

function SettingsPage() {
  const [fundGroupManagerVisible, setFundGroupManagerVisible] = useState(false);
  const [stockGroupManagerVisible, setStockGroupManagerVisible] = useState(false);

  return (
    <>
      <button onClick={() => setFundGroupManagerVisible(true)}>
        管理基金分组
      </button>
      <button onClick={() => setStockGroupManagerVisible(true)}>
        管理股票分组
      </button>

      <CustomGroupManager
        visible={fundGroupManagerVisible}
        type="fund"
        onClose={() => setFundGroupManagerVisible(false)}
      />

      <CustomGroupManager
        visible={stockGroupManagerVisible}
        type="stock"
        onClose={() => setStockGroupManagerVisible(false)}
      />
    </>
  );
}
```

## 数据结构

### CustomGroup 接口

```typescript
interface CustomGroup {
  id: string;           // 唯一标识符（UUID）
  name: string;        // 分组名称
  type: 'fund' | 'stock';  // 分组类型
  codes: string[];     // 包含的基金/股票代码列表
  color?: string;      // 分组颜色（可选）
}
```

### Redux Store 结构

```typescript
store.customGroup = {
  fundGroups: CustomGroup[],    // 基金分组列表
  stockGroups: CustomGroup[]    // 股票分组列表
}
```

## 存储与同步

### 本地存储

自定义分组配置通过 Electron Store 保存在本地：

```
存储键: 'CUSTOM_GROUP_SETTING'
存储值: {
  fundGroups: CustomGroup[],
  stockGroups: CustomGroup[]
}
```

### 云同步

支持通过用户指定的路径进行云同步：
1. 在设置 → 配置同步中，启用"配置同步"
2. 指定同步路径（如 iCloud、OneDrive 等）
3. 自定义分组配置会随其他配置一起同步

## API 参考

### Actions

| Action | 描述 | 参数 |
|--------|------|------|
| `initCustomGroupsAction` | 初始化分组 | `{ fundGroups?, stockGroups? }` |
| `addFundGroupAction` | 创建基金分组 | `{ name, codes?, color? }` |
| `addStockGroupAction` | 创建股票分组 | `{ name, codes?, color? }` |
| `updateFundGroupAction` | 更新基金分组 | `{ id, name?, codes?, color? }` |
| `updateStockGroupAction` | 更新股票分组 | `{ id, name?, codes?, color? }` |
| `deleteFundGroupAction` | 删除基金分组 | `id` |
| `deleteStockGroupAction` | 删除股票分组 | `id` |
| `addCodeToFundGroupAction` | 添加基金到分组 | `{ groupId, code }` |
| `addCodeToStockGroupAction` | 添加股票到分组 | `{ groupId, code }` |
| `removeCodeFromFundGroupAction` | 从分组移除基金 | `{ groupId, code }` |
| `removeCodeFromStockGroupAction` | 从分组移除股票 | `{ groupId, code }` |

### Hooks

```typescript
useCustomGroups() => {
  fundGroups: CustomGroup[];
  stockGroups: CustomGroup[];
  addFundToGroup: (groupId: string, code: string) => void;
  addStockToGroup: (groupId: string, code: string) => void;
  removeFundFromGroup: (groupId: string, code: string) => void;
  removeStockFromGroup: (groupId: string, code: string) => void;
  getFundGroups: (code: string) => CustomGroup[];
  getStockGroups: (code: string) => CustomGroup[];
}
```

## 示例场景

### 场景 1：按行业分组

```typescript
// 创建科技行业基金分组
dispatch(addFundGroupAction({
  name: '科技行业',
  color: '#1890ff',
  codes: ['320007', '110022', '519674']  // 科技相关基金代码
}));

// 创建消费行业基金分组
dispatch(addFundGroupAction({
  name: '消费行业',
  color: '#52c41a',
  codes: ['470018', '090010', '470002']  // 消费相关基金代码
}));
```

### 场景 2：按风险等级分组

```typescript
// 高风险分组
dispatch(addStockGroupAction({
  name: '高风险',
  color: '#ff4d4f',
  codes: ['SH600123', 'SZ000456']
}));

// 低风险分组
dispatch(addStockGroupAction({
  name: '低风险',
  color: '#52c41a',
  codes: ['SH600000', 'SH601988']
}));
```

### 场景 3：动态管理分组

```typescript
import { useCustomGroups } from '@/utils/hooks';

function DynamicGroupManager() {
  const { fundGroups, addFundToGroup, removeFundFromGroup } = useCustomGroups();

  const moveToGroup = (fundCode: string, fromGroupId: string, toGroupId: string) => {
    removeFundFromGroup(fromGroupId, fundCode);
    addFundToGroup(toGroupId, fundCode);
  };

  return (
    // JSX 实现分组移动功能
  );
}
```

## 注意事项

⚠️ **关键要点**

1. **分组 ID 的唯一性**：分组 ID 由系统自动生成（UUID），无需手动指定
2. **代码重复**：一个基金/股票可以出现在多个分组中
3. **删除行为**：删除分组时，其中的项目不会被删除，仅删除分组关联
4. **颜色格式**：颜色值支持 Hex (#RRGGBB) 和 RGB 格式
5. **性能考虑**：建议分组数量控制在 50 个以内，每个分组内项目数 1000 以内

## 故障排除

### 问题：分组数据没有保存

**解决方案**：
- 确保配置监听器已启用（检查 `config.listener.ts`）
- 检查 Electron Store 是否正确初始化
- 查看浏览器控制台是否有错误信息

### 问题：创建分组时提示分组名称为空

**解决方案**：
- 确保表单验证正确
- 检查输入框是否绑定正确的字段

### 问题：分组在其他设备上没有同步

**解决方案**：
- 启用设置中的"配置同步"选项
- 确保云存储路径配置正确
- 检查磁盘空间和网络连接

## 未来规划

🚀 **计划中的增强功能**

- [ ] 分组排序和拖拽重排
- [ ] 分组导入/导出
- [ ] 分组共享功能
- [ ] 自动分组规则（基于条件自动分配）
- [ ] 分组快速筛选视图
- [ ] 分组统计和分析
