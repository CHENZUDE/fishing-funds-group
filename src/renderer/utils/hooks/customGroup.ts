import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import {
  addCodeToFundGroupAction,
  addCodeToStockGroupAction,
  removeCodeFromFundGroupAction,
  removeCodeFromStockGroupAction,
} from '@/store/features/customGroup';

/**
 * 自定义分组 Hook
 */
export const useCustomGroups = () => {
  const dispatch = useAppDispatch();
  const fundGroups = useAppSelector((state) => state.customGroup.fundGroups);
  const stockGroups = useAppSelector((state) => state.customGroup.stockGroups);

  // 将基金添加到分组
  const addFundToGroup = useCallback(
    (groupId: string, fundCode: string) => {
      dispatch(addCodeToFundGroupAction({ groupId, code: fundCode }));
    },
    [dispatch]
  );

  // 将股票添加到分组
  const addStockToGroup = useCallback(
    (groupId: string, stockCode: string) => {
      dispatch(addCodeToStockGroupAction({ groupId, code: stockCode }));
    },
    [dispatch]
  );

  // 从分组移除基金
  const removeFundFromGroup = useCallback(
    (groupId: string, fundCode: string) => {
      dispatch(removeCodeFromFundGroupAction({ groupId, code: fundCode }));
    },
    [dispatch]
  );

  // 从分组移除股票
  const removeStockFromGroup = useCallback(
    (groupId: string, stockCode: string) => {
      dispatch(removeCodeFromStockGroupAction({ groupId, code: stockCode }));
    },
    [dispatch]
  );

  // 获取指定基金所属的分组列表
  const getFundGroups = useCallback(
    (fundCode: string) => {
      return fundGroups.filter((group) => group.codes.includes(fundCode));
    },
    [fundGroups]
  );

  // 获取指定股票所属的分组列表
  const getStockGroups = useCallback(
    (stockCode: string) => {
      return stockGroups.filter((group) => group.codes.includes(stockCode));
    },
    [stockGroups]
  );

  return {
    fundGroups,
    stockGroups,
    addFundToGroup,
    addStockToGroup,
    removeFundFromGroup,
    removeStockFromGroup,
    getFundGroups,
    getStockGroups,
  };
};
