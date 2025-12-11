import React, { useState, useEffect } from 'react';
import {
  fetchBurnleyResults,
  fetchBurnleyMatches,
  fetchPremierLeagueTable,
} from '../services/footballApi';

function Burnley() {
  const [results, setResults] = useState([]);
  const [matches, setMatches] = useState([]);
  const [table, setTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resultsData, matchesData, tableData] = await Promise.all([
          fetchBurnleyResults(),
          fetchBurnleyMatches(),
          fetchPremierLeagueTable(),
        ]);
        setResults(resultsData.matches);
        setMatches(matchesData.matches);
        setTable(tableData.standings[0].table);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div id="burnley" className="tabcontent" style={{ display: 'block' }}>
      <h3>Burnley FC</h3>
      <div id="burnley-data">
        <h4>Last 5 Results</h4>
        <ul id="burnley-results">
          {results.length > 0 ? (
            results.map((match) => (
              <li key={match.id}>
                {match.homeTeam.name} {match.score.fullTime.home} -{' '}
                {match.score.fullTime.away} {match.awayTeam.name}
              </li>
            ))
          ) : (
            <li>No recent results found.</li>
          )}
        </ul>
        <h4>Next 5 Matches</h4>
        <ul id="burnley-matches">
          {matches.length > 0 ? (
            matches.map((match) => (
              <li key={match.id}>
                {match.homeTeam.name} vs {match.awayTeam.name} on{' '}
                {new Date(match.utcDate).toLocaleDateString()}
              </li>
            ))
          ) : (
            <li>No upcoming matches found.</li>
          )}
        </ul>
        <h4>Premier League Table</h4>
        <div id="premier-league-table-container">
          <table id="premier-league-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Team</th>
                <th>Played</th>
                <th>Won</th>
                <th>Drawn</th>
                <th>Lost</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row) => (
                <tr key={row.team.id}>
                  <td>{row.position}</td>
                  <td>
                    <img
                      src={row.team.crest}
                      alt={row.team.name}
                      className="team-crest"
                    />{' '}
                    {row.team.name}
                  </td>
                  <td>{row.playedGames}</td>
                  <td>{row.won}</td>
                  <td>{row.draw}</td>
                  <td>{row.lost}</td>
                  <td>{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Burnley;
