import { Card, CardContent } from '@/components/ui/card';
import AnonymizedReactions from './AnonymizedReactions';

const StoryWithReactions = () => {
  return (
    <Card className="shadow-soft rounded-3xl mb-6">
      <CardContent className="p-6 space-y-4">
        {/* Story Content */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">A</span>
            </div>
            <div>
              <p className="text-sm font-medium">Anonymous Soul</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          
          <div className="pl-13">
            <p className="text-sm text-foreground leading-relaxed">
              "Had a really tough day with anxiety today. Felt like I was drowning in my own thoughts. 
              But I remembered what someone here said about breathing through it... took 5 minutes to just breathe. 
              It didn't fix everything, but it reminded me I'm not alone in this. 💙"
            </p>
          </div>
        </div>

        {/* Anonymized Reactions */}
        <div className="border-t pt-4">
          <AnonymizedReactions 
            postId="story-1" 
            initialReactions={{ relate: 12, support: 8, felt: 5 }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StoryWithReactions;