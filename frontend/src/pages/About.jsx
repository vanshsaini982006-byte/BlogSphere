import { Feather, PenLine, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => (
  <div className="max-w-3xl mx-auto px-4 py-16">
    <div className="text-center mb-14">
      <span className="w-12 h-12 rounded-full bg-spine-600 flex items-center justify-center mx-auto mb-4">
        <Feather size={22} className="text-white" />
      </span>
      <h1 className="font-display text-4xl font-semibold mb-4">About BlogSphere</h1>
      <p className="text-ink/60 dark:text-ink-light/60 leading-relaxed max-w-xl mx-auto">
        BlogSphere is a home for developers, students, and lifelong learners who have something worth writing down. No algorithms deciding what gets seen, no paywalls, just good writing shared with people who want to read it.
      </p>
    </div>

    <div className="grid sm:grid-cols-3 gap-6 mb-16">
      {[
        { icon: PenLine, title: "Write freely", desc: "A distraction-free editor built for long-form thinking, with drafts, previews, and publishing in one flow." },
        { icon: Users, title: "Real community", desc: "Every article invites comments and conversation, not just passive scrolling." },
        { icon: Sparkles, title: "Discover ideas", desc: "Explore by category, tag, or search to find writers thinking about what you care about." },
      ].map((f) => (
        <div key={f.title} className="bg-white dark:bg-paper-darksoft border border-ink/8 dark:border-white/8 rounded-2xl p-6 text-center">
          <f.icon size={22} className="text-spine-600 dark:text-spine-300 mx-auto mb-3" />
          <h3 className="font-display font-semibold mb-2">{f.title}</h3>
          <p className="text-sm text-ink/55 dark:text-ink-light/55 leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </div>

    <div className="text-center">
      <Link to="/register" className="inline-flex items-center gap-2 bg-spine-600 hover:bg-spine-700 text-white px-6 py-3 rounded-full font-medium transition-all hover:-translate-y-0.5">
        Join BlogSphere Today
      </Link>
    </div>
  </div>
);

export default About;
