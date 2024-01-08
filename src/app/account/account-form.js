'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Avatar from './avatar';

export default function AccountForm({ session }) {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState(null)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const user = session?.user

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl shadow-lg py-10 px-5 w-full md:w-1/2 flex flex-wrap flex-row">
      <Avatar
        uid={user.id}
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url)
          updateProfile({ fullname, username, website, avatar_url: url })
        }}
      />
      <div className="w-full">
        <label htmlFor="email" className="block uppercase tracking-wide text-slate-200 text-xs font-bold mb-2">Email</label>
        <input id="email" className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" value={session?.user.email} disabled />
      </div>
      <div className="w-full md:w-1/2 pr-0 md:pr-5">
        <label htmlFor="fullName" className="block uppercase tracking-wide text-slate-200 text-xs font-bold mb-2">Full Name</label>
        <input
          id="fullName"
          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white transition-all"
          type="text"
          value={fullname || ''}
          onChange={(e) => setFullname(e.target.value)}
        />
      </div>
      <div className="w-full md:w-1/2">
        <label htmlFor="username" className="block uppercase tracking-wide text-slate-200 text-xs font-bold mb-2">Username</label>
        <input
          id="username"
          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white transition-all"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="w-full">
        <label htmlFor="website" className="block uppercase tracking-wide text-slate-200 text-xs font-bold mb-2">Website</label>
        <input
          id="website"
          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white transition-all"
          type="url"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="flex flex-row w-full gap-3 pt-8 justify-between">
        <button
          className="px-5 py-2 rounded-md bg-teal-500 hover:bg-teal-600 transition-all shadow-xl"
          onClick={() => updateProfile({ fullname, username, website, avatar_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
        <form action="/auth/signout" method="post">
          <button className="px-5 py-2 rounded-md bg-red-800 hover:bg-red-900 transition-all shadow-xl" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}