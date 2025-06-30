// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
contract Dappcord is ERC721 {
    address public owner;
    uint256 public totalSupply;
    uint256 public totalChannels = 0;
    struct Channel {
        uint256 id;
        string name;
        uint256 cost;
    }

    //saving channels is done by mapping; its a key-value pair
    mapping(uint256 => Channel) public channels;

    mapping(uint256 => mapping(address => bool)) public channelMembers;

    modifier onlyOwner() {
        require(msg.sender == owner); // only owner can  creaate channels kinda like a moderatr in discord
        _; // this means evry thins above this line will be executed first
    }

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }
    function createChannel(
        string memory _name,
        uint256 _cost
    ) public onlyOwner {
        totalChannels++;
        channels[totalChannels] = Channel(totalChannels, _name, _cost); //total channels is the key and Channel is the value
    }
    function getChannel(uint256 _id) public view returns (Channel memory) {
        return channels[_id];
    }
    function mint(uint256 _id) public payable {
        //join channel

        require(_id != 0);
        require(_id <= totalChannels);
        require(channelMembers[_id][msg.sender] == false); //so that same id doesnt join twice
        require(msg.value >= channels[_id].cost); // check if user  has enough funds to join the channel

        channelMembers[_id][msg.sender] = true;
        //mint an nft
        totalSupply++;
        _safeMint(msg.sender, totalSupply);
    }
    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}(""); // transfer the balance to the owner
        require(success, "Transfer  failed");
    }
}
