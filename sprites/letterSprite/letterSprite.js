const letterSprite = {
  name:"letter",
  size: {width: 150, height: 250},
  animationTypes: ['IDLELETTER1', 'IDLELETTER2', 'IDLELETTER3', 'SPINLETTER1', 'SPINLETTER2', 'SPINLETTER3', 'STOPLETTER1', 'STOPLETTER2', 'STOPLETTER3'],
  frames: [
    require('./a.png'), //0
    require('./b.png'), //1
    require('./c.png'), //2
    require('./d.png'), //3
    require('./e.png'), //4
    require('./f.png'), //5
    require('./g.png'), //6
    require('./h.png'), //7
    require('./i.png'), //8
    require('./j.png'), //9
    require('./k.png'), //10
    require('./l.png'), //11
    require('./m.png'), //12
    require('./n.png'), //13
    require('./o.png'), //14
    require('./p.png'), //15
    require('./q.png'), //16
    require('./r.png'), //17
    require('./s.png'), //18
    require('./t.png'), //19
    require('./u.png'), //20
    require('./v.png'), //21
    require('./w.png'), //22
    require('./x.png'), //23
    require('./y.png'), //24
    require('./z.png')  //25
  ],
  animationIndex: function getAnimationIndex (animationType) {
    const alphabetList = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    const consonants =  [1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25];
    const vowels = [0,4,8,14,20];

    var nw = require('../../index.android.js');
    var letter1 = nw.letter1;
    var letter2 = nw.letter2;
    var letter3 = nw.letter3;
    var wheelLetters1 = nw.wheelLetters1;
    var wheelLetters2 = nw.wheelLetters2;
    var wheelLetters3 = nw.wheelLetters3;
    var wheel1 = [];
    var wheel2 = [];
    var wheel3 = [];

    function getWheelLetters(wheelNumber) {
      var wheelLength = (eval("wheelLetters" + 1)).length;
      for (i=0; i<wheelLength; i++) {
        (eval('wheel'+ 1)).push(alphabetList.indexOf((eval("wheelLetters" + 1))[i]));
      }
      return eval('wheel' + 1);
    }

    switch (animationType) {
      case 'IDLELETTER1':
        return [2];
      case 'IDLELETTER2':
        return [0];
      case 'IDLELETTER3':
        return [25];
      case 'SPINLETTER1':
        //return [2,7,16];
        //return getWheelLetters(1);
        return consonants.sort(function(a,b){return 0.5 - Math.random()});
      case 'SPINLETTER2':
        //return [0,4];
        return vowels;
        //return getWheelLetters(2);
        ///return wheel2;
      case 'SPINLETTER3':
        //return [2,13,19,20,25];
        //return getWheelLetters(3);
        return consonants.sort(function(a,b){return 0.5 - Math.random()});
      case 'STOPLETTER1':
        //return [c1];
        return [alphabetList.indexOf(letter1)];
      case 'STOPLETTER2':
        //return [v];
        return [alphabetList.indexOf(letter2)];
      case 'STOPLETTER3':
        //return [c2];
        return [alphabetList.indexOf(letter3)];
    }
  },
};

export default letterSprite;
