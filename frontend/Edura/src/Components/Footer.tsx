import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Github, Twitter, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-darker-bg border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="relative w-8 h-8 flex items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full border border-neon-blue"></div>
                <div className="absolute inset-1 rounded-full bg-neon-blue/20"></div>
                <BookOpen size={18} className="text-neon-blue z-10" />
              </motion.div>
              <span className="text-xl font-bold neon-text">LearnVerse</span>
            </div>
            <p className="text-white/60 text-sm">
              Revolutionizing education on the blockchain with AI-powered learning experiences.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/courses" className="text-white/60 hover:text-white transition-colors">All Courses</Link></li>
              <li><Link to="/teachers" className="text-white/60 hover:text-white transition-colors">Teachers</Link></li>
              <li><Link to="/dashboard" className="text-white/60 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/learn" className="text-white/60 hover:text-white transition-colors">How to Learn</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/docs" className="text-white/60 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="/api" className="text-white/60 hover:text-white transition-colors">API</Link></li>
              <li><Link to="/tutorials" className="text-white/60 hover:text-white transition-colors">Tutorials</Link></li>
              <li><Link to="/faq" className="text-white/60 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-white/60 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-white/60 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/privacy" className="text-white/60 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-white/60 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">© 2023 LearnVerse. All rights reserved.</p>
          <p className="text-white/60 text-sm mt-2 sm:mt-0">Powered by <span className="token-text">EDU-Chain</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
