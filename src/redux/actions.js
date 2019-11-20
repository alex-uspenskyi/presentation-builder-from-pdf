import db from "../db"

export const loadStore = () => {
  return async dispatch => {
    const slides = await db.data.get("slides")
    const settings = await db.data.get("settings")
    dispatch({
      type: "LOAD_STORE",
      payload: {
        slides: slides ? slides.value : null,
        settings: settings ? settings.value : { name: "", description: "" }
      }
    })
  }
}

export const deleteAll = () => {
  return async dispatch => {
    await db.data.clear()
    dispatch({
      type: "DELETE_ALL",
      payload: {
        settings: { name: "", description: "" },
        slides: null
      }
    })
  }
}

export const updateSlides = slides => {
  return async dispatch => {
    await db.data.put({ name: "slides", value: slides })

    dispatch({
      type: "UPDATE_SLIDES",
      payload: slides
    })
  }
}

export const updateSettings = settings => {
  return async dispatch => {
    dispatch({
      type: "UPDATE_SETTINGS",
      payload: settings
    })
  }
}
