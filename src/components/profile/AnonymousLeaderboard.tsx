import { ChevronRight } from 'lucide-react';

const AnonymousLeaderboard = () => {
  return (
    <div className="text-center space-y-3">
      <p className="text-lg">
        You're glowing brighter than <span className="font-bold text-cozy-primary">72%</span> of users ✨
      </p>
      
      <button className="flex items-center justify-center space-x-2 text-cozy-primary hover:text-cozy-primary/80 transition-colors mx-auto">
        <span className="text-sm font-medium">See others like you</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AnonymousLeaderboard;