import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { ArrowLeft, MapPin, CheckCircle2, Clock, Shield } from 'lucide-react';
import { gyms } from './mock-data';

interface BookingFlowProps {
  fighter: any;
  onClose: () => void;
  onComplete: () => void;
}

export function BookingFlow({ fighter, onClose, onComplete }: BookingFlowProps) {
  const [step, setStep] = useState(1); // 1: gym, 2: date/time, 3: ruleset, 4: confirmation
  const [selectedGym, setSelectedGym] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('6:00 PM');
  const [selectedRuleset, setSelectedRuleset] = useState('Boxing');
  const [selectedGear, setSelectedGear] = useState<string[]>(['Gloves', 'Headgear']);

  const timeSlots = ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '8:00 PM'];
  const rulesets = ['Boxing', 'MMA', 'BJJ', 'Muay Thai', 'Kickboxing'];
  const gearList = ['Gloves', 'Headgear', 'Mouthguard', 'Hand Wraps', 'Shin Guards', 'Groin Protector'];

  const toggleGear = (gear: string) => {
    if (selectedGear.includes(gear)) {
      setSelectedGear(selectedGear.filter(g => g !== gear));
    } else {
      setSelectedGear([...selectedGear, gear]);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <h2 className="text-2xl text-white mb-2">Select a Gym</h2>
            <p className="text-zinc-400 mb-6">Choose a verified location</p>

            <div className="space-y-4">
              {gyms.map(gym => (
                <div
                  key={gym.id}
                  onClick={() => setSelectedGym(gym)}
                  className={`bg-zinc-900 rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedGym?.id === gym.id ? 'ring-2 ring-red-600' : 'hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex gap-4 p-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={gym.photo}
                        alt={gym.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white">{gym.name}</h3>
                        {gym.verified && (
                          <Badge className="bg-blue-600 text-white border-0 text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-zinc-400 text-sm mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>{gym.distance} miles</span>
                        <span className="mx-2">•</span>
                        <span>⭐ {gym.rating}</span>
                      </div>
                      <p className="text-zinc-500 text-sm">{gym.address}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <h2 className="text-2xl text-white mb-2">Date & Time</h2>
            <p className="text-zinc-400 mb-6">When do you want to train?</p>

            <div className="mb-6 bg-zinc-900 rounded-lg p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md"
              />
            </div>

            <div>
              <h3 className="text-white mb-3">Select Time</h3>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map(time => (
                  <div
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                      selectedTime === time
                        ? 'border-red-600 bg-red-600/10 text-white'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Clock className="h-5 w-5 mx-auto mb-2" />
                    {time}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <h2 className="text-2xl text-white mb-2">Ruleset & Gear</h2>
            <p className="text-zinc-400 mb-6">Define the session parameters</p>

            <div className="mb-6">
              <h3 className="text-white mb-3">Ruleset</h3>
              <div className="grid grid-cols-2 gap-3">
                {rulesets.map(ruleset => (
                  <div
                    key={ruleset}
                    onClick={() => setSelectedRuleset(ruleset)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                      selectedRuleset === ruleset
                        ? 'border-red-600 bg-red-600/10 text-white'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {ruleset}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white mb-3">Required Gear</h3>
              <div className="grid grid-cols-2 gap-3">
                {gearList.map(gear => (
                  <div
                    key={gear}
                    onClick={() => toggleGear(gear)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedGear.includes(gear)
                        ? 'border-red-600 bg-red-600/10 text-white'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{gear}</span>
                      {selectedGear.includes(gear) && (
                        <CheckCircle2 className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl text-white mb-2">Booking Confirmed!</h2>
              <p className="text-zinc-400">Your sparring session is scheduled</p>
            </div>

            {/* Session Summary */}
            <div className="bg-zinc-900 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-zinc-800">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <ImageWithFallback
                    src={fighter.photo}
                    alt={fighter.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white">{fighter.name.split('"')[0]}</h3>
                  <div className="flex gap-2">
                    <Badge className="bg-zinc-800 text-zinc-400 text-xs border-0">
                      {fighter.disciplines[0]}
                    </Badge>
                    <Badge className="bg-zinc-800 text-zinc-400 text-xs border-0">
                      {fighter.experience}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Location</span>
                  <span className="text-white">{selectedGym?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Date</span>
                  <span className="text-white">
                    {selectedDate?.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Time</span>
                  <span className="text-white">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Ruleset</span>
                  <span className="text-white">{selectedRuleset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Deposit</span>
                  <span className="text-white">$25.00</span>
                </div>
              </div>
            </div>

            {/* Safety Notice */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-4">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm mb-1">Safety First</p>
                  <p className="text-zinc-400 text-sm">
                    Both fighters must follow gym safety guidelines. Deposits are refundable if canceled 24h in advance.
                  </p>
                </div>
              </div>
            </div>

            {/* Gym Address */}
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-red-600" />
                <h3 className="text-white">Gym Location</h3>
              </div>
              <p className="text-zinc-400 text-sm mb-3">{selectedGym?.address}</p>
              <Button
                variant="outline"
                className="w-full border-zinc-700 text-white hover:bg-zinc-800"
              >
                Get Directions
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="absolute inset-0 bg-zinc-950 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <button
          onClick={step === 1 ? onClose : () => setStep(step - 1)}
          className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 rounded-full"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
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

        <div className="w-10" />
      </div>

      {/* Content */}
      {renderStep()}

      {/* Footer */}
      <div className="bg-zinc-900 border-t border-zinc-800 px-6 py-4">
        {step < 4 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={step === 1 && !selectedGym}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-6"
          >
            {step === 3 ? 'Confirm & Pay $25' : 'Continue'}
          </Button>
        ) : (
          <div className="space-y-3">
            <Button
              onClick={onComplete}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-6"
            >
              Done
            </Button>
            <Button
              variant="ghost"
              className="w-full text-white hover:bg-zinc-800"
              onClick={onClose}
            >
              Add to Calendar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
