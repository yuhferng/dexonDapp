
// Call "update" function in the contract when we click on the update button
const useSuitCase = document.getElementById('useProperty1');
const useLunchBox = document.getElementById('useProperty2');
const useCarkey = document.getElementById('useProperty3');

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
