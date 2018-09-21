pragma solidity 0.4.24;

import "@aragon/os/contracts/apm/APMRegistry.sol";
import "@aragon/os/contracts/factory/DAOFactory.sol";
import "@aragon/os/contracts/kernel/Kernel.sol";
import "@aragon/os/contracts/acl/ACL.sol";
import "@aragon/os/contracts/lib/minime/MiniMeToken.sol";
import "@aragon/os/contracts/lib/ens/ENS.sol";
import "@aragon/os/contracts/lib/ens/PublicResolver.sol";

import "@aragon/apps-finance/contracts/Finance.sol";
import "@aragon/apps-token-manager/contracts/TokenManager.sol";
import "@aragon/apps-vault/contracts/Vault.sol";
import "@aragon/apps-voting/contracts/Voting.sol";

import "./Althea.sol";

contract AltheDAO {
  APMRegistry apm;
  DAOFactory fac;
  MiniMeTokenFactory minimeFac;

  address constant ANY_ENTITY = address(-1);

  event DeployInstace(address dao);
  event InstalledApp(address appProxy, bytes32 appId);

  function DevTemplate(
    DAOFactory _fac,
    MiniMeTokenFactory _minimeFac,
    APMRegistry _apm
  ) {
    apm = _apm;
    fac = _fac;
    minimeFac = _minimeFac;
  }

  function apmInit(
    address fiananceBase,
    bytes financeContentURI,
    address tokenManagerBase,
    bytes tokenManagerContentURI,
    address vaultBase,
    bytes vaultContentURI,
    address votingBase,
    bytes votingContentURI
    address altheaBase,
    bytes altheaContentURI, 
  ) 
    public
  {
    createRepo("althea", altheaBase, altheaContentURI);
    createRepo("finance", finanaceBase, finanaceContentURI);
    createRepo("token-manager", tokenManagerBase, tokenManagerContentURI);
    createRepo("vault", finanaceBase, finanaceContentURI);
    createRepo("voting", votingBase, vaultContentURI);
  }

  function createInstance

}
