export default function About() {
  return (
    <main className="container mx-auto px-6 py-20 max-w-4xl text-indigo-900">
      <h1 className="text-4xl font-bold mb-8 text-center">About InfraScan</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">The Problem</h2>
        <p className="leading-relaxed">
          Potholes are a significant hazard to road users, causing accidents, vehicle damage, and economic losses. Traditional inspection methods are manual, time-consuming, and often miss emerging road issues. Delayed detection increases maintenance costs and risks for both governments and drivers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Our Solution</h2>
        <p className="leading-relaxed">
          InfraScan provides an intelligent road monitoring system that detects potholes and surface damage in real-time. By analyzing images and videos, it assists transportation agencies in prioritizing road repairs and also provides warnings to drivers to avoid potholes—reducing accidents and improving public safety.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">System Highlights</h2>
        <ul className="list-disc list-inside leading-relaxed">
          <li>Real-time road condition monitoring from images or videos</li>
          <li>Supports both object detection and semantic segmentation</li>
          <li>Helps municipalities prioritize repair tasks proactively</li>
          <li>Alerts drivers about potholes to avoid damage</li>
          <li>Fast, scalable solution powered deep learning</li>
        </ul>
      </section>
    </main>
  );
}
