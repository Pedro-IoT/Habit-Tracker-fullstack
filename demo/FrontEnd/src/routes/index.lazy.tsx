import { createLazyFileRoute } from '@tanstack/react-router';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import LandingPage from '@/pages/Landing/LandingPage';

export const Route = createLazyFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <LandingPage />
      <Footer />
    </>
  );
}
