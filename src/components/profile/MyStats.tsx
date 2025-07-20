const MyStats = () => {
  const stats = [
    { emoji: '🔥', value: 6, label: 'Glow Streak', color: 'text-orange-500' },
    { emoji: '💜', value: 4, label: 'Growth Rings', color: 'text-purple-500' },
    { emoji: '✨', value: 23, label: 'Check-ins', color: 'text-yellow-500' }
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <button
          key={index}
          className="bg-card/60 backdrop-blur-sm border rounded-3xl p-4 text-center hover:bg-card/80 transition-all duration-200 hover:scale-105"
        >
          <div className="text-2xl mb-2">{stat.emoji}</div>
          <div className="font-bold text-lg text-foreground">{stat.value}</div>
          <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
        </button>
      ))}
    </div>
  );
};

export default MyStats;