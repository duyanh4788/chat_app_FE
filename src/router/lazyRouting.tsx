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
