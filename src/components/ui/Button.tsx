export default function Button({ className = '', text = '', onClick = () => {} }) {
  return (
    <button
      type="submit"
      className={`text-white font-bold py-2 px-4 w-28 rounded-lg ${className}`}
      value={text}
      onClick={() => {onClick()}}
    >
      {text}
    </button>
  );
}