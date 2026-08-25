import { LedgerItem } from '../mockLedgerData';

export interface Tab2LedgerItem extends Omit<LedgerItem, 'fans' | 'collectStatus' | 'ledgerStatus'> {
  fans?: number;
  collectStatus?: string;
  ledgerStatus?: string;
  fansCount?: number;
  status?: string;
  authBadgeDesc?: string;
  categoryType?: '白名单' | '黑名单';
  collectDotStatus?: '采集中' | '未采集';
  accountStatus?: '正常' | '异常' | '注销';
  sourceTag?: '自动匹配' | '手动添加' | '批量导入';
}

// Generate the authentic 101 items for the institution's local ledger rule (Xi'an / Shaanxi base)
export function generateTab2MockLedgers(): Tab2LedgerItem[] {
  const items: Tab2LedgerItem[] = [];

  // Item 1: 西安公安 (微博)
  items.push({
    id: 1001,
    name: '西安公安',
    platform: '微博',
    platformBadge: '微博/蓝V',
    badgeType: 'blueV',
    avatar: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=100&auto=format&fit=crop&q=60',
    authType: '机构',
    judgmentType: '人工研判',
    tags: ['地市级A', '废弃政务类废弃', '媒体属性', '政务发布', '级别', '地市级'],
    addresses: [
      { icon: 'fa-building-columns', text: '陕西/西安/莲湖区' },
      { icon: 'fa-user', text: '陕西/西安' },
      { icon: 'fa-location-arrow', text: '陕西/西安' },
      { icon: 'fa-paper-plane', text: '陕西/西安' },
    ],
    subjectName: '西安市公安局',
    subjectType: '机关',
    fansCount: 1979100,
    fansDisplay: '197.91万',
    status: 'normal',
    accountStatus: '正常',
    intro: '陕西省西安市公安局网络信息平台——严格、公正、文明、规范...',
    category: 'whitelist',
    categoryType: '白名单',
    source: '自动匹配' as any,
    sourceTag: '自动匹配',
    collectDotStatus: '采集中',
    authBadgeDesc: '认证: 陕西省西安市公安局网络信息平台',
    detail: {
      ledgerId: 'WB_XA_001',
      ledgerUrl: 'https://weibo.com/xagov',
      collectStatus: '已采集',
      collectParam: 'weibo_crawler_v2',
      authInfo: {
        nickname: '西安公安',
        accountId: 'xa_police_wb',
        vType: '蓝V',
        serviceUnit: '西安市公安局',
      },
    },
  });

  // Item 2: 西安南大街派出所微服务 (微信公众号)
  items.push({
    id: 1002,
    name: '西安南大街派出所微服务...',
    platform: '微信公众号',
    platformBadge: '微信公众号',
    avatar: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=100&auto=format&fit=crop&q=60',
    authType: '其他',
    judgmentType: '未研判',
    tags: ['媒体属性', '政务发布', '级别', '乡镇级'],
    addresses: [
      { icon: 'fa-building-columns', text: '陕西/西安' },
      { icon: 'fa-envelope', text: '陕西/西安/鄠邑...' },
    ],
    subjectName: '-',
    subjectType: '-',
    fansCount: 0,
    fansDisplay: '0',
    status: 'normal',
    accountStatus: '正常',
    intro: '公益服务',
    category: 'whitelist',
    categoryType: '白名单',
    source: '自动匹配' as any,
    sourceTag: '自动匹配',
    collectDotStatus: '未采集',
    authBadgeDesc: '认证: 西安市公安局碑林分局南大街派出所',
    detail: {
      ledgerId: 'WX_XA_002',
      ledgerUrl: 'https://mp.weixin.qq.com/s/xa_ndj',
      collectStatus: '未采集',
      collectParam: 'wechat_biz_monitor',
    },
  });

  // Item 3: 高陵派出所槐树庄警务室 (微信公众号)
  items.push({
    id: 1003,
    name: '高陵派出所槐树庄警务室',
    platform: '微信公众号',
    platformBadge: '微信公众号',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
    authType: '其他',
    judgmentType: '未研判',
    tags: ['媒体属性', '政务发布', '级别', '乡镇级'],
    addresses: [
      { icon: 'fa-building-columns', text: '陕西/西安/高陵...' },
      { icon: 'fa-paper-plane', text: '陕西/西安/高陵...' },
    ],
    subjectName: '-',
    subjectType: '-',
    fansCount: 0,
    fansDisplay: '0',
    status: 'normal',
    accountStatus: '正常',
    intro: '宣传法律知识、通报工作情况、解答群众疑问',
    category: 'whitelist',
    categoryType: '白名单',
    source: '自动匹配' as any,
    sourceTag: '自动匹配',
    collectDotStatus: '未采集',
    authBadgeDesc: '认证: 西安市公安局高陵分局',
    detail: {
      ledgerId: 'WX_XA_003',
      ledgerUrl: 'https://mp.weixin.qq.com/s/xa_gl_hsz',
      collectStatus: '未采集',
      collectParam: 'wechat_biz_monitor',
    },
  });

  // Item 4: 高陵县城关派出所 (微信公众号)
  items.push({
    id: 1004,
    name: '高陵县城关派出所',
    platform: '微信公众号',
    platformBadge: '微信公众号',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
    authType: '其他',
    judgmentType: '未研判',
    tags: ['媒体属性', '政务发布', '级别', '乡镇级'],
    addresses: [
      { icon: 'fa-building-columns', text: '陕西/西安/高陵...' },
      { icon: 'fa-paper-plane', text: '陕西/西安/高陵...' },
    ],
    subjectName: '-',
    subjectType: '-',
    fansCount: 0,
    fansDisplay: '0',
    status: 'normal',
    accountStatus: '正常',
    intro: '-',
    category: 'whitelist',
    categoryType: '白名单',
    source: '自动匹配' as any,
    sourceTag: '自动匹配',
    collectDotStatus: '未采集',
    authBadgeDesc: '认证: 西安市公安局高陵分局城关派出所',
    detail: {
      ledgerId: 'WX_XA_004',
      ledgerUrl: 'https://mp.weixin.qq.com/s/xa_gl_cg',
      collectStatus: '未采集',
      collectParam: 'wechat_biz_monitor',
    },
  });

  // Item 5: 西安北站派出所 (微信公众号)
  items.push({
    id: 1005,
    name: '西安北站派出所',
    platform: '微信公众号',
    platformBadge: '微信公众号',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
    authType: '机构',
    judgmentType: '人工研判',
    tags: ['政务发布', '级别', '区县级'],
    addresses: [{ icon: 'fa-building-columns', text: '陕西/西安/未央区' }],
    subjectName: '西安铁路公安处西安北站派出所',
    subjectType: '机关',
    fansCount: 15420,
    fansDisplay: '1.54万',
    status: 'normal',
    accountStatus: '正常',
    intro: '讲述西安北所好故事,传递人民公安正能量',
    category: 'whitelist',
    categoryType: '白名单',
    source: '自动匹配' as any,
    sourceTag: '自动匹配',
    collectDotStatus: '采集中',
    authBadgeDesc: '认证: 西安铁路公安处西安北站派出所',
    detail: {
      ledgerId: 'WX_XA_005',
      ledgerUrl: 'https://mp.weixin.qq.com/s/xa_bz_pcs',
      collectStatus: '已采集',
      collectParam: 'wechat_biz_monitor',
    },
  });

  // 3 Websites:
  const websites = [
    { name: '西安市人民政府网', url: 'http://xa.gov.cn', auth: '陕西省西安市人民政府办公室', intro: '西安市人民政府门户网站' },
    { name: '西安网信网', url: 'http://xawx.gov.cn', auth: '中共西安市委网络安全和信息化委员会办公室', intro: '中共西安市委网信办官方信息发布平台' },
    { name: '西安党风政风热线网', url: 'http://xadfzf.gov.cn', auth: '西安广播电视台', intro: '西安党风政风监督热线' },
  ];
  websites.forEach((w, i) => {
    items.push({
      id: 1010 + i,
      name: w.name,
      platform: '网站',
      platformBadge: '网站/政务',
      avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=60',
      authType: '机构',
      judgmentType: '精准匹配',
      tags: ['媒体属性', '政务发布', '地市级A', '级别', '地市级'],
      addresses: [{ icon: 'fa-building-columns', text: '陕西/西安/未央区' }],
      subjectName: w.auth,
      subjectType: '事业单位',
      fansCount: 0,
      fansDisplay: '-',
      status: 'normal',
      accountStatus: '正常',
      intro: w.intro,
      category: 'whitelist',
      categoryType: '白名单',
      source: '自动匹配' as any,
      sourceTag: '自动匹配',
      collectDotStatus: '采集中',
      authBadgeDesc: `认证: ${w.auth}`,
      detail: {
        ledgerId: `SITE_XA_00${i + 1}`,
        ledgerUrl: w.url,
        collectStatus: '已采集',
        collectParam: 'site_spider_daily',
      },
    });
  });

  // 15 Weibo accounts (including 西安公安 above which is 1, so 14 more):
  const weiboNames = [
    '西安发布', '西安交警', '西安网信', '西安应急管理', '西安文旅', '西安住建',
    '西安生态环境', '西安城管', '西安司法', '西安市场监管', '西安消防', '西安教育',
    '西安人力资源社会保障', '西安工会'
  ];
  weiboNames.forEach((n, i) => {
    items.push({
      id: 1020 + i,
      name: n,
      platform: '微博',
      platformBadge: '微博/蓝V',
      badgeType: 'blueV',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
      authType: '机构',
      judgmentType: '人工研判',
      tags: ['地市级A', '政务发布', '媒体属性', '级别', '地市级'],
      addresses: [{ icon: 'fa-building-columns', text: '陕西/西安' }],
      subjectName: `${n}官方运营部`,
      subjectType: '机关',
      fansCount: (50 + i * 15) * 10000,
      fansDisplay: `${(50 + i * 15).toFixed(1)}万`,
      status: 'normal',
      accountStatus: '正常',
      intro: `陕西省西安市${n}官方微博发布平台`,
      category: 'whitelist',
      categoryType: '白名单',
      source: '自动匹配' as any,
      sourceTag: '自动匹配',
      collectDotStatus: '采集中',
      authBadgeDesc: `认证: 西安市${n}政务公开平台`,
      detail: {
        ledgerId: `WB_XA_${100 + i}`,
        ledgerUrl: `https://weibo.com/xa_${i}`,
        collectStatus: '已采集',
        collectParam: 'weibo_crawler_v2',
      },
    });
  });

  // 4 Toutiao accounts:
  const toutiaoNames = ['西安发布头条号', '西安公安警讯', '西安网信视点', '西安文旅在线'];
  toutiaoNames.forEach((n, i) => {
    items.push({
      id: 1040 + i,
      name: n,
      platform: '今日头条',
      platformBadge: '今日头条/机构',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60',
      authType: '机构',
      judgmentType: '人工研判',
      tags: ['政务发布', '媒体属性', '地市级'],
      addresses: [{ icon: 'fa-building-columns', text: '陕西/西安' }],
      subjectName: '西安市融媒体中心',
      subjectType: '事业单位',
      fansCount: (30 + i * 20) * 10000,
      fansDisplay: `${(30 + i * 20).toFixed(1)}万`,
      status: 'normal',
      accountStatus: '正常',
      intro: `今日头条官方政务号：${n}`,
      category: 'whitelist',
      categoryType: '白名单',
      source: '自动匹配' as any,
      sourceTag: '自动匹配',
      collectDotStatus: '采集中',
      authBadgeDesc: `认证: ${n}政务认证`,
      detail: {
        ledgerId: `TT_XA_${i + 1}`,
        ledgerUrl: `https://toutiao.com/c/user/xa_${i}`,
        collectStatus: '已采集',
        collectParam: 'toutiao_rss_v1',
      },
    });
  });

  // 8 Douyin accounts:
  const douyinNames = [
    '西安发布抖音', '西安公安防范警务', '网信西安短视频', '西安文旅官方',
    '西安交警便民', '西安应急消防', '西安城管执法', '西安市场监管前哨'
  ];
  douyinNames.forEach((n, i) => {
    items.push({
      id: 1050 + i,
      name: n,
      platform: '抖音',
      platformBadge: '抖音/蓝V',
      badgeType: 'blueV',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=60',
      authType: '机构',
      judgmentType: '精准匹配',
      tags: ['政务发布', '短视频矩阵', '地市级'],
      addresses: [{ icon: 'fa-building-columns', text: '陕西/西安' }],
      subjectName: '西安市宣传网信矩阵',
      subjectType: '机关',
      fansCount: (80 + i * 40) * 10000,
      fansDisplay: `${(80 + i * 40).toFixed(1)}万`,
      status: 'normal',
      accountStatus: '正常',
      intro: `抖音官方政务号：${n}，打造平安西安与文明阵地`,
      category: 'whitelist',
      categoryType: '白名单',
      source: '自动匹配' as any,
      sourceTag: '自动匹配',
      collectDotStatus: '采集中',
      authBadgeDesc: `认证: 抖音企业蓝V - ${n}`,
      detail: {
        ledgerId: `DY_XA_${i + 1}`,
        ledgerUrl: `https://douyin.com/user/xa_dy_${i}`,
        collectStatus: '已采集',
        collectParam: 'douyin_api_v1',
      },
    });
  });

  // Remaining Wechat accounts to reach exactly 71 Wechat accounts (Items 2,3,4,5 are 4 Wechat accounts, so add 67 more):
  const wechatUnits = [
    '莲湖网信', '雁塔发布', '碑林警事', '未央公安', '灞桥政务', '阎良网信',
    '临潼融媒', '长安网安', '高陵党政', '鄠邑公安', '蓝田在线', '周至发布',
    '新城政务', '曲江微政', '高新网信', '经开观察', '浐灞生态网', '国际港务区警讯',
    '航天基地发文', '西咸新区信息', '西安社工部', '西安民政之窗', '西安司法普法',
    '西安市信访办', '西安交警支队', '西安出入境便民', '西安消防救援支队', '西安应急科普',
    '西安市中级人民法院', '西安市人民检察院', '西安生态环境保护', '西安市城市管理局',
    '西安水务集团', '西安市商务局', '西安市文化和旅游局', '西安市卫生健康委员会',
    '西安市退役军人事务局', '西安市金融工作局', '西安市行政审批服务局', '西安市医疗保障局',
    '西安市住房和城乡建设局', '西安市市场监督管理局', '西安市大数据资源管理局',
    '西安市科学技术局', '西安市工业和信息化局', '西安市民族宗教事务委员会',
    '西安市自然资源和规划局', '西安市体育局', '西安市统计局', '西安市乡村振兴局',
    '西安市总工会', '共青团西安市委', '西安市妇女联合会', '西安市科学技术协会',
    '西安市归国华侨联合会', '西安市残疾人联合会', '西安市红十字会', '西安市工商业联合会',
    '西安市贸促会', '西安警务微刊', '西安法治直通车', '西安民生热线', '古城治安在线',
    '大雁塔警务室', '钟楼便民哨', '大唐不夜城巡查', '西安北客站综治'
  ];

  wechatUnits.forEach((u, i) => {
    items.push({
      id: 1100 + i,
      name: u,
      platform: '微信公众号',
      platformBadge: '微信公众号',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
      authType: i % 3 === 0 ? '机构' : i % 3 === 1 ? '媒体' : '其他',
      judgmentType: i % 2 === 0 ? '人工研判' : '未研判',
      tags: ['媒体属性', '政务发布', '级别', i % 2 === 0 ? '区县级' : '乡镇级'],
      addresses: [
        { icon: 'fa-building-columns', text: `陕西/西安/${u.slice(0, 2)}` },
        { icon: 'fa-paper-plane', text: '陕西/西安' },
      ],
      subjectName: `西安市${u}运营中心`,
      subjectType: i % 2 === 0 ? '机关' : '事业单位',
      fansCount: (10 + (i % 8) * 5) * 1000,
      fansDisplay: `${(10 + (i % 8) * 5).toFixed(1)}千`,
      status: 'normal',
      accountStatus: '正常',
      intro: `${u}——聚焦属地基层治理、信息发布与民生互动服务。`,
      category: 'whitelist',
      categoryType: '白名单',
      source: '自动匹配' as any,
      sourceTag: '自动匹配',
      collectDotStatus: i % 3 === 0 ? '采集中' : '未采集',
      authBadgeDesc: `认证: 西安市${u}官方服务矩阵`,
      detail: {
        ledgerId: `WX_XA_${200 + i}`,
        ledgerUrl: `https://mp.weixin.qq.com/s/xa_${i}`,
        collectStatus: i % 3 === 0 ? '已采集' : '未采集',
        collectParam: 'wechat_biz_monitor',
      },
    });
  });

  return items;
}
