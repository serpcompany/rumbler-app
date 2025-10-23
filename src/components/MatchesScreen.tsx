import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { matches } from './mock-data';

export function MatchesScreen() {
  return (
    <div className="h-full bg-zinc-950 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-950 border-b border-zinc-900 px-6 py-4">
        <h1 className="text-2xl text-white">Matches</h1>
        <p className="text-zinc-500 text-sm">{matches.length} fighters ready to train</p>
      </div>

      {/* Matches Grid */}
      <div className="p-4 grid grid-cols-3 gap-3">
        {matches.map(match => (
          <div
            key={match.id}
            className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-red-600 transition-colors cursor-pointer"
          >
            <ImageWithFallback
              src={match.fighter.photo}
              alt={match.fighter.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-white text-sm truncate">
                {match.fighter.name.split('"')[0]}
              </p>
            </div>
            {match.unread > 0 && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">{match.unread}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Matches Section */}
      <div className="px-6 pb-6">
        <h2 className="text-white mb-4">Recent Matches</h2>
        <div className="space-y-3">
          {matches.map(match => (
            <div
              key={match.id}
              className="flex items-center gap-4 bg-zinc-900 rounded-lg p-4 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <ImageWithFallback
                    src={match.fighter.photo}
                    alt={match.fighter.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {match.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">{match.unread}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white truncate">
                    {match.fighter.name.split('"')[0]}
                  </h3>
                  <span className="text-zinc-500 text-sm">{match.fighter.age}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {match.fighter.disciplines.slice(0, 2).map((discipline: string) => (
                    <Badge
                      key={discipline}
                      className="bg-zinc-800 text-zinc-400 text-xs border-0"
                    >
                      {discipline}
                    </Badge>
                  ))}
                </div>
                <p className="text-zinc-500 text-sm truncate">{match.lastMessage}</p>
              </div>

              <div className="text-zinc-600 text-xs">{match.timestamp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
