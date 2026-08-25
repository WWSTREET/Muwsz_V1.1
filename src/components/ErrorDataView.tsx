import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ExportConfigModal, ERROR_DATA_EXPORT_FIELDS } from './ExportConfigModal';
import { addDownloadTask } from '../data/downloadCenterStore';

export interface ErrorSubItem {
  id: string;
  errorType: string; // e.g. '错别字' | '固定表述错误' | '政策法规文件名称' | '机构组织名称错误' | '涉习'
  wrongText: string;
  correctText: string;
  status: '未修正' | '已修正' | '忽略';
}

export interface ErrorDataItem {
  id: number;
  title: string;
  platform: '网站' | '微博' | '抖音' | '微信公众号' | '今日头条';
  platformIcon?: string;
  ledgerName: string;
  institutionName: string;
  subjectType: string; // e.g. '事业单位' | '党政机关' | '企业'
  publishTime: string;
  alertStatus: '未预警' | '机器预警' | '人工预警';
  alertTime: string;
  errors: ErrorSubItem[];
  url?: string;
  // Detail fields
  contexts?: {
    text: string;
    errorHighlight: string;
  }[];
  screenshotUrl?: string;
  postContent?: string;
  operationLogs?: {
    action: string;
    time: string;
    detail?: string;
  }[];
}

export const INITIAL_ERROR_DATA: ErrorDataItem[] = [
  {
    id: 1,
    title: '陕西省教育考试院关于做好2026年陕西省普通高校招生考试报名工作的通知',
    platform: '网站',
    ledgerName: '西安航空职业技术学院',
    institutionName: '中共陕西省委网络安全和信息化委员会办公室',
    subjectType: '事业单位',
    publishTime: '2026-08-31 00:00:00',
    alertStatus: '未预警',
    alertTime: '-',
    url: 'http://www.xihang.edu.cn/info/1024/12890.htm',
    errors: [
      {
        id: 'e-1-1',
        errorType: '错别字',
        wrongText: '可登录',
        correctText: '可登陆',
        status: '未修正',
      },
      {
        id: 'e-1-2',
        errorType: '固定表述错误',
        wrongText: '中华人民共和国宪法',
        correctText: '《中华人民共和国宪法》',
        status: '未修正',
      },
    ],
    contexts: [
      {
        text: '考生在报名期间可登录陕西省教育考试院门户网站填报信息，须遵守中华人民共和国宪法及相关法律法规。',
        errorHighlight: '可登录',
      },
      {
        text: '依据中华人民共和国宪法和教育法规定，报名人员应如实提交资格审查材料。',
        errorHighlight: '中华人民共和国宪法',
      },
    ],
    screenshotUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60',
    postContent:
      '陕西省教育考试院关于做好2026年陕西省普通高校招生考试报名工作的通知：各市（区）教育考试机构，各普通高等学校：为做好2026年我省普通高等学校招生考试报名工作，现就有关事项通知如下。一、报名条件与资格审查...考生可登录陕西省教育考试院网站填报个人信息。',
    operationLogs: [
      {
        action: '机器研判',
        time: '2026-08-31 01:15:20',
        detail: '错误内容：可登录 → 可登陆；中华人民共和国宪法 → 《中华人民共和国宪法》',
      },
      { action: '数据入库', time: '2026-08-31 00:05:12' },
    ],
  },
  {
    id: 2,
    title: '8天时间婚外胚胎案迎来双重转折陕视评 层的细节值得所有人警醒！',
    platform: '微博',
    ledgerName: '陕视新闻',
    institutionName: '中共陕西省委网络安全和信息化委员会办公室',
    subjectType: '事业单位',
    publishTime: '2026-08-17 22:50:20',
    alertStatus: '未预警',
    alertTime: '-',
    url: 'https://weibo.com/1827364521/O4s761jKl',
    errors: [
      {
        id: 'e-2-1',
        errorType: '政策法规文件名称',
        wrongText: '《刑法》',
        correctText: '《中华人民共和国刑法》',
        status: '未修正',
      },
    ],
    contexts: [
      {
        text: '陕视评：从司法实践来看，《刑法》对非法买卖、运输人体器官等行为均有明确严厉的定罪量刑标准。',
        errorHighlight: '《刑法》',
      },
    ],
    screenshotUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    postContent:
      '8天时间婚外胚胎案迎来双重转折陕视评 层的细节值得所有人警醒！针对医疗机构及相关当事人的涉嫌违规操作，根据《刑法》及民法典相关司法解释，需依法追究法律责任。',
    operationLogs: [
      { action: '机器研判', time: '2026-08-17 23:10:44', detail: '错误内容：《刑法》 → 《中华人民共和国刑法》' },
      { action: '数据入库', time: '2026-08-17 22:52:10' },
    ],
  },
  {
    id: 3,
    title: '陕西省住房和城乡建设厅综合服务中心',
    platform: '网站',
    ledgerName: '-',
    institutionName: '中共陕西省委网络安全和信息化委员会办公室',
    subjectType: '党政机关',
    publishTime: '2026-08-17 22:43:58',
    alertStatus: '机器预警',
    alertTime: '2026-08-19 10:40:14',
    url: 'http://js.shaanxi.gov.cn/art/2026/8/17/art_102.html',
    errors: [
      {
        id: 'e-3-1',
        errorType: '机构组织名称错误',
        wrongText: '住房城乡和建设部',
        correctText: '住房和城乡建设部',
        status: '未修正',
      },
    ],
    contexts: [
      {
        text: '根据住房城乡和建设部办公厅最新下发的关于做好建筑施工安全防护的通知精神...',
        errorHighlight: '住房城乡和建设部',
      },
    ],
    screenshotUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60',
    postContent:
      '陕西省住房和城乡建设厅综合服务中心发布最新通知：按照住房城乡和建设部工作部署，现将全省建筑工程质量安全综合考评结果予以公示。',
    operationLogs: [
      { action: '机器预警触发', time: '2026-08-19 10:40:14', detail: '预警策略：高频敏感机构名称纠错' },
      { action: '机器研判', time: '2026-08-17 23:05:11', detail: '错误内容：住房城乡和建设部 → 住房和城乡建设部' },
      { action: '数据入库', time: '2026-08-17 22:45:00' },
    ],
  },
  {
    id: 4,
    title: '陕西省住房和城乡建设厅综合服务中心',
    platform: '网站',
    ledgerName: '-',
    institutionName: '中共陕西省委网络安全和信息化委员会办公室',
    subjectType: '党政机关',
    publishTime: '2026-08-17 22:43:43',
    alertStatus: '未预警',
    alertTime: '-',
    url: 'http://js.shaanxi.gov.cn/art/2026/8/17/art_103.html',
    errors: [
      {
        id: 'e-4-1',
        errorType: '错别字',
        wrongText: '可登录',
        correctText: '可登陆',
        status: '未修正',
      },
    ],
    contexts: [
      {
        text: '企业资质申报人员可登录陕西省政务服务网进行在线审批申报与进度查询。',
        errorHighlight: '可登录',
      },
    ],
    screenshotUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60',
    postContent: '陕西省住房和城乡建设厅综合服务中心：有关资质申报人员可登录系统办理业务。',
    operationLogs: [
      { action: '机器研判', time: '2026-08-17 23:01:00', detail: '错误内容：可登录 → 可登陆' },
      { action: '数据入库', time: '2026-08-17 22:44:00' },
    ],
  },
  {
    id: 5,
    title: '陕西省住房和城乡建设厅综合服务中心',
    platform: '网站',
    ledgerName: '-',
    institutionName: '中共陕西省委网络安全和信息化委员会办公室',
    subjectType: '党政机关',
    publishTime: '2026-08-17 22:43:42',
    alertStatus: '机器预警',
    alertTime: '2026-08-19 10:40:10',
    url: 'http://js.shaanxi.gov.cn/art/2026/8/17/art_104.html',
    errors: [
      {
        id: 'e-5-1',
        errorType: '机构组织名称错误',
        wrongText: '住房城乡建设部',
        correctText: '住房和城乡建设部',
        status: '未修正',
      },
    ],
    contexts: [
      {
        text: '认真贯彻落实住房城乡建设部关于推进新型城市基础设施建设的实施意见。',
        errorHighlight: '住房城乡建设部',
      },
    ],
    screenshotUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60',
    postContent:
      '陕西省住房和城乡建设厅综合服务中心转发住房城乡建设部关于加快新型智慧城市建设的指导意见。',
    operationLogs: [
      { action: '机器预警触发', time: '2026-08-19 10:40:10', detail: '预警策略：部委级机构规范表述' },
      { action: '机器研判', time: '2026-08-17 23:00:00', detail: '错误内容：住房城乡建设部 → 住房和城乡建设部' },
      { action: '数据入库', time: '2026-08-17 22:44:00' },
    ],
  },
  {
    id: 6,
    title: '#媒体原创 #陕西dou知道 陕视评：从“互相折腾”到“两方安心”《生态环境法典》落地，让“预防为主”管住百姓身边的小微',
    platform: '抖音',
    ledgerName: '陕视新闻',
    institutionName: '中共陕西省委网络安全和信息化委员会办公室',
    subjectType: '事业单位',
    publishTime: '2026-08-17 22:20:18',
    alertStatus: '机器预警',
    alertTime: '2026-08-19 10:33:24',
    url: 'https://www.iesdouyin.com/share/video/7675005221864557864',
    errors: [
      {
        id: 'e-6-1',
        errorType: '固定表述错误',
        wrongText: '《生态环境法典》',
        correctText: '《中华人民共和国生态环境法典》',
        status: '未修正',
      },
    ],
    contexts: [
      {
        text: '#媒体原创 #陕西dou知道 陕视评：从“互相折腾”到“两方安心”《生态环境法典》落地，让“预防为主”管住百姓身边的小微',
        errorHighlight: '《生态环境法典》',
      },
      {
        text: '#媒体原创 #陕西dou知道 陕视评：从“互相折腾”到“两方安心”《生态环境法典》落地，让“预防为主”管住百姓身边的小微污染。（策划：李形 任超 评论员：刁坤 摄像：冯奕菲）{图片内容}：从“互相折腾”到“两方安心”《生态环境法典》落地让“预防为主”管住百姓身边的小微污染陕视新闻评论员刁坤小区楼下油烟侵扰生活',
        errorHighlight: '《生态环境法典》',
      },
      {
        text: 'dou知道 陕视评：从“互相折腾”到“两方安心”《生态环境法典》落地，让“预防为主”管住百姓身边的小微污染。（策划：李形 任超 评论员：刁坤 摄像：冯奕菲）{图片内容}：从“互相折腾”到“两方安心”《生态环境法典》落地让“预防为主”管住百姓身边的小微污染陕视新闻评论员刁坤小区楼下油烟侵扰生活',
        errorHighlight: '《生态环境法典》',
      },
    ],
    screenshotUrl: 'https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=800&auto=format&fit=crop&q=60',
    postContent:
      '#媒体原创 #陕西dou知道 陕视评：从“互相折腾”到“两方安心”《生态环境法典》落地，让“预防为主”管住百姓身边的小微污染。（策划：李形 任超 评论员：刁坤 摄像：冯奕菲）{图片内容}：从“互相折腾”到“两方安心”《生态环境法典》落地让“预防为主”管住百姓身边的小微污染陕视新闻评论员刁坤小区楼下油烟侵扰生活',
    operationLogs: [
      {
        action: '机器研判',
        time: '2026-08-19 10:33:24',
        detail: '错误内容：《生态环境法典》 → 《中华人民共和国生态环境法典》',
      },
      { action: '数据入库', time: '2026-08-17 22:22:57' },
    ],
  },
  {
    id: 7,
    title: '文化惠民聚民心 薪火赓续启新声——巴塘多元文艺展演点亮群众夜生活#非遗传承 #民...',
    platform: '微信公众号',
    ledgerName: '巴塘发布',
    institutionName: '中共陕西省委网络安全和信息化委员会办公室',
    subjectType: '党政机关',
    publishTime: '2026-08-17 22:10:00',
    alertStatus: '未预警',
    alertTime: '-',
    url: 'https://mp.weixin.qq.com/s/sample_weixin_url_1',
    errors: [
      {
        id: 'e-7-1',
        errorType: '固定表述错误',
        wrongText: '人民政府',
        correctText: '人民政府',
        status: '未修正',
      },
    ],
    contexts: [
      {
        text: '由巴塘县人民政府主办的非遗民俗文化展演活动在市民文化广场圆满落幕。',
        errorHighlight: '人民政府',
      },
    ],
    screenshotUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
    postContent: '文化惠民聚民心 薪火赓续启新声——巴塘多元文艺展演点亮群众夜生活。',
    operationLogs: [
      { action: '机器研判', time: '2026-08-17 22:45:00', detail: '固定表述核验' },
      { action: '数据入库', time: '2026-08-17 22:15:00' },
    ],
  },
  {
    id: 8,
    title: '加油新规来了！11月起正式实施（编辑：习孺豫）#加油#加油站 #车主 #燃油车 #202...',
    platform: '今日头条',
    ledgerName: '今日陕西',
    institutionName: '中共陕西省委网络安全和信息化委员会办公室',
    subjectType: '事业单位',
    publishTime: '2026-08-17 22:05:00',
    alertStatus: '机器预警',
    alertTime: '2026-08-19 10:20:00',
    url: 'https://www.toutiao.com/article/767500123984',
    errors: [
      {
        id: 'e-8-1',
        errorType: '机构组织名称错误',
        wrongText: '国家税务总局',
        correctText: '国家税务总局',
        status: '未修正',
      },
    ],
    contexts: [
      {
        text: '国家税务总局明确要求加油站开具增值税发票须严格核验车牌与企业税号信息。',
        errorHighlight: '国家税务总局',
      },
    ],
    screenshotUrl: 'https://images.unsplash.com/photo-1527018606416-a674e140cdc7?w=800&auto=format&fit=crop&q=60',
    postContent: '加油新规来了！11月起正式实施，车主朋友们请提前知晓。',
    operationLogs: [
      { action: '机器研判', time: '2026-08-19 10:20:00', detail: '机构名称规范比对' },
      { action: '数据入库', time: '2026-08-17 22:10:00' },
    ],
  },
  {
    id: 9,
    title: '#悬赏 甘泉县人民法院执行悬赏公告',
    platform: '微博',
    ledgerName: '甘泉法院',
    institutionName: '中共陕西省委网络安全和信息化委员会办公室',
    subjectType: '党政机关',
    publishTime: '2026-08-17 21:55:12',
    alertStatus: '未预警',
    alertTime: '-',
    url: 'https://weibo.com/gqcourt/post/98716254',
    errors: [
      {
        id: 'e-9-1',
        errorType: '固定表述错误',
        wrongText: '公民身份证',
        correctText: '居民身份证',
        status: '未修正',
      },
    ],
    contexts: [
      {
        text: '被执行人信息公布：张某某，男，公民身份证号码：6106311985...',
        errorHighlight: '公民身份证',
      },
    ],
    screenshotUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=60',
    postContent: '甘泉县人民法院执行悬赏公告：为最大限度兑现申请执行人胜诉权益...',
    operationLogs: [
      { action: '机器研判', time: '2026-08-17 22:10:00', detail: '错误内容：公民身份证 → 居民身份证' },
      { action: '数据入库', time: '2026-08-17 21:58:00' },
    ],
  },
  {
    id: 10,
    title: '受台风“白海豚”强降雨影响，萧县辖区大量农村公路出现塌方、路基冲毁、桥梁受...',
    platform: '网站',
    ledgerName: '萧县交通局',
    institutionName: '中共陕西省委网络安全和信息化委员会办公室',
    subjectType: '党政机关',
    publishTime: '2026-08-17 21:30:00',
    alertStatus: '未预警',
    alertTime: '-',
    url: 'http://www.xiaoxian.gov.cn/jtj/info_1289.html',
    errors: [
      {
        id: 'e-10-1',
        errorType: '错别字',
        wrongText: '爆发',
        correctText: '暴发',
        status: '未修正',
      },
    ],
    contexts: [
      {
        text: '由于持续强降雨导致局部山区爆发山洪与泥石流地质灾害...',
        errorHighlight: '爆发',
      },
    ],
    screenshotUrl: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&auto=format&fit=crop&q=60',
    postContent: '受台风强降雨影响，萧县辖区抢险救灾工作正全面展开。',
    operationLogs: [
      { action: '机器研判', time: '2026-08-17 21:45:00', detail: '错误内容：爆发 → 暴发' },
      { action: '数据入库', time: '2026-08-17 21:35:00' },
    ],
  },
  {
    id: 11,
    title: '为进一步推动平安建设工作走深走实，把法治知识送到群众家门口，8月15日，我局...',
    platform: '微信公众号',
    ledgerName: '平安汉中',
    institutionName: '中共陕西省委网络安全和信息化委员会办公室',
    subjectType: '党政机关',
    publishTime: '2026-08-17 20:10:00',
    alertStatus: '机器预警',
    alertTime: '2026-08-19 09:15:00',
    url: 'https://mp.weixin.qq.com/s/hz_police_post_2',
    errors: [
      {
        id: 'e-11-1',
        errorType: '涉习',
        wrongText: '习平',
        correctText: '习近平',
        status: '未修正',
      },
    ],
    contexts: [
      {
        text: '全体民辅警要深入学习贯彻习平新时代中国特色社会主义思想与法治思想...',
        errorHighlight: '习平',
      },
    ],
    screenshotUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=60',
    postContent: '为进一步推动平安建设工作走深走实，把法治知识送到群众家门口。',
    operationLogs: [
      { action: '机器预警触发', time: '2026-08-19 09:15:00', detail: '涉政领导人姓名关键表述预警' },
      { action: '机器研判', time: '2026-08-17 20:30:00', detail: '错误内容：习平 → 习近平' },
      { action: '数据入库', time: '2026-08-17 20:15:00' },
    ],
  },
];

interface ErrorDataViewProps {
  onBackToInstitution?: () => void;
  initialInstitutionName?: string;
}

export const ErrorDataView: React.FC<ErrorDataViewProps> = ({
  onBackToInstitution,
  initialInstitutionName,
}) => {
  // Filter States (Row 1, Row 2, Row 3)
  const [titleFilter, setTitleFilter] = useState('');
  const [ledgerFilter, setLedgerFilter] = useState('');
  const [instFilter, setInstFilter] = useState(initialInstitutionName || '');
  const [platformFilter, setPlatformFilter] = useState('');
  const [subjectTypeFilter, setSubjectTypeFilter] = useState('');
  const [errorTypeFilter, setErrorTypeFilter] = useState('');
  const [alertStatusFilter, setAlertStatusFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Table selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Export states
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportMode, setExportMode] = useState<'selected' | 'all'>('all');
  const [showExportToast, setShowExportToast] = useState<{ show: boolean; msg: string } | null>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close export menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenExportModal = (mode: 'selected' | 'all') => {
    setIsExportMenuOpen(false);
    if (mode === 'selected' && selectedIds.length === 0) {
      return;
    }
    setExportMode(mode);
    setIsExportModalOpen(true);
  };

  const handleConfirmExport = (config: {
    format: 'xlsx' | 'csv' | 'json';
    fileName: string;
    selectedFields: string[];
  }) => {
    const targetData =
      exportMode === 'selected'
        ? filteredData.filter(item => selectedIds.includes(item.id))
        : filteredData;

    const count = targetData.length;
    const formatExt = config.format === 'xlsx' ? 'xlsx' : config.format === 'csv' ? 'csv' : 'json';
    const finalFileName = `${config.fileName || `错误表述数据_${new Date().toISOString().slice(0, 10)}`}.${formatExt}`;

    // Add task to downloadCenterStore
    addDownloadTask({
      fileName: finalFileName,
      taskType: exportMode === 'selected' ? '错误表述选中导出' : '错误表述一键导出',
      count: count,
      status: 'completed',
      operator: '管理员',
      selectedFields: config.selectedFields,
      records: targetData,
    });

    setIsExportModalOpen(false);

    setShowExportToast({
      show: true,
      msg: `已成功创建导出任务（共 ${count} 条记录），文件正在生成中`,
    });

    setTimeout(() => {
      setShowExportToast(null);
    }, 5000);
  };

  // Drawer detail state
  const [selectedDetailItem, setSelectedDetailItem] = useState<ErrorDataItem | null>(null);
  const [activeAnchor, setActiveAnchor] = useState<string>('context');

  // References for drawer section scrolling
  const contextRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const screenshotRef = useRef<HTMLDivElement>(null);
  const postRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: string) => {
    setActiveAnchor(section);
    if (section === 'context') contextRef.current?.scrollIntoView({ behavior: 'smooth' });
    else if (section === 'error') errorRef.current?.scrollIntoView({ behavior: 'smooth' });
    else if (section === 'screenshot') screenshotRef.current?.scrollIntoView({ behavior: 'smooth' });
    else if (section === 'post') postRef.current?.scrollIntoView({ behavior: 'smooth' });
    else if (section === 'log') logRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return INITIAL_ERROR_DATA.filter(item => {
      if (titleFilter && !item.title.toLowerCase().includes(titleFilter.toLowerCase())) return false;
      if (ledgerFilter && !item.ledgerName.toLowerCase().includes(ledgerFilter.toLowerCase())) return false;
      if (instFilter && !item.institutionName.toLowerCase().includes(instFilter.toLowerCase())) return false;
      if (platformFilter && item.platform !== platformFilter) return false;
      if (subjectTypeFilter && item.subjectType !== subjectTypeFilter) return false;
      if (alertStatusFilter && item.alertStatus !== alertStatusFilter) return false;
      if (errorTypeFilter && !item.errors.some(e => e.errorType === errorTypeFilter)) return false;
      if (statusFilter && !item.errors.some(e => e.status === statusFilter)) return false;
      if (startDate && item.publishTime < `${startDate} 00:00:00`) return false;
      if (endDate && item.publishTime > `${endDate} 23:59:59`) return false;
      return true;
    });
  }, [
    titleFilter,
    ledgerFilter,
    instFilter,
    platformFilter,
    subjectTypeFilter,
    errorTypeFilter,
    alertStatusFilter,
    statusFilter,
    startDate,
    endDate,
  ]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredData.map(i => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleReset = () => {
    setTitleFilter('');
    setLedgerFilter('');
    setInstFilter('');
    setPlatformFilter('');
    setSubjectTypeFilter('');
    setErrorTypeFilter('');
    setAlertStatusFilter('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
    setSelectedIds([]);
  };

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case '微博':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-normal bg-orange-50 text-orange-600 border border-orange-200">
            <i className="fa-brands fa-weibo mr-1"></i> 微博
          </span>
        );
      case '抖音':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-normal bg-gray-900 text-cyan-400 border border-gray-700">
            <i className="fa-brands fa-tiktok mr-1"></i> 抖音
          </span>
        );
      case '微信公众号':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-normal bg-green-50 text-green-600 border border-green-200">
            <i className="fa-brands fa-weixin mr-1"></i> 微信公众号
          </span>
        );
      case '今日头条':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-normal bg-red-50 text-red-600 border border-red-200">
            <i className="fa-solid fa-newspaper mr-1"></i> 今日头条
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-normal bg-blue-50 text-[#1677ff] border border-blue-200">
            <i className="fa-solid fa-globe mr-1"></i> 网站
          </span>
        );
    }
  };

  // Helper to render text with highlighted error word in red
  const renderHighlightedContext = (text: string, highlight?: string) => {
    if (!highlight || !text.includes(highlight)) {
      return text;
    }
    const parts = text.split(highlight);
    return (
      <>
        {parts.map((part, idx) => (
          <React.Fragment key={idx}>
            {part}
            {idx < parts.length - 1 && (
              <span className="text-red-500 font-bold underline decoration-red-400 decoration-2">{highlight}</span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white flex flex-col p-5 min-h-0 text-[#333] relative">
      {/* Page Title */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <h2 className="text-base font-bold text-gray-800">错误表述数据</h2>
        </div>
      </div>

      {/* Filter Card (Image 1) */}
      <div className="bg-white border border-[#e8e8e8] rounded-sm p-4 mb-4 shadow-2xs">
        <div className="space-y-3 text-xs">
          {/* Row 1 */}
          <div className="grid grid-cols-4 gap-4">
            {/* 文章标题 */}
            <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff] focus-within:ring-1 focus-within:ring-[#1677ff]/20">
              <div className="flex items-center text-gray-600 font-medium whitespace-nowrap mr-2 select-none">
                <span>文章标题</span>
                <i className="fa-solid fa-angle-down ml-1 text-[10px] text-gray-400"></i>
              </div>
              <input
                type="text"
                value={titleFilter}
                maxLength={100}
                onChange={e => setTitleFilter(e.target.value)}
                placeholder="请输入文章标题"
                className="w-full text-xs text-gray-700 focus:outline-none bg-transparent"
              />
              <span className="text-gray-400 text-[10px] whitespace-nowrap ml-1">{titleFilter.length} / 100</span>
            </div>

            {/* 台账名称 */}
            <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff] focus-within:ring-1 focus-within:ring-[#1677ff]/20">
              <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">台账名称</span>
              <input
                type="text"
                value={ledgerFilter}
                maxLength={50}
                onChange={e => setLedgerFilter(e.target.value)}
                placeholder="请输入台账名称"
                className="w-full text-xs text-gray-700 focus:outline-none bg-transparent"
              />
              <span className="text-gray-400 text-[10px] whitespace-nowrap ml-1">{ledgerFilter.length} / 50</span>
            </div>

            {/* 机构名称 */}
            <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff] focus-within:ring-1 focus-within:ring-[#1677ff]/20">
              <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">机构名称</span>
              <input
                type="text"
                value={instFilter}
                maxLength={100}
                onChange={e => setInstFilter(e.target.value)}
                placeholder="请输入机构名称"
                className="w-full text-xs text-gray-700 focus:outline-none bg-transparent"
              />
              <span className="text-gray-400 text-[10px] whitespace-nowrap ml-1">{instFilter.length} / 100</span>
            </div>

            {/* 平台类型 */}
            <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white">
              <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">平台类型</span>
              <select
                value={platformFilter}
                onChange={e => setPlatformFilter(e.target.value)}
                className="w-full text-xs text-gray-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="">请选择平台类型</option>
                <option value="网站">网站</option>
                <option value="微博">微博</option>
                <option value="抖音">抖音</option>
                <option value="微信公众号">微信公众号</option>
                <option value="今日头条">今日头条</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-4 gap-4">
            {/* 主体类型 */}
            <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white">
              <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">主体类型</span>
              <select
                value={subjectTypeFilter}
                onChange={e => setSubjectTypeFilter(e.target.value)}
                className="w-full text-xs text-gray-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="">请选择主体类型</option>
                <option value="事业单位">事业单位</option>
                <option value="党政机关">党政机关</option>
                <option value="企业">企业</option>
                <option value="社会组织">社会组织</option>
              </select>
            </div>

            {/* 错误类型 */}
            <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white">
              <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">错误类型</span>
              <select
                value={errorTypeFilter}
                onChange={e => setErrorTypeFilter(e.target.value)}
                className="w-full text-xs text-gray-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="">请选择错误类型</option>
                <option value="错别字">错别字</option>
                <option value="固定表述错误">固定表述错误</option>
                <option value="政策法规文件名称">政策法规文件名称</option>
                <option value="机构组织名称错误">机构组织名称错误</option>
                <option value="涉习">涉习</option>
              </select>
            </div>

            {/* 预警状态 */}
            <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white">
              <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">预警状态</span>
              <select
                value={alertStatusFilter}
                onChange={e => setAlertStatusFilter(e.target.value)}
                className="w-full text-xs text-gray-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="">请选择预警状态</option>
                <option value="未预警">未预警</option>
                <option value="机器预警">机器预警</option>
                <option value="人工预警">人工预警</option>
              </select>
            </div>

            {/* 修正状态 */}
            <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white">
              <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">修正状态</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full text-xs text-gray-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="">请选择修正状态</option>
                <option value="未修正">未修正</option>
                <option value="已修正">已修正</option>
                <option value="忽略">忽略</option>
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex items-center justify-between">
            {/* 发布时间 */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-gray-600 font-medium whitespace-nowrap select-none">
                <span>发布时间</span>
                <i className="fa-solid fa-angle-down ml-1 text-[10px] text-gray-400"></i>
              </div>
              <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1 bg-white space-x-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="text-xs text-gray-700 focus:outline-none bg-transparent"
                  placeholder="开始日期"
                />
                <span className="text-gray-400">~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="text-xs text-gray-700 focus:outline-none bg-transparent"
                  placeholder="结束日期"
                />
                <i className="fa-regular fa-calendar text-gray-400 text-xs ml-1"></i>
              </div>
            </div>

            {/* Action Buttons with Export */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {}}
                className="bg-[#1677ff] hover:bg-[#4096ff] text-white px-5 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center space-x-1 shadow-xs"
              >
                <i className="fa-solid fa-magnifying-glass text-[11px]"></i>
                <span>查询</span>
              </button>
              <button
                onClick={handleReset}
                className="border border-[#d9d9d9] bg-white hover:bg-gray-50 text-gray-700 px-4 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
              >
                <i className="fa-solid fa-rotate-right text-[11px]"></i>
                <span>重置</span>
              </button>

              {/* Export Dropdown Button */}
              <div className="relative" ref={exportMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                  className="border border-[#1677ff] bg-white hover:bg-[#f0f7ff] text-[#1677ff] px-4 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs font-medium"
                >
                  <i className="fa-solid fa-download text-[11px]"></i>
                  <span>导出</span>
                  <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${isExportMenuOpen ? 'rotate-180' : ''}`}></i>
                </button>

                {isExportMenuOpen && (
                  <div className="absolute right-0 mt-1 w-36 bg-white rounded shadow-lg border border-gray-100 py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={() => handleOpenExportModal('selected')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center space-x-2 transition-colors ${
                        selectedIds.length === 0
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-[#f0f7ff] hover:text-[#1677ff] cursor-pointer'
                      }`}
                    >
                      <i className="fa-solid fa-check-double text-[11px]"></i>
                      <span>导出选中 ({selectedIds.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenExportModal('all')}
                      className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-[#f0f7ff] hover:text-[#1677ff] flex items-center space-x-2 cursor-pointer transition-colors"
                    >
                      <i className="fa-solid fa-file-export text-[11px]"></i>
                      <span>一键导出全部</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table (Image 1) */}
      <div className="border border-[#e8e8e8] rounded-sm bg-white overflow-hidden shadow-xs flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs table-fixed">
            <thead className="bg-[#fafafa] text-gray-700 border-b border-[#e8e8e8]">
              <tr>
                <th className="px-2 py-2.5 font-normal w-[36px] text-center whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-[#1677ff] cursor-pointer"
                  />
                </th>
                <th className="px-2 py-2.5 font-medium w-[45px] text-center whitespace-nowrap">序号</th>
                <th className="px-3 py-2.5 font-medium w-[18%] whitespace-nowrap">标题</th>
                <th className="px-3 py-2.5 font-medium w-[22%] whitespace-nowrap">错误内容</th>
                <th className="px-2 py-2.5 font-medium w-[75px] text-center whitespace-nowrap">修正状态</th>
                <th className="px-3 py-2.5 font-medium w-[130px] whitespace-nowrap">台账信息</th>
                <th className="px-3 py-2.5 font-medium w-[15%] whitespace-nowrap">所属机构</th>
                <th className="px-3 py-2.5 font-medium w-[130px] whitespace-nowrap">发布时间</th>
                <th className="px-2 py-2.5 font-medium w-[85px] text-center whitespace-nowrap">预警状态</th>
                <th className="px-3 py-2.5 font-medium w-[125px] whitespace-nowrap">预警时间</th>
                <th className="px-2 py-2.5 font-medium w-[60px] text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0] text-gray-600">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <i className="fa-regular fa-folder-open text-3xl text-gray-300"></i>
                      <span>暂无符合条件的错误表述数据</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => {
                  return (
                    <tr key={item.id} className="hover:bg-[#fafafa] transition-colors">
                      {/* Checkbox - Vertically Centered */}
                      <td className="px-2 py-3 text-center align-middle">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleSelectOne(item.id)}
                          className="rounded border-gray-300 text-[#1677ff] cursor-pointer"
                        />
                      </td>

                      {/* 序号 - Vertically Centered */}
                      <td className="px-2 py-3 text-center text-gray-500 font-normal align-middle">{index + 1}</td>

                      {/* 标题 (Blue link) - Vertically Centered */}
                      <td className="px-3 py-3 font-normal align-middle">
                        <button
                          onClick={() => setSelectedDetailItem(item)}
                          className="text-[#1677ff] hover:underline text-left text-xs line-clamp-3 leading-relaxed cursor-pointer font-medium"
                          title={item.title}
                        >
                          {item.title}
                        </button>
                      </td>

                      {/* 错误内容 (Multi-item support) - Vertically Centered */}
                      <td className="px-3 py-3 align-middle">
                        <div className="space-y-2.5">
                          {item.errors.map((err, errIdx) => (
                            <div key={err.id} className={`space-y-1 ${errIdx > 0 ? 'pt-2.5 border-t border-dashed border-gray-200' : ''}`}>
                              <div className="text-[11px] text-gray-400 font-normal">{err.errorType}</div>
                              <div className="flex items-center space-x-1.5 text-xs text-gray-800">
                                <i className="fa-solid fa-circle-xmark text-red-500 text-[11px]"></i>
                                <span className="text-gray-900 font-medium">{err.wrongText}</span>
                              </div>
                              <div className="flex items-center space-x-1.5 text-xs text-gray-800">
                                <i className="fa-solid fa-circle-check text-green-500 text-[11px]"></i>
                                <span className="text-gray-700">{err.correctText}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* 修正状态 - Vertically Centered */}
                      <td className="px-2 py-3 text-center align-middle">
                        <div className="space-y-2.5">
                          {item.errors.map((err, errIdx) => (
                            <div key={err.id} className={`flex items-center justify-center h-[54px] ${errIdx > 0 ? 'pt-2.5 border-t border-dashed border-gray-200' : ''}`}>
                              {err.status === '未修正' ? (
                                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-normal bg-red-50 text-red-500 border border-red-200">
                                  未修正
                                </span>
                              ) : err.status === '已修正' ? (
                                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-normal bg-green-50 text-green-600 border border-green-200">
                                  已修正
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-normal bg-gray-50 text-gray-500 border border-gray-200">
                                  忽略
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* 台账信息 - Vertically Centered */}
                      <td className="px-3 py-3 align-middle">
                        <div className="space-y-1">
                          <div className="text-gray-800 font-normal truncate" title={item.ledgerName}>
                            {item.ledgerName}
                          </div>
                          <div>{getPlatformBadge(item.platform)}</div>
                        </div>
                      </td>

                      {/* 所属机构 - Vertically Centered */}
                      <td className="px-3 py-3 align-middle">
                        <div className="space-y-1">
                          <div className="text-gray-800 font-normal truncate" title={item.institutionName}>
                            {item.institutionName}
                          </div>
                          <div className="text-[11px] text-gray-500">{item.subjectType}</div>
                        </div>
                      </td>

                      {/* 发布时间 - Vertically Centered */}
                      <td className="px-3 py-3 text-gray-600 font-mono text-[11px] whitespace-nowrap align-middle">
                        {item.publishTime}
                      </td>

                      {/* 预警状态 - Vertically Centered */}
                      <td className="px-2 py-3 text-center whitespace-nowrap align-middle">
                        {item.alertStatus === '机器预警' ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-normal bg-amber-50 text-[#d46b08] border border-[#ffd591]">
                            机器预警
                          </span>
                        ) : item.alertStatus === '人工预警' ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-normal bg-blue-50 text-[#1677ff] border border-[#91caff]">
                            人工预警
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-normal bg-gray-50 text-gray-400 border border-gray-200">
                            未预警
                          </span>
                        )}
                      </td>

                      {/* 预警时间 - Vertically Centered */}
                      <td className="px-3 py-3 text-gray-500 font-mono text-[11px] whitespace-nowrap align-middle">
                        {item.alertTime}
                      </td>

                      {/* 操作 - Vertically Centered */}
                      <td className="px-2 py-3 text-center whitespace-nowrap align-middle">
                        <button
                          onClick={() => setSelectedDetailItem(item)}
                          className="text-[#1677ff] hover:underline cursor-pointer font-medium"
                        >
                          详情
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#e8e8e8] bg-[#fafafa] text-xs text-gray-600">
          <div>
            共 <strong className="text-gray-800 font-medium">{filteredData.length}</strong> 条错误表述数据
            {selectedIds.length > 0 && (
              <span className="ml-2 text-[#1677ff]">
                （已勾选 <strong>{selectedIds.length}</strong> 项）
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <span>第 1 / 1 页</span>
          </div>
        </div>
      </div>

      {/* Information Detail Slide-over Drawer (Image 2) */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedDetailItem(null)}
            className="absolute inset-0 bg-black/35 backdrop-blur-xs transition-opacity"
          ></div>

          {/* Drawer Container */}
          <div className="relative w-[860px] max-w-[90vw] h-full bg-white shadow-2xl flex flex-col border-l border-gray-200 text-[#333] z-10 animate-slide-in-right overflow-hidden">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-white">
              <h3 className="text-base font-bold text-gray-800">信息详情</h3>
              <button
                onClick={() => setSelectedDetailItem(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer text-xl p-1 leading-none rounded hover:bg-gray-100"
                title="关闭"
              >
                &times;
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Top Article Card */}
              <div className="bg-white border-b border-gray-100 pb-5 space-y-3">
                {/* Title with highlighted error words */}
                <div className="flex items-start space-x-2">
                  <span className="mt-0.5 flex-shrink-0">
                    {selectedDetailItem.platform === '抖音' ? (
                      <i className="fa-brands fa-tiktok text-gray-900 text-sm"></i>
                    ) : selectedDetailItem.platform === '微博' ? (
                      <i className="fa-brands fa-weibo text-orange-500 text-sm"></i>
                    ) : selectedDetailItem.platform === '微信公众号' ? (
                      <i className="fa-brands fa-weixin text-green-500 text-sm"></i>
                    ) : selectedDetailItem.platform === '今日头条' ? (
                      <i className="fa-solid fa-newspaper text-red-500 text-sm"></i>
                    ) : (
                      <i className="fa-solid fa-globe text-[#1677ff] text-sm"></i>
                    )}
                  </span>
                  <h2 className="text-sm font-bold text-gray-900 leading-relaxed">
                    {selectedDetailItem.errors.length > 0
                      ? renderHighlightedContext(selectedDetailItem.title, selectedDetailItem.errors[0].wrongText)
                      : selectedDetailItem.title}
                  </h2>
                </div>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-xs text-gray-500 pt-1">
                  <div>
                    <span>台账名称: </span>
                    <span className="text-gray-800 font-medium">{selectedDetailItem.ledgerName}</span>
                  </div>
                  <div>
                    <span>主体类型: </span>
                    <span className="text-gray-800 font-medium">{selectedDetailItem.subjectType}</span>
                  </div>
                  <div>
                    <span>发布时间: </span>
                    <span className="text-gray-800 font-mono">{selectedDetailItem.publishTime}</span>
                  </div>
                </div>

                {/* Original URL */}
                {selectedDetailItem.url && (
                  <div className="text-xs text-gray-500 flex items-center space-x-1.5 pt-1">
                    <span>原文链接: </span>
                    <a
                      href={selectedDetailItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1677ff] hover:underline break-all"
                    >
                      {selectedDetailItem.url}
                    </a>
                  </div>
                )}
              </div>

              {/* Main Content Layout with Left Anchor Navigation & Right Content */}
              <div className="flex gap-6 items-start">
                {/* Left Navigation Anchor List */}
                <div className="w-[130px] flex-shrink-0 sticky top-0 space-y-1 text-xs select-none">
                  {[
                    { id: 'context', name: '错误表述上下文' },
                    { id: 'error', name: '错误内容' },
                    { id: 'screenshot', name: '截图' },
                    { id: 'post', name: '发文内容' },
                    { id: 'log', name: '操作记录' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => scrollToSection(tab.id)}
                      className={`w-full text-left py-2 px-3 rounded transition-colors flex items-center cursor-pointer ${
                        activeAnchor === tab.id
                          ? 'border-l-3 border-[#1677ff] text-[#1677ff] bg-[#f0f7ff] font-medium'
                          : 'text-gray-600 hover:text-[#1677ff] hover:bg-gray-50 border-l-3 border-transparent'
                      }`}
                    >
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </div>

                {/* Right Content Sections */}
                <div className="flex-1 space-y-7 min-w-0">
                  {/* Section 1: 错误表述上下文 (共X项) */}
                  <div ref={contextRef} className="space-y-3">
                    <div className="flex items-center space-x-2 border-l-3 border-[#1677ff] pl-2.5">
                      <h4 className="text-xs font-bold text-gray-800">
                        错误表述上下文 (共{selectedDetailItem.contexts?.length || 1}项)
                      </h4>
                    </div>
                    <div className="space-y-2.5">
                      {selectedDetailItem.contexts && selectedDetailItem.contexts.length > 0 ? (
                        selectedDetailItem.contexts.map((ctx, idx) => (
                          <div key={idx} className="bg-[#fafafa] border border-gray-100 rounded p-3 space-y-1.5">
                            <div className="flex items-center text-[11px] text-gray-500 space-x-1">
                              <i className="fa-regular fa-comment-dots text-gray-400"></i>
                              <span>错误表述上下文</span>
                            </div>
                            <div className="text-xs text-gray-800 leading-relaxed font-normal">
                              {renderHighlightedContext(ctx.text, ctx.errorHighlight)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-[#fafafa] border border-gray-100 rounded p-3 text-xs text-gray-700">
                          {renderHighlightedContext(
                            selectedDetailItem.postContent || selectedDetailItem.title,
                            selectedDetailItem.errors[0]?.wrongText
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 2: 错误内容 */}
                  <div ref={errorRef} className="space-y-3">
                    <div className="flex items-center space-x-2 border-l-3 border-[#1677ff] pl-2.5">
                      <h4 className="text-xs font-bold text-gray-800">错误内容</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedDetailItem.errors.map(err => (
                        <div
                          key={err.id}
                          className="bg-[#fafafa] border border-[#e8e8e8] hover:border-gray-300 transition-colors rounded p-3 space-y-2.5 shadow-2xs"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-700 font-medium">{err.errorType}</span>
                            {err.status === '未修正' ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-normal bg-red-50 text-red-500 border border-red-200">
                                未修正
                              </span>
                            ) : err.status === '已修正' ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-normal bg-green-50 text-green-600 border border-green-200">
                                已修正
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[11px] font-normal bg-gray-50 text-gray-500 border border-gray-200">
                                忽略
                              </span>
                            )}
                          </div>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-start space-x-1.5 text-red-500">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                              <span className="font-medium text-red-600 break-all">{err.wrongText}</span>
                            </div>
                            <div className="flex items-start space-x-1.5 text-green-600">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></span>
                              <span className="text-green-700 break-all">{err.correctText}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: 截图 */}
                  <div ref={screenshotRef} className="space-y-3">
                    <div className="flex items-center space-x-2 border-l-3 border-[#1677ff] pl-2.5">
                      <h4 className="text-xs font-bold text-gray-800">截图</h4>
                    </div>
                    <div className="bg-black/90 rounded-md overflow-hidden p-2 flex items-center justify-center max-w-[420px] shadow-sm border border-gray-200">
                      <img
                        src={selectedDetailItem.screenshotUrl}
                        alt="错误发生截图"
                        className="max-h-[220px] object-contain rounded"
                      />
                    </div>
                  </div>

                  {/* Section 4: 发文内容 */}
                  <div ref={postRef} className="space-y-3">
                    <div className="flex items-center space-x-2 border-l-3 border-[#1677ff] pl-2.5">
                      <h4 className="text-xs font-bold text-gray-800">发文内容</h4>
                    </div>
                    <div className="bg-[#fafafa] border border-gray-100 rounded p-3.5 text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedDetailItem.postContent || selectedDetailItem.title}
                    </div>
                  </div>

                  {/* Section 5: 操作记录 */}
                  <div ref={logRef} className="space-y-3">
                    <div className="flex items-center space-x-2 border-l-3 border-[#1677ff] pl-2.5">
                      <h4 className="text-xs font-bold text-gray-800">操作记录</h4>
                    </div>
                    <div className="space-y-3 pl-2 border-l-2 border-blue-200 ml-1.5">
                      {selectedDetailItem.operationLogs && selectedDetailItem.operationLogs.length > 0 ? (
                        selectedDetailItem.operationLogs.map((log, idx) => (
                          <div key={idx} className="relative pl-4 space-y-1">
                            {/* Dot */}
                            <span className="absolute -left-[11px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white"></span>
                            <div className="flex items-center space-x-3 text-xs">
                              <span className="font-semibold text-gray-800">{log.action}</span>
                              <span className="text-gray-400 font-mono text-[11px]">{log.time}</span>
                            </div>
                            {log.detail && (
                              <div className="text-xs text-gray-600 bg-gray-50 border border-gray-100 p-2 rounded mt-1">
                                {log.detail}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-gray-400">暂无操作记录</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification after Export */}
      {showExportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1677ff] text-white px-4 py-3 rounded shadow-xl flex items-center space-x-3 text-xs animate-in slide-in-from-bottom-2 duration-200">
          <i className="fa-solid fa-circle-check text-base"></i>
          <span>{showExportToast.msg}</span>
          <a
            href="#/download_center"
            className="underline font-bold hover:text-blue-100 ml-2"
          >
            前往下载中心
          </a>
          <button
            onClick={() => setShowExportToast(null)}
            className="text-white/80 hover:text-white ml-2 text-sm leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Export Configuration Modal */}
      <ExportConfigModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        totalCount={exportMode === 'selected' ? selectedIds.length : filteredData.length}
        exportMode={exportMode}
        ledgerTypeName="错误表述数据"
        fields={ERROR_DATA_EXPORT_FIELDS}
        onConfirmExport={handleConfirmExport}
      />
    </div>
  );
};
