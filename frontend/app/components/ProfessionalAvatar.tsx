interface ProfessionalAvatarProps {
  name: string;
  color: string;
  isSelected?: boolean;
  onClick: () => void;
}

export default function ProfessionalAvatar({ name, color, isSelected, onClick }: ProfessionalAvatarProps) {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onClick}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all
          ${isSelected ? 'ring-2 ring-offset-2 ring-violet-600' : ''}
        `}
        style={{ backgroundColor: color }}
      >
        <span className="text-white">{initials}</span>
      </button>
      <span className="text-xs text-gray-600 text-center max-w-[80px] truncate">
        {name}
      </span>
    </div>
  );
} 