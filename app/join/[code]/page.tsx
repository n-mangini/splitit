import { JoinEventClient } from './join-event-client'

export default async function JoinEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>
  searchParams: Promise<{ access?: string }>
}) {
  const [{ code }, { access }] = await Promise.all([params, searchParams])

  return <JoinEventClient code={code} accessParam={access} />
}
