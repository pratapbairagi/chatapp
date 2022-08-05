
const sessions = new Map()

export function findSession(id){
    return sessions.get(id)
}

export function findAllSessions(){
    return [...sessions.values()]
}

export function saveSession(id, session){
    return sessions.set(id, session)
}