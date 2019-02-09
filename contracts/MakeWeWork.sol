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

    constructor () public {
        Owner = msg.sender;
        CONTRACT_DEPLOYED_TIME = block.timestamp;
    }

    modifier OwnerOnly () {
        require(msg.sender == Owner, "You can't use this function darling");
        _;
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
        gamerMap[msg.sender].Balance += (80/(2**gamerMap[msg.sender].thisRound[roundidx].currentWKCGetIndex));
        gamerMap[msg.sender].thisRound[roundidx].currentWKCGetIndex += 1;
        return gamerMap[msg.sender].Balance;
    }

    function addRequirement(string memory putin) public {
        if (StringUtils.equal(putin,"LunchBox")){
            gamerMap[msg.sender].LunchBox--;
            gamerMap[msg.sender].Table_LunchBox = true;
        }
        else if (StringUtils.equal(putin,"SuitCase")){
            gamerMap[msg.sender].SuitCase--;
            gamerMap[msg.sender].Table_SuitCase = true;
        }
        else if (StringUtils.equal(putin,"Carkey")){
            gamerMap[msg.sender].Carkey--;
            gamerMap[msg.sender].Table_Carkey = true;
        }
        if 
        (
        gamerMap[msg.sender].Table_Carkey == true && gamerMap[msg.sender].Table_LunchBox == true && gamerMap[msg.sender].Table_LunchBox == true
        ){
            gamerMap[msg.sender].Table = true;
        }
    }
}