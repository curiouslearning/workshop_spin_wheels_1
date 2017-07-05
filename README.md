# workshops_spin_wheels_1
CL-Workshops 5/17 Spin the Wheels project 1

## Getting Started (adapted from workshop's Specification Brief)

![Spin Wheels Game](/images/spinwheelsintro.gif)

The objective of the game is to allow users to put order to a set of
letters to spell a word. The game currently has three independent
spinning wheels. Each wheel has its own set of letters. Words are formed
as all three wheels are spinned using the spin button.

After the first spin, users then have the option to spin each wheel
using the Up/Down arrow buttons. These arrow buttons are located
above/below each wheel.

An image of the word will be displayed in the picture area when the letter(s)
spinned formed a word. An audio file will also play pronouncing the word.
The audio file can be replayed by touching on the picture or the letters.
If the letters do not form a word, the picture area will show a placeholder
graphic informing users that the word has not meaning. No audio will be
played. Touching on the placeholder graphic or the letters will result in
a sound informing that the word cannot be pronounced.

### JSON File
A JSON file is used to define what letters appear in each wheel. The file
also contains lists of words that the wheels can spell. This file is named
spin_wheels.json and is located in the './json' directory. This directory
also contains the wordListUtil.js which has the functions needed to select
the different word lists found in the JSON file.

### Image Files
All images of words used in this game is located in the './images' folder.
In addition, the './js/WordImages.js' file contains a constant object
that provides the location of each image file. Each key name will have
the same name as the image filename.

For example, the image filename "pit.jpg" will have a key name of "pit".

### Audio Files
The file in './js/WordSounds.js' is really not being used by the app.
It is placed here to inform:

1. The location of actual sound files
1. That filename of sound file must be the same as that of the image file

For example, cam.png must have a corresponding cam.wav

### Style Files
The styles used in the game is found in the './style/styles.js' file.

### Sprite files
All sprite image files are located in the './sprites' folder. The folder
also contains the './sprites/LetterSprite.js' which contains functions for
animating the spinning and stopping of the spinning letters.

## Acknowledgements
1. Boink sound is from: https://www.freesound.org/s/61847/
