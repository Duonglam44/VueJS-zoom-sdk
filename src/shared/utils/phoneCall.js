function replacePhraseList(str, phraseList) {
  const newStr = str.split('、').join('').split('。').join('');

  const dict = phraseList.find((v) => newStr.match(new RegExp(v.from, 'g')));
  if (dict === undefined) {
    return str;
  }

  return newStr.replace(new RegExp(dict.from, 'g'), dict.to);
}

export { replacePhraseList };
