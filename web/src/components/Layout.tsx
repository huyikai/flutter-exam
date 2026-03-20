export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme relative flex min-h-screen flex-col">
      <div className="app-background absolute inset-0 -z-10" />
      <main className="relative flex flex-1 flex-col">{children}</main>
      <footer
        className="text-center text-muted-foreground"
        style={{ padding: '20px 16px', fontSize: '12px' }}
      >
        Flutter 题库测验 · © 2025
      </footer>
    </div>
  )
}
