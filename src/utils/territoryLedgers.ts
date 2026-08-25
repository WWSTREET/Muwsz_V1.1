import { initialMockLedgers, LedgerItem } from '../mockLedgerData';
import { generateTab2MockLedgers } from '../data/tab2MockLedgers';

export interface ExtendedLedgerItem extends LedgerItem {
  importSource: '属地导入' | '手动追加';
  blacklistReason?: string;
}

/**
 * 获取指定机构的属地默认台账列表
 * 规则：默认自动应用属地台账中的台账，并打上 '属地导入' 标记
 */
export function getInstitutionTerritoryLedgers(institutionName: string): ExtendedLedgerItem[] {
  const tab2All = generateTab2MockLedgers();
  
  // 提取关键词（如 陕西、西安、雁塔、碑林、莲湖、咸阳、宝鸡、洛阳、河南、阳泉、太原、北京、上海、广东、广州、深圳、杭州、浙江、成都、四川、武汉、湖北、南京、江苏 等）
  let regionTag = '陕西';
  if (institutionName.includes('洛阳') || institutionName.includes('河南') || institutionName.includes('郑州')) {
    regionTag = '河南';
  } else if (institutionName.includes('阳泉') || institutionName.includes('山西') || institutionName.includes('太原')) {
    regionTag = '山西';
  } else if (institutionName.includes('北京') || institutionName.includes('海淀') || institutionName.includes('朝阳')) {
    regionTag = '北京';
  } else if (institutionName.includes('上海') || institutionName.includes('浦东')) {
    regionTag = '上海';
  } else if (institutionName.includes('广东') || institutionName.includes('广州') || institutionName.includes('深圳')) {
    regionTag = '广东';
  } else if (institutionName.includes('浙江') || institutionName.includes('杭州') || institutionName.includes('宁波')) {
    regionTag = '浙江';
  } else if (institutionName.includes('四川') || institutionName.includes('成都')) {
    regionTag = '四川';
  } else if (institutionName.includes('湖北') || institutionName.includes('武汉') || institutionName.includes('随州')) {
    regionTag = '湖北';
  } else if (institutionName.includes('江苏') || institutionName.includes('南京')) {
    regionTag = '江苏';
  } else if (institutionName.includes('咸阳')) {
    regionTag = '咸阳';
  } else if (institutionName.includes('宝鸡')) {
    regionTag = '宝鸡';
  } else if (institutionName.includes('榆林')) {
    regionTag = '榆林';
  } else if (institutionName.includes('延安')) {
    regionTag = '延安';
  } else if (institutionName.includes('汉中')) {
    regionTag = '汉中';
  } else if (institutionName.includes('雁塔')) {
    regionTag = '雁塔';
  } else if (institutionName.includes('碑林')) {
    regionTag = '碑林';
  } else if (institutionName.includes('莲湖')) {
    regionTag = '莲湖';
  } else if (institutionName.includes('西安')) {
    regionTag = '西安';
  }

  // 1. 优先从 tab2MockLedgers 匹配
  const matchedTab2 = tab2All.filter(item => {
    const inName = item.name && item.name.includes(regionTag);
    const inSubject = item.subjectName && item.subjectName.includes(regionTag);
    const inAddr = item.addresses && item.addresses.some(a => a.text.includes(regionTag));
    return inName || inSubject || inAddr;
  });

  // 2. 从 initialMockLedgers 补充
  const matchedInitial = initialMockLedgers.filter(item => {
    const inName = item.name && item.name.includes(regionTag);
    const inSubject = item.subjectName && item.subjectName.includes(regionTag);
    const inAddr = item.addresses && item.addresses.some(a => a.text.includes(regionTag));
    return inName || inSubject || inAddr;
  });

  // 合并候选集并去重
  const candidatePool = [...matchedTab2, ...matchedInitial];
  const seenIds = new Set<number>();
  const uniqueItems: LedgerItem[] = [];

  for (const item of candidatePool) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      uniqueItems.push({
        ...item,
        fans: item.fans || (item as any).fansCount || 10000,
        collectStatus: item.collectStatus || '已采集',
        ledgerStatus: item.ledgerStatus || '正常',
      });
    }
  }

  // 如果筛选出来的少于 15 条，从全量中补充满足 20~28 条
  if (uniqueItems.length < 18) {
    for (const item of initialMockLedgers) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        uniqueItems.push({
          ...item,
          fans: item.fans || 10000,
          collectStatus: '已采集',
          ledgerStatus: '正常',
        });
        if (uniqueItems.length >= 25) break;
      }
    }
  }

  // 为本机构特化台账（添加 importSource: '属地导入'）
  return uniqueItems.slice(0, 28).map((item, idx) => ({
    ...item,
    importSource: '属地导入' as const,
    source: item.source || '同步匹配',
    ledgerStatus: '正常',
  }));
}

/**
 * 获取机构所属区域描述
 */
export function getInstitutionRegion(instName: string): string {
  if (instName.includes('陕西省') || instName.includes('陕西')) {
    if (instName.includes('雁塔')) return '陕西/西安/雁塔区';
    if (instName.includes('碑林')) return '陕西/西安/碑林区';
    if (instName.includes('莲湖')) return '陕西/西安/莲湖区';
    if (instName.includes('西安')) return '陕西/西安市';
    if (instName.includes('咸阳')) return '陕西/咸阳市';
    if (instName.includes('宝鸡')) return '陕西/宝鸡市';
    if (instName.includes('汉中')) return '陕西/汉中市';
    if (instName.includes('榆林')) return '陕西/榆林市';
    if (instName.includes('延安')) return '陕西/延安市';
    return '陕西省';
  }
  if (instName.includes('洛阳')) return '河南/洛阳市';
  if (instName.includes('郑州')) return '河南/郑州市';
  if (instName.includes('河南')) return '河南省';
  if (instName.includes('阳泉')) return '山西/阳泉市';
  if (instName.includes('太原')) return '山西/太原市';
  if (instName.includes('山西')) return '山西省';
  if (instName.includes('海淀')) return '北京/海淀区';
  if (instName.includes('朝阳')) return '北京/朝阳区';
  if (instName.includes('北京')) return '北京市';
  if (instName.includes('浦东')) return '上海/浦东新区';
  if (instName.includes('上海')) return '上海市';
  if (instName.includes('广州')) return '广东/广州市';
  if (instName.includes('深圳')) return '广东/深圳市';
  if (instName.includes('广东')) return '广东省';
  if (instName.includes('杭州')) return '浙江/杭州市';
  if (instName.includes('浙江')) return '浙江省';
  if (instName.includes('成都')) return '四川/成都市';
  if (instName.includes('四川')) return '四川省';
  if (instName.includes('武汉')) return '湖北/武汉市';
  if (instName.includes('随州')) return '湖北/随州市';
  if (instName.includes('湖北')) return '湖北省';
  if (instName.includes('南京')) return '江苏/南京市';
  if (instName.includes('江苏')) return '江苏省';
  return '本地属地';
}

/**
 * 获取机构单位类型
 */
export function getInstitutionType(instName: string): string {
  if (instName.includes('网信') || instName.includes('信息化')) return '网信部门';
  if (instName.includes('宣传')) return '宣传部门';
  if (instName.includes('公安')) return '公安部门';
  if (instName.includes('政府') || instName.includes('办公室')) return '党政机关';
  return '事业单位';
}
