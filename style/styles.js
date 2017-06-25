import React, { Component } from 'react';
import {
  StyleSheet,
  PixelRatio,
  Dimensions,
} from 'react-native';

const baseWidth = 1024;
const baseHeight = 768;
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const screenWidthScale = screenWidth/baseWidth;
const screenHeightScale = screenHeight/baseHeight;

let ARROW_MULTIPLIER = 0.15;          // scale of arrow buttons at baseWidth and baseHeight
let SPIN_BUTTON_TEXT_SIZE = 40;       // scale of text size on spin button at baseWidth and baseHeight
let SPIN_BUTTON_PADDING_TOP = 19;     // scale of paddingTop of text size on spin button at baseWidth and baseHeight

/**
* Using screenWidthScale (see const above) to determine size of arrow buttons
* This is largely for scaling the UI across phones and tablets
*/
if (screenWidthScale > 1) {
  ARROW_MULTIPLIER = 0.12;
  SPIN_BUTTON_TEXT_SIZE = 40;
} else if (screenWidthScale === 1) {
  ARROW_MULTIPLIER = 0.15;
  SPIN_BUTTON_TEXT_SIZE = 40;
} else {
  ARROW_MULTIPLIER = 0.12;
  SPIN_BUTTON_TEXT_SIZE = 18;
}

// Set arrow buttons size
let UP_ARROW_WIDTH = ARROW_MULTIPLIER * screenWidth;
let UP_ARROW_HEIGHT = ARROW_MULTIPLIER * screenHeight;
let DOWN_ARROW_WIDTH = ARROW_MULTIPLIER * screenWidth;
let DOWN_ARROW_HEIGHT = ARROW_MULTIPLIER * screenHeight;

/**
* Using PixelRatio to determine text size on spin button
* This is largely for scaling the UI across phones and tablets
*/

/*
if (PixelRatio.get() <= 2) {
  SPIN_BUTTON_TEXT_SIZE = 40;
} else {
  SPIN_BUTTON_TEXT_SIZE = 20;
}
*/

/**
* Using text size on spin button to determine padding top of spin button text
* This is largely for scaling the UI across phones and tablets
*/
if (SPIN_BUTTON_TEXT_SIZE === 40) {
  SPIN_BUTTON_PADDING_TOP = 19;
} else {
  SPIN_BUTTON_PADDING_TOP = 9;
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
  spinButtonRow: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 5,
    paddingBottom: 10,
  },
  spinButton: {
    width: '50%',
    height: '75%',
    backgroundColor: 'royalblue',
    borderColor: 'black',
    borderWidth: 4,
    borderRadius: 15,
    paddingTop: SPIN_BUTTON_PADDING_TOP,
  },
  spinButtonText: {
    fontWeight: 'bold',
    fontSize: SPIN_BUTTON_TEXT_SIZE,
    textAlign: 'center',
    color: 'white',
    alignSelf: 'center',
  },
  containerRight: {
    flex: 1,
    padding: 60,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
  image: {
    resizeMode: 'contain',
    borderColor: "black",
    borderWidth: 4,
    borderRadius: 15,
  },
  imageArrowUpHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: UP_ARROW_WIDTH,
    height: UP_ARROW_HEIGHT,
    resizeMode: 'contain',
  },
  imageArrowDownHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: DOWN_ARROW_WIDTH,
    height: DOWN_ARROW_HEIGHT,
    backgroundColor: 'white',
    resizeMode: 'contain',
  },
});

export default styles;
