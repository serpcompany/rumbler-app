import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Camera, ChevronRight } from 'lucide-react';

const DISCIPLINES = ['Boxing', 'MMA', 'BJJ', 'Muay Thai', 'Wrestling', 'Judo', 'Kickboxing'];
const WEIGHT_CLASSES = ['Flyweight', 'Bantamweight', 'Featherweight', 'Lightweight', 'Welterweight', 'Middleweight', 'Light Heavyweight', 'Heavyweight'];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<'amateur' | 'pro'>('amateur');

  const toggleDiscipline = (discipline: string) => {
    if (selectedDisciplines.includes(discipline)) {
      setSelectedDisciplines(selectedDisciplines.filter(d => d !== discipline));
    } else {
      setSelectedDisciplines([...selectedDisciplines, discipline]);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col items-center justify-center h-full px-8 text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <div className="flex gap-1">
                  <div className="w-3 h-8 bg-white rounded-sm" />
                  <div className="w-3 h-8 bg-white rounded-sm mt-2" />
                </div>
              </div>
              <h1 className="text-4xl mb-4 text-white tracking-tight">RUMBLER</h1>
              <p className="text-zinc-400 text-lg">Find Your Next Sparring Partner</p>
            </div>
            <p className="text-zinc-500 mb-8">
              Connect with verified fighters in your area. Train safe, train smart.
            </p>
            <Button 
              onClick={() => setStep(1)} 
              className="w-full bg-red-600 hover:bg-red-700 text-white py-6"
            >
              Get Started <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-zinc-600 text-sm mt-6">
              By continuing, you agree to our Terms & Safety Guidelines
            </p>
          </div>
        );

      case 1:
        return (
          <div className="px-6 py-8">
            <h2 className="text-2xl mb-2 text-white">Age Verification</h2>
            <p className="text-zinc-400 mb-6">You must be 18+ to use Rumbler</p>
            
            <div className="space-y-4">
              <div>
                <Label className="text-zinc-300">Date of Birth</Label>
                <Input type="date" className="bg-zinc-900 border-zinc-800 text-white mt-2" />
              </div>
              
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mt-6">
                <p className="text-zinc-400 text-sm">
                  📋 ID verification required for all fighters. Upload in next step.
                </p>
              </div>

              <Button 
                onClick={() => setStep(2)} 
                className="w-full bg-red-600 hover:bg-red-700 text-white py-6 mt-4"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="px-6 py-8">
            <h2 className="text-2xl mb-2 text-white">Create Your Profile</h2>
            <p className="text-zinc-400 mb-6">Show fighters who you are</p>
            
            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-full flex items-center justify-center cursor-pointer hover:border-red-600 transition-colors">
                  <Camera className="h-8 w-8 text-zinc-600" />
                </div>
              </div>

              <div>
                <Label className="text-zinc-300">Full Name</Label>
                <Input placeholder="Enter your name" className="bg-zinc-900 border-zinc-800 text-white mt-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-zinc-300">Gender</Label>
                  <select className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-md px-3 py-2 mt-2">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <Label className="text-zinc-300">Height</Label>
                  <Input placeholder={"5'10\""} className="bg-zinc-900 border-zinc-800 text-white mt-2" />
                </div>
              </div>

              <Button 
                onClick={() => setStep(3)} 
                className="w-full bg-red-600 hover:bg-red-700 text-white py-6 mt-4"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="px-6 py-8">
            <h2 className="text-2xl mb-2 text-white">Fighting Background</h2>
            <p className="text-zinc-400 mb-6">Tell us about your experience</p>
            
            <div className="space-y-6">
              <div>
                <Label className="text-zinc-300 mb-3 block">Disciplines</Label>
                <div className="flex flex-wrap gap-2">
                  {DISCIPLINES.map(discipline => (
                    <Badge
                      key={discipline}
                      onClick={() => toggleDiscipline(discipline)}
                      className={`cursor-pointer px-4 py-2 ${
                        selectedDisciplines.includes(discipline)
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {discipline}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-zinc-300 mb-3 block">Experience Level</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setExperienceLevel('amateur')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      experienceLevel === 'amateur'
                        ? 'border-red-600 bg-red-600/10'
                        : 'border-zinc-800 bg-zinc-900'
                    }`}
                  >
                    <p className="text-white">Amateur</p>
                    <p className="text-zinc-500 text-sm">Training & sparring</p>
                  </div>
                  <div
                    onClick={() => setExperienceLevel('pro')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      experienceLevel === 'pro'
                        ? 'border-red-600 bg-red-600/10'
                        : 'border-zinc-800 bg-zinc-900'
                    }`}
                  >
                    <p className="text-white">Professional</p>
                    <p className="text-zinc-500 text-sm">Sanctioned fights</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setStep(4)} 
                className="w-full bg-red-600 hover:bg-red-700 text-white py-6"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="px-6 py-8">
            <h2 className="text-2xl mb-2 text-white">Fight Record</h2>
            <p className="text-zinc-400 mb-6">Add your competitive stats</p>
            
            <div className="space-y-4">
              <div>
                <Label className="text-zinc-300">Weight Class</Label>
                <select className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-md px-3 py-2 mt-2">
                  {WEIGHT_CLASSES.map(wc => (
                    <option key={wc}>{wc}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-zinc-300">Reach</Label>
                <Input placeholder={'72"'} className="bg-zinc-900 border-zinc-800 text-white mt-2" />
              </div>

              <div>
                <Label className="text-zinc-300 mb-2 block">Amateur Record (W-L-D)</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Input placeholder="Wins" className="bg-zinc-900 border-zinc-800 text-white" />
                  <Input placeholder="Losses" className="bg-zinc-900 border-zinc-800 text-white" />
                  <Input placeholder="Draws" className="bg-zinc-900 border-zinc-800 text-white" />
                </div>
              </div>

              <div>
                <Label className="text-zinc-300 mb-2 block">Pro Record (W-L-D)</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Input placeholder="Wins" className="bg-zinc-900 border-zinc-800 text-white" />
                  <Input placeholder="Losses" className="bg-zinc-900 border-zinc-800 text-white" />
                  <Input placeholder="Draws" className="bg-zinc-900 border-zinc-800 text-white" />
                </div>
              </div>

              <div>
                <Label className="text-zinc-300">Gym Affiliation</Label>
                <Input placeholder="Your gym name" className="bg-zinc-900 border-zinc-800 text-white mt-2" />
              </div>

              <div>
                <Label className="text-zinc-300">Bio</Label>
                <Textarea 
                  placeholder="Tell fighters about yourself..." 
                  className="bg-zinc-900 border-zinc-800 text-white mt-2 min-h-24"
                />
              </div>

              <Button 
                onClick={onComplete} 
                className="w-full bg-red-600 hover:bg-red-700 text-white py-6 mt-4"
              >
                Start Finding Fighters
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-[375px] h-[812px] bg-zinc-950 overflow-y-auto">
      {step > 0 && (
        <div className="sticky top-0 bg-zinc-950 border-b border-zinc-900 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setStep(Math.max(0, step - 1))}
              className="text-red-600"
            >
              Back
            </button>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className={`w-12 h-1 rounded ${
                    i <= step ? 'bg-red-600' : 'bg-zinc-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {renderStep()}
    </div>
  );
}