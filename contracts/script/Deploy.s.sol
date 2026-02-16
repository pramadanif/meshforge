// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {AgentRegistry} from "../src/AgentRegistry.sol";
import {MeshVault} from "../src/MeshVault.sol";
import {IntentMesh} from "../src/IntentMesh.sol";
import {AgentFactory} from "../src/AgentFactory.sol";

/// @title Deploy — Deploys all MeshForge v2 ERC-8004 contracts to Celo Sepolia
contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address cUSDToken = vm.envAddress("CUSD_TOKEN");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy AgentRegistry
        AgentRegistry registry = new AgentRegistry();
        console.log("AgentRegistry:", address(registry));

        // 2. Deploy MeshVault
        MeshVault vault = new MeshVault(cUSDToken);
        console.log("MeshVault:", address(vault));

        // 3. Deploy IntentMesh (links to registry + vault)
        IntentMesh mesh = new IntentMesh(address(registry), address(vault));
        console.log("IntentMesh:", address(mesh));

        // 4. Deploy AgentFactory (links to registry)
        AgentFactory factory = new AgentFactory(address(registry));
        factory.setIntentMesh(address(mesh));
        console.log("AgentFactory:", address(factory));

        // 5. Wire permissions
        // IntentMesh → can call AgentRegistry.recordSettlement
        registry.setAuthorized(address(mesh), true);
        // AgentFactory → can call AgentRegistry.registerAgent
        registry.setAuthorized(address(factory), true);
        // IntentMesh → can call MeshVault.lockFunds/releaseFunds/refundFunds
        vault.setIntentMesh(address(mesh));

        console.log("=== All permissions wired ===");

        vm.stopBroadcast();
    }
}
