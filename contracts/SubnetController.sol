pragma solidity ^0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";

import "./RenewalFeeEscrow.sol";

/*
@notice Privides an interface for Subnet owners to admistrate their subnet
*/
contract SubnetController is AragonApp {

  // This role whill probably be determined by the TCR
  bytes32 constant public SUBNET_OWNER = keccak256("SUBNET_OWNERS");

  function acceptBill() auth(SUBNET_OWNER){
  }

  function collectBills() auth(SUBNET_OWNER){

  }

  function kickNode() auth(SUBNET_OWNER){
  }

  function setBillPerBlockRate() auth(SUBNET_OWNER){
  }

}

