// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

library MessageStorage {
    bytes32 internal constant NAMESPACE = keccak256("message.storage");

    struct Storage {
        string msg;
    }

    function getStorage() internal pure returns (Storage storage m) {
        bytes32 position = NAMESPACE;

        assembly {
            m.slot := position
        }
    }

    function getMessage() internal view returns (string memory) {
        Storage storage m = getStorage();

        return m.msg;
    }

    function setMessage(string calldata _msg) internal {
        Storage storage m = getStorage();
        m.msg = _msg;
    }
}
