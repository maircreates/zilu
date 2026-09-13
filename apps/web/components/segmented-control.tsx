'use client';

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  legend,
}: {
  value: T;
  options: readonly { id: T; label: string }[];
  onChange: (next: T) => void;
  legend: string;
}) {
  return (
    <fieldset className="stroke-speed">
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={option.id === value ? 'active' : ''}
          aria-pressed={option.id === value}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  );
}
