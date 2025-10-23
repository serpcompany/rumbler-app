import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Settings, Edit, MapPin, Award } from 'lucide-react';

export function ProfileScreen() {
  const myProfile = {
    name: 'Alex Rivera',
    age: 27,
    gender: 'Male',
    photo: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600',
    disciplines: ['Boxing', 'MMA', 'BJJ'],
    experience: 'Amateur',
    amateurRecord: { wins: 10, losses: 3, draws: 1 },
    proRecord: { wins: 0, losses: 0, draws: 0 },
    height: '5\'11"',
    reach: '73"',
    weightClass: 'Welterweight',
    gym: 'Downtown Fight Club',
    bio: 'Passionate about combat sports. Looking for consistent training partners to improve my game. Respectful sparring only.',
  };

  return (
    <div className="h-full bg-zinc-950 overflow-y-auto pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-950 border-b border-zinc-900 px-6 py-4 flex items-center justify-between z-10">
        <h1 className="text-2xl text-white">Profile</h1>
        <button className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-zinc-800">
          <Settings className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Profile Photo */}
      <div className="relative">
        <div className="aspect-[4/5] w-full">
          <ImageWithFallback
            src={myProfile.photo}
            alt={myProfile.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950" />
        </div>

        <Button
          className="absolute bottom-4 right-4 bg-white text-zinc-950 hover:bg-zinc-200"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Info */}
      <div className="px-6 -mt-8 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-3xl text-white">{myProfile.name}</h2>
          <span className="text-zinc-400 text-2xl">{myProfile.age}</span>
        </div>

        {/* Disciplines */}
        <div className="flex flex-wrap gap-2 mb-4">
          {myProfile.disciplines.map(discipline => (
            <Badge
              key={discipline}
              className="bg-red-600 text-white border-0"
            >
              {discipline}
            </Badge>
          ))}
          <Badge className="bg-zinc-800 text-white border-0">
            {myProfile.experience}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6 bg-zinc-900 rounded-lg p-4">
          <div className="text-center">
            <p className="text-zinc-400 text-sm mb-1">Height</p>
            <p className="text-white">{myProfile.height}</p>
          </div>
          <div className="text-center">
            <p className="text-zinc-400 text-sm mb-1">Reach</p>
            <p className="text-white">{myProfile.reach}</p>
          </div>
          <div className="text-center">
            <p className="text-zinc-400 text-sm mb-1">Weight</p>
            <p className="text-white text-sm">{myProfile.weightClass}</p>
          </div>
        </div>

        {/* Records */}
        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-5 w-5 text-red-600" />
            <h3 className="text-white">Fight Record</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-400">Amateur Record</span>
              <span className="text-white">
                {myProfile.amateurRecord.wins}-{myProfile.amateurRecord.losses}-{myProfile.amateurRecord.draws}
              </span>
            </div>
            {myProfile.proRecord.wins === 0 && (
              <p className="text-zinc-500 text-sm">No professional fights yet</p>
            )}
          </div>
        </div>

        {/* Gym */}
        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-red-600" />
            <h3 className="text-white">Gym Affiliation</h3>
          </div>
          <p className="text-zinc-300">{myProfile.gym}</p>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h3 className="text-white mb-2">About Me</h3>
          <p className="text-zinc-400">{myProfile.bio}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 py-6">
            Safety & Conduct Guidelines
          </Button>
          <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 py-6">
            Manage Payment Methods
          </Button>
          <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 py-6">
            Notification Settings
          </Button>
          <Button className="w-full bg-zinc-900 text-red-500 hover:bg-zinc-800 py-6">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
