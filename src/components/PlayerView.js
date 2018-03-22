	import React, { Component } from 'react';
	import {
		StyleSheet,
		Image,
		Text,
		TouchableOpacity,
		View,
		BackHandler,
		Dimensions,
		ScrollView,
		ImageBackground} from 'react-native';
	import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
	import TrackPlayer from 'react-native-track-player';
	import Slider from 'react-native-slider';
	import { NavigationActions } from 'react-navigation';
	import { ifIphoneX } from 'react-native-iphone-x-helper';
	import { scale, verticalScale, moderateScale } from '../util/scalingUtils';
	import MyPlayerBar  from './MyPlayerBar';


	let {height, width} = Dimensions.get('window');

	export default class PlayerView extends Component {
		static navigationOptions = {
			header: false,
		}

	    constructor(props){
	      super(props);
	      this.state = {
		      	playing: true,
		      	muted: false,
		      	shuffle: false,
		      	sliding: false,
		      	currentTime: 0,
		      	//songIndex : 0,
		      	//songs:[],
		      	//album:{},
		      	songIndex: props.navigation.state.params.songIndex,
		      	songs: props.navigation.state.params.songs,
		      	album: props.navigation.state.params.album,

	     	};

	  	}

		componentDidMount(){
			//TrackPlayer.registerEventHandler(RemoteControlHandler);
		TrackPlayer.registerEventHandler((async (data) => {	
		    if(data.type == 'playback-state') {
		        // Update the UI with the new state
		        let trackId = await TrackPlayer.getCurrentTrack();
		        let duration = await TrackPlayer.getDuration();
		        var index = trackId.substr(5, trackId.length);
		        this.setState({songIndex: index -1});
		        this.setState({ songDuration: duration });
		    } else if(data.type == 'remote-play') {
		        TrackPlayer.play();
		    }else if(data.type == 'remote-pause') {
		        TrackPlayer.pause();
		    }else if(data.type == 'remote-next') {
		        TrackPlayer.skipToNext();
		    }else if(data.type == 'remote-previous') {
		        TrackPlayer.skipToPrevious();
		    }
    	     else if(data.type == 'remote-seek') {
		    }
		}).bind(this));

			TrackPlayer.setupPlayer().then(() => {
				TrackPlayer.updateOptions({
				    // One of RATING_HEART, RATING_THUMBS_UP_DOWN, RATING_3_STARS, RATING_4_STARS, RATING_5_STARS, RATING_PERCENTAGE
				    ratingType: TrackPlayer.RATING_5_STARS,

				    // The maximum height or width that the artwork can have. It will be resized when necessary. The lower the number is, the lower is the memory used
				    maxArtworkSize: 800,

				    // An array of media controls capabilities
				    // Can contain CAPABILITY_PLAY, CAPABILITY_PAUSE, CAPABILITY_STOP, CAPABILITY_SEEK_TO,
				    // CAPABILITY_SKIP_TO_NEXT, CAPABILITY_SKIP_TO_PREVIOUS, CAPABILITY_SET_RATING
				    capabilities: [
				        TrackPlayer.CAPABILITY_PLAY,
				        TrackPlayer.CAPABILITY_PAUSE,
				        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
				        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
				    ],
				    // Notification Color (Must be an ARGB Hexadecimal number)
				    color: 0x2ecc71
				});
				var index = 0;
				this.state.songs.map(song => {
					index ++;
					TrackPlayer.add({
				        id: 'track'+index,
				        url: song.url,
				        title: song.title,
				        artist: song.artist,
				        artwork: song.songImage
				    });
				});
	 
			    // Starts playing it
			    TrackPlayer.play();
			 
			});

		}

		componentWillMount(){

		}

		releasePlayer(){
			TrackPlayer.stop();
			TrackPlayer.reset();
			TrackPlayer.destroy();
		}

		togglePlay() {
			if(this.state.playing)
				TrackPlayer.pause();
			else
				TrackPlayer.play();
			this.setState({playing: !this.state.playing});

		}


		goBack(){
			this.releasePlayer();
		    this.props.navigation.goBack();

	    }
		goFirst(){
			this.releasePlayer();
			const resetAction = NavigationActions.reset({
			index: 0,
			actions: [
				NavigationActions.navigate({ routeName: 'Login'})
			]
		});
			this.props.navigation.dispatch(resetAction)
		}
	    goBackward(){
	    	TrackPlayer.skipToPrevious();
	    }

	    goForward(){
			TrackPlayer.skipToNext();
	    }

	    setTime(params){
	      if( !this.state.sliding ){
	        this.setState({ currentTime: params.currentTime });
	      }
	    }

	    onLoad(params){
	      if(params.duration <0){
					this.setState({songDuration: 180});
		    }else {
					this.setState({ songDuration: params.duration });
				}
		  }



		render(){

			let songPlaying = this.state.songs[this.state.songIndex];

		    let playButton;
		    if(!this.state.playing) {
		    	playButton = <TouchableOpacity style= {{ marginRight:20,
									 alignSelf: 'center', justifyContent:'center'}}
									 onPress={this.togglePlay.bind(this)}>
								<Image source= {require('../../assets/image/round_play.png')}
								style= {styles.playButton}/>
							 </TouchableOpacity>;

		    } else {
		    	playButton = <TouchableOpacity style= {{ marginRight:20,
									 alignSelf: 'center', justifyContent:'center'}}
									 onPress={this.togglePlay.bind(this)}>
								<Image source= {require('../../assets/image/round_stop.png')}
								style= {styles.playButton}/>
							 </TouchableOpacity>;
		    }

		    let image = songPlaying.songImage ? songPlaying.songImage : this.state.album.image;
			return(

				<ImageBackground source = {image}
					 style = {{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
	 				<View style= {{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
					 			flexDirection: 'column', alignItems:'center',  justifyContent:'space-between',  backgroundColor:'#00000055'}}>
				   <View style = {{ height: scale(90), width: responsiveWidth(100),
									 backgroundColor: 'transparent',
									 flexDirection: 'row', justifyContent:'space-between',     ...ifIphoneX({marginTop:40},
	    							{marginTop:scale(10)}
	    						)}} >

						<TouchableOpacity style= {{ marginLeft:scale(20),
									 alignSelf: 'center', justifyContent:'center'}} onPress={this.goBack.bind(this)}>
						<Image source= {require('../../assets/image/back_forward.png')}
							style= {styles.backButton}/>
						</TouchableOpacity>

						<TouchableOpacity style= {{ marginRight:scale(20),
									 alignSelf: 'center', justifyContent:'center'}}  onPress={this.goFirst.bind(this)}>
						<Image source= {require('../../assets/image/close.png')}
							style= {styles.backButton}/>
						</TouchableOpacity>
					</View>
					<View style = {{ height: scale(300), width: responsiveWidth(100),
									 backgroundColor: 'transparent',
									 flexDirection: 'column', justifyContent:'space-between',     ...ifIphoneX({marginBottom:40},
					    	{marginBottom:0})
					    }} >
						 <View style={ styles.sliderContainer }>
							<MyPlayerBar/>
						</View>
						<View style={{marginBottom:5, marginTop:5}}>
							<Text  style={{color:'white', fontSize:scale(25), alignSelf:'center', justifyContent:'center',	fontFamily:'Montserrat-Regular'}}>  { songPlaying.title } </Text>
							<Text  style={{color:'#FFFFFF7F', fontSize:scale(18), alignSelf:'center', justifyContent:'center',	fontFamily:'Montserrat-Regular'}}>  { songPlaying.artist } </Text>
						</View>
						<View style = {{ height: scale(90), width: responsiveWidth(100),
									 backgroundColor: 'transparent',
									 flexDirection: 'row',
									 marginBottom:scale(90),
									  marginTop:scale(20),
									 justifyContent: 'center'}} >
							<TouchableOpacity style= {{ marginRight:scale(20),
									 alignSelf: 'center', justifyContent:'center'}}
									 onPress={this.goBackward.bind(this)}>
								<Image source= {require('../../assets/image/prev.png')}
								style= {{width:scale(35), height:scale(35), marginLeft:scale(20),
									 alignSelf: 'center',
									 resizeMode: 'contain'}}/>
							</TouchableOpacity>
							{playButton}
							<TouchableOpacity style= {{ marginRight:20,
									 alignSelf: 'center', justifyContent:'center'}}
									 onPress={this.goForward.bind(this)}>
								<Image source= {require('../../assets/image/next.png')}
								style= {{width:scale(35), height:scale(35), marginLeft:scale(20),
									 alignSelf: 'center',
									 resizeMode: 'contain'}}/>
							</TouchableOpacity>
						</View>

					</View>
	 				</View>

				</ImageBackground>
				);

		}
	}

	const styles = StyleSheet.create({
	  backButton: {
	  	width:scale(60), 
	  	height:scale(35), 
	  	marginLeft:scale(20),
		alignSelf: 'center',
		resizeMode: 'contain'
	  },
	  playButton: {
		width:scale(90), 
		height:scale(90), 
		marginLeft:scale(30),
		alignSelf: 'center',
		resizeMode: 'contain'
	  },

	  buttonView: {
	  	height: undefined,
	    width:20,
	  	marginLeft: scale(20),
	  	justifyContent:'center'
	  },
	    sliderContainer: {
			marginTop:scale(20),
	    marginLeft:scale(40),
	    marginRight:scale(40)
	  }

	});

