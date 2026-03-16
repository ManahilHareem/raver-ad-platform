export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-surface-base px-6">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 -left-1/4 w-[1000px] h-[1000px] bg-brand-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 -right-1/4 w-[1000px] h-[1000px] bg-brand-secondary/10 rounded-full blur-[120px] -z-10 animate-pulse delay-700" />

      <div className="z-10 max-w-5xl w-full flex flex-col items-center text-center space-y-12">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass text-sm font-medium text-text-accent animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary/40 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
          </span>
          <span>Now in Beta: Intelligent AI Agents</span>
        </div>

        {/* Hero Content */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-text-primary leading-[1.1]">
            Create Anything <br />
            <span className="bg-linear-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">
              with Ravi AI
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-text-secondary font-inter leading-relaxed">
            RAVI is an AI-powered creative studio that helps teams generate 
            images, videos, campaigns, and marketing content using intelligent AI agents.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button className="h-14 px-10 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-brand-primary/25">
            Start Creating
          </button>
          <button className="h-14 px-10 rounded-2xl glass font-semibold text-lg transition-all hover:bg-surface-card-hover text-text-primary border-border-subtle">
            View Templates
          </button>
        </div>

        {/* Floating UI Elements Mockup */}
        <div className="pt-20 w-full relative">
          <div className="relative glass rounded-3xl p-4 shadow-2xl border-border-subtle overflow-hidden group">
            <div className="aspect-video bg-linear-to-br from-brand-primary/5 to-brand-secondary/5 rounded-2xl flex items-center justify-center transition-all group-hover:bg-brand-primary/10">
              <span className="text-text-secondary font-inter italic">
                 Dashboard Preview - Intelligence at your fingertips
              </span>
            </div>
            {/* Overlay simulation */}
            <div className="absolute inset-0 bg-linear-to-t from-surface-card/20 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </main>
  );
}
