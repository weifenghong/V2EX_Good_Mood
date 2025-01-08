const politicalKeywords = [
  '华',
  '润',
  '政治',
  '选举',
  '党派',
  '政党',
  '政府',
  '民主',
  '政客',
  '反腐',
  '伊朗',
  '自研',
  '戾气',
  '法律',
  '道德',
  '独醒',
  '晶哥',
  '老中',
  '女权',
  '立法',
  '台独',
  '数落',
  '牛马',
  '刀乐',
  '年味',
  '国产',
  '炒作',
  'xhs',
  'GFW',
  '二极管',
  '小红书',
  '走亲戚',
  '如何评价',
  '言论自由',
  '责任约束',
  '独立思考',
  '乌合之众',
  '原生家庭',
  '网络审查',
  '极端主义',
  '政治正确',
  '言论审查',
  '亲友来往',
  '众人皆醉我独醒',
];

function createPoliticalKeywordsRegex(keywords) {
  const regexString = keywords
    .map((keyword) => escapeRegExp(keyword))
    .join('|');
  return new RegExp(regexString, 'i');
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
}

const politicalKeywordsRegex = createPoliticalKeywordsRegex(politicalKeywords);

const exclusionList = [
  'Wrapper',
  'Main',
  'content',
  'container',
  'box',
  'no-hide',
  'some-id',
  'header',
  'footer',
  'TopicsNode',
  'Rightbar'
];

const allElements = document.querySelectorAll('body *');

allElements.forEach((element) => {
  if (isExcluded(element)) {
    return;
  }

  let elementText = element.innerText || element.textContent;

  if (politicalKeywordsRegex.test(elementText)) {
    element.classList.add('hidden-content');
    addHoverEffect(element);
  }
});

function isExcluded(element) {
  const exclusionListLower = exclusionList.map((item) => item.toLowerCase());

  for (let exclusion of exclusionListLower) {
    if (
      Array.from(element.classList)
        .map((cls) => cls.toLowerCase())
        .includes(exclusion) ||
      (element.id && element.id.toLowerCase() === exclusion)
    ) {
      return true;
    }
  }
  return false;
}

const style = document.createElement('style');
style.innerHTML = `
  .hidden-content {
    color: transparent !important; 
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5); 
    cursor: help;
    user-select: none; 
  }
`;
document.head.appendChild(style);

function addHoverEffect(element) {
  let timeoutId = null;

  const onMouseEnter = () => {
    timeoutId = setTimeout(() => {
      element.classList.remove('hidden-content');
    }, 2000);
  };

  const onMouseLeave = () => {
    clearTimeout(timeoutId);
    element.classList.add('hidden-content');
  };

  element.addEventListener('mouseenter', onMouseEnter);
  element.addEventListener('mouseleave', onMouseLeave);

  const observer = new MutationObserver(() => {
    if (!document.body.contains(element)) {
      element.removeEventListener('mouseenter', onMouseEnter);
      element.removeEventListener('mouseleave', onMouseLeave);
      clearTimeout(timeoutId);
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true, 
  });
}
