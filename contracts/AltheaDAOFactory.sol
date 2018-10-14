pragma solidity 0.4.24;


// This is the Import truffle hack, which for some reason can't
// be included in Imports.sol
import "@aragon/id/contracts/FIFSResolvingRegistrar.sol";

import "@aragon/os/contracts/factory/DAOFactory.sol";
import "@aragon/os/contracts/kernel/Kernel.sol";
import "@aragon/os/contracts/acl/ACL.sol";
import "@aragon/apps-shared-minime/contracts/MiniMeToken.sol";
import "@aragon/id/contracts/IFIFSResolvingRegistrar.sol";
import "@aragon/os/contracts/common/IsContract.sol";

import "@aragon/apps-voting/contracts/Voting.sol";
import "@aragon/apps-token-manager/contracts/TokenManager.sol";

import "./FactoryBase.sol";

contract AltheaDAOFactory is FactoryBase {

  // ensure alphabetic order
  MiniMeTokenFactory public minimeFac;

  constructor(
    DAOFactory _fac,
    ENS _ens,
    MiniMeTokenFactory _minimeFac,
    IFIFSResolvingRegistrar _aragonID,
    bytes32[5] _appIds
  )
    FactoryBase(
      _fac,
      _ens,
      _minimeFac,
      _aragonID,
      _appIds
    )
    public
  {
    require(isContract(address(_fac.regFactory())));
    minimeFac = _minimeFac;
  }

  // multisig
  function newToken(
    string name,
    string symbol
  )
    external
    returns (MiniMeToken token)
  {
    token = minimeFac.createCloneToken(
      MiniMeToken(address(0)),
      0,
      name,
      0,
      symbol,
      true
    );
    cacheToken(token, msg.sender);
  }

  // multisig
  function newInstance(
    string name,
    address[] signers,
    uint256 neededSignatures
  )
    external
  {

    require(signers.length > 0 && neededSignatures > 0);
    require(neededSignatures <= signers.length);
    // We can avoid safemath checks here as it's very
    // unlikely a user will pass in enough
    // signers to cause this to overflow

    uint256[] memory stakes = new uint256[](signers.length);

    for (uint256 i = 0; i < signers.length; i++) {
      stakes[i] = 1;
    }

    MiniMeToken token = popTokenCache(msg.sender);

    Kernel dao;
    ACL acl;
    //Finance finance;
    TokenManager tokenManager;
    //Vault vault;
    Voting voting;
    Althea althea;
    (dao, acl,,tokenManager,,, althea) = createDAO(
      name,
      token,
      signers,
      stakes,
      1
    );

    uint256 multisigSupport = (neededSignatures * 10 ** 18)/ signers.length - 1;
    voting.initialize(
      token,
      multisigSupport,
      multisigSupport,
      1825 days // ~5 years
    );

    acl.createPermission(
      tokenManager,
      voting,
      voting.CREATE_VOTES_ROLE(),
      voting
    );

    // Include support modification permission to handle changes to the multisig's size
    acl.createPermission(
      voting,
      voting,
      voting.MODIFY_SUPPORT_ROLE(),
      voting
    );

    cleanupPermission(acl, voting, acl, acl.CREATE_PERMISSIONS_ROLE());
  }
}
