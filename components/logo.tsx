export const Logo = ({ shouldBreak }: { shouldBreak?: boolean }) => {
  return (
    <span
      className={`font-extrabold logo-bend ${
        shouldBreak && 'flex flex-col leading-none'
      }`}
    >
      <span className="logo-italic">INZT</span>
      <span className="logo-italic-reverse">RUCT</span>
    </span>
  );
};
