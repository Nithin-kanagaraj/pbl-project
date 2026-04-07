import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Users, Award } from 'lucide-react';

const LandingPage = () => {
  return (
    <div>
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary)' }}>
          Industry Readiness Live Validation Platform
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
          Connect with industry experts, validate your technical skills in live sessions, and rank among top talents to get noticed by leading recruiters.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '5rem' }}>
          <Link to="/register" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>Get Started</Link>
          <Link to="/login" className="btn-accent" style={{ fontSize: '1.1rem', padding: '1rem 2rem', backgroundColor: '#e2e8f0', color: 'var(--primary)' }}>Log In</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Users size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h3>Mock Interviews</h3>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Book live validation sessions with industry experts to test your knowledge.</p>
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <CheckCircle size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
            <h3>Expert Feedback</h3>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Receive detailed scores and actionable feedback on your technical abilities.</p>
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Award size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h3>Get Ranked</h3>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Climb the leaderboard in your domain to catch the eye of top recruiters.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
