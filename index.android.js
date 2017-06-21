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
  Animated,
  Easing,
  Alert,
  PixelRatio,
} from 'react-native';

import resolveAssetSource from 'resolveAssetSource';
import TimerMixin from 'react-timer-mixin';
import sample from 'lodash.sample';
import _ from 'lodash';
import randomstring from 'random-string';
import AnimatedSprite from 'react-native-animated-sprite';
import AnimatedSpriteMatrix from 'rn-animated-sprite-matrix';
import Sound from 'react-native-sound';
import letterSprite from './sprites/letterSprite/letterSprite';
import wordListUtil from './json/wordListUtil';
import WordImages from './js/WordImages';
import styles from './style/styles';

const baseWidth = 1024;
const baseHeight = 768;
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const screenWidthScale = screenWidth/baseWidth;
const screenHeightScale = screenHeight/baseHeight;
const alphabetList = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const inactivityTimeOut = 12000;

export default class workshop_spin_wheels_1 extends Component {

  constructor(props) {
    super(props)
    this.state = {
      cells: [],
      imageOpacity: 0.3,                          // clear image of word
      buttonImageC1Opacity: 0,                    // arrow buttons of column 1 are grayed out (opacity originally at 0.3)
      buttonImageC2Opacity: 0,                    // arrow buttons of column 2 are grayed out (opacity originally at 0.3)
      buttonImageC3Opacity: 0,                    // arrow buttons of column 3 are grayed out (opacity originally at 0.3)
      buttonDisabled: true,                       // arrow and image buttons are touch-disabled
      spinButtonDisabled: false,                  // spin button is active
      spinButtonBackgroundColor: 'royalblue',     // background color of the spin button
      spinButtonTextOpacity: 1,                   // Opacity of the text in the spin button
      animatedMatrixPointerEvents: 'none',        // wheels are touch-disabled
      percentCompleteGoal: 50,                    // Percent complete before advancing to next word list
      animatedSpriteMatrixOpacity: 1,             // Opacity of the wheels
      containerLeftDimensions: undefined,         // Dimensions of the left container; to be set later after rendering
      imageWidth: 450,                            // Width of image file
      imageHeight: 480,                           // Height of image file
    }

    this.activeCells = [true, true, true];
    this.animationKeys = ['IDLELETTER1', 'IDLELETTER2', 'IDLELETTER3'];
    this.loopAnimation = _.fill(Array(this.activeCells.length), false);
    this.sprites = _.fill(Array(this.activeCells.length), letterSprite);
    this.scale = { image: 1 };
    this.numColumns = 3;
    this.numRows = 1;
    this.wheelsSound = new Sound('bubble_machine.mp3', Sound.MAIN_BUNDLE);
    this.cannotSpinSound = new Sound('boink.wav', Sound.MAIN_BUNDLE);
    this.wellDoneSound = new Sound('welldone.wav', Sound.MAIN_BUNDLE);
    this.arrowClickSound = new Sound('lever_switch.mp3', Sound.MAIN_BUNDLE);
    this.whoosh = new Sound('machine_reverse.mp3', Sound.MAIN_BUNDLE);
    this.spinValue = new Animated.Value(1);           // for text on spin button animation during inactivity
    this.arrowSpringValue = new Animated.Value(1);    // for arrow buttons animation during inactivity
    this.targetWord = 'unknown';                      // set initial target word to unknown.jpg
    this.wordsCompleted = 0;                          // for tracking number of words formed from word list
    this.wordsShown = [];                             // for tracking what words were formed by wheels
    this.wordListLevel = 0;                           // word list level from JSON; start with level 0
    this.timeoutId = '';                              // id of timeout used in stopIndividualWheels & clearTimeSound functions
    this.containerLeftWidth = screenWidth/2;          // temporarily set the width of left container to half of screen width
    this.letter1 = '';                                // first letter of target word
    this.letter2 = '';                                // second letter of target word
    this.letter3 = '';                                // third letter of target word

    // Checking pixel ratio of device to determine the scale of cell sprite
    if (PixelRatio.get() <= 2) {
      this.cellSpriteScale = 1;
    } else {
      this.cellSpriteScale = 0.52;
    }

    // get word list from JSON file via the selectWordList function in wordListUtil.js
    this.targetWordList = wordListUtil.selectWordList(this.wordListLevel);

    let targetSound;        // the sound file of the target word

    console.log("screenWidth: " + screenWidth);
    console.log("screenHeight: " + screenHeight);
    console.log("pixelRatio: " + PixelRatio.get());
  }

  componentWillMount() {
      this.setState({cells: this.createCellObjsArray()});
      this.setState( () => this.startInactivityMonitorNoArrows());
  }

  componentDidMount() {
    this.setImageWidthHeight();
  }

  componentWillUnmount() {
    TimerMixin.clearInterval(this.intervalGetUser);
    TimerMixin.clearInterval(this.intervalGetUser2);
    this.wellDoneSound.release();
    this.wheelsSound.release();
    this.cannotSpinSound.release();
    this.arrowClickSound.release();
    this.whoosh.release();
  }

  createCellObjsArray() {
    const cells = _.map(this.activeCells , (active, index) => ({
      sprite: this.sprites[index],
      animationKey: this.animationKeys[index],
      loopAnimation: this.loopAnimation[index],
      uid: randomstring({ length: 7 }),
      active,
    }));
    return cells;
  }

  matrixLocation() {
    const size = letterSprite.size;
    const width = this.numColumns * size.width * this.cellSpriteScale;
    const height = this.numRows * size.height * this.cellSpriteScale;
    const top = 0.1 * screenHeight/5;
    const left = (this.containerLeftWidth/2) - (width/2);
    const location = { top, left };
    return location;
  }

  matrixSize() {
    const size = letterSprite.size;
    const width = this.numColumns * size.width * this.cellSpriteScale;
    const height = this.numRows * size.height * this.cellSpriteScale;
    return { width, height };
  }

  /**
  * Function to set width and height of image of word
  * This is to allow app to respond to different tablet and phone sizes
  */
  setImageWidthHeight() {
    // Get the dimension of the next image file
    let source = resolveAssetSource(WordImages[this.targetWord]);

    // Check if image needs to be resized based on device width
    if (screenWidthScale > 1) {
      this.setState({
        imageWidth: source.width,
        imageHeight: source.height
      });
    } else if (screenWidthScale === 1) {
      this.setState({
        imageWidth: source.width * 0.95,
        imageHeight: source.height * 0.95
      });
    } else if (screenWidthScale < 1) {
      this.setState({
        imageWidth: source.width * 0.53,
        imageHeight: source.height * 0.53
      });
    }
  }

  /**
  * Function called by Spin Button to spin the wheels
  * A word from the target word list will be selected
  * via the nextWord() function
  */
  cellPressed(cellObj, position) {
    /**
    * Check if spinButtonBackgroundColor is gray (when wheels are spinning)
    * If yes, play the 'cannotSpinSound' sound
    * If no, proceed with spinning the wheels
    */
    if (this.state.spinButtonBackgroundColor === 'gray') {
      this.cannotSpinSound.setVolume(0.10);
      this.cannotSpinSound.play();
    } else {
      const cells = _.cloneDeep(this.state.cells);

      // Set states for images and buttons after the spin button is pressed
      this.onSpinButtonPressSetState();

      // Get the next word to display in wheels via the nextWord function
      this.nextWord();

      // Play the wheels spinning sound
      this.wheelsSound.play();

      // Start spinning the wheels
      cells[0].animationKey = 'SPINLETTER1';
      cells[1].animationKey = 'SPINLETTER2';
      cells[2].animationKey = 'SPINLETTER3';
      cells[0].loopAnimation = true;
      cells[0].uid = randomstring({ length: 7 });
      cells[1].loopAnimation = true;
      cells[1].uid = randomstring({ length: 7 });
      cells[2].loopAnimation = true;
      cells[2].uid = randomstring({ length: 7 });
      this.setState({ cells });

      // Call stopWheels function to stop all 3 wheels together
      this.stopWheels();
    }
  }

  // Randomly select a word from the target word list
  nextWord() {
    this.targetWord = this.targetWordList[Math.floor(Math.random() * this.targetWordList.length)];

    // Split the target word into individual letters
    let targetWordArray = this.targetWord.split("");
    this.letter1 = targetWordArray[0];
    this.letter2 = targetWordArray[1];
    this.letter3 = targetWordArray[2];

    // Filename of sound file of target word
    targetSound = this.targetWord + '.wav';

    // Export individual letters; to be used in letterSprite.js
    exports.letter1 = this.letter1;
    exports.letter2 = this.letter2;
    exports.letter3 = this.letter3;
  }

  /**
  * This function is called to stop the wheels from spinning
  * The word created by the wheels will be checked against the
  * target word list via the checkWord function
  */
  stopWheels() {
    const cells = _.cloneDeep(this.state.cells);
    this.setState({ buttonDisabled: true });          //disable all arrow and image buttons

    // Stop the wheels from spinning
    let timeoutId = TimerMixin.setTimeout( () => {
      cells[0].animationKey = 'STOPLETTER1';
      cells[1].animationKey = 'STOPLETTER2';
      cells[2].animationKey = 'STOPLETTER3';
      cells[0].loopAnimation = true;
      cells[0].uid = randomstring({ length: 7 });
      cells[1].loopAnimation = true;
      cells[1].uid = randomstring({ length: 7 });
      cells[2].loopAnimation = true;
      cells[2].uid = randomstring({ length: 7 });
      this.setState({cells});

      // Stop and release the wheel spinning and cannotSpinSound sounds
      this.wheelsSound.stop( () => {
        this.wheelsSound.release();
      });
      this.cannotSpinSound.stop( () => {
        this.cannotSpinSound.release();
      });

      // Start showing the arrow buttons column by column
      // this.showArrowButtons();

      // Call checkWord function to check the word formed by the wheels
      this.checkWord(this.letter1, this.letter2, this.letter3);

      this.startInactivityMonitorWithArrows();
    }, 2500);
  }

  /**
  * Function to stop the wheels individually. This function
  * is called by the Up and Down arrows. The word created by the
  * three wheels will be checked against the target word list via
  * the checkWord function
  */
  stopIndividualWheels(wheelNumber) {
    const cells = _.cloneDeep(this.state.cells);

    // Stop the individual wheel
    cells[wheelNumber - 1].animationKey = 'STOPLETTER' + wheelNumber;
    cells[wheelNumber - 1].loopAnimation = true;
    cells[wheelNumber - 1].uid = randomstring({ length: 7 });
    this.setState({ cells });

    // Check if word formed is in current target word list
    this.checkWord(this.letter1, this.letter2, this.letter3);

    // Spin the text in spin button after 12 seconds of inactivity
    this.timeoutId = TimerMixin.setTimeout( () => {
      this.startInactivityMonitorWithArrows();
    }, 2500);

    console.log('stopIndWheels (this.letter1): ' + this.letter1);
    console.log('stopIndWheels (this.letter2): ' + this.letter2);
    console.log('stopIndWheels (this.letter3): ' + this.letter3);
    console.log('wordListLevel: ' + this.wordListLevel);
  }

  /**
  * Function to check if the word created by the wheels are in the
  * target word list. If yes, the image will show and the audio will play
  */
  checkWord(l1, l2, l3) {
    let newWord = l1 + l2 + l3;

    // Check if word formed by wheels is in target word list
    let newWordInList = (this.targetWordList.indexOf(newWord) > -1);
    console.log('New Word: ' + newWord);
    console.log('Is word in List: ' + newWordInList);

    if (newWordInList === true) {
      /**
      * Check to see if spin button or arrow button was pressed.
      * 'gray' means spin button was pressed and so need to
      * set stop wheel states; otherwise, nothing needs to be
      * done as UI is in stop wheel states already
      */
      if (this.state.spinButtonBackgroundColor === 'gray') {
        this.onStopWheelsSetState();
      }

      this.targetWord = newWord;
      targetSound = newWord + '.wav';

      // Call function to set width and height of image of word
      this.setImageWidthHeight();

      // Play the audio file of the word
      this.onSpinButtonPress();

      // Check if the word was not shown before
      if ((this.wordsShown.indexOf(newWord) > -1) === false) {
        this.wordsShown.push(newWord);
        this.wordsCompleted = this.wordsCompleted + 1;

        // Check percent of word list shown; if >= 50% shown, advance to next level
        this.checkPercentComplete();
      }
    } else {
      // If word not in word list, shows an 'unknown' image
      this.targetWord = 'unknown';

      // Play the following file when user touched the wheels and 'unknown' image
      targetSound = 'machine_reverse.mp3';

      // Call function to set width and height of image of word
      this.setImageWidthHeight();

      this.setState({ imageOpacity: 1 });
    }
  }

  /**
  * Function to check percent of words completed from selected target word list
  * If >= 50% of word list formed, advance to next level of word list
  */
  checkPercentComplete() {
    let wordListLength = this.targetWordList.length;
    let percentCompleted = (this.wordsCompleted/wordListLength) * 100;

    console.log('Words completed: ' + this.wordsCompleted);
    console.log('Total words in list: ' + wordListLength);
    console.log('Percent completed: ' + percentCompleted);
    console.log('wordsShown[]: ' + this.wordsShown);

    /**
    * Checks if 50% of word list has been formed
    * If yes, word list is changed to the next level
    * Once the last level is reached, game will remain at that level
    */
    if (percentCompleted >= this.state.percentCompleteGoal) {
      // Get number of word list available in JSON file
      let jsonLength = wordListUtil.getJsonLength();

      if (this.wordListLevel < (jsonLength - 1)) {
        this.wordListLevel = this.wordListLevel + 1;
        console.log('wordlistlevel: ' + this.wordListLevel);

        // Announce going to next level
        TimerMixin.setTimeout( () => {
          this.showAdvancingNotice();
          this.wellDoneSound.play();
        }, 3500);

        // Stop and release audio resources
        TimerMixin.setTimeout( () => {
          this.wellDoneSound.stop( () => {
              this.wellDoneSound.release();
          });
        }, 10000);
      } else {
        //wordListLevel = 0;
        this.wordListLevel = jsonLength - 1;
        console.log('wordlistlevel: ' + this.wordListLevel);
      }

      // Reset wordsCompleted and wordShown; get new target word list
      this.wordsCompleted = 0;
      this.wordsShown = [];
      this.targetWordList = wordListUtil.selectWordList(this.wordListLevel);
    }
  }

  // Dialog box to indicate advancing to next level of word list
  showAdvancingNotice() {
    Alert.alert(
      'SPIN WHEELS GAME',
      'Well done! 50% of word list completed. Going to next level!',
      [
        {text: 'OK', onPress: (cellObj, position) => this.cellPressed(cellObj, 0)},
      ],
      { cancelable: false }
    )
  }

  // Set the state of buttons and images when the spin button is pressed
  onSpinButtonPressSetState() {
    this.setState({
      spinButtonDisabled: false,           // Enable the spinButton to play sound
      buttonDisabled: true,                // Disable arrow buttons and image
      buttonImageC1Opacity: 0,             // Gray out the arrow buttons (opacity originally at 0.3)
      buttonImageC2Opacity: 0,             // Gray out the arrow buttons (opacity originally at 0.3)
      buttonImageC3Opacity: 0,             // Gray out the arrow buttons (opacity originally at 0.3)
      spinButtonTextOpacity: 0.5,          // Gray out the text on spin button
      spinButtonBackgroundColor: 'gray',   // Gray out the background of spin button
      imageOpacity: 0,                     // Remove image of word
      animatedMatrixPointerEvents: 'none'  // Disable the wheels from touch
    });
  }

  // Set the state of buttons and images when the wheels stop spinning
  onStopWheelsSetState() {
    // Show the image of the word first
    let timeoutId = TimerMixin.setTimeout( () => {
      this.setState({ imageOpacity: 1 });
    }, 100);

    // Set the following states after 2.5 seconds to allow audio file to play completely
    let timeoutId2 = TimerMixin.setTimeout( () => {
      this.setState({
        buttonDisabled: false,                   // Enable the arrow buttons
        spinButtonDisabled: false,               // Enable the spin button
        spinButtonBackgroundColor: 'royalblue',
        spinButtonTextOpacity: 1,
        animatedMatrixPointerEvents: 'auto',     // Enable the wheels (touch-enabled)
        buttonImageC1Opacity: 1,                 // Show the arrow buttons fully
        buttonImageC2Opacity: 1,
        buttonImageC3Opacity: 1
      });
    }, 4000);
  }

  /**
  * Function to get letters in specific wheel, number of letters
  * in specific wheels, and index of current letter in wheesl
  * from JSON file via the wordListUtil.js file
  */
  getLettersInWheels(wheelNumber) {
    // Get set of letters for each wheel from JSON
    let wl = require('./json/wordListUtil.js');
    let wheelLetters1 = wl.wheelLetters1;
    let wheelLetters2 = wl.wheelLetters2;
    let wheelLetters3 = wl.wheelLetters3;

    // Return values as objects based on wheel number
    return [
      eval('wheelLetters' + wheelNumber),
      eval('wheelLetters' + wheelNumber).length,
      eval('wheelLetters' + wheelNumber).indexOf(this['letter'+ wheelNumber]),
    ];
  }

  /**
  * Function for the Down arrow buttons. This will spin the respective
  * wheel one alphabet down
  */
  onArrowClickDown(wheelNumber) {
    /**
    * Call this function to restart timer to monitor inactivity
    * Also to play sound to indicate the arrow button is touched
    * And stop audio if audio of word is played
    */
    this.clearTimeSound();

    // Get information for specific wheel
    let wheelData = this.getLettersInWheels(wheelNumber);
    let wheel = wheelData[0];
    let wheelLength = wheelData[1];
    let currentIndexInWheel = wheelData[2];

    if (currentIndexInWheel < (wheelLength - 1)) {
      this['letter' + wheelNumber] = wheel[currentIndexInWheel + 1];

      // export to letterSprite.js for use to stop animation
      exports['letter' + wheelNumber] = this['letter' + wheelNumber];
      this.stopIndividualWheels(wheelNumber);
    } else {
      this['letter' + wheelNumber] = wheel[0];

      // export to letterSprite.js for use to stop animation
      exports['letter' + wheelNumber] = this['letter' + wheelNumber];
      this.stopIndividualWheels(wheelNumber);
    }
  }

  /**
  * Function for the Down arrow buttons. This will spin the respective
  * wheel one alphabet up
  */
  onArrowClickUp(wheelNumber) {
    /**
    * Call this function to restart timer to monitor inactivity
    * Also to play sound to indicate the arrow button is touched
    * And stop audio if audio of word is played
    */
    this.clearTimeSound();

    // Get information for specific wheel
    let wheelData = this.getLettersInWheels(wheelNumber);
    let wheel = wheelData[0];
    let wheelLength = wheelData[1];
    let currentIndexInWheel = wheelData[2];

    if (currentIndexInWheel > 0) {
      this['letter' + wheelNumber] = wheel[currentIndexInWheel - 1];

      // export to letterSprite.js for use to stop animation
      exports['letter' + wheelNumber] = this['letter' + wheelNumber];
      this.stopIndividualWheels(wheelNumber);
    } else {
      this['letter' + wheelNumber] = wheel[wheelLength - 1];

      // export to letterSprite.js for use to stop animation
      exports['letter' + wheelNumber] = this['letter' + wheelNumber];
      this.stopIndividualWheels(wheelNumber);
    }
  }

  /**
  * Call this function to restart timer to monitor inactivity
  * Also to play sound to indicate the arrow button is touched
  * And stop audio if audio of word is played
  * Function is used after every arrow button is touched
  */
  clearTimeSound() {
    // Restart timer for monitoring inactivity
    TimerMixin.clearTimeout(this.timeoutId);

    // Play sound to indicate that arrow is touched
    this.arrowClickSound.play();

    // If audio of word is being played, stop audio and release resource
    this.whoosh.stop();
    this.whoosh.release();
  }

  // Function to spin the text in spin button at every 12 second interval
  startInactivityMonitorNoArrows() {
    this.intervalGetUser = TimerMixin.setInterval ( () => {
      this.spinButtonText();
    }, inactivityTimeOut);
  }

  /**
  * Function to spin the text in spin button at every 12 second interval
  * and spring the arrow buttons
  */
  startInactivityMonitorWithArrows() {
    this.intervalGetUser2 = TimerMixin.setInterval ( () => {
      this.spinButtonText();
      this.springArrows();
    }, inactivityTimeOut);
  }

  /**
  * Function to show (but still slightly gray out) the Up/Down arrows
  * column by column. Currently un-used
  */
  /*
  showArrowButtons() {
    let timeoutId = TimerMixin.setTimeout ( () => {
      this.setState({ buttonImageC1Opacity: 0.7 });
    }, 500);

    let timeoutId2 = TimerMixin.setTimeout ( () => {
      this.setState({ buttonImageC2Opacity: 0.7 });
    }, 1000);

    let timeoutId3 = TimerMixin.setTimeout ( () => {
      this.setState({ buttonImageC3Opacity: 0.7 });
    }, 1500);
  }
  */

  // Function to play an audio of the word formed by the wheels
  onSpinButtonPress() {
    // Stop and release previous sound
    this.whoosh.stop();
    this.whoosh.release();

    // Load the sound file variable, targetSound
    this.whoosh = new Sound(targetSound, Sound.MAIN_BUNDLE, (error) => {
      console.log('targetSound: ' + targetSound);

      if (error) {
        console.log('Failed to load the sound', error);
        //return;
      } else {
        // loaded successfully
        this.whoosh.play((success) => {
          if (success) {
            this.whoosh.release();
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }
    });

    // Reduce the volume by half
    this.whoosh.setVolume(0.5);

    // Position the sound to the full right in a stereo field
    this.whoosh.setPan(1);

    // Loop indefinitely until stop() is called
    this.whoosh.setNumberOfLoops(-1);

    // Get properties of the player instance
    //console.log('volume: ' + whoosh.getVolume());
    //console.log('pan: ' + whoosh.getPan());
    //console.log('loops: ' + whoosh.getNumberOfLoops());

    // Seek to a specific point in seconds
    this.whoosh.setCurrentTime(2.5);

    // Get the current playback point in seconds
    this.whoosh.getCurrentTime((seconds) => console.log('at ' + seconds));

    // Pause the sound
    this.whoosh.pause();

    // Stop the sound and rewind to the beginning
    this.whoosh.stop(() => {
      // Note: If you want to play a sound after stopping and rewinding it,
      // it is important to call play() in a callback.
      this.whoosh.play();
    });

    // Release the audio player resource
    this.whoosh.release();
  }

  /**
  * Function to measure the width of the left container
  * This function is called by View holding the AnimatedSpriteMatrix
  * Width value is needed to help set the location of wheels
  * This is done so that app can be used in tablets and phones
  */
  onLayout = event => {
    if (this.state.containerLeftDimensions)
      return;
    let {width, height} = event.nativeEvent.layout;
    this.setState({ containerLeftDimensions: { width, height } });
    this.containerLeftWidth = width;
  }

  // Animation to spin the text in the spin button
  spinButtonText() {
    this.spinValue.setValue(0);
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 3000,
        easing: Easing.elastic(4),
      }
    ).start();
  }

  // Animation to spin the arrow buttons
  springArrows() {
    this.arrowSpringValue.setValue(0.3);
    Animated.spring(
      this.arrowSpringValue,
      {
        toValue: 1,
        friction: 1,
        tension: 2
      }
    ).start();
  }

  render() {
    // Save the width and height of left container
    if (this.state.containerLeftDimensions) {
      let { containerLeftDimensions } = this.state
      let { width, height } = containerLeftDimensions
      console.log('containerLeft Width: ' + width);
      console.log('containerLeft Height: ' + height);
    }

    // Variables used in the spin animation of the spin button text
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    return (
      <View style={ styles.container }>
        <View style={ styles.containerLeft }>
          <View style={ styles.componentsContainer }>

            <View style={ styles.upArrowsRow }>

              <TouchableOpacity
                disabled={ this.state.buttonDisabled }
                onPress={ () => this.onArrowClickUp(1) }
                >

                <Animated.Image
                  style={
                    [styles.imageArrowUpHolder,
                      { opacity: this.state.buttonImageC1Opacity },
                      {
                        transform: [
                          { scale: this.arrowSpringValue }
                        ]
                      }
                    ]
                  }
                  source={ require('./images/yellow_border_up.png') }
                />

              </TouchableOpacity>

              <TouchableOpacity
                disabled={ this.state.buttonDisabled }
                onPress={ () => this.onArrowClickUp(2) }
                >

                <Animated.Image
                  style={
                    [styles.imageArrowUpHolder,
                      { opacity: this.state.buttonImageC2Opacity },
                      {
                        transform: [
                          { scale: this.arrowSpringValue }
                        ]
                      }
                    ]
                  }
                  source={ require('./images/yellow_border_up.png') }
                />

              </TouchableOpacity>

              <TouchableOpacity
                disabled={ this.state.buttonDisabled }
                onPress={ () => this.onArrowClickUp(3) }
                >

                <Animated.Image
                  style={
                    [styles.imageArrowUpHolder,
                      { opacity: this.state.buttonImageC3Opacity },
                      {
                        transform: [
                          { scale: this.arrowSpringValue }
                        ]
                      }
                    ]
                  }
                  source={ require('./images/yellow_border_up.png') }
                />

              </TouchableOpacity>

            </View>

            <View style={ styles.wheelsRow }
              pointerEvents={ this.state.animatedMatrixPointerEvents }
              onLayout={ this.onLayout }>

              <AnimatedSpriteMatrix
                styles={{
                    ...(this.matrixLocation()),
                    ...(this.matrixSize()),
                    position: 'absolute',
                    opacity: this.state.animatedSpriteMatrixOpacity,
                  }}
                dimensions={ { columns: this.numColumns, rows: this.numRows } }
                cellSpriteScale={ this.cellSpriteScale }
                cellObjs={ this.state.cells }
                scale={ this.scale }
                onPress={ () => this.onSpinButtonPress() }
                onPressIn={ () => this.setState({ animatedSpriteMatrixOpacity: 0.3 }) }
                onPressOut={ () => this.setState({ animatedSpriteMatrixOpacity: 1 }) }
              />

            </View>

            <View style={ styles.downArrowsRow }>

              <TouchableOpacity
                disabled={ this.state.buttonDisabled }
                onPress={ () => this.onArrowClickDown(1) }
                >

                <Animated.Image
                  style={
                    [styles.imageArrowDownHolder,
                      { opacity: this.state.buttonImageC1Opacity },
                      {
                        transform: [
                          { scale: this.arrowSpringValue }
                        ]
                      }
                    ]
                  }
                  source={ require('./images/yellow_border_down.png') }
                />

              </TouchableOpacity>

              <TouchableOpacity
                disabled={ this.state.buttonDisabled }
                onPress={ () => this.onArrowClickDown(2) }
                >

                <Animated.Image
                  style={
                    [styles.imageArrowDownHolder,
                      { opacity: this.state.buttonImageC2Opacity },
                      {
                        transform: [
                          { scale: this.arrowSpringValue }
                        ]
                      }
                    ]
                  }
                  source={ require('./images/yellow_border_down.png') }
                />

              </TouchableOpacity>

              <TouchableOpacity
                style={ styles.imageContainer }
                disabled={ this.state.buttonDisabled }
                onPress={ () => this.onArrowClickDown(3) }
                >

                <Animated.Image
                  style={
                    [styles.imageArrowDownHolder,
                      { opacity: this.state.buttonImageC3Opacity },
                      {
                        transform: [
                          { scale: this.arrowSpringValue }
                        ]
                      }
                    ]
                  }
                  source={ require('./images/yellow_border_down.png') }
                />

              </TouchableOpacity>

            </View>

            <View style={ styles.spinButtonRow }>

              <TouchableOpacity
                disabled={ this.state.spinButtonDisabled }
                style={
                  [styles.spinButton,
                    { backgroundColor: this.state.spinButtonBackgroundColor }
                  ]
                }
                onPress={ (cellObj, position) => this.cellPressed(cellObj, 0) }
                >

                <Animated.Text style={ [styles.spinButtonText,
                  {
                    transform: [
                      { rotate: spin }
                    ]
                  }
                ]}>SPIN</Animated.Text>

              </TouchableOpacity>

            </View>

          </View>

        </View>

        <View style={ styles.containerRight }>

          <TouchableOpacity
            disabled={ this.state.buttonDisabled }
            onPress={ () => this.onSpinButtonPress() }
            >
            <Image
              style={
                [styles.image,
                  { opacity: this.state.imageOpacity },
                  { width: this.state.imageWidth },
                  { height: this.state.imageHeight }
                ]
              }
              source={ WordImages[this.targetWord] }
            />
          </TouchableOpacity>

        </View>

      </View>
    );
  }
}

AppRegistry.registerComponent('workshop_spin_wheels_1', () => workshop_spin_wheels_1);
