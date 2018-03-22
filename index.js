/**
 * BuzzBus React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View, ScrollView
} from 'react-native';
import { StackNavigator, NavigationActions} from 'react-navigation';
import TrackPlayer from 'react-native-track-player';
import AlbumView from './src/components/AlbumView';
import LoginView from './src/components/LoginView';  
import PlayerView from './src/components/PlayerView'; 

// global.__DEV__=false;
const Routes = StackNavigator({
    Login: {screen:LoginView, navigationOptions:{header:true}},
	Album: {screen: AlbumView, navigationOptions:{header:true}},
	Player: {screen:PlayerView, navigationOptions:{header:true}},
})
//TrackPlayer.registerEventHandler(require('./src/components/RemoteControlHandler.js'));
AppRegistry.registerComponent('BuzzBus', () =>  Routes);
