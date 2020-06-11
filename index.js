const test = require('ava');
const path = require('path')
const includes = require('lodash.includes');
const gitPath = path.join(__dirname, '../../../');
const simpleGit = require('simple-git/promise')

const {
  emulate,
  calculate_rsi
} = require('../some_path');

var stocks_to_check = [
  {symbol: 'MSFT', name : 'Microsoft Corp'},
  {symbol: 'PLW', name : '1-30 Laddered Treasury Invesco ETF'},
  {symbol: 'AYR', name : 'Aircastle Ltd'}
];

// files to watch for changes
var keyFiles = [
  // paths to files
]

var changes = simpleGit(gitPath).diffSummary();

Promise.resolve(changes).then(response => {
  var keyChange = false;
  for(let change of response.files){
    console.log( includes(keyFiles, change.file) )

    // if any of the key files changes then we will test
    if(includes(keyFiles,change.file)){
      keyChange = true;
    }
  }
  
  // test functions with stocks to check array
  if(keyChange){
    for(let stock of stocks_to_check){
      var recent;
      var rows;
      var symbol;
      var name;
      var currentDate;
      var description;
      var sector;

      // run serialized tests

      test.serial(`${stock.symbol} emulate with symbol and name`, async t => {
        const result = await emulate([stock], true);
        return Promise.all(result).then(values => {
          // test getting data
          if(/* Checked data */){
            t.pass();
          }else{
            t.fail();
          }

        })
      });

      test.serial(`${stock.symbol} pass RSI`, async t => {
        // test positive result
        var passRSI = await calculate_rsi(recent, rows, symbol, name, currentDate, description, sector, 'pass rsi');
        return Promise.resolve(passRSI).then(row => {
          if(row.rsi == 'passed'){
            t.pass();
          }else{
            t.fail();
          }
        });
      })

      test.serial(`${stock.symbol} fail RSI`, async t => {
        // test fail result
        var failRSI = await calculate_rsi(recent, rows, symbol, name, currentDate, description, sector, 'fail rsi');
        Promise.resolve(failRSI).then(row => {
          console.log('row' , row.rsi)
          if(row.rsi == 'failed'){
            t.pass();
          }else{
            t.fail();
          }
        });
      })
    }
  }

})
