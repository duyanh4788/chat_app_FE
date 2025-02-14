import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { RootStore } from './store/configStore';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './style/scss/home/home.css';
import './style/scss/chatapp/chat_app.css';
import 'antd/dist/antd.css';
import { Chatapp, Home, Password, PrivacyPolicy, TermsOfService, OutTab } from 'router/lazyRouting';
import { AuthContextProvider } from 'app/authContext/AuthContextApi';

export const isDeveloperment = process.env.NODE_ENV === 'development' ? true : false;
const MOUNT_NODE = document.getElementById('root') as HTMLElement;
const ConnectedApp = () => (
  <BrowserRouter basename="/">
    <Provider store={RootStore}>
      <Switch>
        <AuthContextProvider>
          <Route exact path="/">
            <Redirect to="/chatapp-ui" />
          </Route>
          <Route path="/chatapp-ui" exact component={Home} />
          <Route path="/chatapp-ui/chatApp" exact component={Chatapp} />
          <Route path="/chatapp-ui/password" exact component={Password} />
          <Route path="/chatapp-ui/termsOfService" exact component={TermsOfService} />
          <Route path="/chatapp-ui/privacyPolicy" exact component={PrivacyPolicy} />
          <Route path="/chatapp-ui/outTab" exact component={OutTab} />
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
