pragma solidity ^0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";

import "./RenewalFeeEscrow.sol";
import "./NodeList.sol";

/*
@notice Privides an interface for Subnet owners to admistrate their subnet
*/


contract SubnetController is AragonApp {

  bytes32 constant public SUBNET_OWNER = keccak256("SUBNET_OWNERS");

  RenewalFeeEscrow renewalFeeEscrow;

  function SubnetController() public {
    //renewalFeeEscrow = new RenewalFeeEscrow(address(this));
  }

  function kickNode() public auth(SUBNET_OWNER) {
  }

  function setBillPerBlockRate(uint _newFee) public auth(SUBNET_OWNER) {
    //renewalFeeEscrow.setPerBlockFee(_newFee);
  }

}
