'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
// import Avatar from './avatar';
import { motion } from 'framer-motion'
import { Card, CardBody, CardHeader, Input, Button } from '@nextui-org/react';

export default function AccountForm({ session }) {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState(null)
  const [username, setUsername] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const user = session?.user

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
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

  async function updateProfile({ username, avatar_url }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id,
        full_name: fullname,
        username,
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
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: [0, 0.71, 0.2, 1.01]
      }}
    >
      <Card isBlurred>
        <CardHeader>
          <h1 className="text-3xl font-bold mt-3">My Account</h1>
          {/* <Avatar
            uid={user.id}
            url={avatar_url}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url)
              updateProfile({ fullname, username, avatar_url: url })
            }}
          /> */}
        </CardHeader>
        <CardBody>
          <div className="w-full mb-5">
            <label htmlFor="email" className="block uppercase tracking-wide text-xs font-bold mb-2">Email</label>
            <Input id="email" type="text" value={session?.user.email} disabled />
          </div>
          <div className="w-full mb-5">
            <label htmlFor="fullName" className="block uppercase tracking-wide text-xs font-bold mb-2">Full Name</label>
            <Input
              id="fullName"
              type="text"
              value={fullname || ''}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div className="w-full">
            <label htmlFor="username" className="block uppercase tracking-wide text-xs font-bold mb-2">Username</label>
            <Input
              id="username"
              type="text"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-row w-full gap-3 pt-8 justify-between">
            <Button
              variant="shadow"
              color="primary"
              onClick={() => updateProfile({ fullname, username, avatar_url })}
              disabled={loading}
            >
              {loading ? 'Loading ...' : 'Update'}
            </Button>
            <form action="/auth/signout" method="post">
              <Button variant="shadow" color="danger" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  )
}