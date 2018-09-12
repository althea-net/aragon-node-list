pragma solidity ^0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";

contract Althea is AragonApp {
  using SafeMath for uint;

  event NewMember(address indexed ethNodeAddress, bytes16 ipAddress);
  event MemberRemoved(address indexed ethNodeAddress, bytes16 ipAddress);
  event NewBill(address payer, address collector);
  event DebugInt(string msg, uint u);
 
  bytes32 constant public ADD_MEMBER = keccak256("ADD_MEMBER");
  bytes32 constant public DELETE_MEMBER = keccak256("DELETE_MEMBER");
  bytes32 constant public MANAGE_ESCROW = keccak256("MANAGE_ESCROW");

  struct Bill {
    uint account;
    uint perBlock;
    uint lastUpdated;
  }

  uint public perBlockFee = 1e10;
  address public paymentAddress;
  address[] public subnetSubscribers;
  mapping(bytes16 => address) public nodeList;
  mapping (address => Bill) public billMapping;

  function Althea(address _addr) public {
    paymentAddress = _addr;
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

  function setBillPerBlockFee(uint _newFee) public auth(MANAGE_ESCROW) {
    perBlockFee = _newFee;
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

  function setPerBlockFee(uint _newFee) public auth(MANAGE_ESCROW) {

    perBlockFee = _newFee;
  }
}

