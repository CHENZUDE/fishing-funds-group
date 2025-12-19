import listenerMiddleware from '@/store/listeners';
import { syncFavoriteQuotationMapAction } from '@/store/features/quotation';
import { syncCoinsConfigAction } from '@/store/features/coin';
import { syncSettingAction } from '@/store/features/setting';
import { syncZindexesConfigAction } from '@/store/features/zindex';
import { syncWebConfigAction } from '@/store/features/web';
import { changeCurrentWalletCodeAction, syncWalletsConfigAction } from '@/store/features/wallet';
import { syncTranslateSettingAction } from '@/store/features/translate';
import {
  addFundGroupAction,
  addStockGroupAction,
  updateFundGroupAction,
  updateStockGroupAction,
  deleteFundGroupAction,
  deleteStockGroupAction,
  updateFundGroupOrderAction,
  updateStockGroupOrderAction,
  updateFundAllGroupOrderAction,
  updateStockAllGroupOrderAction,
  addCodeToFundGroupAction,
  addCodeToStockGroupAction,
  removeCodeFromFundGroupAction,
  removeCodeFromStockGroupAction,
} from '@/store/features/customGroup';
import * as CONST from '@/constants';

const electronStore = window.contextModules.electronStore;

const configListener = () => {
  listenerMiddleware.startListening({
    actionCreator: syncCoinsConfigAction,
    effect: async (action) => {
      electronStore.set('config', CONST.STORAGE.COIN_SETTING, action.payload.coinConfig);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncFavoriteQuotationMapAction,
    effect: async (action) => {
      electronStore.set('config', CONST.STORAGE.FAVORITE_QUOTATION_MAP, action.payload);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncSettingAction,
    effect: async (action) => {
      electronStore.set('config', CONST.STORAGE.SYSTEM_SETTING, action.payload);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: changeCurrentWalletCodeAction,
    effect: async (action) => {
      electronStore.set('config', CONST.STORAGE.CURRENT_WALLET_CODE, action.payload);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncWalletsConfigAction,
    effect: async (action) => {
      electronStore.set('config', CONST.STORAGE.WALLET_SETTING, action.payload.walletConfig);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncWebConfigAction,
    effect: async (action) => {
      electronStore.set('config', CONST.STORAGE.WEB_SETTING, action.payload.webConfig);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncZindexesConfigAction,
    effect: async (action) => {
      electronStore.set('config', CONST.STORAGE.ZINDEX_SETTING, action.payload.zindexConfig);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: syncTranslateSettingAction,
    effect: async (action) => {
      electronStore.set('config', CONST.STORAGE.TRANSLATE_SETTING, action.payload);
    },
  });

  // 自定义分组保存监听
  const saveCustomGroups = (getState: any) => {
    const state = getState();
    const { fundGroups, stockGroups, fundGroupOrder, stockGroupOrder, fundAllGroupOrder, stockAllGroupOrder } = state.customGroup;
    electronStore.set('config', CONST.STORAGE.CUSTOM_GROUP_SETTING, {
      fundGroups,
      stockGroups,
      fundGroupOrder,
      stockGroupOrder,
      fundAllGroupOrder,
      stockAllGroupOrder,
    });
  };

  listenerMiddleware.startListening({
    actionCreator: addFundGroupAction,
    effect: async (action, { getState }) => {
      saveCustomGroups(getState);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: addStockGroupAction,
    effect: async (action, { getState }) => {
      saveCustomGroups(getState);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: updateFundGroupAction,
    effect: async (action, { getState }) => {
      saveCustomGroups(getState);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: updateStockGroupAction,
    effect: async (action, { getState }) => {
      saveCustomGroups(getState);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: deleteFundGroupAction,
    effect: async (action, { getState }) => {
      saveCustomGroups(getState);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: deleteStockGroupAction,
    effect: async (action, { getState }) => {
      saveCustomGroups(getState);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: updateFundGroupOrderAction,
    effect: async (action, { getState }) => {
      saveCustomGroups(getState);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: updateStockGroupOrderAction,
    effect: async (action, { getState }) => {
      saveCustomGroups(getState);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: addCodeToFundGroupAction,
    effect: async (action, { getState }) => {
      saveCustomGroups(getState);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: addCodeToStockGroupAction,
    effect: async (action, { getState }) => {
      saveCustomGroups(getState);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: removeCodeFromFundGroupAction,
    effect: async (action, { getState }) => {
      saveCustomGroups(getState);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: removeCodeFromStockGroupAction,
    effect: async (action, { getState }) => {
      saveCustomGroups(getState);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: updateFundAllGroupOrderAction,
    effect: async (action, { getState }) => {
      saveCustomGroups(getState);
    },
  });
  listenerMiddleware.startListening({
    actionCreator: updateStockAllGroupOrderAction,
    effect: async (action, { getState }) => {
      saveCustomGroups(getState);
    },
  });
};
export default configListener;
