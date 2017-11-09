/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import rates from '../rates.json';
import countryDescription from '../countryDescription.json';
import React, { Component } from 'react';
import DarkTheme from './DarkTheme';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ActivityIndicator,
  ListView,
  Image,
  StatusBar
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.setState({
      isLoading: false,
      dataSource: ds.cloneWithRows(rates.rates),
      amountToConvert: "",
      flags:{
        "AUD": require("../resources/images/aud.png"),
        "BGN": require("../resources/images/bgn.png"),
        "BRL": require("../resources/images/brl.png"),
        "CHF": require("../resources/images/chf.png"),
        "CNY": require("../resources/images/cny.png"),
        "CZK": require("../resources/images/czk.png"),
        "DKK": require("../resources/images/dkk.png"),
        "EUR": require("../resources/images/eur.png"),
        "GBP": require("../resources/images/gbp.png"),
        "HKD": require("../resources/images/hkd.png"),
        "HRK": require("../resources/images/hrk.png"),
        "HUF": require("../resources/images/huf.png"),
        "IDR": require("../resources/images/idr.png"),
        "ILS": require("../resources/images/ils.png"),
        "INR": require("../resources/images/inr.png"),
        "JPY": require("../resources/images/jpy.png"),
        "KRW": require("../resources/images/krw.png"),
        "MXN": require("../resources/images/mxn.png"),
        "MYR": require("../resources/images/myr.png"),
        "NOK": require("../resources/images/nok.png"),
        "NZD": require("../resources/images/nzd.png"),
        "PHP": require("../resources/images/php.png"),
        "PLN": require("../resources/images/pln.png"),
        "RON": require("../resources/images/ron.png"),
        "RUB": require("../resources/images/rub.png"),
        "SEK": require("../resources/images/sek.png"),
        "SGD": require("../resources/images/sgd.png"),
        "THB": require("../resources/images/thb.png"),
        "TRY": require("../resources/images/try.png"),
        "USD": require("../resources/images/usd.png"),
        "ZAR": require("../resources/images/zar.png")
      },
      country: countryDescription
    });

    // return fetch('https://api.fixer.io/latest?base=CAD')
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    //     this.setState({
    //       isLoading: false,
    //       dataSource: ds.cloneWithRows(responseJson.rates),
    //     }, function() {
    //     });
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }

  _onAmountChanged = (event) => {
    this.setState({amountToConvert: event.nativeEvent.text});

    for(var key in rates.rates) {
      var value = rates.rates[key];
      var amount = (rates.rates[key].rate * parseFloat(event.nativeEvent.text)).toFixed(2);

      if (isNaN(amount)) {
        amount = '0.00';
      }

      rates.rates[key].amount = amount;
    }

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});    
    this.setState({dataSource: ds.cloneWithRows(rates.rates)});
  };

  renderItem = (rowData) => {

    var imagePath = require("../resources/images/cad.png");
    if (this.state.flags[rowData.country]) {
      imagePath = this.state.flags[rowData.country];
    }

    var description = this.state.country[rowData.country];

    return <View>
        <View style={tableStyle.rowContainer}>
          <Image style={tableStyle.flagImage} source={imagePath} />
          <Text style={tableStyle.title}
              numberOfLines={1}>{rowData.country}</Text>
          <View style={tableStyle.textContainer}>
            <Text style={tableStyle.price}>{rowData.amount}</Text>
            <Text style={tableStyle.country}>{description}</Text>
          </View>
        </View>
        <View style={tableStyle.separator}/>
      </View>
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
         <StatusBar
          backgroundColor="blue"
          barStyle="light-content"/>
        <View style={styles.header}>
          <Image style={tableStyle.flagImage} source={require("../resources/images/cad.png")} />
          <Text style={styles.headerLabel}
              numberOfLines={1}>CAD</Text>
          <View style={tableStyle.textContainer}>
            <TextInput style={styles.input}
                keyboardType="numeric"
                underlineColorAndroid='transparent'
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Amount"
                placeholderTextColor='#888888'
                onChange={this._onAmountChanged}
                value={this.state.amountToConvert} />
          </View>
        </View>
        {/* <TouchableHighlight
          style={styles.button}
          onPress={() => this._convertButtonPressed()}>
          <Text style={styles.buttonText}>Convert</Text>
        </TouchableHighlight> */}
        <ListView style={styles.listView}
          dataSource={this.state.dataSource}
          renderRow={
            this.renderItem
          }
        />
      </View>
    );
  }
}

const tableStyle = StyleSheet.create({
  flagImage: {
    width: 54,
    height: 54,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee'
  },
  price: {
    fontSize: 24,
    fontWeight: '200',
    color: '#2D2D2D',
    textAlign: 'right'
  },
  country: {
    fontSize: 14,
    fontWeight: '100',
    color: '#2D2D2D',
    textAlign: 'right'
  },
  title: {
    padding: 5,
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center'
  },
  headerView: {
    height: 200,
    backgroundColor: 'blue'
  },
});

const styles = StyleSheet.create({
  icon: { 
    width: 44, 
    height: 44,
  },
  listView: {
    flex: 1,
    alignSelf: 'stretch',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
  button: {
    marginTop: 15,
    backgroundColor: '#D63B30',
    width: 250,
    height: 44,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    height: 140,
    alignSelf: 'stretch',    
    backgroundColor: "#2D2D2D",
    alignItems: "center",
    padding: 10,
    paddingTop: 40,
  },
  headerLabel: {
    padding: 5,
    fontSize: 20,
    color: 'white'
  },
  input: {
    height: 60,
    borderColor: 'white',
    borderWidth: 0,
    borderRadius: 3,
    textAlign: 'right',
    fontSize: 30,
    fontWeight: "300",
    color: "white"
  },
});
