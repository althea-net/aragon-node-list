pragma solidity ^0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";

contract NodesList is AragonApp {
  using SafeMath for uint256;

  bytes4[] public ip;
  address[] public addr;

  event NewMember(address indexed ethNodeAddress, bytes4 ipAddress);
  event MemberRemoved(address indexed ethNodeAddress);
 
  bytes32 constant public ADD_MEMBER = keccak256("ADD_MEMBER");
  bytes32 constant public DELETE_MEMBER = keccak256("DELETE_MEMBER");
  
  function addMember(address _ethAddr, bytes4 _ip) auth(ADD_MEMBER) external {
    require(addr.length<256);
    addr.push(_ethAddr);
    ip.push(_ip);
    NewMember(_ethAddr, _ip);
  }

  function deleteMember(uint _index) auth(DELETE_MEMBER) external {
    address _ethAddr = addr[_index];
    delete(addr[addr.length]);
    delete(ip[ip.length]);
    MemberRemoved(_ethAddr);
  }
  
  function getNodeList() public returns(address[] _addr, bytes4[] _ip) {
      _addr = addr;
      _ip = ip;
  }
}
