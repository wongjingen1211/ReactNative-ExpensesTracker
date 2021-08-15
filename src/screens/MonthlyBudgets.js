import React, { Component, PureComponent } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    FlatList,
    AppState,
} from 'react-native';
import { FloatingAction } from 'react-native-floating-action';

const actions = [{
    text: 'Add',
    icon: require('../../assets/icons/create.png'),
    name: 'add',
    position: 1
}, {
    text: 'Delete',
    color: '#c80000',
    icon: require('../../assets/icons/delete.png'),
    name: 'delete',
    position: 2
}
];

//let common = require('./CommonData');
//let SQLite = require('react-native-sqlite-storage');

type Props = {};
export default class MonthlyBudgets extends Component {
    /* static navigationOptions = {
       title: 'Students List',
     };
   
     constructor(props) {
       super(props)
   
       this.state = {
         students: [],
       };
   
       this._query = this._query.bind(this);
   
       this.db = SQLite.openDatabase({
         name: 'studentdb',
         createFromLocation: '~db.sqlite'
       }, this.openDb, this.errorDb);
     }
   
     componentDidMount() {
       this._query();
     }
   
     _query() {
       this.db.transaction((tx) => {
         tx.executeSql('SELECT * FROM students ORDER BY name', [], (tx, results) => {
           this.setState({
             students: results.rows.raw(),
           })
         })
       });
     }
   
     openDb() {
       console.log('Database opened');
     }
   
     errorDb(err) {
       console.log('SQL Error: ' + err);
     }
   */
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                /**      data={this.state.students}
                      extraData={this.state}
                      showsVerticalScrollIndicator={true}
                      renderItem={({ item }) =>
                        <TouchableHighlight
                          underlayColor={'#cccccc'}
                          onPress={() => {
                            this.props.navigation.navigate('View', {
                              id: item.id,
                              headerTitle: item.name,
                              refresh: this._query,
                            })
                          }}
                         
                        >
                          <View style={styles.item}>
                            <Text style={styles.itemTitle}>{item.name}</Text>
                            <Text style={styles.itemSubtitle}>{common.getValue(common.states, item.state)}</Text>
                          </View>
                        </TouchableHighlight>
                      }
                      keyExtractor={(item) => { item.id.toString() }}*/
                />
                <FloatingAction
                    actions={actions}
                    color={'lightblue'}

                    onPressItem={(name) => {
                        switch (name) {
                            case 'add':
                                /* onPressItem={
                                        () => {
                                        this.props.navigation.navigate('Create', {
                                            refresh: this._query,
                                        })
                                        }
                                    }*/
                                break;

                            case 'delete':
                                //    this._delete();
                                break;
                        }
                    }
                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
    },
    item: {
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 25,
        paddingRight: 25,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    itemTitle: {
        fontSize: 22,
        fontWeight: '500',
        color: '#000',

    },
    itemSubtitle: {
        fontSize: 18,
    }
});
