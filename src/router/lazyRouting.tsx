import { lazyLoad } from './loadable';
import { LoaderFallBack } from 'utils/Apploading';

export const Home = lazyLoad(
  () => import('app'),
  module => module.Home,
  LoaderFallBack(),
);

export const Chatapp = lazyLoad(
  () => import('app'),
  module => module.Chatapp,
  LoaderFallBack(),
);

export const Password = lazyLoad(
  () => import('app'),
  module => module.PassWord,
  LoaderFallBack(),
);

export const TermsOfService = lazyLoad(
  () => import('app'),
  module => module.TermsOfService,
  LoaderFallBack(),
);

export const PrivacyPolicy = lazyLoad(
  () => import('app'),
  module => module.PrivacyPolicy,
  LoaderFallBack(),
);

export const OutTab = lazyLoad(
  () => import('app'),
  module => module.OutTab,
  LoaderFallBack(),
);
