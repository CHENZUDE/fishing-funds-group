# 分组功能完整使用指南

## 功能概述

现在你拥有了一个强大的分组系统，支持以下特性：

### 1. **添加基金/股票到分组**
在基金或股票的展开详情中，有一个"+"按钮，点击可以：
- 将该基金/股票添加到现有分组
- 创建新分组并立即添加该基金/股票
- 清晰显示该基金/股票已经在哪些分组中（✓ 标记）

### 2. **未分组标签页**
- 在"基金"和"股票"标签栏最后会自动显示"未分组"标签页
- 显示所有未被添加到任何自定义分组的基金或股票
- 便于快速查看和管理未分类的项目

### 3. **自定义分组排序**
- 进入 设置 → 自定义分组
- 点击"排序分组"按钮可以拖拽调整分组顺序
- 排序会自动保存，下次打开应用时保持顺序
- 支持基金分组和股票分组分别排序

### 4. **分组管理完整流程**

```
步骤1: 打开设置 → 自定义分组

步骤2a: 管理分组
- 点击"管理基金分组"或"管理股票分组"
- 创建新分组、编辑分组名称、删除分组
- 查看每个分组中有多少个项目

步骤2b: 排序分组
- 点击"排序分组"
- 拖拽调整分组显示顺序
- 点击保存

步骤3: 添加项目到分组
- 在主界面展开某个基金/股票
- 点击右侧的"+"按钮
- 从菜单中选择分组或创建新分组
- 已添加的分组会显示✓标记
```

## 使用场景

### 场景1: 按风险等级分类
```
创建分组：
- 稳健基金
- 平衡基金
- 激进基金
- 新兴基金

然后在每个基金旁边的菜单中分配到对应分组
```

### 场景2: 按投资主题分类
```
基金分组：
- 科技基金
- 消费基金
- 医药基金
- 新能源基金

股票分组：
- 科技股
- 金融股
- 地产股
- 消费股
```

### 场景3: 按持仓时间分类
```
- 长期持有
- 中期持有
- 短期操作
- 待观察
```

## 技术实现细节

### 数据结构
```typescript
interface CustomGroup {
  id: string;           // 唯一标识 (UUID v4)
  name: string;         // 分组名称
  type: 'fund' | 'stock'; // 分组类型
  codes: string[];      // 包含的基金/股票代码列表
}

// Redux 状态
{
  customGroup: {
    fundGroups: CustomGroup[];      // 基金分组列表
    fundGroupOrder: string[];       // 基金分组排序（ID数组）
    stockGroups: CustomGroup[];     // 股票分组列表
    stockGroupOrder: string[];      // 股票分组排序（ID数组）
  }
}
```

### 存储位置
- 所有分组数据存储在 Electron Store 中
- 存储键：`config.CUSTOM_GROUP_SETTING`
- 包含：fundGroups、stockGroups、fundGroupOrder、stockGroupOrder
- 数据在应用启动时自动加载

### 后端操作

#### 创建分组
```typescript
dispatch(addFundGroupAction({
  name: '我的分组',
  codes: ['110022']  // 可选，初始代码
}))
```

#### 添加代码到分组
```typescript
dispatch(addCodeToFundGroupAction({
  groupId: 'group-id',
  code: '110022'
}))
```

#### 从分组删除代码
```typescript
dispatch(removeCodeFromFundGroupAction({
  groupId: 'group-id',
  code: '110022'
}))
```

#### 更新分组排序
```typescript
dispatch(updateFundGroupOrderAction(['id1', 'id2', 'id3']))
```

#### 删除分组
```typescript
dispatch(deleteFundGroupAction('group-id'))
```

## UI 组件位置

1. **GroupMenu** - 基金/股票卡片中的菜单
   - 位置：`src/renderer/components/Home/FundView/FundRow/GroupMenu.tsx`
   - 功能：快速添加到分组或创建新分组

2. **GroupSortManager** - 分组排序管理器
   - 位置：`src/renderer/components/GroupSortManager/index.tsx`
   - 功能：拖拽排序所有分组

3. **CustomGroupManager** - 分组管理器（创建/编辑/删除）
   - 位置：`src/renderer/components/CustomGroupManager/index.tsx`
   - 功能：完整的分组 CRUD 操作

## 常见问题

### Q: 为什么我的分组在重启后消失了？
**A:** 检查以下几点：
1. 确认分组创建后有保存提示
2. 查看浏览器开发者工具的 Network 标签，看是否有保存请求
3. 重启应用后等待几秒钟，分组从 Electron Store 加载可能需要时间

### Q: 如何批量添加多个基金到一个分组？
**A:** 目前需要逐个添加，步骤：
1. 打开第一个基金的详情
2. 点击"+"按钮选择分组
3. 对下一个基金重复操作
（批量操作功能可在后续版本添加）

### Q: 分组顺序改了但没有显示？
**A:** 
1. 在 设置 → 自定义分组 中点击"排序分组"
2. 拖拽调整顺序（确保有视觉反馈）
3. 点击"保存"按钮
4. 返回主界面，分组应该按新顺序显示

### Q: 能不能把分组导出或分享给其他人？
**A:** 当前版本还不支持导出/导入功能。可通过以下方式：
1. 找到 Electron Store 的配置文件位置
2. 手动复制 `CUSTOM_GROUP_SETTING` 配置
3. （后续版本会添加导出/导入 UI）

## 最佳实践

1. **命名清晰**：使用易理解的分组名称，避免含糊不清
2. **合理分类**：不要创建过多分组，建议 5-10 个为最佳
3. **定期整理**：定期检查"未分组"标签页，处理新增的基金/股票
4. **避免重复**：同一个基金/股票可以在多个分组中，但会增加管理复杂度
5. **备份配置**：重要的分组配置可手动备份配置文件

## 后续计划

计划在未来版本中添加以下功能：
- [ ] 批量添加/删除代码功能
- [ ] 分组导出/导入（JSON 格式）
- [ ] 分组模板（预设分类方案）
- [ ] 分组颜色标签（已设计，当前未启用）
- [ ] 搜索和筛选分组
- [ ] 分组统计信息（收益率、总金额等）

## 反馈与支持

如遇到任何问题，请提交反馈！
