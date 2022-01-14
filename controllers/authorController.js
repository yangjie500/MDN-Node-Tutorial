const Author = require("../models/author");
const Book = require("../models/book")
const async = require("async")

const { body, validationResult } = require('express-validator')

// Display list of all Authors.
exports.author_list = function(req, res) {
  Author.find({})
    .sort([["family_name", 1]])
    .exec(function(err, list_authors) {
      if (err) return next(err)
      res.render("author_list", { title: "Author List", author_list: list_authors });
    })
}

// Display detail page for specific Author.
exports.author_detail = (req, res) => {
  async.parallel({
    author: function(callback) {
      Author.findById(req.params.id)
        .exec(callback)
    },
    authors_books: function(callback) {
      Book.find({"author": req.params.id})
        .exec(callback)
    }
  }, function(err, results) {
    if (err) return next(err)
    if (results.author == null) {
      const err = new Error ("Author not found")
      err.status = 404
      next(err)
    }

    res.render('author_detail', {
      title: 'Author Detail',
      author: results.author,
      author_books: results.authors_books
    })
  })
}

// Display Author create form on GET.
exports.author_create_get = (req, res) => {
  res.render('author_form', { title: 'Create Author' })
}

// Handle Author create on POST.
exports.author_create_post = [
  // Validate and sanitize fields.
  body('first_name').trim().isLength({ min: 1 }).escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters'),
  
  body('family_name').trim().isLength({ min: 1 }).escape()
    .withMessage('Family name must be specified')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters'),
  
  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true }).isISO8601().toDate(),

  body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true }).isISO8601().toDate(),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract the validation errors from a request.
    const error = validationResult(req)
    console.log(error)

    if (!error.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render('author_form', { title: 'Create Author', author: req.body, errors: error.array() })
      return
    } else {
      // Data from from is valid
      const author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death
      })

      author.save((err) => {
        if (err) return next(err)
        // Successsful - redirect to new author record.
        res.redirect(author.url)
      })
    }
  }
]

// Display Author delete form on GET.
exports.author_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author delete GET");
}

// Handle Author delete on POST
exports.author_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author delete POST");
}

// Display Author update form on GET
exports.author_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update GET");
}

// Handle Author update on POST
exports.author_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update POST")
}






