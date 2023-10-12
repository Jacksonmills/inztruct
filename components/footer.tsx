import { ThemeToggle } from './theme-toggle';

export default function Footer() {
  return (
    <footer
      className="
      flex
      gap-6
      items-center
      justify-center
      w-full
      h-24
      border-t
    "
    >
      <span
        className="
        dark:text-white/60
        text-black/60
      "
      >
        Inztruct 2023
      </span>
      <ThemeToggle />
    </footer>
  );
}
