import AuthForm from "@/components/auth_form/AuthForm";
import Header from "@/components/shared/header/Header";

export default function AuthorizationPage() {
    return (
        <main className='__fullscreen __centerall'>
            <Header />
            <AuthForm />
        </main>
    );
}
