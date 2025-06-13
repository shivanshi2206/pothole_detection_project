export default function Footer() {
  return (
    <footer className="bg-indigo-900 text-indigo-200 py-6 mt-16">
      <div className="container mx-auto text-center text-sm">
        © {new Date().getFullYear()} InfraScan. All rights reserved.
      </div>
    </footer>
  );
}
