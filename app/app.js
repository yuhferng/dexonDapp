console.log('WELCOME TO DEXON WORKSHOP');

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

  if (window.dexon && window.dexon.publicConfigStore) {
    const store = window.dexon.publicConfigStore;
  
    // current active account is store.getState().selectedAddress
    ACCOUNT = store.getState().selectedAddress;
  
    // when user switches account, an event is dispatched to publicConfigStore
    store.on(
      'update',
      ({ selectedAddress }) => ACCOUNT = selectedAddress
    );
  }
  
  myAccount =  await ACCOUNT
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
  const userProperty = await contractReader.methods.getPropertyNumbers().call({
    from: myAccount,
  });
  const amountofSuitCase = document.getElementById('suitCaseAmount');
  const amountofLunchBox = document.getElementById('lunchBoxAmount');
  const amountofCarKey = document.getElementById('carKeyAmount');
  
  amountofSuitCase.textContent = userProperty[0];
  amountofLunchBox.textContent = userProperty[1];
  amountofCarKey.textContent = userProperty[2];

  // const tableProperty = await contractReader.methods.getTableStatus().call();
  const gamerRankOutput = await contractReader.methods.getGamerRank().call({
    from: myAccount,
  });
  
  const table = document.getElementById('table');
  const tableSuitCase = document.getElementById('tableSuitCase');
  const tableLunchBox = document.getElementById('tableLunchBox');
  const tableCarKey = document.getElementById('tableCarKey');
  const gamerRankData = document.getElementById('gamerRankData');
  
  
  // table.textContent = tableProperty[0];
  // tableSuitCase.textContent = tableProperty[1];
  // tableLunchBox.textContent = tableProperty[2];
  // tableCarKey.textContent = tableProperty[3];
  gamerRankData.textContent = gamerRankOutput[0];

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
  
  const addLunchBox = document.getElementById('addProperty1');
  const addSuitCase = document.getElementById('addProperty2');
  const addCarkey = document.getElementById('addProperty3');


  // DOM Element to display "value" in contract
  const registerDisplayElement = document.getElementById('registered');
  // Get current value and display it
  const val = await contractReader.methods.getPlayerInitStatus().call({
    from: myAccount,
  });
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

init()