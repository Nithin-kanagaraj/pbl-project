import React, { useState, useEffect } from 'react';
import { getDomains, getRankings } from '../services/api';
import { Award } from 'lucide-react';

const RecruiterDashboard = () => {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const res = await getDomains();
      setDomains(res.data);
    } catch (err) {
      console.error(err);
      // Fallback
      setDomains([
        { id: 1, name: 'Full Stack Development' },
        { id: 2, name: 'Frontend Development' }
      ]);
    }
  };

  const handleDomainChange = async (e) => {
    const domainId = e.target.value;
    setSelectedDomain(domainId);
    if (!domainId) {
      setRankings([]);
      return;
    }
    
    setLoading(true);
    try {
      const res = await getRankings(domainId);
      setRankings(res.data);
    } catch (err) {
      console.error(err);
      // Fallback
      setRankings([
        { candidateId: 1, candidateName: 'Alice Smith', candidateEmail: 'alice@test.com', averageScore: 9.5, sessionCount: 4 },
        { candidateId: 2, candidateName: 'Bob Jones', candidateEmail: 'bob@test.com', averageScore: 8.2, sessionCount: 2 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container">
        <h2 style={{ marginBottom: '2rem' }}>Recruiter Dashboard</h2>
        
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Search Candidates by Domain</h3>
          <div style={{ marginTop: '1rem', maxWidth: '400px' }}>
            <label>Select Domain to View Rankings</label>
            <select className="input-field" value={selectedDomain} onChange={handleDomainChange}>
              <option value="">-- Choose Domain --</option>
              {domains.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedDomain && (
          <div className="card">
            <h3>Rankings</h3>
            {loading ? (
              <p>Loading rankings...</p>
            ) : rankings.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '1rem' }}>Rank</th>
                    <th style={{ padding: '1rem' }}>Candidate Name</th>
                    <th style={{ padding: '1rem' }}>Email</th>
                    <th style={{ padding: '1rem' }}>Avg Score</th>
                    <th style={{ padding: '1rem' }}>Sessions Validated</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((r, index) => (
                    <tr key={r.candidateId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem', fontWeight: 'bold', color: index === 0 ? '#fbbf24' : 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {index === 0 && <Award size={18} />} #{index + 1}
                      </td>
                      <td style={{ padding: '1rem' }}>{r.candidateName}</td>
                      <td style={{ padding: '1rem' }}>{r.candidateEmail}</td>
                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>{r.averageScore.toFixed(1)} / 10</td>
                      <td style={{ padding: '1rem' }}>{r.sessionCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ marginTop: '1rem', color: '#666' }}>No candidates ranked for this domain yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
