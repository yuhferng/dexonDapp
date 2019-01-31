pragma solidity ^0.5.0;

import "./SafeMath.sol";
import "./SenSeiCoin.sol";

contract LiKeSenSei {
    address Owner;
    struct Reward {
        uint Lunchbox;
        uint SuitCase;
        uint CarKey;
        uint Lottery;
    }

    constructor () public {
        Owner = msg.sender;
    }

}