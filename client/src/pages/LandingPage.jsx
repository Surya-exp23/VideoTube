import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

/* ─── scroll-triggered fade-up wrapper ─── */
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── animated mini-mockups ─── */
function VideoMockup() {
  return (
    <div className="w-full h-28 rounded-xl bg-[#0d0d0d] border border-[#1f1f1f] overflow-hidden flex flex-col p-3 gap-2">
      <div className="flex-1 rounded-lg bg-[#141414] flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center"
        >
          <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[9px] border-transparent border-l-white ml-0.5" />
        </motion.div>
      </div>
      <div className="flex gap-2 items-center">
        <div className="skeleton h-2 flex-1 rounded" />
        <div className="skeleton h-2 w-10 rounded" />
      </div>
    </div>
  )
}

function ChannelMockup() {
  return (
    <div className="w-full h-28 rounded-xl bg-[#0d0d0d] border border-[#1f1f1f] overflow-hidden flex flex-col">
      <div className="h-10 bg-gradient-to-r from-[#1a1a1a] to-[#222] relative">
        <motion.div
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        />
      </div>
      <div className="px-3 -mt-4 flex items-end gap-2 flex-1 pb-2">
        <div className="w-9 h-9 rounded-full bg-[#2a2a2a] border-2 border-[#0d0d0d] shrink-0" />
        <div className="flex flex-col gap-1 pb-1">
          <div className="skeleton h-2 w-20 rounded" />
          <div className="skeleton h-1.5 w-14 rounded" />
        </div>
        <div className="ml-auto mb-1">
          <div className="px-2.5 py-1 rounded-full bg-white text-black text-[9px] font-semibold">Subscribe</div>
        </div>
      </div>
    </div>
  )
}

function CommunityMockup() {
  const posts = ['Just uploaded a new vlog! 🎬', 'Thanks for 1k subs 🙏']
  return (
    <div className="w-full h-28 rounded-xl bg-[#0d0d0d] border border-[#1f1f1f] overflow-hidden p-3 flex flex-col gap-2">
      {posts.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.35 + 0.2 }}
          className="flex items-start gap-2"
        >
          <div className="w-5 h-5 rounded-full bg-[#1f1f1f] shrink-0 mt-0.5" />
          <p className="text-[9px] text-[#606060] leading-relaxed">{p}</p>
        </motion.div>
      ))}
      <div className="mt-auto flex items-center gap-2">
        <div className="flex-1 h-5 rounded-lg bg-[#141414] border border-[#1f1f1f]" />
        <div className="px-2 py-1 rounded-full bg-white text-black text-[8px] font-semibold">Post</div>
      </div>
    </div>
  )
}

function LikeMockup() {
  const [liked, setLiked] = useState(false)
  useEffect(() => {
    const t = setInterval(() => setLiked((v) => !v), 1800)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="w-full h-28 rounded-xl bg-[#0d0d0d] border border-[#1f1f1f] overflow-hidden p-3 flex flex-col gap-3">
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 flex flex-col gap-1.5">
            <div className="skeleton aspect-video rounded-lg" style={{ animationDelay: `${i * 0.2}s` }} />
            <div className="skeleton h-1.5 rounded" style={{ animationDelay: `${i * 0.2 + 0.1}s` }} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 pt-1 border-t border-[#1a1a1a]">
        <motion.button
          animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center gap-1 text-[9px] ${liked ? 'text-white' : 'text-[#3a3a3a]'}`}
        >
          <svg width="11" height="11" viewBox="0 0 13 13" fill={liked ? 'currentColor' : 'none'}>
            <path d="M6.5 11S1 7.5 1 4.5a3 3 0 015.5-1.5A3 3 0 0112 4.5C12 7.5 6.5 11 6.5 11z" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
          {liked ? 'Liked' : 'Like'}
        </motion.button>
      </div>
    </div>
  )
}

function PlaylistMockup() {
  return (
    <div className="w-full h-28 rounded-xl bg-[#0d0d0d] border border-[#1f1f1f] overflow-hidden p-3 flex flex-col gap-2">
      {['My Favourites', 'Web Dev Tutorials', 'Lo-fi Study'].map((name, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.18 + 0.1 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-6 rounded bg-[#1a1a1a] shrink-0 flex items-center justify-center">
            <div className="w-0 h-0 border-t-[3px] border-b-[3px] border-l-[5px] border-transparent border-l-[#3a3a3a]" />
          </div>
          <div>
            <p className="text-[9px] text-[#a0a0a0]">{name}</p>
            <p className="text-[8px] text-[#3a3a3a]">{3 + i} videos</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function CommentMockup() {
  const comments = [
    { user: 'alex', msg: 'This is so good! 🔥', delay: 0.1 },
    { user: 'sara', msg: 'Loved the explanation 👏', delay: 0.3 },
    { user: 'you', msg: 'Thanks everyone!', delay: 0.5 },
  ]
  return (
    <div className="w-full h-28 rounded-xl bg-[#0d0d0d] border border-[#1f1f1f] overflow-hidden p-3 flex flex-col gap-2">
      {comments.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: c.delay }}
          className="flex items-start gap-2"
        >
          <div className="w-4 h-4 rounded-full bg-[#1f1f1f] shrink-0 mt-0.5" />
          <div>
            <span className="text-[8px] text-[#606060] font-medium">@{c.user} · </span>
            <span className="text-[8px] text-[#404040]">{c.msg}</span>
          </div>
        </motion.div>
      ))}
      <div className="mt-auto flex items-center gap-1.5">
        <div className="flex-1 h-4 rounded-lg bg-[#141414] border border-[#1f1f1f]" />
        <div className="w-8 h-4 rounded-full bg-[#1f1f1f]" />
      </div>
    </div>
  )
}

function SubsMockup() {
  return (
    <div className="w-full h-28 rounded-xl bg-[#0d0d0d] border border-[#1f1f1f] overflow-hidden p-3 flex flex-col gap-2">
      <div className="flex gap-2 overflow-hidden">
        {['JD', 'KL', 'MN', 'OP', 'QR'].map((init, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 + 0.1 }}
            className="flex flex-col items-center gap-1 shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-[#1f1f1f] border border-[#2a2a2a] flex items-center justify-center text-[8px] text-[#606060]">{init}</div>
            <div className="skeleton h-1.5 w-6 rounded" />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5 flex-1">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-2 items-center">
            <div className="skeleton w-12 h-8 rounded-lg shrink-0" />
            <div className="flex flex-col gap-1 flex-1">
              <div className="skeleton h-1.5 rounded w-3/4" />
              <div className="skeleton h-1.5 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WatchMockup() {
  return (
    <div className="w-full h-28 rounded-xl bg-[#0d0d0d] border border-[#1f1f1f] overflow-hidden flex gap-2 p-2">
      <div className="flex-[2] flex flex-col gap-1.5">
        <div className="skeleton flex-1 rounded-lg" />
        <div className="skeleton h-2 w-3/4 rounded" />
        <div className="skeleton h-1.5 w-1/2 rounded" />
        <div className="flex gap-2 mt-0.5">
          <div className="skeleton h-4 w-10 rounded-full" />
          <div className="skeleton h-4 w-10 rounded-full" />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-1.5 items-center">
            <div className="skeleton w-10 h-6 rounded shrink-0" />
            <div className="flex flex-col gap-1 flex-1">
              <div className="skeleton h-1 rounded" />
              <div className="skeleton h-1 w-2/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── feature list ─── */
const FEATURES = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><rect x="1" y="4" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.6"/><path d="M9 8.5l5 2.5-5 2.5V8.5z" fill="currentColor"/></svg>,
    title: 'Upload & Stream Videos',
    desc: 'Publish with title, thumbnail and tags. Videos are served through a smooth HTML5 player experience.',
    mockup: <VideoMockup />,
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="7" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M3 19c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
    title: 'Create Your Channel',
    desc: 'Customise your channel with an avatar, cover banner and bio. Manage uploads and stats in one place.',
    mockup: <ChannelMockup />,
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M11 3C6.6 3 3 6.6 3 11c0 1.8.6 3.5 1.6 4.9L3 19l3.4-1.4A7.9 7.9 0 0011 19c4.4 0 8-3.6 8-8s-3.6-8-8-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M8 11h.01M11 11h.01M14 11h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    title: 'Community Posts',
    desc: 'Share thoughts, updates and announcements with your subscribers. Like and reply in real time.',
    mockup: <CommunityMockup />,
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M11 2l2.4 5 5.6.8-4 3.9.9 5.6L11 14.8l-5 2.5.9-5.6L3 7.8l5.6-.8L11 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
    title: 'Like & Save Videos',
    desc: 'Heart videos you love. Your personal liked-videos library is always one click away.',
    mockup: <LikeMockup />,
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M16 9l4-2v8l-4-2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
    title: 'Playlists',
    desc: 'Organise videos into curated playlists. Keep them private or share them publicly.',
    mockup: <PlaylistMockup />,
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M11 3C6.6 3 3 6.6 3 11c0 4 3 7.4 7 7.9v2.1l2-2 2 2V18c4-.5 7-3.9 7-7.9C21 5.7 16.5 3 11 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M8 10h6M8 13h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
    title: 'Comments & Reactions',
    desc: 'Engage through threaded comments on every video. Like comments to surface the best discussions.',
    mockup: <CommentMockup />,
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.6"/><path d="M11 7v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
    title: 'Subscriptions Feed',
    desc: 'Follow creators and get a personalised feed of their newest uploads. Never miss a drop.',
    mockup: <SubsMockup />,
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M11 4v14M4 11h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    title: 'Watch Page',
    desc: 'A full-featured watch page with related videos, comments, likes and subscribe — all in one view.',
    mockup: <WatchMockup />,
  },
]

const STATS = [
  { value: '8+', label: 'Core Features' },
  { value: 'Full', label: 'REST API' },
  { value: '∞', label: 'Videos' },
  { value: '100%', label: 'Open Source' },
]

/* ─── main export ─── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-10 py-4 border-b border-[#111] bg-black/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3l8 4-8 4V3z" fill="black" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">VideoTube</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-[#a0a0a0] hover:text-white transition-colors px-3 py-2">
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm bg-white text-black font-semibold px-5 py-2 rounded-full hover:bg-[#e0e0e0] transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center pt-24 pb-16 overflow-hidden">
        {/* background grid */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-white/[0.03] blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2a2a2a] bg-[#0d0d0d] text-xs text-[#a0a0a0] mb-8"
        >
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-1.5 h-1.5 rounded-full bg-white inline-block"
          />
          Full-stack video platform — built from scratch
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
        >
          Watch, share,
          <br />
          <span className="text-[#2a2a2a]">create.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22 }}
          className="text-base sm:text-lg text-[#606060] leading-relaxed max-w-xl mb-10"
        >
          VideoTube is a full-featured video platform with channels, playlists,
          community posts, subscriptions and more — all in a clean, distraction-free experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="flex flex-col sm:flex-row items-center gap-3 mb-16"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black font-semibold rounded-full text-sm hover:bg-[#e0e0e0] transition-colors"
            >
              Start for free
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#2a2a2a] text-white font-medium rounded-full text-sm hover:border-[#3a3a3a] hover:bg-[#0d0d0d] transition-colors"
            >
              Sign in
            </Link>
          </motion.div>
        </motion.div>

        {/* hero mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-5xl"
        >
          <div className="w-full aspect-video rounded-2xl bg-[#080808] border border-[#1a1a1a] overflow-hidden shadow-[0_60px_160px_rgba(0,0,0,0.9)]">
            <div className="w-full h-full flex flex-col p-5 gap-4">
              <div className="flex gap-3 items-center">
                <div className="skeleton w-6 h-6 rounded-full" />
                <div className="skeleton h-3 w-24 rounded" />
                <div className="flex gap-2 ml-auto">
                  <div className="skeleton h-6 w-20 rounded-full" />
                  <div className="skeleton h-6 w-16 rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 flex-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="skeleton aspect-video rounded-lg" style={{ animationDelay: `${i * 0.15}s` }} />
                    <div className="skeleton h-2.5 rounded" style={{ animationDelay: `${i * 0.15 + 0.1}s` }} />
                    <div className="skeleton h-2 w-3/4 rounded" style={{ animationDelay: `${i * 0.15 + 0.2}s` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent pointer-events-none rounded-b-2xl" />
        </motion.div>
      </section>

      {/* ── Stats strip ── */}
      <FadeUp className="border-y border-[#111]">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{s.value}</p>
              <p className="text-xs text-[#606060] mt-1 tracking-wide uppercase">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* ── Features grid ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <FadeUp className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-[#404040] mb-3">Everything you need</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            Built for creators.<br />
            <span className="text-[#2a2a2a]">Loved by viewers.</span>
          </h2>
          <p className="mt-4 text-[#606060] text-base max-w-lg mx-auto">
            Every feature is purpose-built into one cohesive platform — no third-party tools needed.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -4, borderColor: '#2a2a2a' }}
                transition={{ duration: 0.25 }}
                className="group bg-[#080808] border border-[#161616] rounded-2xl p-5 flex flex-col gap-4 h-full cursor-default"
              >
                <div className="overflow-hidden rounded-xl">{f.mockup}</div>
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5 text-[#3a3a3a] group-hover:text-[#606060] transition-colors">
                    {f.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white mb-1">{f.title}</p>
                    <p className="text-xs text-[#606060] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <FadeUp className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-[#404040] mb-3">Get started in seconds</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">How it works</h2>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
          <div className="hidden sm:block absolute top-7 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]" />
          {[
            { n: '01', title: 'Create an account', desc: 'Sign up in seconds — no credit card needed. Your free channel is ready instantly.' },
            { n: '02', title: 'Set up your channel', desc: 'Upload an avatar, add a banner image and write your channel bio to introduce yourself.' },
            { n: '03', title: 'Publish & grow', desc: 'Upload videos, post to your community and watch your subscriber count climb.' },
          ].map((step, i) => (
            <FadeUp key={i} delay={i * 0.15} className="flex flex-col items-center text-center gap-4">
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="w-14 h-14 rounded-2xl bg-[#0d0d0d] border border-[#1a1a1a] flex items-center justify-center text-xs font-bold text-[#3a3a3a] tracking-widest"
              >
                {step.n}
              </motion.div>
              <div>
                <p className="font-semibold text-sm text-white mb-1.5">{step.title}</p>
                <p className="text-xs text-[#606060] leading-relaxed">{step.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <FadeUp>
          <div className="max-w-3xl mx-auto rounded-3xl border border-[#1a1a1a] bg-[#080808] p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-40 rounded-full bg-white/[0.025] blur-[80px]" />
            </div>
            <p className="text-xs uppercase tracking-widest text-[#404040] mb-4">Ready to begin?</p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Your channel<br />awaits.
            </h2>
            <p className="text-[#606060] text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Join VideoTube and start sharing your stories, tutorials and moments with the world — for free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black font-semibold rounded-full text-sm hover:bg-[#e0e0e0] transition-colors"
                >
                  Create free account
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#2a2a2a] text-[#a0a0a0] font-medium rounded-full text-sm hover:text-white hover:border-[#3a3a3a] transition-colors"
                >
                  Already have an account?
                </Link>
              </motion.div>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#111] px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
              <path d="M3 3l8 4-8 4V3z" fill="black" />
            </svg>
          </div>
          <span className="text-sm font-semibold">VideoTube</span>
        </div>
        <p className="text-xs text-[#3a3a3a]">
          Built with React, Node.js, Express &amp; MongoDB.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-xs text-[#3a3a3a] hover:text-[#606060] transition-colors">Sign in</Link>
          <Link to="/register" className="text-xs text-[#3a3a3a] hover:text-[#606060] transition-colors">Register</Link>
        </div>
      </footer>
    </div>
  )
}
