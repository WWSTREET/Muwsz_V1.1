export type LedgerSource = '同步匹配' | '批量导入' | '手动添加';
export type LedgerCategory = 'normal' | 'whitelist' | 'blacklist';

export interface LedgerDetailInfo {
  // Common
  ledgerId: string;
  ledgerUrl?: string;
  collectStatus: '未采集' | '已采集' | '不可采';
  collectParam: string;
  lastPostTime?: string;
  lastPostLocation?: string;
  registeredCity?: string;
  ipLocation?: string;
  jurisdictionLocation?: string;
  regionalModelLocation?: string;
  
  // Platform specific authentication info
  authInfo?: {
    nickname?: string;
    accountId?: string;
    vType?: string; // '红V' | '蓝V' | '黄V' | '未认证'
    fansCount?: string;
    followCount?: string;
    likesCount?: string;
    repostsCount?: string;
    worksCount?: string;
    licenseNo?: string;
    serviceUnit?: string;
    serviceCategory?: string;
    authDesc?: string;
    registeredProvince?: string;
    registeredCity?: string;
    ipLocation?: string;
    registeredTime?: string;
    updatedTime?: string;
    summary?: string;
    
    // Website specific
    siteName?: string;
    filingNo?: string;
    mainFilingNo?: string;
    sponsorName?: string;
    sponsorNature?: string;
    approvalDate?: string;
  };
}

export interface LedgerItem {
  id: number;
  name: string;
  platform: '微博' | '今日头条' | '抖音' | '微信公众号' | '网站';
  platformBadge?: string; // e.g. '微博/红V', '抖音/蓝V'
  badgeType?: 'redV' | 'blueV' | 'normal';
  avatar: string;
  authType: string; // '媒体' | '机构' | '个人认证' | '其他'
  judgmentType: string; // '人工研判' | '精准匹配' | '模糊匹配' | '未研判'
  tags: string[];
  addresses: { icon: string; text: string; isIP?: boolean }[];
  subjectName: string;
  subjectType: string;
  fans: number; // raw number for sorting & filtering
  fansDisplay: string; // e.g. '1,003.64万', '270'
  collectStatus: string; // '未采集' | '已采集' | '不可采'
  ledgerStatus: string; // '正常' | '异常'
  source: LedgerSource; // 台账来源：同步匹配、批量导入、手动添加
  category: LedgerCategory; // 'normal' (-) | 'whitelist' (白名单) | 'blacklist' (黑名单)
  ledgerType?: '白名单' | '黑名单' | string; // 台账类型：白名单、黑名单、应用属地台账/错误表述台账不显示
  categoryType?: '白名单' | '黑名单' | string;
  addedTime?: string;
  reason?: string; // 原因 (如黑名单原因)
  authDesc?: string; // 认证信息
  intro?: string; // 简介
  detail: LedgerDetailInfo;
}

// Helper to generate 100 comprehensive mock ledger records across all 5 platforms
const generate100MockLedgers = (): LedgerItem[] => {
  const items: LedgerItem[] = [];

  // Seed 1: Weibo - 猛犸新闻 (from User Image 1)
  items.push({
    id: 1,
    name: '猛犸新闻',
    platform: '微博',
    platformBadge: '微博/红V',
    badgeType: 'redV',
    avatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=120&auto=format&fit=crop&q=80',
    authType: '媒体',
    judgmentType: '人工研判',
    tags: ['废弃媒体类废弃', '省级B', '媒体属性', '新闻媒体', '级别', '省级'],
    addresses: [
      { icon: '🏛', text: '河南/郑州/管城回族区' },
      { icon: '👤', text: '河南/安阳/殷都区/曲沟镇' },
      { icon: '▲', text: '河南' },
      { icon: '✈', text: '浙江省/舟山市' }
    ],
    subjectName: '东方今报社',
    subjectType: '事业单位',
    fans: 10968300,
    fansDisplay: '1,096.83万',
    collectStatus: '未采集',
    ledgerStatus: '正常',
    source: '同步匹配',
    category: 'normal',
    authDesc: '河南广播电视台猛犸新闻官方微博',
    intro: '河南广播电视台猛犸新闻官方微博，提供全天候权威新闻资讯与深度调查报道。',
    detail: {
      ledgerId: '2_1672519561',
      ledgerUrl: 'https://weibo.com/u/1672519561',
      collectStatus: '未采集',
      collectParam: '1672519561',
      lastPostTime: '2026-08-15 22:21:27',
      lastPostLocation: '浙江省/舟山市',
      registeredCity: '河南/安阳/殷都区/曲沟镇',
      ipLocation: '-',
      jurisdictionLocation: '河南/郑州/管城回族区',
      regionalModelLocation: '河南',
      authInfo: {
        nickname: '猛犸新闻',
        accountId: '1672519561',
        vType: '红V',
        registeredProvince: '河南',
        fansCount: '1,096.83万',
        followCount: '1,640',
        likesCount: '2,732.55万',
        repostsCount: '3,481.92万',
        worksCount: '20.35万',
        licenseNo: '41120170005',
        serviceUnit: '东方今报社',
        serviceCategory: '采编发布服务、转载服务',
        authDesc: '河南广播电视台猛犸新闻官方微博',
        registeredTime: '2009-12-22 10:39:54',
        updatedTime: '2026-08-16 02:26:09'
      }
    }
  });

  // Seed 2: Website - 随州职业技术学院 (from User Image 2)
  items.push({
    id: 2,
    name: '随州职业技术学院',
    platform: '网站',
    platformBadge: '网站',
    badgeType: 'normal',
    avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?w=120&auto=format&fit=crop&q=80',
    authType: '机构',
    judgmentType: '精准匹配',
    tags: ['大学', '暂时屏蔽', '教育类'],
    addresses: [
      { icon: '🏛', text: '湖北/随州市' },
      { icon: '👤', text: '湖北' },
      { icon: '▲', text: '湖北/随州市' }
    ],
    subjectName: '随州职业技术学院',
    subjectType: '事业单位',
    fans: 0,
    fansDisplay: '-',
    collectStatus: '不可采',
    ledgerStatus: '正常',
    source: '批量导入',
    category: 'normal',
    authDesc: '随州职业技术学院',
    intro: '随州职业技术学院官方门户网站，发布教学科研、招生就业与校园综合信息。',
    detail: {
      ledgerId: '1_3245954',
      ledgerUrl: 'https://szvtc.cn',
      collectStatus: '不可采',
      collectParam: 'szvtc.cn',
      lastPostTime: '-',
      lastPostLocation: '-',
      registeredCity: '湖北',
      ipLocation: '-',
      jurisdictionLocation: '湖北/随州市',
      regionalModelLocation: '湖北/随州市',
      authInfo: {
        siteName: '随州职业技术学院',
        filingNo: '鄂ICP备19016380号-1',
        mainFilingNo: '鄂ICP备19016380号',
        sponsorName: '随州职业技术学院',
        sponsorNature: '事业单位',
        approvalDate: '2019-06-25 11:56:32',
        updatedTime: '2026-08-15 19:19:21'
      }
    }
  });

  // Seed 3: WeChat - 大足海棠新城管委会 (from User Image 3)
  items.push({
    id: 3,
    name: '大足海棠新城管委会',
    platform: '微信公众号',
    platformBadge: '微信公众号',
    badgeType: 'normal',
    avatar: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=120&auto=format&fit=crop&q=80',
    authType: '机构',
    judgmentType: '精准匹配',
    tags: ['区县级A', '废弃政务类废弃', '媒体属性', '政务发布', '级别', '区县级'],
    addresses: [
      { icon: '🏛', text: '重庆/大足区' },
      { icon: 'IP', text: '重庆', isIP: true },
      { icon: '▲', text: '重庆/巫溪县,重庆/大足区,陕西/西安/新城区' }
    ],
    subjectName: '重庆市大足区海棠新城开发区管理委员会',
    subjectType: '机关',
    fans: 58000,
    fansDisplay: '5.80万',
    collectStatus: '未采集',
    ledgerStatus: '正常',
    source: '同步匹配',
    category: 'normal',
    authDesc: '重庆市大足区海棠新城开发区管理委员会',
    intro: '对大足区海棠新城做相关开发建设工作，稳定投资促进增长；做招商引资工作，促进产业持续发展。',
    detail: {
      ledgerId: '3_3865344706',
      ledgerUrl: '-',
      collectStatus: '未采集',
      collectParam: 'dzhtxcgwh',
      lastPostTime: '-',
      lastPostLocation: '-',
      registeredCity: '-',
      ipLocation: '重庆',
      jurisdictionLocation: '重庆/大足区',
      regionalModelLocation: '重庆/巫溪县,重庆/大足区,陕西/西安/新城区',
      authInfo: {
        nickname: '大足海棠新城管委会',
        accountId: '3865344706',
        authDesc: '重庆市大足区海棠新城开发区管理委员会',
        updatedTime: '2026-08-14 21:02:02',
        summary: '对大足区海棠新城做相关开发建设工作，稳定投资促进增长；做招商引资工作，促进产业持续发展。'
      }
    }
  });

  // Seed 4: Toutiao - 随州文旅 (from User Image 4)
  items.push({
    id: 4,
    name: '随州文旅',
    platform: '今日头条',
    platformBadge: '今日头条/蓝V',
    badgeType: 'blueV',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    authType: '机构',
    judgmentType: '精准匹配',
    tags: ['地市级A', '废弃政务类废弃', '媒体属性', '政务发布', '级别', '地市级'],
    addresses: [
      { icon: '🏛', text: '湖北/随州市' },
      { icon: 'IP', text: '湖北', isIP: true },
      { icon: '▲', text: '湖北/随州市' }
    ],
    subjectName: '随州市文化和旅游局',
    subjectType: '机关',
    fans: 0,
    fansDisplay: '0',
    collectStatus: '未采集',
    ledgerStatus: '正常',
    source: '手动添加',
    category: 'normal',
    authDesc: '随州市文化和旅游局官方账号',
    intro: '随州市文化和旅游局官方发布平台，展示炎帝故里、编钟之乡独特文旅魅力。',
    detail: {
      ledgerId: '5_57555349110',
      ledgerUrl: 'https://www.toutiao.com/c/user/token/MS4wLjABAAAANY0LFUY9VKcG02maeL-0cjKeKZTD4IrCwkFFLLTagZA',
      collectStatus: '未采集',
      collectParam: 'MS4wLjABAAAANY0LFUY9VKcG02maeL-0cjKeKZTD4IrCwkFFLLTagZA',
      lastPostTime: '-',
      lastPostLocation: '-',
      registeredCity: '-',
      ipLocation: '湖北',
      jurisdictionLocation: '湖北/随州市',
      regionalModelLocation: '湖北/随州市',
      authInfo: {
        nickname: '随州文旅',
        accountId: '57555349110',
        vType: '蓝V',
        ipLocation: '湖北',
        fansCount: '0',
        worksCount: '490',
        authDesc: '随州市文化和旅游局官方账号',
        updatedTime: '2026-08-15 18:19:34',
        summary: '湖北省随州市文化和旅游局'
      }
    }
  });

  // Seed 5: Douyin - 随州职业技术学院 (from User Image 5)
  items.push({
    id: 5,
    name: '随州职业技术学院',
    platform: '抖音',
    platformBadge: '抖音/蓝V',
    badgeType: 'blueV',
    avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?w=120&auto=format&fit=crop&q=80',
    authType: '机构',
    judgmentType: '精准匹配',
    tags: ['大学', '暂时屏蔽', '教育类'],
    addresses: [
      { icon: '🏛', text: '湖北/随州市' },
      { icon: '👤', text: '湖北/随州市' },
      { icon: '▲', text: '湖北/随州市' },
      { icon: '✈', text: '湖北' }
    ],
    subjectName: '随州职业技术学院',
    subjectType: '事业单位',
    fans: 17500,
    fansDisplay: '1.75万',
    collectStatus: '未采集',
    ledgerStatus: '正常',
    source: '同步匹配',
    category: 'whitelist',
    authDesc: '随州职业技术学院',
    intro: '校训：厚德重能 求特创新 欢迎投稿19153737@qq.com/玉见·红石榴工作室',
    detail: {
      ledgerId: '16_4054638993872125',
      ledgerUrl: 'https://www.douyin.com/user/MS4wLjABAAAAYrrUnzZABGar1nE_Jf2mk6_tZNimrjJBd836fRVxt_HiWjul0uVVzuTk676xSzZT',
      collectStatus: '未采集',
      collectParam: 'MS4wLjABAAAAYrrUnzZABGar1nE_Jf2mk6_tZNimrjJBd836fRVxt_HiWjul0uVVzuTk676xSzZT',
      lastPostTime: '2026-07-13 14:49:53',
      lastPostLocation: '湖北',
      registeredCity: '湖北/随州市',
      ipLocation: '湖北',
      jurisdictionLocation: '湖北/随州市',
      regionalModelLocation: '湖北/随州市',
      authInfo: {
        nickname: '随州职业技术学院',
        accountId: '4054638993872125',
        vType: '蓝V',
        registeredProvince: '湖北',
        registeredCity: '随州',
        ipLocation: '湖北',
        fansCount: '1.75万',
        followCount: '158',
        likesCount: '17.77万',
        worksCount: '174',
        authDesc: '随州职业技术学院',
        updatedTime: '2026-08-15 19:19:21',
        summary: '校训：厚德重能 求特创新 欢迎投稿19153737@qq.com/玉见·红石榴工作室'
      }
    }
  });

  // Seed 6: Weibo - 逐浪新闻
  items.push({
    id: 6,
    name: '逐浪新闻',
    platform: '微博',
    platformBadge: '微博/红V',
    badgeType: 'redV',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    authType: '媒体',
    judgmentType: '人工研判',
    tags: ['省级B', '废弃媒体类废弃', '媒体属性', '新闻媒体', '级别', '省级'],
    addresses: [
      { icon: '🏛', text: '湖北/武汉/洪山区' },
      { icon: '👤', text: '湖北/武汉' },
      { icon: '▲', text: '湖北/武汉' },
      { icon: '✈', text: '河南/郑州' }
    ],
    subjectName: '湖北广播电视台',
    subjectType: '事业单位',
    fans: 10036400,
    fansDisplay: '1,003.64万',
    collectStatus: '未采集',
    ledgerStatus: '正常',
    source: '同步匹配',
    category: 'whitelist',
    authDesc: '湖北广播电视台逐浪新闻官方微博',
    intro: '湖北广播电视台逐浪新闻官方微博，立足湖北，放眼全国，追踪最新热点事件。',
    detail: {
      ledgerId: '2_1784920194',
      ledgerUrl: 'https://weibo.com/u/1784920194',
      collectStatus: '未采集',
      collectParam: '1784920194',
      lastPostTime: '2026-08-15 23:10:12',
      lastPostLocation: '河南/郑州',
      registeredCity: '湖北/武汉',
      ipLocation: '湖北',
      jurisdictionLocation: '湖北/武汉/洪山区',
      regionalModelLocation: '湖北/武汉',
      authInfo: {
        nickname: '逐浪新闻',
        accountId: '1784920194',
        vType: '红V',
        registeredProvince: '湖北',
        fansCount: '1,003.64万',
        followCount: '890',
        likesCount: '1,928.34万',
        repostsCount: '2,109.11万',
        worksCount: '15.42万',
        licenseNo: '42120180002',
        serviceUnit: '湖北广播电视台',
        serviceCategory: '采编发布服务',
        authDesc: '湖北广播电视台逐浪新闻官方微博',
        registeredTime: '2011-04-12 15:20:00',
        updatedTime: '2026-08-16 01:15:00'
      }
    }
  });

  // Seed 7: Weibo - 菏泽日报
  items.push({
    id: 7,
    name: '菏泽日报',
    platform: '微博',
    platformBadge: '微博/红V',
    badgeType: 'redV',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    authType: '媒体',
    judgmentType: '精准匹配',
    tags: ['地市级B', '废弃媒体类废弃', '媒体属性', '新闻媒体', '级别', '地市级'],
    addresses: [
      { icon: '🏛', text: '山东/菏泽/成武县' },
      { icon: '👤', text: '山东' },
      { icon: '▲', text: '山东/菏泽' },
      { icon: '✈', text: '云南/普洱' }
    ],
    subjectName: '菏泽日报社',
    subjectType: '事业单位',
    fans: 39500,
    fansDisplay: '3.95万',
    collectStatus: '未采集',
    ledgerStatus: '正常',
    source: '批量导入',
    category: 'normal',
    authDesc: '菏泽日报官方微博',
    intro: '菏泽日报社官方微博，讲述菏泽好故事，传递社会正能量。',
    detail: {
      ledgerId: '2_1829304912',
      ledgerUrl: 'https://weibo.com/u/1829304912',
      collectStatus: '未采集',
      collectParam: '1829304912',
      lastPostTime: '2026-08-15 18:20:00',
      lastPostLocation: '云南/普洱',
      registeredCity: '山东/菏泽',
      ipLocation: '山东',
      jurisdictionLocation: '山东/菏泽/成武县',
      regionalModelLocation: '山东/菏泽',
      authInfo: {
        nickname: '菏泽日报',
        accountId: '1829304912',
        vType: '红V',
        registeredProvince: '山东',
        fansCount: '3.95万',
        followCount: '320',
        likesCount: '45.12万',
        worksCount: '3.80万',
        authDesc: '菏泽日报官方微博',
        updatedTime: '2026-08-15 18:20:00'
      }
    }
  });

  // Seed 8: Weibo - 山东商报
  items.push({
    id: 8,
    name: '山东商报',
    platform: '微博',
    platformBadge: '微博/红V',
    badgeType: 'redV',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    authType: '媒体',
    judgmentType: '人工研判',
    tags: ['省级B', '废弃媒体类废弃', '媒体属性', '新闻媒体', '级别', '省级'],
    addresses: [
      { icon: '🏛', text: '山东/济南/历下区' },
      { icon: '👤', text: '山东/济南' },
      { icon: '▲', text: '山东/济南' },
      { icon: '✈', text: '河南/许昌市' }
    ],
    subjectName: '《山东商报》社',
    subjectType: '事业单位',
    fans: 6798600,
    fansDisplay: '679.86万',
    collectStatus: '未采集',
    ledgerStatus: '正常',
    source: '同步匹配',
    category: 'normal',
    authDesc: '山东商报社官方微博',
    intro: '《山东商报》官方微博，立足山东，观察全国，提供深度报道与民生服务。',
    detail: {
      ledgerId: '2_1739281940',
      ledgerUrl: 'https://weibo.com/u/1739281940',
      collectStatus: '未采集',
      collectParam: '1739281940',
      lastPostTime: '2026-08-15 21:05:00',
      lastPostLocation: '河南/许昌市',
      registeredCity: '山东/济南',
      ipLocation: '山东',
      jurisdictionLocation: '山东/济南/历下区',
      regionalModelLocation: '山东/济南',
      authInfo: {
        nickname: '山东商报',
        accountId: '1739281940',
        vType: '红V',
        registeredProvince: '山东',
        fansCount: '679.86万',
        followCount: '1,120',
        likesCount: '1,200.50万',
        worksCount: '18.90万',
        authDesc: '山东商报社官方微博',
        updatedTime: '2026-08-15 21:05:00'
      }
    }
  });

  // Seed 9: Weibo - 小鱼新闻
  items.push({
    id: 9,
    name: '小鱼新闻',
    platform: '微博',
    platformBadge: '微博/红V',
    badgeType: 'redV',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    authType: '媒体',
    judgmentType: '精准匹配',
    tags: ['地市级B', '废弃媒体类废弃', '媒体属性', '新闻媒体', '级别', '地市级'],
    addresses: [
      { icon: '🏛', text: '江苏/苏州/姑苏区' },
      { icon: '👤', text: '江苏/苏州' },
      { icon: '▲', text: '江苏/苏州' },
      { icon: '✈', text: '山东/潍坊' }
    ],
    subjectName: '苏州市广播电视总台',
    subjectType: '事业单位',
    fans: 384100,
    fansDisplay: '38.41万',
    collectStatus: '未采集',
    ledgerStatus: '正常',
    source: '手动添加',
    category: 'normal',
    authDesc: '苏州市广播电视总台官方微博',
    intro: '苏州市广播电视总台旗下新媒体平台，聚焦苏州本土热点资讯。',
    detail: {
      ledgerId: '2_1894028301',
      ledgerUrl: 'https://weibo.com/u/1894028301',
      collectStatus: '未采集',
      collectParam: '1894028301',
      lastPostTime: '2026-08-15 19:40:00',
      lastPostLocation: '山东/潍坊',
      registeredCity: '江苏/苏州',
      ipLocation: '江苏',
      jurisdictionLocation: '江苏/苏州/姑苏区',
      regionalModelLocation: '江苏/苏州',
      authInfo: {
        nickname: '小鱼新闻',
        accountId: '1894028301',
        vType: '红V',
        registeredProvince: '江苏',
        fansCount: '38.41万',
        followCount: '450',
        likesCount: '89.20万',
        worksCount: '5.20万',
        authDesc: '苏州市广播电视总台官方微博',
        updatedTime: '2026-08-15 19:40:00'
      }
    }
  });

  // Seed 10 & 11: Blacklisted initial accounts
  items.push({
    id: 10,
    name: '违规低俗营销号_01',
    platform: '抖音',
    platformBadge: '抖音',
    badgeType: 'normal',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    authType: '其他',
    judgmentType: '人工研判',
    tags: ['暂时屏蔽', '废弃媒体类废弃'],
    addresses: [
      { icon: 'IP', text: '境外/未知', isIP: true },
      { icon: '✈', text: '四川/成都' }
    ],
    subjectName: '未知个人',
    subjectType: '个人',
    fans: 12500,
    fansDisplay: '1.25万',
    collectStatus: '未采集',
    ledgerStatus: '异常',
    source: '同步匹配',
    category: 'blacklist',
    reason: '发布虚假不良营销信息',
    authDesc: '违规未认证个人号',
    intro: '发布低俗与违规营销推广信息，已被列入管控黑名单。',
    detail: {
      ledgerId: '16_9940281920',
      collectStatus: '未采集',
      collectParam: '9940281920',
      ipLocation: '境外',
      authInfo: {
        nickname: '违规低俗营销号_01',
        accountId: '9940281920'
      }
    }
  });

  items.push({
    id: 11,
    name: '恶意搬运仿冒号_02',
    platform: '微博',
    platformBadge: '微博',
    badgeType: 'normal',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    authType: '其他',
    judgmentType: '人工研判',
    tags: ['暂时屏蔽', '废弃政务类废弃'],
    addresses: [
      { icon: 'IP', text: '广东/广州', isIP: true }
    ],
    subjectName: '未知企业',
    subjectType: '企业',
    fans: 8600,
    fansDisplay: '8,600',
    collectStatus: '未采集',
    ledgerStatus: '异常',
    source: '同步匹配',
    category: 'blacklist',
    reason: '仿冒属地政务账号引流',
    authDesc: '仿冒未核验企业账号',
    intro: '多次仿冒属地官方政务账号发布不实导流内容，已列入黑名单。',
    detail: {
      ledgerId: '2_9940281921',
      collectStatus: '未采集',
      collectParam: '9940281921',
      ipLocation: '广东',
      authInfo: {
        nickname: '恶意搬运仿冒号_02',
        accountId: '9940281921'
      }
    }
  });

  // Generate records 12 to 100 to ensure exactly 100 default built-in ledgers across all 5 platforms
  const platforms: ('微博' | '今日头条' | '抖音' | '微信公众号' | '网站')[] = [
    '微博', '今日头条', '抖音', '微信公众号', '网站'
  ];

  const orgNames = [
    '陕西广播电视台', '西安发布工作室', '西安日报社', '华商传媒集团', '延安市融媒体中心',
    '宝鸡广播电视台', '咸阳新闻网', '渭南发布', '汉中市文化旅游局', '安康市融媒体中心',
    '榆林市委宣传部', '商洛广播电视', '陕西省生态环境厅', '陕西省教育厅', '陕西省总工会',
    '西北大学宣传部', '西安交通大学', '西北工业大学融媒体', '陕西师范大学', '西安电子科技大学'
  ];

  const cityDistricts = [
    { province: '陕西', city: '西安', district: '雁塔区' },
    { province: '陕西', city: '西安', district: '未央区' },
    { province: '陕西', city: '西安', district: '新城区' },
    { province: '陕西', city: '宝鸡', district: '金台区' },
    { province: '陕西', city: '咸阳', district: '秦都区' },
    { province: '陕西', city: '渭南', district: '临渭区' },
    { province: '陕西', city: '延安', district: '宝塔区' },
    { province: '陕西', city: '汉中', district: '汉台区' },
    { province: '陕西', city: '榆林', district: '榆阳区' },
    { province: '陕西', city: '安康', district: '汉滨区' },
    { province: '陕西', city: '商洛', district: '商州区' }
  ];

  const avatarImages = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80'
  ];

  for (let i = 12; i <= 100; i++) {
    const p = platforms[(i - 12) % platforms.length];
    const org = orgNames[(i - 12) % orgNames.length];
    const loc = cityDistricts[(i - 12) % cityDistricts.length];
    const avatar = avatarImages[(i - 12) % avatarImages.length];

    let platformBadge: string = p;
    let badgeType: 'redV' | 'blueV' | 'normal' = 'normal';
    let authType = '机构';
    if (p === '微博') {
      platformBadge = i % 2 === 0 ? '微博/红V' : '微博/蓝V';
      badgeType = i % 2 === 0 ? 'redV' : 'blueV';
      authType = i % 2 === 0 ? '媒体' : '机构';
    } else if (p === '抖音') {
      platformBadge = '抖音/蓝V';
      badgeType = 'blueV';
      authType = '机构';
    } else if (p === '今日头条') {
      platformBadge = '今日头条/蓝V';
      badgeType = 'blueV';
      authType = '机构';
    }

    const fansNum = p === '网站' ? 0 : Math.floor(Math.random() * 5000000) + 5000;
    const fansDisplay = p === '网站' ? '-' : fansNum > 10000 ? `${(fansNum / 10000).toFixed(2)}万` : fansNum.toLocaleString();
    const sourceTypes: LedgerSource[] = ['同步匹配', '批量导入', '手动添加'];
    const source = sourceTypes[(i % 3)];
    const isWhitelist = i % 5 === 0;

    let accountName = `${loc.city}${p === '网站' ? '政务门户网' : p === '微信公众号' ? '发布' : p === '微博' ? '融媒动态' : p === '抖音' ? '视听观察' : '微视角'}_${i}`;
    if (i % 7 === 0) accountName = `${org}官方号_${i}`;

    const numId = 1600000000 + i * 837;
    let detail: LedgerDetailInfo;

    if (p === '网站') {
      detail = {
        ledgerId: `1_${numId}`,
        ledgerUrl: `https://${loc.city.toLowerCase()}${i}.gov.cn`,
        collectStatus: '已采集',
        collectParam: `${loc.city.toLowerCase()}${i}.gov.cn`,
        registeredCity: `${loc.province}/${loc.city}`,
        jurisdictionLocation: `${loc.province}/${loc.city}/${loc.district}`,
        regionalModelLocation: `${loc.province}/${loc.city}`,
        authInfo: {
          siteName: accountName,
          filingNo: `陕ICP备20200${i}号-1`,
          mainFilingNo: `陕ICP备20200${i}号`,
          sponsorName: org,
          sponsorNature: '事业单位',
          approvalDate: `2021-0${(i % 9) + 1}-15 10:00:00`,
          updatedTime: '2026-08-15 19:20:00'
        }
      };
    } else if (p === '微信公众号') {
      detail = {
        ledgerId: `3_${numId}`,
        ledgerUrl: '-',
        collectStatus: '已采集',
        collectParam: `wx_${loc.city.toLowerCase()}_${i}`,
        registeredCity: `${loc.province}/${loc.city}`,
        ipLocation: loc.province,
        jurisdictionLocation: `${loc.province}/${loc.city}/${loc.district}`,
        regionalModelLocation: `${loc.province}/${loc.city}`,
        authInfo: {
          nickname: accountName,
          accountId: `${numId}`,
          authDesc: org,
          updatedTime: '2026-08-15 20:10:00',
          summary: `${org}官方发布矩阵平台，权威发布政务信息与本地动态。`
        }
      };
    } else if (p === '今日头条') {
      detail = {
        ledgerId: `5_${numId}`,
        ledgerUrl: `https://www.toutiao.com/c/user/token/TT_${numId}`,
        collectStatus: '未采集',
        collectParam: `TT_${numId}`,
        registeredCity: `${loc.province}/${loc.city}`,
        ipLocation: loc.province,
        jurisdictionLocation: `${loc.province}/${loc.city}/${loc.district}`,
        regionalModelLocation: `${loc.province}/${loc.city}`,
        authInfo: {
          nickname: accountName,
          accountId: `${numId}`,
          vType: '蓝V',
          ipLocation: loc.province,
          fansCount: fansDisplay,
          worksCount: `${(i * 12 + 80)}`,
          authDesc: `${org}官方账号`,
          updatedTime: '2026-08-15 18:30:00',
          summary: `${org}头条号发布平台。`
        }
      };
    } else if (p === '抖音') {
      detail = {
        ledgerId: `16_${numId}`,
        ledgerUrl: `https://www.douyin.com/user/DY_${numId}`,
        collectStatus: '未采集',
        collectParam: `DY_${numId}`,
        lastPostTime: '2026-08-14 16:30:00',
        lastPostLocation: loc.province,
        registeredCity: `${loc.province}/${loc.city}`,
        ipLocation: loc.province,
        jurisdictionLocation: `${loc.province}/${loc.city}/${loc.district}`,
        regionalModelLocation: `${loc.province}/${loc.city}`,
        authInfo: {
          nickname: accountName,
          accountId: `${numId}`,
          vType: '蓝V',
          registeredProvince: loc.province,
          registeredCity: loc.city,
          ipLocation: loc.province,
          fansCount: fansDisplay,
          followCount: `${i * 3 + 20}`,
          likesCount: `${(fansNum * 2.3 / 10000).toFixed(2)}万`,
          worksCount: `${i * 8 + 45}`,
          authDesc: `${org}官方抖音号`,
          updatedTime: '2026-08-15 19:10:00',
          summary: `记录${loc.city}美好生活，关注${org}。`
        }
      };
    } else {
      // 微博
      detail = {
        ledgerId: `2_${numId}`,
        ledgerUrl: `https://weibo.com/u/${numId}`,
        collectStatus: '未采集',
        collectParam: `${numId}`,
        lastPostTime: '2026-08-15 20:45:00',
        lastPostLocation: `${loc.province}/${loc.city}`,
        registeredCity: `${loc.province}/${loc.city}`,
        ipLocation: loc.province,
        jurisdictionLocation: `${loc.province}/${loc.city}/${loc.district}`,
        regionalModelLocation: `${loc.province}/${loc.city}`,
        authInfo: {
          nickname: accountName,
          accountId: `${numId}`,
          vType: badgeType === 'redV' ? '红V' : '蓝V',
          registeredProvince: loc.province,
          fansCount: fansDisplay,
          followCount: `${i * 5 + 100}`,
          likesCount: `${(fansNum * 1.8 / 10000).toFixed(2)}万`,
          worksCount: `${i * 15 + 120}`,
          authDesc: `${org}官方微博`,
          updatedTime: '2026-08-15 22:00:00'
        }
      };
    }

    const authDesc = p === '网站' ? org : `${org}官方${p}`;
    const intro = `${org}官方${p}平台，发布权威属地政务信息与便民服务动态。`;

    items.push({
      id: i,
      name: accountName,
      platform: p,
      platformBadge,
      badgeType,
      avatar,
      authType,
      judgmentType: i % 2 === 0 ? '精准匹配' : '人工研判',
      tags: ['媒体属性', p === '网站' ? '政务发布' : '新闻媒体', '级别', i % 2 === 0 ? '地市级' : '省级'],
      addresses: [
        { icon: '🏛', text: `${loc.province}/${loc.city}/${loc.district}` },
        { icon: 'IP', text: loc.province, isIP: true },
        { icon: '▲', text: `${loc.province}/${loc.city}` }
      ],
      subjectName: org,
      subjectType: '事业单位',
      fans: fansNum,
      fansDisplay,
      collectStatus: p === '网站' ? '已采集' : '未采集',
      ledgerStatus: '正常',
      source,
      category: 'normal',
      authDesc,
      intro,
      detail
    });
  }

  return items;
};

export const initialMockLedgers: LedgerItem[] = generate100MockLedgers();
