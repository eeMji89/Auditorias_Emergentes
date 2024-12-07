// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuditoriaContract {
    struct Auditoria {
        uint256 createdDate;
        uint256 relatedDate;
    }

    Auditoria[] public auditorias;

    function addAuditoria(uint256 _relatedDate) public {
        auditorias.push(Auditoria(block.timestamp, _relatedDate));
    }

    function getAuditoria(uint256 index) public view returns (Auditoria memory) {
        require(index < auditorias.length, "Index out of bounds");
        return auditorias[index];
    }

    function getTotalAuditorias() public view returns (uint256) {
        return auditorias.length;
    }
}
