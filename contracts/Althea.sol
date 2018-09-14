pragma solidity ^0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";

import "@aragon/os/contracts/common/IVaultRecoverable.sol";
import "@aragon/os/contracts/apm/APMNamehash.sol";

contract Althea is AragonApp {
  using SafeMath for uint;

  event NewMember(address indexed ethNodeAddress, bytes16 ipAddress);
  event MemberRemoved(address indexed ethNodeAddress, bytes16 ipAddress);
  event NewBill(address payer, address collector);
 
  bytes32 constant public ADD_MEMBER = keccak256("ADD_MEMBER");
  bytes32 constant public DELETE_MEMBER = keccak256("DELETE_MEMBER");
  bytes32 constant public MANAGE_ESCROW = keccak256("MANAGE_ESCROW");

  struct Bill {
    uint account;
    uint perBlock;
    uint lastUpdated;
  }

  IVaultRecoverable public vault;

  uint public perBlockFee;
  address public paymentAddress;
  address[] public subnetSubscribers;
  mapping (address => Bill) public billMapping;

  function initialize(address _addr, uint _fee) external onlyInit {
    perBlockFee = _fee;
    paymentAddress = _addr;
    initialized();
  }

  function vaultAddress() public returns (address) {
    return vault.getRecoveryVault();
  }

  // Node list funtionality from here till next comment
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


  // Escrow leasing functionality till EOF
  function setPerBlockFee(uint _newFee) public auth(MANAGE_ESCROW) {
    perBlockFee = _newFee;
  }

  function setPaymentAddress(address _addr) public auth(MANAGE_ESCROW) {
    paymentAddress = _addr;
  }

  function getCountOfSubscribers() public view returns (uint) {
    return subnetSubscribers.length;
  }

  function addBill() public payable {

    require(msg.value > perBlockFee);
    require(billMapping[msg.sender].lastUpdated == 0);

    billMapping[msg.sender] = Bill(msg.value, perBlockFee, block.number);
    subnetSubscribers.push(msg.sender);
    NewBill(msg.sender, paymentAddress);
  }

  function topOffBill() public payable {
    require(msg.value != 0);
    require(billMapping[msg.sender].lastUpdated != 0);
    billMapping[msg.sender].account = billMapping[msg.sender].account.add(msg.value);
  }

  function collectBills() public auth(MANAGE_ESCROW) {
    uint transferValue = 0;
    for (uint i = 0; i < subnetSubscribers.length; i++) {
      transferValue = transferValue.add(processBills(subnetSubscribers[i]));
    }
    address(paymentAddress).transfer(transferValue);
  }

  function payMyBills() public {
    address(paymentAddress).transfer(processBills(msg.sender));
  }

  function withdrawFromBill() public {
    payMyBills();
    uint amount = billMapping[msg.sender].account;
    require(amount > 0);
    billMapping[msg.sender].account = 0;
    address(msg.sender).transfer(amount);
  }

  function processBills(address _subscriber) internal returns(uint) {
    uint transferValue;
    Bill memory bill = billMapping[_subscriber];
    uint amountOwed = block.number.sub(bill.lastUpdated).mul(bill.perBlock);

    if (amountOwed <= bill.account) {
      billMapping[_subscriber].account = bill.account.sub(amountOwed);
      transferValue = amountOwed;
    } else {
      transferValue = bill.account;
      billMapping[_subscriber].account = 0;
    }
    billMapping[_subscriber].lastUpdated = block.number;
    return transferValue;
  }

}

