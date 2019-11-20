import Dexie from "dexie"

const db = new Dexie("DB")
db.version(1).stores({
  data: "&name"
})

export default db
