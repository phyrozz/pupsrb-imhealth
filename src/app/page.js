export default function Home() {
  return (
    <div className="bg-slate-200 h-screen p-10 justify-between flex flex-col">
      <div></div>
      <div>
        <h1 className="text-slate-950 text-2xl font-extralight">Welcome to</h1>
        <h1 className="text-slate-950 text-6xl font-extralight mb-10">PUPSRC-iMHealth!</h1>
      </div>
      <div>
        <p className="text-slate-950 text-xl mb-3 font-bold">Already have an account? <a href="/login" className="underline hover:text-rose-900 transition-all">Sign in</a></p>
        <p className="text-slate-950 text-xl font-bold">...or <a href="" className="underline hover:text-rose-900 transition-all">Create an Account</a></p>
      </div>
    </div>
  )
}
