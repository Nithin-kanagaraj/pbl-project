import React, { useState, useEffect, useContext } from 'react';
import { createSlot, updateSlot, deleteSlot, getSlots, getMySessions, submitEvaluation, startEvaluation } from '../services/api';
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
  if (!time) return '—';
  if (Array.isArray(time)) {
    return `${String(time[0]).padStart(2, '0')}:${String(time[1]).padStart(2, '0')}`;
  } else if (typeof time === 'object') {
    return `${String(time.hour || 0).padStart(2, '0')}:${String(time.minute || 0).padStart(2, '0')}`;
  }
  return String(time).slice(0, 5);
};

const StatusBadge = ({ status }) => {
  const map = {
    SCHEDULED: { cls: 'badge-warning', label: 'Scheduled' },
    COMPLETED:  { cls: 'badge-success', label: 'Completed' },
    AVAILABLE:  { cls: 'badge-blue',    label: 'Available' },
    BOOKED:     { cls: 'badge-warning', label: 'Booked' },
  };
  const { cls, label } = map[status] || { cls: 'badge-blue', label: status };
  return <span className={`badge ${cls}`}>{label}</span>;
};

const ValidatorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [slotData, setSlotData] = useState({ date: '', startTime: '', endTime: '' });
  const [evalData, setEvalData] = useState({ sessionId: '', technicalScore: '', communicationScore: '', problemSolvingScore: '', feedbackText: '' });
  const [slots, setSlots] = useState([]);
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const [meetLinks, setMeetLinks] = useState({}); // sessionId -> link

  useEffect(() => {
    if (user && user.id) {
      fetchSessions();
      fetchSlots();
    }
  }, [user]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: 'success' }), 4000);
  };

  const fetchSessions = async () => {
    try {
      const res = await getMySessions();
      setSessions(res.data);
      // Pre-populate existing meeting links
      const links = {};
      res.data.forEach(s => { if (s.meetingLink) links[s.id] = s.meetingLink; });
      setMeetLinks(prev => ({ ...prev, ...links }));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSlots = async () => {
    try {
      const res = await getSlots(user.id, false);
      setSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOrUpdateSlot = async (e) => {
    e.preventDefault();
    try {
      if (editingSlotId) {
        await updateSlot(editingSlotId, slotData);
        showMessage('✅ Slot rescheduled successfully!');
      } else {
        await createSlot(slotData);
        showMessage('✅ Slot created successfully!');
      }
      setSlotData({ date: '', startTime: '', endTime: '' });
      setEditingSlotId(null);
      fetchSlots();
    } catch (err) {
      showMessage(`❌ Failed to ${editingSlotId ? 'update' : 'create'} slot.`, 'danger');
    }
  };

  const handleDeleteSlot = async (slotId, isBooked) => {
    const msg = isBooked
      ? 'This slot is BOOKED by a candidate. Are you sure you want to cancel and delete it?'
      : 'Are you sure you want to delete this slot?';
    if (!window.confirm(msg)) return;
    try {
      await deleteSlot(slotId);
      showMessage('✅ Slot deleted.');
      fetchSlots();
      fetchSessions();
    } catch (err) {
      showMessage('❌ Failed to delete slot.', 'danger');
    }
  };

  const startEdit = (slot) => {
    setSlotData({ date: slot.date, startTime: slot.startTime, endTime: slot.endTime });
    setEditingSlotId(slot.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartEvaluation = async (session) => {
    try {
      const res = await startEvaluation(session.id);
      const link = res.data.meetingLink;
      setMeetLinks(prev => ({ ...prev, [session.id]: link }));
      setEvalData(prev => ({ ...prev, sessionId: session.id }));
      showMessage('🎥 Meeting link generated! Share it with the candidate.');
    } catch (err) {
      showMessage('❌ Failed to start evaluation.', 'danger');
    }
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    try {
      await submitEvaluation({
        ...evalData,
        technicalScore: parseInt(evalData.technicalScore),
        communicationScore: parseInt(evalData.communicationScore),
        problemSolvingScore: parseInt(evalData.problemSolvingScore),
      });
      showMessage('✅ Evaluation submitted successfully!');
      fetchSessions();
      setEvalData({ sessionId: '', technicalScore: '', communicationScore: '', problemSolvingScore: '', feedbackText: '' });
    } catch (err) {
      showMessage('❌ Failed to submit evaluation.', 'danger');
    }
  };

  const scheduledSessions = sessions.filter(s => s.status === 'SCHEDULED');
  const completedSessions = sessions.filter(s => s.status === 'COMPLETED');

  return (
    <div>
      <div className="container">

        {/* Profile Header */}
        <div className="card" style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #eff6ff 0%, #e8effe 100%)', border: '1px solid #c7d2fe' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.15rem' }}>{user?.email} · {user?.designation} @ {user?.currentCompany}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
              {user?.domains?.map(d => (
                <span key={d.id} style={{ fontSize: '0.78rem', padding: '2px 10px', backgroundColor: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '12px', fontWeight: 500 }}>{d.name}</span>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center', paddingLeft: '1.5rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>{user?.yearsOfExperience}+</span>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Years Exp.</p>
          </div>
        </div>

        {/* Alert Message */}
        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        {/* Slot Management */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 400px) 1fr', gap: '1.75rem', marginBottom: '1.75rem' }}>

          {/* Create / Edit Slot Form */}
          <div className="card">
            <p className="section-title">
              {editingSlotId ? '📝 Reschedule Slot' : '➕ Create Availability Slot'}
            </p>
            <form onSubmit={handleCreateOrUpdateSlot}>
              <label>Date</label>
              <input
                type="date"
                className="input-field"
                value={slotData.date}
                onChange={e => setSlotData({ ...slotData, date: e.target.value })}
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>Start Time</label>
                  <input type="time" className="input-field" value={slotData.startTime} step="1" onChange={e => setSlotData({ ...slotData, startTime: e.target.value })} required />
                </div>
                <div>
                  <label>End Time</label>
                  <input type="time" className="input-field" value={slotData.endTime} step="1" onChange={e => setSlotData({ ...slotData, endTime: e.target.value })} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                  {editingSlotId ? 'Update Slot' : 'Create Slot'}
                </button>
                {editingSlotId && (
                  <button
                    type="button"
                    style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-secondary)', fontWeight: 500 }}
                    onClick={() => { setEditingSlotId(null); setSlotData({ date: '', startTime: '', endTime: '' }); }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* My Slots Table */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <p className="section-title" style={{ margin: 0 }}>🗓️ My Availability Slots</p>
              <button onClick={fetchSlots} style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                🔄 Refresh
              </button>
            </div>

            {slots.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time Range</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map(slot => (
                      <tr key={slot.id}>
                        <td>{formatDate(slot.date)}</td>
                        <td style={{ fontVariantNumeric: 'tabular-nums' }}>{formatTime(slot.startTime)} – {formatTime(slot.endTime)}</td>
                        <td><StatusBadge status={slot.status} /></td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: '6px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', cursor: 'pointer', fontWeight: 500 }}
                              onClick={() => startEdit(slot)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', cursor: 'pointer', fontWeight: 500 }}
                              onClick={() => handleDeleteSlot(slot.id, slot.status === 'BOOKED')}
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No slots created yet. Use the form to add your availability.
              </div>
            )}
          </div>
        </div>

        {/* Scheduled Sessions */}
        <div className="card" style={{ marginBottom: '1.75rem' }}>
          <p className="section-title">📅 Upcoming Scheduled Sessions ({scheduledSessions.length})</p>
          {scheduledSessions.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {scheduledSessions.map(session => (
                <div key={session.id} style={{ border: '1.5px solid var(--border-color)', borderRadius: '10px', padding: '1.1rem', background: 'var(--surface)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem' }}>{session.candidate?.name}</strong>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{session.domain?.name}</p>
                    </div>
                    <StatusBadge status={session.status} />
                  </div>
                  {session.slot && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 500, marginBottom: '0.6rem' }}>
                      🗓 {formatDate(session.slot.date)} · {formatTime(session.slot.startTime)} – {formatTime(session.slot.endTime)}
                    </p>
                  )}

                  {/* Meeting link display */}
                  {meetLinks[session.id] ? (
                    <div style={{ background: '#d1fae5', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#065f46' }}>🎥 Meeting:</span>
                      <a href={meetLinks[session.id]} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: '#065f46', textDecoration: 'underline', wordBreak: 'break-all' }}>
                        {meetLinks[session.id]}
                      </a>
                    </div>
                  ) : null}

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {!meetLinks[session.id] && (
                      <button
                        className="btn-primary"
                        style={{ flex: 1, fontSize: '0.82rem', padding: '0.5rem' }}
                        onClick={() => handleStartEvaluation(session)}
                      >
                        🚀 Start Evaluation
                      </button>
                    )}
                    {meetLinks[session.id] && (
                      <button
                        className="btn-primary"
                        style={{ flex: 1, fontSize: '0.82rem', padding: '0.5rem' }}
                        onClick={() => setEvalData(prev => ({ ...prev, sessionId: session.id }))}
                      >
                        📝 Submit Evaluation
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>No upcoming sessions.</p>
          )}
        </div>

        {/* Completed Sessions */}
        {completedSessions.length > 0 && (
          <div className="card" style={{ marginBottom: '1.75rem' }}>
            <p className="section-title">✅ Completed Sessions ({completedSessions.length})</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {completedSessions.map(session => (
                <div key={session.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.9rem', background: 'var(--surface)' }}>
                  <strong style={{ fontSize: '0.9rem' }}>{session.candidate?.name}</strong>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{session.domain?.name}</p>
                  {session.slot && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                      🗓 {formatDate(session.slot.date)} · {formatTime(session.slot.startTime)} – {formatTime(session.slot.endTime)}
                    </p>
                  )}
                  <div style={{ marginTop: '0.5rem' }}><StatusBadge status={session.status} /></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evaluation Form */}
        {evalData.sessionId && (
          <div className="card" style={{ marginBottom: '1.75rem', border: '2px solid var(--primary)', borderRadius: '12px' }}>
            <p className="section-title">📊 Submit Evaluation — Session #{evalData.sessionId}</p>
            <form onSubmit={handleEvaluate}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                {[
                  { key: 'technicalScore', label: '💻 Technical (0–10)' },
                  { key: 'communicationScore', label: '🗣 Communication (0–10)' },
                  { key: 'problemSolvingScore', label: '🧩 Problem Solving (0–10)' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label>{label}</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      className="input-field"
                      value={evalData[key]}
                      onChange={e => setEvalData({ ...evalData, [key]: e.target.value })}
                      required
                    />
                  </div>
                ))}
              </div>
              <label>Feedback for Candidate</label>
              <textarea
                className="input-field"
                rows="4"
                placeholder="Provide detailed, constructive feedback…"
                value={evalData.feedbackText}
                onChange={e => setEvalData({ ...evalData, feedbackText: e.target.value })}
                required
                style={{ resize: 'vertical' }}
              />
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-primary">Submit Evaluation</button>
                <button
                  type="button"
                  style={{ padding: '0.65rem 1.2rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500 }}
                  onClick={() => setEvalData({ sessionId: '', technicalScore: '', communicationScore: '', problemSolvingScore: '', feedbackText: '' })}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default ValidatorDashboard;
