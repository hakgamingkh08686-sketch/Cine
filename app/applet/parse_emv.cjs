function parseEMV(str) {
  let index = 0;
  const result = [];
  while (index < str.length) {
    if (index + 4 > str.length) break;
    const tag = str.slice(index, index + 2);
    const length = parseInt(str.slice(index + 2, index + 4), 10);
    index += 4;
    if (isNaN(length)) {
      console.log(`Failed to parse length at index ${index - 2}`);
      break;
    }
    const value = str.slice(index, index + length);
    index += length;
    result.push({ tag, length, value });
  }
  return result;
}

const original = '00020101021230360016A000000677010111011301546621053038405802KH63041F8B';
console.log('Original Parsing:');
const parsed = parseEMV(original);
parsed.forEach(item => {
  console.log(`Tag: ${item.tag}, Length: ${item.length}, Value: ${item.value}`);
  if (item.tag === '30') {
    console.log('  Sub-parsing Tag 30:');
    const sub = parseEMV(item.value);
    sub.forEach(subItem => {
      console.log(`  Tag: ${subItem.tag}, Length: ${subItem.length}, Value: ${subItem.value}`);
    });
  }
});
