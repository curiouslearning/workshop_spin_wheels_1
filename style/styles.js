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

var ARROW_MULTIPLIER = 0.15;
var SPIN_BUTTON_TEXT_SIZE = 40;
var SPIN_BUTTON_PADDING_TOP = 19;

if (screenWidthScale > 1) {
  ARROW_MULTIPLIER = 0.12;
} else if (screenWidthScale === 1) {
  ARROW_MULTIPLIER = 0.15;
} else {
  ARROW_MULTIPLIER = 0.12;
}

if (PixelRatio.get() <= 2) {
  SPIN_BUTTON_TEXT_SIZE = 40;
} else {
  SPIN_BUTTON_TEXT_SIZE = 20;
}
/*
if (PixelRatio.get() === 1) {
  SPIN_BUTTON_TEXT_SIZE = 40;
  ARROW_MULTIPLIER = 0.15;
} else if (PixelRatio.get() === 2) {
  SPIN_BUTTON_TEXT_SIZE = 40;
  ARROW_MULTIPLIER = 0.15;
} else {
  SPIN_BUTTON_TEXT_SIZE = 20;
  ARROW_MULTIPLIER = 0.12;
}
*/

if (SPIN_BUTTON_TEXT_SIZE === 40) {
  SPIN_BUTTON_PADDING_TOP = 19;
} else {
  SPIN_BUTTON_PADDING_TOP = 9;
}

var UP_ARROW_WIDTH = ARROW_MULTIPLIER * screenWidth;
var UP_ARROW_HEIGHT = ARROW_MULTIPLIER * screenHeight;
var DOWN_ARROW_WIDTH = ARROW_MULTIPLIER * screenWidth;
var DOWN_ARROW_HEIGHT = ARROW_MULTIPLIER * screenHeight;

//var IMAGE_WIDTH = 0.44 * screenWidth;
//var IMAGE_HEIGHT = 0.65 * screenHeight;

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
    //width: IMAGE_WIDTH,
    //height: IMAGE_HEIGHT,
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

/*

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
image: {
  margin: 50,
  borderColor: "black",
  borderWidth: 4,
  borderRadius: 15,
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
spinButton: {
  height: 100,
  width: '50%',
  backgroundColor: 'royalblue',
  borderColor: 'black',
  borderWidth: 4,
  borderRadius: 15,
},
spinButtonRow: {
  flex: 1,
  backgroundColor: 'white',
  justifyContent: 'center',
  alignItems: 'center',
},
spinButtonText: {
  fontWeight: 'bold',
  fontSize: 40,
  textAlign: 'center',
  padding: 20,
  color: 'white',
},
imageArrowUpHolder: {
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 35,
  width: UP_ARROW_WIDTH,
  height: '70%',
  resizeMode: 'contain',  //
},
imageArrowDownHolder: {
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 8,
  width: DOWN_ARROW_WIDTH,
  height: '70%',
  backgroundColor: 'white',
  resizeMode: 'contain',  //
},
*/
