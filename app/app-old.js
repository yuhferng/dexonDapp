import './src/css/popups-style.css';
import './src/css/style.css';
import './src/css/backyard.css';
import './src/css/portrait.css';
import { async } from 'q';
import { type } from 'os';

let claimed = false;
window.open_shop = function(){
  var popup = document.getElementById('popups-shop');
  popup.style.visibility = 'visible';
}
window.close_shop = function() {
  var popup = document.getElementById('popups-shop');
  popup.style.visibility = 'hidden';
}
window.goBackYard = function (){
  var mainleft = document.getElementById('main-left');
  var mainright = document.getElementById('main-right');
  mainleft.style.visibility = 'hidden';
  mainright.style.visibility = 'hidden';
  var backyard = document.getElementById('Backyard');
  backyard.style.visibility = 'visible';
  if (claimed == true){
    document.getElementById('Hair').style.visibility = 'hidden';
    document.getElementById('NoHair').style.visibility = 'visible';
  }
}
window.gohome = function (){
  var mainleft = document.getElementById('main-left');
  var mainright = document.getElementById('main-right');
  mainleft.style.visibility = 'visible';
  mainright.style.visibility = 'visible';
  var backyard = document.getElementById('Backyard');
  document.getElementById('NoHair').style.visibility = 'hidden';
  backyard.style.visibility = 'hidden';
}
window.startTimer = function(duration, display) {
  var timer = duration, minutes, seconds;
  setInterval(function () {
      minutes = parseInt(timer / 60, 10)
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
          timer = duration;
      }
  }, 1000);
}

window.changetowait = function(display){
  display.style.background = 'transparent';
  display.style.color = 'red';
  display.style.borderColor = 'black';
}
const init = async () => {
  
  //Set up
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

  //---------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------// 
  //---------------------------------------------------------------------------------------------//
  //GAME ITSELF
  //const roundindex = await contractReader.methods.roundidx().call();
  const amountofSuitCase = document.getElementById('suitCaseAmount');
  const amountofLunchBox = document.getElementById('lunchBoxAmount');
  const amountofCarKey = document.getElementById('carKeyAmount');
  let LastClaim;
  contractWriter.methods.getPropertyNumbers().call({from: myAccount,}).then(data =>{
    amountofLunchBox.textContent = '數量：' + data.lunchbox;
    amountofSuitCase.textContent = '數量：' + data.suitcase;
    amountofCarKey.textContent = '數量：' + data.carkey;
    document.getElementById('wkcbalance').textContent = data.wkcbal;
    let lastclaimnum = Number(data.lastclaim);
    let nextav = lastclaimnum + 3600000;
    if ( Date.now() <= nextav){
      let diff = nextav - Date.now();
      diff = Math.floor(diff / 1000);
      console.log(diff);
      startTimer(diff,document.getElementById('claimhere'));
      changetowait(document.getElementById('claimhere'));
      claimed = true;
      document.getElementById('claimhere').disabled = true;
    }
    LastClaim = new Date(lastclaimnum);
  });
  //countdown//
  //------------//
  
  const tableProperty = await contractReader.methods.getTableStatus().call();
  const gamerRankOutput = await contractReader.methods.getGamerRank().call();
  const UserWkcBal = await contractReader.methods.returnBalance().call();

  //const wkcbalance = document.getElementById('wkcbalance');
  //wkcbalance.textContent = contractReader.methods.returnBalance().call();
  //console.log(UserWkcBal);
  //---------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------//
  //------------------------main-page buttons----------------------------------//
  //----------------------------Pop ups----------------------------------------------------------//
  const popupsbalance = document.getElementById('balbut');
  const balanceclose = document.getElementById('quitbal');
  popupsbalance.onclick = async() => {
    var popup = document.getElementById('popups-balance');
    popup.style.visibility = 'visible';
  }
  balanceclose.onclick = async() => {
    var popup = document.getElementById('popups-balance');
    popup.style.visibility = 'hidden';
  }

  //----------------------------Buy Stuff--------------------------------------------------------//
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
  
  contractReader.events.BuyPropertyEvent({}, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('[Event] BuyProperty ', data.returnValues.cargo,' ',data.returnValues.amount);
    if (data.returnValues.cargo == 'lunchBox'){
      amountofLunchBox.textContent = '數量：' + data.returnValues.amount;
    }else if(data.returnValues.cargo == 'suitCase'){
      amountofSuitCase.textContent = '數量：' + data.returnValues.amount;
    }else if(data.returnValues.cargo == 'carKey'){
      amountofCarKey.textContent = '數量：' + data.returnValues.amount;
    }
  });
  //----------------------------Add Stuff--------------------------------------------------------//
  const addSuitCase = document.getElementById('addProperty1');
  const addLunchBox = document.getElementById('addProperty2');
  const addCarkey = document.getElementById('addProperty3');
  
  addSuitCase.onclick = async () =>{
    if(contractWriter && myAccount){
      await contractWriter.methods.addRequirement('suitCase').send({
        from: myAccount,
      });
    }
    document.getElementById('SC').style.visibility = 'visible';
  }
  
  addLunchBox.onclick = async () =>{
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
  //---------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------//
  const claimwkc = document.getElementById('claimhere');
  claimwkc.onclick = async () =>{
    if(contractWriter && myAccount){
      await contractWriter.methods.ClaimBackYard(Date.now()).send({
        from: myAccount,
      });
    }else{
      return;
    }
    var claimbut = document.getElementById('claimhere');
    document.getElementById('Hair').style.visibility = 'hidden';
    document.getElementById('NoHair').style.visibility = 'visible';
    changetowait(claimbut);
    claimed = true;
    startTimer(3600,claimbut);
    claimbut.disabled = true;
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




  // DOM Element to display "value" in contract
  //const registerDisplayElement = document.getElementById('registered');
  // Get current value and display it
  //const val = await contractReader.methods.getPlayerInitStatus().call();
  //registerDisplayElement.textContent = val;

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