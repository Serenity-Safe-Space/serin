import { Card, CardContent } from '@/components/ui/card';

const WeeklyLeaderboard = () => {
  const topUsers = [
    { rank: 17, name: 'Serin', avatar: '🤖', isBot: true },
    { rank: 19, name: 'You', avatar: '👩‍🦰', isCurrentUser: true },
    { rank: null, name: 'Lily', avatar: '🧘‍♀️', isMeditating: true }
  ];

  const leaderboardUsers = [
    { rank: 17, name: 'Serin', avatar: '🤖', score: 83 },
    { rank: 18, name: 'Amelia', avatar: '👩‍🦰', score: 74 },
    { rank: 19, name: 'Lily', avatar: '🧘‍♀️', score: 69 },
    { rank: 20, name: 'Ethan', avatar: '👨‍🦱', score: 64 },
    { rank: 21, name: 'Jack', avatar: '👨‍🦲', score: 59 }
  ];

  return (
    <Card className="rounded-3xl bg-card/80 backdrop-blur-sm border-0 shadow-soft">
      <CardContent className="p-6 space-y-6">
        {/* Top Section with Avatars */}
        <div className="text-center space-y-6">
          {/* Speech bubble */}
          <div className="relative inline-block">
            <div className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl px-4 py-3 shadow-lg">
              <div className="flex items-center gap-2 text-white">
                <span className="text-lg">⭐</span>
                <span className="font-medium">You're on the right path!</span>
              </div>
            </div>
          </div>

          {/* Avatar Row */}
          <div className="flex justify-center items-end gap-4">
            {topUsers.map((user, index) => (
              <div key={index} className="text-center">
                {/* Avatar */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2 ${
                  user.isCurrentUser 
                    ? 'bg-gradient-to-br from-purple-300 to-purple-500' 
                    : 'bg-gradient-to-br from-yellow-300 to-yellow-500'
                }`}>
                  {user.avatar}
                </div>
                {/* Rank number */}
                {user.rank && (
                  <div className="text-2xl font-bold text-purple-500">
                    {user.rank}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Achievement text */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">
              Great job! You finished
            </h2>
            <h2 className="text-xl font-bold text-purple-500">
              #19 last week.
            </h2>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {leaderboardUsers.map((user) => (
            <div key={user.rank} className="flex items-center justify-between p-3 rounded-2xl bg-background/50">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-purple-500 w-8">
                  {user.rank}
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-300 to-purple-500 flex items-center justify-center text-lg">
                  {user.avatar}
                </div>
                <span className="font-medium text-foreground">
                  {user.name}
                </span>
              </div>
              <div className="text-xl font-bold text-purple-500">
                {user.score}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyLeaderboard;