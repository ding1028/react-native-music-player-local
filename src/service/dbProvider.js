import React, {Component} from 'react';
let SQLite = require('react-native-sqlite-storage')
let db = SQLite.openDatabase({name: 'buzzbus.db', createFromLocation : "~buzzbus.db", location: 'Library'}, null, null);
export function signUpUser(first_name, last_name, email, address, city, state, zip){

  db.transaction((tx) => {
  	  tx.executeSql("INSERT INTO User (first_name, last_name, email, address, city, state, zip) VALUES ('"+first_name+"', '"+last_name+"', '"+email+"', '"+address+"', '"+city+"','"+state+"', '"+zip+"')");
    });
	return 'success';
}

export function readUser(cb){
   db.transaction((tx) => {
      tx.executeSql('SELECT * FROM User', [], (tx, results) => {
          console.log("Query completed");
          var data= [];
          var len = results.rows.length;
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            data[i] = row;

          }
                cb(data);

        });
    });

}