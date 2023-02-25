// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {MessageStorage} from "../library/MessageStorage.sol";

contract SetMessageFacet {
    function setMessage(string calldata _msg) external {
        MessageStorage.setMessage(_msg);
    }
}
