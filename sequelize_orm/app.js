const db = require('./db');
const {
    Movie,
    Person
} = db.models;
// const {
//     Op
// } = db.Sequelize

// async IIFE
(async () => {
    await db.sequelize.sync({
        force: true
    });
    try {
        await db.sequelize.authenticate();
        const movieInstances = await Promise.all([
            // CREATE
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
            }),
            Movie.build({
                title: 'Toy Story 3',
                runtime: 103,
                releaseDate: '2010-06-18',
            }).save(),

        ]);
        const moviesJSON = movieInstances.map(movie => movie.toJSON())
        console.table(moviesJSON)

        // READ
        const movieById = await Movie.findByPk(1)
        const movieByRunTime = await Movie.findOne({
            where: {
                runtime: 115
            }
        })
        const allMovies = await Movie.findAll()
        const moviesSubSet = await Movie.findAll({
            attributes: ['id', 'title'],
            // where: {
            //     releaseDate: {
            //         [Op.gte]: '2004-01-01'
            //     },
            // }
            order: [
                ['title', "DESC"]
            ]
        })
        console.table(movieById.toJSON())
        console.log(movieByRunTime.toJSON())
        console.table(allMovies.map(movie => movie.toJSON()))
        console.table(moviesSubSet.map(movie => movie.toJSON()))

        // UPDATE
        const toyStory3 = await Movie.findByPk(3)
        toyStory3.isAvailableOnVHS = true
        await toyStory3.save()

        await toyStory3.update({
            title: 'Toy Story 3 (2004)',
            runtime: 90,
            releaseDate: '2010-06-16'
        }, {
            // fields to be updated
            fields: ['title', 'isAvailableOnBlueRay']
        })

        console.log(toyStory3.get({
            plain: true
        }))

        // DELETE
        await toyStory3.destroy()

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
        // console.table(personJSON)

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