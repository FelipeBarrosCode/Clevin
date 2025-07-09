import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import supabase from '../supabase/supabase'


const AuthForm = ({currView}) => (
  <Auth 
    providers={['google', 'github', 'gitlab']}
    socialLayout="horizontal"
    socialButtonSize="large"
    socialColors={true}
    socialButtonVariant="icon"
    socialIconSize={24}
    socialIconVariant="line"
    socialIconColor="white"
    socialIconAlign="left"
    socialIconSpacing={10}
    socialIconPadding={10}
    view={currView}
    socialIconBorderRadius={10}
    socialIconBorderColor="white"
    socialIconBorderWidth={1}
    socialIconBorderStyle="solid"
    redirectTo={`${import.meta.env.VITE_DOMAIN}/dashboard`}
    width={500}
    height={500}
    supabaseClient={supabase} 
    appearance={{ theme: ThemeSupa }} 
  />
)

export default AuthForm;