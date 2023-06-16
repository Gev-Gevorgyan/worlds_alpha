const { normalizeWord } = require("./norm");

function testWords(words) {
  const normalizedWordsArray = new Array(words.length);
  let index = 0;
  for (let w of words) {
    normalizedWordsArray[index++] = normalizeWord(w);
  }
  return normalizedWordsArray;
}

module.exports = { testWords };
