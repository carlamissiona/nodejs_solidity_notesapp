// SPDX-License-Identifier: MIT
pragma solidity ^0.5.17;

contract Mapping {
     
    mapping(uint => string) public mapNotes;

    function getnotes(uint _index) public view returns (string memory) {
        
        return mapNotes[_index];
    }
   
 
    function set(uint _i, string memory _vl) public {
        
        mapNotes[_i] = _vl;
    }

    function remove(uint _i) public {
 
        delete mapNotes[_i];
    }
}
