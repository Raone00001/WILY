import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import BookTransactionScreen from './screens/bookT';
import SearchScreen from './screens/searchS';

export default class App extends React.Component {
  render(){

    return (

      <AppContainer/>

    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const TabNavigator = createBottomTabNavigator({

  Transaction:{screen: BookTransactionScreen},
  Search:{screen: SearchScreen}

},
    {
      defaultNavigationOptions:({navigation}) => ({

      tabBarIcon:() => {

        const routeName = navigation.state.routeName;
        console.log(routeName);

        if(routeName === "Transaction")
        {

            return(
              <Image source={require("./assets/book.png")}
              style={{width:40, height:40}}
              />
            )

        } else if(routeName === "Search")
        {

          return(
            <Image source={require("./assets/book.png")}
            style={{width:40, height:40}}
            />

          )

        }

      }


    })

  }

)

const AppContainer = createAppContainer(TabNavigator);