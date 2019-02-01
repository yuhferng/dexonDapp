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
    }

    mapping(address => Property) public UserProperty;
    
    event buylunchbox(uint amount);
    event buySuitcase(uint amount);
    event buyCarkey(uint amount);
    constructor () public {
        Owner = msg.sender;
    }

    function BuyProperty(string memory cargo,uint amount) public payable{
        if(StringUtils.equal(cargo,"LunchBox")){
            UserProperty[msg.sender].LunchBox = SafeMath.add(UserProperty[msg.sender].LunchBox, SafeMath.mul(SafeMath.div(msg.value,5),amount));
            emit buylunchbox(amount);
        }
        else if(StringUtils.equal(cargo,"SuitCase")){
            UserProperty[msg.sender].LunchBox = SafeMath.add(UserProperty[msg.sender].LunchBox, SafeMath.mul(SafeMath.div(msg.value,5),amount));
            emit buySuitcase(amount);
        }
        else if(StringUtils.equal(cargo,"Carkey")){
            UserProperty[msg.sender].LunchBox = SafeMath.add(UserProperty[msg.sender].LunchBox, SafeMath.mul(SafeMath.div(msg.value,5),amount));
            emit buyCarkey(amount);
        }
    }
}