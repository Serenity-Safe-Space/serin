import { Heart, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface AnonymizedReactionsProps {
  postId: string;
  initialReactions?: {
    relate: number;
    support: number;
    felt: number;
  };
}

const AnonymizedReactions = ({ postId, initialReactions = { relate: 0, support: 0, felt: 0 } }: AnonymizedReactionsProps) => {
  const [reactions, setReactions] = useState(initialReactions);
  const [userReactions, setUserReactions] = useState<string[]>([]);

  const reactionTypes = [
    {
      id: 'relate',
      emoji: '🤝',
      label: 'I relate',
      count: reactions.relate,
      phrases: [
        'Others felt this too 💛',
        'people said "I relate"',
        'souls connected with this'
      ]
    },
    {
      id: 'support',
      emoji: '💜',
      label: 'Sending support',
      count: reactions.support,
      phrases: [
        'Hearts reached out 💜',
        'people sent gentle support',
        'caring souls responded'
      ]
    },
    {
      id: 'felt',
      emoji: '✨',
      label: 'Felt this deeply',
      count: reactions.felt,
      phrases: [
        'This touched hearts ✨',
        'people felt this deeply',
        'souls resonated with this'
      ]
    }
  ];

  const handleReaction = (reactionId: string) => {
    const isAlreadyReacted = userReactions.includes(reactionId);
    
    if (isAlreadyReacted) {
      setUserReactions(prev => prev.filter(id => id !== reactionId));
      setReactions(prev => ({
        ...prev,
        [reactionId]: Math.max(0, prev[reactionId as keyof typeof prev] - 1)
      }));
    } else {
      setUserReactions(prev => [...prev, reactionId]);
      setReactions(prev => ({
        ...prev,
        [reactionId]: prev[reactionId as keyof typeof prev] + 1
      }));
    }
  };

  const getReactionDisplay = (reaction: typeof reactionTypes[0]) => {
    if (reaction.count === 0) return null;
    
    const phrase = reaction.phrases[Math.min(Math.floor(reaction.count / 3), reaction.phrases.length - 1)];
    
    if (reaction.count === 1) {
      return `Someone ${phrase.toLowerCase()}`;
    } else if (reaction.count < 5) {
      return `${reaction.count} ${phrase}`;
    } else {
      return `${reaction.count} ${phrase}`;
    }
  };

  return (
    <div className="space-y-3">
      {/* Reaction Buttons */}
      <div className="flex items-center justify-center space-x-2">
        {reactionTypes.map((reaction) => (
          <Button
            key={reaction.id}
            variant="ghost"
            size="sm"
            onClick={() => handleReaction(reaction.id)}
            className={`flex items-center space-x-1 rounded-full px-3 py-1 transition-all ${
              userReactions.includes(reaction.id)
                ? 'bg-cozy-primary/20 text-cozy-primary border border-cozy-primary/30'
                : 'hover:bg-muted/50'
            }`}
          >
            <span className="text-sm">{reaction.emoji}</span>
            <span className="text-xs font-medium">{reaction.label}</span>
          </Button>
        ))}
      </div>

      {/* Anonymized Reaction Display */}
      <div className="space-y-1">
        {reactionTypes.map((reaction) => {
          const display = getReactionDisplay(reaction);
          if (!display) return null;
          
          return (
            <div key={reaction.id} className="text-center">
              <Badge 
                variant="secondary" 
                className="bg-muted/30 text-muted-foreground border-none text-xs font-normal px-3 py-1"
              >
                {display}
              </Badge>
            </div>
          );
        })}
      </div>

      {/* Gentle Community Message */}
      {(reactions.relate + reactions.support + reactions.felt) > 0 && (
        <div className="text-center">
          <p className="text-xs text-cozy-primary italic">
            Your story creates ripples of connection 🌊
          </p>
        </div>
      )}
    </div>
  );
};

export default AnonymizedReactions;