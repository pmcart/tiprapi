const connectToDatabase = require('./config/db') // initialize connection
const SECRET_KEY = "secretkey23456";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// simple Error constructor for handling HTTP error codes
function HTTPError(statusCode, message) {
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}

let corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
}



module.exports.healthCheck = async() => {
    await connectToDatabase()
    console.log('Connection successful.')
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Connection successful.' })
    }
}

module.exports.generateToken = (user) => {
    const expiresIn = 24 * 60 * 60;

    const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, {
        expiresIn: expiresIn
    });

    return accessToken;
}

module.exports.errorMessage = (err) => {
    return {
        statusCode: err.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: err.toString()
    }
}

module.exports.signup = async(event) => {
    try {
        let eventBody = JSON.parse(event.body)
        const { User } = await connectToDatabase()
        const user = await User.create(eventBody)
        const accessToken = module.exports.generateToken(user)

        let returnObject = {
            id: user.id,
            access_token: accessToken,
            expires_in: expiresIn
        }
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(returnObject)
        }
    } catch (err) {
        return module.exports.errorMessage()
    }
}

module.exports.create = async(event) => {
    try {
        const name = event.body.name;
        const email = event.body.email;
        console.log(event.body);
        const password = bcrypt.hashSync(event.body.password);

        const { User } = await connectToDatabase()
        const user = await User.create(JSON.parse(event.body))
        return {
            statusCode: 200,
            body: JSON.stringify(user)
        }
    } catch (err) {
        return {
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not create the note.'
        }
    }
}
module.exports.getOne = async(event) => {
    try {
        const { User } = await connectToDatabase()
        const user = await User.findById(event.pathParameters.id)
        if (!user) throw new HTTPError(404, `User with id: ${event.pathParameters.id} was not found`)
        return {
            statusCode: 200,
            body: JSON.stringify(user)
        }
    } catch (err) {
        return {
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: err.message || 'Could not fetch the User.'
        }
    }
}
module.exports.getAll = async() => {
    try {
        const { User } = await connectToDatabase()
        const users = await User.findAll()
        return {
            statusCode: 200,
            body: JSON.stringify(notes)
        }
    } catch (err) {
        return {
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not fetch the users.'
        }
    }
}
module.exports.update = async(event) => {
    try {
        const input = JSON.parse(event.body)
        const { User } = await connectToDatabase()
        const user = await User.findById(event.pathParameters.id)
        if (!user) throw new HTTPError(404, `User with id: ${event.pathParameters.id} was not found`)
        if (input.title) user.title = input.title
        if (input.description) user.description = input.description
        await user.save()
        return {
            statusCode: 200,
            body: JSON.stringify(user)
        }
    } catch (err) {
        return {
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: err.message || 'Could not update the User.'
        }
    }
}
module.exports.destroy = async(event) => {
    try {
        const { User } = await connectToDatabase()
        const user = await User.findById(event.pathParameters.id)
        if (!user) throw new HTTPError(404, `User with id: ${event.pathParameters.id} was not found`)
        await user.destroy()
        return {
            statusCode: 200,
            body: JSON.stringify(user)
        }
    } catch (err) {
        return {
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: err.message || 'Could destroy fetch the User.'
        }
    }
}