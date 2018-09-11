pragma solidity ^0.4.18;

import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";


import "./Ownable.sol";


contract IPLeasingEscrow is Ownable {
  using SafeMath for uint;

  event NewBill(address payer, address collector);

  uint public perBlockFee;
  address public paymentAddress;
  mapping (address => Bill) public billMapping;
  address[] public subnetSubscribers;

  struct Bill {
    uint account;
    uint perBlock;
    uint lastUpdated;
  }

  function IPLeasingEscrow(uint _perBlockFee, address _addr) public {
    perBlockFee = _perBlockFee;
    paymentAddress = _addr;
  }

  function getCountOfSubscribers() public view returns (uint) {
    return subnetSubscribers.length;
  }

  function addBill() public payable {

    require(msg.value.mul(perBlockFee) > 1);
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

  // fallback
  function() public payable {
    revert();
  }

  function collectBills() public onlyOwner() {
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

  function setPerBlockFee(uint _newFee) public onlyOwner {
    perBlockFee = _newFee;
  }

}

