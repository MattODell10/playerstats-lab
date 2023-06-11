import React, { useState } from "react";
import { PlayerStats } from "./abi/abi";
import Web3 from "web3";
import "./App.css";

// Access our wallet inside of our dapp
const web3 = new Web3(Web3.givenProvider);
// Contract address of the deployed smart contract
const contractAddress = "0x709dF0Db4F0C5d8C1CA684b6c8e4a07408Ad4fEb";
const playerStatsContract = new web3.eth.Contract(PlayerStats, contractAddress);

function App() {
  // Hold variables that will interact with our contract and frontend
  const [coachName, setCoachName] = useState("");
  const [coachTeamName, setCoachTeamName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerAge, setPlayerAge] = useState(0);
  const [playerTeamName, setPlayerTeamName] = useState("");
  const [playerPosition, setPlayerPosition] = useState("");
  const [playerCoachName, setPlayerCoachName] = useState("");
  const [playerGamesPlayed, setPlayerGamesPlayed] = useState(0);
  const [playerGoalsScored, setPlayerGoalsScored] = useState(0);
  const [playerMinutesPlayed, setPlayerMinutesPlayed] = useState(0);
  const [stats, setStats] = useState({});

  // Function to add a coach
  const addCoach = async (t) => {
    t.preventDefault();
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const gas = await playerStatsContract.methods.addCoach(coachName, coachTeamName).estimateGas();
    const result = await playerStatsContract.methods.addCoach(coachName, coachTeamName).send({ from: account, gas});
    console.log(result);
  };

  // Function to add a player
  const addPlayer = async (t) => {
    t.preventDefault();
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const gas = await playerStatsContract.methods.addPlayer(playerName, playerAge, playerPosition).estimateGas();
    const result = await playerStatsContract.methods.addPlayer(playerName, playerAge, playerPosition).send({ from: account, gas});
    console.log(result);
  };

  // Function to remove a coach
  const removeCoach = async () => {
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const gas = await playerStatsContract.methods.removeCoach().estimateGas();
    const result = await playerStatsContract.methods.removeCoach().send({ from: account, gas });
    console.log(result);
  };

  // Function to update a player's stats
  const updateStats = async (t) => {
    t.preventDefault();
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const gas = await playerStatsContract.methods.updateStats(playerName, playerGamesPlayed, playerGoalsScored, playerMinutesPlayed).estimateGas();
    const result = await playerStatsContract.methods.updateStats(playerName, playerGamesPlayed, playerGoalsScored, playerMinutesPlayed).send({ from: account, gas });
    console.log(result);
  };

  // Function to get a player's stats
  const getPlayerStats = async () => {
    try {
      const statsResults = await playerStatsContract.methods.getPlayersStats(playerName).call();
      console.log("Player stats:", statsResults);
      // Update the state variables
      setStats({
        playerName: statsResults[0],
        playerAge: statsResults[1],
        playerTeamName: statsResults[2],
        playerPosition: statsResults[3],
        playerCoachName: statsResults[4],
        playerGamesPlayed: statsResults[5],
        playerGoalsScored: statsResults[6],
        playerMinutesPlayed: statsResults[7],
      });
    } catch (error) {
      console.error("Error getting player stats:", error);
    }
  };
  
  return (
    <div className="App">
      <h1 className="header">Player Stats</h1>
        <form onSubmit={addCoach}>
          <h2 className="subheader">Create a Coach Account</h2>
          <label>
            Name:
            <input className="inputField" type="text" value={coachName} onChange={(t) => setCoachName(t.target.value)} />
          </label>
          <br />
          <label>
            Team Name:
            <input className="inputField" type="text" value={coachTeamName} onChange={(t) => setCoachTeamName(t.target.value)} />
          </label>
          <br />
          <button className="button" type="submit">Add Account</button>
        </form>
        <br />
        <br />

        <form onSubmit={addPlayer}>
          <h2 className="subheader">Add a Player to your Team</h2>
          <label>
            Player Name:
            <input className="inputField" type="text" value={playerName} onChange={(t) => setPlayerName(t.target.value)} />
          </label>
          <br />
          <label>
            Player Age:
            <input className="inputField" type="number" value={playerAge} onChange={(t) => setPlayerAge(t.target.value)} />
          </label>
          <br />
          <label>
            Player Position:
            <input className="inputField" type="text" value={playerPosition} onChange={(t) => setPlayerPosition(t.target.value)} />
          </label>
          <br />
          <button className="button" type="submit">Add Player</button>
        </form>
        <br />
        <br />

        <h2 className="subheader">Remove Your Coach Account and Your Players</h2>
        <button className ="button" onClick={removeCoach}>Remove Account</button>
        <br />
        <br />

        <form onSubmit={updateStats}>
          <h2 className="subheader">Update a Player's Stats</h2>
          <label>
            Player Name:
            <input className="inputField" type="text" value={playerName} onChange={(t) => setPlayerName(t.target.value)} />
          </label>
          <br />
          <label>
            Games Played:
            <input className="inputField" type="number" value={playerGamesPlayed} onChange={(t) => setPlayerGamesPlayed(t.target.value)} />
          </label>
          <br />
          <label>
            Goals Scored:
            <input className="inputField" type="number" value={playerGoalsScored} onChange={(t) => setPlayerGoalsScored(t.target.value)} />
          </label>
          <br />
          <label>
            Minutes Played:
            <input className="inputField" type="number" value={playerMinutesPlayed} onChange={(t) => setPlayerMinutesPlayed(t.target.value)} />
          </label>
          <br />
          <button className="button" type="submit">Update</button>
        </form>
        <br />
        <br />
        <br />

      <h2 className="subheader">Get Player's Stats</h2>
      <br />
      <div className="container">
        <div className="form-container">
          <label htmlFor="playerName">Enter Player's Name:</label>
          <input type="text" id="playerName" name="playerName" value={playerName} onChange={(t) => setPlayerName(t.target.value)} />
          <button onClick={getPlayerStats}>Get Stats</button>
        </div>
        <div className="stats-container">
          <p>Player's Name: {stats.playerName}</p>
          <p>Age: {stats.playerAge}</p>
          <p>Team Name: {stats.playerTeamName}</p>
          <p>Position: {stats.playerPosition}</p>
          <p>Coach's Name: {stats.playerCoachName}</p>
          <p>Games Played: {stats.playerGamesPlayed}</p>
          <p>Goals Scored: {stats.playerGoalsScored}</p>
          <p>Minutes Played: {stats.playerMinutesPlayed}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
