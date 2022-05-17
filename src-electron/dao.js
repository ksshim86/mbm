import sqlite from 'sqlite3'
import path from 'path'

class Dao {
  constructor() {
    let dbName = ''
    if (process.env.DEBUGGING) {
      dbName = 'mbm-test.db'
    } else {
      dbName = 'mbm.db'
    }

    const dbFilePath = path.resolve('./db/', dbName)
    this.db = new sqlite.Database(
      dbFilePath, sqlite.OPEN_READWRITE || sqlite.OPEN_CREATE, async (err) => {
        if (err) {
          console.error(`err : ${err.message}`)
        } else {
          console.log('Connected to the mbm database.')
        }
      }
    )
  }

  async run (sql, params = []) {
    const res = await new Promise((resolve, reject) => {
      this.db.run(sql, params, (err) => {
        const obj = {}

        if (err) {
          console.log(`Error running sql ${sql}`)
          console.log(err)
          obj.result = false
          obj.message = err
          reject(obj)
        } else {
          console.log(`Running sql ${sql}`)
          console.log(`params : ${params}`)
          obj.result = true
          resolve(obj)
        }
      })
    })

    return res
  }

  async get (sql, params = []) {
    const res = await new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        const obj = {}

        if (err) {
          console.log(`Error running sql ${sql}`)
          console.log(err)

          obj.result = false
          reject(obj)
        } else {
          console.log(`Running sql ${sql}`)
          console.log(`params : ${params}`)
          console.log('=============== rows ===============')
          console.log(row)
          console.log('====================================')
          obj.row = row

          obj.result = true
          resolve(obj)
        }
      })
    })

    return res
  }

  async all (sql, params = []) {
    const res = await new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        const obj = {}

        if (err) {
          console.log(`Error running sql ${sql}`)
          console.log(err)

          obj.result = false
          reject(obj)
        } else {
          console.log(`Running sql ${sql}`)
          console.log(`params : ${params}`)
          console.log('=============== rows ===============')
          rows.forEach((row) => console.log(row))
          console.log('====================================')
          obj.rows = rows

          obj.result = true
          resolve(obj)
        }
      })
    })

    return res
  }
}

export default Dao
