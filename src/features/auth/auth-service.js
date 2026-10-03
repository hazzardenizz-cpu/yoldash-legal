import { supabase } from '../../core/supabase.js';

const authRedirect = () =>
  location.protocol.startsWith('http')
    ? `${location.origin}/`
    : 'https://www.getyoldash.com/';

export async function signUpWithEmail({ email, password, businessUserType }) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: authRedirect(),
      data: { business_user_type: businessUserType }
    }
  });
}

export async function signInWithEmail({ email, password }) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function resendSignupVerification(email) {
  return supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: authRedirect() }
  });
}

export async function sendPasswordReset(email) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: authRedirect()
  });
}

export async function updatePassword(password) {
  return supabase.auth.updateUser({ password });
}
