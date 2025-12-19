import { Suspense } from 'react';
import { useCreation } from 'ahooks';
import { Tabs, TabsProps } from 'antd';
import Empty from '@/components/Empty';
import { syncTabsKeyMapAction } from '@/store/features/tabs';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import * as Enums from '@/utils/enums';

const groupBarStyle = {
  background: 'var(--background-color)',
  borderBottom: `1px solid var(--border-color)`,
  margin: 0,
  paddingLeft: 25,
};

interface GroupTabProps extends TabsProps {
  tabKey: Enums.TabKeyType;
}

const GroupTab = (props: GroupTabProps) => {
  const { tabKey } = props;
  const dispatch = useAppDispatch();
  const activeKey = useAppSelector((state) => state.tabs.tabsKeyMap[tabKey]);

  const items = useCreation(
    () =>
      props.items?.map((item) => {
        item.children = <Suspense fallback={<Empty text="加载中..." />}>{item.children}</Suspense>;
        return item;
      }),
    [props.items]
  );

  const onTagChange = (e: string) => {
    // 尝试转换为数字，如果失败则保持字符串
    const activeKey = isNaN(Number(e)) ? e : Number(e);
    dispatch(syncTabsKeyMapAction({ key: tabKey, activeKey }));
  };

  return (
    <Tabs
      size="small"
      activeKey={String(activeKey)}
      animated={{ tabPane: true, inkBar: true }}
      tabBarGutter={15}
      tabBarStyle={groupBarStyle}
      destroyOnHidden
      items={items}
      onChange={onTagChange}
    />
  );
};

export default GroupTab;
