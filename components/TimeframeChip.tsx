interface TimeframeChipProps {
  timeframe: string
  isSelected: boolean
  onClick: (timeframe: string) => void
}

export function TimeframeChip({ timeframe, isSelected, onClick }: TimeframeChipProps) {
  return (
    <button
      onClick={() => onClick(timeframe)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        isSelected
          ? "bg-primary text-primary-foreground shadow-lg scale-105"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      }`}
    >
      {timeframe}
    </button>
  )
}

