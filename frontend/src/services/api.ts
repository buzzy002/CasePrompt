export async function sendDetectiveAction(action: string) {
  const response = await fetch('http://localhost:3000/api/investigation/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action })
  })

  if (!response.ok) {
    throw new Error(`Erreur réseau : ${response.status}`)
  }
  return await response.json()
}