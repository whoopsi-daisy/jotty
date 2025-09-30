export const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="mt-2 w-full bg-muted rounded-full h-2">
      <div
        className="bg-primary h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
