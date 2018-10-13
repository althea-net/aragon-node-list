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

import "@aragon/kits-bare/contracts/KitBase.sol";

import "@aragon/apps-voting/contracts/Voting.sol";
import "@aragon/apps-vault/contracts/Vault.sol";
import "@aragon/apps-token-manager/contracts/TokenManager.sol";
import "@aragon/apps-finance/contracts/Finance.sol";

import "./Althea.sol";

contract AltheaDAOFactory is KitBase, IsContract {
  event DeployToken(address token, address indexed cacheOwner);
  event DeployInstance(address dao, address indexed token);

  address public manager;
  bytes32[5] public appIds;
  mapping (address => address) tokenCache;
  // ensure alphabetic order
  MiniMeTokenFactory public minimeFac;
  IFIFSResolvingRegistrar public aragonID;
  enum Apps { Althea, Finance, TokenManager, Vault, Voting }

  constructor(
    DAOFactory _fac,
    ENS _ens,
    MiniMeTokenFactory _minimeFac,
    IFIFSResolvingRegistrar _aragonID,
    bytes32[5] _appIds
  )
    KitBase(_fac, _ens)
    public
  {
    require(isContract(address(_fac.regFactory())));
    minimeFac = _minimeFac;
    aragonID = _aragonID;
    appIds = _appIds;
    manager = msg.sender;
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
    // We can avoid safemath checks here as it's very unlikely a user will pass in enough
    // signers to cause this to overflow
    uint256 neededSignaturesE18 = neededSignatures * 10 ** 18;

    uint256[] memory stakes = new uint256[](signers.length);

    for (uint256 i = 0; i < signers.length; i++) {
      stakes[i] = 1;
    }

    MiniMeToken token = popTokenCache(msg.sender);

    Kernel dao;
    ACL acl;
    Finance finance;
    TokenManager tokenManager;
    Vault vault;
    Voting voting;
    Althea althea;
    (dao, acl, finance, tokenManager, vault, voting, althea) = createDAO(
      name,
      token,
      signers,
      stakes,
      1
    );

    uint256 multisigSupport = neededSignaturesE18 / signers.length - 1;
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


  // base
  function createDAO(
    string name,
    MiniMeToken token,
    address[] holders,
    uint256[] stakes,
    uint256 _maxTokens
  )
    internal
    returns
  (
      Kernel dao,
      ACL acl,
      Finance finance,
      TokenManager tokenManager,
      Vault vault,
      Voting voting,
      Althea althea
  ) {
    require(holders.length == stakes.length);

    dao = fac.newDAO(this);
    acl = ACL(dao.acl());
    acl.createPermission(this, dao, dao.APP_MANAGER_ROLE(), this);

    voting = Voting(
      dao.newAppInstance(
        appIds[uint8(Apps.Voting)],
        latestVersionAppBase(appIds[uint8(Apps.Voting)])
      )
    );
    emit InstalledApp(voting, appIds[uint8(Apps.Voting)]);

    vault = Vault(
      dao.newAppInstance(
        appIds[uint8(Apps.Vault)],
        latestVersionAppBase(appIds[uint8(Apps.Vault)])
      )
    );
    emit InstalledApp(vault, appIds[uint8(Apps.Vault)]);

    finance = Finance(
      dao.newAppInstance(
        appIds[uint8(Apps.Finance)],
        latestVersionAppBase(appIds[uint8(Apps.Finance)])
      )
    );
    emit InstalledApp(finance, appIds[uint8(Apps.Finance)]);

    tokenManager = TokenManager(
      dao.newAppInstance(
        appIds[uint8(Apps.TokenManager)],
        latestVersionAppBase(appIds[uint8(Apps.TokenManager)])
      )
    );
    emit InstalledApp(tokenManager, appIds[uint8(Apps.TokenManager)]);

    althea = Althea(
      dao.newAppInstance(
        appIds[uint8(Apps.Althea)],
        latestVersionAppBase(appIds[uint8(Apps.Althea)])
      )
    );
    emit InstalledApp(althea, appIds[uint8(Apps.Althea)]);

    // Required for initializing the Token Manager
    token.changeController(tokenManager);


    /*
    createPermission
    function createPermission(address _entity, address _app, bytes32 _role, address _manager) external

    Creates a permission that wasn't previously set and managed. Access is limited by the ACL. If a created permission is removed it is possible to reset it with createPermission., Create a new permission granting `_entity` the ability to perform actions of role `_role` on `_app` (setting `_manager` as the permission manager).

Parameters:
    _entity - Address of the whitelisted entity that will be able to perform the role
    _app - Address of the app in which the role will be allowed (requires app to depend on kernel for ACL)
    _role - Identifier for the group of actions in app given access to perform
    _manager - Address of the entity that will be able to grant and revoke the permission further.
  */
    // Permissions
    acl.createPermission(
      voting,
      voting,
      voting.MODIFY_QUORUM_ROLE(),
      voting
    );

    acl.createPermission(
      finance,
      vault,
      vault.TRANSFER_ROLE(),
      voting
    );
    acl.createPermission(
      voting,
      finance,
      finance.CREATE_PAYMENTS_ROLE(),
      voting
    );
    acl.createPermission(
      voting,
      finance,
      finance.EXECUTE_PAYMENTS_ROLE(),
      voting
    );
    acl.createPermission(
      voting,
      finance,
      finance.DISABLE_PAYMENTS_ROLE(),
      voting
    );
    acl.createPermission(
      voting,
      tokenManager,
      tokenManager.ASSIGN_ROLE(),
      voting
    );
      
    acl.createPermission(
      voting,
      tokenManager,
      tokenManager.REVOKE_VESTINGS_ROLE(),
      voting
    );

    // Theses permissions might not be needed since the acl is
    // created by the same manager
    acl.createPermission(
      manager,
      althea,
      althea.ADD_MEMBER(),
      manager
    );
    acl.createPermission(
      manager,
      althea,
      althea.DELETE_MEMBER(),
      manager
    );
    acl.createPermission(
      manager,
      althea,
      althea.MANAGE_ESCROW(),
      manager
    );


    // App inits
    vault.initialize();
    finance.initialize(vault, 30 days);
    tokenManager.initialize(token, _maxTokens > 1, _maxTokens);

    // Set up the token stakes
    acl.createPermission(
      this,
      tokenManager,
      tokenManager.MINT_ROLE(),
      this
    );

    for (uint256 i = 0; i < holders.length; i++) {
      tokenManager.mint(holders[i], stakes[i]);
    }

    // EVMScriptRegistry permissions
    EVMScriptRegistry reg = EVMScriptRegistry(
      dao.getApp(dao.APP_ADDR_NAMESPACE(),
       EVMSCRIPT_REGISTRY_APP_ID)
    );
    acl.createPermission(
      voting,
      reg,
      reg.REGISTRY_ADD_EXECUTOR_ROLE(),
      voting
    );
    acl.createPermission(
      voting,
      reg,
      reg.REGISTRY_MANAGER_ROLE(),
      voting
    );


    // Clean-up
    cleanupPermission(acl, voting, dao, dao.APP_MANAGER_ROLE());
    cleanupPermission(acl, voting, tokenManager, tokenManager.MINT_ROLE());
    registerAragonID(name, dao);
    emit DeployInstance(dao, token);

    // Voting is returned so its init can happen later
    return (dao, acl, finance, tokenManager, vault, voting, althea);
  }


  // beta-base
  function cacheToken(MiniMeToken token, address owner) internal {
    tokenCache[owner] = token;
    emit DeployToken(token, owner);
  }

  // beta-base
  function popTokenCache(address owner) internal returns (MiniMeToken) {
    require(tokenCache[owner] != address(0));
    MiniMeToken token = MiniMeToken(tokenCache[owner]);
    delete tokenCache[owner];

    return token;
  }

  // beta-base
  function registerAragonID(string name, address owner) internal {
    aragonID.register(keccak256(abi.encodePacked(name)), owner);
  }
}
