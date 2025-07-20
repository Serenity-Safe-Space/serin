import { ChevronRight } from 'lucide-react';

const AnonymousLeaderboard = () => {
  return (
    <div className="text-center space-y-3">
      <p className="text-lg">
        You're part of a community that's growing together ✨
      </p>
      <p className="text-sm text-muted-foreground">
        "Every small step counts, and you're taking yours beautifully"
      </p>
      
      <button className="flex items-center justify-center space-x-2 text-cozy-primary hover:text-cozy-primary/80 transition-colors mx-auto">
        <span className="text-sm font-medium">Connect with others on similar journeys</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AnonymousLeaderboard;