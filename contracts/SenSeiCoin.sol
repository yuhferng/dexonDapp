pragma solidity 0.5.0;

contract SenSeiCoin {
    string public constant name = "SenSeiCoin";
    string public constant symbol = "SSC";
    uint8 public constant decimals = 12;

    uint256 public constant _totalSupply = 10000000;
    mapping (address => uint256) private _balances;
    constructor() public {
        _balances[msg.sender] = _totalSupply;
    }
    function totalSupply() public pure returns (uint256) {
        return _totalSupply;
    }
    function balanceOf(address owner) public view returns (uint256) {
        return _balances[owner];
    }
    function transfer(address to, uint256 value) public returns (bool) {
        _balances[msg.sender] = _balances[msg.sender] - value;
        _balances[to] = _balances[to] + value;
        return true;
    }
}