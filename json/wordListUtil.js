import spinWheelsJson from './spin_wheels';

function selectWordList(wordListLevel) {
  var targetWordList = spinWheelsJson[wordListLevel].word_list;
  var wheelLetters1 = spinWheelsJson[wordListLevel].spinners[0].spinner1.letter_list;
  var wheelLetters2 = spinWheelsJson[wordListLevel].spinners[1].spinner2.letter_list;
  var wheelLetters3 = spinWheelsJson[wordListLevel].spinners[2].spinner3.letter_list;

  exports.wheelLetters1 = wheelLetters1;
  exports.wheelLetters2 = wheelLetters2;
  exports.wheelLetters3 = wheelLetters3;

  return targetWordList;
}

function getJsonLength() {
    return spinWheelsJson.length;
}

export default {
  selectWordList,
  getJsonLength,
};
