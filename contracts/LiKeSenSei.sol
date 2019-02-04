pragma solidity ^0.5.0;

import "./SafeMath.sol";
import "./SenSeiCoin.sol";
import "./StringUtils.sol";

contract LiKeSenSei is SenSeiCoin {

    address Owner;
    struct Property{
        uint LunchBox;
        uint SuitCase;
        uint Carkey;
        bool Table;
        uint LastClaimFromBY;
    }

    mapping(address => Property) public UserProperty;

    event buyPropertyevent(
        string  cargo,
        uint    amount
    );

    constructor () public {
        Owner = msg.sender;
    }

    modifier OwnerOnly () {
        require(msg.sender == Owner, "You can't use this function darling");
        _;
    }

    function GoBackYard() private {
        require(UserProperty[msg.sender].LastClaimFromBY >= block.timestamp + 60000 seconds, "You cannot claim yet!");
        BackYard(msg.sender);
        UserProperty[msg.sender].LastClaimFromBY = block.timestamp;
    }

    function BuyProperty(string memory cargo,uint amount) public payable{
        if(StringUtils.equal(cargo,"LunchBox")){
            UserProperty[msg.sender].LunchBox = SafeMath.add(UserProperty[msg.sender].LunchBox, SafeMath.mul(SafeMath.div(msg.value,5),amount));
            emit buyPropertyevent("LunchBox",amount);
        }
        else if(StringUtils.equal(cargo,"SuitCase")){
            UserProperty[msg.sender].LunchBox = SafeMath.add(UserProperty[msg.sender].LunchBox, SafeMath.mul(SafeMath.div(msg.value,5),amount));
            emit buyPropertyevent("SuitCase",amount);
        }
        else if(StringUtils.equal(cargo,"Carkey")){
            UserProperty[msg.sender].LunchBox = SafeMath.add(UserProperty[msg.sender].LunchBox, SafeMath.mul(SafeMath.div(msg.value,5),amount));
            emit buyPropertyevent("Carkey",amount);
        }
    }

    function PutonTable() view public {
        require( !UserProperty[msg.sender].Table, "There're still something on table");

    }
}