/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	NativeModules,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
	Image,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';

const instructions = Platform.select({
	ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
	android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu',
});

export default class App extends Component {
	constructor(props) {
		super(props);
		console.log(NativeModules, 'native');
		this.state = {
			videoSourcePath: null,
			imageSourcePath: null,
			destinationPath: `/storage/emulated/0/Download/${Math.random()}.mp4`,
			imageDestinationPath: `/storage/emulated/0/Download/${Math.random()}.jpg`,
			grayscaleLoading: false,
			sepiaLoading: false,
			isFiltered: false,
			isImageFiltered: false,
		};
	}

	pickVideo = () => {
		this.setState({
			imageSourcePath: null,
			imageDestinationPath: `/storage/emulated/0/Download/${Math.random()}.jpg`,
		});
		const options = {
			title: 'Video Picker',
			mediaType: 'video',
			quality: 0.2,
			storageOptions: {
				skipBackup: true,
				path: 'images',
			},
		};

		/**
		 * The first arg is the options object for customization (it can also be null or omitted for default options),
		 * The second arg is the callback which sends object: response (more info in the API Reference)
		 */
		ImagePicker.showImagePicker(options, response => {
			console.log('Response = ', response);

			this.setState({ videoSourcePath: response.path });

			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			} else {
				const source = { uri: response.uri };

				// You can also display the image using data:
				// const source = { uri: 'data:image/jpeg;base64,' + response.data };

				this.setState({
					avatarSource: source,
				});
			}
		});
	};

	pickImage = () => {
		this.setState({ videoSourcePath: null, destinationPath: `/storage/emulated/0/Download/${Math.random()}.mp4` });
		const options = {
			title: 'Video Picker',
			mediaType: 'image',
			quality: 0.1,
			storageOptions: {
				skipBackup: true,
				path: 'images',
			},
		};

		/**
		 * The first arg is the options object for customization (it can also be null or omitted for default options),
		 * The second arg is the callback which sends object: response (more info in the API Reference)
		 */
		ImagePicker.showImagePicker(options, response => {
			console.log('Response = ', response);

			this.setState({ imageSourcePath: response.path });

			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			} else {
				const source = { uri: response.uri };

				// You can also display the image using data:
				// const source = { uri: 'data:image/jpeg;base64,' + response.data };

				this.setState({
					avatarSource: source,
				});
			}
		});
	};

	execute = (effectCode, effectName, mediaType) => {
		if (this.state.videoSourcePath && mediaType === 'video') {
			let command = `-i ${
				this.state.videoSourcePath
			} -vf colorchannelmixer=${effectCode} -acodec copy -pix_fmt yuv420p ${this.state.destinationPath}`;

			if (effectName === 'grayscale') {
				this.setState({ grayscaleLoading: true });
			} else {
				this.setState({ sepiaLoading: true });
			}
			NativeModules.ToastExample.executeCmd(
				command,
				err => {
					console.log(err, 'cmd error');
					this.setState({ grayscaleLoading: false, sepiaLoading: false });
				},
				success => {
					console.log(success, 'cmd succcess', typeof success, 'object');
					this.setState({ grayscaleLoading: false, sepiaLoading: false, isFiltered: true });
				}
			);
		} else if (this.state.imageSourcePath && mediaType === 'image') {
			let command = `-i ${this.state.imageSourcePath} -vf colorchannelmixer=${effectCode} -acodec copy ${
				this.state.imageDestinationPath
			}`;

			console.log(command, 'executed command');
			if (effectName === 'grayscale') {
				this.setState({ grayscaleLoading: true });
			} else {
				this.setState({ sepiaLoading: true });
			}
			NativeModules.ToastExample.executeCmd(
				command,
				err => {
					console.log(err, 'cmd error');
					this.setState({ grayscaleLoading: false, sepiaLoading: false });
				},
				success => {
					console.log(success, 'cmd succcess', typeof success, 'object');
					this.setState({ grayscaleLoading: false, sepiaLoading: false, isImageFiltered: true });
				}
			);
		} else {
			Alert.alert('Please pick a video first.');
		}
	};

	render() {
		return (
			<View style={styles.container}>
				<View style={{ flex: 0.1, flexDirection: 'row' }}>
					<TouchableOpacity
						style={{
							backgroundColor: 'black',
							flex: 0.5,
							alignItems: 'center',
							justifyContent: 'center',
							margin: 10,
						}}
						disabled={this.state.grayscaleLoading || this.state.sepiaLoading ? true : false}
						onPress={() => this.pickVideo()}
					>
						<Text style={{ color: 'white' }}>Pick a video</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							backgroundColor: 'black',
							flex: 0.5,
							alignItems: 'center',
							justifyContent: 'center',
							margin: 10,
						}}
						disabled={this.state.grayscaleLoading || this.state.sepiaLoading ? true : false}
						onPress={() => this.pickImage()}
					>
						<Text style={{ color: 'white' }}>Pick a Image</Text>
					</TouchableOpacity>
				</View>

				<View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
					{this.state.videoSourcePath ? (
						<Video
							source={{ uri: this.state.videoSourcePath }}
							style={{
								height: 150,
								width: 300,
							}}
							repeat={true}
						/>
					) : (
						this.state.imageSourcePath && (
							<Image
								source={{ uri: `file://${this.state.imageSourcePath}` }}
								style={{ height: 150, width: 300 }}
							/>
						)
					)}
				</View>
				<View style={{ flex: 0.1, flexDirection: 'row' }}>
					<TouchableOpacity
						style={{
							backgroundColor: 'black',
							flex: 0.5,
							alignItems: 'center',
							justifyContent: 'center',
							margin: 10,
						}}
						onPress={() => {
							this.setState(
								{
									destinationPath: `/storage/emulated/0/Download/${Math.random()}.mp4`,
									imageDestinationPath: `/storage/emulated/0/Download/${Math.random()}.jpg`,
									grayscaleLoading: false,
									sepiaLoading: false,
									isFiltered: false,
									isImageFiltered: false,
								},
								() => {
									this.execute(
										'.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3',
										'grayscale',
										this.state.imageSourcePath ? 'image' : 'video'
									);
								}
							);
						}}
						disabled={this.state.grayscaleLoading || this.state.sepiaLoading ? true : false}
					>
						{this.state.grayscaleLoading ? (
							<ActivityIndicator color="white" />
						) : (
							<Text style={{ color: 'white' }}>Grayscale filter</Text>
						)}
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							backgroundColor: 'black',
							flex: 0.5,
							alignItems: 'center',
							justifyContent: 'center',
							margin: 10,
						}}
						onPress={() =>
							this.setState(
								{
									destinationPath: `/storage/emulated/0/Download/${Math.random()}.mp4`,
									imageDestinationPath: `/storage/emulated/0/Download/${Math.random()}.jpg`,
									grayscaleLoading: false,
									sepiaLoading: false,
									isFiltered: false,
									isImageFiltered: false,
								},
								() =>
									this.execute(
										'.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131',
										'sepia',
										this.state.imageSourcePath ? 'image' : 'video'
									)
							)
						}
						disabled={this.state.sepiaLoading || this.state.grayscaleLoading ? true : false}
					>
						{this.state.sepiaLoading ? (
							<ActivityIndicator color="white" />
						) : (
							<Text style={{ color: 'white' }}>Sepia filter</Text>
						)}
					</TouchableOpacity>
				</View>

				<View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
					{this.state.isFiltered ? (
						<Video
							source={{ uri: this.state.destinationPath }}
							style={{
								height: 150,
								width: 300,
							}}
							repeat={true}
						/>
					) : (
						this.state.isImageFiltered && (
							<Image
								source={{ uri: `file://${this.state.imageDestinationPath}` }}
								style={{ height: 150, width: 300 }}
							/>
						)
					)}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,

		backgroundColor: 'white',
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
});
