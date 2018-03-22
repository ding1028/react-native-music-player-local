import TrackPlayer from 'react-native-track-player';
module.exports = async (data) => {
			if(data.type == 'remote-play') {
				console.log("remote play");
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
};
