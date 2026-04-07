import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getValidatorProfile, getSlots, bookSession } from '../services/api';
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

const ValidatorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const profileRes = await getValidatorProfile(id);
      setProfile(profileRes.data);
      
      const slotsRes = await getSlots(id, true);
      setSlots(slotsRes.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (slotId) => {
    if (user.role !== 'CANDIDATE') {
      alert('Only candidates can book sessions.');
      return;
    }
    setBookingLoading(true);
    try {
      // Find domain from profile (using first domain for now, ideally candidate selects domain in step 1)
      const domainId = profile.domains[0]?.id; 
      await bookSession({ slotId, domainId });
      setMessage('Session booked successfully!');
      fetchData(); // Refresh slots
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>Loading Expert Profile...</div>;

  return (
    <div>
      <div className="container" style={{ paddingTop: '2rem' }}>
        {message && <div style={{ padding: '1rem', backgroundColor: message.includes('failed') ? '#fee2e2' : '#e2f0e2', borderRadius: '4px', marginBottom: '1rem' }}>{message}</div>}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
          {/* Left Column: Summary */}
          <div className="card" style={{ height: 'fit-content' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>
                {profile.name.charAt(0)}
              </div>
              <h2>{profile.name}</h2>
              <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{profile.designation}</p>
              <p style={{ color: '#666' }}>{profile.currentCompany}</p>
            </div>
            
            <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Expertise:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {profile.domains.map(d => (
                    <span key={d.id} style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', backgroundColor: '#e2e8f0', borderRadius: '12px' }}>{d.name}</span>
                  ))}
                </div>
              </div>
              <p><strong>Experience:</strong> {profile.yearsOfExperience} Years</p>
            </div>
          </div>

          {/* Right Column: Bio + Stats + Booking */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card">
              <h3>About</h3>
              <p style={{ marginTop: '1rem', lineHeight: '1.6', color: '#444' }}>{profile.bio || 'No bio provided.'}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{profile.averageRating.toFixed(1)} / 10</span>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>Avg Rating</p>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{profile.totalValidationsCompleted}</span>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>Validations</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Available Slots</h3>
              <div style={{ marginTop: '1rem' }}>
                {slots.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    {slots.map(slot => (
                      <div key={slot.id} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '0.2rem' }}>{formatDate(slot.date)}</p>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</p>
                        <button 
                          className="btn-primary" 
                          style={{ width: '100%', fontSize: '0.9rem' }} 
                          disabled={bookingLoading || user.role !== 'CANDIDATE'}
                          onClick={() => handleBook(slot.id)}
                        >
                          Book Now
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#666' }}>No slots available at the moment.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorProfile;
