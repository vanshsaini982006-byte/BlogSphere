// Seeds the database with demo users, posts, and comments so the app never looks empty.
// Run with: npm run seed  (from the backend folder)
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

dotenv.config();

const users = [
  { name: "Vansh Sharma", username: "vansh", email: "demo@blogsphere.com", password: "demo1234", bio: "Full-stack developer & AI enthusiast. Writing about code, careers, and everything in between.", role: "admin" },
  { name: "Ananya Rao", username: "ananya", email: "ananya@blogsphere.com", password: "demo1234", bio: "Frontend engineer obsessed with clean UI and accessible design." },
  { name: "Rahul Verma", username: "rahulv", email: "rahul@blogsphere.com", password: "demo1234", bio: "Machine learning researcher. Coffee-powered." },
  { name: "Sara Khan", username: "sarak", email: "sara@blogsphere.com", password: "demo1234", bio: "Career coach helping developers land their first job." },
];

const postsData = [
  {
    title: "Why React Server Components Are a Bigger Deal Than You Think",
    category: "Web Development",
    tags: ["react", "javascript", "frontend"],
    excerpt: "Server Components change where your code runs, not just how it's written. Here's what actually shifts in production.",
    content: `React Server Components represent one of the most significant shifts in how we think about rendering on the web.

Unlike traditional client components, server components run only on the server, never shipping their JavaScript to the browser. This means you can import large libraries, query databases directly, and read files, all without adding a single byte to your client bundle.

The practical upside is bundle size. Applications that previously shipped hundreds of kilobytes of JavaScript just to render a product page can now do the same work on the server and send plain HTML. Time to interactive drops, and so does the amount of code the browser has to parse and execute.

There's a learning curve, though. Mixing server and client components requires a mental model shift: components are either purely server-rendered or hydrated on the client, and the boundary between them has to be explicit. State, effects, and browser APIs only work in client components, so you'll be reaching for the "use client" directive more often than expected at first.

If you're building a new project today, it's worth spending a weekend prototyping with server components before committing to a full client-rendered architecture. The performance ceiling is simply higher.`,
    featuredImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80",
  },
  {
    title: "A Practical Guide to Fine-Tuning Small Language Models",
    category: "AI",
    tags: ["ai", "machine-learning", "llm"],
    excerpt: "You don't need a data center to fine-tune a useful model. Here's a realistic workflow for solo developers.",
    content: `Fine-tuning has a reputation for requiring enormous compute budgets, but that's mostly true for training foundation models from scratch. Adapting an existing small model to your task is far more accessible.

Start with a base model in the 1B-7B parameter range. Models this size run comfortably on a single consumer GPU and are surprisingly capable once specialized. Pick one with a permissive license so you're not boxed in later.

Data quality matters more than data quantity. A few hundred carefully curated, high-quality examples of the input-output behavior you want will outperform tens of thousands of noisy scraped examples. Spend most of your time here.

Use parameter-efficient fine-tuning techniques like LoRA. Instead of updating every weight in the model, you train small adapter matrices that get merged in at inference time. This cuts memory requirements dramatically and makes experimentation cheap enough to iterate quickly.

Finally, evaluate on held-out examples that mirror your real use case, not generic benchmarks. A model that scores well on a public leaderboard can still fail badly on your specific task if you haven't tested against it directly.`,
    featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
  },
  {
    title: "The Node.js Event Loop, Explained Without the Jargon",
    category: "Programming",
    tags: ["nodejs", "javascript", "backend"],
    excerpt: "Forget the diagrams for a second. Here's what actually happens when your server handles a thousand requests at once.",
    content: `Every explanation of the Node.js event loop starts with a diagram full of phases and queues. Useful eventually, but it's not where understanding begins.

Start here instead: Node runs your JavaScript on a single thread. When you call something like a database query, Node doesn't block waiting for the answer. It hands the work off to the system (or a background thread pool) and moves on to the next line of code that's ready to run. When the database responds, Node schedules your callback to run at the next opportunity.

This is why a single Node process can handle thousands of concurrent connections without spawning thousands of threads. The cost of an idle connection waiting on I/O is nearly zero, it's just an entry in a queue, not a thread consuming memory and needing to be scheduled by the OS.

The catch is CPU-bound work. If you run an expensive synchronous calculation, it blocks the single thread completely, and every other request has to wait. This is the one case where Node's model works against you, and it's why CPU-heavy tasks get offloaded to worker threads or separate services in production systems.

Once you internalize "I/O doesn't block, but computation does," the rest of the event loop's phases (timers, I/O callbacks, microtasks) become details you can learn on demand rather than facts to memorize up front.`,
    featuredImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&q=80",
  },
  {
    title: "Cracking Your First Tech Interview: What Actually Matters",
    category: "Career",
    tags: ["career", "interviews", "advice"],
    excerpt: "Forget grinding five hundred problems. Here's what interviewers are really evaluating in your first thirty minutes.",
    content: `After sitting on both sides of the interview table, one pattern stands out: candidates who narrate their thinking out loud consistently outperform candidates who silently produce a correct answer.

Interviewers can't see inside your head. If you stare at a whiteboard for two minutes and then write a perfect solution, the interviewer has no idea how you got there, and no way to help you if you'd gone down a wrong path. Talking through your approach, even a rough one, gives them something to work with and shows you can communicate under pressure, which is the actual job.

Practice problems matter, but breadth beats repetition. Solving fifty distinct problems across arrays, trees, graphs, and dynamic programming teaches you more pattern recognition than solving the same problem type five hundred times.

Don't skip the behavioral round. Technical skill gets you in the door, but "tell me about a time you disagreed with a teammate" questions are how companies filter for people they actually want to work with every day. Prepare two or three real stories in advance, with a clear situation, action, and outcome.

Finally, ask genuine questions at the end. Not to perform interest, but because you're evaluating them too. The quality of your questions is itself a signal.`,
    featuredImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80",
  },
  {
    title: "CSS Grid vs Flexbox: Choosing the Right Tool in 2026",
    category: "Web Development",
    tags: ["css", "frontend", "design"],
    excerpt: "They're not competitors. Here's a simple rule of thumb for picking the right layout model for the job.",
    content: `The Grid-versus-Flexbox debate misses the point: they solve different problems and were designed to be used together.

Flexbox is one-dimensional. It excels at distributing space along a single axis, a row of navigation links, a toolbar of buttons, a card's internal content stack. Ask "am I arranging things in a line?" If yes, reach for Flexbox first.

Grid is two-dimensional. It's built for when you need to control both rows and columns simultaneously, a page layout with a header, sidebar, and main content area, or a photo gallery that needs precise alignment across both axes. Ask "do I need to control rows and columns at once?" If yes, Grid is the better fit.

In real projects, you'll use both in the same page. A Grid layout defines the overall page structure, and Flexbox handles the internal arrangement of content within each grid cell. Treating them as competing technologies leads to contorted one-dimensional Grid usage or deeply nested Flexbox hacks trying to fake two-dimensional behavior.

Learn to recognize the shape of the layout problem in front of you, and the right tool becomes obvious.`,
    featuredImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&q=80",
  },
  {
    title: "Building a Study System That Survives Exam Season",
    category: "Education",
    tags: ["study-tips", "students", "productivity"],
    excerpt: "Most study advice ignores that motivation runs out. Here's a system designed to work even on your worst days.",
    content: `Most study advice assumes you'll always feel motivated enough to follow it. A system that only works when you're inspired isn't a system, it's a hope.

Start with time-boxing instead of goal-boxing. "Study biology for 25 minutes" is a commitment you can keep even on a bad day. "Finish the biology chapter" is a commitment that depends on how the material behaves, and it's easy to abandon halfway through when it turns out to be harder than expected.

Interleave subjects rather than blocking them. Studying the same subject for three hours straight feels productive but leads to shallow, easily-forgotten learning. Switching between two or three subjects in shorter sessions forces your brain to actively retrieve information each time you switch back, which is what actually builds durable memory.

Test yourself before you feel ready. The instinct is to re-read notes until they feel familiar, but recognition is not recall. Closing the book and trying to reconstruct the material from memory, even badly at first, builds the retrieval pathway you'll need in the actual exam.

Protect sleep during exam season specifically. The temptation to trade sleep for extra study hours is strongest right when it's most costly, since memory consolidation happens during sleep. An all-nighter before an exam usually costs more than it gains.`,
    featuredImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80",
  },
  {
    title: "Docker for Developers Who Just Want Their App to Run",
    category: "Technology",
    tags: ["docker", "devops", "backend"],
    excerpt: "You don't need to understand every layer of container internals to get real value from Docker. Start here.",
    content: `"Works on my machine" is the problem Docker was built to eliminate, and you can get most of the benefit without becoming a container internals expert.

A Dockerfile is just a recipe: start from a base image, copy your code in, install dependencies, and specify the command that starts your app. Once written, that recipe produces the exact same environment whether it runs on your laptop, a teammate's machine, or a production server.

The single highest-leverage habit is keeping images small. Use a slim base image, copy only what your app needs, and take advantage of layer caching by installing dependencies before copying your full source code. A bloated image doesn't just waste disk space, it slows down every deploy.

For local development with multiple services, like an app plus a database, docker-compose is worth learning immediately. It lets you define your entire stack in a single YAML file and bring it all up with one command, which eliminates a huge class of onboarding friction for new team members.

You don't need Kubernetes to benefit from Docker. Plenty of production systems run happily on a single server with docker-compose. Reach for orchestration tools only once you actually have the scaling problem they solve.`,
    featuredImage: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&q=80",
  },
  {
    title: "Designing APIs That Don't Make Your Future Self Suffer",
    category: "Programming",
    tags: ["api", "backend", "best-practices"],
    excerpt: "Good API design isn't about following a REST checklist. It's about anticipating the questions your consumers will ask.",
    content: `Every API design decision is a promise to whoever consumes it, including you, six months from now, having forgotten all the context.

Consistency matters more than any individual convention. It genuinely doesn't matter much whether you use camelCase or snake_case for field names, but it matters enormously that you pick one and never deviate. A consumer who has to check the docs for every single endpoint because naming is inconsistent will trust your API less, regardless of how well it performs.

Version from day one, even if you never expect to need it. Adding /v1/ to your routes costs nothing up front and saves you from a painful migration later when you do need to make a breaking change while supporting existing clients.

Error responses deserve as much design attention as success responses. A generic 500 with no detail forces the consumer to guess what went wrong. A structured error with a clear message, an error code, and (when relevant) which field failed validation turns a support ticket into a five-second fix on their end.

Finally, resist the urge to expose your database schema directly through the API. The shape that's convenient for storage is rarely the shape that's convenient for consumption, and coupling the two means every database refactor becomes a breaking API change.`,
    featuredImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
  },
  {
    title: "What I Wish I Knew Before My First Job as a Developer",
    category: "Career",
    tags: ["career", "junior-developer", "advice"],
    excerpt: "The gap between bootcamp projects and your first real job is bigger than anyone tells you. Here's what closes it fastest.",
    content: `Nobody tells you that your first month at a real job will involve more reading other people's code than writing your own, and that this is completely normal.

The codebases you'll work in are nothing like your personal projects. They're larger, older, and full of decisions made under constraints you weren't there for. Resist the urge to judge or rewrite what you don't yet understand. Ask why something was built a certain way before assuming it was built wrong.

Asking questions is a skill, not a weakness. The junior developers who grow fastest aren't the ones who never ask for help, they're the ones who ask specific, well-framed questions after having genuinely tried first. "I tried X and Y, here's what happened, what am I missing?" gets you help faster than "this doesn't work."

Your first pull request will probably get more review comments than you expect. This isn't a judgment of your skill, it's how every codebase maintains quality over time. Learn to receive feedback on code, not as feedback on yourself.

Finally, invest in understanding the systems around your code, not just the code itself: how deployments happen, how logging and monitoring work, how incidents get handled. That context is what separates someone who can write a function from someone a team can actually rely on.`,
    featuredImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
  },
  {
    title: "A Beginner's Mental Model for Understanding Databases",
    category: "Technology",
    tags: ["databases", "sql", "backend"],
    excerpt: "Before you learn syntax, learn the shape of the problem databases solve. Everything else follows from there.",
    content: `Before memorizing SQL syntax, it helps to understand the actual problem a database is solving: storing data reliably while letting many people read and change it at the same time without corrupting it.

Relational databases organize data into tables with defined relationships between them, enforced by the database itself rather than trusted to application code. This is the whole point of foreign keys and constraints: they make certain kinds of bad data literally impossible to insert, which is a much stronger guarantee than "the application checks for this most of the time."

Indexes are the single most impactful thing to understand early. A database without an index on a frequently-queried column has to scan every row to find matches, which is fine for a hundred rows and catastrophic for ten million. An index turns that search into something closer to a dictionary lookup, at the cost of slightly slower writes and more storage.

Transactions solve the problem of partial failure. If a transfer between two bank accounts involves subtracting from one and adding to the other, you need a guarantee that either both happen or neither does. A transaction gives you that guarantee, which is why "just do two separate updates" is a dangerous shortcut in anything involving money or critical state.

Once these ideas click, choosing between database systems becomes a question of which trade-offs fit your problem, not which one is objectively best.`,
    featuredImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&q=80",
  },
];

const commentTemplates = [
  "This is such a clear explanation, thanks for breaking it down!",
  "I've been struggling with this exact concept, this really helped.",
  "Great write-up. Would love to see a follow-up post on advanced patterns.",
  "Bookmarking this for later, solid reference material.",
  "This changed how I think about the problem, appreciate the perspective.",
  "Nicely structured. The examples made it click for me.",
];

const run = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([User.deleteMany({}), Post.deleteMany({}), Comment.deleteMany({})]);

  console.log("Creating users...");
  const createdUsers = [];
  for (const u of users) {
    createdUsers.push(await User.create(u));
  }

  console.log("Creating posts...");
  const createdPosts = [];
  for (let i = 0; i < postsData.length; i++) {
    const author = createdUsers[i % createdUsers.length];
    const post = await Post.create({
      ...postsData[i],
      author: author._id,
      status: "published",
      views: Math.floor(Math.random() * 500) + 20,
    });
    createdPosts.push(post);
  }

  console.log("Creating a couple of drafts for the demo account...");
  await Post.create({
    title: "Untitled Draft: Notes on WebAssembly",
    excerpt: "Rough notes, not ready to publish yet.",
    content: "WebAssembly lets you run near-native-speed code in the browser. Still researching real-world use cases before writing the full post.",
    category: "Technology",
    tags: ["wasm"],
    author: createdUsers[0]._id,
    status: "draft",
  });

  console.log("Creating comments...");
  for (const post of createdPosts) {
    const numComments = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < numComments; i++) {
      const commenter = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      await Comment.create({
        post: post._id,
        author: commenter._id,
        content: commentTemplates[Math.floor(Math.random() * commentTemplates.length)],
      });
    }
  }

  console.log("\nSeed complete!");
  console.log("Demo login -> identifier: demo@blogsphere.com | password: demo1234 (admin role)");
  console.log("Other accounts: ananya / rahulv / sarak, all password demo1234");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
