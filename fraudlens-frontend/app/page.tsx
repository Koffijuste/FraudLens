'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/api'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    const token = getToken()
    router.replace(token ? '/dashboard' : '/login')
  }, [router])
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)' }}>
      <div style={{ width:40, height:40, borderRadius:'50%', border:'3px solid var(--blue-100)', borderTopColor:'var(--primary)', animation:'spinRing 0.8s linear infinite' }} />
    </div>
  )
}
