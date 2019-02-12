pragma solidity ^0.5.0;

import "./SafeMath.sol";
import "./StringUtils.sol";
import "./Ownable.sol";

contract MakeMeWork is Ownable {

    uint public CUR_GAME_START_TIME;
    uint public CONTRACT_DEPLOYED_TIME;
    uint public roundidx = 0;

    struct gamerStatusThisRound{
        uint workExpiredTime;
        uint expectedGainWKC;
        uint expectedGainDexon;
        bool isWorkerOn;
        uint currentWKCGetIndex;
        bool participated;
        uint hoursWorked;
    }

    struct gamerStatus{
        uint Balance;
        uint LunchBox;
        uint SuitCase;
        uint Carkey;
        uint LastClaimFromBY;
        mapping(uint=>gamerStatusThisRound) thisRound;
    }
    
    struct Payment{
        uint[5] RANKING_LIST;
        uint[5] SSC;
        uint[5] DEXON;
    }
    
    mapping(address=>gamerStatus) public gamerMap;

    event buyPropertyevent(
        string  cargo,
        uint    amount
    );
    event ClaimWKCfromBackYard(
        uint amount,
        uint round
    );
    event Requirement_status(
        bool LunchBox,
        bool SuitCase,
        bool Carkey
    );
    constructor () public {
        CONTRACT_DEPLOYED_TIME = block.timestamp;
    }

    function BuyProperty(string memory cargo,uint amount) public returns (uint256){
        if(StringUtils.equal(cargo,"LunchBox")){
            gamerMap[msg.sender].LunchBox += amount;
            emit buyPropertyevent("LunchBox",amount);
        }
        else if(StringUtils.equal(cargo,"SuitCase")){
            gamerMap[msg.sender].SuitCase += amount;
            emit buyPropertyevent("SuitCase",amount);
        }
        else if(StringUtils.equal(cargo,"Carkey")){
            gamerMap[msg.sender].Carkey += amount;
            emit buyPropertyevent("Carkey",amount);
        }
        gamerMap[msg.sender].Balance -= amount * 50;
        return gamerMap[msg.sender].Balance;
    }

    function ClaimBackYard() public returns (uint256) {
        require((gamerMap[msg.sender].LastClaimFromBY + 1 hours <= block.timestamp), "you cannot claim yet");
        uint gain_this_time = (80/(2**gamerMap[msg.sender].thisRound[roundidx].currentWKCGetIndex));
        gamerMap[msg.sender].Balance += gain_this_time;
        gamerMap[msg.sender].thisRound[roundidx].currentWKCGetIndex += 1;
        emit ClaimWKCfromBackYard(gain_this_time,gamerMap[msg.sender].thisRound[roundidx].currentWKCGetIndex);
        return gamerMap[msg.sender].Balance;
    }

    function calculateRanking() public onlyOwner() {
    }

    function calcuateAmountPaid() public onlyOwner() {
    }

    function goToWork(uint _roundidx) public onlyOwner() {
    /** Randomize the expected earning's this round
     */
    }

    function goToWorkGamer(address _addr, uint _roundidx) internal {
        if(gamerMap[addr].LunchBox>1&&gamerMap[addr].SuitCase>1&&gamerMap[addr].Carkey>1){
            gamerMap[_addr].LunchBox--;
            gamerMap[_addr].SuitCase--;
            gamerMap[_addr].Carkey--;
            gamerMap[_addr].thisRound[roundidx].participated = true
        }
        if(gamerMap[_addr].thisRound[roundidx].participated = true){
            /**Use Dexon functions to randomize the expected hours to thisRound[idx].hoursWorked
             */
        }
    }
}