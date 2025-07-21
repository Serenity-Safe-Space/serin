import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, BookOpen, Users, User, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface RecommendationCardProps {
  recommendation: {
    id: string;
    type: 'feed' | 'communities' | 'profile' | 'content';
    title: string;
    description: string;
    timestamp: Date;
  };
  onAccept: (id: string, type: string) => void;
  onDecline: (id: string) => void;
}

const RecommendationCard = ({ recommendation, onAccept, onDecline }: RecommendationCardProps) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (recommendation.type) {
      case 'feed': return <BookOpen className="h-5 w-5" />;
      case 'communities': return <Users className="h-5 w-5" />;
      case 'profile': return <User className="h-5 w-5" />;
      default: return <Heart className="h-5 w-5" />;
    }
  };

  const getGradient = () => {
    switch (recommendation.type) {
      case 'feed': return 'bg-gradient-wellness';
      case 'communities': return 'bg-gradient-warm';
      case 'profile': return 'bg-gradient-secondary';
      default: return 'bg-gradient-primary';
    }
  };

  const handleAccept = () => {
    onAccept(recommendation.id, recommendation.type);
    if (recommendation.type === 'feed' || recommendation.type === 'communities' || recommendation.type === 'profile') {
      navigate(`/${recommendation.type}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="w-full max-w-sm mx-auto mb-6"
    >
      <Card className="bg-card/95 backdrop-blur-sm border border-primary/10 rounded-3xl shadow-soft overflow-hidden">
        <CardContent className="p-0">
          {/* Header with icon and close */}
          <div className="flex items-center justify-between p-4 pb-3">
            <div className={`p-2 rounded-xl ${getGradient()}`}>
              {getIcon()}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDecline(recommendation.id)}
              className="h-8 w-8 p-0 rounded-full hover:bg-muted/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="px-4 pb-4">
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1">Serin suggests</p>
              <h3 className="font-bold text-foreground mb-2">{recommendation.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {recommendation.description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDecline(recommendation.id)}
                className="flex-1 rounded-2xl border-muted hover:bg-muted/50"
              >
                Maybe later
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className={`flex-1 ${getGradient()} text-white hover:shadow-glow rounded-2xl flex items-center justify-center space-x-2`}
              >
                <span>Accept</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecommendationCard;