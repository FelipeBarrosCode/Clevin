import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import supabase from '../supabase/supabase'
import { useEffect } from 'react'

const AuthForm = ({currView}) => {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        window.location.href = '/dashboard';
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <Auth 
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
      redirectTo={`${import.meta.env.VITE_DOMAIN}${currView === 'sign_up' ? '/signup' : '/login'}`}
      width={500}
      height={500}
      supabaseClient={supabase} 
      appearance={{ theme: ThemeSupa }} 
    />
  )
}

export default AuthForm;