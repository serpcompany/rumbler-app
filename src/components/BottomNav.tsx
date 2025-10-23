import { Flame, Users, MessageCircle, User } from 'lucide-react';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: 'deck' | 'matches' | 'chat' | 'profile') => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'deck', icon: Flame, label: 'Deck' },
    { id: 'matches', icon: Users, label: 'Matches' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="bg-zinc-900 border-t border-zinc-800 px-6 py-3">
      <div className="flex items-center justify-between">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as any)}
              className="flex flex-col items-center gap-1 flex-1"
            >
              <Icon
                className={`h-6 w-6 ${
                  isActive ? 'text-red-600' : 'text-zinc-500'
                }`}
              />
              <span
                className={`text-xs ${
                  isActive ? 'text-red-600' : 'text-zinc-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
