import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, getDomains } from '../services/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CANDIDATE',
    domainIds: [],
    yearsOfExperience: '',
    currentCompany: '',
    designation: '',
    bio: ''
  });
  
  const [availableDomains, setAvailableDomains] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await getDomains();
      setAvailableDomains(response.data);
    } catch (err) {
      console.error('Failed to fetch domains', err);
      // Fallback for UI testing when backend is down
      setAvailableDomains([
        { id: 1, name: 'Full Stack Development' },
        { id: 2, name: 'Frontend Development' },
        { id: 3, name: 'Backend Development' },
        { id: 4, name: 'Java Development' },
        { id: 5, name: 'Python Development' },
        { id: 6, name: 'DevOps' },
        { id: 7, name: 'Cloud Computing' },
        { id: 8, name: 'Data Structures' },
        { id: 9, name: 'System Design' },
        { id: 10, name: 'Machine Learning' }
      ]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleDomain = (domainId) => {
    setFormData(prev => {
      const isSelected = prev.domainIds.includes(domainId);
      if (isSelected) {
        return { ...prev, domainIds: prev.domainIds.filter(id => id !== domainId) };
      } else {
        return { ...prev, domainIds: [...prev.domainIds, domainId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await register(formData);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const showDomains = formData.role === 'CANDIDATE' || formData.role === 'VALIDATOR';

  return (
    <div>
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem 0' }}>
        <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create an Account</h2>
          
          {error && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" className="input-field" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" className="input-field" value={formData.email} onChange={handleChange} required />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" className="input-field" value={formData.password} onChange={handleChange} required />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="role">Role</label>
              <select id="role" name="role" className="input-field" value={formData.role} onChange={handleChange}>
                <option value="CANDIDATE">Candidate</option>
                <option value="VALIDATOR">Validator</option>
                <option value="RECRUITER">Recruiter</option>
              </select>
            </div>

            {formData.role === 'VALIDATOR' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label htmlFor="yearsOfExperience">Years of Experience</label>
                    <input type="number" id="yearsOfExperience" name="yearsOfExperience" className="input-field" value={formData.yearsOfExperience} onChange={handleChange} required />
                  </div>
                  <div>
                    <label htmlFor="designation">Designation</label>
                    <input type="text" id="designation" name="designation" className="input-field" value={formData.designation} onChange={handleChange} required />
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="currentCompany">Current Company</label>
                  <input type="text" id="currentCompany" name="currentCompany" className="input-field" value={formData.currentCompany} onChange={handleChange} required />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="bio">Professional Bio</label>
                  <textarea id="bio" name="bio" className="input-field" rows="3" value={formData.bio} onChange={handleChange} required></textarea>
                </div>
              </>
            )}

            {showDomains && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label>Select Domains</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {availableDomains.map(domain => {
                    const isSelected = formData.domainIds.includes(domain.id);
                    return (
                      <button
                        key={domain.id}
                        type="button"
                        onClick={() => toggleDomain(domain.id)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '20px',
                          border: `1px solid ${isSelected ? 'var(--primary)' : '#e2e8f0'}`,
                          backgroundColor: isSelected ? 'var(--primary)' : 'var(--card-bg)',
                          color: isSelected ? 'white' : 'var(--text-secondary)',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {domain.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
