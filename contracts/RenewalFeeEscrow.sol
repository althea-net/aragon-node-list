pragma solidity ^0.4.18;

import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";


contract RenewalFeeEscrow {
  using SafeMath for uint;

  event NewBill(address payer, address collector);
  event Debug(string msg);
  event DebugInt(string msg, uint i);

  mapping (address => mapping (address => Bill)) public billMapping;
  mapping (address => address[]) public subscribersOfPayee;
  mapping (address => address[]) public collectorsOfPayer;

  struct Bill {
    uint account;
    uint perBlock;
    uint lastUpdated;
  }

  /*
  @notice subnetDAO is going to be the smart contract that has the list of 
  subnetDAOs. This will get queried like subnetDAO.getMemberList
  */
  address public subnetDAO;
  function RenewalFeeEscrow (address _subnetDaoManager) public {
    subnetDAO = _subnetDaoManager;
  }

  function addBill (address _payableTo, uint _price) public payable {

    require(msg.value.mul(_price) > 1);
    require(billMapping[msg.sender][_payableTo].lastUpdated == 0);

    billMapping[msg.sender][_payableTo] = Bill(msg.value, _price, block.number);
    subscribersOfPayee[_payableTo].push(msg.sender);
    collectorsOfPayer[msg.sender].push(_payableTo);
    NewBill(msg.sender, _payableTo);
  }

  function getCountOfSubscribers(address _payee) public view returns (uint) {
    return subscribersOfPayee[_payee].length;
  }

  function getCountOfCollectors(address _payer) public view returns (uint) {
    return collectorsOfPayer[_payer].length;
  }

  function topOffBill(address _payee) public payable {
    require(msg.value != 0);
    require(billMapping[msg.sender][_payee].lastUpdated != 0);
    uint newValue = billMapping[msg.sender][_payee].account.add(msg.value);
    billMapping[msg.sender][_payee].account = newValue;
  }

  function collectSubnetFees() public {

    require(subscribersOfPayee[msg.sender].length > 0);
    uint transferValue = 0;

    for (uint i = 0; i < subscribersOfPayee[msg.sender].length; i++) {

      transferValue = transferValue.add(updateBills(
        msg.sender, 
        subscribersOfPayee[msg.sender][i]
      ));
    }

    address(msg.sender).transfer(transferValue);
  }

  function payMyBills() public {

    for (uint i = 0; i < collectorsOfPayer[msg.sender].length; i++) {
      address collector = collectorsOfPayer[msg.sender][i];

      uint transferValue = updateBills(
        collector, 
        msg.sender
      );

      collector.transfer(transferValue);
    }
  }

  function withdrawFromBill() public {

    payMyBills();

    uint totalBalance;
    address collector;

    for (uint i = 0; i < collectorsOfPayer[msg.sender].length; i++) {
      
      totalBalance = totalBalance.add(
        billMapping[msg.sender][collectorsOfPayer[msg.sender][i]].account
      );

    }
    require(totalBalance > 0);
    address(msg.sender).transfer(totalBalance);
  }

  function updateBills(
    address collector,
    address subscriber
  )
    internal returns(uint) 
  {
    uint transferValue;
    Bill memory bill = billMapping[subscriber][collector];
    uint amountOwed = block.number.sub(bill.lastUpdated).mul(bill.perBlock);

    if (amountOwed <= bill.account) {
      billMapping[subscriber][collector].account = bill.account.sub(amountOwed);
      transferValue = amountOwed;
    } else {
      transferValue = bill.account;
      billMapping[subscriber][collector].account = 0;
    }
    billMapping[subscriber][collector].lastUpdated = block.number;
    return transferValue;
  }
}

