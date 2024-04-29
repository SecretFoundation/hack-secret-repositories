
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingDapp {
    // Ownable functionality
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Counter functionality
    uint256 private pollIdCounter;

    function _incrementPollId() internal {
        pollIdCounter++;
    }

    function _getCurrentPollId() internal view returns (uint256) {
        return pollIdCounter;
    }

    function getPollsCount() external view returns (uint256) {
        return pollIdCounter;
    }

    // Struct to represent a poll
    struct Poll {
        uint256 id;
        string title;
        string description;
        uint256 startTime; // Timestamp of poll creation
        uint256 duration; // Duration in seconds
        mapping(address => bool) voters; // Mapping to check if an address has voted
        uint256 yesVotes;
        uint256 noVotes;
        bool isActive;
    }

    // Array to store all polls
    mapping(uint256 => Poll) public polls;

    // Event to notify when a new poll is created
    event PollCreated(uint256 indexed id, string title, string description, uint256 duration);

    // Modifier to check if a poll is active
    modifier onlyActivePoll(uint256 _pollId) {
        require(polls[_pollId].isActive, "Poll is not active");
        _;
    }

    // Function to create a new poll
    function createPoll(string memory _title, string memory _description, uint256 _duration) external onlyOwner {
        uint256 pollId = _getCurrentPollId();
        _incrementPollId();

        polls[pollId].id = pollId;
        polls[pollId].title = _title;
        polls[pollId].description = _description;
        polls[pollId].startTime = block.timestamp;
        polls[pollId].duration = _duration;
        polls[pollId].isActive = true;
        polls[pollId].yesVotes = 0;
        polls[pollId].noVotes = 0;

        emit PollCreated(pollId, _title, _description, _duration);

    }


    function getYesVotes(uint256 _pollId) external view returns (uint256) {
    require(_pollId <= pollIdCounter, "Poll does not exist");
    
    return polls[_pollId].yesVotes;
}

    
    
    function getNoVotes(uint256 _pollId) external view returns (uint256) {
        require(_pollId <= pollIdCounter, "Poll does not exist");
        
        return polls[_pollId].noVotes;
    }
    
    
    


    function getPollDetails(uint256 _pollId) external view returns (
    string memory title,
    string memory description,
    uint256 startTime,
    uint256 duration,
    uint256 yesVotes,
    uint256 noVotes,
    bool isActive
) {
    require(_pollId <= pollIdCounter, "Poll does not exist");

    Poll storage poll = polls[_pollId];

    return (
        poll.title,
        poll.description,
        poll.startTime,
        poll.duration,
        poll.yesVotes,
        poll.noVotes,
        poll.isActive
    );
}



    function vote(uint256 _pollId, string memory _voteOption) external onlyActivePoll(_pollId) {
  require(!polls[_pollId].voters[msg.sender], "You have already voted in this poll"); // Check if user already voted

  // Validate vote option (e.g., "yes" or "no")
  require(keccak256(abi.encodePacked(_voteOption)) == keccak256(abi.encodePacked("yes")) || keccak256(abi.encodePacked(_voteOption)) == keccak256(abi.encodePacked("no")), "Invalid vote option");

  // Update vote counts
  if (keccak256(abi.encodePacked(_voteOption)) == keccak256(abi.encodePacked("yes"))) {
    polls[_pollId].yesVotes++;
  } else {
    polls[_pollId].noVotes++;
  }

  // Mark the address as having voted
  polls[_pollId].voters[msg.sender] = true;
}


}
