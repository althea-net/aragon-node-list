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

import "@aragon/kits-base/contracts/KitBase.sol";

import "@aragon/os/contracts/common/IsContract.sol";

import "@aragon/apps-voting/contracts/Voting.sol";
import "@aragon/apps-finance/contracts/Finance.sol";
import "@aragon/apps-vault/contracts/Vault.sol";
import "@aragon/apps-token-manager/contracts/TokenManager.sol";
import "@aragon/apps-shared-minime/contracts/MiniMeToken.sol";

import "./Althea.sol";

contract Kit is KitBase, APMNamehash {
	MiniMeTokenFactory tokenFactory;

	address constant ANY_ENTITY = address(-1);

	constructor(ENS ens) KitBase(DAOFactory(0), ens) {
    tokenFactory = new MiniMeTokenFactory();
	}

	function newInstance() {
		Kernel dao = fac.newDAO(this);
		ACL acl = ACL(dao.acl());
		acl.createPermission(this, dao, dao.APP_MANAGER_ROLE(), this);

		address root = msg.sender;
		bytes32 altheaId = apmNamehash("althea");
		bytes32 votingAppId = apmNamehash("voting");
		bytes32 tokenManagerId = apmNamehash("token-manager");
		bytes32 financeId = apmNamehash("finance");
		bytes32 vaultId = apmNamehash("vault");

		Althea althea = Althea(
			dao.newAppInstance(altheaId, latestVersionAppBase(altheaId))
		);

		Voting voting = Voting(
			dao.newAppInstance(votingAppId, latestVersionAppBase(votingAppId))
		);

    Vault vault = Vault(
      dao.newAppInstance(
        vaultId, latestVersionAppBase(vaultId)
      )
    );

    Finance finance = Finance(
      dao.newAppInstance(
        financeId, latestVersionAppBase(financeId)
      )
    );

		TokenManager tokenManager = TokenManager(
      dao.newAppInstance(
        tokenManagerId, latestVersionAppBase(tokenManagerId)
      )
    );

		MiniMeToken token = tokenFactory.createCloneToken(
      MiniMeToken(0), 0, "App token", 0, "APP", true
    );

		token.changeController(tokenManager);

		tokenManager.initialize(token, true, 0);
		// Initialize apps

		voting.initialize(token, 50*10**16, 20*10*16, 1 days);

		acl.createPermission(this, tokenManager, tokenManager.MINT_ROLE(), this);
		tokenManager.mint(root, 1); // Give one token to root

		acl.createPermission(
      ANY_ENTITY, voting, voting.CREATE_VOTES_ROLE(), root
    );

		althea.initialize(finance);

		acl.createPermission(voting, althea, althea.MANAGER(), root);
		acl.createPermission(voting, althea, althea.ADD(), root);
		acl.createPermission(voting, althea, althea.DELETE(), root);

		acl.grantPermission(voting, tokenManager, tokenManager.MINT_ROLE());

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
