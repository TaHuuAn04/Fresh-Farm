import NotFoundComp from '@/components/not-found'
import { Suspense } from 'react'
 
export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundComp />
     </Suspense>
  )
}