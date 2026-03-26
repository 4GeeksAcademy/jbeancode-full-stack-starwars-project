export const initialStore=()=>{
  return{
    message: null,
    user: {
      favorites: {
        characters: [],
        planets: []
      }
    }
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case 'set_user_favorites':
      return {
        ...store,
        user: {
          ...store.user,
          favorites: action.payload
        }
      };

    default:
      throw Error('Unknown action.');
  }
}
