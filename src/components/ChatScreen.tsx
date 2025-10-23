import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ArrowLeft, Send, Calendar } from 'lucide-react';
import { matches, chatMessages } from './mock-data';
import { BookingFlow } from './BookingFlow';

export function ChatScreen() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [showBooking, setShowBooking] = useState(false);

  if (selectedChat !== null) {
    const match = matches.find(m => m.id === selectedChat);
    if (!match) return null;

    const messages = chatMessages[selectedChat as keyof typeof chatMessages] || [];

    return (
      <div className="h-full bg-zinc-950 flex flex-col">
        {/* Chat Header */}
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSelectedChat(null)}
            className="w-8 h-8 flex items-center justify-center hover:bg-zinc-800 rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          <div className="w-12 h-12 rounded-full overflow-hidden">
            <ImageWithFallback
              src={match.fighter.photo}
              alt={match.fighter.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-white">{match.fighter.name.split('"')[0]}</h3>
            <div className="flex items-center gap-2">
              <Badge className="bg-zinc-800 text-zinc-400 text-xs border-0">
                {match.fighter.disciplines[0]}
              </Badge>
              <span className="text-zinc-500 text-xs">
                {match.fighter.experience} • {match.fighter.distance}mi
              </span>
            </div>
          </div>

          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => setShowBooking(true)}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Book
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                  msg.senderId === 'me'
                    ? 'bg-red-600 text-white rounded-br-sm'
                    : 'bg-zinc-900 text-white rounded-bl-sm'
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-zinc-900 border-t border-zinc-800 px-4 py-3 flex items-center gap-3">
          <Input
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Send a message..."
            className="bg-zinc-800 border-0 text-white"
          />
          <Button
            size="icon"
            className="bg-red-600 hover:bg-red-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Booking Flow */}
        {showBooking && (
          <BookingFlow
            fighter={match.fighter}
            onClose={() => setShowBooking(false)}
            onComplete={() => {
              setShowBooking(false);
              setSelectedChat(null);
            }}
          />
        )}
      </div>
    );
  }

  // Chat List
  return (
    <div className="h-full bg-zinc-950 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-950 border-b border-zinc-900 px-6 py-4">
        <h1 className="text-2xl text-white">Messages</h1>
      </div>

      {/* Chat List */}
      <div className="divide-y divide-zinc-900">
        {matches.map(match => (
          <div
            key={match.id}
            onClick={() => setSelectedChat(match.id)}
            className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-900 transition-colors cursor-pointer"
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
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-white">{match.fighter.name.split('"')[0]}</h3>
                <span className="text-zinc-600 text-sm">{match.timestamp}</span>
              </div>
              <p className={`text-sm truncate ${match.unread > 0 ? 'text-white' : 'text-zinc-500'}`}>
                {match.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}