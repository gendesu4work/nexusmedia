import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { GetStarted } from './pages/GetStarted';
import { Opportunity } from './pages/Opportunity';
import { PackagesPage } from './pages/PackagesPage';
import { WhyNexus } from './pages/WhyNexus';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="get-started" element={<GetStarted />} />
          <Route path="opportunity" element={<Opportunity />} />
          <Route path="packages" element={<PackagesPage />} />
          <Route path="why-nexus" element={<WhyNexus />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


