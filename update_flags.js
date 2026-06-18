const fs = require('fs');

const file = fs.readFileSync('data/languages.ts', 'utf8');

const updated = file.replace(/flag:\s*'([^']{4})'/g, (match, emoji) => {
  if (emoji === '🌐') return `flag: 'https://flagcdn.com/w80/un.png'`;
  const codePoints = Array.from(emoji).map(c => c.codePointAt(0));
  if (codePoints.length >= 2 && codePoints[0] >= 0x1F1E6 && codePoints[0] <= 0x1F1FF) {
    const c1 = String.fromCodePoint(codePoints[0] - 0x1F1E6 + 97);
    const c2 = String.fromCodePoint(codePoints[1] - 0x1F1E6 + 97);
    const code = c1 + c2;
    return `flag: 'https://flagcdn.com/w80/${code}.png'`;
  }
  return match;
});

fs.writeFileSync('data/languages.ts', updated);
console.log('Updated flags in data/languages.ts');
