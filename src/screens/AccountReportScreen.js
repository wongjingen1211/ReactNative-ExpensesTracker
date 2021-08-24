import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Animated,
  Platform,
  AsyncStorage,
} from 'react-native';
import {VictoryPie} from 'victory-native';

import {Svg} from 'react-native-svg';

import {COLORS, FONTS, SIZES, icons} from '../../component';

import MonthPicker from 'react-native-month-year-picker';
import {Component} from 'react/cjs/react.production.min';

let config = require('../../Config');

let monthsText = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

let colorScales = [
  COLORS.primary,
  COLORS.lightBlue,
  COLORS.darkgreen,
  COLORS.peach,
  COLORS.purple,
  COLORS.red,
  COLORS.primary,
  COLORS.lightBlue,
  COLORS.darkgreen,
  COLORS.peach,
  COLORS.purple,
  COLORS.red,
  COLORS.primary,
  COLORS.lightBlue,
  COLORS.darkgreen,
  COLORS.peach,
  COLORS.purple,
  COLORS.red,
];

class AccountReportScreen extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      reportData: [],
      viewMode: 'chart',
      selectedCategory: null,
      selected_date: new Date(),
      dateInString: 'Nan',
      show: false,
      totalAmount: 0,
      startTimepasser: 0,
      endTimepasser: 0,
    };

    this._selectAllCategory_inMonth =
      this._selectAllCategory_inMonth.bind(this);
    this._onValueChange = this._onValueChange.bind(this);
  }

  componentDidMount() {
    this._selectAllCategory_inMonth();
  }

  async _saveSetting(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('## ERROR SAVING ITEM ##: ', error);
    }
  }

  //this function is to retrive the data in selected month, will retrieve the total amount of each categories spent in the selected month.-------
  //each return row has 2 attributes {'total','category_name'}
  _selectAllCategory_inMonth() {
    //preprocess the date format----------
    var selectedDate = this.state.selected_date; //change the 'this.state.date' to the correct date input, just need to make sure it is number of milliseconds like normal DateTimePicker do.

    var selectedmonth = new Date(selectedDate).getMonth();
    var selectedyear = new Date(selectedDate).getFullYear();

    var selectedMonthName = monthsText[selectedmonth];

    let nextmonthPointer = monthsText.indexOf(selectedMonthName) + 1; //point to next month
    let nextmonthName = '';

    let selectedMonth_parsed = Date.parse(
      selectedMonthName + ' 1,' + selectedyear,
    ); //(data type: integer)the first day of the selected month in integer format. Ex: 1 Aug 2021 for August 2021, 1 Sept 2021 for September 2021.
    let nextMonth_parsed = ''; //(data type: integer)the first day of the next month in integer format. Ex: 1 Sept 2021 for August 2021, 1 Oct 2021 for 1 September 2021.
    let nextYear = selectedyear;
    if (nextmonthPointer === 12) {
      nextmonthName = monthsText[0];
      nextYear = selectedyear + 1;
      nextMonth_parsed = Date.parse(nextmonthName + ' 1,' + nextYear);
    } else {
      nextmonthName = monthsText[nextmonthPointer];
      nextMonth_parsed = Date.parse(nextmonthName + ' 1,' + nextYear);
    }
    let monthYear = selectedMonthName + ',' + selectedyear;

    this.setState({dateInString: monthYear});
    console.log(
      'Viewing Transactions from:' +
        selectedMonthName +
        selectedyear +
        ' to ' +
        nextmonthName +
        nextYear,
    );
    this.setState({
      startTimepasser: selectedMonth_parsed,
      endTimepasser: nextMonth_parsed,
    }); //set value to pass to next page

    //preprocess the date format----------
    let url =
      config.settings.serverPath +
      '/api/transaction/monthlyReport/' +
      selectedMonth_parsed +
      '/' +
      nextMonth_parsed;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error', response.status.toString());
          throw Error('Error ' + response.status);
        }
        return response.json();
      })
      .then(reportData => {
        if (reportData.length > 0) {
          this.setState({reportData: reportData}); //returned rows of {'total','category_name'}
          var total = 0;
          for (let index in reportData) {
            total += parseFloat(reportData[index]['total']);
          }
          this.setState({totalAmount: total});
        } else {
          reportData = [{category_name: 'No', total: 'Records'}];
          this.setState({reportData: reportData});
          this.setState({totalAmount: 0});
        }

        console.log(reportData);
      })
      .catch(error => {
        console.error(error);
      });
  }
  //---------------------------------------------------------------------------------------------------------------------------------------

  _onValueChange(event, newDate) {
    this.setState({selected_date: newDate});

    this.setState({show: false});
    this._selectAllCategory_inMonth();
  }

  render() {
    //Data display on pie chart
    let chartData = this.state.reportData.map(item => {
      return {
        x: item.category_name,
        y: item.total,
      };
    });

    console.log('Rendering');
    console.log(chartData);

    const getHeader = () => {
      return (
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: SIZES.radius,
            height: 40,
          }}>
          <Text style={{fontSize: 20, left: 20}}>{'Categories'}</Text>
          <Text style={{fontSize: 20, position: 'absolute', right: 40}}>
            {'Total (RM)'}
          </Text>
        </View>
      );
    };

    const getFooter = () => {
      return <Text>{''}</Text>;
    };

    const maxDate = new Date(); // Today
    const minDate = new Date(2000, 1, 1);
    var date = this.state.selected_date;
    return (
      <View style={{flex: 1, backgroundColor: COLORS.lightGray2}}>
        {/* Header section */}
        {<View style={{paddingHorizontal: SIZES.padding}}></View>}

        {/* Category Header Section */}
        {
          <View
            style={{
              flexDirection: 'row',
              padding: SIZES.padding,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                marginTop: SIZES.padding,
                marginLeft: SIZES.padding,
                alignItems: 'center',
              }}
              onPress={() => this.setState({show: true})}>
              <View
                style={{
                  backgroundColor: COLORS.lightGray,
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assets/icons/calendar_icon.png')}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: COLORS.lightBlue,
                  }}
                />
                <Text>{this.state.dateInString}</Text>
              </View>
              {this.state.show && (
                <MonthPicker
                  onChange={this._onValueChange}
                  value={date}
                  minimumDate={minDate}
                  maximumDate={maxDate}
                  mode="short"
                  locale="en"
                />
              )}
            </TouchableOpacity>
            {/* Title */}
            <View>
              <Text style={{color: COLORS.primary, ...FONTS.h3}}>
                CATEGORIES
              </Text>
              <Text style={{color: COLORS.darkgray, ...FONTS.body4}}>
                {this.state.reportData.length} Total
              </Text>
            </View>
          </View>
        }

        <ScrollView>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#e8e8e8',
            }}>
            <Svg width={SIZES.width} height={SIZES.width}>
              <VictoryPie
                colorScale={colorScales}
                standalone={false} // Android workaround
                data={chartData}
                labels={({datum}) =>
                  `${datum.x}(${Math.round(
                    (datum.y / this.state.totalAmount) * 100,
                  )}%)`
                }
                innerRadius={70}
                labelRadius={({innerRadius}) =>
                  (SIZES.width * 0.4 + innerRadius) / 2.5
                }
                style={{
                  labels: {fill: 'black', ...FONTS.body3},
                  parent: {
                    ...styles.shadow,
                  },
                }}
                width={SIZES.width}
                height={SIZES.width}
              />
            </Svg>
            <View style={{position: 'absolute', top: '42%', left: '38%'}}>
              <Text style={{...FONTS.body3, textAlign: 'center'}}>
                {this.state.totalAmount}
              </Text>
              <Text style={{...FONTS.body3, textAlign: 'center'}}>
                Total Amount
              </Text>
            </View>
          </View>

          <View style={{padding: SIZES.padding}}>
            <SafeAreaView style={{flex: 1}}>
              <FlatList
                data={this.state.reportData}
                extraData={this.state}
                showsVerticalScrollIndicator={true}
                ListHeaderComponent={getHeader}
                ListFooterComponent={getFooter}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        paddingHorizontal: SIZES.radius,
                        height: 40,
                        backgroundColor: '#dbdbdb',
                      }}
                      onPress={() => {
                        this._saveSetting(
                          'start_MonthYear',
                          String(this.state.startTimepasser),
                        );
                        console.log('Saved start_MonthYear in async storage');
                        this._saveSetting(
                          'end_MonthYear',
                          String(this.state.endTimepasser),
                        );
                        console.log('Saved end_MonthYear in async storage');
                        this.props.navigation.navigate('M_Category', {
                          categoryName: item.category_name,
                          refresh: this._selectAllCategory_inMonth,
                        });
                      }}>
                      <Text style={{left: 20, fontSize: 18}}>
                        {item.category_name}
                      </Text>
                      <Text
                        style={{right: 40, fontSize: 18, position: 'absolute'}}>
                        {item.total}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </SafeAreaView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
});

export default AccountReportScreen;
