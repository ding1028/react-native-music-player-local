import React, {Component} from 'react';
import { StyleSheet, View, Text , Image, ScrollView, TextInput, Alert, TouchableOpacity} from 'react-native';
import Button from 'react-native-button';
//import {TextField} from 'react-native-material-textfield';
import DefaultPreference from 'react-native-default-preference';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { signUpUser, readUser } from '../service/dbProvider';
import Mailer from 'react-native-mail';
var RNFS = require('react-native-fs');
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { scale, verticalScale, moderateScale } from '../util/scalingUtils'
export default class LoginView extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			first_name:'',
			last_name:'',
			email:'',
			address:'',
			city:'',
			state:'',
			zip:'',
		}
	}

	componentWillMount(){

	}

	onReadUser(result) {
		  Alert.alert(
			  'BuzzBus',
			  'Are you sure to send user registration report?',
			  [
			    {text: 'OK', onPress: () => {
			    	readUser((result)=>{
		 				//generate csv string
		 				const headerString = "First Name,Last Name,Email,Address,City,State,Zip/Postal Code\n";
		 				const rowString = result.map(row=>`${row.first_name},${row.last_name},${row.email},${row.address},${row.city},${row.state},${row.zip}\n`).join('');
						const csvString = `${headerString}${rowString}`;
						//console.warn(csvString);
						// create a path you want to write to
						var path = RNFS.DocumentDirectoryPath + '/buzzbus.csv';

						// write the file
						RNFS.writeFile(path, csvString, 'utf8')
						  .then((success) => {
						    console.log('FILE WRITTEN!');
						    this.sendMail(path);

						  })
						  .catch((err) => {
						    console.log(err.message);
						  });
		 			});
			    }},
			    {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
			  ],
			  { cancelable: true }
			);
 			
	}
	sendMail(csvPath) {
		 Mailer.mail({
	      subject: 'LB Listener Data',
	      recipients: ['lukebryan@umgnashville.com'],
	      ccRecipients: [],
	      bccRecipients: [],
	      body: '<b>LB Listener Data.</b>',
	      isHTML: true,
	      attachment: {
	        path:  csvPath,  // The absolute path of the file from which to read data.
	        type: 'csv',   // Mime Type: jpg, png, doc, ppt, html, pdf
	        name: '',   // Optional: Custom filename for attachment
	      }
	    }, (error, event) => {
	    });
	}

	onPressSubmit(){
		if (!this.validateEmail(this.state.email)) {
		  Alert.alert(
			  'BuzzBus',
			  'Please input valid email.',
			  [
			    {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: true }
			);
		} else {
 			signUpUser(this.state.first_name, this.state.last_name, this.state.email,
 						this.state.address, this.state.city, this.state.state, this.state.zip);


	        this.props.navigation.navigate('Album');
		}
       
    }

    goBack(){
    	this.props.navigation.goBack();
    }
    validateEmail = (email) => {
  		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(email);
	};

	render(){
		return (
		<View style={{ flex: 1, backgroundColor:'black'}}>
			<View style={styles.container}>

				<KeyboardAwareScrollView style={styles.contentContainer}>
					<View style={{flexDirection:'row', justifyContent:'space-between'}}>
						<View style={styles.adminButton}></View>
						<Image source={require('../../assets/image/logo.png')} style={styles.logoImage} />
						<TouchableOpacity onLongPress={this.onReadUser.bind(this)}>
						<View style={styles.adminButton}></View>
						</TouchableOpacity>
					</View>
					
					<Text style={styles.title}>Sign up to hear the new album</Text>
					<View style={{ flexDirection:'row', height:scale(90),	marginLeft: scale(40),
						marginRight: scale(40), marginTop:scale(10), alignSelf:'stretch' }}>
						<View style={styles.roundViewPart}>
							<Image source={require('../../assets/image/icon.png')} style={styles.userIcon} />
							<TextInput returnKeyType={"next"} autoFocus={true} onSubmitEditing={(event)=>{this.refs.lastName.focus()}} style={styles.userInput} onChangeText={(first_name) => this.setState({first_name})}
         						value={this.state.first_name} placeholder="First Name" placeholderStyle={styles.userInputPlaceholder} placeholderTextColor="#FFFFFF" underlineColorAndroid="transparent"/>
						</View>
						<View style={{width:20}}></View>
						<View style={styles.roundViewPart}>
							<Image source={require('../../assets/image/icon.png')} style={styles.userIcon} />
							<TextInput ref='lastName' returnKeyType={"next"} onSubmitEditing={(event)=>{this.refs.email.focus()}} style={styles.userInput} placeholder="Last Name"  onChangeText={(last_name) => this.setState({last_name})}
         						value={this.state.last_name} placeholderStyle={styles.userInputPlaceholder} placeholderTextColor="#FFFFFF" underlineColorAndroid="transparent"/>
						</View>
					</View>

					<View style={styles.roundView}>
						<Image source={require('../../assets/image/icon.png')} style={styles.userIcon} />
						<TextInput ref='email' returnKeyType={"next"} onSubmitEditing={(event)=>{this.refs.address.focus()}}  style={styles.userInput} placeholder="Email"  onChangeText={(email) => this.setState({email})}
         				value={this.state.email} placeholderStyle={styles.userInputPlaceholder} placeholderTextColor="#FFFFFF" underlineColorAndroid="transparent"/>

					</View>
					<View style={styles.roundView}>
						<Image source={require('../../assets/image/icon.png')} style={styles.userIcon} />
						<TextInput ref='address' returnKeyType={"next"}  onSubmitEditing={(event)=>{this.refs.city.focus()}}  style={styles.userInput} placeholder="Address"  onChangeText={(address) => this.setState({address})}
         				value={this.state.address} placeholderStyle={styles.userInputPlaceholder} placeholderTextColor="#FFFFFF" underlineColorAndroid="transparent"/>
					</View>
					<View style={styles.roundView}>
						<Image source={require('../../assets/image/icon.png')} style={styles.userIcon} />
						<TextInput ref='city' returnKeyType={"next"}  onSubmitEditing={(event)=>{this.refs.state.focus()}}  style={styles.userInput} placeholder="City"  onChangeText={(city) => this.setState({city})}
         				value={this.state.city} placeholderStyle={styles.userInputPlaceholder} placeholderTextColor="#FFFFFF" underlineColorAndroid="transparent"/>
					</View>
					<View style={styles.roundView}>
						<Image source={require('../../assets/image/icon.png')} style={styles.userIcon} />
						<TextInput ref='state' returnKeyType={"next"} onSubmitEditing={(event)=>{this.refs.zip.focus()}}  style={styles.userInput} placeholder="State"  onChangeText={(state) => this.setState({state})}
        					value={this.state.state} placeholderStyle={styles.userInputPlaceholder} placeholderTextColor="#FFFFFF" underlineColorAndroid="transparent"/>
					</View>
					<View style={styles.roundView}>
						<Image source={require('../../assets/image/icon.png')} style={styles.userIcon} />
						<TextInput ref='zip' style={styles.userInput} placeholder="Zip/Postal Code"  onChangeText={(zip) => this.setState({zip})}
        		 		value={this.state.zip} placeholderStyle={styles.userInputPlaceholder} placeholderTextColor="#FFFFFF" underlineColorAndroid="transparent"/>
					</View>
					  <Button
					    containerStyle={styles.buttonView}
					    style={{fontSize: scale(25), color: 'white', alignSelf: 'center', 	fontFamily:'Montserrat-Regular'}}
					    onPress = {this.onPressSubmit.bind(this) }>
					    Submit
					  </Button>
			

				</KeyboardAwareScrollView>
			</View>

		</View>


		);
	}
}

const styles = StyleSheet.create({
  title: {
		flex:1,
		alignSelf:'center',
		color:'#00c9a9',
		fontSize: scale(25),
		marginTop: scale(10),
		marginBottom: scale(10),
		fontFamily:'Montserrat-Regular'
	},
  adminButton: {
  	width: scale(70), 
  	height: scale(70), 
  	backgroundColor: 'transparent'
  },
  logoImage: {
  	width: responsiveWidth(100) - scale(140),
  	height: scale(120),
  	marginBottom: 0,
  	resizeMode: 'contain',
  	backgroundColor: 'transparent',
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
    paddingVertical: 20,
    flex: 1,
    backgroundColor: 'transparent',
    alignSelf: 'stretch',
    ...ifIphoneX({marginTop:40},
    	{marginTop:40}
    )
  },
  roundView: {
  	height: scale(90),
    width:undefined,
  	borderRadius: scale(45),
	backgroundColor: 'rgba(255, 255, 255, 0.15)',
	flexDirection: "row",
	marginLeft: scale(40),
  	marginRight: scale(40),
  	marginTop:scale(20),
	alignItems: "flex-start"
  },
	roundViewPart: {
		flex: 1,
		height: scale(90),
		width:undefined,
		borderRadius: scale(45),
	  backgroundColor: 'rgba(255, 255, 255, 0.15)',
	  flexDirection: "row",
		marginRight:0,
		marginLeft:0,
  	alignItems: "flex-start"
	},
  buttonView: {
  	height: scale(90),
    width:undefined,
  	borderRadius: scale(45),
	backgroundColor: '#00d7b5',
	marginLeft: scale(40),
  	marginRight: scale(40),
  	marginTop: scale(20),
  	marginBottom: scale(60),
  	overflow:'hidden',
  	justifyContent:'center'
  },
  userIcon : {
  	width: scale(45),
  	height: scale(45),
  	alignSelf: "center",
  	marginLeft: scale(30),
  },
  userInput :{
  	alignSelf: "center",
  	marginLeft: scale(20),
  	flex:1,
  	marginRight: scale(20),
  	fontSize:scale(25),
  	color: "white",
		fontFamily:'Montserrat-Regular'
  },
	userInputPlaceholder:{
		fontFamily:'Montserrat-Regular'
	},
  styleIcon: {
		alignSelf:'center',
	    marginTop:80,
	    width:100,
	    height:100,


	},
});
