pragma solidity 0.4.24;


// This is the Import truffle hack, which for some reason can't
// be included in Imports.sol
import "@aragon/id/contracts/FIFSResolvingRegistrar.sol";

import "@aragon/os/contracts/factory/DAOFactory.sol";
import "@aragon/os/contracts/kernel/Kernel.sol";
import "@aragon/os/contracts/acl/ACL.sol";
import "@aragon/apps-shared-minime/contracts/MiniMeToken.sol";
import "@aragon/id/contracts/IFIFSResolvingRegistrar.sol";

import "@aragon/kits-bare/contracts/KitBase.sol";

import "@aragon/apps-voting/contracts/Voting.sol";
import "@aragon/apps-vault/contracts/Vault.sol";
import "@aragon/apps-token-manager/contracts/TokenManager.sol";
import "@aragon/apps-finance/contracts/Finance.sol";

import "./Althea.sol";

contract AltheaDAOFactory is KitBase {
  MiniMeTokenFactory public minimeFac;
  IFIFSResolvingRegistrar public aragonID;
  bytes32[5] public appIds;

  mapping (address => address) tokenCache;

    // ensure alphabetic order
  enum Apps { Althea, Finance, TokenManager, Vault, Voting }

  address public MANAGER;

  event DeployToken(address token, address indexed cacheOwner);
  event DeployInstance(address dao, address indexed token);

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
    minimeFac = _minimeFac;
    aragonID = _aragonID;
    appIds = _appIds;
    MANAGER = msg.sender;
  }

  function createDAO(
    string name,
    MiniMeToken token,
    address[] holders,
    uint256[] stakes,
    uint256 _maxTokens
  )
    internal
    returns (Voting)
  {
    require(holders.length == stakes.length);

    Kernel dao = fac.newDAO(this);
    ACL acl = ACL(dao.acl());
    acl.createPermission(this, dao, dao.APP_MANAGER_ROLE(), this);

    Voting voting = Voting(
      dao.newAppInstance(
        appIds[uint8(Apps.Voting)],
        latestVersionAppBase(appIds[uint8(Apps.Voting)])
      )
    );
    emit InstalledApp(voting, appIds[uint8(Apps.Voting)]);

    Vault vault = Vault(
      dao.newAppInstance(
        appIds[uint8(Apps.Vault)],
        latestVersionAppBase(appIds[uint8(Apps.Vault)])
      )
    );
    emit InstalledApp(vault, appIds[uint8(Apps.Vault)]);

    Finance finance = Finance(
      dao.newAppInstance(
        appIds[uint8(Apps.Finance)],
        latestVersionAppBase(appIds[uint8(Apps.Finance)])
      )
    );
    emit InstalledApp(finance, appIds[uint8(Apps.Finance)]);

    TokenManager tokenManager = TokenManager(
      dao.newAppInstance(
        appIds[uint8(Apps.TokenManager)],
        latestVersionAppBase(appIds[uint8(Apps.TokenManager)])
      )
    );
    emit InstalledApp(tokenManager, appIds[uint8(Apps.TokenManager)]);

    Althea althea = Althea(
      dao.newAppInstance(
        appIds[uint8(Apps.Althea)],
        latestVersionAppBase(appIds[uint8(Apps.Althea)])
      )
    );
    emit InstalledApp(althea, appIds[uint8(Apps.Althea)]);

    // Required for initializing the Token Manager
    token.changeController(tokenManager);

    // Permissions
    acl.createPermission(
      acl.ANY_ENTITY(),
      voting,
      voting.CREATE_VOTES_ROLE(),
      voting
    );
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

    acl.createPermission(
      MANAGER,
      althea,
      althea.ADD_MEMBER(),
      msg.sender
    );

    acl.createPermission(
      MANAGER,
      althea,
      althea.DELETE_MEMBER(),
      msg.sender
    );
    acl.createPermission(
      MANAGER,
      althea,
      althea.MANAGE_ESCROW(),
      msg.sender
    );


    // App inits
    vault.initialize();
    finance.initialize(vault, uint64(-1) - uint64(now)); // yuge period
    tokenManager.initialize(token, _maxTokens > 1, _maxTokens);

    // Set up the token stakes
    acl.createPermission(this, tokenManager, tokenManager.MINT_ROLE(), this);

    for (uint256 i = 0; i < holders.length; i++) {
      tokenManager.mint(holders[i], stakes[i]);
    }

    // Clean-up
    cleanupPermission(acl, voting, dao, dao.APP_MANAGER_ROLE());
    cleanupPermission(acl, voting, tokenManager, tokenManager.MINT_ROLE());

    registerAragonID(name, dao);
    emit DeployInstance(dao, token);

    // Voting is returned so its init can happen later
    return voting;
  }

  function cacheToken(MiniMeToken token, address owner) internal {
    tokenCache[owner] = token;
    emit DeployToken(token, owner);
  }

  function popTokenCache(address owner) internal returns (MiniMeToken) {
    require(tokenCache[owner] != address(0));
    MiniMeToken token = MiniMeToken(tokenCache[owner]);
    delete tokenCache[owner];

    return token;
  }

  function registerAragonID(string name, address owner) internal {
    aragonID.register(keccak256(abi.encodePacked(name)), owner);
  }

  function newToken(string name, string symbol) external returns (MiniMeToken token) {
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
    Voting voting = createDAO(
      name,
      token,
      signers,
      stakes,
      1
    );

    // We are subtracting 1 because comparison in Voting app is strict,
    // while Multisig needs to allow equal too. So for instance in 2 out of 4
    // multisig, we would define 50 * 10 ^ 16 - 1 instead of just 50 * 10 ^ 16,
    // so 2 signatures => 2 * 10 ^ 18 / 4 = 50 * 10 ^ 16 > 50 * 10 ^ 16 - 1 would pass
    uint256 multisigSupport = neededSignaturesE18 / signers.length - 1;
    voting.initialize(
    token,
    multisigSupport,
    multisigSupport,
    1825 days // ~5 years
    );

    // Include support modification permission to handle changes to the multisig's size
    ACL acl = ACL(Kernel(voting.kernel()).acl());
    acl.createPermission(voting, voting, voting.MODIFY_SUPPORT_ROLE(), voting);

    cleanupPermission(acl, voting, acl, acl.CREATE_PERMISSIONS_ROLE());
  }
}
