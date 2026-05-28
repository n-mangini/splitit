import { JoinEventClient } from './join-event-client'

export default async function JoinEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>
  searchParams: Promise<{ step?: string }>
}) {
  const [{ code }, { step }] = await Promise.all([params, searchParams])

  return <JoinEventClient code={code} step={step} />
}
