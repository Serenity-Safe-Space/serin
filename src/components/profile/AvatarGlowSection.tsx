const AvatarGlowSection = () => {
  return (
    <div className="text-center space-y-6">
      {/* Avatar with speech bubble */}
      <div className="relative inline-block">
        {/* Speech bubble */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2 text-white">
            <span className="text-lg">✨</span>
            <span className="font-medium">You're glowing today.</span>
          </div>
          {/* Arrow pointing down */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-purple-500"></div>
        </div>

        {/* Avatar Circle */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-300 to-purple-500 flex items-center justify-center shadow-xl">
          {/* Meditation character */}
          <div className="text-4xl">🧘‍♀️</div>
        </div>
      </div>

      {/* Week's vibe */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">
          This week's vibe: Glowed Up <span className="text-lg">💅</span>
        </h2>
        <p className="text-muted-foreground">
          Emotional growth <span className="font-semibold">38%</span>
        </p>
      </div>
    </div>
  );
};

export default AvatarGlowSection;