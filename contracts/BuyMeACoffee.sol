// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Deploy to goerli at address:  0x967eD51757B9526119380F50bC62341d867E13fd

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BuyMeACoffee {

    // Memo event
     event newMemo(
    address indexed from, 
     uint256 timeStamp,
     string name,
     string message
     );

    // Memo struct
     struct Memo {
        address payable from;
        uint256 timeStamp;
        string name;
        string message;
     }

    //  list of all Memos received from friends
    Memo[] memos;

    // Owner address
    address payable owner;

    // deployed logic
    constructor(){
        owner = payable(msg.sender);
    }


/** 
    * @dev  buy a coffee for contract owner,
    * @param _name of the coffee buyer,
    * @param _message to the coffee buyer
*/
    function buyCoffee(string memory _name, string memory _message) public payable  {
        require(msg.value > 0, "Can not buy a coffee with 0 ethers.");

        // Add the new memo to storage.
       memos.push(Memo(
            payable(msg.sender),
            block.timestamp,
            _name,
            _message
        ));
    }

/** 
    * @dev transfer the contract balance to the owner.
*/
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

  /** 
    * @dev retrive all the memos received and stored in blockchain.
*/
function getMemos() public view returns(Memo[] memory){
    return memos;
}

}
