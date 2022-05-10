import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { RootStore } from './store/configStore';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './style/scss/chat_app.css';
import './style/scss/main_form.css';
import 'antd/dist/antd.css';
import { AuthContextProvider } from 'app/components/AuthContextApi';
import { Chatapp, MainRomChat } from 'router/lazyRouting';

const MOUNT_NODE = document.getElementById('root') as HTMLElement;
const ConnectedApp = () => (
  <BrowserRouter>
    <Provider store={RootStore}>
      <Switch>
        <AuthContextProvider>
          <Route path="/" exact component={MainRomChat} />
          <Route path="/chatApp" exact component={Chatapp} />
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
