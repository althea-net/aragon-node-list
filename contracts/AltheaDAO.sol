pragma solidity ^0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";

import "./RenewalFeeEscrow.sol";

/*
@notice Privides an interface for Subnet owners to admistrate their subnet
*/


contract AltheaDAO is AragonApp {

  event NewMember(address indexed ethNodeAddress, bytes16 ipAddress);
  event MemberRemoved(address indexed ethNodeAddress, bytes16 ipAddress);
 
  mapping(bytes16 => address) public nodeList;

  bytes32 constant public ADD_MEMBER = keccak256("ADD_MEMBER");
  bytes32 constant public DELETE_MEMBER = keccak256("DELETE_MEMBER");
  bytes32 constant public SUBNET_OWNERS = keccak256("SUBNET_OWNERS");

  RenewalFeeEscrow renewalFeeEscrow;

  function AltheaDAO() public {
    renewalFeeEscrow = new RenewalFeeEscrow();
  }

  function addMember(address _ethAddr, bytes16 _ip) public auth(ADD_MEMBER) {
    require(nodeList[_ip] == 0x0000000000000000000000000000000000000000);
    nodeList[_ip] = _ethAddr;
    NewMember(_ethAddr, _ip);
  }

  function deleteMember(bytes16 _ip) public auth(DELETE_MEMBER) {
    MemberRemoved(nodeList[_ip], _ip);
    nodeList[_ip] = 0x0000000000000000000000000000000000000000;
  }

  function getMember(bytes16 _ip) public view returns(address addr) {
    addr = nodeList[_ip]; 
  }

  function setBillPerBlockRate(uint _newFee) public auth(SUBNET_OWNERS) {
    renewalFeeEscrow.setPerBlockFee(_newFee);
  }

  function getPerBlockFee() public returns(uint) {
    return renewalFeeEscrow.perBlockFee();
  }

}
