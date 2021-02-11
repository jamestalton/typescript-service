import { default as levelup, LevelUp } from 'levelup'
import { default as leveldown } from 'leveldown'
import { default as memdown } from 'memdown'
import { mkdirSync } from 'fs'

// // 1) Create our store
// var db = levelup(leveldown('./mydb'))

// // 2) Put a key & value
// db.put('name', 'levelup', function (err) {
//     if (err) return console.log('Ooops!', err) // some kind of I/O error

//     // 3) Fetch by key
//     db.get('name', function (err, value) {
//         if (err) return console.log('Ooops!', err) // likely the key was not found

//         // Ta da!
//         console.log('name=' + value)
//     })
// })

const dict: Record<string, LevelUp> = {}

export function getCollection(collection: string): LevelUp {
    let collectionDB: LevelUp = dict[collection]
    if (!dict[collection]) {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'test') {
            const path = './data/' + collection
            mkdirSync(path, { recursive: true })
            collectionDB = levelup(leveldown(path))
        } else {
            collectionDB = levelup(memdown())
        }
        dict[collection] = collectionDB
    }
    return collectionDB
}

/* istanbul ignore next */
export function stopDatabase(): Promise<unknown> {
    const promises: Promise<unknown>[] = []
    for (const key in dict) {
        promises.push(dict[key].close())
    }
    return Promise.allSettled(promises)
}
