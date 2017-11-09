/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import rates from '../rates.json';
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ActivityIndicator,
  ListView,
  Image
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
      amountToConvert: "1,000",
      flags:{"CAD": require("../resources/images/canada.png"),
             "GBP": require("../resources/images/united-kingdom.png"),
             "JPY": require("../resources/images/japan.png"),
             "EUR": require("../resources/images/european-union.png"),
             "CNY": require("../resources/images/china.png"),
             "USD": require("../resources/images/united-states-of-america.png")},
      country:{"CAD": "Canadian Dollar",
            "GBP": "Great Britain Pound",
            "JPY": "Japanese Yen",
            "EUR": "Euro",
            "CNY": "Chinese Yuan",
            "USD": "United States Dollar"}
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
      rates.rates[key].amount = (rates.rates[key].rate *  parseFloat(this.state.amountToConvert)).toFixed(2);
    }

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});    
    this.setState({dataSource: ds.cloneWithRows(rates.rates)});
  };

  renderItem = (rowData) => {

    var imagePath = require("../resources/images/canada.png");
    var description = "Unknown";
    if (this.state.flags[rowData.country]) {
      imagePath = this.state.flags[rowData.country];
      description = this.state.country[rowData.country];
    }

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
        <View style={styles.header}>
          <Image style={tableStyle.flagImage} source={require("../resources/images/canada.png")} />
          <Text style={styles.headerLabel}
              numberOfLines={1}>CAD</Text>
          <View style={tableStyle.textContainer}>
            <TextInput style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Amount"
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
    backgroundColor: '#dddddd'
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
    height: 120,
    marginTop: 25,
    alignSelf: 'stretch',    
    backgroundColor: "#2D2D2D",
    alignItems: "center",
    padding: 10,
  },
  headerLabel: {
    padding: 5,
    fontSize: 20,
    color: 'white'
  },
  input: {
    height: 44,
    borderColor: 'white',
    borderWidth: 0,
    borderRadius: 3,
    textAlign: 'right',
    fontSize: 30,
    fontWeight: "300",
    color: "white",
  },
});
