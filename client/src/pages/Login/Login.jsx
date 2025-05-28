import { SignIn } from '@clerk/clerk-react'

const Login = () => {
  return (
    <div className='bg-[#4F39F6] min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-md mx-20'>
        <SignIn signUpUrl='/signup' forceRedirectUrl={'/'}/>
      </div>
    </div>
  )
}

export default Login