export default function(state, { type, payload }) {
  switch (type) {
  case "LOAD_STORE":
    return payload
  case "DELETE_ALL":
    return payload
  case "UPDATE_SLIDES":
    return { ...state, slides: payload }
  case "UPDATE_SETTINGS":
    return { ...state, settings: payload }
  default:
    return state
  }
}
