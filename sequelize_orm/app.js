const db = require('./db');
const { Movie, Person } = db.models;

// async IIFE
(async () => {
    await db.sequelize.sync({
        force: true
    });
    try {
        await db.sequelize.authenticate();
        const movieInstances = await Promise.all([
            Movie.create({
                title: 'Toy Story',
                runtime: 81,
                releaseDate: '1995-11-22',
                isAvailableOnVHS: true,
            }),
            Movie.create({
                title: 'The Incredibles',
                runtime: 115,
                releaseDate: '2004-04-14',
                isAvailableOnVHS: true,
            })
        ]);

        const moviesJSON = movieInstances.map(movie => movie.toJSON())
        console.table(moviesJSON)

        const personInstances = await Promise.all([
            Person.create({
                firstName: 'Tom',
                lastName: 'Hanks'
            }),
            Person.create({
                firstName: 'Denzell',
                lastName: 'Washington'
            }),
        ])

        const personJSON = personInstances.map(person => person.toJSON())
        console.table(personJSON)
        
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            const errors = error.errors.map(err => err.message)
            console.error("Validation errors: ", errors)
        } else {
            throw error
        }
        console.error('Error connecting to the database: ', error);
    }
})();