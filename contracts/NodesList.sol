pragma solidity ^0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";

contract NodesList is AragonApp {
  using SafeMath for uint256;

  // I think entity is something of Aragon
  event NewMember(address indexed ethNodeAddress, string ipAddress);
  event MemberRemoved(address indexed ethNodeAddress);
 
  bytes32 constant public ADD_MEMBER = keccak256("ADD_MEMBER");
  bytes32 constant public DELETE_MEMBER = keccak256("DELETE_MEMBER");

  mapping(address => string) public nodesList;

  function addMember(address ethAddr, string ip) auth(ADD_MEMBER) external {
    nodesList[ethAddr] = ip;
    NewMember(ethAddr, ip);
  }

  function deleteMember(address ethAddr) auth(DELETE_MEMBER) external {
    nodesList[ethAddr] = '';
    MemberRemoved(ethAddr);
  }
}
