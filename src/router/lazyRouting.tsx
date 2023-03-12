import { lazyLoad } from './loadable';
import { LoaderFallBack } from 'store/utils/Apploading';

export const MainRomChat = lazyLoad(
  () => import('app'),
  module => module.MainRomChat,
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
