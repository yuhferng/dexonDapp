console.log('WELCOME TO DEXON WORKSHOP');

import './src/css/popups-style.css';
import './src/css/style.css';

function open_shop(){
  var popup = document.getElementById('popups-shop');
  popup.style.visibility = 'visible';
}

function open_balance(){
  var popup = document.getElementById('popups-balance');
  popup.style.visibility = 'visible';
}

function close_shop(){
  var popup = document.getElementById('popups-shop');
  popup.style.visibility = 'hidden';
}

function close_balance(){
  var popup = document.getElementById('popups-balance');
  popup.style.visibility = 'hidden';
}

const init = async () => {
  /**
   * Make sure that when you get here, basic UI has already been rendered.
   * Web3 bundle is large so we might want to import it asynchronounsly
   *
   * Web3 team is working on reducing the bundle size, let's see how it goes
   * https://github.com/ethereum/web3.js/pull/2000
   */
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

  const GetBalance = contractReader.methods.UserBalance().call();
  // DOM Element to display "value" in contract
  const UserBalanceWkc = document.getElementById('wkcbalance');
  UserBalanceWkc.textContent = GetBalance[0];
  const UserBalanceDxn = document.getElementById('dxnbalance');
  UserBalanceDxn.textContent = GetBalance[1];


  /*const UserProperty = await contractReader.methods.getPropertyNumbers().call();
  const AmountofSuitCase = document.getElementById('SuitCaseAmount');
  const AmountofLunchBox = document.getElementById('LunchBoxAmount');
  const AmountofCarkey = document.getElementById('CarkeyAmount');
  
  AmountofSuitCase.textContent = UserProperty[0];
  AmountofLunchBox.textContent = UserProperty[1];
  AmountofCarkey.textContent = UserProperty[2];
// Call "update" function in the contract when we click on the update button
  const useSuitCase = document.getElementById('UseProperty1');
  const useLunchBox = document.getElementById('UseProperty2');
  const useCarkey = document.getElementById('UseProperty3');

  useSuitCase.onclick = async () =>{
    if(contractWriter && myAccount){
      await contractWriter.methods.addRequirement('SuitCase').send({
        from: myAccount,
      });
      useSuitCase.textContent -= 1;
    }
  }

  useLunchBox.onclick = async () =>{
    if(contractWriter && myAccount){
      await contractWriter.methods.addRequirement('LunchBox').send({
        from: myAccount,
      });
      useLunchBox.textContent -= 1;
    }
  }

  useCarkey.onclick = async () =>{
    if(contractWriter && myAccount){
      await contractWriter.methods.addRequirement('Carkey').send({
        from: myAccount,
      });
      useCarkey.textContent -= 1;
    }
  }
  
  // Subscribe to "UpdateNumber" event in order to have "value" updated automatically
  contractReader.events.UpdateNumber({}, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('[Event] UpdateNumber', data.returnValues.value);
    valueDisplayElement.textContent = data.returnValues.value;
  });
  CarkeyAmount.onclick = async () => {
    if (contractWriter && myAccount){
      await contractWriter.methods.
    }
  }
  */
};

init();