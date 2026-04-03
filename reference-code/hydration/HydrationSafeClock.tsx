import { useEffect, useState } from 'react'

export function HydrationSafeClock({ initialTime }: { initialTime: string }) {
  const [time, setTime] = useState(initialTime)

  useEffect(() => {
    const id = window.setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => window.clearInterval(id)
  }, [])

  return <p>当前时间：{time}</p>
}
