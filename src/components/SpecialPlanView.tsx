import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { SpecialPlanCreateView } from './SpecialPlanCreateView';
import { Tab1ActionLedgersView } from './Tab1ActionLedgersView';
import { Tab3BlacklistView } from './Tab3BlacklistView';
import { initialMockLedgers, LedgerItem } from '../mockLedgerData';

export interface KeywordTierGroup {
  id: string;
  mainKeywords: string[];
  subKeywords: string[];
  tertiaryKeywords: string[];
}

export const DEFAULT_TIER_GROUPS: KeywordTierGroup[] = [
  {
    id: 'group-1',
    mainKeywords: ['主关键词', '关键词', '关键词'],
    subKeywords: [
      '副关键词',
      '关键词',
      '关键词',
      '关键词',
      '关键词',
      '关键词',
      '关键词',
      '关键词',
      '关键词',
      '关键词',
      '关键词',
      '关键词',
      '关键词',
    ],
    tertiaryKeywords: ['主关键词', '关键词', '关键词'],
  },
  {
    id: 'group-2',
    mainKeywords: ['主关键词', '关键词', '关键词'],
    subKeywords: [
      '副关键词',
      '关键词',
      '关键词',
      '关键词',
      '关键词',
      '关键词',
      '关键词',
      '关键词',
      '关键词',
      '关键词',
      '关键词',
      '关键词',
      '关键词',
    ],
    tertiaryKeywords: ['主关键词', '关键词', '关键词'],
  },
];

interface KeywordTagInputRowProps {
  label: '主' | '副' | '次';
  tags: string[];
  onChange: (tags: string[]) => void;
  onCopy: () => void;
  onClear: () => void;
}

const KeywordTagInputRow: React.FC<KeywordTagInputRowProps> = ({
  label,
  tags,
  onChange,
  onCopy,
  onClear,
}) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const tokens = trimmed
      .split(/[,;，；\n]+/)
      .map(t => t.trim())
      .filter(Boolean);
    if (tokens.length > 0) {
      onChange([...tags, ...tokens]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Enter' ||
      e.key === ',' ||
      e.key === ';' ||
      e.key === '，' ||
      e.key === '；'
    ) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    if (pasteData) {
      addTag(pasteData);
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex items-center space-x-2.5">
      {/* Label (主 / 副 / 次) */}
      <span className="w-5 text-center text-xs font-medium text-gray-600 select-none shrink-0">
        {label}
      </span>

      {/* Tags Box */}
      <div className="flex-1 flex flex-wrap items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 rounded bg-white min-h-[36px] focus-within:border-[#1677ff] transition-colors">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-[#f2f3f5] text-gray-700 text-xs border border-gray-200/70 hover:bg-[#e4e6eb] transition-colors"
          >
            <span className="truncate max-w-[120px]">{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="text-gray-400 hover:text-gray-700 cursor-pointer ml-0.5"
            >
              <i className="fa-solid fa-xmark text-[10px]"></i>
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onPaste={handlePaste}
          placeholder={tags.length === 0 ? '输入关键词，逗号/回车添加' : ''}
          className="flex-1 min-w-[70px] text-xs text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
        />
      </div>

      {/* Row Action Buttons */}
      <div className="flex items-center space-x-1.5 shrink-0">
        <button
          type="button"
          onClick={onCopy}
          title={`复制${label}关键词`}
          className="text-[#1677ff] hover:text-blue-700 p-1 cursor-pointer rounded hover:bg-blue-50 transition"
        >
          <i className="fa-regular fa-clone text-xs"></i>
        </button>
        <button
          type="button"
          onClick={onClear}
          title={`清空${label}关键词`}
          className="text-red-400 hover:text-red-600 p-1 cursor-pointer rounded hover:bg-red-50 transition"
        >
          <i className="fa-regular fa-circle-xmark text-xs"></i>
        </button>
      </div>
    </div>
  );
};

export interface TargetLedgerAccount {
  id: string;
  name: string;
  type: '网站' | '微信公众号' | '微博' | '今日头条' | '抖音' | '自媒体';
  accountNo?: string;
  institution?: string;
  region?: string;
  category?: '党政机关' | '事业单位' | '新闻媒体' | '自媒体矩阵';
  url?: string;
  isCustom?: boolean;
}

export const MOCK_TARGET_LEDGER_ACCOUNTS: TargetLedgerAccount[] = [
  // 省级党政与网信核心
  { id: 'acc-1', name: '陕西省人民政府门户网站', type: '网站', institution: '陕西省人民政府', region: '省直属', category: '党政机关', url: 'www.shaanxi.gov.cn' },
  { id: 'acc-2', name: '陕西网信网', type: '网站', institution: '中共陕西省委网信办', region: '省直属', category: '党政机关', url: 'www.sxgov.cn' },
  { id: 'acc-3', name: '陕西发布', type: '微信公众号', accountNo: 'shaanxifabu', institution: '陕西省人民政府新闻办公室', region: '省直属', category: '党政机关' },
  { id: 'acc-4', name: '网信陕西', type: '微信公众号', accountNo: 'wangxinshaanxi', institution: '中共陕西省委网信办', region: '省直属', category: '党政机关' },
  { id: 'acc-5', name: '陕西政务微博', type: '微博', accountNo: '@陕西政务', institution: '陕西省委办公厅', region: '省直属', category: '党政机关' },
  { id: 'acc-6', name: '网信陕西官方微博', type: '微博', accountNo: '@网信陕西', institution: '中共陕西省委网信办', region: '省直属', category: '党政机关' },
  { id: 'acc-7', name: '陕西头条政务号', type: '今日头条', accountNo: '陕西头条TT', institution: '陕西广电融媒体集团', region: '省直属', category: '新闻媒体' },
  { id: 'acc-8', name: '三秦政能量（抖音）', type: '抖音', accountNo: 'SQ_DY_8899', institution: '中共陕西省委网信办融媒中心', region: '省直属', category: '党政机关' },
  
  // 省级厅局单位
  { id: 'acc-9', name: '陕西省发展和改革委员会官网', type: '网站', institution: '陕西省发改委', region: '省直属', category: '党政机关', url: 'sndrc.shaanxi.gov.cn' },
  { id: 'acc-10', name: '陕西发改发布', type: '微信公众号', accountNo: 'shaanxifagai', institution: '陕西省发改委', region: '省直属', category: '党政机关' },
  { id: 'acc-11', name: '陕西公安网', type: '网站', institution: '陕西省公安厅', region: '省直属', category: '党政机关', url: 'gat.shaanxi.gov.cn' },
  { id: 'acc-12', name: '陕西公安（微信）', type: '微信公众号', accountNo: 'shaanxigongan', institution: '陕西省公安厅', region: '省直属', category: '党政机关' },
  { id: 'acc-13', name: '陕西公安官方微博', type: '微博', accountNo: '@陕西公安', institution: '陕西省公安厅', region: '省直属', category: '党政机关' },
  { id: 'acc-14', name: '陕西教育网', type: '网站', institution: '陕西省教育厅', region: '省直属', category: '党政机关', url: 'jyt.shaanxi.gov.cn' },
  { id: 'acc-15', name: '陕西省教育厅微信公众号', type: '微信公众号', accountNo: 'shaanxijy', institution: '陕西省教育厅', region: '省直属', category: '党政机关' },
  { id: 'acc-16', name: '陕西省卫生健康委员会官网', type: '网站', institution: '陕西省卫健委', region: '省直属', category: '党政机关', url: 'sxwjw.shaanxi.gov.cn' },
  { id: 'acc-17', name: '陕西健康发布', type: '微信公众号', accountNo: 'sxjkfb', institution: '陕西省卫健委', region: '省直属', category: '党政机关' },
  { id: 'acc-18', name: '陕西应急管理网', type: '网站', institution: '陕西省应急管理厅', region: '省直属', category: '党政机关', url: 'yjt.shaanxi.gov.cn' },
  { id: 'acc-19', name: '陕西应急管理官微', type: '微博', accountNo: '@陕西应急管理', institution: '陕西省应急管理厅', region: '省直属', category: '党政机关' },
  { id: 'acc-20', name: '陕西文旅厅门户', type: '网站', institution: '陕西省文旅厅', region: '省直属', category: '党政机关', url: 'wlt.shaanxi.gov.cn' },

  // 西安市矩阵
  { id: 'acc-21', name: '西安市人民政府门户网站', type: '网站', institution: '西安市人民政府', region: '西安市', category: '党政机关', url: 'www.xa.gov.cn' },
  { id: 'acc-22', name: '西安发布', type: '微信公众号', accountNo: 'xianfabu', institution: '中共西安市委宣传部', region: '西安市', category: '党政机关' },
  { id: 'acc-23', name: '西安发布官方微博', type: '微博', accountNo: '@西安发布', institution: '中共西安市委宣传部', region: '西安市', category: '党政机关' },
  { id: 'acc-24', name: '网信西安微信公众号', type: '微信公众号', accountNo: 'wangxinxian', institution: '中共西安市委网信办', region: '西安市', category: '党政机关' },
  { id: 'acc-25', name: '西安市网信微博', type: '微博', accountNo: '@网信西安', institution: '中共西安市委网信办', region: '西安市', category: '党政机关' },
  { id: 'acc-26', name: '西安交警微发布', type: '微信公众号', accountNo: 'xianjiaojing', institution: '西安市公安局交警支队', region: '西安市', category: '党政机关' },
  { id: 'acc-27', name: '原点新闻（西安发布抖音）', type: '抖音', accountNo: 'xian_news_001', institution: '西安发布新媒体中心', region: '西安市', category: '新闻媒体' },

  // 宝鸡、咸阳、渭南、延安、榆林等市级矩阵
  { id: 'acc-28', name: '宝鸡市人民政府网', type: '网站', institution: '宝鸡市人民政府', region: '宝鸡市', category: '党政机关', url: 'www.baoji.gov.cn' },
  { id: 'acc-29', name: '网信宝鸡', type: '微信公众号', accountNo: 'wangxinbaoji', institution: '中共宝鸡市委网信办', region: '宝鸡市', category: '党政机关' },
  { id: 'acc-30', name: '宝鸡发布官方微博', type: '微博', accountNo: '@宝鸡发布', institution: '中共宝鸡市委宣传部', region: '宝鸡市', category: '党政机关' },
  { id: 'acc-31', name: '咸阳市人民政府网', type: '网站', institution: '咸阳市人民政府', region: '咸阳市', category: '党政机关', url: 'www.xianyang.gov.cn' },
  { id: 'acc-32', name: '网信咸阳', type: '微信公众号', accountNo: 'wangxinxianyang', institution: '中共咸阳市委网信办', region: '咸阳市', category: '党政机关' },
  { id: 'acc-33', name: '咸阳发布微博', type: '微博', accountNo: '@咸阳发布', institution: '中共咸阳市委宣传部', region: '咸阳市', category: '党政机关' },
  { id: 'acc-34', name: '渭南市人民政府网', type: '网站', institution: '渭南市人民政府', region: '渭南市', category: '党政机关', url: 'www.weinan.gov.cn' },
  { id: 'acc-35', name: '网信渭南', type: '微信公众号', accountNo: 'wangxinweinan', institution: '中共渭南市委网信办', region: '渭南市', category: '党政机关' },
  { id: 'acc-36', name: '延安市人民政府门户', type: '网站', institution: '延安市人民政府', region: '延安市', category: '党政机关', url: 'www.yanan.gov.cn' },
  { id: 'acc-37', name: '圣地网信（延安）', type: '微信公众号', accountNo: 'yanan_wangxin', institution: '中共延安市委网信办', region: '延安市', category: '党政机关' },
  { id: 'acc-38', name: '榆林市人民政府网', type: '网站', institution: '榆林市人民政府', region: '榆林市', category: '党政机关', url: 'www.yl.gov.cn' },
  { id: 'acc-39', name: '网信榆林微信', type: '微信公众号', accountNo: 'wangxinyulin', institution: '中共榆林市委网信办', region: '榆林市', category: '党政机关' },
  { id: 'acc-40', name: '汉中发布', type: '微信公众号', accountNo: 'hanzhongfabu', institution: '中共汉中市委宣传部', region: '汉中市', category: '党政机关' },
  { id: 'acc-41', name: '安康发布微讯', type: '微信公众号', accountNo: 'ankangfabu', institution: '中共安康市委网信办', region: '安康市', category: '党政机关' },
  { id: 'acc-42', name: '商洛发布微博', type: '微博', accountNo: '@商洛发布', institution: '中共商洛市委宣传部', region: '商洛市', category: '党政机关' },
  { id: 'acc-43', name: '铜川网事公众号', type: '微信公众号', accountNo: 'tc_wangshi', institution: '中共铜川市委网信办', region: '铜川市', category: '党政机关' },

  // 重点新闻网站与融媒自媒体
  { id: 'acc-44', name: '西部网（陕西新闻网）', type: '网站', institution: '陕西网信协同中心', region: '省直属', category: '新闻媒体', url: 'www.cnwest.com' },
  { id: 'acc-45', name: '西部网官方自媒体', type: '自媒体', accountNo: 'West_China_Net', institution: '陕西网信协同中心', region: '省直属', category: '新闻媒体' },
  { id: 'acc-46', name: '华商网门户', type: '网站', institution: '华商传媒集团', region: '省直属', category: '新闻媒体', url: 'www.hsw.cn' },
  { id: 'acc-47', name: '华商报官方微博', type: '微博', accountNo: '@华商报', institution: '华商传媒集团', region: '省直属', category: '新闻媒体' },
  { id: 'acc-48', name: '三秦都市报官微', type: '微博', accountNo: '@三秦都市报', institution: '陕西日报社', region: '省直属', category: '新闻媒体' },
  { id: 'acc-49', name: '陕视新闻融媒体账号', type: '自媒体', accountNo: 'SX_News_Official', institution: '陕西广播电视台', region: '省直属', category: '新闻媒体' },
  { id: 'acc-50', name: '西安网讯自媒体矩阵', type: '自媒体', accountNo: 'XANetMatrix', institution: '西安市属新媒体联盟', region: '西安市', category: '自媒体矩阵' },
  { id: 'acc-51', name: '秦声锐评自媒体', type: '自媒体', accountNo: 'QinShengMedia_01', institution: '三秦新媒体工作室', region: '省直属', category: '自媒体矩阵' },
  { id: 'acc-52', name: '长安观察自媒体号', type: '自媒体', accountNo: 'ChangAnObserver', institution: '长安网络文化传播中心', region: '西安市', category: '自媒体矩阵' },
];

export interface PlanItem {
  id: number;
  name: string;
  type: '机构行动' | '统一行动';
  institution: string;
  startDate: string;
  inspectType: '快速排查' | '深度排查';
  status: '更新中' | '深度更新中' | '已关闭';
  operator: string;
  operateTime: string;
  dataCount: number;
  isOpen: boolean;
  // Detail config
  platforms: string[];
  subjectTypes: string[];
  scope: '自定义范围' | '全国范围' | '定向范围';
  targetAccounts?: TargetLedgerAccount[];
  keywords: string[][];
  keywordMode?: 'mode1' | 'mode2';
  tierGroups?: KeywordTierGroup[];
  excludeKeywords: string[];
  ignoreKeywords?: string[];
  summary?: string;
  recordsCount?: {
    ledgerTotal: number;
    dataTotal: number;
    availableTotal: number;
    unavailableTotal: number;
    pendingTotal: number;
  };
  planLedgers?: LedgerItem[];
  planBlacklist?: LedgerItem[];
}

export interface JudgmentArticle {
  id: string;
  title: string;
  source: '微信' | '今日头条' | '网站' | '微博' | '抖音';
  author: string;
  keyword: string;
  publishTime: string;
  inTime: string;
  status: 'pending' | 'available' | 'unavailable';
  contentSnippet: string;
}

export const INITIAL_PLANS: PlanItem[] = [
  {
    id: 1,
    name: '社工部排查',
    type: '机构行动',
    institution: '中共陕西省委网络安全和信息化委员会办公室',
    startDate: '2023-01-01',
    inspectType: '快速排查',
    status: '更新中',
    operator: '邓东升',
    operateTime: '2026-08-19 15:54:10',
    dataCount: 333,
    isOpen: true,
    platforms: ['网站', '微博', '微信公众号', '今日头条', '抖音'],
    subjectTypes: ['党政机关', '事业单位'],
    scope: '自定义范围',
    keywords: [['社工部']],
    excludeKeywords: [],
    summary:
      '经过对中共陕西省委网络安全和信息化委员会办公室属地4,201个网站、1,321个抖音、1,233个微信公众号、668个今日头条、533个微博账号进行排查，2023年1月1日至2026年8月19日共抓取到触碰专项关键字信息 334 条，经人工二次排查，截至2026年8月19日17:33，发现相关疑似信息 0 条。',
    recordsCount: {
      ledgerTotal: 7956,
      dataTotal: 334,
      availableTotal: 0,
      unavailableTotal: 0,
      pendingTotal: 50,
    },
  },
  {
    id: 2,
    name: '社工部',
    type: '统一行动',
    institution:
      '中共洛阳市委网络安全和信息化委员会办公室、中共陕西省委网络安全和信息化委员会办公室',
    startDate: '2023-01-01',
    inspectType: '快速排查',
    status: '更新中',
    operator: '马镜清',
    operateTime: '2026-08-17 15:43:47',
    dataCount: 196638,
    isOpen: true,
    platforms: ['网站', '微博', '微信公众号', '今日头条', '抖音'],
    subjectTypes: ['党政机关', '事业单位', '国有企业'],
    scope: '全国范围',
    keywords: [['社工部']],
    excludeKeywords: [],
    summary:
      '经过对中共洛阳市委网络安全和信息化委员会办公室、中共陕西省委网络安全和信息化委员会办公室属地4,701个网站、1,486个抖音、1,337个微信公众号、740个今日头条、602个微博账号进行排查，2023年1月1日至2026年8月19日共抓取到触碰专项关键字信息 196,640 条，经人工二次排查，截至2026年8月19日17:38，发现相关疑似信息 1,493 条。',
    recordsCount: {
      ledgerTotal: 8866,
      dataTotal: 193143,
      availableTotal: 1493,
      unavailableTotal: 2004,
      pendingTotal: 0,
    },
  },
  {
    id: 3,
    name: '婚恋账号排查',
    type: '机构行动',
    institution: '中共洛阳市委网络安全和信息化委员会办公室',
    startDate: '2026-08-01',
    inspectType: '快速排查',
    status: '已关闭',
    operator: '邓东升',
    operateTime: '2026-08-17 16:03:00',
    dataCount: 57,
    isOpen: false,
    platforms: ['微信公众号', '抖音', '微博'],
    subjectTypes: ['企业', '个人', '社会组织'],
    scope: '自定义范围',
    keywords: [['婚恋', '交友']],
    excludeKeywords: [],
  },
  {
    id: 4,
    name: '涉警',
    type: '机构行动',
    institution: '阳泉市公安局',
    startDate: '2026-08-01',
    inspectType: '快速排查',
    status: '已关闭',
    operator: '-',
    operateTime: '2026-08-14 21:31:16',
    dataCount: 3417,
    isOpen: false,
    platforms: ['网站', '今日头条', '抖音'],
    subjectTypes: ['党政机关'],
    scope: '自定义范围',
    keywords: [['涉警', '民警']],
    excludeKeywords: [],
  },
  {
    id: 5,
    name: '公安',
    type: '机构行动',
    institution: '阳泉市公安局',
    startDate: '2026-05-01',
    inspectType: '快速排查',
    status: '已关闭',
    operator: '-',
    operateTime: '2026-08-14 21:31:16',
    dataCount: 534,
    isOpen: false,
    platforms: ['网站', '微博'],
    subjectTypes: ['党政机关'],
    scope: '自定义范围',
    keywords: [['公安', '交警']],
    excludeKeywords: [],
  },
  {
    id: 6,
    name: '阳泉',
    type: '机构行动',
    institution: '阳泉市公安局',
    startDate: '2026-08-01',
    inspectType: '深度排查',
    status: '已关闭',
    operator: '-',
    operateTime: '2026-08-15 09:01:16',
    dataCount: 3167,
    isOpen: false,
    platforms: ['网站', '微信公众号', '今日头条'],
    subjectTypes: ['党政机关', '事业单位'],
    scope: '自定义范围',
    keywords: [['阳泉']],
    excludeKeywords: [],
  },
  {
    id: 7,
    name: '阳泉公安排查',
    type: '机构行动',
    institution: '阳泉市公安局',
    startDate: '2025-08-01',
    inspectType: '快速排查',
    status: '已关闭',
    operator: '-',
    operateTime: '2026-08-14 19:01:16',
    dataCount: 1027,
    isOpen: false,
    platforms: ['网站', '微信公众号'],
    subjectTypes: ['党政机关'],
    scope: '自定义范围',
    keywords: [['阳泉公安']],
    excludeKeywords: [],
  },
  {
    id: 8,
    name: '落马',
    type: '机构行动',
    institution: '中共峡江县委宣传部',
    startDate: '2000-01-01',
    inspectType: '快速排查',
    status: '已关闭',
    operator: '-',
    operateTime: '2026-08-13 17:51:15',
    dataCount: 0,
    isOpen: false,
    platforms: ['网站', '今日头条'],
    subjectTypes: ['党政机关'],
    scope: '全国范围',
    keywords: [['违纪', '落马']],
    excludeKeywords: [],
  },
];

const INITIAL_ARTICLES: JudgmentArticle[] = [
  {
    id: 'art-1',
    title: '心护神木·暖心相伴 | 我院开展青少年法治教育与心理健康疏导志愿服务活动',
    source: '微信',
    author: '神木检察',
    keyword: '社工部',
    publishTime: '2026-08-19 17:30:00',
    inTime: '2026-08-19 17:32:10',
    status: 'pending',
    contentSnippet:
      '青春不可逆，成长需守界。为扎实推进罪错未成年人教育、感化、挽救工作，精准帮扶行为失范青少年回归正途，2026年8月18日，神木市人民检察院联合神木市委政法委、社工部、心理咨询协会，走进神木市第十六中学，开展“心护神木·暖心相伴”青少年心理健康疏导与法治安安全教育志愿服务活动。针对青春期学生情绪冲动、认知偏差、法治意识薄弱、内心敏感叛逆等特点，我院沐芽未检法治宣讲团开展定制化主题法治成长讲座，以案释…',
  },
  {
    id: 'art-2',
    title: '2岁多孩子呕吐弄脏网约车，司机索要500元清洁费，家长只愿赔100元，协商未果尝试离开遭阻拦，平台回应',
    source: '微信',
    author: '陕西交通广播',
    keyword: '社工部',
    publishTime: '2026-08-18 08:32:44',
    inTime: '2026-08-19 15:54:21',
    status: 'pending',
    contentSnippet:
      '…永久下线。” 来源：潇湘晨报、广州日报编辑：浩然 审核：若文终审：赖婷 暑期旅游线路推荐 穿越“最美100公里”，甘南6日深度自驾，仅剩2期 “悦享欧洲” 德法意瑞四国12日深度游,9月开启梦幻之旅！一年仅开放5个月！这条中国最美公路，再不去真的来不及了 要闻回顾：▲电梯开门后看到一堵墙，千万不能出去！▲多地提醒：别再叫“社工部”▲多地景区：新婚夫妻七夕凭结婚证免门票▲突然发烧，各种抗生素无效！',
  },
  {
    id: 'art-3',
    title: '西安将新建一条城市环线！',
    source: '微信',
    author: '陕西交通广播',
    keyword: '社工部',
    publishTime: '2026-08-18 08:32:44',
    inTime: '2026-08-19 15:54:21',
    status: 'pending',
    contentSnippet:
      '…入强劲动力。来源：交控建设、临潼发布编辑：浩然 审核：若文终审：赖婷 暑期旅游线路推荐 穿越“最美100公里”，甘南6日深度自驾，仅剩2期 “悦享欧洲” 德法意瑞四国12日深度游,9月开启梦幻之旅！一年仅开放5个月！这条中国最美公路，再不去真的来不及了 要闻回顾：▲电梯开门后看到一堵墙，千万不能出去！▲多地提醒：别再叫“社工部”▲多地景区：新婚夫妻七夕凭结婚证免门票▲突然发烧，各种抗生素无效！',
  },
  {
    id: 'art-4',
    title: '82岁老人闯入高速公路被撞身亡，6名子女索赔13万，法院判了',
    source: '微信',
    author: '陕西交通广播',
    keyword: '社工部',
    publishTime: '2026-08-18 08:32:44',
    inTime: '2026-08-19 15:54:21',
    status: 'pending',
    contentSnippet:
      '…赔偿责任。来源：南方都市报、江苏灌云法院编辑：浩然 审核：若文终审：赖婷 暑期旅游线路推荐 穿越“最美100公里”，甘南6日深度自驾，仅剩2期 “悦享欧洲” 德法意瑞四国12日深度游,9月开启梦幻之旅！一年仅开放5个月！这条中国最美公路，再不去真的来不及了 要闻回顾：▲电梯开门后看到一堵墙，千万不能出去！▲多地提醒：别再叫“社工部”▲多地景区：新婚夫妻七夕凭结婚证免门票▲突然发烧，各种抗生素无效！',
  },
  {
    id: 'art-5',
    title: '省科协系统学会党组织书记和党务工作者培训班成功举办',
    source: '今日头条',
    author: '辽宁省科学技术协会',
    keyword: '社工部',
    publishTime: '2026-08-19 13:23:45',
    inTime: '2026-08-19 13:31:21',
    status: 'available',
    contentSnippet:
      '8月12日至8月14日，在省科协党组和省委社工部的指导下，省科协科技社团党委在东北大学举办省科协系统学会党组织书记和党务工作者培训班，来自业务主管省级学会党组织书记和党务工作者79人参加培训。省科协党组成员、副主席汪铁伦作开班动员讲话。培训采取“理论教学+现场教学+廉政教育+专题研讨”多种形式相结合的方式，深入学习习近平党建思想，习近平总书记关于树立和践行正确政绩观的重要论述，习近平总书记在辽宁…',
  },
  {
    id: 'art-6',
    title: '好消息！广西200+景区8折购首道门票，来宾美景等你来→',
    source: '微信',
    author: '微观来宾',
    keyword: '社工部',
    publishTime: '2026-08-19 11:35:00',
    inTime: '2026-08-19 11:37:28',
    status: 'unavailable',
    contentSnippet:
      '…楼二楼 本账号如无意中侵犯了互联网公司或个人的知识产权，请通过电子邮箱249974432@qq.com或电话联系0772-4211711告知，本网站将及时删除，或与我方协商，我方愿意按照市场价支付使用期间的授权费。推荐阅读 广西4市发布任前公示，13人拟任正处级职务 较调研基层党建工作注意！来宾这些道路位置新增测速点来宾2地发布人事信息多地提醒：别再叫“社工部”我就知道你「在看」点个赞 再走吧',
  },
  {
    id: 'art-7',
    title: '征集活动倒计时！快来为来宾发展献良策',
    source: '微信',
    author: '微观来宾',
    keyword: '社工部',
    publishTime: '2026-08-19 11:35:00',
    inTime: '2026-08-19 11:37:28',
    status: 'unavailable',
    contentSnippet:
      '…楼二楼 本账号如无意中侵犯了互联网公司或个人的知识产权，请通过电子邮箱249974432@qq.com或电话联系0772-4211711告知，本网站将及时删除，或与我方协商，我方愿意按照市场价支付使用期间的授权费。推荐阅读 广西4市发布任前公示，13人拟任正处级职务 较调研基层党建工作注意！来宾这些道路位置新增测速点来宾2地发布人事信息多地提醒：别再叫“社工部”我就知道你「在看」点个赞 再走吧',
  },
];

const PLATFORM_PIE_DATA = [
  { name: '微信公众号', value: 115, percentage: '34.43%', color: '#00b96b' },
  { name: '今日头条', value: 111, percentage: '33.24%', color: '#ff7a45' },
  { name: '网站', value: 61, percentage: '18.26%', color: '#1677ff' },
  { name: '微博', value: 31, percentage: '9.28%', color: '#faad14' },
  { name: '抖音', value: 16, percentage: '4.79%', color: '#85a5ff' },
];

const SPLINE_CHART_DATA = [
  { date: '2026-08-13', weibo: 1, weixin: 0, toutiao: 0 },
  { date: '2026-08-14', weibo: 0, weixin: 0, toutiao: 0 },
  { date: '2026-08-15', weibo: 0, weixin: 1, toutiao: 0 },
  { date: '2026-08-16', weibo: 1, weixin: 0, toutiao: 0 },
  { date: '2026-08-17', weibo: 2, weixin: 0, toutiao: 0 },
  { date: '2026-08-18', weibo: 0, weixin: 4, toutiao: 0 },
  { date: '2026-08-19', weibo: 0, weixin: 1, toutiao: 0 },
];

const ALL_PLATFORMS = ['全部', '网站', '微博', '微信公众号', '今日头条', '抖音'];
const ALL_SUBJECTS = [
  '全部',
  '机构编制',
  '外交',
  '司法行政',
  '旅游',
  '民政',
  '宗教',
  '工会',
  '工商',
  '中央军委改革和编制办公室',
  '住房城乡建设',
  '农业',
  '侨联',
  '贸易促进',
  '文化',
  '无类型',
];

interface SpecialPlanViewProps {
  onBackToInstitution?: () => void;
  onNavigateToInstitution?: () => void;
}

export const SpecialPlanView: React.FC<SpecialPlanViewProps> = ({
  onBackToInstitution,
  onNavigateToInstitution,
}) => {
  // Plan List State
  const [plans, setPlans] = useState<PlanItem[]>(INITIAL_PLANS);

  // Filters for Main List (Image 1)
  const [nameFilter, setNameFilter] = useState('');
  const [instFilter, setInstFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [inspectTypeFilter, setInspectTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Page Routing & Subview State
  // 'list' | 'select_type_modal' | 'create_form' | 'detail'
  const [currentSubView, setCurrentSubView] = useState<'list' | 'create_form' | 'detail'>('list');
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);
  const [isSelectTypeModalOpen, setIsSelectTypeModalOpen] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<'机构行动' | '统一行动'>('机构行动');

  // Active Detail Plan
  const [activePlan, setActivePlan] = useState<PlanItem | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'judgment' | 'ledgers' | 'blacklist'>('overview');
  const [selectedDetailInstitution, setSelectedDetailInstitution] = useState<string>('中共洛阳市委网络安全和信息化委员会办公室');

  // Action Ledgers & Blacklist for Active Detail Plan
  const [activePlanLedgers, setActivePlanLedgers] = useState<LedgerItem[]>([]);
  const [activePlanBlacklist, setActivePlanBlacklist] = useState<LedgerItem[]>([]);
  const [selectedLedgerIds, setSelectedLedgerIds] = useState<number[]>([]);
  const [selectedBlacklistIds, setSelectedBlacklistIds] = useState<number[]>([]);

  // Handlers for Plan Ledgers & Blacklist in Detail View
  const handleMoveLedgersToBlacklist = (ids: number[]) => {
    const idsSet = new Set(ids);
    const itemsToMove = activePlanLedgers.filter(item => idsSet.has(item.id));
    const remaining = activePlanLedgers.filter(item => !idsSet.has(item.id));

    const newBlacklistEntries = itemsToMove.map(item => ({
      ...item,
      blacklistReason: '在专项行动详情中手动移入行动黑名单',
    }));

    setActivePlanLedgers(remaining);
    setActivePlanBlacklist(prev => [...prev, ...newBlacklistEntries]);
    setSelectedLedgerIds(prev => prev.filter(id => !idsSet.has(id)));

    // Update plan in main state
    if (activePlan) {
      setPlans(prevPlans =>
        prevPlans.map(p =>
          p.id === activePlan.id
            ? {
                ...p,
                planLedgers: remaining,
                planBlacklist: [...(p.planBlacklist || activePlanBlacklist), ...newBlacklistEntries],
              }
            : p
        )
      );
    }
    showToast(`已成功将 ${itemsToMove.length} 条台账加入【黑名单】`);
  };

  const handleRemoveLedgers = (ids: number[]) => {
    const idsSet = new Set(ids);
    const remaining = activePlanLedgers.filter(item => !idsSet.has(item.id));
    setActivePlanLedgers(remaining);
    setSelectedLedgerIds(prev => prev.filter(id => !idsSet.has(id)));

    if (activePlan) {
      setPlans(prevPlans =>
        prevPlans.map(p =>
          p.id === activePlan.id
            ? { ...p, planLedgers: remaining }
            : p
        )
      );
    }
    showToast(`已从【本专项行动台账】中移除 ${ids.length} 条数据`);
  };

  const handleRestoreBlacklistToLedgers = (ids: number[]) => {
    const idsSet = new Set(ids);
    const itemsToRestore = activePlanBlacklist.filter(item => idsSet.has(item.id));
    const remainingBlacklist = activePlanBlacklist.filter(item => !idsSet.has(item.id));

    const restoredItems = itemsToRestore.map(item => ({
      ...item,
      blacklistReason: undefined,
    }));

    setActivePlanBlacklist(remainingBlacklist);
    setActivePlanLedgers(prev => [...prev, ...restoredItems]);
    setSelectedBlacklistIds(prev => prev.filter(id => !idsSet.has(id)));

    if (activePlan) {
      setPlans(prevPlans =>
        prevPlans.map(p =>
          p.id === activePlan.id
            ? {
                ...p,
                planBlacklist: remainingBlacklist,
                planLedgers: [...(p.planLedgers || activePlanLedgers), ...restoredItems],
              }
            : p
        )
      );
    }
    showToast(`已成功将 ${itemsToRestore.length} 条黑名单还原至【本专项行动台账】`);
  };

  const handleDeleteBlacklist = (ids: number[]) => {
    const idsSet = new Set(ids);
    const remainingBlacklist = activePlanBlacklist.filter(item => !idsSet.has(item.id));
    setActivePlanBlacklist(remainingBlacklist);
    setSelectedBlacklistIds(prev => prev.filter(id => !idsSet.has(id)));

    if (activePlan) {
      setPlans(prevPlans =>
        prevPlans.map(p =>
          p.id === activePlan.id
            ? { ...p, planBlacklist: remainingBlacklist }
            : p
        )
      );
    }
    showToast(`已从【黑名单】中删除 ${ids.length} 条记录`);
  };

  // Multi-institution selection for formInsts
  const [formInsts, setFormInsts] = useState<string[]>([
    '中共洛阳市委网络安全和信息化委员会办公室',
    '中共陕西省委网络安全和信息化委员会办公室',
  ]);

  // Institution List for Active Plan
  const institutionList = useMemo(() => {
    if (!activePlan) return [];
    const parsed = activePlan.institution
      ? activePlan.institution.split(/、|,|;/).map((s) => s.trim()).filter(Boolean)
      : [];
    if (parsed.length > 1) {
      return parsed;
    }
    return Array.from(
      new Set([
        ...parsed,
        '中共洛阳市委网络安全和信息化委员会办公室',
        '中共陕西省委网络安全和信息化委员会办公室',
        '阳泉市公安局',
        '中共峡江县委宣传部',
      ])
    );
  }, [activePlan]);

  // Dynamic Metric Counts based on selected detail institution
  const activeMetricCounts = useMemo(() => {
    if (!activePlan) {
      return { ledgerTotal: 8866, dataTotal: 193143, availableTotal: 1493, unavailableTotal: 2004 };
    }
    const base = activePlan.recordsCount || {
      ledgerTotal: 8866,
      dataTotal: 193143,
      availableTotal: 1493,
      unavailableTotal: 2004,
      pendingTotal: 0,
    };

    if (!selectedDetailInstitution || selectedDetailInstitution === '全部关联机构') {
      return base;
    }

    if (selectedDetailInstitution.includes('洛阳')) {
      return {
        ledgerTotal: 4165,
        dataTotal: 98320,
        availableTotal: 750,
        unavailableTotal: 1012,
      };
    } else if (selectedDetailInstitution.includes('陕西')) {
      return {
        ledgerTotal: 4701,
        dataTotal: 94823,
        availableTotal: 743,
        unavailableTotal: 992,
      };
    } else if (selectedDetailInstitution.includes('阳泉')) {
      return {
        ledgerTotal: 3280,
        dataTotal: 65400,
        availableTotal: 480,
        unavailableTotal: 620,
      };
    } else {
      return {
        ledgerTotal: 2950,
        dataTotal: 58200,
        availableTotal: 410,
        unavailableTotal: 510,
      };
    }
  }, [activePlan, selectedDetailInstitution]);

  // Dynamic Summary based on selected detail institution
  const activeSummary = useMemo(() => {
    if (!activePlan) return '';
    const instName = selectedDetailInstitution || activePlan.institution || '关联机构';
    return `经过对 ${instName} 属地网站、抖音、微信公众号、今日头条、微博账号进行专项排查，自 ${activePlan.startDate} 起共抓取触碰关键字信息 ${activeMetricCounts.dataTotal.toLocaleString()} 条，经人工二次排查，发现相关疑似信息 ${activeMetricCounts.availableTotal.toLocaleString()} 条。`;
  }, [activePlan, selectedDetailInstitution, activeMetricCounts]);

  // Detail Tab 2: Articles List State
  const [articles, setArticles] = useState<JudgmentArticle[]>(INITIAL_ARTICLES);
  const [activeJudgmentMetric, setActiveJudgmentMetric] = useState<
    'pool' | 'pending' | 'available' | 'unavailable' | 'all'
  >('pending');
  const [articleKeywordFilter, setArticleKeywordFilter] = useState('');
  const [articleExcludeFilter, setArticleExcludeFilter] = useState('');
  const [articlePlatformFilter, setArticlePlatformFilter] = useState('');
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);

  // Create Form State (Image 3 & 4)
  const [formInst, setFormInst] = useState('中共陕西省委网络安全和信息化委员会办公室');
  const [formName, setFormName] = useState('');
  const [formPlatforms, setFormPlatforms] = useState<string[]>(['全部']);
  const [formSubjects, setFormSubjects] = useState<string[]>(['全部']);
  const [formScope, setFormScope] = useState<'自定义范围' | '全国范围' | '定向范围'>('自定义范围');
  const [formMatchInstLedger, setFormMatchInstLedger] = useState(true);
  const [formMatchRegion, setFormMatchRegion] = useState('');
  const [formSelectedAccounts, setFormSelectedAccounts] = useState<TargetLedgerAccount[]>([
    MOCK_TARGET_LEDGER_ACCOUNTS[0],
    MOCK_TARGET_LEDGER_ACCOUNTS[2],
  ]);
  const [inlineSearchQuery, setInlineSearchQuery] = useState('');

  // Modal & Batch Selection States
  const [isAccountSelectModalOpen, setIsAccountSelectModalOpen] = useState(false);
  const [accountModalTab, setAccountModalTab] = useState<'catalog' | 'batch_paste' | 'preset_packs' | 'selected_manage'>('catalog');
  const [modalAccountSearch, setModalAccountSearch] = useState('');
  const [modalPlatformFilter, setModalPlatformFilter] = useState('全部');
  const [modalRegionFilter, setModalRegionFilter] = useState('全部');
  const [modalCategoryFilter, setModalCategoryFilter] = useState('全部');
  const [tempSelectedAccountIds, setTempSelectedAccountIds] = useState<string[]>([]);
  const [batchPasteText, setBatchPasteText] = useState('');
  const [parsedPasteResults, setParsedPasteResults] = useState<TargetLedgerAccount[]>([]);

  // Selected Accounts Management Drawer / Modal State
  const [isSelectedAccountsDrawerOpen, setIsSelectedAccountsDrawerOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState('');
  const [drawerPlatformFilter, setDrawerPlatformFilter] = useState('全部');
  const [drawerSelectedIds, setDrawerSelectedIds] = useState<string[]>([]);

  const [formInspectType, setFormInspectType] = useState<'快速排查' | '深度排查'>('快速排查');
  const [formStartDate, setFormStartDate] = useState('2023-01-01');
  const [formKeywordMode, setFormKeywordMode] = useState<'mode1' | 'mode2'>('mode1');
  const [formTierGroups, setFormTierGroups] = useState<KeywordTierGroup[]>(DEFAULT_TIER_GROUPS);
  const [formKeywordGroups, setFormKeywordGroups] = useState<string[]>(['']);
  const [formExcludeKeyword, setFormExcludeKeyword] = useState('');
  const [activePreviewGroupIndex, setActivePreviewGroupIndex] = useState<number | null>(0);

  // Toast State
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Helper for copying text with feedback
  const handleCopyText = (text: string) => {
    if (!text) {
      showToast('内容为空');
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('已复制到剪贴板');
    } else {
      showToast('已复制');
    }
  };

  // Tier group operations
  const handleAddTierGroup = () => {
    const newIdx = formTierGroups.length + 1;
    const newGroup: KeywordTierGroup = {
      id: `group-${Date.now()}`,
      mainKeywords: ['主关键词', '关键词', '关键词'],
      subKeywords: ['副关键词', '关键词', '关键词'],
      tertiaryKeywords: ['主关键词', '关键词'],
    };
    setFormTierGroups(prev => [...prev, newGroup]);
    showToast(`已添加【词组${newIdx}】`);
  };

  const handleDeleteTierGroup = (index: number) => {
    if (formTierGroups.length <= 1) {
      showToast('至少保留一组关键词');
      return;
    }
    setFormTierGroups(prev => prev.filter((_, i) => i !== index));
    if (activePreviewGroupIndex === index) {
      setActivePreviewGroupIndex(0);
    } else if (activePreviewGroupIndex !== null && activePreviewGroupIndex > index) {
      setActivePreviewGroupIndex(activePreviewGroupIndex - 1);
    }
    showToast(`已删除【词组${index + 1}】`);
  };

  const handleUpdateTierKeywords = (
    groupIndex: number,
    tier: 'mainKeywords' | 'subKeywords' | 'tertiaryKeywords',
    tags: string[]
  ) => {
    setFormTierGroups(prev => {
      const next = [...prev];
      next[groupIndex] = {
        ...next[groupIndex],
        [tier]: tags,
      };
      return next;
    });
  };

  const handleCopyTags = (tags: string[], tierName: string) => {
    if (tags.length === 0) {
      showToast(`${tierName}暂无内容`);
      return;
    }
    handleCopyText(tags.join('，'));
  };

  const handlePreviewTierGroup = (index: number) => {
    setActivePreviewGroupIndex(index);
    showToast(`正在右侧预览【词组${index + 1}】排查效果`);
  };

  // Filtered Plans List
  const filteredPlans = useMemo(() => {
    return plans.filter(p => {
      if (nameFilter && !p.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
      if (instFilter && !p.institution.toLowerCase().includes(instFilter.toLowerCase())) return false;
      if (typeFilter && p.type !== typeFilter) return false;
      if (inspectTypeFilter && p.inspectType !== inspectTypeFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (operatorFilter && !p.operator.includes(operatorFilter)) return false;
      if (startDateFilter && p.startDate < startDateFilter) return false;
      if (endDateFilter && p.startDate > endDateFilter) return false;
      return true;
    });
  }, [
    plans,
    nameFilter,
    instFilter,
    typeFilter,
    inspectTypeFilter,
    statusFilter,
    operatorFilter,
    startDateFilter,
    endDateFilter,
  ]);

  const handleResetMainFilters = () => {
    setNameFilter('');
    setInstFilter('');
    setTypeFilter('');
    setInspectTypeFilter('');
    setStatusFilter('');
    setOperatorFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  // Toggle Switch for Plan
  const handleToggleSwitch = (id: number) => {
    setPlans(prev =>
      prev.map(p => {
        if (p.id === id) {
          const next = !p.isOpen;
          showToast(`已${next ? '开启' : '关闭'}行动方案【${p.name}】`);
          return { ...p, isOpen: next, status: next ? '更新中' : '已关闭' };
        }
        return p;
      })
    );
  };

  // Delete Plan
  const handleDeletePlan = (id: number) => {
    if (window.confirm('确认删除该专项行动方案吗？')) {
      setPlans(prev => prev.filter(p => p.id !== id));
      showToast('方案已成功删除');
    }
  };

  // Start Creation Flow (Directly Open 3-Step Wizard)
  const handleOpenCreateModal = () => {
    setEditingPlan(null);
    setCurrentSubView('create_form');
  };

  // Step 2 -> Navigate to Form
  const handleConfirmSelectType = () => {
    setIsSelectTypeModalOpen(false);
    setFormName('');
    setFormPlatforms(['全部']);
    setFormSubjects(['全部']);
    setFormScope('自定义范围');
    setFormMatchInstLedger(true);
    setFormMatchRegion('');
    setFormSelectedAccounts([
      MOCK_TARGET_LEDGER_ACCOUNTS[0],
      MOCK_TARGET_LEDGER_ACCOUNTS[2],
    ]);
    setFormInspectType('快速排查');
    setFormStartDate('2023-01-01');
    setFormKeywordMode('mode1');
    setFormTierGroups(JSON.parse(JSON.stringify(DEFAULT_TIER_GROUPS)));
    setFormKeywordGroups(['']);
    setFormExcludeKeyword('');
    setActivePreviewGroupIndex(0);
    setCurrentSubView('create_form');
  };

  // Form: Toggle Platform tag
  const handleTogglePlatform = (p: string) => {
    if (p === '全部') {
      setFormPlatforms(['全部']);
    } else {
      const withoutAll = formPlatforms.filter(x => x !== '全部');
      if (withoutAll.includes(p)) {
        const next = withoutAll.filter(x => x !== p);
        setFormPlatforms(next.length === 0 ? ['全部'] : next);
      } else {
        setFormPlatforms([...withoutAll, p]);
      }
    }
  };

  // Form: Toggle Subject tag
  const handleToggleSubject = (s: string) => {
    if (s === '全部') {
      setFormSubjects(['全部']);
    } else {
      const withoutAll = formSubjects.filter(x => x !== '全部');
      if (withoutAll.includes(s)) {
        const next = withoutAll.filter(x => x !== s);
        setFormSubjects(next.length === 0 ? ['全部'] : next);
      } else {
        setFormSubjects([...withoutAll, s]);
      }
    }
  };

  // Submit Create Plan Form
  const handleSaveNewPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('请输入行动名称');
      return;
    }

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    
    let formattedKeywords: string[][] = [];
    if (formKeywordMode === 'mode1') {
      formattedKeywords = formTierGroups.map(g => [
        ...g.mainKeywords,
        ...g.subKeywords,
        ...g.tertiaryKeywords,
      ].filter(Boolean));
    } else {
      formattedKeywords = formKeywordGroups.map(g => g.split(/[,;；，]\s*/).filter(Boolean));
    }

    const finalInstStr = selectedPlanType === '统一行动' ? formInsts.join('、') : formInst;

    const newPlan: PlanItem = {
      id: Date.now(),
      name: formName,
      type: selectedPlanType,
      institution: finalInstStr,
      startDate: formStartDate,
      inspectType: formInspectType,
      status: '更新中',
      operator: '邓东升',
      operateTime: nowStr,
      dataCount: 0,
      isOpen: true,
      platforms: formPlatforms.includes('全部') ? ['网站', '微博', '微信公众号', '今日头条', '抖音'] : formPlatforms,
      subjectTypes: formSubjects.includes('全部') ? ['党政机关', '事业单位'] : formSubjects,
      scope: formScope,
      targetAccounts: formScope === '定向范围' ? formSelectedAccounts : undefined,
      keywords: formattedKeywords.length > 0 ? formattedKeywords : [['专项']],
      keywordMode: formKeywordMode,
      tierGroups: formKeywordMode === 'mode1' ? formTierGroups : undefined,
      excludeKeywords: formExcludeKeyword ? formExcludeKeyword.split(/[,;；，\n\s]+/).filter(Boolean) : [],
      summary: `经过对${finalInstStr}属地相关平台账号进行排查，自${formStartDate}起启动专项排查行动。`,
      recordsCount: {
        ledgerTotal: 4200,
        dataTotal: 0,
        availableTotal: 0,
        unavailableTotal: 0,
        pendingTotal: 0,
      },
    };

    setPlans([newPlan, ...plans]);
    setCurrentSubView('list');
    showToast(`成功创建并启动专项行动方案【${formName}】`);
  };

  // Open Detail View
  const handleOpenDetail = (plan: PlanItem) => {
    setActivePlan(plan);
    setDetailTab('overview');
    setActiveJudgmentMetric('pending');

    // Initialize Plan Ledgers & Blacklist
    const initialLedgers = plan.planLedgers || initialMockLedgers;
    const initialBList = plan.planBlacklist || initialMockLedgers.slice(0, 3).map(item => ({
      ...item,
      blacklistReason: '从台账范围移入行动黑名单',
    }));

    setActivePlanLedgers(initialLedgers);
    setActivePlanBlacklist(initialBList);
    setSelectedLedgerIds([]);
    setSelectedBlacklistIds([]);

    const parsed = plan.institution
      ? plan.institution.split(/、|,|;/).map((s) => s.trim()).filter(Boolean)
      : [];
    const defaultInst = parsed[0] || '中共洛阳市委网络安全和信息化委员会办公室';
    setSelectedDetailInstitution(defaultInst);
    setCurrentSubView('detail');
  };

  // Filtered Articles in Detail Tab 2
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      // Metric filter
      if (activeJudgmentMetric === 'pending' && art.status !== 'pending') return false;
      if (activeJudgmentMetric === 'available' && art.status !== 'available') return false;
      if (activeJudgmentMetric === 'unavailable' && art.status !== 'unavailable') return false;
      if (activeJudgmentMetric === 'all' && art.status === 'pending') return false;

      // Inputs filter
      if (articleKeywordFilter && !art.title.includes(articleKeywordFilter) && !art.contentSnippet.includes(articleKeywordFilter)) return false;
      if (articleExcludeFilter && (art.title.includes(articleExcludeFilter) || art.contentSnippet.includes(articleExcludeFilter))) return false;
      if (articlePlatformFilter && art.source !== articlePlatformFilter) return false;

      return true;
    });
  }, [articles, activeJudgmentMetric, articleKeywordFilter, articleExcludeFilter, articlePlatformFilter]);

  // Judgment Actions
  const handleSetArticleStatus = (id: string, status: 'available' | 'unavailable') => {
    setArticles(prev =>
      prev.map(a => (a.id === id ? { ...a, status } : a))
    );
    showToast(`已标记该信息为【${status === 'available' ? '可用' : '不可用'}】`);
  };

  const handleBatchStatus = (status: 'available' | 'unavailable') => {
    if (selectedArticleIds.length === 0) {
      alert('请先勾选需要批量操作的信息');
      return;
    }
    setArticles(prev =>
      prev.map(a => (selectedArticleIds.includes(a.id) ? { ...a, status } : a))
    );
    showToast(`已批量标记 ${selectedArticleIds.length} 条信息为【${status === 'available' ? '可用' : '不可用'}】`);
    setSelectedArticleIds([]);
  };

  const handleToggleSelectAllArticles = () => {
    if (selectedArticleIds.length === filteredArticles.length) {
      setSelectedArticleIds([]);
    } else {
      setSelectedArticleIds(filteredArticles.map(a => a.id));
    }
  };

  const modals = (
    <>
      {/* Dialog Step 1: 请选择行动类型 */}
      {isSelectTypeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div
            onClick={() => setIsSelectTypeModalOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-2xs"
          ></div>
          <div className="relative bg-white rounded-lg shadow-2xl w-[560px] max-w-[92vw] p-6 z-10 space-y-6 text-[#333]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-800">请选择行动类型</h3>
              <button
                onClick={() => setIsSelectTypeModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setSelectedPlanType('机构行动')}
                className={`border-2 rounded-lg p-6 flex flex-col items-center text-center cursor-pointer transition-all relative ${
                  selectedPlanType === '机构行动'
                    ? 'border-[#1677ff] bg-white shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-[#1677ff] text-white flex items-center justify-center text-2xl mb-4 shadow-xs">
                  <i className="fa-regular fa-building"></i>
                </div>
                <h4 className="text-sm font-bold text-gray-800 mb-1.5">机构行动</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  仅对单个机构创建独立的专项排查行动
                </p>
                {selectedPlanType === '机构行动' && (
                  <div className="absolute right-0 bottom-0 bg-[#1677ff] text-white w-5 h-5 rounded-tl-md flex items-center justify-center text-[10px]">
                    <i className="fa-solid fa-check"></i>
                  </div>
                )}
              </div>
              <div
                onClick={() => setSelectedPlanType('统一行动')}
                className={`border-2 rounded-lg p-6 flex flex-col items-center text-center cursor-pointer transition-all relative ${
                  selectedPlanType === '统一行动'
                    ? 'border-[#1677ff] bg-white shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-[#2f54eb] text-white flex items-center justify-center text-2xl mb-4 shadow-xs">
                  <i className="fa-solid fa-cube"></i>
                </div>
                <h4 className="text-sm font-bold text-gray-800 mb-1.5">统一行动</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  跨机构、跨部门统一创建并下发专项排查行动
                </p>
                {selectedPlanType === '统一行动' && (
                  <div className="absolute right-0 bottom-0 bg-[#1677ff] text-white w-5 h-5 rounded-tl-md flex items-center justify-center text-[10px]">
                    <i className="fa-solid fa-check"></i>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsSelectTypeModalOpen(false)}
                className="px-4 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSelectTypeModalOpen(false);
                  setCurrentSubView('create_form');
                }}
                className="px-5 py-1.5 bg-[#1677ff] hover:bg-[#4096ff] rounded text-xs text-white font-medium cursor-pointer shadow-xs"
              >
                下一步
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Accounts Management Modal (管理已选清单) */}
      {isSelectedAccountsDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div
            onClick={() => setIsSelectedAccountsDrawerOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-2xs"
          ></div>
          <div className="relative bg-white rounded-lg shadow-2xl w-[680px] max-w-[92vw] max-h-[85vh] flex flex-col z-10 text-[#333]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-gray-800">已选定向排查台账清单</h3>
                <span className="bg-blue-50 text-[#1677ff] text-xs px-2 py-0.5 rounded-full font-medium">
                  共 {formSelectedAccounts.length} 个
                </span>
              </div>
              <button
                onClick={() => setIsSelectedAccountsDrawerOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-3">
              {formSelectedAccounts.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs">
                  <i className="fa-regular fa-folder-open text-3xl mb-2 text-gray-300"></i>
                  <p>暂无已选定的排查台账</p>
                </div>
              ) : (
                formSelectedAccounts.map((acc, idx) => (
                  <div
                    key={acc.id}
                    className="flex items-center justify-between p-3 rounded border border-gray-200 bg-white hover:bg-gray-50 text-xs"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <span className="text-gray-400 font-mono w-6">{idx + 1}.</span>
                      <span className="px-2 py-0.5 text-[10px] rounded font-medium bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
                        {acc.type}
                      </span>
                      <div className="flex flex-col truncate">
                        <span className="font-bold text-gray-800 truncate">{acc.name}</span>
                        <div className="flex items-center space-x-2 text-[11px] text-gray-400">
                          {acc.accountNo && <span>账号: {acc.accountNo}</span>}
                          {acc.url && <span>域名: {acc.url}</span>}
                          {acc.institution && <span>归属: {acc.institution}</span>}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormSelectedAccounts(formSelectedAccounts.filter(a => a.id !== acc.id));
                        showToast(`已移除台账: ${acc.name}`);
                      }}
                      className="text-red-400 hover:text-red-600 text-xs px-2 py-1 cursor-pointer shrink-0"
                    >
                      移除
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-[#f9fafb]">
              <span className="text-xs text-gray-500">
                提示：您可以随时在左侧“选择台账”中增删排查目标
              </span>
              <button
                type="button"
                onClick={() => setIsSelectedAccountsDrawerOpen(false)}
                className="px-5 py-1.5 bg-[#1677ff] hover:bg-[#4096ff] rounded text-xs text-white font-medium cursor-pointer shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Target Ledger Account Selection Modal (选择台账) */}
      {isAccountSelectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div
            onClick={() => setIsAccountSelectModalOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-2xs"
          ></div>
          <div className="relative bg-white rounded-lg shadow-2xl w-[800px] max-w-[92vw] h-[85vh] flex flex-col z-10 text-[#333]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">选择定向排查台账</h3>
              <button
                onClick={() => setIsAccountSelectModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="px-6 py-3 bg-[#f8faff] border-b border-gray-100 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 font-medium">快捷搜索:</span>
                <input
                  type="text"
                  value={modalAccountSearch}
                  onChange={e => setModalAccountSearch(e.target.value)}
                  placeholder="搜索台账名称、账号或归属机构..."
                  className="px-3 py-1.5 border border-gray-300 rounded bg-white w-64 text-xs focus:outline-none focus:border-[#1677ff]"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 font-medium">平台筛选:</span>
                <select
                  value={modalPlatformFilter}
                  onChange={e => setModalPlatformFilter(e.target.value)}
                  className="px-2.5 py-1.5 border border-gray-300 rounded bg-white text-xs focus:outline-none focus:border-[#1677ff] cursor-pointer"
                >
                  <option value="全部">全部平台</option>
                  <option value="网站">网站</option>
                  <option value="微信公众号">微信公众号</option>
                  <option value="微博">微博</option>
                  <option value="今日头条">今日头条</option>
                  <option value="抖音">抖音</option>
                </select>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 text-xs text-gray-500 font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      const allFilteredIds = MOCK_TARGET_LEDGER_ACCOUNTS.filter(acc => {
                        const matchText = (acc.name + (acc.accountNo || '') + (acc.institution || '')).toLowerCase();
                        const matchSearch = matchText.includes(modalAccountSearch.toLowerCase());
                        const matchPlatform = modalPlatformFilter === '全部' || acc.type === modalPlatformFilter;
                        return matchSearch && matchPlatform;
                      }).map(a => a.id);
                      setTempSelectedAccountIds(Array.from(new Set([...tempSelectedAccountIds, ...allFilteredIds])));
                    }}
                    className="text-[#1677ff] hover:underline cursor-pointer font-medium"
                  >
                    全选当前列表
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={() => setTempSelectedAccountIds([])}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    清空勾选
                  </button>
                </div>
                <span>已勾选 <strong className="text-[#1677ff]">{tempSelectedAccountIds.length}</strong> 个台账</span>
              </div>

              {(() => {
                const filtered = MOCK_TARGET_LEDGER_ACCOUNTS.filter(acc => {
                  const matchText = (acc.name + (acc.accountNo || '') + (acc.institution || '')).toLowerCase();
                  const matchSearch = matchText.includes(modalAccountSearch.toLowerCase());
                  const matchPlatform = modalPlatformFilter === '全部' || acc.type === modalPlatformFilter;
                  return matchSearch && matchPlatform;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="py-12 text-center text-gray-400 text-xs">
                      <i className="fa-regular fa-folder-open text-2xl mb-2 text-gray-300"></i>
                      <p>未找到匹配的台账，请尝试更换关键词或平台筛选</p>
                    </div>
                  );
                }

                return filtered.map(acc => {
                  const isChecked = tempSelectedAccountIds.includes(acc.id);
                  return (
                    <div
                      key={acc.id}
                      onClick={() => {
                        if (isChecked) {
                          setTempSelectedAccountIds(tempSelectedAccountIds.filter(id => id !== acc.id));
                        } else {
                          setTempSelectedAccountIds([...tempSelectedAccountIds, acc.id]);
                        }
                      }}
                      className={`flex items-center justify-between p-2.5 rounded border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#1677ff] bg-[#f0f7ff]'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-[#1677ff] cursor-pointer"
                        />
                        <span className="px-2 py-0.5 text-[10px] rounded font-medium shrink-0 bg-blue-50 text-blue-600 border border-blue-200">
                          {acc.type}
                        </span>
                        <div className="flex flex-col truncate">
                          <span className="font-bold text-gray-800 truncate">{acc.name}</span>
                          <div className="flex items-center space-x-2 text-[11px] text-gray-400">
                            {acc.accountNo && <span>账号: {acc.accountNo}</span>}
                            {acc.url && <span>域名: {acc.url}</span>}
                            {acc.institution && <span>归属: {acc.institution}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 pl-2">
                        {isChecked ? (
                          <span className="text-[#1677ff] font-medium text-xs flex items-center space-x-1">
                            <i className="fa-solid fa-check"></i>
                            <span>已选</span>
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">点击选择</span>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-[#f9fafb]">
              <span className="text-xs text-gray-500">
                当前已勾选 <strong className="text-[#1677ff]">{tempSelectedAccountIds.length}</strong> 个排查对象
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAccountSelectModalOpen(false)}
                  className="px-4 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-white cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const selected = MOCK_TARGET_LEDGER_ACCOUNTS.filter(a =>
                      tempSelectedAccountIds.includes(a.id)
                    );
                    setFormSelectedAccounts(selected);
                    setIsAccountSelectModalOpen(false);
                    showToast(`已成功选定 ${selected.length} 个定向排查台账`);
                  }}
                  className="px-5 py-1.5 bg-[#1677ff] hover:bg-[#4096ff] rounded text-xs text-white font-medium cursor-pointer shadow-xs"
                >
                  确认选定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (currentSubView === 'create_form') {
    return (
      <SpecialPlanCreateView
        initialPlan={editingPlan}
        onBack={() => {
          setEditingPlan(null);
          setCurrentSubView('list');
        }}
        onSavePlan={(newPlan) => {
          setPlans(prev => [newPlan, ...prev.filter(p => p.id !== newPlan.id)]);
          setEditingPlan(null);
          setCurrentSubView('list');
          showToast(`成功保存专项行动方案【${newPlan.name}】`);
        }}
      />
    );
  }

  if (currentSubView === 'detail' && activePlan) {
    return (
      <div className="flex-1 overflow-y-auto bg-white flex flex-col p-6 min-h-0 text-[#333] relative">
        {/* Top Breadcrumb Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentSubView('list')}
              className="flex items-center text-sm font-bold text-gray-800 hover:text-[#1677ff] cursor-pointer"
            >
              <i className="fa-solid fa-chevron-left mr-1 text-xs"></i>
              <span>{activePlan.name}</span>
            </button>
            <span
              className={`px-2 py-0.5 rounded text-xs ${
                activePlan.type === '机构行动'
                  ? 'bg-blue-50 text-[#1677ff] border border-blue-200'
                  : 'bg-green-50 text-green-600 border border-green-200'
              }`}
            >
              {activePlan.type}
            </span>
            <span className="px-2 py-0.5 rounded text-xs bg-green-50 text-green-600 border border-green-200">
              更新中
            </span>

            {/* 新增机构切换功能（标注位置） */}
            {activePlan.type === '统一行动' && (
              <div className="flex items-center space-x-2 ml-3 pl-3 border-l border-gray-200">
                <span className="text-xs font-medium text-gray-600 whitespace-nowrap flex items-center">
                  <i className="fa-solid fa-sitemap text-[#1677ff] mr-1.5 text-xs"></i>
                  切换排查机构:
                </span>
                <select
                  value={selectedDetailInstitution}
                  onChange={(e) => setSelectedDetailInstitution(e.target.value)}
                  className="h-7 px-2.5 text-xs bg-white border border-[#d9d9d9] hover:border-[#1677ff] focus:border-[#1677ff] rounded text-gray-800 font-medium focus:outline-none cursor-pointer transition-colors shadow-2xs min-w-[220px]"
                >
                  {institutionList.map((inst) => (
                    <option key={inst} value={inst}>
                      {inst}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded border border-gray-200">
            <i className="fa-regular fa-circle-check text-green-500"></i>
            <span>历史数据已排查结束 结束时间: 2026-08-19 16:01:49</span>
          </div>
        </div>

        {/* Sub Tabs: 行动情况 vs 数据研判 vs 方案台账 vs 黑名单 */}
        <div className="flex items-center space-x-8 border-b border-gray-200 mb-4">
          <button
            onClick={() => setDetailTab('overview')}
            className={`pb-2.5 text-xs font-medium cursor-pointer transition-colors relative ${
              detailTab === 'overview' ? 'text-[#1677ff]' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            行动情况
            {detailTab === 'overview' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1677ff] rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setDetailTab('judgment')}
            className={`pb-2.5 text-xs font-medium cursor-pointer transition-colors relative ${
              detailTab === 'judgment' ? 'text-[#1677ff]' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            数据研判
            {detailTab === 'judgment' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1677ff] rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setDetailTab('ledgers')}
            className={`pb-2.5 text-xs font-medium cursor-pointer transition-colors relative flex items-center space-x-1.5 ${
              detailTab === 'ledgers' ? 'text-[#1677ff]' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>方案台账</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-50 text-[#1677ff] border border-blue-200 font-mono">
              {activePlanLedgers.length}
            </span>
            {detailTab === 'ledgers' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1677ff] rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setDetailTab('blacklist')}
            className={`pb-2.5 text-xs font-medium cursor-pointer transition-colors relative flex items-center space-x-1.5 ${
              detailTab === 'blacklist' ? 'text-[#1677ff]' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>黑名单</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-50 text-red-600 border border-red-200 font-mono">
              {activePlanBlacklist.length}
            </span>
            {detailTab === 'blacklist' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1677ff] rounded-full"></span>
            )}
          </button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* DETAIL TAB 1: 行动情况 (Image 5) */}
        {/* ---------------------------------------------------- */}
        {detailTab === 'overview' && (
          <div className="space-y-4">
            {/* Top Row: 4 Metric Cards + 方案信息 */}
            <div className="grid grid-cols-12 gap-4">
              {/* 4 Cards (7 Cols) */}
              <div className="col-span-8 grid grid-cols-4 gap-3">
                <div className="bg-[#f8faff] border border-[#e6f0ff] rounded p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <div className="w-5 h-5 rounded bg-[#1677ff] text-white flex items-center justify-center text-[10px]">
                      <i className="fa-regular fa-folder-open"></i>
                    </div>
                    <span>排查台账总数</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {activeMetricCounts.ledgerTotal.toLocaleString()}
                  </div>
                </div>

                <div className="bg-[#fcfaf7] border border-[#f7ede2] rounded p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <div className="w-5 h-5 rounded bg-[#d48872] text-white flex items-center justify-center text-[10px]">
                      <i className="fa-solid fa-chart-column"></i>
                    </div>
                    <span>排查数据总量</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {activeMetricCounts.dataTotal.toLocaleString()}
                  </div>
                </div>

                <div className="bg-[#f4fdfc] border border-[#e0f7f5] rounded p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <div className="w-5 h-5 rounded bg-[#36cfc9] text-white flex items-center justify-center text-[10px]">
                      <i className="fa-regular fa-thumbs-up"></i>
                    </div>
                    <span>可用数据量</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {activeMetricCounts.availableTotal.toLocaleString()}
                  </div>
                </div>

                <div className="bg-[#fff9f8] border border-[#ffedea] rounded p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <div className="w-5 h-5 rounded bg-[#ff7875] text-white flex items-center justify-center text-[10px]">
                      <i className="fa-regular fa-circle-xmark"></i>
                    </div>
                    <span>不可用数据量</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {activeMetricCounts.unavailableTotal.toLocaleString()}
                  </div>
                </div>

                {/* 行动概述 (Spans all 4 cols) */}
                <div className="col-span-4 bg-[#f8faff] border border-[#e6f0ff] rounded p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5 font-bold text-gray-800">
                      <div className="w-1 h-3 bg-[#1677ff] rounded-xs"></div>
                      <span>行动概述</span>
                    </div>
                    <button
                      onClick={() => handleCopyText(activeSummary)}
                      className="text-[#1677ff] hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <i className="fa-regular fa-clone"></i>
                      <span>复制</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{activeSummary}</p>
                </div>
              </div>

              {/* 方案信息 Card (4 Cols - Image 5) */}
              <div className="col-span-4 border border-[#e8e8e8] rounded p-4 bg-white shadow-2xs space-y-3.5 text-xs">
                <div className="flex items-center space-x-1.5 font-bold text-gray-800">
                  <div className="w-1 h-3 bg-[#1677ff] rounded-xs"></div>
                  <span>方案信息</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">排查类型：</span>
                    <span className="text-green-600 font-medium">● 快速排查</span>
                  </div>
                  <div>
                    <span className="text-gray-400">开始日期：</span>
                    <span className="font-mono text-gray-700">{activePlan.startDate}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-gray-400">涉及平台：</div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="flex items-center space-x-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                      <i className="fa-solid fa-globe"></i> <span>网站</span>
                    </span>
                    <span className="flex items-center space-x-1 px-2 py-0.5 bg-orange-50 text-orange-700 rounded">
                      <i className="fa-brands fa-weibo"></i> <span>微博</span>
                    </span>
                    <span className="flex items-center space-x-1 px-2 py-0.5 bg-green-50 text-green-700 rounded">
                      <i className="fa-brands fa-weixin"></i> <span>微信公众号</span>
                    </span>
                    <span className="flex items-center space-x-1 px-2 py-0.5 bg-red-50 text-red-700 rounded">
                      <i className="fa-solid fa-newspaper"></i> <span>今日头条</span>
                    </span>
                    <span className="flex items-center space-x-1 px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                      <i className="fa-brands fa-tiktok"></i> <span>抖音</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-gray-400">数据范围：</div>
                  <div className="text-xs">
                    {activePlan.scope === '定向范围' ? (
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 bg-blue-50 text-[#1677ff] rounded font-medium border border-blue-200">
                          定向范围 ({activePlan.targetAccounts?.length || 2}个目标)
                        </span>
                        {activePlan.targetAccounts && activePlan.targetAccounts.length > 0 && (
                          <div className="text-[11px] text-gray-500 truncate max-w-full">
                            {activePlan.targetAccounts.map(a => a.name).join('、')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-700 rounded border border-gray-200">
                        {activePlan.scope}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-gray-400">涉及主体：</div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 border border-gray-200 rounded text-gray-700">党政机关</span>
                    <span className="px-2.5 py-0.5 border border-gray-200 rounded text-gray-700">事业单位</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row Charts: 数据处理统计 & 各平台数据占比 (Image 5) */}
            <div className="grid grid-cols-12 gap-4">
              {/* Left: 数据处理统计 (7 cols) */}
              <div className="col-span-8 border border-[#e8e8e8] rounded p-4 bg-white shadow-2xs flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5 font-bold text-gray-800 text-xs">
                    <div className="w-1 h-3 bg-[#1677ff] rounded-xs"></div>
                    <span>数据处理统计</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="border border-[#d9d9d9] rounded px-2 py-0.5 text-xs flex items-center space-x-1 bg-white">
                      <span>2026-08-13 ~ 2026-08-19</span>
                      <i className="fa-regular fa-calendar text-gray-400 text-[10px]"></i>
                    </div>
                    <div className="flex items-center space-x-1 text-xs">
                      {['按年', '按月', '按天', '按时'].map(g => (
                        <button
                          key={g}
                          type="button"
                          className={`px-2 py-0.5 rounded ${
                            g === '按天' ? 'bg-[#1677ff] text-white font-medium' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={SPLINE_CHART_DATA} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#888' }} />
                      <YAxis domain={[0, 4]} tick={{ fontSize: 10, fill: '#888' }} />
                      <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                      <Line type="monotone" dataKey="weibo" name="微博" stroke="#fa8c16" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="weixin" name="微信公众号" stroke="#52c41a" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="toutiao" name="今日头条" stroke="#f5222d" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right: 各平台数据占比 (4 cols) */}
              <div className="col-span-4 border border-[#e8e8e8] rounded p-4 bg-white shadow-2xs flex flex-col">
                <div className="flex items-center space-x-1.5 font-bold text-gray-800 text-xs mb-2">
                  <div className="w-1 h-3 bg-[#1677ff] rounded-xs"></div>
                  <span>各平台数据占比</span>
                </div>

                <div className="h-48 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PLATFORM_PIE_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={46}
                        outerRadius={68}
                        dataKey="value"
                      >
                        {PLATFORM_PIE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-gray-400">总计</span>
                    <span className="text-base font-bold text-gray-800">334</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-gray-600 pt-2 border-t border-gray-50">
                  {PLATFORM_PIE_DATA.map(item => (
                    <span key={item.name} className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span>{item.name}: {item.value} ({item.percentage})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* DETAIL TAB 2: 数据研判 (Image 6 - Image 10) */}
        {/* ---------------------------------------------------- */}
        {detailTab === 'judgment' && (
          <div className="space-y-4">
            {/* Top Metric Tabs (Image 6 - 10) */}
            <div className="grid grid-cols-5 gap-3">
              {/* Card 1: 待研判数据池 */}
              <div
                onClick={() => setActiveJudgmentMetric('pool')}
                className={`border rounded p-3 cursor-pointer transition-all ${
                  activeJudgmentMetric === 'pool'
                    ? 'border-[#1677ff] bg-[#f8faff] ring-1 ring-[#1677ff]/30 shadow-xs'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-1.5 text-xs text-gray-600 mb-1">
                  <i className="fa-solid fa-database text-[#1677ff]"></i>
                  <span>待研判数据池 (条)</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {activePlan.id === 2 ? '193,143' : '334'}
                </div>
              </div>

              {/* Card 2: 待研判 */}
              <div
                onClick={() => setActiveJudgmentMetric('pending')}
                className={`border rounded p-3 cursor-pointer transition-all ${
                  activeJudgmentMetric === 'pending'
                    ? 'border-[#1677ff] bg-[#1677ff] text-white shadow-xs'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span>待研判</span>
                  <i className="fa-regular fa-hourglass-half"></i>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {activePlan.id === 2 ? '0' : '50'}
                </div>
              </div>

              {/* Card 3: 可用 (已研判) */}
              <div
                onClick={() => setActiveJudgmentMetric('available')}
                className={`border rounded p-3 cursor-pointer transition-all ${
                  activeJudgmentMetric === 'available'
                    ? 'border-[#1677ff] bg-[#1677ff] text-white shadow-xs'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span>可用 (已研判)</span>
                  <i className="fa-regular fa-thumbs-up"></i>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {activePlan.id === 2 ? '1,493' : '0'}
                </div>
              </div>

              {/* Card 4: 不可用 (已研判) */}
              <div
                onClick={() => setActiveJudgmentMetric('unavailable')}
                className={`border rounded p-3 cursor-pointer transition-all ${
                  activeJudgmentMetric === 'unavailable'
                    ? 'border-[#1677ff] bg-[#1677ff] text-white shadow-xs'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span>不可用 (已研判)</span>
                  <i className="fa-regular fa-circle-xmark"></i>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {activePlan.id === 2 ? '2,004' : '0'}
                </div>
              </div>

              {/* Card 5: 全部已研判 */}
              <div
                onClick={() => setActiveJudgmentMetric('all')}
                className={`border rounded p-3 cursor-pointer transition-all ${
                  activeJudgmentMetric === 'all'
                    ? 'border-[#1677ff] bg-[#1677ff] text-white shadow-xs'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span>全部已研判</span>
                  <i className="fa-solid fa-layer-group"></i>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {activePlan.id === 2 ? '3,497' : '0'}
                </div>
              </div>
            </div>

            {/* Filter Bar with Search & Reset (Image 6 Note) */}
            <div className="bg-white border border-[#e8e8e8] rounded p-3 space-y-2 text-xs">
              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1 bg-white">
                  <span className="text-gray-600 mr-2 whitespace-nowrap">关键词</span>
                  <input
                    type="text"
                    value={articleKeywordFilter}
                    onChange={e => setArticleKeywordFilter(e.target.value)}
                    placeholder="请输入关键词，多个关键词用分号分隔"
                    className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                  />
                </div>

                <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1 bg-white">
                  <span className="text-gray-600 mr-2 whitespace-nowrap">排除词</span>
                  <input
                    type="text"
                    value={articleExcludeFilter}
                    onChange={e => setArticleExcludeFilter(e.target.value)}
                    placeholder="请输入排除词，多个排除词用分号分隔"
                    className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                  />
                </div>

                <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1 bg-white">
                  <span className="text-gray-600 mr-2 whitespace-nowrap">平台类型</span>
                  <select
                    value={articlePlatformFilter}
                    onChange={e => setArticlePlatformFilter(e.target.value)}
                    className="w-full text-xs text-gray-800 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="">请选择平台类型</option>
                    <option value="微信">微信</option>
                    <option value="今日头条">今日头条</option>
                    <option value="网站">网站</option>
                    <option value="微博">微博</option>
                    <option value="抖音">抖音</option>
                  </select>
                </div>

                <div className="flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="bg-[#1677ff] hover:bg-[#4096ff] text-white px-4 py-1 rounded text-xs cursor-pointer flex items-center space-x-1"
                  >
                    <i className="fa-solid fa-magnifying-glass text-[10px]"></i>
                    <span>查询</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setArticleKeywordFilter('');
                      setArticleExcludeFilter('');
                      setArticlePlatformFilter('');
                    }}
                    className="border border-[#d9d9d9] bg-white hover:bg-gray-50 text-gray-700 px-3 py-1 rounded text-xs cursor-pointer flex items-center space-x-1"
                  >
                    <i className="fa-solid fa-rotate-right text-[10px]"></i>
                    <span>重置</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Batch Operations Bar */}
            <div className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center space-x-3">
                <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedArticleIds.length > 0 && selectedArticleIds.length === filteredArticles.length}
                    onChange={handleToggleSelectAllArticles}
                    className="rounded text-[#1677ff]"
                  />
                  <span className="text-gray-700">全选 ({selectedArticleIds.length}/{filteredArticles.length})</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleBatchStatus('available')}
                  className="px-3 py-1 rounded bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 cursor-pointer flex items-center space-x-1"
                >
                  <i className="fa-solid fa-check text-[10px]"></i>
                  <span>批量可用</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBatchStatus('unavailable')}
                  className="px-3 py-1 rounded bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 cursor-pointer flex items-center space-x-1"
                >
                  <i className="fa-solid fa-xmark text-[10px]"></i>
                  <span>批量不可用</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => showToast('已成功创建数据导出任务，请前往下载中心查看')}
                className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center space-x-1"
              >
                <i className="fa-solid fa-arrow-up-from-bracket text-[10px]"></i>
                <span>数据导出</span>
              </button>
            </div>

            {/* Article Cards List (Image 6 - 10) */}
            <div className="space-y-3">
              {filteredArticles.length === 0 ? (
                <div className="py-12 text-center text-gray-400 bg-gray-50 rounded border border-dashed border-gray-200">
                  <i className="fa-regular fa-folder-open text-3xl text-gray-300 mb-2"></i>
                  <div>暂无符合该研判状态的信息记录</div>
                </div>
              ) : (
                filteredArticles.map(art => {
                  const isChecked = selectedArticleIds.includes(art.id);
                  return (
                    <div
                      key={art.id}
                      className="border border-[#e8e8e8] rounded-lg p-4 bg-white shadow-2xs hover:border-blue-200 transition-all flex items-start space-x-3 text-xs"
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedArticleIds(selectedArticleIds.filter(i => i !== art.id));
                          } else {
                            setSelectedArticleIds([...selectedArticleIds, art.id]);
                          }
                        }}
                        className="mt-1 rounded text-[#1677ff] cursor-pointer"
                      />

                      {/* Content Area */}
                      <div className="flex-1 space-y-2">
                        {/* Title Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {art.status === 'available' ? (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-green-500 text-white font-medium">
                                可用
                              </span>
                            ) : art.status === 'unavailable' ? (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-500 text-white font-medium">
                                不可用
                              </span>
                            ) : null}

                            {art.source === '微信' ? (
                              <i className="fa-brands fa-weixin text-green-600 text-sm"></i>
                            ) : art.source === '今日头条' ? (
                              <i className="fa-solid fa-newspaper text-red-600 text-sm"></i>
                            ) : (
                              <i className="fa-solid fa-globe text-blue-600 text-sm"></i>
                            )}

                            <h4 className="font-bold text-gray-900 hover:text-[#1677ff] cursor-pointer text-sm">
                              {art.title}
                            </h4>
                            <button
                              onClick={() => alert(`查看全文：\n${art.title}\n\n${art.contentSnippet}`)}
                              className="text-[#1677ff] hover:underline cursor-pointer flex items-center space-x-0.5 text-[11px]"
                            >
                              <i className="fa-regular fa-file-lines text-[10px]"></i>
                              <span>查看全文</span>
                            </button>
                          </div>

                          <div className="flex items-center space-x-3 text-gray-500 text-[11px]">
                            <button
                              onClick={() => handleCopyText(`${art.title}\n${art.contentSnippet}`)}
                              className="hover:text-[#1677ff] cursor-pointer flex items-center space-x-1"
                            >
                              <i className="fa-regular fa-clone"></i>
                              <span>复制全部</span>
                            </button>
                            <button
                              onClick={() => handleCopyText(art.title)}
                              className="hover:text-[#1677ff] cursor-pointer flex items-center space-x-1"
                            >
                              <i className="fa-regular fa-copy"></i>
                              <span>复制标题和链接</span>
                            </button>
                          </div>
                        </div>

                        {/* Snippet with Red Highlight */}
                        <div className="text-gray-600 leading-relaxed bg-[#fafafa] p-2.5 rounded border border-gray-100">
                          {art.contentSnippet.split('社工部').map((part, i, arr) => (
                            <React.Fragment key={i}>
                              {part}
                              {i < arr.length - 1 && (
                                <span className="text-red-500 font-bold bg-red-50 px-1 py-0.2 rounded">
                                  社工部
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>

                        {/* Meta Tags */}
                        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                          <div className="flex items-center space-x-4">
                            <span>来源: {art.source}</span>
                            <span>作者: {art.author}</span>
                            <span>
                              关键词: <strong className="text-red-500 font-normal">{art.keyword}</strong>
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span>发布时间: {art.publishTime}</span>
                            <span>入库时间: {art.inTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action Buttons (可用 / 不可用) */}
                      <div className="flex flex-col space-y-2 flex-shrink-0 pl-2">
                        <button
                          type="button"
                          onClick={() => handleSetArticleStatus(art.id, 'unavailable')}
                          className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors border flex items-center justify-center space-x-1 ${
                            art.status === 'unavailable'
                              ? 'bg-red-500 text-white border-red-500'
                              : 'border-red-300 text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <i className="fa-solid fa-xmark"></i>
                          <span>不可用</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetArticleStatus(art.id, 'available')}
                          className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors border flex items-center justify-center space-x-1 ${
                            art.status === 'available'
                              ? 'bg-green-500 text-white border-green-500'
                              : 'border-green-300 text-green-600 hover:bg-green-50'
                          }`}
                        >
                          <i className="fa-solid fa-check"></i>
                          <span>可用</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* DETAIL TAB 3: 方案台账 (本专项行动台账) */}
        {/* ---------------------------------------------------- */}
        {detailTab === 'ledgers' && (
          <div className="space-y-4">
            <Tab1ActionLedgersView
              ledgers={activePlanLedgers}
              selectedIds={selectedLedgerIds}
              onSelectionChange={setSelectedLedgerIds}
              onMoveToBlacklist={handleMoveLedgersToBlacklist}
              onRemoveFromTab1={handleRemoveLedgers}
              onGoToTab2={() => {
                showToast('当前处于方案查看视图，如需补充或重置全局台账，请在创建/编辑方案中操作');
              }}
              onToast={showToast}
            />
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* DETAIL TAB 4: 黑名单 (本专项行动黑名单) */}
        {/* ---------------------------------------------------- */}
        {detailTab === 'blacklist' && (
          <div className="space-y-4">
            <Tab3BlacklistView
              blacklists={activePlanBlacklist}
              selectedIds={selectedBlacklistIds}
              onSelectionChange={setSelectedBlacklistIds}
              onRestoreToTab1={handleRestoreBlacklistToLedgers}
              onDeleteFromBlacklist={handleDeleteBlacklist}
              onToast={showToast}
            />
          </div>
        )}
        {modals}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white flex flex-col p-6 min-h-0 text-[#333] relative">
      {/* Page Title & Action */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-base font-bold text-gray-800">专项行动方案</h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="bg-[#1677ff] hover:bg-[#4096ff] text-white px-4 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs font-medium"
          >
            <i className="fa-solid fa-plus text-[11px]"></i>
            <span>新建行动方案</span>
          </button>
        </div>
      </div>

      {/* Top 5 Stat Cards Banner (Image 1) */}
      <div className="bg-[#f8faff] border border-[#e6f0ff] rounded-lg p-5 mb-4 shadow-2xs grid grid-cols-5 divide-x divide-[#e6f0ff]">
        {/* Metric 1: 机构行动方案数 */}
        <div className="px-4 first:pl-2 space-y-2">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <div className="w-6 h-6 rounded bg-[#1677ff] text-white flex items-center justify-center text-xs">
              <i className="fa-regular fa-folder-open"></i>
            </div>
            <span className="font-medium">机构行动方案数</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">15</div>
        </div>

        {/* Metric 2: 统一行动方案数 */}
        <div className="px-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <div className="w-6 h-6 rounded bg-[#2f54eb] text-white flex items-center justify-center text-xs">
              <i className="fa-solid fa-cube"></i>
            </div>
            <span className="font-medium">统一行动方案数</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">5</div>
        </div>

        {/* Metric 3: 更新中 */}
        <div className="px-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <div className="w-6 h-6 rounded bg-[#36cfc9] text-white flex items-center justify-center text-xs">
              <i className="fa-solid fa-arrows-rotate"></i>
            </div>
            <span className="font-medium">更新中</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">3</div>
        </div>

        {/* Metric 4: 深度更新中 */}
        <div className="px-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <div className="w-6 h-6 rounded bg-[#597ef7] text-white flex items-center justify-center text-xs">
              <i className="fa-solid fa-compact-disc"></i>
            </div>
            <span className="font-medium">深度更新中</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">0</div>
        </div>

        {/* Metric 5: 已关闭 */}
        <div className="px-4 last:pr-2 space-y-2">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <div className="w-6 h-6 rounded bg-[#ff7a45] text-white flex items-center justify-center text-xs">
              <i className="fa-regular fa-circle-xmark"></i>
            </div>
            <span className="font-medium">已关闭</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">17</div>
        </div>
      </div>

      {/* 2-Row Filter Bar (Image 1) */}
      <div className="bg-white border border-[#e8e8e8] rounded-sm p-4 mb-4 shadow-2xs space-y-3 text-xs">
        {/* Row 1 */}
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff]">
            <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">行动名称</span>
            <input
              type="text"
              value={nameFilter}
              maxLength={100}
              onChange={e => setNameFilter(e.target.value)}
              placeholder="请输入行动名称"
              className="w-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
            />
            <span className="text-[10px] text-gray-400 select-none ml-1">{nameFilter.length}/100</span>
          </div>

          <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff]">
            <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">所属机构</span>
            <input
              type="text"
              value={instFilter}
              maxLength={100}
              onChange={e => setInstFilter(e.target.value)}
              placeholder="请输入机构名称"
              className="w-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
            />
            <span className="text-[10px] text-gray-400 select-none ml-1">{instFilter.length}/100</span>
          </div>

          <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff]">
            <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">行动类型</span>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full text-xs text-gray-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="">请选择行动类型</option>
              <option value="机构行动">机构行动</option>
              <option value="统一行动">统一行动</option>
            </select>
          </div>

          <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff]">
            <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">排查类型</span>
            <select
              value={inspectTypeFilter}
              onChange={e => setInspectTypeFilter(e.target.value)}
              className="w-full text-xs text-gray-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="">请选择排查类型</option>
              <option value="快速排查">快速排查</option>
              <option value="深度排查">深度排查</option>
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-3 gap-4 flex-1 mr-4">
            <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff]">
              <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">行动状态</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full text-xs text-gray-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="">请选择行动状态</option>
                <option value="更新中">更新中</option>
                <option value="深度更新中">深度更新中</option>
                <option value="已关闭">已关闭</option>
              </select>
            </div>

            <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff]">
              <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">操作人</span>
              <input
                type="text"
                value={operatorFilter}
                onChange={e => setOperatorFilter(e.target.value)}
                placeholder="请输入操作人"
                className="w-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
              />
            </div>

            <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff] space-x-1.5">
              <span className="text-gray-600 font-medium whitespace-nowrap select-none">开始日期</span>
              <input
                type="date"
                value={startDateFilter}
                onChange={e => setStartDateFilter(e.target.value)}
                className="text-xs text-gray-700 focus:outline-none bg-transparent w-24"
              />
              <span className="text-gray-400">~</span>
              <input
                type="date"
                value={endDateFilter}
                onChange={e => setEndDateFilter(e.target.value)}
                className="text-xs text-gray-700 focus:outline-none bg-transparent w-24"
              />
              <i className="fa-regular fa-calendar text-gray-400 text-xs ml-auto"></i>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {}}
              className="bg-[#1677ff] hover:bg-[#4096ff] text-white px-5 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center space-x-1 shadow-xs"
            >
              <i className="fa-solid fa-magnifying-glass text-[11px]"></i>
              <span>查询</span>
            </button>
            <button
              type="button"
              onClick={handleResetMainFilters}
              className="border border-[#d9d9d9] bg-white hover:bg-gray-50 text-gray-700 px-4 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
            >
              <i className="fa-solid fa-rotate-right text-[11px]"></i>
              <span>重置</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table (Image 1) */}
      <div className="border border-[#e8e8e8] rounded-sm bg-white overflow-hidden shadow-xs flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs table-fixed">
            <thead className="bg-[#fafafa] text-gray-700 border-b border-[#e8e8e8]">
              <tr>
                <th className="px-2 py-2.5 font-medium w-[45px] text-center whitespace-nowrap">序号</th>
                <th className="px-3 py-2.5 font-medium w-[150px] whitespace-nowrap">行动名称</th>
                <th className="px-2 py-2.5 font-medium w-[80px] whitespace-nowrap">行动类型</th>
                <th className="px-3 py-2.5 font-medium w-[22%] whitespace-nowrap">所属机构</th>
                <th className="px-3 py-2.5 font-medium w-[95px] whitespace-nowrap">开始日期</th>
                <th className="px-2 py-2.5 font-medium w-[80px] whitespace-nowrap">排查类型</th>
                <th className="px-2 py-2.5 font-medium w-[80px] whitespace-nowrap">行动状态</th>
                <th className="px-2 py-2.5 font-medium w-[75px] whitespace-nowrap">操作人</th>
                <th className="px-3 py-2.5 font-medium w-[140px] whitespace-nowrap">操作时间</th>
                <th className="px-2 py-2.5 font-medium w-[85px] text-right whitespace-nowrap">数据量 ⇕</th>
                <th className="px-2 py-2.5 font-medium w-[75px] text-center whitespace-nowrap">开启/关闭</th>
                <th className="px-3 py-2.5 font-medium w-[120px] text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0] text-gray-600">
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <i className="fa-regular fa-folder-open text-3xl text-gray-300"></i>
                      <span>暂无匹配的专项行动方案</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPlans.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#fafafa] transition-colors">
                    {/* 序号 */}
                    <td className="px-2 py-3 text-center text-gray-500 font-normal align-middle">
                      {idx + 1}
                    </td>

                    {/* 行动名称 (Link) */}
                    <td className="px-3 py-3 align-middle font-medium">
                      <button
                        onClick={() => handleOpenDetail(item)}
                        className="text-[#1677ff] hover:underline cursor-pointer text-left truncate block max-w-full font-medium"
                      >
                        {item.name}
                      </button>
                    </td>

                    {/* 行动类型 (Tag) */}
                    <td className="px-2 py-3 align-middle whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-normal ${
                          item.type === '机构行动'
                            ? 'bg-blue-50 text-[#1677ff] border border-blue-200'
                            : 'bg-green-50 text-green-600 border border-green-200'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>

                    {/* 所属机构 */}
                    <td className="px-3 py-3 align-middle text-gray-800">
                      <div className="line-clamp-2 leading-relaxed" title={item.institution}>
                        {item.institution}
                      </div>
                    </td>

                    {/* 开始日期 */}
                    <td className="px-3 py-3 font-mono text-[11px] text-gray-600 align-middle whitespace-nowrap">
                      {item.startDate}
                    </td>

                    {/* 排查类型 */}
                    <td className="px-2 py-3 text-gray-700 align-middle whitespace-nowrap">
                      {item.inspectType}
                    </td>

                    {/* 行动状态 */}
                    <td className="px-2 py-3 align-middle whitespace-nowrap">
                      {item.status === '更新中' ? (
                        <span className="inline-flex items-center space-x-1 text-[#52c41a] text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#52c41a]"></span>
                          <span>更新中</span>
                        </span>
                      ) : item.status === '深度更新中' ? (
                        <span className="inline-flex items-center space-x-1 text-[#1677ff] text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1677ff] animate-pulse"></span>
                          <span>深度更新中</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-gray-400 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          <span>已关闭</span>
                        </span>
                      )}
                    </td>

                    {/* 操作人 */}
                    <td className="px-2 py-3 text-gray-700 align-middle whitespace-nowrap">
                      {item.operator
                        ? item.operator.replace(/^(?:管理员|系统管理员)\s*/, '').replace(/^.*[\(\（](.*?)[\)\）].*$/, '$1') || item.operator
                        : '-'}
                    </td>

                    {/* 操作时间 */}
                    <td className="px-3 py-3 font-mono text-[11px] text-gray-500 align-middle whitespace-nowrap">
                      {item.operateTime}
                    </td>

                    {/* 数据量 */}
                    <td className="px-2 py-3 text-right font-mono text-gray-800 font-medium align-middle">
                      {item.dataCount.toLocaleString()}
                    </td>

                    {/* 开启/关闭 (Switch Toggle) */}
                    <td className="px-2 py-3 text-center align-middle whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleSwitch(item.id)}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex items-center px-1 ${
                          item.isOpen ? 'bg-[#1677ff]' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`text-[10px] text-white font-bold ${item.isOpen ? 'ml-1' : 'ml-auto mr-1'}`}>
                          {item.isOpen ? '开' : '关'}
                        </span>
                        <span
                          className={`w-4 h-4 rounded-full bg-white transition-transform absolute ${
                            item.isOpen ? 'right-1' : 'left-1'
                          }`}
                        ></span>
                      </button>
                    </td>

                    {/* 操作 */}
                    <td className="px-3 py-3 text-center align-middle whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2 text-xs">
                        <button
                          onClick={() => handleOpenDetail(item)}
                          className="text-[#1677ff] hover:underline cursor-pointer font-medium"
                        >
                          详情
                        </button>
                        <button
                          onClick={() => {
                            setEditingPlan(item);
                            setCurrentSubView('create_form');
                          }}
                          className="text-[#1677ff] hover:underline cursor-pointer font-medium"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeletePlan(item.id)}
                          className="text-red-500 hover:underline cursor-pointer font-medium"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#e8e8e8] bg-[#fafafa] text-xs text-gray-600">
          <div>
            共 <strong className="text-gray-800 font-medium">{filteredPlans.length}</strong> 条行动方案
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <span>第 1 / 1 页</span>
          </div>
        </div>
        {modals}
      </div>
      </div>
    );
};


