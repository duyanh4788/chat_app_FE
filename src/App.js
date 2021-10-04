import { MainRomChat } from "./pages/MainRomChat";
import 'antd/dist/antd.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Chatapp } from "./pages/Chatapp";

function App() {
  return (
    <BrowserRouter>
      <Switch >
        <Route path="/" exact component={MainRomChat} />
        <Route path="/chatapp" exact component={Chatapp} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
