pragma solidity ^0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";

import "./IPLeasingEscrow.sol";

contract AltheaDAO is AragonApp {

  event NewMember(address indexed ethNodeAddress, bytes16 ipAddress);
  event MemberRemoved(address indexed ethNodeAddress, bytes16 ipAddress);
 
  bytes32 constant public ADD_MEMBER = keccak256("ADD_MEMBER");
  bytes32 constant public DELETE_MEMBER = keccak256("DELETE_MEMBER");
  bytes32 constant public MANAGE_ESCROW = keccak256("MANAGE_ESCROW");

  mapping(bytes16 => address) public nodeList;

  IPLeasingEscrow ipLeasingEscrow;

  function AltheaDAO(uint _perBlockFee, address _addr) public {
    ipLeasingEscrow = new IPLeasingEscrow(_perBlockFee, _addr);
  }

  function addMember(address _ethAddr, bytes16 _ip) public auth(ADD_MEMBER) {
    require(nodeList[_ip] == address(0));
    nodeList[_ip] = _ethAddr;
    NewMember(_ethAddr, _ip);
  }

  function deleteMember(bytes16 _ip) public auth(DELETE_MEMBER) {
    MemberRemoved(nodeList[_ip], _ip);
    nodeList[_ip] = address(0);
  }

  function getMember(bytes16 _ip) public view returns(address addr) {
    addr = nodeList[_ip]; 
  }


  // IpLeasingEscrow Contract calls
  function setBillPerBlockFee(uint _newFee) public auth(MANAGE_ESCROW) {
    ipLeasingEscrow.setPerBlockFee(_newFee);
  }

  function getPerBlockFee() public view returns(uint) {
    return ipLeasingEscrow.perBlockFee();
  }

  function getEscrowAddress() public view returns(address) {
    return address(ipLeasingEscrow);
  }

  //fallback
  function () public payable {
    revert();
  }

}
