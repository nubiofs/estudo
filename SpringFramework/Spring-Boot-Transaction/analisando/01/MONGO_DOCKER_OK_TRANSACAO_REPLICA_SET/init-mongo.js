db.createUser({
    user:"sinter",
    pwd:"sinter",
    roles: [
        {
            role:"readWrite",
            db: "admin"
        }
    ]
})