pragma solidity ^0.4.18;

import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";


contract RenewalFeeEscrow {
  using SafeMath for uint;

  event NewBill(address payer, address collector);
  event Debug(string msg);
  event DebugInt(string msg, uint i);
  event DebugAddress(address msg);

  uint public perBlockFee;
  mapping (address => Bill) public billMapping;
  address[] public subnetSubscribers;

  struct Bill {
    uint account;
    uint perBlock;
    uint lastUpdated;
  }

  function getCountOfSubscribers() public view returns (uint) {
    return subnetSubscribers.length;
  }

  function addBill() public payable {

    require(msg.value.mul(perBlockFee) > 1);
    require(billMapping[msg.sender].lastUpdated == 0);

    billMapping[msg.sender] = Bill(msg.value, perBlockFee, block.number);
    subnetSubscribers.push(msg.sender);
    NewBill(msg.sender, subnetDAO);
  }

  function topOffBill() public payable {
    require(msg.value != 0);
    require(billMapping[msg.sender].lastUpdated != 0);
    billMapping[msg.sender].account = billMapping[msg.sender].account.add(msg.value);
  }

  function collectMyBills() public {
    uint transferValue = 0;
    for (uint i = 0; i < subnetSubscribers.length; i++) {
      transferValue = transferValue.add(updateBills(subnetSubscribers[i]));
    }
    address(msg.sender).transfer(transferValue);
  }

  function payMyBills() public {
    transferValue = updateBills();
    address(subnetDAO).transfer(transferValue);
  }

  function withdrawFromBill() public {
    payMyBills();
    address(msg.sender).transfer(billMapping[msg.sender].account);
  }

  function updateBills(address _subscriber) internal returns(uint) {
    uint transferValue;
    Bill memory bill = billMapping[_subscriber];
    uint amountOwed = block.number.sub(bill.lastUpdated).mul(bill.perBlock);

    if (amountOwed <= bill.account) {
      billMapping[_subscriber].account = bill.account.sub(amountOwed);
      transferValue = amountOwed;
    } else {
      transferValue = bill.account;
      billMapping[subscriber].account = 0;
    }
    billMapping[subscriber].lastUpdated = block.number;
    return transferValue;
  }

  function setPerBlockFee(uint _newFee) internal {
    perBlockFee = _newFee;
  }
}
