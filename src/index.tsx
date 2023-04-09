import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { RootStore } from './store/configStore';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './style/scss/home/home.css';
import './style/scss/chatapp/chat_app.css';
import 'antd/dist/antd.css';
import { Chatapp, Home, Password, PrivacyPolicy, TermsOfService, OutTab } from 'router/lazyRouting';
import { AuthContextProvider } from 'app/authContext/AuthContextApi';

export const isDeveloperment = process.env.NODE_ENV === 'development' ? true : false;

const MOUNT_NODE = document.getElementById('root') as HTMLElement;
const ConnectedApp = () => (
  <BrowserRouter>
    <Provider store={RootStore}>
      <Switch>
        <AuthContextProvider>
          <Route path="/" exact component={Home} />
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
