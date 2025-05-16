import { SignUp } from '@clerk/clerk-react'

const Signup = () => {
  return (
    <div className='bg-[#4F39F6] min-h-screen flex items-center justify-center'>
        <div className='w-full max-w-md'>
            <SignUp signInUrl='/login' forceRedirectUrl={'/'}/>
        </div>
    </div>
  )
}

export default Signup