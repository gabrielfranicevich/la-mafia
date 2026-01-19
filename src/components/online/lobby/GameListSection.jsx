import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from '../../Icons';
import GameItem from './GameItem';

const GameListSection = ({
  title,
  subtitle,
  icon,
  games,
  isExpanded,
  onToggle,
  onJoin,
  headerClassName = "bg-transparent",
  showCount = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 3;

  useEffect(() => {
    setCurrentPage(1);
  }, [games.length]);

  if (games.length === 0) return null;

  const totalPages = Math.ceil(games.length / gamesPerPage);
  const startIndex = (currentPage - 1) * gamesPerPage;
  const paginatedGames = games.slice(startIndex, startIndex + gamesPerPage);

  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 border-b border-noir-gold/20 hover:bg-white/5 transition-all group ${headerClassName}`}
      >
        <div className="flex items-center gap-4">
          <div className={`text-noir-gold group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div className="text-left">
            <h2 className="text-lg font-serif font-bold text-noir-gold leading-tight tracking-widest">{title}</h2>
            {subtitle && (
              <span className="text-xs text-noir-smoke font-sans tracking-wider">{subtitle}</span>
            )}
          </div>
        </div>
        {isExpanded ? <ChevronUp size={20} className="text-noir-gold/50" /> : <ChevronDown size={20} className="text-noir-gold/50" />}
      </button>

      {isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-0 divide-y divide-noir-gold/10">
            {paginatedGames.map((game) => (
              <GameItem
                key={game.id}
                game={game}
                onJoin={onJoin}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between pt-4 px-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPage(prev => Math.max(1, prev - 1));
                }}
                disabled={currentPage === 1}
                className="p-2 text-noir-gold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 rounded-full transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              <span className="text-xs font-bold text-noir-smoke tracking-widest">
                PAGE {currentPage} / {totalPages}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPage(prev => Math.min(totalPages, prev + 1));
                }}
                disabled={currentPage === totalPages}
                className="p-2 text-noir-gold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 rounded-full transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameListSection;
