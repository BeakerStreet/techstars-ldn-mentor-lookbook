
import { Link } from 'react-router-dom';
import { Mentor } from '../types/mentor';
import { Linkedin } from 'lucide-react';

interface MentorCardProps {
  mentor: Mentor;
  index: number;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor, index }) => {
  // Staggered animation delay based on index
  const animationDelay = `${index * 0.05}s`;

  return (
    <div 
      className="glass card-hover overflow-hidden relative rounded-xl border border-gray-100 shadow-sm"
      style={{ 
        animationDelay, 
        animation: 'scale-in 0.5s ease-out forwards',
        opacity: 0,
        transform: 'scale(0.95)' 
      }}
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img 
          src={mentor.headshot} 
          alt={mentor.name} 
          className="mentor-image w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      <div className="p-4 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-lg font-medium mb-1">{mentor.name}</h3>
            {mentor.role && mentor.company && (
              <p className="text-xs text-white/80">{mentor.role} at {mentor.company}</p>
            )}
          </div>
          
          <div className="flex gap-2">
            <a 
              href={mentor.linkedinUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-white/20 hover:bg-techstars-phosphor hover:text-white rounded-full transition-colors duration-300"
              aria-label={`View ${mentor.name}'s LinkedIn profile`}
            >
              <Linkedin size={16} />
            </a>
            
            <Link
              to={`/mentor/${mentor.slug}`}
              className="p-2 bg-white/20 hover:bg-white hover:text-black rounded-full transition-colors duration-300"
              aria-label={`View ${mentor.name}'s profile`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="lucide lucide-arrow-right"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
