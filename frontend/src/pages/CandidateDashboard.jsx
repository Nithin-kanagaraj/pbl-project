import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getDomains,
  getValidatorsByDomain,
  getMySessions,
  getValidatorProfile,
  getSlots,
  getMyEvaluations,
} from '../services/api';
import { AuthContext } from '../context/AuthContext';

const formatDate = (date) => {
  if (!date) return '—';
  let d = date;
  if (Array.isArray(date)) {
    d = `${date[0]}-${String(date[1]).padStart(2, '0')}-${String(date[2]).padStart(2, '0')}`;
  } else if (typeof date === 'object') {
    d = `${date.year}-${String(date.monthValue || 1).padStart(2, '0')}-${String(date.dayOfMonth || 1).padStart(2, '0')}`;
  }
  
  const parsed = new Date(d);
  if (isNaN(parsed)) return String(date);
  
  return parsed.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' });
};

const formatTime = (time) => {
  if (!time) return '';
  if (Array.isArray(time)) {
    return `${String(time[0]).padStart(2, '0')}:${String(time[1]).padStart(2, '0')}`;
  } else if (typeof time === 'object') {
    return `${String(time.hour || 0).padStart(2, '0')}:${String(time.minute || 0).padStart(2, '0')}`;
  }
  return String(time).slice(0, 5);
};

const formatDateTime = (date, startTime, endTime) => {
  if (!date) return '—';
  const dateStr = formatDate(date);
  if (dateStr === '—') return '—';
  const timeStr = startTime && endTime ? ` · ${formatTime(startTime)} – ${formatTime(endTime)}` : '';
  return dateStr + timeStr;
};

const StatusBadge = ({ status }) => {
  const map = {
    SCHEDULED: { cls: 'badge-warning', label: 'Scheduled' },
    COMPLETED:  { cls: 'badge-success', label: 'Completed' },
    CANCELLED:  { cls: 'badge-danger',  label: 'Cancelled' },
  };
  const { cls, label } = map[status] || { cls: 'badge-blue', label: status };
  return <span className={`badge ${cls}`}>{label}</span>;
};

const CandidateDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [validators, setValidators] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [myEvaluations, setMyEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('sessions'); // 'sessions' | 'feedback'

  useEffect(() => {
    fetchDomains();
    fetchMySessions();
    fetchMyEvaluations();
  }, []);

  const fetchDomains = async () => {
    try {
      const res = await getDomains();
      setDomains(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMySessions = async () => {
    try {
      const res = await getMySessions();
      setMySessions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyEvaluations = async () => {
    try {
      const res = await getMyEvaluations();
      setMyEvaluations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDomainChange = async (e) => {
    const domainId = e.target.value;
    setSelectedDomain(domainId);
    if (!domainId) {
      setValidators([]);
      return;
    }
    setLoading(true);
    try {
      const res = await getValidatorsByDomain(domainId);
      const detailed = await Promise.all(
        res.data.map(async (v) => {
          try {
            const profileRes = await getValidatorProfile(v.id);
            const slotsRes = await getSlots(v.id, true);
            return { 
              ...v, 
              ...profileRes.data, 
              availableSlots: slotsRes.data 
            };
          } catch {
            return { ...v, averageRating: 0, totalValidationsCompleted: 0, availableSlots: [] };
          }
        })
      );
      setValidators(detailed);
    } catch (err) {
      console.error(err);
      setValidators([]);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 8) return '#065f46';
    if (score >= 5) return '#92400e';
    return '#991b1b';
  };
  const scoreBg = (score) => {
    if (score >= 8) return '#d1fae5';
    if (score >= 5) return '#fef3c7';
    return '#fee2e2';
  };

  return (
    <div>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            👋 Welcome, {user?.name}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Find expert validators, book sessions and track your progress.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 340px) 1fr', gap: '1.75rem', alignItems: 'start' }}>

          {/* ── LEFT PANEL ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Find Validator */}
            <div className="card">
              <p className="section-title">🔍 Find a Validator</p>
              <label>Domain Area</label>
              <select className="input-field" value={selectedDomain} onChange={handleDomainChange}>
                <option value="">— Choose Domain —</option>
                {domains.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* My Sessions Summary */}
            <div className="card">
              <p className="section-title">📋 My Sessions</p>
              {mySessions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {mySessions.map(session => (
                    <div key={session.id} style={{
                      padding: '0.9rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--surface)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <strong style={{ fontSize: '0.9rem' }}>{session.domain?.name}</strong>
                        <StatusBadge status={session.status} />
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        Validator: <strong>{session.validator?.name}</strong>
                      </p>
                      {session.slot && (
                        <p style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 500 }}>
                          🗓 {formatDateTime(session.slot.date, session.slot.startTime, session.slot.endTime)}
                        </p>
                      )}
                      {session.meetingLink && (
                        <a
                          href={session.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            marginTop: '0.5rem',
                            padding: '0.3rem 0.75rem',
                            backgroundColor: 'var(--success-soft)',
                            color: '#065f46',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                        >
                          🎥 Join Meeting
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', padding: '1rem 0' }}>
                  No sessions booked yet.
                </p>
              )}
            </div>

          </div>

          {/* ── RIGHT PANEL ── */}
          <div>

            {/* Tab switcher */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {[['sessions', '📋 Feedback & Results'], ['browse', '🔎 Browse Validators']].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    padding: '0.55rem 1.2rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    border: activeTab === key ? '2px solid var(--primary)' : '2px solid var(--border-color)',
                    backgroundColor: activeTab === key ? 'var(--primary-soft)' : 'var(--card-bg)',
                    color: activeTab === key ? 'var(--primary)' : 'var(--text-secondary)',
                    transition: 'var(--transition)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── TAB: Feedback & Results ── */}
            {activeTab === 'sessions' && (
              <div className="card">
                <p className="section-title">📊 My Feedback & Evaluation Results</p>
                {myEvaluations.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {myEvaluations.map(ev => (
                      <div key={ev.id} style={{
                        border: '1.5px solid var(--border-color)',
                        borderRadius: '10px',
                        padding: '1.1rem',
                        background: 'var(--surface)',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <div>
                            <strong style={{ fontSize: '0.95rem' }}>{ev.session?.domain?.name}</strong>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                              Validated by <strong>{ev.session?.validator?.name}</strong>
                            </p>
                            {ev.session?.slot && (
                              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                                🗓 {formatDateTime(ev.session.slot.date, ev.session.slot.startTime, ev.session.slot.endTime)}
                              </p>
                            )}
                          </div>
                          <div style={{
                            textAlign: 'center',
                            padding: '0.6rem 1.1rem',
                            borderRadius: '10px',
                            backgroundColor: scoreBg(ev.overallScore),
                            color: scoreColor(ev.overallScore),
                          }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{ev.overallScore?.toFixed(1)}</div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 600 }}>OVERALL /10</div>
                          </div>
                        </div>

                        {/* Score bars */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '0.9rem' }}>
                          {[
                            { label: '💻 Technical', score: ev.technicalScore },
                            { label: '🗣 Communication', score: ev.communicationScore },
                            { label: '🧩 Problem Solving', score: ev.problemSolvingScore },
                          ].map(({ label, score }) => (
                            <div key={label} style={{ background: 'var(--card-bg)', borderRadius: '8px', padding: '0.6rem', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{label}</div>
                              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: scoreColor(score) }}>{score}<span style={{ fontSize: '0.7rem', fontWeight: 400 }}>/10</span></div>
                            </div>
                          ))}
                        </div>

                        {/* Feedback text */}
                        {ev.feedbackText && (
                          <div style={{
                            background: '#f8f9fc',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            padding: '0.8rem 1rem',
                          }}>
                            <p style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.3rem' }}>VALIDATOR FEEDBACK</p>
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{ev.feedbackText}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
                    <p style={{ fontWeight: 500 }}>No evaluations yet.</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>Complete a validation session to see your feedback here.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: Browse Validators ── */}
            {activeTab === 'browse' && (
              <div>
                {!selectedDomain ? (
                  <div style={{
                    textAlign: 'center', padding: '4rem 2rem',
                    background: 'var(--card-bg)', borderRadius: 'var(--border-radius-lg)',
                    border: '2px dashed var(--border-color)',
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👆</div>
                    <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Select a domain on the left to browse validators</h3>
                  </div>
                ) : loading ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading experts…</div>
                ) : validators.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    {validators.map(v => (
                      <div
                        key={v.id}
                        className="card"
                        style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                        onClick={() => navigate(`/validator-profile/${v.id}`)}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>{v.name}</h3>
                            <p style={{ color: 'var(--primary)', fontWeight: 600, margin: '3px 0', fontSize: '0.85rem' }}>{v.designation}</p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{v.currentCompany}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ padding: '3px 10px', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
                              ★ {v.averageRating?.toFixed(1) || '0.0'}
                            </div>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>{v.totalValidationsCompleted} sessions</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                          {v.domains?.map(d => (
                            <span key={d.id} style={{ fontSize: '0.72rem', padding: '2px 8px', backgroundColor: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '4px', fontWeight: 500 }}>{d.name}</span>
                          ))}
                        </div>
                        {v.availableSlots && v.availableSlots.length > 0 && (
                          <div style={{ marginBottom: '1rem', padding: '0.6rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>🗓 Available Slots</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              {v.availableSlots.slice(0, 2).map((s) => (
                                <div key={s.id} style={{ fontSize: '0.78rem', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                                  <span>{formatDate(s.date)}</span>
                                  <span style={{ fontWeight: 500 }}>{formatTime(s.startTime)}</span>
                                </div>
                              ))}
                              {v.availableSlots.length > 2 && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 500, textAlign: 'center', marginTop: '4px' }}>
                                  +{v.availableSlots.length - 2} more
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Exp: <strong>{v.yearsOfExperience} yrs</strong></span>
                          <button className="btn-primary" style={{ padding: '0.35rem 0.9rem', fontSize: '0.78rem' }}>View Profile</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--card-bg)', borderRadius: 'var(--border-radius-lg)', color: 'var(--text-secondary)' }}>
                    No validators found for this domain yet.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
