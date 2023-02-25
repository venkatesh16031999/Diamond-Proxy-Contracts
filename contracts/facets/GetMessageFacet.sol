// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {MessageStorage} from "../library/MessageStorage.sol";

contract GetMessageFacet {
    function getMessage() external view returns (string memory) {
        return MessageStorage.getMessage();
    }
}
