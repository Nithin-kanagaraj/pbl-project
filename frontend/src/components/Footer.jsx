import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>PBL Platform</h2>
            <p>
              The ultimate platform for industry readiness living validation. 
              Bridging the gap between talented candidates and top-tier recruiters 
              through expert-led live assessments.
            </p>
          </div>

          <div className="footer-section">
            <h4>For Candidates</h4>
            <ul className="footer-links">
              <li><Link to="/register">Join as Candidate</Link></li>
              <li><Link to="/login">Browse Validators</Link></li>
              <li><Link to="#">Skills Leaderboard</Link></li>
              <li><Link to="#">Interview Tips</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>For Organizations</h4>
            <ul className="footer-links">
              <li><Link to="/register">Register as Recruiter</Link></li>
              <li><Link to="/login">Find Top Talent</Link></li>
              <li><Link to="#">Validator Network</Link></li>
              <li><Link to="#">Enterprise Solutions</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><Link to="#">Help Center</Link></li>
              <li><Link to="#">Privacy Policy</Link></li>
              <li><Link to="#">Terms of Service</Link></li>
              <li><Link to="#">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} PBL Industry Readiness. All rights reserved.</p>
          
          <div className="footer-social">
            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
            <a href="#" aria-label="GitHub"><Github size={20} /></a>
            <a href="#" aria-label="Email"><Mail size={20} /></a>
          </div>

          <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Made with <Heart size={14} color="var(--danger)" fill="var(--danger)" /> for the community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
