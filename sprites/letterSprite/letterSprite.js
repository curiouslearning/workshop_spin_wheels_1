const letterSprite = {
  name:"letter",
  size: {width: 150, height: 250},
  animationTypes: ['IDLECONSONANT1', 'IDLEVOWEL', 'IDLECONSONANT2', 'SPINCONSONANT1', 'SPINVOWEL', 'SPINCONSONANT2'],
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

    switch (animationType) {
      case 'IDLECONSONANT1':
        return [2];
      case 'IDLEVOWEL':
        return [0];
      case 'IDLECONSONANT2':
        return [25];
      case 'SPINCONSONANT1':
        return [2,7,16];
      case 'SPINVOWEL':
        return [0,4];
      case 'SPINCONSONANT2':
        return [2,13,19,20,25];
      case 'STOPCONSONANT1':
        var nw = require('../../index.android.js');
        var consonant1 = nw.consonant1;
        return [alphabetList.indexOf(consonant1)];
      case 'STOPVOWEL':
        var nw = require('../../index.android.js');
        var vowel = nw.vowel;
        return [alphabetList.indexOf(vowel)];
      case 'STOPCONSONANT2':
        var nw = require('../../index.android.js');
        var consonant2 = nw.consonant2;
        return [alphabetList.indexOf(consonant2)];
    }
  },
};

export default letterSprite;
