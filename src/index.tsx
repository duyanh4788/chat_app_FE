import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { RootStore } from './store/configStore';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './style/scss/chat_app.css';
import './style/scss/main_form.css';
import 'antd/dist/antd.css';
import { AuthContextProvider } from 'app/components/AuthContextApi';
import {
  Chatapp,
  MainRomChat,
  Password,
  PrivacyPolicy,
  TermsOfService,
  OutTab,
} from 'router/lazyRouting';

export const isDeveloperment = process.env.NODE_ENV === 'development' ? true : false;

const MOUNT_NODE = document.getElementById('root') as HTMLElement;
const ConnectedApp = () => (
  <BrowserRouter>
    <Provider store={RootStore}>
      <Switch>
        <AuthContextProvider>
          <Route path="/" exact component={MainRomChat} />
          <Route path="/chatApp" exact component={Chatapp} />
          <Route path="/password" exact component={Password} />
          <Route path="/termsOfService" exact component={TermsOfService} />
          <Route path="/privacyPolicy" exact component={PrivacyPolicy} />
          <Route path="/outTab" exact component={OutTab} />
        </AuthContextProvider>
      </Switch>
    </Provider>
  </BrowserRouter>
);

const render = () => {
  ReactDOM.render(<ConnectedApp />, MOUNT_NODE);
};

if (module.hot) {
  module.hot.accept(() => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render();
  });
}

render();
