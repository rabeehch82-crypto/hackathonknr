import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Search,
  Stethoscope,
  Star,
  Video,
  MapPin,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export function AppointmentsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [selectedTime, setSelectedTime] = useState("10:00 AM");

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Jenkins",
      specialty: "Cardiology & Hypertension",
      rating: 4.9,
      reviews: 128,
      hospital: "St. Jude Heart Center",
      available: "Tomorrow, 10:00 AM",
      image: "SJ",
    },
    {
      id: 2,
      name: "Dr. Robert Vance",
      specialty: "Endocrinology & Diabetes Care",
      rating: 4.8,
      reviews: 94,
      hospital: "City Health Hospital",
      available: "Friday, 02:30 PM",
      image: "RV",
    },
    {
      id: 3,
      name: "Dr. Elena Rostova",
      specialty: "Neurology & Senior Memory Care",
      rating: 4.9,
      reviews: 210,
      hospital: "Neuro Care Institute",
      available: "Monday, 11:00 AM",
      image: "ER",
    },
  ];

  const timeSlots = ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM"];

  const handleBook = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      setSelectedDoctor(null);
      alert("Appointment successfully booked with double-booking prevention!");
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <CalendarIcon className="h-7 w-7 text-teal-600" /> Book Doctor Consultations
            </h1>
            <Badge variant="teal" className="gap-1">
              <Sparkles className="h-3 w-3" /> Telehealth & In-Clinic
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Search top specialists, view real-time availability, and schedule seamless appointments.
          </p>
        </div>

        <Input
          placeholder="Search specialty, doctor, or clinic..."
          icon={<Search className="h-4 w-4" />}
          className="w-full sm:w-72"
        />
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <Card key={doc.id} hoverable className="p-2 border-teal-500/30 flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300 font-extrabold flex items-center justify-center text-base">
                    {doc.image}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{doc.name}</h3>
                    <p className="text-xs text-muted-foreground">{doc.specialty}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-500" /> {doc.rating} ({doc.reviews})
                </span>
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="h-3.5 w-3.5 text-teal-600" /> {doc.hospital}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs flex items-center justify-between">
                <span className="text-muted-foreground">Next Available:</span>
                <span className="font-bold text-teal-700 dark:text-teal-300">{doc.available}</span>
              </div>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Button
                onClick={() => setSelectedDoctor(doc)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-10 gap-2 text-xs"
              >
                <Video className="h-4 w-4" /> Book Appointment
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Booking Wizard Modal */}
      {selectedDoctor && (
        <Modal
          isOpen={!!selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          title={`Book with ${selectedDoctor.name}`}
          description={selectedDoctor.specialty}
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-muted/60 text-xs space-y-1">
              <div className="font-bold text-foreground">{selectedDoctor.name}</div>
              <div className="text-muted-foreground">{selectedDoctor.hospital}</div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold">Select Time Slot (Tomorrow)</label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      selectedTime === slot
                        ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                        : "bg-background border-border hover:border-teal-500"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleBook}
              disabled={bookingConfirmed}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-11"
            >
              {bookingConfirmed ? "Confirming..." : `Confirm Booking for ${selectedTime}`}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
