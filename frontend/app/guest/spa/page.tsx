import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Spa & Wellness - Buffr Host',
  description: 'Book spa treatments and wellness services',
};

export default function SpaWellnessPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content">Spa & Wellness</h1>
        <p className="text-base-content/70 mt-2">
          Relax and rejuvenate with our premium spa treatments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="tabs tabs-boxed mb-6">
            <a className="tab tab-active">Massage</a>
            <a className="tab">Facial Treatments</a>
            <a className="tab">Body Treatments</a>
            <a className="tab">Wellness Packages</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <figure>
                <Image src="/placeholder-spa.jpg" alt="Deep Tissue Massage" width={300} height={192} className="w-full h-48 object-cover" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Deep Tissue Massage</h2>
                <p>Targeted massage therapy to relieve muscle tension and improve circulation</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-base-content/70">Duration: 60 minutes</span>
                  <span className="text-2xl font-bold text-primary">N$ 450</span>
                </div>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Book Now</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure>
                <Image src="/placeholder-spa.jpg" alt="Swedish Massage" width={300} height={192} className="w-full h-48 object-cover" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Swedish Massage</h2>
                <p>Classic relaxation massage with long, flowing strokes to ease tension</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-base-content/70">Duration: 60 minutes</span>
                  <span className="text-2xl font-bold text-primary">N$ 380</span>
                </div>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Book Now</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure>
                <Image src="/placeholder-spa.jpg" alt="Hot Stone Massage" width={300} height={192} className="w-full h-48 object-cover" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Hot Stone Massage</h2>
                <p>Heated stones placed on key points to melt away tension and stress</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-base-content/70">Duration: 90 minutes</span>
                  <span className="text-2xl font-bold text-primary">N$ 520</span>
                </div>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Book Now</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure>
                <Image src="/placeholder-spa.jpg" alt="Aromatherapy Facial" width={300} height={192} className="w-full h-48 object-cover" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Aromatherapy Facial</h2>
                <p>Rejuvenating facial treatment with essential oils for glowing skin</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-base-content/70">Duration: 75 minutes</span>
                  <span className="text-2xl font-bold text-primary">N$ 420</span>
                </div>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Book Now</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure>
                <Image src="/placeholder-spa.jpg" alt="Body Scrub" width={300} height={192} className="w-full h-48 object-cover" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Exfoliating Body Scrub</h2>
                <p>Gentle exfoliation to remove dead skin cells and reveal smooth, radiant skin</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-base-content/70">Duration: 45 minutes</span>
                  <span className="text-2xl font-bold text-primary">N$ 350</span>
                </div>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Book Now</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure>
                <Image src="/placeholder-spa.jpg" alt="Wellness Package" width={300} height={192} className="w-full h-48 object-cover" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Ultimate Wellness Package</h2>
                <p>Complete wellness experience including massage, facial, and body treatment</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-base-content/70">Duration: 3 hours</span>
                  <span className="text-2xl font-bold text-primary">N$ 1,200</span>
                </div>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Book Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Book Your Treatment</h2>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Select Date</span>
                  </label>
                  <input type="date" className="input input-bordered" />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Select Time</span>
                  </label>
                  <select className="select select-bordered">
                    <option>9:00 AM</option>
                    <option>10:30 AM</option>
                    <option>12:00 PM</option>
                    <option>2:00 PM</option>
                    <option>3:30 PM</option>
                    <option>5:00 PM</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Therapist Preference</span>
                  </label>
                  <select className="select select-bordered">
                    <option>No Preference</option>
                    <option>Emma Davis</option>
                    <option>Sarah Wilson</option>
                    <option>Mike Johnson</option>
                  </select>
                </div>
                <button className="btn btn-primary w-full">Confirm Booking</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Spa Facilities</h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Sauna</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Steam Room</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Relaxation Lounge</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Changing Rooms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Shower Facilities</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Spa Hours</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>10:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Spa Etiquette</h2>
              <div className="space-y-2 text-sm">
                <p>• Arrive 15 minutes early for your appointment</p>
                <p>• Please turn off your mobile phone</p>
                <p>• Speak softly in relaxation areas</p>
                <p>• Shower before using sauna or steam room</p>
                <p>• Inform us of any medical conditions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
