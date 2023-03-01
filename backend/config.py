import os


class Config:
    DEBUG = True
    SECRET_KEY = os.urandom(32)

    @staticmethod
    def static_path() -> str:
        path = os.path.join(os.getcwd(), "/static/")
        UPLOAD_FOLDER = os.path.join(path, 'images')
        return UPLOAD_FOLDER


