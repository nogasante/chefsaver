export default function LoadingSpinner() {
  return (
    <div className="spinner-wrapper" role="status" aria-live="polite">
      <div className="spinner" />
      <p>Searching recipes...</p>
      <p>Generating recipes...</p>
    </div>
  );
}
