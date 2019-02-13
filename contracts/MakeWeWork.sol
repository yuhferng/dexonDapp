pragma solidity ^0.5.0;

import "./SafeMath.sol";
import "./StringUtils.sol";

contract MakeMeWork{
    
    address Owner;
    uint public CUR_GAME_START_TIME;
    uint public CONTRACT_DEPLOYED_TIME;
    uint public roundidx = 0;

    struct gamerStatusThisRound{
        uint workExpiredTime;
        uint expectedGainWKC;
        uint expectedGainDexon;
        bool isWorkerOn;
        uint currentWKCGetIndex;
    }

    struct gamerStatus{
        uint Balance;
        uint LunchBox;
        uint SuitCase;
        uint Carkey;
        bool Table;
        bool Table_LunchBox;
        bool Table_SuitCase;
        bool Table_Carkey;
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
        Owner = msg.sender;
        CONTRACT_DEPLOYED_TIME = block.timestamp;
    }
    modifier OwnerOnly () {
        require(msg.sender == Owner, "You can't use this function darling");
        _;
    }

    function BuyProperty(string memory cargo,uint amount) public payable returns (uint256){
        if(StringUtils.equal(cargo,"LunchBox")){
            require(gamerMap[msg.sender].Balance >= 50,"You don't have enough token!");
            gamerMap[msg.sender].LunchBox += amount;
            gamerMap[msg.sender].Balance -= amount * 50;
            emit buyPropertyevent("LunchBox",amount);
        }
        else if(StringUtils.equal(cargo,"SuitCase")){
            require(gamerMap[msg.sender].Balance >= 60,"You don't have enough token!");
            gamerMap[msg.sender].SuitCase += amount;
            gamerMap[msg.sender].Balance -= amount * 60;
            emit buyPropertyevent("SuitCase",amount);
        }
        else if(StringUtils.equal(cargo,"Carkey")){
            require(msg.value == 1 ether,"Hello");
            gamerMap[msg.sender].Carkey += amount;
            emit buyPropertyevent("Carkey",amount);
        }
        else{
            revert("Nope!");
        }
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

    function addRequirement(string memory putin) public {
        if (StringUtils.equal(putin,"LunchBox")){
            require(gamerMap[msg.sender].LunchBox >= 1,"You don't have enough LunchBox");
            gamerMap[msg.sender].Table_LunchBox = true;
        }
        else if (StringUtils.equal(putin,"SuitCase")){
            require(gamerMap[msg.sender].LunchBox >= 1,"You don't have enough SuitCase");
            gamerMap[msg.sender].Table_SuitCase = true;
        }
        else if (StringUtils.equal(putin,"Carkey")){
            require(gamerMap[msg.sender].LunchBox >= 1,"You don't have enough Carkey");
            gamerMap[msg.sender].Table_Carkey = true;
        }
        emit Requirement_status(gamerMap[msg.sender].Table_LunchBox,gamerMap[msg.sender].Table_SuitCase,gamerMap[msg.sender].Table_Carkey);
        if 
        (
        gamerMap[msg.sender].Table_Carkey == true && gamerMap[msg.sender].Table_LunchBox == true && gamerMap[msg.sender].Table_LunchBox == true
        ){
            gamerMap[msg.sender].Table = true;
        }
    }
}