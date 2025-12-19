import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface CustomGroupState {
  fundGroups: Wallet.CustomGroup[];
  stockGroups: Wallet.CustomGroup[];
  fundGroupOrder: string[]; // 自定义基金分组排序
  stockGroupOrder: string[]; // 自定义股票分组排序
  fundAllGroupOrder: string[]; // 所有基金分组排序（包括固定分组）
  stockAllGroupOrder: string[]; // 所有股票分组排序（包括固定分组）
  hiddenFundFixedGroups: string[]; // 隐藏的基金固定分组 keys
  hiddenStockFixedGroups: string[]; // 隐藏的股票固定分组 keys
}

const initialState: CustomGroupState = {
  fundGroups: [],
  stockGroups: [],
  fundGroupOrder: [],
  stockGroupOrder: [],
  fundAllGroupOrder: [],
  stockAllGroupOrder: [],
  hiddenFundFixedGroups: [],
  hiddenStockFixedGroups: [],
};

const customGroupSlice = createSlice({
  name: 'customGroup',
  initialState,
  reducers: {
    // 初始化分组
    initCustomGroupsAction(
      state,
      action: PayloadAction<{
        fundGroups?: Wallet.CustomGroup[];
        stockGroups?: Wallet.CustomGroup[];
        fundGroupOrder?: string[];
        stockGroupOrder?: string[];
      }>
    ) {
      if (action.payload.fundGroups) {
        state.fundGroups = action.payload.fundGroups;
        // 如果没有传入排序，就按创建顺序排序
        state.fundGroupOrder = action.payload.fundGroupOrder || action.payload.fundGroups.map((g) => g.id);
      }
      if (action.payload.stockGroups) {
        state.stockGroups = action.payload.stockGroups;
        state.stockGroupOrder = action.payload.stockGroupOrder || action.payload.stockGroups.map((g) => g.id);
      }
    },

    // 创建基金分组
    addFundGroupAction(
      state,
      action: PayloadAction<{ name: string; codes?: string[]; color?: string }>
    ) {
      const id = uuidv4();
      state.fundGroups.push({
        id,
        name: action.payload.name,
        type: 'fund',
        codes: action.payload.codes || [],
        color: action.payload.color,
      });
      state.fundGroupOrder.push(id);
    },

    // 创建股票分组
    addStockGroupAction(
      state,
      action: PayloadAction<{ name: string; codes?: string[]; color?: string }>
    ) {
      const id = uuidv4();
      state.stockGroups.push({
        id,
        name: action.payload.name,
        type: 'stock',
        codes: action.payload.codes || [],
        color: action.payload.color,
      });
      state.stockGroupOrder.push(id);
    },

    // 更新基金分组
    updateFundGroupAction(
      state,
      action: PayloadAction<{
        id: string;
        name?: string;
        codes?: string[];
        color?: string;
      }>
    ) {
      const group = state.fundGroups.find((g) => g.id === action.payload.id);
      if (group) {
        if (action.payload.name !== undefined) group.name = action.payload.name;
        if (action.payload.codes !== undefined) group.codes = action.payload.codes;
        if (action.payload.color !== undefined) group.color = action.payload.color;
      }
    },

    // 更新股票分组
    updateStockGroupAction(
      state,
      action: PayloadAction<{
        id: string;
        name?: string;
        codes?: string[];
        color?: string;
      }>
    ) {
      const group = state.stockGroups.find((g) => g.id === action.payload.id);
      if (group) {
        if (action.payload.name !== undefined) group.name = action.payload.name;
        if (action.payload.codes !== undefined) group.codes = action.payload.codes;
        if (action.payload.color !== undefined) group.color = action.payload.color;
      }
    },

    // 删除基金分组
    deleteFundGroupAction(state, action: PayloadAction<string>) {
      state.fundGroups = state.fundGroups.filter((g) => g.id !== action.payload);
      state.fundGroupOrder = state.fundGroupOrder.filter((id) => id !== action.payload);
    },

    // 删除股票分组
    deleteStockGroupAction(state, action: PayloadAction<string>) {
      state.stockGroups = state.stockGroups.filter((g) => g.id !== action.payload);
      state.stockGroupOrder = state.stockGroupOrder.filter((id) => id !== action.payload);
    },

    // 更新基金分组排序
    updateFundGroupOrderAction(state, action: PayloadAction<string[]>) {
      state.fundGroupOrder = action.payload;
    },

    // 更新股票分组排序
    updateStockGroupOrderAction(state, action: PayloadAction<string[]>) {
      state.stockGroupOrder = action.payload;
    },

    // 更新所有基金分组排序（包括固定分组）
    updateFundAllGroupOrderAction(state, action: PayloadAction<string[]>) {
      state.fundAllGroupOrder = action.payload;
    },

    // 更新所有股票分组排序（包括固定分组）
    updateStockAllGroupOrderAction(state, action: PayloadAction<string[]>) {
      state.stockAllGroupOrder = action.payload;
    },

    // 添加代码到基金分组
    addCodeToFundGroupAction(state, action: PayloadAction<{ groupId: string; code: string }>) {
      const group = state.fundGroups.find((g) => g.id === action.payload.groupId);
      if (group && !group.codes.includes(action.payload.code)) {
        group.codes.push(action.payload.code);
      }
    },

    // 添加代码到股票分组
    addCodeToStockGroupAction(state, action: PayloadAction<{ groupId: string; code: string }>) {
      const group = state.stockGroups.find((g) => g.id === action.payload.groupId);
      if (group && !group.codes.includes(action.payload.code)) {
        group.codes.push(action.payload.code);
      }
    },

    // 从基金分组删除代码
    removeCodeFromFundGroupAction(
      state,
      action: PayloadAction<{ groupId: string; code: string }>
    ) {
      const group = state.fundGroups.find((g) => g.id === action.payload.groupId);
      if (group) {
        group.codes = group.codes.filter((c) => c !== action.payload.code);
      }
    },

    // 从股票分组删除代码
    removeCodeFromStockGroupAction(
      state,
      action: PayloadAction<{ groupId: string; code: string }>
    ) {
      const group = state.stockGroups.find((g) => g.id === action.payload.groupId);
      if (group) {
        group.codes = group.codes.filter((c) => c !== action.payload.code);
      }
    },

    // 隐藏基金固定分组
    hideFundFixedGroupAction(state, action: PayloadAction<string>) {
      if (!state.hiddenFundFixedGroups.includes(action.payload)) {
        state.hiddenFundFixedGroups.push(action.payload);
      }
    },

    // 显示基金固定分组
    showFundFixedGroupAction(state, action: PayloadAction<string>) {
      state.hiddenFundFixedGroups = state.hiddenFundFixedGroups.filter(
        (key) => key !== action.payload
      );
    },

    // 隐藏股票固定分组
    hideStockFixedGroupAction(state, action: PayloadAction<string>) {
      if (!state.hiddenStockFixedGroups.includes(action.payload)) {
        state.hiddenStockFixedGroups.push(action.payload);
      }
    },

    // 显示股票固定分组
    showStockFixedGroupAction(state, action: PayloadAction<string>) {
      state.hiddenStockFixedGroups = state.hiddenStockFixedGroups.filter(
        (key) => key !== action.payload
      );
    },
  },
});

export const {
  initCustomGroupsAction,
  addFundGroupAction,
  addStockGroupAction,
  updateFundGroupAction,
  updateStockGroupAction,
  deleteFundGroupAction,
  deleteStockGroupAction,
  addCodeToFundGroupAction,
  addCodeToStockGroupAction,
  removeCodeFromFundGroupAction,
  removeCodeFromStockGroupAction,
  updateFundGroupOrderAction,
  updateStockGroupOrderAction,
  updateFundAllGroupOrderAction,
  updateStockAllGroupOrderAction,
  hideFundFixedGroupAction,
  showFundFixedGroupAction,
  hideStockFixedGroupAction,
  showStockFixedGroupAction,
} = customGroupSlice.actions;

export default customGroupSlice.reducer;
