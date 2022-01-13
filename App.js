/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import SoundPlayer from 'react-native-sound';
import Pdf from 'react-native-pdf';

import {listSpeedValues} from './src/constants';
import {useAudioHelper} from './src/helpers/audio-helper';

import samplPdf from './src/assets/thereactnativebook-sample.pdf';
const pdfSource = {
  uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf',
  cache: true,
};

const App = () => {
  const player = useAudioHelper({
    listSounds: [
      {
        type: 'app-bundle',
        path: '8SLCAS8-calm-meditation.mp3',
        name: 'Audio 1',
        basePath: SoundPlayer.MAIN_BUNDLE,
      },
      {
        type: 'app-bundle',
        path: 'JEK9DZZ-the-meditation.mp3',
        name: 'Audio 2',
        basePath: SoundPlayer.MAIN_BUNDLE,
      },
      {
        type: 'directory',
        path: require('./src/assets/Play-Doh-meets-Dora_Carmen-Maria-and-Edu-Espinal.mp3'),
        name: 'Play Doh meets Dora - Carmen Maria and Edu Espinal',
      },
      {
        type: 'network',
        path: 'https://raw.githubusercontent.com/uit2712/RNPlaySound/develop/sounds/Tropic%20-%20Anno%20Domini%20Beats.mp3',
        name: 'Tropic - Anno Domini Beats',
      },
    ],
    timeRate: 15,
    isLogStatus: true,
  });

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Text style={{textAlign: 'center'}}> RN Audio POC</Text>
          <View
            style={{backgroundColor: '#E37963', margin: 25, borderRadius: 25}}>
            <Text style={styles.name}>Album: {player.currentAudioName}</Text>
            <View style={styles.changeAudio}>
              <TouchableOpacity onPress={player.previous}>
                <FontAwesomeIcon
                  name="step-backward"
                  size={30}
                  color={
                    player.isDisabledButtonPrevious === false ? 'white' : 'gray'
                  }
                />
              </TouchableOpacity>
              <Image
                source={require('./src/images/audio_static.jpeg')}
                style={styles.avatar}
              />
              <TouchableOpacity onPress={player.next} style={styles.button}>
                <FontAwesomeIcon
                  name="step-forward"
                  size={30}
                  color={
                    player.isDisabledButtonNext === false ? 'white' : 'gray'
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={styles.actionButtonsOther}>
              <TouchableOpacity
                onPress={player.decreaseTime}
                style={styles.button}>
                <FontAwesomeIcon name="rotate-left" size={30} color="white" />
                <Text
                  style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    marginTop: 1,
                    color: 'white',
                    fontSize: 12,
                  }}>
                  {player.timeRate}
                </Text>
              </TouchableOpacity>
              {player.status === 'play' ? (
                <TouchableOpacity
                  onPress={player.pause}
                  style={{marginHorizontal: 20}}>
                  <FontAwesomeIcon name="pause" color="white" size={30} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={player.play}
                  style={{marginHorizontal: 20}}>
                  <FontAwesomeIcon name="play" color="white" size={30} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={player.increaseTime}
                style={styles.button}>
                <FontAwesomeIcon name="rotate-right" size={30} color="white" />
                <Text
                  style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    marginTop: 1,
                    color: 'white',
                    fontSize: 12,
                  }}>
                  {player.timeRate}
                </Text>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.actionButtonsOther}>
          <TouchableOpacity onPress={player.shuffle} style={styles.button}>
            <EntypoIcon
              name="shuffle"
              color={player.isShuffle === true ? '#3399ff' : 'white'}
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={player.loop} style={styles.button}>
            <MaterialIcon
              name="loop"
              color={player.isLoop === true ? '#3399ff' : 'white'}
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={player.stop}
            style={styles.button}
            disabled={player.isDisabledButtonStop}>
            <EntypoIcon
              name="controller-stop"
              color={player.status === 'stop' ? 'red' : 'white'}
              size={30}
            />
          </TouchableOpacity>
          {player.isMuted === false ? (
            <TouchableOpacity onPress={player.mute} style={styles.button}>
              <EntypoIcon name="sound" color={'white'} size={50} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={player.unmute} style={styles.button}>
              <EntypoIcon name="sound-mute" color={'red'} size={50} />
            </TouchableOpacity>
          )}
          <Slider
            style={{width: '40%', height: 50}}
            minimumValue={0}
            maximumValue={100}
            value={player.volume}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="gray"
            thumbTintColor="#FFFFFF"
            onSlidingComplete={volume => player.setVolume(volume)}
          />
        </View> */}
            <View style={styles.progressBar}>
              <Slider
                style={{width: '100%', height: 40}}
                minimumValue={0}
                maximumValue={player.duration}
                value={player.currentTime}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="gray"
                thumbTintColor="#FFFFFF"
                onTouchStart={player.pause}
                onTouchEnd={player.play}
                onSlidingComplete={seconds => player.seekToTime(seconds)}
              />
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.progressBarText}>
                {player.currentTimeString}
              </Text>
              <Text style={styles.progressBarText}>
                {player.durationString}
              </Text>
            </View>
            <View style={styles.speed}>
              {listSpeedValues.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.speedItem}
                  onPress={() => player.setSpeed(item.value)}>
                  <Text
                    style={{
                      color: player.speed === item.value ? '#3399ff' : 'white',
                    }}>
                    {item.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={{color: 'black'}}>
            <Pdf
              source={samplPdf}
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`Current page: ${page}`);
              }}
              onError={error => {
                console.log(error);
              }}
              onPressLink={uri => {
                console.log(`Link pressed: ${uri}`);
              }}
              style={styles.pdfStyle}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //backgroundColor: 'lightblue',
  },
  name: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
  },
  avatar: {
    alignSelf: 'center',
    borderRadius: 100,
    margin: 15,
  },
  progressBar: {
    flexDirection: 'row',
    marginVertical: 15,
    marginHorizontal: 15,
  },
  progressBarText: {
    color: 'white',
  },
  speed: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  speedItem: {
    width: 50,
  },
  actionButtons: {},
  actionButtonsOther: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  pauseOrPlayButton: {
    marginRight: 10,
    marginLeft: 10,
    width: 50,
  },
  actionButtonsOtherTimeDown: {
    // left: -35,
  },
  actionButtonsOtherTimeUp: {
    // width: 40,
  },
  changeAudio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
  },
  pdfStyle: {
    flex: 1,
    margin: 10,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default App;
