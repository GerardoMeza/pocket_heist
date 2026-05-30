// this page should be used only as a splash page to decide where a user should be navigated to
// when logged in --> to /heists
// when not logged in --> to /login

import { Clock8 } from "lucide-react"

export default function Home() {
  return (
    <div className="center-content">
      <div className="page-content">
        <h1>
          P<Clock8 className="logo" strokeWidth={2.75} />cket Heist
        </h1>
        <div>Tiny missions. Big office mischief.</div>
        <p>
          Welcome to Pocket Heist — the playful way to assign quick,
          time-boxed missions to your coworkers. Plant a rubber duck on
          someone&apos;s desk, swap the office coffee for decaf, or recover
          the last donut before it disappears. Every heist is a tiny caper
          with a ticking clock.
        </p>
        <p>
          Sign up to start your first job, or log in to check on the crew
          and see which capers are still in play.
        </p>
      </div>
    </div>
  )
}
