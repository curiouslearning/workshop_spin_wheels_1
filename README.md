## Project Description (adapted from workshop's Specification Brief & assignment 1)

### Project Title: CL-Workshops 5/17 Spin the Wheels Project 1

### Animated GIF of App
![Spin Wheels Game](/images/readmeimages/spinwheelsintro.gif)
Figure 1. Animated GIF of the app.

### Goal/Objective
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

## Getting Started

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
1. That filename of sound file must be the same as that of the image file.
Only the file extension is different.

For example, cam.png must have a corresponding cam.wav

### Style Files
The styles used in the game is found in the './style/styles.js' file.

### Sprite Files
All sprite image files are located in the './sprites' folder. The folder
also contains the './sprites/LetterSprite.js' which contains functions for
animating the spinning and stopping of the spinning letters.

### Data Collection Functions
This app uses 2 of the 6 functions from Curious Learning Data Collection API
(CuriousLearningDataAPI.js) to collect usage data so that application usage
can be analyzed.

1. reportSection function is used to collect data regarding the different
levels of the app that a user has completed. This function is called
when a user has completed 50% or more of the word list. Each level has its
own word list.

1. reportTouch function is used to collect data on all buttons that are
touched by a user. These buttons include:
  * Spin button
  * Up arrows
  * Down arrows
  * Image of word
  * Spinning wheels

## History
This project adopted the agile software methodology where the app was created
and modified every 2 weeks from user stories and acceptance criteria.

### Weeks 1 & 2:
The goals and objectives of the app were written up and submitted to the
Curious Learning team for review. After the review, wireframes of the proposed
app were created and submitted for review. See Figure 2 below.

![Spin Wheels Game](/images/readmeimages/wireframe01.png)
Figure 2. Animated GIF of one of the wireframes created.


### Weeks 3 & 4:
Actual coding of the app began. The render() function and styles were first
created. Subsequently, Curious Learning's React-Native-AnimatedSpriteMatrix
was implemented. A minimum viable product (Figure 3) was then created and used
to conduct a User Testing Session.

![Spin Wheels Game](/images/readmeimages/spin_by_wheel.gif)
Figure 3. Animated GIF of the minimum viable product used in the User Testing
Session.

In general, the app worked as intended during the testing session. However,
some major changes to the behaviors of the interface were required to engage
the child further as the child soon lost interest in the app after some time.
The Curious Learning team reviewed the results of the testing session and
made further suggestions to improve the app.

### Weeks 5, 6, 7, and 8:
Time was now spent to improve the app and implemented new suggestions from
the Curious Learning team. In addition, JSON file was also being used to
define what letters appear in each spinning wheel.

### Weeks 9 & 10:
Effort was now put into cleaning up the codes and ensuring the codes followed
good coding standards and practices. The Curious Learning Data Collection API
(CuriousLearningDataAPI.js) was implemented to allow app usage data to be
collected.

### Week 11:
The project's README.md file was updated to provide background information to
future developers who are interested in this project.

## Acknowledgements
1. Boink sound is from: https://www.freesound.org/s/61847/
2. The Curious Learning Team that has provided wonderful guidance, suggestions,
and assistance.
