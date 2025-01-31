// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.7.0;

contract VaultProxy {
    // Storage position of the address of the current implementation
    bytes32 private constant IMPLEMENTATION_SLOT = bytes32(uint256(keccak256('eip1967.proxy.implementation')) - 1);

    constructor(address _implementation) {
        require(_implementation != address(0), "Invalid implementation");
        // Store the implementation address
        assembly {
            sstore(IMPLEMENTATION_SLOT, _implementation)
        }
    }

    fallback() external payable {
        assembly {
            let _implementation := sload(IMPLEMENTATION_SLOT)
            
            // Copy msg.data
            calldatacopy(0, 0, calldatasize())

            // Call implementation
            let result := delegatecall(gas(), _implementation, 0, calldatasize(), 0, 0)
            
            // Copy return data
            returndatacopy(0, 0, returndatasize())

            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

    receive() external payable {}
} 