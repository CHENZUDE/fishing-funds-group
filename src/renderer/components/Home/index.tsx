import React from 'react';
import { useCreation } from 'ahooks';
import { Tabs } from 'antd';
import Toolbar from '@/components/Toolbar';
import Wallet from '@/components/Wallet/index';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SortBar from '@/components/SortBar';
import TabsBar from '@/components/TabsBar';
import Collect from '@/components/Collect';
import GroupTab from '@/components/GroupTab';
import WebViewerDrawer from '@/components/WebViewerDrawer';
import TranslateDrawer from '@/components/TranslateDrawer';
import { stockTypesConfig } from '@/components/Toolbar/AppCenterContent/StockSearch';

import { useAppSelector } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as Helpers from '@/helpers';
import styles from './index.module.css';

const FundView = React.lazy(() => import('@/components/Home/FundView'));
const ZindexView = React.lazy(() => import('@/components/Home/ZindexView'));
const QuotationView = React.lazy(() => import('@/components/Home/QuotationView'));
const StockView = React.lazy(() => import('@/components/Home/StockView'));
const CoinView = React.lazy(() => import('@/components/Home/CoinView'));

const tabsKeyMap = {
  [Enums.TabKeyType.Fund]: FundGroup,
  [Enums.TabKeyType.Zindex]: ZindexGroup,
  [Enums.TabKeyType.Quotation]: QuotationGroup,
  [Enums.TabKeyType.Stock]: StockGroup,
  [Enums.TabKeyType.Coin]: CoinGroup,
};

export interface HomeProps {}

function FundGroup() {
  const codeMap = useAppSelector((state) => state.wallet.fundConfigCodeMap);
  const fundGroups = useAppSelector((state) => state.customGroup.fundGroups);
  const fundAllGroupOrder = useAppSelector((state) => state.customGroup.fundAllGroupOrder);
  const hiddenFundFixedGroups = useAppSelector((state) => state.customGroup.hiddenFundFixedGroups);

  // 固定分组的key列表
  const fixedGroupKeys = ['0', '1', '2', '3', '4'];

  // 定义所有固定分组
  const fixedGroups: Array<{ key: string; label: string; filter: (fund: any) => boolean }> = [
    {
      key: '0',
      label: '全部',
      filter: () => true,
    },
    {
      key: '1',
      label: '持有',
      filter: (fund) => !!codeMap[fund.fundcode!]?.cyfe,
    },
    {
      key: '2',
      label: '自选',
      filter: (fund) => !codeMap[fund.fundcode!]?.cyfe,
    },
    {
      key: '3',
      label: '含成本价',
      filter: (fund) => !!codeMap[fund.fundcode!]?.cbj,
    },
    {
      key: '4',
      label: '净值更新',
      filter: (fund) => !!Helpers.Fund.CalcFund(fund, codeMap).isFix,
    },
  ];

  // 获取所有已分组的代码（只从自定义分组）
  const groupedFundCodes = new Set<string>();
  fundGroups.forEach((group) => {
    group.codes.forEach((code) => groupedFundCodes.add(code));
  });

  // 构建所有分组项目（过滤掉隐藏的固定分组）
  const allGroupItems = [
    ...fixedGroups.filter(g => !hiddenFundFixedGroups.includes(g.key)).map((g) => ({
      key: g.key,
      label: g.label,
      children: <FundView filter={g.filter} />,
    })),
    {
      key: 'fund-ungrouped',
      label: '未分组',
      children: <FundView filter={(fund) => !groupedFundCodes.has(fund.fundcode!)} />,
    },
    ...fundGroups.map((group) => ({
      key: `fund-group-${group.id}`,
      label: group.name,
      children: <FundView filter={(fund) => group.codes.includes(fund.fundcode!)} />,
    })),
  ];

  // 根据保存的排序重新排列，如果没有保存排序则使用默认顺序
  // 默认顺序：固定分组 -> 未分组 -> 自定义分组
  const orderedItems = fundAllGroupOrder.length > 0
    ? fundAllGroupOrder
        .map((key) => allGroupItems.find((item) => item.key === key))
        .filter((item) => item !== undefined)
        .concat(allGroupItems.filter((item) => !fundAllGroupOrder.includes(item.key)))
    : allGroupItems;

  return (
    <GroupTab
      tabKey={Enums.TabKeyType.Fund}
      items={orderedItems}
    />
  );
}

function ZindexGroup() {
  // const { codeMap: zindexCodeMap } = useAppSelector((state) => state.zindex.config);

  return (
    <GroupTab
      tabKey={Enums.TabKeyType.Zindex}
      items={[
        {
          key: String(0),
          label: '全部',
          children: <ZindexView filter={() => true} />,
        },
        {
          key: String(1),
          label: 'A股',
          children: <ZindexView filter={(zindex) => /^\d{6}$/.test(zindex.zindexCode)} />,
        },
        {
          key: String(2),
          label: '国际',
          children: <ZindexView filter={(zindex) => !/^\d{6}$/.test(zindex.zindexCode)} />,
        },
        {
          key: String(3),
          label: '上涨',
          children: <ZindexView filter={(zindex) => zindex.zdd >= 0} />,
        },
        {
          key: String(4),
          label: '下跌',
          children: <ZindexView filter={(zindex) => zindex.zdd < 0} />,
        },
      ]}
    />
  );
}

function QuotationGroup() {
  const favoriteQuotationMap = useAppSelector((state) => state.quotation.favoriteQuotationMap);

  return (
    <GroupTab
      tabKey={Enums.TabKeyType.Quotation}
      items={[
        {
          key: String(0),
          label: '行业',
          children: <QuotationView filter={(quotation) => quotation.type === Enums.QuotationType.Industry} />,
        },
        {
          key: String(1),
          label: '概念',
          children: <QuotationView filter={(quotation) => quotation.type === Enums.QuotationType.Concept} />,
        },
        {
          key: String(2),
          label: '地域',
          children: <QuotationView filter={(quotation) => quotation.type === Enums.QuotationType.Area} />,
        },
        {
          key: String(3),
          label: '关注',
          children: <QuotationView filter={(quotaion) => favoriteQuotationMap[quotaion.code]} />,
        },
      ]}
    />
  );
}

function StockGroup() {
  const codeMap = useAppSelector((state) => state.wallet.stockConfigCodeMap);
  const stockGroups = useAppSelector((state) => state.customGroup.stockGroups);
  const stockAllGroupOrder = useAppSelector((state) => state.customGroup.stockAllGroupOrder);
  const hiddenStockFixedGroups = useAppSelector((state) => state.customGroup.hiddenStockFixedGroups);

  // 获取所有已分组的代码（只从自定义分组）
  const groupedStockCodes = new Set<string>();
  stockGroups.forEach((group) => {
    group.codes.forEach((code) => groupedStockCodes.add(code));
  });

  // 构建所有分组项目（过滤掉隐藏的固定分组）
  const fixedStockItems = [
    {
      key: String(-1),
      label: '全部',
      children: <StockView filter={() => true} />,
    },
    {
      key: String(-2),
      label: '持有',
      children: <StockView filter={(stock) => !!codeMap[stock.secid]?.cyfe} />,
    },
    ...stockTypesConfig.map((type) => ({
      key: String(type.code),
      label: type.name,
      children: <StockView filter={(stock) => codeMap[stock.secid].type === type.code} />,
    })),
  ];

  const allGroupItems = [
    ...fixedStockItems.filter(g => !hiddenStockFixedGroups.includes(g.key as string)),
    {
      key: 'stock-ungrouped',
      label: '未分组',
      children: <StockView filter={(stock) => !groupedStockCodes.has(stock.secid)} />,
    },
    ...stockGroups.map((group) => ({
      key: `stock-group-${group.id}`,
      label: group.name,
      children: <StockView filter={(stock) => group.codes.includes(stock.secid)} />,
    })),
  ];

  // 根据保存的排序重新排列，如果没有保存排序则使用默认顺序
  // 默认顺序：全部 -> 持有 -> 股票类型 -> 未分组 -> 自定义分组
  const orderedItems = stockAllGroupOrder.length > 0
    ? stockAllGroupOrder
        .map((key) => allGroupItems.find((item) => item.key === key))
        .filter((item) => item !== undefined)
        .concat(allGroupItems.filter((item) => !stockAllGroupOrder.includes(item.key)))
    : allGroupItems;

  return (
    <GroupTab
      tabKey={Enums.TabKeyType.Stock}
      items={orderedItems}
    />
  );
}

function CoinGroup() {
  return (
    <GroupTab
      tabKey={Enums.TabKeyType.Coin}
      items={[
        {
          key: String(0),
          label: '全部',
          children: <CoinView filter={() => true} />,
        },
        {
          key: String(1),
          label: '上涨',
          children: <CoinView filter={(coin) => Number(coin.change24h) >= 0} />,
        },
        {
          key: String(2),
          label: '下跌',
          children: <CoinView filter={(coin) => Number(coin.change24h) < 0} />,
        },
      ]}
    />
  );
}

const Body = () => {
  const tabsActiveKey = useAppSelector((state) => state.tabs.activeKey);
  const bottomTabsSetting = useAppSelector((state) => state.setting.systemSetting.bottomTabsSetting);

  const items = useCreation(
    () =>
      bottomTabsSetting.map((tab) => {
        const Component = tabsKeyMap[tab.key];
        return {
          label: tab.key,
          key: String(tab.key),
          children: <Component />,
        };
      }),
    [bottomTabsSetting]
  );

  return <Tabs renderTabBar={() => <></>} activeKey={String(tabsActiveKey)} animated={true} destroyOnHidden items={items} />;
};

const Home: React.FC<HomeProps> = () => {
  return (
    <div className={styles.layout}>
      <Header>
        <Wallet />
        <SortBar />
      </Header>
      <Body />
      <Footer>
        <Toolbar />
        <TabsBar />
      </Footer>
      <WebViewerDrawer />
      <TranslateDrawer />
      <Collect title="home" />
    </div>
  );
};

export default Home;
