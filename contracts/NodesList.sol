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

  // Temporary constructor to have built in test variables
  function NodesList() public {
    addr.push(0xf0c5c43e3efc5e0e55529e748ec65bbd590511b4);
    ip.push(0x00000001);
    addr.push(0xf0c51b8d7868e1bdaa9133d09eda0b0dd6323e1a);
    ip.push(0x00000002);
  }

  function addMember(address _ethAddr, bytes4 _ip)
    auth(ADD_MEMBER)
    external
    returns(bool)
  {
    require(addr.length<256);
    addr.push(_ethAddr);
    ip.push(_ip);
    NewMember(_ethAddr, _ip);
    return true;
  }

  function deleteMember(uint _index)
    auth(DELETE_MEMBER)
    external
    returns(bool)
  {

    require(_index < addr.length);
    address _ethAddr = addr[_index];
    
    for (uint i = _index; i<addr.length-1; i++) {
        addr[i] = addr[i+1];
        ip[i] = ip[i+1];
    }
    
    delete addr[addr.length-1];
    delete ip[ip.length-1];
    addr.length--;
    ip.length--;
    MemberRemoved(_ethAddr);
    return true;
  }
}
