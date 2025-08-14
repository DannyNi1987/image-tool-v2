export default function PrimaryHeader() {
  return (
    <header className="w-full shadow-header bg-transparent">
      <div className="container flex h-16 items-center justify-between">
        <a href="https://bdwebtek.com" className="flex items-center gap-3">
          <div className="h-8 w-28 bg-gray-200 rounded" aria-label="Logo placeholder" />
          <span className="sr-only">BD WEB TEK</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-[15px]">
          <a href="/blog" className="hover:text-accent transition-colors">Blog</a>
          <a href="/projects" className="hover:text-accent transition-colors">Projects</a>
          <a href="/service" className="hover:text-accent transition-colors">Service</a>
          <a href="/contact" className="hover:text-accent transition-colors">Contact</a>
        </nav>
      </div>
    </header>
  )
}
