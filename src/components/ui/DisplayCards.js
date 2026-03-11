import { cn } from '../../lib/utils';

function DisplayCard({
  className,
  label,
  src,
  type = 'img',
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative h-48 w-64 sm:h-56 sm:w-72 -skew-y-[8deg] select-none cursor-pointer rounded-xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-700",
        "after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[16rem] after:bg-gradient-to-l after:from-slate-50 dark:after:from-slate-950 after:to-transparent after:content-[''] after:z-10",
        "hover:border-white/20 hover:shadow-xl",
        className
      )}
      data-hover
    >
      {/* Image / video background */}
      {type === 'video' ? (
        <video src={src} className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline />
      ) : (
        <img src={src} alt={label} className="absolute inset-0 w-full h-full object-cover" />
      )}
      {/* Gradient overlay + label */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-20" />
      <p className="absolute bottom-3 left-4 text-white font-semibold text-lg z-20 drop-shadow-md">
        {label}
      </p>
    </div>
  );
}

export default function DisplayCards({ cards, onCardClick }) {
  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center">
      {cards.map((cardProps, index) => (
        <DisplayCard
          key={index}
          {...cardProps}
          onClick={() => onCardClick && onCardClick(index)}
        />
      ))}
    </div>
  );
}
