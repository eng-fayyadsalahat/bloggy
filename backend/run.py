from main import create_app

# ----------------------------------------------------------------------------#
# Launch.
# ----------------------------------------------------------------------------#

# Default port:

app = create_app()


@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Connection"] = "keep-alive"
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Headers', 'GET, POST, PATCH, DELETE, OPTION')
    return response


if __name__ == '__main__':
    app.run(debug=True)
