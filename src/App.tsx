import './App.css';
import { HashRouter } from 'react-router-dom'
import MRouter from './router'
import { Provider } from 'react-redux'
import { store, persiststore } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persiststore}>
        <div style={{ height: '100%' }}>
          <HashRouter>
            <MRouter></MRouter>
          </HashRouter>
        </div>
      </PersistGate>
    </Provider>

  );
}

export default App;
