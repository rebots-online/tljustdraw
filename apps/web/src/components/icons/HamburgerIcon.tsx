const HamburgerIcon = ({ title = 'Menu' }: { title?: string }) => (
  <svg
    aria-hidden={title ? undefined : true}
    role={title ? 'img' : 'presentation'}
    viewBox="0 0 24 24"
    width={20}
    height={20}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {title ? <title>{title}</title> : null}
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export default HamburgerIcon;
