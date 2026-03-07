from flask_jwt_extended import get_jwt
from functools import wraps

def role_required(required_role):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            claims = get_jwt()
            if claims.get("role") != required_role:
                return {"error": "Access forbidden: insufficient permissions"}, 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper