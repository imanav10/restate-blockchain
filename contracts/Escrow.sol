// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;


interface IERC721 {
    function transferForm(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract Escrow {
    
}