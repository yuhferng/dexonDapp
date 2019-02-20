import './src/css/popups-style.css';
import './src/css/style.css';
import './src/css/backyard.css';
import { async } from 'q';

window.open_shop = function(){
  var popup = document.getElementById('popups-shop');
  popup.style.visibility = 'visible';
}

window.open_balance = function() {
  var popup = document.getElementById('popups-balance');
  popup.style.visibility = 'visible';
}
window.close_shop = function() {
  var popup = document.getElementById('popups-shop');
  popup.style.visibility = 'hidden';
}

window.close_balance = function (){
  var popup = document.getElementById('popups-balance');
  popup.style.visibility = 'hidden';
}
window.goBackYard = function (){
  var mainleft = document.getElementById('main-left');
  var mainright = document.getElementById('main-right');
  mainleft.style.visibility = 'hidden';
  mainright.style.visibility = 'hidden';
  var backyard = document.getElementById('Backyard');
  backyard.style.visibility = 'visible';
  if ( document.getElementById('NoHair').style.visibility = 'hidden'){
    document.getElementById('Hair').style.visibility = 'visible';
  }else{
    document.getElementById('Hair').style.visibility = 'hidden';
  }
}


window.gohome = function (){
  var mainleft = document.getElementById('main-left');
  var mainright = document.getElementById('main-right');
  mainleft.style.visibility = 'visible';
  mainright.style.visibility = 'visible';
  var backyard = document.getElementById('Backyard');
  backyard.style.visibility = 'hidden';
  document.getElementById('NoHair').style.visibility = 'hidden';
}

window.Claim = function (){
  var claimbut = document.getElementById('claimhere');
  claimbut.style.background = 'transparent';
  claimbut.style.color = 'red';
  claimbut.style.borderColor = 'black';
  claimbut.textContent = ClaimCountDown;
}


const init = async () => {
  
  var Web3 = await import('web3');

  let httpHandler;
  let wsHandler;
  let netId;
  let myAccount;

  if (window.dexon) {
    await window.dexon.enable();
    httpHandler = new Web3.default(window.dexon);
    netId = await httpHandler.eth.net.getId();
    myAccount = (await httpHandler.eth.getAccounts())[0];
  }

  const getWebsocketEndpoint = () => {
    const DEXON_WS_ENDPOINT = (location.protocol === 'https:')
      ? 'wss://ws-proxy.dexon.org'
      : 'ws://testnet.dexon.org:8546';

    switch(netId) {
      case 5777: // If DekuSan is using local rpc
        return 'ws://localhost:8545';
      // If DekuSan is connect to testnet or not availble
      case 238:
      default:
        return DEXON_WS_ENDPOINT;
    }
  }
  const ws_endpoint = getWebsocketEndpoint();
  console.log(`Websocket endpoint: ${ws_endpoint}`);

  wsHandler = new Web3.default(ws_endpoint);

  const contractInfo = (await import('../build/contracts/MakeWeWork.json')).default;
  const { abi, networks } = contractInfo;
  // If there's no netId, we use 238 as default network
  const address = networks[netId || 238].address;

  let contractReader;
  let contractWriter;

  // contractReader is created from wsHandler
  contractReader = new wsHandler.eth.Contract(abi, address);

  // contractWriter is created from httpHandler
  if (httpHandler) {
    contractWriter = new httpHandler.eth.Contract(abi, address);
  }

  // DOM Element to display "value" in contract
  
  //const valueDisplayElement = document.getElementById('value');
  
  // Get current value and display it
  
  //const roundindex = await contractReader.methods.roundidx().call();
  const userProperty = await contractReader.methods.getPropertyNumbers().call();
  const amountofSuitCase = document.getElementById('suitCaseAmount');
  const amountofLunchBox = document.getElementById('lunchBoxAmount');
  const amountofCarKey = document.getElementById('carKeyAmount');
  
  amountofSuitCase.textContent = '數量：' + userProperty[0];
  amountofLunchBox.textContent = '數量：' + userProperty[1];
  amountofCarKey.textContent = '數量：' +userProperty[2];
  
  const tableProperty = await contractReader.methods.getTableStatus().call();
  const gamerRankOutput = await contractReader.methods.getGamerRank().call();
  const UserWkcBal = await contractReader.methods.returnBalance().call();

  //const wkcbalance = document.getElementById('wkcbalance');
  //wkcbalance.textContent = contractReader.methods.returnBalance().call();
  console.log(UserWkcBal);
  document.getElementById('wkcbalance').textContent = UserWkcBal;
  const claimwkc = document.getElementById('claimhere');
  claimwkc.onclick = async () =>{
    var claimbut = document.getElementById('claimhere');
    document.getElementById('Hair').style.visibility = 'hidden';
    document.getElementById('NoHair').style.visibility = 'visible';
    claimbut.style.background = 'transparent';
    claimbut.style.color = 'red';
    claimbut.style.borderColor = 'black';
    claimbut.textContent = '???????';
    if(contractWriter && myAccount){
      await contractWriter.methods.ClaimBackYard().send({
        from: myAccount,
      });
    }
  }
  contractReader.events.WkcBalance({}, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('[Event] WkcBalance', data.returnValues.wkcamount);
    document.getElementById('wkcbalance').textContent = data.returnValues.wkcamount;
  });

  /*const table = document.getElementById('table');
  const tableSuitCase = document.getElementById('tableSuitCase');
  const tableLunchBox = document.getElementById('tableLunchBox');
  const tableCarKey = document.getElementById('tableCarKey');
  const gamerRankData = document.getElementById('gamerRankData');
  
  
  table.textContent = tableProperty[0];
  tableSuitCase.textContent = tableProperty[1];
  tableLunchBox.textContent = tableProperty[2];
  tableCarKey.textContent = tableProperty[3];
  gamerRankData.textContent = gamerRankOutput[0];*/

  const buyLunchBox = document.getElementById('buyProperty1');
  const buySuitCase = document.getElementById('buyProperty2');
  const buyCarkey = document.getElementById('buyProperty3');

  buyLunchBox.onclick = async () =>{
    if(contractWriter && myAccount){
      await contractWriter.methods.BuyProperty('lunchBox', 1).send({
        from: myAccount,
      });
    }
  }
  contractReader.events.BuyPropertyEvent({}, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('[Event] BuyProperty ', data.returnValues.cargo);
    const userProperty = contractReader.methods.getPropertyNumbers().call();
    if (data.returnValues.cargo == 'lunchBox'){
      amountofLunchBox.textContent = '數量：' +data.returnValues.amount;
      console.log(data.returnValues.amount);
    }else if(data.returnValues.cargo == 'suitCase'){
      amountofSuitCase.textContent = '數量：' + data.returnValues.amount;
    }else if(data.returnValues.cargo == 'carKey'){
      amountofCarKey.textContent = '數量：' + data.returnValues.amount;
    }
  });

  buySuitCase.onclick = async () =>{
    if(contractWriter && myAccount){
      await contractWriter.methods.BuyProperty('suitCase', 1).send({
        from: myAccount,
      });
    }
  }

  buyCarkey.onclick = async () =>{
    if(contractWriter && myAccount){
      await contractWriter.methods.BuyProperty('carKey', 1).send({
        from: myAccount, value: 1*10**18
      });
    }
  }
  
  const addLunchBox = document.getElementById('addProperty1');
  const addSuitCase = document.getElementById('addProperty2');
  const addCarkey = document.getElementById('addProperty3');

  addLunchBox.onclick = async () =>{
    if(contractWriter && myAccount){
      await contractWriter.methods.addRequirement('suitCase').send({
        from: myAccount,
      });
    }
    document.getElementById('SC').style.visibility = 'visible';
  }

  addSuitCase.onclick = async () =>{
    if(contractWriter && myAccount){
      await contractWriter.methods.addRequirement('lunchBox').send({
        from: myAccount,
      });
    }
    document.getElementById('LB').style.visibility = 'visible';
  }

  addCarkey.onclick = async () =>{
    if(contractWriter && myAccount){
      await contractWriter.methods.addRequirement('carKey').send({
        from: myAccount,
      });
    }
    document.getElementById('CK').style.visibility = 'visible';
  }



  // DOM Element to display "value" in contract
  const registerDisplayElement = document.getElementById('registered');
  // Get current value and display it
  const val = await contractReader.methods.getPlayerInitStatus().call();
  registerDisplayElement.textContent = val;

  // Subscribe to "UpdateNumber" event in order to have "value" updated automatically
  contractReader.events.PlayerInitialized({}, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('[Event] UpdateNumber', data.returnValues.playerAddr);
    registerDisplayElement.textContent = data.returnValues.playerAddr;
    
  });

  // Call "update" function in the contract when we click on the update button
  const registerButton = document.getElementById('register');
  registerButton.onclick = async () => {
    if (contractWriter && myAccount) {
      await contractWriter.methods.gamerRegistering().send({
        from: myAccount,
      });
    }
  }

  const goToWorkButton = document.getElementById('goToWork');
  goToWorkButton.onclick = async () => {
    if (contractWriter && myAccount) {
      await contractWriter.methods.GoToWorkThisRound().send({
        from: myAccount,
      });
    }
  }
};

init();