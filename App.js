/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  BackHandler,
  Alert,
  TextInput,
  Linking,
  Dimensions
} from 'react-native';
import Webview from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';
import SendIntentAndroid from 'react-native-send-intent';


const App = () => {
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;

  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.allowFontScaling = false;

  let { height, width } = Dimensions.get('window');
  const [urls, set_urls] = React.useState("ss");
  const webViews = React.useRef();

  const onWebViewMessage = (webViews) => {
    let jsonData = JSON.parse(webViews.nativeEvent.data);
    //console.log(jsonData);
  }

  const onNavigationStateChange = (webViewState)=>{
    console.log('webViewState.url ' + webViewState.url);

    //웹뷰 URL 변경값 체크해서 외부브라우저로 연결시 사용
    if(webViewState.url=='http://liscc.or.kr/' || webViewState.url=='http://www.bss.or.kr/' || webViewState.url=='http://m.kyobo.co.kr/') {
        Linking.openURL(webViewState.url).catch((err) => {
            console.log('앱 실행이 실패했습니다. 설치가 되어있지 않은 경우 설치하기 버튼을 눌러주세요.');
        });
        webViews.current.stopLoading();
    }

    set_urls(webViewState.url);
    //안드로이드 뒤로가기 버튼 처리
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
  }

  const handleBackButton = () => {
    console.log('urls ' + urls);
    //제일 첫페이지에서 뒤로가기시 어플 종료
    if(urls == 'https://dmonster1783.cafe24.com/index.php' || urls == 'https://dmonster1783.cafe24.com/'){
        Alert.alert(
            '어플을 종료할까요?', '',
            [
                { text: '네', onPress: () =>  BackHandler.exitApp() },
                { text: '아니요' }
            ]
        );
    } else {
        webViews.current.goBack();
    }
    return true;
  }
  
  const onShouldStartLoadWithRequest = (event) => {
    const { url, lockIdentifier } = event;

    if (event.lockIdentifier === 0 /* && react-native-webview 버전이 v10.8.3 이상 */) {
        /**
        * [feature/react-native-webview] 웹뷰 첫 렌더링시 lockIdentifier === 0
        * 이때 무조건 onShouldStartLoadWithRequest를 true 처리하기 때문에
        * Error Loading Page 에러가 발생하므로
        * 강제로 lockIdentifier를 1로 변환시키도록 아래 네이티브 코드 호출
        */
        RNCWebView.onShouldStartLoadWithRequestCallback(false, event.lockIdentifier);
    }

    if (event.url.startsWith('http://') || event.url.startsWith('https://') || event.url.startsWith('about:blank')) {
        return true;
    }
    if (Platform.OS === 'android') {
        //console.log('event.url', event.url);
        SendIntentAndroid.openChromeIntent(event.url)
        .then((isOpened) => {
            //console.log(isOpened);
            if (!isOpened) {
                Alert.alert('앱 실행이 실패했습니다');
            }
        })
        .catch((err) => {
            console.log(err);
        });
        return false;
    } else {
        Linking.openURL(event.url).catch((err) => {
            Alert.alert('앱 실행이 실패했습니다. 설치가 되어있지 않은 경우 설치하기 버튼을 눌러주세요.');
        });
        return false;
    }
  };

  React.useEffect(() => {
      setTimeout(() => {
          SplashScreen.hide();
      }, 1500);
  }, []);

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={{flex:1, height: height}}>
        <Webview
        ref={webViews}
        source={{uri:'https://dmonster1783.cafe24.com'}}
        useWebKit={false}
        sharedCookiesEnabled
        onNavigationStateChange={(webViews) => onNavigationStateChange(webViews)}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        javaScriptEnabledAndroid={true}
        allowFileAccess={true}
        renderLoading={true}
        mediaPlaybackRequiresUserAction={false}
        setJavaScriptEnabled = {false}
        scalesPageToFit={true}
        allowsFullscreenVideo={true}
        allowsInlineMediaPlayback={true}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        />
      </View>
    </SafeAreaView>
  );
};


export default App;
