import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const Documentation = () => {
    return (
        <View style={styles.container}>
            <WebView
                source={require('../../assets/Documentation.pdf')}
                style={styles.webview}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
});

export default Documentation;