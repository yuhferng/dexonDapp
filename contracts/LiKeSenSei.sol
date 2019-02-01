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
    
    constructor () public {
        Owner = msg.sender;
    }

    function BuyProperty(string memory cargo,uint amount) public payable{
        if(StringUtils.equal(cargo,"LunchBox")){
            UserProperty[msg.sender].LunchBox = SafeMath.add(UserProperty[msg.sender].LunchBox, amount);
        }
        else if(StringUtils.equal(cargo,"SuitCase")){
            UserProperty[msg.sender].LunchBox = SafeMath.add(UserProperty[msg.sender].SuitCase, amount);
        }
        else if(StringUtils.equal(cargo,"Carkey")){
            UserProperty[msg.sender].LunchBox = SafeMath.add(UserProperty[msg.sender].LunchBox, 1);
        }
    }
}