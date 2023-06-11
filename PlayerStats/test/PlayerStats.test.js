const PlayerStats = artifacts.require('PlayerStats');

contract('PlayerStats', (accounts) => {
  let playerStats;

  beforeEach(async () => {
    playerStats = await PlayerStats.new();
  });

  it('should add a coach', async () => {
    const coachName = 'Matthew ODell';
    const teamName = 'Team A';

    await playerStats.addCoach(coachName, teamName);

    const coach = await playerStats.getCoach(accounts[0]);
    assert.equal(coach[0], coachName);
    assert.equal(coach[1], accounts[0]);
    assert.equal(coach[2], teamName);
  });

  it('should add a player', async () => {
    const coachName = 'Matthew ODell';
    const teamName = 'Team A';
    const playerName = 'John';
    const age = 21;
    const position = 'Forward';

    await playerStats.addCoach(coachName, teamName);
    await playerStats.addPlayer(playerName, age, position);

    const player = await playerStats.getPlayersStats(playerName);
    assert.equal(player[0], playerName);
    assert.equal(player[1], age);
    assert.equal(player[2], teamName);
    assert.equal(player[3], position);
    assert.equal(player[4], coachName);
    assert.equal(player[5], 0);
    assert.equal(player[6], 0);
    assert.equal(player[7], 0);
  });

  it('should update player stats', async () => {
    const coachName = 'Matthew ODell';
    const teamName = 'Team A';
    const playerName = 'John';
    const age = 21;
    const position = 'Forward';
    const gamesPlayed = 10;
    const goalsScored = 7;
    const minutesPlayed = 600;

    await playerStats.addCoach(coachName, teamName);
    await playerStats.addPlayer(playerName, age, position);
    await playerStats.updateStats(playerName, gamesPlayed, goalsScored, minutesPlayed);

    const player = await playerStats.getPlayersStats(playerName);
    assert.equal(player[5], gamesPlayed);
    assert.equal(player[6], goalsScored);
    assert.equal(player[7], minutesPlayed);
  });

  it('should not allow adding a duplicate player', async () => {
    const coachName = 'Matthew ODell';
    const teamName = 'Team A';
    const playerName = 'John';
    const age = 21;
    const position = 'Forward';

    await playerStats.addCoach(coachName, teamName);
    await playerStats.addPlayer(playerName, age, position);

    try {
      await playerStats.addPlayer(playerName, age, position);
      assert.fail('Expected an exception');
    } catch (error) {
      assert.include(error.message, 'This player already exists');
    }
  });

  it('should not allow adding a duplicate coach', async () => {
    const coachName = 'Matthew ODell';
    const teamName = 'Team A';
  
    await playerStats.addCoach(coachName, teamName);
  
    try {
      await playerStats.addCoach(coachName, teamName);
      assert.fail('Expected an exception');
    } catch (error) {
      assert.include(error.message, 'This coach already exists');
    }
  });
  
  it('should remove a coach and their players', async () => {
    const coachName = 'Matthew ODell';
    const teamName = 'Team A';
    const playerName = 'John';
    const age = 21;
    const position = 'Forward';
  
    await playerStats.addCoach(coachName, teamName);
    await playerStats.addPlayer(playerName, age, position);
  
    await playerStats.removeCoach();
  
    const coach = await playerStats.getCoach(accounts[0]);
    assert.equal(coach[0], '');
    assert.equal(coach[1], '0x0000000000000000000000000000000000000000');
    assert.equal(coach[2], '');
  
    let error = null;
    try {
      await playerStats.getPlayersStats(playerName);
    } catch (err) {
      error = err;
    }
  
    assert.isNotOk(error, 'Expected no error to be thrown');
  });

  it('should not allow a non-existing coach to be removed', async () => {
    try {
      await playerStats.removeCoach();
      assert.fail('Expected an exception');
    } catch (error) {
      assert.include(error.message, 'You are not a coach');
    }
  });
});