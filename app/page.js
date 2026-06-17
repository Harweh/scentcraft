import connectDB from "../lib/mongodb"

export default async function Home() {
  await connectDB ()
  return(
     <main>
      <h1>ScentCraft — DB Connected ✅</h1>
    </main>
  )
}