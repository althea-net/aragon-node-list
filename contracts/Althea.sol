pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";

contract Althea is AragonApp {
  using SafeMath for uint;

  event NewMember(
    address indexed ethAddress,
    bytes16 ipAddress,
    bytes16 nickname
  );
  event MemberRemoved(
    address indexed ethAddress,
    bytes16 ipAddress,
    bytes16 nickname
  );
  event NewBill(address payer, address collector);
  event BillUpdated(address payer, address collector);
 
  bytes32 constant public MANAGER = keccak256("MANAGER");
  bytes32 constant public DELETE = keccak256("DELETE");
  bytes32 constant public ADD = keccak256("ADD");

  struct Bill {
    uint balance;
    uint perBlock;
    uint lastUpdated;
  }

  uint public perBlockFee;
  address public paymentAddress;
  address[] public subnetSubscribers;
  mapping(bytes16 => address) public nodeList;
  mapping(bytes16 => bytes16) public nickName;
  mapping(address => Bill) public billMapping;

  function initialize() external onlyInit {
    perBlockFee = 10000;
    paymentAddress = msg.sender;
    initialized();
  }

  function addMember(address _ethAddr, bytes16 _ip, bytes16 _nick)
    external 
    auth(ADD)
  {
    require(nodeList[_ip] == address(0), "Member already exists");
    nodeList[_ip] = _ethAddr;
    nickName[_ip] = _nick;
    subnetSubscribers.push(_ethAddr);
    NewMember(_ethAddr, _ip, _nick);
  }

  function deleteMember(bytes16 _ip) external auth(DELETE) {
    MemberRemoved(nodeList[_ip], _ip, nickName[_ip]);
    address toDelete = nodeList[_ip];
    delete nodeList[_ip];
    delete nickName[_ip];
    for (uint i = 0; i < subnetSubscribers.length; i++) {
      if (toDelete == subnetSubscribers[i]) {
        subnetSubscribers[i] = subnetSubscribers[subnetSubscribers.length-1];
        subnetSubscribers.length--;
      }
    }
  }

  function getMember(bytes16 _ip) external view returns(address addr) {
    addr = nodeList[_ip]; 
  }

  function setPerBlockFee(uint _newFee) external auth(MANAGER) {
    perBlockFee = _newFee;
  }

  function setPaymentAddr(address _a) external auth(MANAGER) {
    paymentAddress = _a;
  }

  function getCountOfSubscribers() external view returns (uint) {
    return subnetSubscribers.length;
  }

  function addBill() public payable {
    require(msg.value > perBlockFee, "Message value not enough");

    if (billMapping[msg.sender].lastUpdated == 0) {
      billMapping[msg.sender] = Bill(msg.value, perBlockFee, block.number);
      subnetSubscribers.push(msg.sender);
      emit NewBill(msg.sender, paymentAddress);
    } else {
      billMapping[msg.sender].balance = billMapping[msg.sender].balance.add(msg.value);
      emit BillUpdated(msg.sender, paymentAddress);
    }
  }

  function collectBills() external auth(MANAGER) {
    uint transferValue = 0;
    for (uint i = 0; i < subnetSubscribers.length; i++) {
      transferValue = transferValue.add(processBills(subnetSubscribers[i]));
    }
    address(paymentAddress).transfer(transferValue);
  }

  function payMyBills() public {
    address(paymentAddress).transfer(processBills(msg.sender));
  }

  function withdrawFromBill() external {
    payMyBills();
    uint amount = billMapping[msg.sender].balance;
    require(amount > 0, "Amount to payout is no more than zero, aborting");
    billMapping[msg.sender].balance= 0;
    address(msg.sender).transfer(amount);
    emit BillUpdated(msg.sender, paymentAddress);
  }

  function processBills(address _subscriber) internal returns(uint) {
    uint transferValue;
    Bill memory bill = billMapping[_subscriber];
    uint amountOwed = block.number.sub(bill.lastUpdated).mul(bill.perBlock);

    if (amountOwed <= bill.balance) {
      billMapping[_subscriber].balance= bill.balance.sub(amountOwed);
      transferValue = amountOwed;
    } else {
      transferValue = bill.balance;
      billMapping[_subscriber].balance = 0;
    }
    billMapping[_subscriber].lastUpdated = block.number;
    emit BillUpdated(_subscriber, paymentAddress);
    return transferValue;
  }

  // leave a space between `function` and `(` or else the parser doesn't work
  function () payable external {
    require(billMapping[msg.sender].balance != 0, "Bill doesn't exist yet");
    addBill();
  }
}
