import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import * as firebase from 'firebase';
import db from '../config.js';
import { get } from 'react-native/Libraries/Utilities/PixelRatio';
import { ThemeContext } from 'react-navigation';

export default class BookTransactionScreen extends React.Component {

  constructor(){

    super();
      this.state={
        hasCameraPermissions: null,
        scanned: false,
        scannedBookID: '',
        scannedStudentID:'',
        buttonState: 'normal',
        transactionMSG: '',
      }

  }

  getCameraPermissions = async (ID) => {

    const {status} = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({
        hasCameraPermissions: status === "granted",
        buttonState: ID,
        scanned: false,
      });

  }

  handleBarCodeScanned = async ({type,data}) => {
    this.setState({
      scanned: true, 
      scannedData: data, 
      buttonState: 'normal'
    });
  }

  initiateBookIssue = async() => {

    db.collection("transaction").add({
      'studentID': this.state.scannedStudentID,
      'bookID': this.state.scannedBookID,
      'data': firebase.firestore.Timestamp.now().toDate(),
      'transactionType': issued
    });

    db.collection("Books").doc(this.state.scannedBookID).update({
      'bookAvailability': false
    });

    db.collection("Students").doc(this.state.scannedStudentID).update({
      'numberOfBooksIssued': firebase.firestore.fieldValue.increment(1)
    });

    this.setState({
      scannedStudentID: '',
      scannedBookID: ''
    });

  }

  initiateBookReturn = async() => {

    db.collection("transaction").add({
      'studentID': this.state.scannedStudentID,
      'bookID': this.state.scannedBookID,
      'data': firebase.firestore.Timestamp.now().toDate(),
      'transactionType': returnType
    });

    db.collection("Books").doc(this.state.scannedBookID).update({
      'bookAvailability': true
    });

    db.collection("Students").doc(this.state.scannedStudentID).update({
      'numberOfBooksIssued': firebase.firestore.fieldValue.increment(-1)
    });

    this.setState({
      scannedStudentID: '',
      scannedBookID: ''
    });

  }

  handleTransaction = async() => {

    var transactionMSG = null;

    db.collection("Books").doc(this.state.scannedBookID).get().then((doc) => {

      var book = doc.data();

      if (book.bookAvailability){
          this.initiateBookIssue();
          transactionMSG = "bookIssued";
          ToastAndroid.show(transactionMSG, ToastAndroid.SHORT);
      } else {
        this.initiateBookReturn();
        transactionMSG = "bookReturned";
        ToastAndroid.show(transactionMSG, ToastAndroid.SHORT);
      }

    });

  }

    render(){

      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

        if(buttonState !== 'normal' && hasCameraPermissions){

            return(

              <BarCodeScanner 
                onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
              />

            );

        } else if(buttonState === 'normal'){
      
          return (
              
              <KeyboardAvoidingView 
                style={styles.container} 
                behavior = "padding" enabled>

                <View>

                  <Image source={require("../assets/booklogo.jpg")} style={{width:110, height:110}}/>
                  <Text style={{textAlign:'center', fontSize:10}}>Willy</Text>

                </View>

                <View style={styles.inputView}>
                  <TextInput 
                    style={styles.inputBox}
                    placeholder = "Book ID"
                    onChangeText={text =>{
                      this.setState({
                        scannedBookID:text
                      });
                    }}
                    value = {this.state.scannedBookID}
                  />

                    <TouchableOpacity 
                      style={styles.scanButton} 
                      onPress={this.getCameraPermissions("BookId")}
                    >
                      <Text style={styles.buttonText}>Scan</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputView}>
                  <TextInput 
                    style={styles.inputBox}
                    placeholder = "Student ID"
                    onChangeText = {text => {
                      this.setState({
                        scannedStudentID:text
                      });
                    }}
                    value = {this.state.scannedStudentID}
                  />
                </View>

                <TouchableOpacity 
                  style={styles.submitButton} 
                  onPress={async()=>{ var transactionMessage = await this.handleTransaction(); 
                }}> 
                  <Text style={styles.submitButtonText}>Submit</Text> 
                </TouchableOpacity>
                
              </KeyboardAvoidingView>
          
          );

        }
    }
}

const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }, 
  
  displayText: { 
    fontSize: 15, 
    textDecorationLine: 'underline' 
  }, 
  
  scanButton: { 
    backgroundColor: '#2196F3', 
    padding: 10, 
    margin: 10 
  }, 
  
  buttonText: { 
    fontSize: 15, 
    textAlign: 'center', 
    marginTop: 10 
  }, 
  
  inputView:{ 
    flexDirection: 'row', 
    margin: 20 
  }, 
  
  inputBox:{ 
    width: 200, 
    height: 40, 
    borderWidth: 1.5, 
    borderRightWidth: 0, 
    fontSize: 20 
  }, 
  
  scanButton:{ 
    backgroundColor: '#66BB6A', 
    width: 50, 
    borderWidth: 1.5, 
    borderLeftWidth: 0 
  }, 

  submitButton:{ 
    backgroundColor: '#FBC02D', 
    width: 100, height:50 
  }, 

  submitButtonText:{ 
    padding: 10, 
    textAlign: 'center', 
    fontSize: 20, 
    fontWeight:"bold", 
    color: 'white' 
  }

});