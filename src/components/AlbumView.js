import React, { Component } from 'react';
import {
	StyleSheet,
	Image,
	Text,
	TouchableOpacity,
	View,
	BackHandler,
	ScrollView,
  ImageBackground
} from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { data } from '../config/data';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { scale, verticalScale, moderateScale } from '../util/scalingUtils'

export default class AlbumView extends Component {
	static navigationOptions = {
    header: false,
  };

	render(){
		return(

    <ImageBackground source = {require('../../assets/image/Background.png')}
         style = {{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,   backgroundColor: 'transparent'}}>
			<View style={styles.container}>
          <Text style={styles.title}>Select Album to Listen</Text>
        

       	<ScrollView contentContainerStyle={styles.contentContainer}>
        
				    {
            data.albums.map((album,index) => (
                 <TouchableOpacity onPress = {() => this.props.navigation.navigate('Player' ,
                  {songIndex: 0, songs: album.tracks, album: album})}>
                  <View style={styles.shadow}>
                    <Image source = {album.image} style = {styles.logoImage}/>
                  </View>
                 </TouchableOpacity>
            ))
          }
				</ScrollView>
			</View>

		</ImageBackground>
			);
	}
}

const styles = StyleSheet.create({
title: {
  marginBottom: scale(40), 
  alignSelf:'center',
  fontSize: scale(25), 
  color: 'white', 
  fontWeight: 'bold', 
  ...ifIphoneX({marginTop:60},
      {marginTop:scale(60)}
    )
},
logoImage: {
	flex:1,
	width: responsiveWidth(75),
  	height: responsiveWidth(75),
  	resizeMode: 'contain',
  	backgroundColor: 'transparent'
  },
  shadow: {
  	width: responsiveWidth(75),
  	height: responsiveWidth(75),
  	backgroundColor: 'white',
  	marginBottom:scale(30),
	shadowOffset: { width: scale(15), height: scale(15) },
	shadowColor: 'black',
	shadowOpacity: 0.5,
	elevation: scale(15),
	alignSelf: 'center'
  },
  backgroundContainer: {
        flex: 1,
        width: undefined,
        height: undefined,
        justifyContent: 'center',
        alignItems: 'center',
      },
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: "column",
    alignItems: 'center',
  },
  contentContainer: {
		flexGrow : 1,
		justifyContent : 'center',
    paddingVertical: scale(20),
  
    alignSelf: 'stretch'
  }
});
