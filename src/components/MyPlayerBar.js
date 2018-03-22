import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { scale, verticalScale, moderateScale } from '../util/scalingUtils'
import TrackPlayer from 'react-native-track-player';
import Slider from 'react-native-slider';
export default class MyPlayerBar extends TrackPlayer.ProgressComponent {

    onSlidingStart(){
      this.setState({ sliding: true });
    }
    onSlidingChange(value){
      let newPosition = value * this.state.duration;
      TrackPlayer.seekTo(newPosition);
    }

    onSlidingComplete(){
      this.setState({ sliding: false });
    }

    render() {
        var songPercentage = 0;
        if( this.state.duration && this.state.position){
            if(this.state.duration >0)
          songPercentage = this.state.position / this.state.duration;
        } else {
          songPercentage = 0;
        }
        return (
            <View>
                <Slider
                    onSlidingStart={ this.onSlidingStart.bind(this) }
                    onSlidingComplete={ this.onSlidingComplete.bind(this) }
                    onValueChange={ this.onSlidingChange.bind(this) }
                    minimumTrackTintColor='white'
                    style={ styles.slider }
                    trackStyle={ styles.sliderTrack }
                    thumbStyle={ styles.sliderThumb }
                    value={songPercentage}/>
                <View style={ styles.timeInfo }>
                    <Text style={ styles.time }>{ formattedTime(this.state.position)  }</Text>
                    <Text style={ styles.timeRight }>- { formattedTime( this.state.duration - this.state.position ) }</Text>
                </View>
            </View>
        );
    }

    
}

const styles = StyleSheet.create({
  slider: {
    height: scale(30),
  },
  sliderTrack: {
    height: 3,
    backgroundColor: '#333',
  },
  sliderThumb: {
    width: scale(15),
    height: scale(15),
    backgroundColor: 'white',
    borderRadius: scale(15) / 2,
    shadowColor: 'red',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: scale(3),
    shadowOpacity: 1,
  },
  time: {
    color: '#FFF',
    flex: 1,
    fontSize: scale(15),
  },
  timeRight: {
        color: '#FFF',
        textAlign: 'right',
        flex: 1,
        fontSize: scale(15),
  },
  timeInfo: {
    flexDirection: 'row',
  }
});

function withLeadingZero(amount){
  if (amount < 10 ){
    return `0${ amount }`;
  } else {
    return `${ amount }`;
  }
}
function formattedTime( timeInSeconds ){
    if(timeInSeconds <0)
        return "";
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = timeInSeconds - minutes * 60;

    if( isNaN(minutes) || isNaN(seconds) ){
        return "";
    } else {
        return(`${ withLeadingZero( minutes ) }:${ withLeadingZero( seconds.toFixed(0) ) }`);
    }
}
