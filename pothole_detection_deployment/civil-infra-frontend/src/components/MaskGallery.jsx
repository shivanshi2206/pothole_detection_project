export default function MaskGallery({ masks }) {
  if (!masks || masks.length === 0) return <p className="text-gray-600">No masks detected.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {masks.map((mask, i) => (
        <img
          key={i}
          src={`data:image/png;base64,${mask}`}
          alt={`Mask ${i + 1}`}
          className="rounded-lg shadow-md border border-indigo-200 object-contain max-h-48"
        />
      ))}
    </div>
  );
}
