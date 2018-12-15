/*
 * SPDX-License-Identitifer:    GPL-3.0-or-later
 *
 * This file requires contract dependencies which are licensed as
 * GPL-3.0-or-later, forcing it to also be licensed as such.
 *
 * This is the only file in your project that requires this license and
 * you are free to choose a different license for the rest of the project.
 */

pragma solidity 0.4.24;

import "@aragon/os/contracts/factory/DAOFactory.sol";
import "@aragon/os/contracts/apm/Repo.sol";
import "@aragon/os/contracts/lib/ens/ENS.sol";
import "@aragon/os/contracts/lib/ens/PublicResolver.sol";
import "@aragon/os/contracts/apm/APMNamehash.sol";

import "@aragon/apps-finance/contracts/Finance.sol";
import "@aragon/apps-vault/contracts/Vault.sol";

import "./Althea.sol";

contract KitBase is APMNamehash {
  ENS public ens;
  DAOFactory public fac;

  event DeployInstance(address dao);
  event InstalledApp(address appProxy, bytes32 appId);

  function KitBase(DAOFactory _fac, ENS _ens) {
    ens = _ens;

    // If no factory is passed, get it from on-chain bare-kit
    if (address(_fac) == address(0)) {
        bytes32 bareKit = apmNamehash("bare-kit");
        fac = KitBase(latestVersionAppBase(bareKit)).fac();
    } else {
        fac = _fac;
    }
  }

  function latestVersionAppBase(bytes32 appId) public view returns (address base) {
    Repo repo = Repo(PublicResolver(ens.resolver(appId)).addr(appId));
    (,base,) = repo.getLatest();

    return base;
  }
}

contract Kit is KitBase {

  uint64 constant PCT = 10 ** 16;
  address constant ANY_ENTITY = address(-1);

  function Kit(ENS ens) KitBase(DAOFactory(0), ens) {
  }

  function newInstance() {
    Kernel dao = fac.newDAO(this);
    ACL acl = ACL(dao.acl());
    acl.createPermission(this, dao, dao.APP_MANAGER_ROLE(), this);

    address root = msg.sender;
    bytes32 altheaId = apmNamehash("althea");
    bytes32 vaultId = apmNamehash("vault");
    bytes32 financeId = apmNamehash("finance");

    Althea althea = Althea(
      dao.newAppInstance(altheaId, latestVersionAppBase(altheaId))
    );

    Vault vault = Vault(
      dao.newAppInstance(vaultId, latestVersionAppBase(vaultId))
    );

    Finance finance = Finance(
      dao.newAppInstance(financeId, latestVersionAppBase(financeId))
    );

    acl.createPermission(root, althea, althea.MANAGER(), root);
    acl.createPermission(ANY_ENTITY, althea, althea.ADD(), root);
    acl.createPermission(root, althea, althea.DELETE(), root);

    acl.createPermission(finance, vault, vault.TRANSFER_ROLE(), root);
    acl.createPermission(root, finance, finance.CREATE_PAYMENTS_ROLE(), root);
    acl.createPermission(root, finance, finance.EXECUTE_PAYMENTS_ROLE(), root);
    acl.createPermission(root, finance, finance.MANAGE_PAYMENTS_ROLE(), root);

    vault.initialize();
    finance.initialize(vault, 30 days);
    althea.initialize(vault);

    // Clean up permissions
    acl.grantPermission(root, dao, dao.APP_MANAGER_ROLE());
    acl.revokePermission(this, dao, dao.APP_MANAGER_ROLE());
    acl.setPermissionManager(root, dao, dao.APP_MANAGER_ROLE());

    acl.grantPermission(root, acl, acl.CREATE_PERMISSIONS_ROLE());
    acl.revokePermission(this, acl, acl.CREATE_PERMISSIONS_ROLE());
    acl.setPermissionManager(root, acl, acl.CREATE_PERMISSIONS_ROLE());

    emit DeployInstance(dao);
  }
}
