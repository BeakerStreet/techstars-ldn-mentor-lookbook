
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full py-6 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-2xl font-bold tracking-tight animate-fade-in"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-techstars-black rounded-md">
            <span className="text-techstars-white">TS</span>
          </div>
          <span>Techstars London</span>
        </Link>
        
        <div className="text-sm text-techstars-slate animate-fade-in">
          <div className="px-3 py-1 rounded-full border border-techstars-slate/30">
            Mentor Lookbook
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
