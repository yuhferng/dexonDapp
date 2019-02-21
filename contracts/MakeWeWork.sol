pragma solidity ^0.5.0;

import "./SafeMath.sol";
import "./StringUtils.sol";


contract MakeWeWork {
    
    address Owner;
    uint public CUR_GAME_START_TIME;
    uint public CONTRACT_DEPLOYED_TIME;
    uint public roundidx = 0;

    struct gamerStatusThisRound {
        uint workExpiredTime;
        uint gainWKC;
        uint gainDexon;
        bool isWorkerOn;
        uint currentWKCGetIndex;
        bool participated;
        uint hourRanked;
    }

    struct gamerStatus {
        bool init;
        uint wkcBalance;
        uint lunchBox;
        uint suitCase;
        uint carKey;
        bool table;
        bool tableLunchBox;
        bool tableSuitCase;
        bool tableCarKey;
        uint lastClaimFromBY;
        mapping(uint=>gamerStatusThisRound) thisRound;
    }
    
    struct Payment {
        uint[5] RANKING_LIST;
        uint[5] SSC;
        uint[5] DEXON;
    }
    
    mapping(address=>gamerStatus) public gamerMap;
    mapping(uint=>address[]) public participants;

    event PlayerInitialized(
        address playerAddr
    );

    event BuyPropertyEvent(
        string  cargo,
        uint    amount
    );

    event ClaimWKCfromBackYard(
        uint amount,
        uint round
    );

    event RequirementStatus(
        bool lunchBox,
        bool suitCase,
        bool carKey
    );
    event ReturnProperty(
        uint lunchbox,
        uint suitcase,
        uint carkey
    );
    event WkcBalance(
        uint wkcamount
    );

    constructor () public {
        Owner = msg.sender;
    }

    modifier OwnerOnly () {
        require(msg.sender == Owner, "You can't use this function darling");
        _;
    }
    function BuyProperty(string memory cargo, uint amount) public payable returns (uint256 wkcbal) {
        if(StringUtils.equal(cargo,"lunchBox")){
            require(gamerMap[msg.sender].wkcBalance >= amount*50,"You don't have enough token!");
            gamerMap[msg.sender].lunchBox += amount;
            gamerMap[msg.sender].wkcBalance -= amount * 50;
            emit BuyPropertyEvent("lunchBox",gamerMap[msg.sender].lunchBox);
            emit WkcBalance(gamerMap[msg.sender].wkcBalance);            
        }
        else if(StringUtils.equal(cargo,"suitCase")){
            require(gamerMap[msg.sender].wkcBalance >= amount*60,"You don't have enough token!");
            gamerMap[msg.sender].suitCase += amount;
            gamerMap[msg.sender].wkcBalance -= amount * 60;
            emit BuyPropertyEvent("suitCase",gamerMap[msg.sender].suitCase);
            emit WkcBalance(gamerMap[msg.sender].wkcBalance);                        
        }
        else if(StringUtils.equal(cargo,"carKey")){
            require(msg.value == 1 ether*amount,"Hello");
            gamerMap[msg.sender].carKey += amount;
            emit BuyPropertyEvent("carKey",gamerMap[msg.sender].carKey);
            emit WkcBalance(gamerMap[msg.sender].wkcBalance);
        }
        else{
            revert("Nope!");
        }
        return gamerMap[msg.sender].wkcBalance;
    }

    function ClaimBackYard() public returns (uint256) {
        //uint gain_this_time = (80/(2**gamerMap[msg.sender].thisRound[roundidx].currentWKCGetIndex));
        //gamerMap[msg.sender].wkcBalance += gain_this_time;
        gamerMap[msg.sender].wkcBalance += 314159265;
        gamerMap[msg.sender].thisRound[roundidx].currentWKCGetIndex += 1;
        //emit ClaimWKCfromBackYard(gain_this_time,gamerMap[msg.sender].thisRound[roundidx].currentWKCGetIndex);
        emit ClaimWKCfromBackYard(314159265,gamerMap[msg.sender].thisRound[roundidx].currentWKCGetIndex);
        emit WkcBalance(gamerMap[msg.sender].wkcBalance);
        return gamerMap[msg.sender].wkcBalance;
    }

    function addRequirement(string memory putin) public {
        if (StringUtils.equal(putin,"lunchBox")){
            require(gamerMap[msg.sender].lunchBox >= 1 && gamerMap[msg.sender].tableLunchBox == false,"You don't have enough LunchBox");
            gamerMap[msg.sender].tableLunchBox = true;
            }
        else if (StringUtils.equal(putin,"suitCase")){
            require(gamerMap[msg.sender].suitCase >= 1 && gamerMap[msg.sender].tableSuitCase == false,"You don't have enough SuitCase");
            gamerMap[msg.sender].tableSuitCase = true;
            }
        else if (StringUtils.equal(putin,"carKey")){
            require(gamerMap[msg.sender].carKey >= 1 && gamerMap[msg.sender].tableCarKey == false,"You don't have enough CarKey");
            gamerMap[msg.sender].tableCarKey = true;
            }
        emit RequirementStatus(gamerMap[msg.sender].tableLunchBox,gamerMap[msg.sender].tableSuitCase,gamerMap[msg.sender].tableCarKey);
        if 
        (
        gamerMap[msg.sender].tableCarKey == true && gamerMap[msg.sender].tableLunchBox == true && gamerMap[msg.sender].tableSuitCase == true
        ){
            gamerMap[msg.sender].table = true;
        }
    }

    function GoToWorkThisRound() public returns (address) {
        if(gamerMap[msg.sender].table == true){
            uint id = participants[roundidx].push(msg.sender);
            gamerStatusThisRound memory m = gamerStatusThisRound({
                workExpiredTime:0,
                gainWKC:0,
                gainDexon:0,
                isWorkerOn:true,
                currentWKCGetIndex:0,
                participated:true,
                hourRanked: 0
                });
            
            gamerMap[msg.sender].thisRound[0] = m;
            gamerMap[msg.sender].lunchBox -= 1;
            gamerMap[msg.sender].suitCase -= 1;
            gamerMap[msg.sender].carKey -= 1;
            gamerMap[msg.sender].table == false;
            gamerMap[msg.sender].thisRound[0].hourRanked = rand%5;
            /*
            Emit participated event with hourWorked info
            */
        }
    }
    
    function getFirstParticipants(uint round) public view returns (address) {
        return participants[round][0];
    }

    function goToNextRound() public {
        roundidx += 1;
    }

    function gamerRegistering() public {
        if(gamerMap[msg.sender].init==false){
            gamerMap[msg.sender].init = true;
            gamerMap[msg.sender].wkcBalance = 100000000;
            emit PlayerInitialized(msg.sender);
        }
    }

    function getPropertyNumbers() public view returns (uint256 lunchbox, uint256 suitcase, uint256 carkey, uint256 wkcbal){
        return (gamerMap[msg.sender].lunchBox, gamerMap[msg.sender].suitCase, gamerMap[msg.sender].carKey, gamerMap[msg.sender].wkcBalance);
    }

    function getTableStatus() public view returns (bool table, bool tablelunchbox, bool tablesuitcase, bool tablecarkey){
        return (gamerMap[msg.sender].table, gamerMap[msg.sender].tableLunchBox, gamerMap[msg.sender].tableSuitCase, gamerMap[msg.sender].tableCarKey);
    }

    function getPlayerInitStatus() public view returns(bool init) {
        return gamerMap[msg.sender].init;
    }

    function getGamerRank() public view returns(uint hourRanked, uint workExpired) {
        return (gamerMap[msg.sender].thisRound[0].hourRanked, gamerMap[msg.sender].thisRound[0].workExpiredTime);
    }

    function returnBalance() public view returns(uint256){
        return (gamerMap[msg.sender].wkcBalance);
    }
}