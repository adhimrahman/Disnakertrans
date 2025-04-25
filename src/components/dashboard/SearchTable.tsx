// components/SearchInput.tsx
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder, className }) => {
  return (
    <input
      type="text"
      placeholder={placeholder ?? "Cari..."}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    />
  );
};
