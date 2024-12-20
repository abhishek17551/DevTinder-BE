const adminAuth = (req,res,next) => {
    console.log('Admin auth is getting checked')
    const token = 'firestorm1'
    const isAdminAuthorized = token === 'firestorm'
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized request")
    }
    else {
        next()
    }
}

const userAuth = (req,res,next) => {
    console.log('User auth is getting checked')
    const token = 'firestorm'
    const isAdminAuthorized = token === 'firestorm'
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized request")
    }
    else {
        next()
    }
}


module.exports = {adminAuth,userAuth}