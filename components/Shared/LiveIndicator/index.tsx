type Props = {
  minute: number | string | null;
  label?: string;
};

/** A pulsing dot + minute marker, the one place motion is used to draw the eye to a live match. */
function LiveIndicator({ minute, label }: Props) {
  return (
    <span className="inline-flex items-center gap-1.5 text-brand-live text-xs font-medium">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-live opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-live"></span>
      </span>
      {label ?? `${minute ?? 0}'`}
    </span>
  );
}

export default LiveIndicator;
