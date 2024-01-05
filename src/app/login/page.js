import LoginForm from "../components/login_form";

export default function LoginPage() {
  return (
    <div className="bg-slate-200 h-screen relative">
      <div>
        <h1 className="text-6xl text-slate-400 font-extralight pl-3 pt-10">PUPSRC-iMHealth</h1>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <LoginForm />
      </div>
    </div>
  )
}
