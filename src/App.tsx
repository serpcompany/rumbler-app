import { useState } from 'react';
import { DeckScreen } from './components/DeckScreen';
import { MatchesScreen } from './components/MatchesScreen';
import { ChatScreen } from './components/ChatScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { MatchOverlay } from './components/MatchOverlay';
import { BottomNav } from './components/BottomNav';
import { OnboardingFlow } from './components/OnboardingFlow';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'deck' | 'matches' | 'chat' | 'profile'>('onboarding');
  const [showMatchOverlay, setShowMatchOverlay] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<any>(null);

  const handleMatch = (fighter: any) => {
    setCurrentMatch(fighter);
    setShowMatchOverlay(true);
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen('deck');
  };

  if (currentScreen === 'onboarding') {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="relative w-full h-screen bg-zinc-950 flex items-center justify-center overflow-hidden dark">
      {/* Mobile App Container - iPhone 13 dimensions */}
      <div className="relative w-[375px] h-[812px] bg-zinc-950 overflow-hidden flex flex-col shadow-2xl">
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {currentScreen === 'deck' && <DeckScreen onMatch={handleMatch} />}
          {currentScreen === 'matches' && <MatchesScreen />}
          {currentScreen === 'chat' && <ChatScreen />}
          {currentScreen === 'profile' && <ProfileScreen />}
        </div>

        {/* Bottom Navigation */}
        <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />

        {/* Match Overlay */}
        {showMatchOverlay && currentMatch && (
          <MatchOverlay
            fighter={currentMatch}
            onClose={() => setShowMatchOverlay(false)}
            onMessage={() => {
              setShowMatchOverlay(false);
              setCurrentScreen('chat');
            }}
          />
        )}
      </div>
    </div>
  );
}