// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract PlayerStats {

    struct Player {
        string name;
        uint256 age;
        address coachid;
        string teamName;
        uint256 gamesPlayed;
        uint256 goalsScored;
        uint256 minutesPlayed;
        string position;
    }

    struct Coach {
        string name;
        address id;
        string teamName;
        uint256 playerCount;
        mapping(uint256 => Player) coachsPlayers;
    }

    mapping (string => Player) public players;
    mapping (address => Coach) public coaches;

    function addCoach(string memory _name, string memory _teamName) public {
        require(coaches[msg.sender].id == address(0), "This coach already exists!");

        Coach storage newCoach = coaches[msg.sender];
        newCoach.name = _name;
        newCoach.id = msg.sender;
        newCoach.teamName = _teamName;
        newCoach.playerCount = 0;
    }

    function addPlayer(string memory _name, uint256 _age, string memory _position) public {
        require(coaches[msg.sender].id == msg.sender, "You are not a coach!");
        require(bytes(players[_name].name).length == 0, "This player already exists!");

        players[_name].name = _name;
        players[_name].age = _age;
        players[_name].coachid = msg.sender;
        players[_name].teamName = coaches[msg.sender].teamName;
        players[_name].gamesPlayed = 0;
        players[_name].goalsScored = 0;
        players[_name].minutesPlayed = 0;
        players[_name].position = _position;

        coaches[msg.sender].playerCount++;
        coaches[msg.sender].coachsPlayers[coaches[msg.sender].playerCount] = players[_name];
    }

    function removeCoach() public {
        require (coaches[msg.sender].id == msg.sender, "You are not a coach"); //Coach can only remove themselves as a coach
        for(uint256 i = 1; i <= coaches[msg.sender].playerCount; i++) { //Deletes all the players in the coachsPlayer map for that coach
            delete players[coaches[msg.sender].coachsPlayers[i].name];
        }
        delete coaches[msg.sender]; //Deletes the coach from the coach map
    }

    function updateStats(string memory _name, uint256 _gamesPlayed, uint256 _goalsScored, uint256 _minutesPlayed) public {
        require (players[_name].coachid == msg.sender, "You are not this player's coach!");
        players[_name].gamesPlayed = players[_name].gamesPlayed + _gamesPlayed;
        players[_name].goalsScored = players[_name].goalsScored + _goalsScored;
        players[_name].minutesPlayed = players[_name].minutesPlayed + _minutesPlayed;
    }

    function getPlayersStats(string memory _name) public view returns(string memory, uint256, string memory, string memory, string memory, uint256, uint256, uint256) {
        Player memory p = players[_name];
        return (p.name, p.age, p.teamName, p.position, coaches[p.coachid].name, p.gamesPlayed, p.goalsScored, p.minutesPlayed);

    }
}