import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative group">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-hover:text-stone-500" />
        <input
          type="text"
          className="w-full h-12 rounded-2xl border-2 border-neutral-200/70 bg-white/60 backdrop-blur-sm py-2 pl-12 pr-4 text-base placeholder:text-neutral-400 
          focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/20 
          transition-all duration-300 ease-in-out
          shadow-sm hover:shadow-md
          group-hover:border-stone-400/50"
          placeholder="Input keyword..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
} 