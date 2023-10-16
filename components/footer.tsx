import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';

export default function Footer() {
  return (
    <footer
      className="
      flex
      gap-2
      lg:gap-6
      p-6
      items-center
      w-full
      h-24
      border-t
    "
    >
      <div className="text-2xl md:text-4xl mr-auto">
        <Logo />
      </div>
      <div className='flex items-center gap-2 lg:gap-6'>
        <span
          className="
        dark:text-white/60
        text-black/60
      "
        >
          Inztruct 2023
        </span>
        <ThemeToggle />
      </div>
    </footer>
  );
}
