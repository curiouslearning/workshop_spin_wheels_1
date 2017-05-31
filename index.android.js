/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import TimerMixin from 'react-timer-mixin';
import sample from 'lodash.sample';
import _ from 'lodash';
import randomstring from 'random-string';
import AnimatedSprite from 'react-native-animated-sprite';
import AnimatedSpriteMatrix from 'rn-animated-sprite-matrix';
import Sound from 'react-native-sound';
import letterSprite from './sprites/letterSprite/letterSprite';
import spinWheelsJson from './spin_wheels';

//var Sound = require('react-native-sound');

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const alphabetList = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

const wordImages = {
  'can': require('./images/can.jpg'),
  'cat': require('./images/cat.jpg'),
  'hat': require('./images/hat.jpg'),
  'hen': require('./images/hen.jpg'),
}

const wordSounds = {
  'can': require('./audio/can.wav'),
  'cat': require('./audio/cat.wav'),
  'hat': require('./audio/hat.wav'),
  'hen': require('./audio/hen.wav'),
}

var targetWordList = ["cat", "can", "hat", "hen"];
var wordList = ["cat", "hen"];

var wheelLetters1 = [];
var wheelLetters2 = [];
var wheelLetters3 = [];

var targetImage;
var targetWord;
var targetSound;

//var consonant1;
//var vowel;
//var consonant2;
var letter1;
var letter2;
var letter3;

export default class workshop_spin_wheels_1 extends Component {

  constructor(props) {
    super(props)
    this.state = {
      cells: [],
      imageOpacity: 0,
      buttonImageOpacity: 0.4,
      buttonDisabled: true,
      spinButtonDisabled: false,
      spinButtonBackgroundColor: 'royalblue',
      spinButtonTextOpacity: 1,
    }

    this.activeCells = [true, true, true];
    //this.animationKeys = ["IDLECONSONANT1", "IDLEVOWEL", "IDLECONSONANT2"];
    this.animationKeys = ["IDLELETTER1", "IDLELETTER2", "IDLELETTER3"];
    this.loopAnimation = _.fill(Array(this.activeCells.length), false);
    this.sprites = _.fill(Array(this.activeCells.length), letterSprite);
    this.scale = {image: 1};
    this.cellSpriteScale = 1;
    this.numColumns = 3;
    this.numRows = 1;

    this.splitWords();
    this.addConsonant();

    //exports.wheelLetters1;
    //exports.wheelLetters2;
    //exports.wheelLetters3;

  }

  componentWillMount () {
      this.setState({cells: this.createCellObjsArray()});
  }

  createCellObjsArray () {
    const cells = _.map(this.activeCells , (active, index) => ({
      sprite: this.sprites[index],
      animationKey: this.animationKeys[index],
      loopAnimation: this.loopAnimation[index],
      uid: randomstring({ length: 7 }),
      active,
    }));
    return cells;
  }

  matrixLocation () {
    const size = letterSprite.size;
    const width = this.numColumns * size.width * this.cellSpriteScale;
    const height = this.numRows * size.height * this.cellSpriteScale;
    const top = 22;
    const left = (screenWidth/4 * 1.06) - (width/2);
    const location = {top, left};
    return location;
  }

  matrixSize () {
    const size = letterSprite.size;
    const width = this.numColumns * size.width * this.cellSpriteScale;
    const height = this.numRows * size.height * this.cellSpriteScale;
    return {width, height};
  }

  cellPressed (cellObj, position) {
    const cells = _.cloneDeep(this.state.cells);

    this.setState({spinButtonDisabled: true});
    this.setState({buttonImageOpacity: 0.6});
    this.setState({spinButtonTextOpacity: 0.5});
    this.setState({spinButtonBackgroundColor: 'gray'});
    this.setState({imageOpacity: 0});
    this.nextWord();

    cells[0].animationKey = "SPINLETTER1";
    cells[1].animationKey = "SPINLETTER2";
    cells[2].animationKey = "SPINLETTER3";
    //cells[0].animationKey = "SPINCONSONANT1";
    //cells[1].animationKey = "SPINVOWEL";
    //cells[2].animationKey = "SPINCONSONANT2";

    //this.setState({imageOpacity: 0});
    //this.nextWord();

    cells[0].loopAnimation = true;
    cells[0].uid = randomstring({length: 7});
    cells[1].loopAnimation = true;
    cells[1].uid = randomstring({length: 7});
    cells[2].loopAnimation = true;
    cells[2].uid = randomstring({length: 7});

    this.setState({cells});
    this.stopWheels();

  }

  stopWheels() {
    const cells = _.cloneDeep(this.state.cells);
    this.setState({buttonDisabled: true});

    var intervalId = TimerMixin.setTimeout( () => {
      cells[0].animationKey = "STOPLETTER1";
      cells[1].animationKey = "STOPLETTER2";
      cells[2].animationKey = "STOPLETTER3";
      //cells[0].animationKey = "STOPCONSONANT1";
      //cells[1].animationKey = "STOPVOWEL";
      //cells[2].animationKey = "STOPCONSONANT2";

      cells[0].loopAnimation = true;
      cells[0].uid = randomstring({length: 7});
      cells[1].loopAnimation = true;
      cells[1].uid = randomstring({length: 7});
      cells[2].loopAnimation = true;
      cells[2].uid = randomstring({length: 7});

      this.setState({cells});
      this.onStopWheelsSetState();
    }, 2500);

  }

  onStopWheelsSetState() {
    var timeoutId = TimerMixin.setTimeout( () => {
      this.setState({imageOpacity: 1});
      this.setState({buttonImageOpacity: 1});
      this.setState({buttonDisabled: false});
      this.setState({spinButtonDisabled: false});
      this.setState({spinButtonBackgroundColor: 'royalblue'});
      this.setState({spinButtonTextOpacity: 1});
      this.onSpinButtonPress();
    }, 100);
  }

  stopIndividualWheels (wheelNumber) {
    const cells = _.cloneDeep(this.state.cells);

    cells[wheelNumber - 1].animationKey = "STOPLETTER" + wheelNumber;
    cells[wheelNumber - 1].loopAnimation = true;
    cells[wheelNumber - 1].uid = randomstring({length: 7});

    this.setState({cells});
    this.setState({imageOpacity: 0});
    this.checkWord(letter1, letter2, letter3);

  }

  // test function only
  getCurrentIndex (wheelNumber) {
    if (wheelNumber == 1) {
      letter1 = "";
      exports.letter1 = letter1;
      this.stopIndividualWheels(wheelNumber);
    } else if (wheelNumber == 2) {
      letter2 = "";
      exports.letter2 = letter2;
      this.stopIndividualWheels(wheelNumber);
    } else {
      letter3 = "";
      exports.letter3 = letter3;
      this.stopIndividualWheels(wheelNumber);
    }

  }

  onArrowClickDown (wheelNumber) {
    var wheel = eval("wheelLetters" + wheelNumber);
    var wheelLength = wheel.length;
    var currentIndexInWheel = wheel.indexOf(eval('letter'+ wheelNumber));

    console.log("CurrentIndex: " + currentIndexInWheel);
    console.log("WheelLength: " + wheelLength);
    console.log("WheelLength: " + (wheelLength-1));

    // if direction is down
    if (currentIndexInWheel < (wheelLength - 1)) {
      if (wheelNumber == 1) {
        letter1 = wheel[currentIndexInWheel + 1];
        exports.letter1 = letter1;
        this.stopIndividualWheels(wheelNumber);

      } else if (wheelNumber == 2) {
        letter2 = wheel[currentIndexInWheel + 1];
        exports.letter2 = letter2;
        this.stopIndividualWheels(wheelNumber);

      } else {
        letter3 = wheel[currentIndexInWheel + 1];
        exports.letter3 = letter3;
        this.stopIndividualWheels(wheelNumber);

      }

    } else {

      if (wheelNumber == 1) {
        letter1 = wheel[0];
        exports.letter1 = letter1;
        this.stopIndividualWheels(wheelNumber);

      } else if (wheelNumber == 2) {
        letter2 = wheel[0];
        exports.letter2 = letter2;
        this.stopIndividualWheels(wheelNumber);

      } else {
        letter3 = wheel[0];
        exports.letter3 = letter3;
        this.stopIndividualWheels(wheelNumber);

      }
    }

  }

  onArrowClickUp(wheelNumber) {
    var wheel = eval("wheelLetters" + wheelNumber);
    var wheelLength = wheel.length;
    var currentIndexInWheel = wheel.indexOf(eval('letter' + wheelNumber));

    // if direction is up
    if (currentIndexInWheel > 0) {
      if (wheelNumber == 1) {
        letter1 = wheel[currentIndexInWheel - 1];
        exports.letter1 = letter1;
        this.stopIndividualWheels(wheelNumber);

      } else if (wheelNumber == 2) {
        letter2 = wheel[currentIndexInWheel - 1];
        exports.letter2 = letter2;
        this.stopIndividualWheels(wheelNumber);

      } else {
        letter3 = wheel[currentIndexInWheel - 1];
        exports.letter3 = letter3;
        this.stopIndividualWheels(wheelNumber);

      }

    } else {
      if (wheelNumber == 1) {
        letter1 = wheel[wheelLength - 1];
        exports.letter1 = letter1;
        this.stopIndividualWheels(wheelNumber);

      } else if (wheelNumber == 2) {
        letter2 = wheel[wheelLength - 1];
        exports.letter2 = letter2;
        this.stopIndividualWheels(wheelNumber);

      } else {
        letter3 = wheel[wheelLength - 1];
        exports.letter3 = letter3;
        this.stopIndividualWheels(wheelNumber);

      }
    }
    //this.setState({buttonDisabled: true});

  }

  checkWord(l1, l2, l3) {
    var newWord = l1 + l2 + l3;
    var newWordInList = (targetWordList.indexOf(newWord) > -1);
    console.log("New Word: " + newWord);
    console.log("Is word in List: " + newWordInList);

    if (newWordInList == true) {
      targetWord = newWord;
      targetSound = targetWord + ".wav";
      this.setState({imageOpacity: 1});
      this.setState({buttonDisabled: false});
      this.onSpinButtonPress();
    }
  }

  nextWord() {
    targetWord = targetWordList[Math.floor(Math.random() * targetWordList.length)];
    var targetWordArray = targetWord.split("");

    letter1 = targetWordArray[0];
    letter2 = targetWordArray[1];
    letter3 = targetWordArray[2];

    targetImage = targetWord + ".jpg";
    targetSound = targetWord + ".wav";

    exports.letter1 = letter1;
    exports.letter2 = letter2;
    exports.letter3 = letter3;
  }


  splitWords(listofwords) {
    var wheelLettersH1 = [];
    var wheelLettersH2 = [];
    var wheelLettersH3 = [];

    for(i=0;i<targetWordList.length;i++) {
      var tempWordArray = [];
      tempWordArray = targetWordList[i].split("");
      for(j=0; j<tempWordArray.length; j++) {
        eval("wheelLettersH"+(j+1)).push(tempWordArray[j]);
        eval("wheelLettersH"+(j+1)).sort();
      }
    }
    //console.log("wheelLettersH1: " + wheelLettersH1);
    wheelLetters1 = [...new Set(wheelLettersH1)];
    wheelLetters2 = [...new Set(wheelLettersH2)];
    wheelLetters3 = [...new Set(wheelLettersH3)];
    //console.log("wheelLetters1: " + wheelLetters1);

  }


/*
  splitWords(listofwords) {
    for(i=0;i<wordList.length;i++) {
      var tempWordArray = [];
      tempWordArray = wordList[i].split("");
      for(j=0; j<tempWordArray.length; j++) {
        eval("wheelLetters"+(j+1)).push(tempWordArray[j]);
        eval("wheelLetters"+(j+1)).sort();
      }
    }
    console.log("wheelLetters1: " + wheelLetters1);
  }
*/

  addConsonant() {
    wheelLetters1.push("q");
    wheelLetters3.push("c","u","z");
    wheelLetters1.sort();
    wheelLetters3.sort();

    exports.wheelLetters1 = wheelLetters1;
    exports.wheelLetters2 = wheelLetters2;
    exports.wheelLetters3 = wheelLetters3;

  }

  onSpinButtonPress () {
    // Load the sound file 'whoosh.mp3' from the app bundle
    // See notes below about preloading sounds within initialization code below.

    //var whoosh = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
    //var whoosh = new Sound('pig.wav', Sound.MAIN_BUNDLE, (error) => {
    var whoosh = new Sound(targetSound, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      } else {
        // loaded successfully
        //console.log('Duration in seconds: ' + whoosh.getDuration() + 'Number of channels: ' + whoosh.getNumberOfChannels())
        whoosh.play((success) => {
          if (success) {
            whoosh.release();
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }

    });

    // Reduce the volume by half
    whoosh.setVolume(0.5);

    // Position the sound to the full right in a stereo field
    whoosh.setPan(1);

    // Loop indefinitely until stop() is called
    whoosh.setNumberOfLoops(-1);

    // Get properties of the player instance
    console.log('volume: ' + whoosh.getVolume());
    console.log('pan: ' + whoosh.getPan());
    console.log('loops: ' + whoosh.getNumberOfLoops());

    // Seek to a specific point in seconds
    whoosh.setCurrentTime(2.5);

    // Get the current playback point in seconds
    whoosh.getCurrentTime((seconds) => console.log('at ' + seconds));

    // Pause the sound
    whoosh.pause();

    // Stop the sound and rewind to the beginning
    whoosh.stop(() => {
      // Note: If you want to play a sound after stopping and rewinding it,
      // it is important to call play() in a callback.
      whoosh.play();
    });

    // Release the audio player resource
    whoosh.release();

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerLeft}>
          <View style={styles.componentsContainer}>

            <View style={styles.upArrowsRow}>

              <TouchableOpacity
                disabled={this.state.buttonDisabled}
                onPress={() => this.onArrowClickUp(1)}
                >
                <Image
                  style={[styles.imageArrowUpHolder, {opacity: this.state.buttonImageOpacity}]}
                  source={require('./images/yellow_border_up.png')}
                />

              </TouchableOpacity>

              <TouchableOpacity
                disabled={this.state.buttonDisabled}
                onPress={() => this.onArrowClickUp(2)}
                >
                <Image
                  style={[styles.imageArrowUpHolder, {opacity: this.state.buttonImageOpacity}]}
                  source={require('./images/yellow_border_up.png')}
                />

              </TouchableOpacity>

              <TouchableOpacity
                disabled={this.state.buttonDisabled}
                onPress={() => this.onArrowClickUp(3)}
                >
                <Image
                  style={[styles.imageArrowUpHolder, {opacity: this.state.buttonImageOpacity}]}
                  source={require('./images/yellow_border_up.png')}
                />
              </TouchableOpacity>

            </View>

            <View style={styles.wheelsRow}>

              <AnimatedSpriteMatrix
                styles={{
                    ...(this.matrixLocation()),
                    ...(this.matrixSize()),
                    position: 'absolute',
                  }}
                dimensions={{columns: this.numColumns, rows: this.numRows}}
                cellSpriteScale={this.cellSpriteScale}
                cellObjs={this.state.cells}
                scale={this.scale}
                ////onPress={(cellObj, position) => this.cellPressed(cellObj, position)}
              />

            </View>

            <View style={styles.downArrowsRow}>

              <TouchableOpacity
                disabled={this.state.buttonDisabled}
                onPress={() => this.onArrowClickDown(1)}
                >
                <Image
                  style={[styles.imageArrowDownHolder, {opacity: this.state.buttonImageOpacity}]}
                  source={require('./images/yellow_border_down.png')}
                />
              </TouchableOpacity>

              <TouchableOpacity
                disabled={this.state.buttonDisabled}
                onPress={() => this.onArrowClickDown(2)}
                >
                <Image
                  style={[styles.imageArrowDownHolder, {opacity: this.state.buttonImageOpacity}]}
                  source={require('./images/yellow_border_down.png')}
                />
              </TouchableOpacity>

              <TouchableOpacity
                disabled={this.state.buttonDisabled}
                onPress={() => this.onArrowClickDown(3)}
                >
                <Image
                  style={[styles.imageArrowDownHolder, {opacity: this.state.buttonImageOpacity}]}
                  source={require('./images/yellow_border_down.png')}
                />
              </TouchableOpacity>

            </View>

            <View style={styles.spinButtonRow}>

              <TouchableOpacity
                disabled={this.state.spinButtonDisabled}
                onPress={(cellObj, position) => this.cellPressed(cellObj, 0)}
                style={[styles.spinButton, {backgroundColor: this.state.spinButtonBackgroundColor}]}>

                <Text style={[styles.spinButtonText, {opacity: this.state.spinButtonTextOpacity}]}>SPIN</Text>

              </TouchableOpacity>

            </View>

          </View>

        </View>

        <View style={styles.containerRight}>

          <TouchableOpacity
            disabled={this.state.buttonDisabled}
            onPress={() => this.onSpinButtonPress()}
            >
            <Image
              style={[styles.image , {opacity: this.state.imageOpacity}]}
              source={wordImages[targetWord]}
            />
          </TouchableOpacity>

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
  },
  containerLeft: {
    flex: 1.5,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: 'grey',
    borderRightWidth: 2,
    height: '100%',
  },
  componentsContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    backgroundColor: 'lightblue',
  },
  upArrowsRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  downArrowsRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  wheelsRow: {
    flex: 2,
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 4,
  },
  wheel: {
    backgroundColor: 'lightgreen',
    marginLeft: 20,
    marginRight: 20,
    height: '100%',
    width: '25%',
    borderColor: 'black',
    borderWidth: 4,
    borderRadius: 15,
    justifyContent: 'center',
  },
  wheelFont: {
    flex: 1,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 260,
    textAlign: 'center',
    lineHeight: 220,
  },
  spinButtonRow: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinButton: {
    height: 100,
    width: '50%',
    backgroundColor: 'royalblue',
    borderColor: 'black',
    borderWidth: 4,
    borderRadius: 15,
  },
  spinButtonText: {
    fontWeight: 'bold',
    fontSize: 40,
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
  containerRight: {
    flex: 1,
    padding: 60,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
  image: {
    margin:50,
    borderColor: "black",
    borderWidth: 4,
    borderRadius: 15,
  },
  imageArrowUp: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 37,
    width: '20%',
    height: '70%',
  },
  imageArrowDown: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 37,
    marginRight: 37,
    width: '20%',
    height: '70%',
  },
  imageArrowUpHolder: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
    width: 150,
    height: '70%',
  },
  imageArrowDownHolder: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    width: 150,
    height: '70%',
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('workshop_spin_wheels_1', () => workshop_spin_wheels_1);
