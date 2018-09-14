import { initStore } from 'react-stateful';

const store = {
  initialState: {
    page: '',
  },
  actions: {
  }
};

export const {
  Provider,
  Consumer,
  actions,
  getState,
  connect,
  subscribe
} = initStore(store);
