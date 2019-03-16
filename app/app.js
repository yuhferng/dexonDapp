import './src/css/mainpage.css';
import './src/css/shop.css'
import { async } from 'q';
import { type } from 'os';

let claimed = false;
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
  const main = document.getElementById("main");
  const status = document.getElementById("status");
  const backyard = document.getElementById("backyard");

  const mainbut = document.getElementById("mainbut");
  const shopbut = document.getElementById("shopbut");
  const backyardbut = document.getElementById("backyardbut");

  function startahead(){
    main.style.display = 'inline';
    status.style.display = 'none';
    backyard.style.display = 'none';
  }
  startahead();
  //setupbc
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
        return 'ws://localhost:7545';
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
  const amountofSuitCase = document.getElementById('SCamount');
  const amountofLunchBox = document.getElementById('LBamount');
  const amountofCarKey = document.getElementById('CKamount');

  const carkeyimg = document.getElementById('carkeyimg');
  const suitcaseimg = document.getElementById('suitcaseimg');
  const lunchboximg = document.getElementById('lunchboximg');

  let LastClaim;
  contractWriter.methods.getPropertyNumbers().call({from: myAccount,}).then(data =>{
    amountofLunchBox.textContent = '數量：' + data.lunchbox;
    amountofSuitCase.textContent = '數量：' + data.suitcase;
    amountofCarKey.textContent = '數量：' + data.carkey;
    if(data.lunchbox > 0){
      lunchboximg.style.visibility='visible';
    }
    if(data.suitcase > 0){
      suitcaseimg.style.visibility='visible';
    }
    if(data.carkey > 0){
      carkeyimg.style.visibility='visible';
    }
    document.getElementById('wkcbalance').textContent = data.wkcbal;
    let lastclaimnum = Number(data.lastclaim);
    let now = Number(data.time);
    let nextav = lastclaimnum + 3600;
    console.log(nextav);
    console.log(now);
    console.log(lastclaimnum);
    if ( now <= nextav){
      let diff = nextav - now;
      console.log(diff);
      startTimer(diff,document.getElementById('claimbutton'));
      changetowait(document.getElementById('claimbutton'));
      claimed = true;
      document.getElementById('claimbutton').disabled = true;
    }
    LastClaim = new Date(lastclaimnum);
  });
  //---------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------//
  //------------------------main-page buttons----------------------------------//
  //----------------------------Pop ups----------------------------------------------------------//
  mainbut.onclick = async() => {
    main.style.display = 'inline';
    status.style.display = 'none';
    backyard.style.display = 'none';
  }
  shopbut.onclick = async() => {
    status.style.display = 'inline';
    main.style.display = 'none';
    backyard.style.display = 'none';
  }
  backyardbut.onclick = async() =>{
    backyard.style.display = 'inline';
    main.style.display = 'none';
    status.style.display = 'none';
    if(claimed == true){
      document.getElementById('hair').style.visibility="hidden";
    }else{
      document.getElementById('Nohair').style.visibility="hidden";
    }
  }

  //----------------------------Buy Stuff--------------------------------------------------------//
  const buyLunchBox = document.getElementById('buyLB');
  const buySuitCase = document.getElementById('buySC');
  const buyCarkey = document.getElementById('buyCK');
  
  buyLunchBox.onclick = async () =>{
    if(contractWriter && myAccount){
      await contractWriter.methods.BuyProperty('lunchBox', 1).send({
        from: myAccount,
      });
    }
    lunchboximg.style.visibility='visible';
  }
  
  buySuitCase.onclick = async () =>{
    if(contractWriter && myAccount){
      await contractWriter.methods.BuyProperty('suitCase', 1).send({
        from: myAccount,
      });
    }
    suitcaseimg.style.visibility='visible';
  }
  
  buyCarkey.onclick = async () =>{
    if(contractWriter && myAccount){
      await contractWriter.methods.BuyProperty('carKey', 1).send({
        from: myAccount, value: 1*10**18
      });
    }
    carkeyimg.style.visibility='visible';
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
  //---------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------//
  const claimbutton = document.getElementById('claimbutton');
  claimbutton.onclick = async () =>{
    if(contractWriter && myAccount){
      await contractWriter.methods.ClaimBackYard().send({
        from: myAccount,
    });
    }else{
      return;
    }
    document.getElementById('hair').style.visibility = 'hidden';
    document.getElementById('Nohair').style.visibility = 'visible';
    changetowait(claimbutton);
    claimed = true;
    startTimer(3600,claimbutton);
    claimbutton.disabled = true;
  }
  contractReader.events.WkcBalance({}, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('[Event] WkcBalance', data.returnValues.wkcamount);
    document.getElementById('wkcbalance').textContent = data.returnValues.wkcamount;
  });

  ///const readybut = document.getElementById('readybut');
  ///readybut.onclick = async ()=>{
  ///  if(contractWriter && myAccount){
  ///    await contractWriter.methods.CheckRequirement()
  ///    .send({from:myAccount})
  ///  }else{
  ///    return;
  ///  }
  ///}



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