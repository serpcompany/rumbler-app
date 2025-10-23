import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';

const DISCIPLINES = ['Boxing', 'MMA', 'BJJ', 'Muay Thai', 'Wrestling', 'Judo', 'Kickboxing'];
const WEIGHT_CLASSES = ['Flyweight', 'Bantamweight', 'Featherweight', 'Lightweight', 'Welterweight', 'Middleweight', 'Light Heavyweight', 'Heavyweight'];

interface FilterModalProps {
  onClose: () => void;
}

export function FilterModal({ onClose }: FilterModalProps) {
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>(['Boxing', 'MMA']);
  const [distance, setDistance] = useState([25]);
  const [experienceLevel, setExperienceLevel] = useState<string[]>(['Amateur', 'Pro']);

  const toggleDiscipline = (discipline: string) => {
    if (selectedDisciplines.includes(discipline)) {
      setSelectedDisciplines(selectedDisciplines.filter(d => d !== discipline));
    } else {
      setSelectedDisciplines([...selectedDisciplines, discipline]);
    }
  };

  return (
    <div className="absolute inset-0 bg-zinc-950 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-950 border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl text-white">Filters</h2>
        <button
          onClick={onClose}
          className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-zinc-800"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Distance */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white">Maximum Distance</h3>
            <span className="text-red-600">{distance[0]} miles</span>
          </div>
          <Slider
            value={distance}
            onValueChange={setDistance}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        {/* Disciplines */}
        <div>
          <h3 className="text-white mb-4">Disciplines</h3>
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

        {/* Experience Level */}
        <div>
          <h3 className="text-white mb-4">Experience Level</h3>
          <div className="flex gap-3">
            {['Amateur', 'Pro'].map(level => (
              <Badge
                key={level}
                onClick={() => {
                  if (experienceLevel.includes(level)) {
                    setExperienceLevel(experienceLevel.filter(l => l !== level));
                  } else {
                    setExperienceLevel([...experienceLevel, level]);
                  }
                }}
                className={`cursor-pointer px-6 py-3 ${
                  experienceLevel.includes(level)
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
                }`}
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>

        {/* Weight Class */}
        <div>
          <h3 className="text-white mb-4">Weight Class</h3>
          <div className="flex flex-wrap gap-2">
            {WEIGHT_CLASSES.map(weightClass => (
              <Badge
                key={weightClass}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 cursor-pointer px-3 py-2"
              >
                {weightClass}
              </Badge>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div>
          <h3 className="text-white mb-4">Gender</h3>
          <div className="flex gap-3">
            {['All', 'Male', 'Female'].map(gender => (
              <Badge
                key={gender}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 cursor-pointer px-6 py-3"
              >
                {gender}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="sticky bottom-0 bg-zinc-950 border-t border-zinc-900 px-6 py-4 space-y-3">
        <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-6">
          Apply Filters
        </Button>
        <Button
          variant="ghost"
          className="w-full text-zinc-400 hover:text-white hover:bg-zinc-900"
          onClick={onClose}
        >
          Reset All
        </Button>
      </div>
    </div>
  );
}
