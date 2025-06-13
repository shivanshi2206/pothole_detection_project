export default function Home() {
  return (
    <main className="container mx-auto px-6 py-20 max-w-5xl text-indigo-900">
      <section className="mb-16 text-center">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
          Advanced Civil Infrastructure Monitoring System
        </h1>
        <p className="text-lg max-w-3xl mx-auto text-indigo-800">
          InfraScan is a smart system for real-time pothole detection and road surface analysis. It helps road agencies detect and fix problems early, improving traffic safety and reducing repair costs for both authorities and drivers.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-indigo-100 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-3 text-indigo-900">Why InfraScan?</h2>
          <p>
            Timely pothole detection is crucial for traffic safety and infrastructure longevity. InfraScan automates the monitoring process and helps agencies respond faster to emerging issues.
          </p>
        </div>

        <div className="bg-indigo-100 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-3n  text-indigo-900">Smart & Scalable</h2>
          <p>
            InfraScan supports image and video inputs, performs detection using robust Deep Learning models.
          </p>
        </div>

        <div className="bg-indigo-100 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-3 text-indigo-900">Supports Driver Safety</h2>
          <p>
            Beyond inspections, InfraScan can help drivers avoid potholes by providing visual alerts, reducing accidents, and enabling safer journeys.
          </p>
        </div>
      </section>
    </main>
  );
}
